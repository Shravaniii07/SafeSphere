import { useState, useEffect } from "react";
import {
  Users,
  CheckCircle2,
  Megaphone,
  Clock,
  Send,
  Search,
  Trash2,
} from "lucide-react";

import {
  Card,
  CardHeader,
  CardBody,
  Button,
  Badge,
  Skeleton,
  EmptyState,
} from "../components/UI";

import toast from "react-hot-toast";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";

/* ───────── Helpers ───────── */
function formatTimeAgo(timestamp) {
  const date = new Date(timestamp).getTime();
  const diff = Date.now() - date;
  const mins = Math.floor(diff / 60000);

  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;

  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  if (days === 1) return "Yesterday";

  return `${days}d ago`;
}

/* ───────── Component ───────── */
export default function AdminPanel() {
  const { user: currentAdmin } = useAuth();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Notification
  const [notifTitle, setNotifTitle] = useState("");
  const [notifMessage, setNotifMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sentNotifs, setSentNotifs] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  /* ───────── Fetch Data ───────── */
  const fetchUsers = async () => {
    try {
      const res = await api.get("/api/admin/users");

      const formatted = res.data.map((u) => ({
        ...u,
        initials:
          u.name?.split(" ").map((n) => n[0]).join("").toUpperCase() || "??",
        status: u.isVerified ? "Active" : "Unverified",
        sv: u.isVerified ? "success" : "warning",
      }));

      setUsers(formatted);
    } catch (err) {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const fetchAlerts = async () => {
    try {
      const res = await api.get("/api/admin/alerts");
      setSentNotifs(res.data);
    } catch {
      console.log("Alert fetch failed");
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchAlerts();
  }, []);

  /* ───────── Stats ───────── */
  const stats = [
    {
      icon: Users,
      label: "Total Users",
      value: users.length,
      color: "text-accent",
    },
    {
      icon: CheckCircle2,
      label: "Verified Users",
      value: users.filter((u) => u.isVerified).length,
      color: "text-success",
    },
  ];

  /* ───────── Filters ───────── */
  const filtered = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
  );

  /* ───────── Actions ───────── */
  const handleDeleteUser = async (user) => {
    if (!window.confirm(`Delete ${user.name}?`)) return;

    try {
      await api.delete(`/api/admin/user/${user._id}`);
      toast.success("User removed");
      fetchUsers();
    } catch {
      toast.error("Failed to delete user");
    }
  };

  const handleSendNotification = async () => {
    if (!notifTitle || !notifMessage) {
      toast.error("Fill all fields");
      return;
    }

    setSending(true);

    try {
      await api.post("/api/admin/alert", {
        title: notifTitle,
        message: notifMessage,
        type: "ALERT",
      });

      toast.success("Broadcast sent 🚀");

      setNotifTitle("");
      setNotifMessage("");

      fetchAlerts();
    } catch (err) {
      toast.error("Failed to send alert");
    } finally {
      setSending(false);
    }
  };

  /* ───────── UI ───────── */
  return (
    <div className="space-y-8 stagger-children">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-heading font-bold text-text">Admin Panel</h1>
        <p className="text-muted text-sm">
          Manage users & send alerts
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        {stats.map((s, i) => (
          <Card key={i}>
            <CardBody>
              <div className="flex justify-between items-center">
                <div>
                  <p className={`text-2xl font-heading font-bold ${s.color}`}>{s.value}</p>
                  <p className="text-xs text-muted">{s.label}</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-overlay flex items-center justify-center">
                  <s.icon className={`w-5 h-5 ${s.color}`} />
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Notification Broadcast */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Megaphone className="w-4 h-4 text-warning" />
            <span className="font-heading font-semibold text-text">Broadcast Notification</span>
          </div>
        </CardHeader>
        <CardBody className="space-y-4">
          <input
            placeholder="Notification title..."
            value={notifTitle}
            onChange={(e) => setNotifTitle(e.target.value)}
            className="w-full px-4 py-3 border border-border rounded-xl bg-surface2 text-text text-sm transition-all duration-200 hover:border-muted/30 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none placeholder-[#A8B2C1]/40"
          />

          <textarea
            placeholder="Enter your message..."
            value={notifMessage}
            onChange={(e) => setNotifMessage(e.target.value)}
            rows={3}
            className="w-full px-4 py-3 border border-border rounded-xl bg-surface2 text-text text-sm resize-y transition-all duration-200 hover:border-muted/30 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none placeholder-[#A8B2C1]/40"
          />

          <Button onClick={handleSendNotification} disabled={sending} isLoading={sending}>
            <Send className="w-4 h-4" />
            Send Broadcast
          </Button>

          {/* History */}
          {sentNotifs.length > 0 && (
            <div>
              <button onClick={() => setShowHistory(!showHistory)} className="flex items-center gap-2 text-sm text-muted hover:text-text transition-colors cursor-pointer">
                <Clock className="w-4 h-4" />
                History ({sentNotifs.length})
              </button>

              {showHistory && (
                <div className="mt-3 space-y-2">
                  {sentNotifs.map((n) => (
                    <div key={n._id} className="border border-border p-3 rounded-xl bg-overlay">
                      <p className="font-heading font-semibold text-text text-sm">{n.title}</p>
                      <p className="text-xs text-muted mt-1">{n.message}</p>
                      <p className="text-xs text-muted/60 font-mono mt-1">{formatTimeAgo(n.createdAt)}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </CardBody>
      </Card>

      {/* Users */}
      <Card>
        <CardHeader>
          <span className="font-heading font-semibold text-text">Users</span>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-overlay border border-border rounded-xl">
            <Search className="w-3.5 h-3.5 text-muted/60" />
            <input
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent border-none text-sm text-text placeholder-[#A8B2C1]/40 outline-none w-32"
            />
          </div>
        </CardHeader>

        <CardBody>
          {loading ? (
            <div className="space-y-3">
              <Skeleton className="h-12 w-full" count={3} />
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState icon={Users} title="No users found" />
          ) : (
            <div className="space-y-1">
              {filtered.map((u) => (
                <div
                  key={u._id}
                  className="flex justify-between items-center p-4 rounded-xl hover:bg-overlay transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#E63946] to-[#c1121f] flex items-center justify-center text-white text-sm font-heading font-semibold">
                      {u.initials}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-text">{u.name}</p>
                      <p className="text-xs text-muted">{u.email}</p>
                    </div>
                  </div>

                  <div className="flex gap-2 items-center">
                    <Badge variant={u.sv} dot>{u.status}</Badge>
                    <Button
                      size="sm"
                      variant="outline-danger"
                      onClick={() => handleDeleteUser(u)}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}