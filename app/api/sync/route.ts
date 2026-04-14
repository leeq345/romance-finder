import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { fetchTopRomanceNovels } from "@/lib/googleBooks";

export async function POST() {
  try {
    const books = await fetchTopRomanceNovels();

    let added = 0;
    let skipped = 0;

    for (const book of books) {
      const existing = await prisma.book.findUnique({
        where: { googleBooksId: book.googleBooksId },
      });

      if (existing) {
        // Update rating info but keep KU flag as-is
        await prisma.book.update({
          where: { googleBooksId: book.googleBooksId },
          data: {
            rating: book.rating,
            ratingsCount: book.ratingsCount,
            pageCount: book.pageCount,
            description: book.description,
            coverUrl: book.coverUrl,
          },
        });
        skipped++;
      } else {
        await prisma.book.create({ data: book });
        added++;
      }
    }

    return NextResponse.json({ success: true, added, updated: skipped });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Sync failed" }, { status: 500 });
  }
}
