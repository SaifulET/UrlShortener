"use client";

import { Activity, BarChart3, CalendarClock, ExternalLink } from "lucide-react";
import { useMemo } from "react";
import { formatVisitTime } from "@/utils/formatVisitTime";

export default function WatchListPanel({ activeResult }) {
  const latestVisit = useMemo(() => {
    if (!activeResult?.watchList?.length) {
      return null;
    }

    return activeResult.watchList[activeResult.watchList.length - 1];
  }, [activeResult]);

  return (
    <section className="flex min-h-[24rem] flex-col rounded-lg border border-white/80 bg-white p-4 shadow-soft sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-950">Original URL</h2>
          <p className="mt-1 text-sm text-slate-600">
            Watch-list details appear below.
          </p>
        </div>
        <div className="flex h-11 w-11 flex-none items-center justify-center rounded-md bg-slate-100 text-slate-700">
          <BarChart3 className="h-5 w-5" />
        </div>
      </div>

      {activeResult ? (
        <div className="mt-5 space-y-5">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-start gap-3">
              <ExternalLink className="mt-0.5 h-5 w-5 flex-none text-indigo-700" />
              <a
                href={activeResult.originalURL}
                target="_blank"
                rel="noreferrer"
                className="break-all text-sm font-semibold text-slate-950 underline decoration-slate-300 underline-offset-4"
              >
                {activeResult.originalURL}
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-slate-200 p-4">
              <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                <Activity className="h-4 w-4" />
                Total watch list
              </div>
              <p className="mt-2 text-3xl font-bold text-slate-950">
                {activeResult.totalWatchList}
              </p>
            </div>
            <div className="rounded-lg border border-slate-200 p-4">
              <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                <CalendarClock className="h-4 w-4" />
                Latest visit
              </div>
              <p className="mt-2 text-sm font-semibold text-slate-950">
                {latestVisit ? formatVisitTime(latestVisit.time) : "No visits yet"}
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wide text-slate-700">
              Watch-list details
            </h3>
            <div className="mt-3 max-h-[22rem] overflow-auto rounded-lg border border-slate-200">
              {activeResult.watchList.length ? (
                activeResult.watchList.map((visit, index) => (
                  <div
                    key={visit.id || `${visit.timestamp}-${index}`}
                    className="grid gap-1 border-b border-slate-200 p-3 last:border-b-0 sm:grid-cols-[4rem_1fr] sm:items-center"
                  >
                    <span className="text-xs font-bold uppercase tracking-wide text-slate-500 sm:text-sm">
                      #{index + 1}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-slate-950">
                        {formatVisitTime(visit.time)}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="p-4 text-sm font-medium text-slate-600">
                  No watch-list records found for this URL yet.
                </p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-5 flex flex-1 flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
          <BarChart3 className="mx-auto h-9 w-9 text-slate-400" />
          <p className="mt-3 text-sm font-semibold text-slate-700">
            Search a short ID to see the original URL and watch-list time
            details.
          </p>
        </div>
      )}
    </section>
  );
}
