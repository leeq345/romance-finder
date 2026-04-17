"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import BookCard from "@/components/BookCard";
import FilterBar, { PageFilter, KuFilter } from "@/components/FilterBar";

interface Book {
  id: string;
  title: string;
  authors: string;
  rating: number;
  ratingsCount: number;
  pageCount: number;
  description: string;
  coverUrl: string;
  kindleUnlimited: boolean;
}

export default function Home() {
  const [books, setBooks] = useState<Book[]>([]);
  const [pageFilter, setPageFilter] = useState<PageFilter>("all");
  const [kuFilter, setKuFilter] = useState<KuFilter>("all");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [syncMsg, setSyncMsg] = useState("");
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounce: wait 300ms after user stops typing before searching
  function handleSearchChange(value: string) {
    setSearch(value);
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => setDebouncedSearch(value), 300);
  }

  const fetchBooks = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ pages: pageFilter, ku: kuFilter });
    if (debouncedSearch) params.set("search", debouncedSearch);
    const res = await fetch(`/api/books?${params}`);
    const data = await res.json();
    setBooks(data);
    setLoading(false);
  }, [pageFilter, kuFilter, debouncedSearch]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const adminHeaders = {
    "Content-Type": "application/json",
    "x-admin-secret": process.env.NEXT_PUBLIC_ADMIN_SECRET ?? "",
  };

  async function handleSync() {
    setSyncing(true);
    setSyncMsg("");
    const res = await fetch("/api/sync", { method: "POST", headers: adminHeaders });
    const data = await res.json();
    if (data.success) {
      setSyncMsg(`Done! Added ${data.added} new books, updated ${data.updated}.`);
      fetchBooks();
    } else {
      setSyncMsg("Sync failed. Check console for details.");
    }
    setSyncing(false);
  }

  async function handleToggleKu(book: Book) {
    const updated = { ...book, kindleUnlimited: !book.kindleUnlimited };
    setBooks((prev) => prev.map((b) => (b.id === book.id ? updated : b)));
    await fetch("/api/toggle-ku", {
      method: "PATCH",
      headers: adminHeaders,
      body: JSON.stringify({ id: book.id, kindleUnlimited: updated.kindleUnlimited }),
    });
  }

  return (
    <main className="min-h-screen bg-pink-50">
      {/* Header */}
      <div className="bg-white border-b border-pink-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-pink-600">📚 Romance Finder</h1>
            <p className="text-sm text-gray-400 mt-1">
              Top-rated romance novels, filtered just for you
            </p>
          </div>
          <div className="flex items-center gap-3">
            {syncMsg && <p className="text-xs text-gray-500">{syncMsg}</p>}
            <button
              onClick={handleSync}
              disabled={syncing}
              className="bg-pink-500 hover:bg-pink-600 disabled:opacity-50 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
            >
              {syncing ? "Syncing..." : "Sync Books"}
            </button>
          </div>
        </div>
      </div>

      {/* Search + Filters */}
      <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-3">
        {/* Search bar */}
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg">🔍</span>
          <input
            type="text"
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search by title or author..."
            className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-pink-200 bg-white text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-300 transition"
          />
          {search && (
            <button
              onClick={() => { setSearch(""); setDebouncedSearch(""); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-lg leading-none"
            >
              ×
            </button>
          )}
        </div>

        <FilterBar
          pageFilter={pageFilter}
          kuFilter={kuFilter}
          onPageFilter={setPageFilter}
          onKuFilter={setKuFilter}
          total={books.length}
        />
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4 pb-12">
        {loading ? (
          <div className="flex justify-center items-center py-24 text-pink-400 text-lg">
            Loading books...
          </div>
        ) : books.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <p className="text-gray-400 text-lg">
              {debouncedSearch ? `No results for "${debouncedSearch}"` : "No books found."}
            </p>
            {!debouncedSearch && (
              <p className="text-gray-400 text-sm">
                Click <strong>Sync Books</strong> to pull data from Google Books.
              </p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {books.map((book) => (
              <div key={book.id} className="relative group">
                <BookCard book={book} />
                <button
                  onClick={() => handleToggleKu(book)}
                  title={book.kindleUnlimited ? "Remove from Kindle Unlimited" : "Mark as Kindle Unlimited"}
                  className={`absolute top-2 right-2 text-xs font-bold px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity ${
                    book.kindleUnlimited
                      ? "bg-amber-400 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {book.kindleUnlimited ? "KU ✓" : "+ KU"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
