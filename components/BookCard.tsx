"use client";

import Image from "next/image";

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

export default function BookCard({ book }: { book: Book }) {
  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden flex flex-col hover:shadow-xl transition-shadow duration-200">
      {/* Cover */}
      <div className="relative w-full h-64 bg-pink-50 flex items-center justify-center">
        {book.coverUrl ? (
          <Image
            src={book.coverUrl}
            alt={book.title}
            fill
            className="object-contain p-2"
            sizes="(max-width: 768px) 100vw, 300px"
          />
        ) : (
          <div className="text-pink-200 text-6xl">📖</div>
        )}
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h2 className="font-bold text-gray-800 text-sm leading-tight line-clamp-2">
            {book.title}
          </h2>
          {book.kindleUnlimited && (
            <span className="shrink-0 text-xs bg-amber-100 text-amber-700 font-semibold px-2 py-0.5 rounded-full">
              KU
            </span>
          )}
        </div>

        <p className="text-xs text-gray-500 italic">{book.authors}</p>

        {/* Stars + rating */}
        <div className="flex items-center gap-1 text-xs text-gray-600">
          <span className="text-yellow-400">{"★".repeat(Math.round(book.rating))}</span>
          <span className="font-semibold">{book.rating.toFixed(1)}</span>
          <span className="text-gray-400">({book.ratingsCount.toLocaleString()})</span>
        </div>

        {/* Page count badge */}
        <div className="flex items-center gap-2">
          <span
            className={`text-xs font-medium px-2 py-0.5 rounded-full ${
              book.pageCount >= 500
                ? "bg-purple-100 text-purple-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {book.pageCount} pages
          </span>
        </div>

        {/* Description */}
        {book.description && (
          <p className="text-xs text-gray-500 line-clamp-3 mt-1">
            {book.description}
          </p>
        )}
      </div>
    </div>
  );
}
