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
import {
  signUp,
  signIn,
  getProfile,
  updateProfile,
  changePassword,
  deleteAccount
} from "./routes/auth";
import {
  generateAnalytics,
  getAnalytics,
  getLoanOffers
} from "./routes/analytics";

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

  // Rating and feedback API routes
  app.post("/api/ratings", submitRating);
  app.get("/api/ratings/stats", getRatingStats);
  app.get("/api/ratings/testimonials", getTestimonials);
  app.get("/api/users/:userId/ratings", getUserRatings);
  app.put("/api/ratings/:ratingId", updateRating);

  // Authentication API routes
  app.post("/api/auth/signup", signUp);
  app.post("/api/auth/signin", signIn);
  app.get("/api/auth/profile/:userId", getProfile);
  app.put("/api/auth/profile/:userId", updateProfile);
  app.put("/api/auth/password/:userId", changePassword);
  app.delete("/api/auth/account/:userId", deleteAccount);

  // Analytics API routes
  app.post("/api/analytics/:userId/generate", generateAnalytics);
  app.get("/api/analytics/:userId", getAnalytics);
  app.get("/api/analytics/:userId/loans", getLoanOffers);

  return app;
}
