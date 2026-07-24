import express from "express";

import {
  createShortURL,
  getURLWatchList,
  redirectToURL,
} from "../controllers/urlController.js";

const router = express.Router();

// Create short URL
router.post("/", createShortURL);

// Get watch list details for a short URL
router.get("/:shortId/watch-list", getURLWatchList);

// Redirect short URL
router.get("/:shortId", redirectToURL);

export default router;
