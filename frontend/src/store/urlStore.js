import { create } from "zustand";

const initialCreateForm = {
  url: "",
  loading: false,
  error: "",
  result: null,
};

const initialLookupForm = {
  shortId: "",
  loading: false,
  error: "",
  result: null,
};

const readError = async (response) => {
  const text = await response.text();

  try {
    const body = JSON.parse(text);
    return body.message || "Request failed";
  } catch {
    return text.startsWith("<!DOCTYPE")
      ? "The server returned an HTML page instead of JSON. Check the API route."
      : text || "Request failed";
  }
};

const readJson = async (response) => {
  const text = await response.text();

  try {
    return JSON.parse(text);
  } catch {
    throw new Error(
      text.startsWith("<!DOCTYPE")
        ? "The server returned an HTML page instead of JSON. Check the API route."
        : "The server returned invalid JSON."
    );
  }
};

const getShortIdFromInput = (value) => {
  const trimmed = value.trim();

  if (!trimmed) {
    return "";
  }

  try {
    const parsed = new URL(trimmed);
    const parts = parsed.pathname.split("/").filter(Boolean);
    return parts[parts.length - 1] || trimmed;
  } catch {
    return trimmed;
  }
};

export const useUrlStore = create((set, get) => ({
  mode: "create",
  createForm: initialCreateForm,
  lookupForm: initialLookupForm,

  setMode: (mode) => set({ mode }),

  setCreateUrl: (url) =>
    set((state) => ({
      createForm: { ...state.createForm, url, error: "" },
    })),

  setLookupShortId: (shortId) =>
    set((state) => ({
      lookupForm: { ...state.lookupForm, shortId, error: "" },
    })),

  createShortUrl: async () => {
    const { url } = get().createForm;

    if (!url.trim()) {
      set((state) => ({
        createForm: { ...state.createForm, error: "Enter a URL first." },
      }));
      return;
    }

    set((state) => ({
      createForm: { ...state.createForm, loading: true, error: "" },
    }));

    try {
      const response = await fetch("/api/url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });

      if (!response.ok) {
        throw new Error(await readError(response));
      }

      const body = await readJson(response);

      set((state) => ({
        createForm: {
          ...state.createForm,
          loading: false,
          result: body.data,
        },
        lookupForm: {
          ...state.lookupForm,
          shortId: body.data?.shortId || state.lookupForm.shortId,
        },
      }));
    } catch (error) {
      set((state) => ({
        createForm: {
          ...state.createForm,
          loading: false,
          error: error.message,
        },
      }));
    }
  },

  fetchWatchList: async () => {
    const shortId = getShortIdFromInput(get().lookupForm.shortId);

    if (!shortId) {
      set((state) => ({
        lookupForm: {
          ...state.lookupForm,
          error: "Enter a short ID or short URL first.",
        },
      }));
      return;
    }

    set((state) => ({
      lookupForm: { ...state.lookupForm, loading: true, error: "" },
    }));

    try {
      const response = await fetch(
        `/api/url/${encodeURIComponent(shortId)}/watch-list`
      );

      if (!response.ok) {
        throw new Error(await readError(response));
      }

      const body = await readJson(response);

      set((state) => ({
        lookupForm: {
          ...state.lookupForm,
          shortId,
          loading: false,
          result: body.data,
        },
      }));
    } catch (error) {
      set((state) => ({
        lookupForm: {
          ...state.lookupForm,
          loading: false,
          error: error.message,
        },
      }));
    }
  },
}));
