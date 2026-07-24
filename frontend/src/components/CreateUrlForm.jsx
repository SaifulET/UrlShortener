"use client";

import { CheckCircle2, Copy, Link2, Loader2 } from "lucide-react";
import { useState } from "react";

export default function CreateUrlForm({
  createForm,
  setCreateUrl,
  createShortUrl,
}) {
  const [copied, setCopied] = useState(false);

  const copyShortUrl = async () => {
    if (!createForm.result?.shortURL) {
      return;
    }

    await navigator.clipboard.writeText(createForm.result.shortURL);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-slate-950">Create short URL</h2>
        <p className="mt-1 text-sm text-slate-600">
          Paste a link and generate a short version.
        </p>
      </div>

      <label className="block">
        <span className="text-sm font-semibold text-slate-800">
          URL to shorten
        </span>
        <input
          value={createForm.url}
          onChange={(event) => setCreateUrl(event.target.value)}
          placeholder="google.com, linkedin.com, or https://example.com/link"
          className="mt-2 h-12 w-full rounded-md border border-slate-300 bg-white px-4 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
        />
      </label>

      {createForm.error ? (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
          {createForm.error}
        </p>
      ) : null}

      <button
        type="button"
        onClick={createShortUrl}
        disabled={createForm.loading}
        className="flex min-h-12 w-full items-center justify-center gap-2 rounded-md bg-teal-700 px-4 font-semibold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:bg-slate-400"
      >
        {createForm.loading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <Link2 className="h-5 w-5" />
        )}
        Create short URL
      </button>

      {createForm.result ? (
        <div className="rounded-lg border border-teal-200 bg-teal-50 p-4">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 h-5 w-5 flex-none text-teal-700" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-teal-950">
                Short URL created
              </p>
              <a
                href={createForm.result.shortURL}
                target="_blank"
                rel="noreferrer"
                className="mt-1 block break-all text-sm font-medium text-teal-800 underline decoration-teal-300 underline-offset-4"
              >
                {createForm.result.shortURL}
              </a>
            </div>
          </div>
          <button
            type="button"
            onClick={copyShortUrl}
            className="mt-4 flex min-h-10 w-full items-center justify-center gap-2 rounded-md border border-teal-300 bg-white px-3 text-sm font-semibold text-teal-800 transition hover:bg-teal-100"
          >
            <Copy className="h-4 w-4" />
            {copied ? "Copied" : "Copy short URL"}
          </button>
        </div>
      ) : null}
    </div>
  );
}
