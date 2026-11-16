import { NextResponse } from "next/server";

import { backend } from "@/server/api/backend";
import { requireSession } from "@/server/auth";
import type {
  BackendPassportApplication,
  BackendVisaApplication,
} from "@/server/data/backend-types";
import {
  toCustomers,
  toPassportApplication,
  toVisaApplication,
} from "@/server/data/mappers";
import { backendErrorResponse, paginate, readListParams } from "@/server/http";

export async function GET(request: Request) {
  const { session, response } = await requireSession();
  if (response) return response;

  const { params, response: invalid } = readListParams(request);
  if (invalid) return invalid;
  try {
    // No customer table exists — applicants are derived from their applications.
    const [visas, passports] = await Promise.all([
      backend<BackendVisaApplication[]>("/visa-documentation", {
        token: session.token,
      }),
      backend<BackendPassportApplication[]>("/passport-application", {
        token: session.token,
      }),
    ]);

    const needle = params.q?.toLowerCase();
    const customers = toCustomers(
      visas.map(toVisaApplication),
      passports.map(toPassportApplication),
    ).filter(
      (customer) =>
        !needle ||
        customer.name.toLowerCase().includes(needle) ||
        customer.email.toLowerCase().includes(needle),
    );

    return NextResponse.json(paginate(customers, params.page, params.perPage));
  } catch (error) {
    return backendErrorResponse(error);
  }
}
