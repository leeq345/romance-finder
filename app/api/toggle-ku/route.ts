import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminSecret } from "@/lib/auth";

export async function PATCH(request: Request) {
  const authError = requireAdminSecret(request);
  if (authError) return authError;

  const { id, kindleUnlimited } = await request.json();

  if (typeof id !== "string" || typeof kindleUnlimited !== "boolean") {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const book = await prisma.book.update({
    where: { id },
    data: { kindleUnlimited },
  });

  return NextResponse.json(book);
}
