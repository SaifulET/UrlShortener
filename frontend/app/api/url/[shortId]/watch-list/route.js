import {
  backendError,
  fetchBackend,
  readBackendResponse,
} from "@/lib/backendProxy";

export async function GET(_request, context) {
  try {
    const { shortId } = await context.params;

    const response = await fetchBackend(
      `/url/${encodeURIComponent(shortId)}/watch-list`,
      {
        cache: "no-store",
      }
    );

    const data = await readBackendResponse(response);

    return Response.json(data, { status: response.status });
  } catch (error) {
    return backendError(error);
  }
}
