"use client";

import { Loader2, Search } from "lucide-react";

export default function LookupUrlForm({
  lookupForm,
  setLookupShortId,
  fetchWatchList,
}) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-slate-950">See original URL</h2>
        <p className="mt-1 text-sm text-slate-600">
          Enter a short ID or paste the short URL.
        </p>
      </div>

      <label className="block">
        <span className="text-sm font-semibold text-slate-800">
          Short ID or short URL
        </span>
        <input
          value={lookupForm.shortId}
          onChange={(event) => setLookupShortId(event.target.value)}
          placeholder="abc123xy"
          className="mt-2 h-12 w-full rounded-md border border-slate-300 bg-white px-4 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100"
        />
      </label>

      {lookupForm.error ? (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
          {lookupForm.error}
        </p>
      ) : null}

      <button
        type="button"
        onClick={fetchWatchList}
        disabled={lookupForm.loading}
        className="flex min-h-12 w-full items-center justify-center gap-2 rounded-md bg-indigo-700 px-4 font-semibold text-white transition hover:bg-indigo-800 disabled:cursor-not-allowed disabled:bg-slate-400"
      >
        {lookupForm.loading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <Search className="h-5 w-5" />
        )}
        See original URL
      </button>
    </div>
  );
}
