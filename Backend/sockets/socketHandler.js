const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log("User Connected:", socket.id);

    socket.on("join", (userId) => {
      socket.join(userId);
    });

    // Join tracking room
    socket.on("joinTracking", (trackingId) => {
      socket.join(trackingId);
      console.log(`User joined room: ${trackingId}`);
    });

    // Send live location
    socket.on("sendLocation", ({ trackingId, location }) => {
      io.to(trackingId).emit("receiveLocation", location);
    });

    // SOS real-time alert (optional but powerful)
    socket.on("sosTriggered", (data) => {
      io.emit("sosAlert", data);
    });

    socket.on("disconnect", () => {
      console.log("User Disconnected:", socket.id);
    });
  });
};

export default socketHandler;