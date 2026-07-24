import { nanoid } from "nanoid";
import URL from "../models/url.js";

export const createShortURL = async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({
        success: false,
        message: "URL is required",
      });
    }

    const shortId = nanoid(8);

    const newURL = await URL.create({
      shortId,
      redirectURL: url,
      visitHistory: [],
    });

    return res.status(201).json({
      success: true,
      message: "Short URL created successfully",
      data: {
        shortId: newURL.shortId,
        shortURL: `${req.protocol}://${req.get("host")}/url/${newURL.shortId}`,
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

    const entry = await URL.findOneAndUpdate(
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

    const entry = await URL.findOne({ shortId })
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
