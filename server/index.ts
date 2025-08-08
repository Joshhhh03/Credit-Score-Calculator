import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import {
  saveUserData,
  getUserData,
  updateCreditScore,
  getCreditHistory,
  calculateCreditScore
} from "./routes/user-data";
import {
  submitRating,
  getRatingStats,
  getUserRatings,
  updateRating,
  getTestimonials
} from "./routes/ratings";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // User data API routes
  app.post("/api/users/data", saveUserData);
  app.get("/api/users/:userId/data", getUserData);
  app.post("/api/users/:userId/credit-score", updateCreditScore);
  app.get("/api/users/:userId/credit-history", getCreditHistory);
  app.post("/api/calculate-credit-score", calculateCreditScore);

  return app;
}
