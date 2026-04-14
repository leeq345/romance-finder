import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const pages = searchParams.get("pages"); // "all" | "under500" | "over500"
  const ku = searchParams.get("ku");       // "all" | "ku" | "nonku"

  const where: Record<string, unknown> = {};

  if (pages === "under500") where.pageCount = { lt: 500 };
  if (pages === "over500") where.pageCount = { gte: 500 };
  if (ku === "ku") where.kindleUnlimited = true;
  if (ku === "nonku") where.kindleUnlimited = false;

  const books = await prisma.book.findMany({
    where,
    orderBy: [{ rating: "desc" }, { ratingsCount: "desc" }],
  });

  return NextResponse.json(books);
}
