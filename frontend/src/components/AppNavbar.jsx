"use client";

import { Link2, Search } from "lucide-react";

export default function AppNavbar({ mode, setMode }) {
  return (
    <nav className="sticky top-3 z-20 mx-auto flex w-full max-w-6xl flex-col gap-4 rounded-lg border border-white/80 bg-white/90 p-3 shadow-soft backdrop-blur md:flex-row md:items-center md:justify-between">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-11 w-11 flex-none items-center justify-center rounded-md bg-slate-950 text-white">
          <Link2 className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-lg font-bold text-slate-950">
            URL Watch Desk
          </p>
          <p className="truncate text-sm font-medium text-slate-500">
            Short links with visit history
          </p>
        </div>
      </div>

      <div className="grid w-full grid-cols-1 gap-2 rounded-lg bg-slate-100 p-1 sm:grid-cols-2 md:w-auto">
        <button
          type="button"
          onClick={() => setMode("create")}
          className={`flex min-h-11 items-center justify-center gap-2 rounded-md px-4 text-sm font-semibold transition md:min-w-40 ${
            mode === "create"
              ? "bg-slate-950 text-white shadow-sm"
              : "text-slate-700 hover:bg-white"
          }`}
        >
          <Link2 className="h-4 w-4" />
          Create short URL
        </button>
        <button
          type="button"
          onClick={() => setMode("lookup")}
          className={`flex min-h-11 items-center justify-center gap-2 rounded-md px-4 text-sm font-semibold transition md:min-w-40 ${
            mode === "lookup"
              ? "bg-slate-950 text-white shadow-sm"
              : "text-slate-700 hover:bg-white"
          }`}
        >
          <Search className="h-4 w-4" />
          See original URL
        </button>
      </div>
    </nav>
  );
}
