import { NextResponse } from "next/server";

import { z } from "zod";

import { backend } from "@/server/api/backend";
import { DESK_ROLES, requireRole } from "@/server/auth";
import { backendErrorResponse, parseBody } from "@/server/http";

const listQuerySchema = z.object({
  search: z.string().trim().max(120).optional(),
  category: z.string().trim().max(60).optional(),
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
});

const verifySchema = z.object({ isVerified: z.boolean() });

const professionalIdSchema = z.string().trim().min(1).max(120);

/**
 * Goes through `backend()` like every other console route: the session's
 * token is forwarded, the envelope is unwrapped, and a failure surfaces as
 * the service's own status instead of an empty list.
 */
export async function GET(request: Request) {
  const { session, response } = await requireRole(DESK_ROLES);
  if (response) return response;

  const query = listQuerySchema.safeParse(
    Object.fromEntries(new URL(request.url).searchParams),
  );
  if (!query.success) {
    return NextResponse.json({ message: "Invalid filters" }, { status: 422 });
  }

  try {
    const result = await backend<unknown>("/hire/professionals/admin", {
      token: session.token,
      query: query.data,
    });
    return NextResponse.json(result);
  } catch (error) {
    return backendErrorResponse(error);
  }
}

export async function PATCH(request: Request) {
  const { session, response } = await requireRole(DESK_ROLES);
  if (response) return response;

  const id = professionalIdSchema.safeParse(
    new URL(request.url).searchParams.get("id"),
  );
  if (!id.success) {
    return NextResponse.json(
      { message: "Professional ID is required" },
      { status: 400 },
    );
  }

  const body = await parseBody(request, verifySchema);
  if (body.response) return body.response;

  try {
    const result = await backend<unknown>(
      `/hire/professionals/${encodeURIComponent(id.data)}/verify`,
      { method: "PATCH", token: session.token, body: JSON.stringify(body.data) },
    );
    return NextResponse.json({ data: result, message: "Verification updated" });
  } catch (error) {
    return backendErrorResponse(error);
  }
}
