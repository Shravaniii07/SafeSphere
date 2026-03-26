import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import "./cron/tripCron.js";
import mapRoutes from "./routes/mapRoutes.js";
import tripRoutes from "./routes/tripRoutes.js";
import reportRoutes from './routes/reportRoutes.js';

dotenv.config();
connectDB();

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.send("SafeSphere API Running...");
});

// Routes will be added here by all members

app.use("/api/map", mapRoutes);
app.use("/api/trip", tripRoutes);
app.use("/api/reports", reportRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
    console.log(`Server running on port ${PORT}`)
);