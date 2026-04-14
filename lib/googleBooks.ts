const GOOGLE_BOOKS_API = "https://www.googleapis.com/books/v1";

export interface GoogleBook {
  googleBooksId: string;
  title: string;
  authors: string;
  rating: number;
  ratingsCount: number;
  pageCount: number;
  description: string;
  coverUrl: string;
}

export async function fetchTopRomanceNovels(): Promise<GoogleBook[]> {
  const apiKey = process.env.GOOGLE_BOOKS_API_KEY
    ? `&key=${process.env.GOOGLE_BOOKS_API_KEY}`
    : "";

  const results: GoogleBook[] = [];
  const seenIds = new Set<string>();

  const queries = [
    "subject:romance",
    "subject:romance+fiction",
    "romance+novel+bestseller",
    "subject:love+romance+fiction",
  ];

  for (const query of queries) {
    // Fetch 3 pages per query (0, 40, 80) = up to 120 books per query
    for (let startIndex = 0; startIndex < 120; startIndex += 40) {
      const url = `${GOOGLE_BOOKS_API}/volumes?q=${query}&startIndex=${startIndex}&maxResults=40&orderBy=relevance&printType=books&langRestrict=en${apiKey}`;

      const res = await fetch(url);
      if (!res.ok) continue;

      const data = await res.json();
      if (!data.items) continue;

      for (const item of data.items) {
        const info = item.volumeInfo;

        if (seenIds.has(item.id)) continue;
        // Must have a page count to be filterable
        if (!info.pageCount || info.pageCount < 50) continue;

        seenIds.add(item.id);

        results.push({
          googleBooksId: item.id,
          title: info.title ?? "Unknown Title",
          authors: info.authors?.join(", ") ?? "Unknown Author",
          // Default to 0 if no rating — Google Books often omits this
          rating: info.averageRating ?? 0,
          ratingsCount: info.ratingsCount ?? 0,
          pageCount: info.pageCount,
          description: info.description?.slice(0, 500) ?? "",
          coverUrl:
            info.imageLinks?.thumbnail?.replace("http://", "https://") ?? "",
        });
      }
    }
  }

  // Books with ratings first (desc), then by page count as tiebreaker
  return results.sort((a, b) => {
    if (b.rating !== a.rating) return b.rating - a.rating;
    return b.ratingsCount - a.ratingsCount;
  });
}
