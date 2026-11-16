import { NextResponse } from "next/server";

import { backend } from "@/server/api/backend";
import { requireSession } from "@/server/auth";
import type { BackendPassportApplication } from "@/server/data/backend-types";
import { toPassportApplication } from "@/server/data/mappers";
import { backendErrorResponse, paginate, readListParams } from "@/server/http";

export async function GET(request: Request) {
  const { session, response } = await requireSession();
  if (response) return response;

  const { params, response: invalid } = readListParams(request);
  if (invalid) return invalid;
  try {
    const records = await backend<BackendPassportApplication[]>(
      "/passport-application",
      { token: session.token, query: { search: params.q, status: params.status } },
    );
    return NextResponse.json(
      paginate(records.map(toPassportApplication), params.page, params.perPage),
    );
  } catch (error) {
    return backendErrorResponse(error);
  }
}
