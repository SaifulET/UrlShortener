"use client";

import AppNavbar from "@/components/AppNavbar";
import CreateUrlForm from "@/components/CreateUrlForm";
import LookupUrlForm from "@/components/LookupUrlForm";
import WatchListPanel from "@/components/WatchListPanel";
import { useUrlStore } from "@/store/urlStore";

export default function UrlShortenerApp() {
  const {
    mode,
    setMode,
    createForm,
    lookupForm,
    setCreateUrl,
    setLookupShortId,
    createShortUrl,
    fetchWatchList,
  } = useUrlStore();

  return (
    <main className="min-h-screen px-3 py-4 sm:px-6 lg:px-8">
      <AppNavbar mode={mode} setMode={setMode} />

      <section className="mx-auto mt-6 flex w-full max-w-6xl flex-col gap-6 sm:mt-8">
        <div
          className={`grid gap-6 ${
            mode === "lookup" ? "lg:grid-cols-2 lg:items-stretch" : "w-full"
          }`}
        >
          <section className="flex min-h-[24rem] flex-col rounded-lg border border-white/80 bg-white p-4 shadow-soft sm:p-6">
            {mode === "create" ? (
              <CreateUrlForm
                createForm={createForm}
                setCreateUrl={setCreateUrl}
                createShortUrl={createShortUrl}
              />
            ) : (
              <LookupUrlForm
                lookupForm={lookupForm}
                setLookupShortId={setLookupShortId}
                fetchWatchList={fetchWatchList}
              />
            )}
          </section>

          {mode === "lookup" ? (
            <WatchListPanel activeResult={lookupForm.result} />
          ) : null}
        </div>
      </section>
    </main>
  );
}
