import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

import urlRouter from "./routes/url.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("MONGO_URI is missing. Add it to your .env file.");
  process.exit(1);
}

// Middleware
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "URL shortener API is running",
    createShortURL: "POST /url",
    redirect: "GET /url/:shortId",
    watchList: "GET /url/:shortId/watch-list",
  });
});

app.use("/url", urlRouter);

// Connect MongoDB
console.log("Connecting to MongoDB...");

mongoose
  .connect(MONGO_URI, {
    serverSelectionTimeoutMS: 5000,
  })
  .then(() => {
    console.log("MongoDB connected successfully");

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    }).on("error", (error) => {
      console.error("Server failed to start:", error.message);
      process.exit(1);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  });
