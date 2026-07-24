import {
  backendError,
  fetchBackend,
  readBackendResponse,
} from "@/lib/backendProxy";

export async function POST(request) {
  try {
    const body = await request.json();

    const response = await fetchBackend("/url", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await readBackendResponse(response);

    return Response.json(data, { status: response.status });
  } catch (error) {
    return backendError(error);
  }
}
