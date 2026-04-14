import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const pages = searchParams.get("pages");
  const ku = searchParams.get("ku");
  const search = searchParams.get("search")?.trim() ?? "";

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = {};

  if (pages === "under500") where.pageCount = { lt: 500 };
  if (pages === "over500") where.pageCount = { gte: 500 };
  if (ku === "ku") where.kindleUnlimited = true;
  if (ku === "nonku") where.kindleUnlimited = false;

  if (search) {
    where.OR = [
      { title: { contains: search } },
      { authors: { contains: search } },
    ];
  }

  const books = await prisma.book.findMany({
    where,
    orderBy: [{ rating: "desc" }, { ratingsCount: "desc" }],
  });

  return NextResponse.json(books);
}
