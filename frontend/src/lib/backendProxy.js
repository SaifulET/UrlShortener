const LOCAL_BACKEND_URL = "http://localhost:3001";
const PRODUCTION_BACKEND_URL = "https://url-shortener-nine-henna.vercel.app";
const REQUEST_TIMEOUT_MS = 10000;

export const getBackendBaseUrl = () => {
  const configuredUrl =
    process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL;
  const baseUrl =
    configuredUrl ||
    (process.env.NODE_ENV === "production"
      ? PRODUCTION_BACKEND_URL
      : LOCAL_BACKEND_URL);

  if (
    process.env.NODE_ENV === "production" &&
    /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?/i.test(baseUrl)
  ) {
    throw new Error(
      "API_BASE_URL cannot use localhost in production. Use your deployed Express backend URL."
    );
  }

  return baseUrl.replace(/\/$/, "");
};

export const backendError = (error) =>
  Response.json(
    {
      success: false,
      message: `Backend request failed: ${error.message}`,
    },
    { status: 502 }
  );

export const readBackendResponse = async (response) => {
  const text = await response.text();

  try {
    return JSON.parse(text);
  } catch {
    return {
      success: false,
      message: text.startsWith("<!DOCTYPE")
        ? "Backend returned HTML instead of JSON. Check API_BASE_URL."
        : text || "Backend returned invalid JSON.",
    };
  }
};

export const fetchBackend = (path, options = {}) =>
  fetch(`${getBackendBaseUrl()}${path}`, {
    ...options,
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });
