import { toAmount } from "@/server/data/backend-types";

/**
 * Money figures shared by the dashboard and the finance screen, so the two can
 * never disagree about what was collected or what is still owed.
 *
 * Amounts are always kept per currency. Adding naira to dollars produces a
 * number that means nothing, so nothing here sums across currencies.
 */

const FALLBACK_CURRENCY = "NGN";

type MoneyRecord = { currency?: string | null; amountPaid: number; balanceDue: number };

/** A transaction row as `/payments/transactions` returns it (relations included). */
export type RawTransaction = {
  amount: string | number;
  status: string;
  currency?: string | null;
  visaDocumentation?: { currency?: string | null } | null;
  passportApplication?: { currency?: string | null } | null;
  refunds?: RawRefund[] | null;
};

export type RawRefund = {
  netRefundAmount: string | number;
  [key: string]: unknown;
};

/** A transaction's own currency, else its application's — the service only sets it there. */
export function transactionCurrency(tx: RawTransaction) {
  return (
    tx.currency ||
    tx.visaDocumentation?.currency ||
    tx.passportApplication?.currency ||
    FALLBACK_CURRENCY
  );
}

function add(totals: Record<string, number>, currency: string, amount: number) {
  if (amount <= 0) return;
  totals[currency] = (totals[currency] ?? 0) + amount;
}

/**
 * Collected = confirmed transactions. Applications whose payments predate the
 * transaction ledger only carry `amountPaid`, so when the ledger is empty those
 * are used instead — real recorded amounts, never an estimate.
 */
export function collectedByCurrency(
  transactions: RawTransaction[],
  applications: MoneyRecord[],
) {
  const totals: Record<string, number> = {};
  for (const tx of transactions) {
    if (tx.status === "CONFIRMED")
      add(totals, transactionCurrency(tx), toAmount(tx.amount));
  }
  if (Object.keys(totals).length === 0) {
    for (const app of applications) {
      add(totals, app.currency || FALLBACK_CURRENCY, app.amountPaid);
    }
  }
  return totals;
}

/** Outstanding = what applicants still owe on evaluated applications. */
export function outstandingByCurrency(applications: MoneyRecord[]) {
  const totals: Record<string, number> = {};
  for (const app of applications) {
    add(totals, app.currency || FALLBACK_CURRENCY, app.balanceDue);
  }
  return totals;
}

/** Refunds live nested on their transaction; give each one that transaction's currency. */
export function refundsFromTransactions<R extends RawRefund>(
  transactions: Array<
    RawTransaction & { transactionRef?: string; refunds?: R[] | null }
  >,
): Array<R & { currency: string; transactionRef?: string }> {
  return transactions.flatMap((tx) =>
    (tx.refunds ?? []).map(
      (refund) =>
        ({
          ...refund,
          currency: transactionCurrency(tx),
          transactionRef: tx.transactionRef,
        }) as R & { currency: string; transactionRef?: string },
    ),
  );
}

export function refundVolumeByCurrency(
  refunds: Array<{ netRefundAmount: string | number; currency?: string | null }>,
) {
  const totals: Record<string, number> = {};
  for (const refund of refunds) {
    add(totals, refund.currency || FALLBACK_CURRENCY, toAmount(refund.netRefundAmount));
  }
  return totals;
}
