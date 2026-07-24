import { nanoid } from "nanoid";
import URLModel from "../models/url.js";

const normalizeURL = (value) => {
  const trimmedURL = value.trim();
  const urlWithProtocol = /^https?:\/\//i.test(trimmedURL)
    ? trimmedURL
    : `https://${trimmedURL}`;

  try {
    const parsedURL = new URL(urlWithProtocol);

    if (!["http:", "https:"].includes(parsedURL.protocol)) {
      return null;
    }

    return parsedURL.toString();
  } catch {
    return null;
  }
};

const getRequestBaseURL = (req) => {
  const forwardedProtocol = req.get("x-forwarded-proto")?.split(",")[0];
  const protocol = forwardedProtocol || req.protocol;

  return `${protocol}://${req.get("host")}`;
};

export const createShortURL = async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({
        success: false,
        message: "URL is required",
      });
    }

    const normalizedURL = normalizeURL(url);

    if (!normalizedURL) {
      return res.status(400).json({
        success: false,
        message: "Enter a valid website URL",
      });
    }

    const shortId = nanoid(8);

    const newURL = await URLModel.create({
      shortId,
      redirectURL: normalizedURL,
      visitHistory: [],
    });

    return res.status(201).json({
      success: true,
      message: "Short URL created successfully",
      data: {
        shortId: newURL.shortId,
        shortURL: `${getRequestBaseURL(req)}/${newURL.shortId}`,
        originalURL: newURL.redirectURL,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const redirectToURL = async (req, res) => {
  try {
    const { shortId } = req.params;

    const entry = await URLModel.findOneAndUpdate(
      { shortId },
      {
        $push: {
          visitHistory: {
            timestamp: Date.now(),
          },
        },
      },
      {
        new: true,
      }
    );

    if (!entry) {
      return res.status(404).json({
        success: false,
        message: "Short URL not found",
      });
    }

    return res.redirect(entry.redirectURL);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getURLWatchList = async (req, res) => {
  try {
    const { shortId } = req.params;

    const entry = await URLModel.findOne({ shortId })
      .select("shortId redirectURL visitHistory")
      .lean();

    if (!entry) {
      return res.status(404).json({
        success: false,
        message: "Short URL not found",
      });
    }

    const watchList = entry.visitHistory.map((visit) => ({
      id: visit._id,
      timestamp: visit.timestamp,
      time: visit.timestamp ? new Date(visit.timestamp).toISOString() : null,
    }));

    return res.status(200).json({
      success: true,
      message: "URL watch list fetched successfully",
      data: {
        shortId: entry.shortId,
        originalURL: entry.redirectURL,
        totalWatchList: watchList.length,
        watchList,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
