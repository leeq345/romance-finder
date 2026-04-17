import { NextResponse } from "next/server";

/**
 * Checks that the request includes the correct admin secret header.
 * Returns a 401 response if the check fails, or null if it passes.
 *
 * Usage in a route:
 *   const authError = requireAdminSecret(request);
 *   if (authError) return authError;
 */
export function requireAdminSecret(request: Request): NextResponse | null {
  const secret = process.env.NEXT_PUBLIC_ADMIN_SECRET;
  const provided = request.headers.get("x-admin-secret");

  if (!secret || provided !== secret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return null;
}
