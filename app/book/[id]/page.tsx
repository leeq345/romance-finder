"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";

interface Book {
  id: string;
  googleBooksId: string;
  title: string;
  authors: string;
  rating: number;
  ratingsCount: number;
  pageCount: number;
  description: string;
  coverUrl: string;
  kindleUnlimited: boolean;
}

export default function BookDetail() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [kuUpdating, setKuUpdating] = useState(false);

  useEffect(() => {
    fetch(`/api/books/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setBook(data);
        setLoading(false);
      });
  }, [id]);

  async function handleToggleKu() {
    if (!book) return;
    setKuUpdating(true);
    const res = await fetch("/api/toggle-ku", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "x-admin-secret": process.env.NEXT_PUBLIC_ADMIN_SECRET ?? "",
      },
      body: JSON.stringify({ id: book.id, kindleUnlimited: !book.kindleUnlimited }),
    });
    const updated = await res.json();
    setBook(updated);
    setKuUpdating(false);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-pink-50 flex items-center justify-center text-pink-400 text-lg">
        Loading...
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen bg-pink-50 flex items-center justify-center text-gray-400 text-lg">
        Book not found.
      </div>
    );
  }

  const stars = Math.round(book.rating);
  const googleBooksUrl = `https://books.google.com/books?id=${book.googleBooksId}`;

  return (
    <main className="min-h-screen bg-pink-50">
      {/* Header */}
      <div className="bg-white border-b border-pink-100 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-pink-500 hover:text-pink-700 font-medium text-sm transition-colors"
          >
            ← Back
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
          <div className="flex flex-col md:flex-row">

            {/* Cover */}
            <div className="md:w-72 shrink-0 bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center p-8 min-h-80">
              {book.coverUrl ? (
                <div className="relative w-48 h-72 rounded-xl overflow-hidden shadow-2xl">
                  <Image
                    src={book.coverUrl}
                    alt={book.title}
                    fill
                    className="object-cover"
                    sizes="192px"
                    priority
                  />
                </div>
              ) : (
                <div className="w-48 h-72 rounded-xl bg-pink-200 flex items-center justify-center text-6xl shadow-2xl">
                  📖
                </div>
              )}
            </div>

            {/* Details */}
            <div className="flex-1 p-8 flex flex-col gap-5">

              {/* Title + Author */}
              <div>
                <h1 className="text-3xl font-bold text-gray-800 leading-tight">
                  {book.title}
                </h1>
                <p className="text-lg text-gray-400 italic mt-1">{book.authors}</p>
              </div>

              {/* Badges row */}
              <div className="flex flex-wrap items-center gap-3">
                {/* Rating */}
                {book.rating > 0 && (
                  <div className="flex items-center gap-1.5 bg-yellow-50 border border-yellow-200 rounded-full px-3 py-1">
                    <span className="text-yellow-400 text-sm">
                      {"★".repeat(stars)}{"☆".repeat(5 - stars)}
                    </span>
                    <span className="text-sm font-semibold text-yellow-700">
                      {book.rating.toFixed(1)}
                    </span>
                    <span className="text-xs text-gray-400">
                      ({book.ratingsCount.toLocaleString()} ratings)
                    </span>
                  </div>
                )}

                {/* Page count */}
                <span className={`text-sm font-medium px-3 py-1 rounded-full border ${
                  book.pageCount >= 500
                    ? "bg-purple-50 border-purple-200 text-purple-700"
                    : "bg-green-50 border-green-200 text-green-700"
                }`}>
                  {book.pageCount} pages
                </span>

                {/* KU badge */}
                {book.kindleUnlimited && (
                  <span className="text-sm font-semibold px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700">
                    Kindle Unlimited
                  </span>
                )}
              </div>

              {/* Description */}
              {book.description && (
                <div>
                  <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-2">
                    About this book
                  </h2>
                  <p className="text-gray-600 leading-relaxed">{book.description}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-wrap gap-3 mt-auto pt-4 border-t border-gray-100">
                <a
                  href={googleBooksUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-pink-500 hover:bg-pink-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
                >
                  View on Google Books ↗
                </a>

                <button
                  onClick={handleToggleKu}
                  disabled={kuUpdating}
                  className={`text-sm font-semibold px-5 py-2.5 rounded-xl border transition-colors disabled:opacity-50 ${
                    book.kindleUnlimited
                      ? "bg-amber-50 border-amber-300 text-amber-700 hover:bg-amber-100"
                      : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {kuUpdating
                    ? "Saving..."
                    : book.kindleUnlimited
                    ? "Remove from Kindle Unlimited"
                    : "Mark as Kindle Unlimited"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
