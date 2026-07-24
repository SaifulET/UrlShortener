const API_BASE_URL =
  process.env.API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "http://localhost:3001";

const backendError = (error) =>
  Response.json(
    {
      success: false,
      message: `Backend request failed: ${error.message}`,
    },
    { status: 502 }
  );

const readBackendResponse = async (response) => {
  const text = await response.text();

  try {
    return JSON.parse(text);
  } catch {
    return {
      success: false,
      message: text.startsWith("<!DOCTYPE")
        ? "Backend returned HTML instead of JSON."
        : text || "Backend returned invalid JSON.",
    };
  }
};

export async function GET(_request, context) {
  try {
    const { shortId } = await context.params;

    const response = await fetch(
      `${API_BASE_URL}/url/${encodeURIComponent(shortId)}/watch-list`,
      {
        cache: "no-store",
        signal: AbortSignal.timeout(10000),
      }
    );

    const data = await readBackendResponse(response);

    return Response.json(data, { status: response.status });
  } catch (error) {
    return backendError(error);
  }
}
