import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

// ROUTES (YOUR PART)
import sosRoutes from "./routes/sosRoutes.js";
import locationRoutes from "./routes/locationRoutes.js";
import trackingRoutes from "./routes/trackingRoutes.js";

// SOCKET
import socketHandler from "./sockets/socketHandler.js";
import "./cron/tripCron.js";
import mapRoutes from "./routes/mapRoutes.js";
import tripRoutes from "./routes/tripRoutes.js";
import reportRoutes from './routes/reportRoutes.js';

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Test route
app.get("/", (req, res) => {
    res.send("SafeSphere API Running...");
});


// 🔥 YOUR ROUTES
app.use("/api/sos", sosRoutes);
app.use("/api/location", locationRoutes);
app.use("/api/tracking", trackingRoutes);


// ❗ IMPORTANT: Create HTTP server for socket
const server = http.createServer(app);

// ⚡ SOCKET.IO SETUP
const io = new Server(server, {
    cors: {
        origin: "*"
    }
});

socketHandler(io);


// ERROR MIDDLEWARE (keep at last)
app.use("/api/map", mapRoutes);
app.use("/api/trip", tripRoutes);
app.use("/api/reports", reportRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// ❗ USE server.listen (NOT app.listen)
server.listen(PORT, () =>
    console.log(`Server running on port ${PORT}`)
);


// import express from "express";
// import dotenv from "dotenv";
// import connectDB from "./config/db.js";
// import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

// dotenv.config();
// connectDB();

// const app = express();

// app.use(express.json());

// app.get("/", (req, res) => {
//     res.send("SafeSphere API Running...");
// });

// // Routes will be added here by all members

// app.use(notFound);
// app.use(errorHandler);

// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () =>
//     console.log(`Server running on port ${PORT}`)
// );