import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import http from "http";
import path from "path";
import { fileURLToPath } from "url";
import helmet from "helmet";
import compression from "compression";
import { Server } from "socket.io";
import connectDB from "./config/db.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import socketHandler from "./sockets/socketHandler.js";
import "./cron/tripCron.js";

// Routes
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import sosRoutes from "./routes/sosRoutes.js";
import locationRoutes from "./routes/locationRoutes.js";
import trackingRoutes from "./routes/trackingRoutes.js";
import mapRoutes from "./routes/mapRoutes.js";
import tripRoutes from "./routes/tripRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import incidentRoutes from "./routes/incidentRoutes.js";
import seedAdmin from "./config/adminSeed.js";

// ES Module path fix
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize App & Environment
dotenv.config();
connectDB().then(() => {
    seedAdmin();
});

const app = express();

// ✅ PRODUCTION MIDDLEWARE
app.use(helmet({
    contentSecurityPolicy: false, // Set to false if you have trouble with Leaflet/External maps
}));
app.use(compression());

const server = http.createServer(app);

// ✅ SOCKET.IO (DYNAMIC ORIGIN)
const io = new Server(server, {
    cors: {
        origin: [process.env.FRONTEND_URL, "http://localhost:5173", "http://localhost:5174"].filter(Boolean),
        credentials: true,
    },
});

// ✅ CORS (DYNAMIC ORIGIN)
app.use(cors({
    origin: [process.env.FRONTEND_URL, "http://localhost:5173", "http://localhost:5174"].filter(Boolean),
    credentials: true,
}));


// Middleware
app.use(express.json());
app.use(cookieParser());

// ✅ Make io available in routes
app.use((req, res, next) => {
    req.io = io;
    next();
});

// ✅ Initialize socket handler
socketHandler(io);

// --- API ROUTES ---

// Test route
app.get("/", (req, res) => {
    res.send("SafeSphere API Running...");
});


// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/sos", sosRoutes);
app.use("/api/location", locationRoutes);
app.use("/api/tracking", trackingRoutes);
app.use("/api/map", mapRoutes);
app.use("/api/trip", tripRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/incidents", incidentRoutes);

// --- STATIC FILES FOR PRODUCTION ---
if (process.env.NODE_ENV === "production") {
    const frontendPath = path.join(__dirname, "../frontend/dist");
    app.use(express.static(frontendPath));

    app.use((req, res, next) => {
        if (!req.path.startsWith("/api")) {
            res.sendFile(path.resolve(frontendPath, "index.html"));
        } else {
            next();
        }
    });
}


// --- ERROR HANDLING ---
app.use(notFound);
app.use(errorHandler); // Trigger nodemon restart

// --- START SERVER ---
const PORT = process.env.PORT || 5000;

// NOTE: Use server.listen, not app.listen, to support Socket.io
server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
