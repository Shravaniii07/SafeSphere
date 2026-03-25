const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/sos", require("./routes/sosRoutes"));
app.use("/api/location", require("./routes/locationRoutes"));
app.use("/api/tracking", require("./routes/trackingRoutes"));

module.exports = app;