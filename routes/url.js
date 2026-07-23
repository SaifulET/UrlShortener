import express from "express";

import {
  createShortURL,
  redirectToURL,
} from "../controllers/urlController.js";

const router = express.Router();

// Create short URL
router.post("/", createShortURL);

// Redirect short URL
router.get("/:shortId", redirectToURL);

export default router;