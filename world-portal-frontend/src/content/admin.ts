import type {
  BackendPaymentStatus,
  BackendUserRole,
  BackendVisaCategory,
  PassportStatus,
  VisaStatus,
} from "@/server/data/backend-types";

export const login = {
  eyebrow: "Console",
  headingLead: "Welcome",
  headingAccent: "back.",
  body: "Sign in to manage enquiries, applications and customers.",
  submitLabel: "Sign in",
  hint: "Demo credentials: admin@worldportal.travel / worldportal",
  image: {
    src: "/images/hero.jpg",
    alt: "A turquoise lagoon seen from above",
  },
} as const;

/** Settings → bank accounts applicants pay into. */
export const bankAccounts = {
  loadFailed: "Could not load bank accounts",
  genericError: "That didn't go through. Try again in a moment.",
  toggled: (bank: string, active: boolean) =>
    active ? `${bank} is active — applicants will see it` : `${bank} is hidden from applicants`,
  deleted: (bank: string) => `${bank} account deleted`,
  deleteTitle: (bank: string) => `Delete the ${bank} account?`,
  deleteBody:
    "Applicants will stop seeing it in payment emails and on the tracking page straight away. This can't be undone — to hide it for a while, deactivate it instead.",
  deleteConfirm: "Delete account",
} as const;

export const agencies = {
  metaTitle: "Agencies",
  headingLead: "Agency",
  headingAccent: "verification.",
  body: "Registered partner agencies: check their paperwork, review what they offer, and decide who goes live.",
} as const;

export const professionals = {
  metaTitle: "Professionals",
  headingLead: "Professional",
  headingAccent: "moderation.",
  body: "Destination professionals listed on Hire: verify identity and qualifications before their profile shows a badge.",
} as const;

/** Dashboard charts (`features/dashboard/components/*`). */
export const chartCopy = {
  showTable: "Show as a table",
  visas: "Visas",
  passports: "Passports",
  day: "Day",
  category: "Category",
  stage: "Stage",
  count: "Count",
  share: "Share",
  weeklyEmpty: "No applications in the last seven days.",
  categoriesEmpty: "No visa applications yet.",
  pipelineEmpty: "Nothing in the pipeline yet.",
  weeklyCaption: "Applications per day over the last seven days",
  categoriesCaption: "Visa applications by category",
  pipelineCaption: "Visa applications by stage",
} as const;

/** Shared list controls (`components/admin/list-controls.tsx`, `admin-data-table.tsx`). */
export const listControls = {
  all: "All",
  from: "Submitted from",
  to: "Submitted to",
  export: "Export CSV",
  columns: "Columns",
  columnsLabel: "Show columns",
  selectAll: "Select all on this page",
  selectRow: (name: string) => `Select ${name}`,
  selected: (n: number) => `${n} selected`,
  exportSelected: "Export selected",
  copyReferences: "Copy references",
  copied: (n: number) => `${n} reference${n === 1 ? "" : "s"} copied`,
  clear: "Clear",
  rowActions: "Actions",
  open: "Open",
  quickView: "Quick view",
  copyReference: "Copy reference",
  referenceCopied: "Reference copied",
  openFull: "Open full record",
  sortBy: (column: string) => `Sort by ${column}`,
} as const;

/** The ⌘K palette in the topbar (`components/admin/command-palette.tsx`). */
export const commandPalette = {
  trigger: "Search…",
  label: "Search the console",
  placeholder: "Search references, names, pages…",
  groups: {
    recent: "Recent",
    pages: "Go to",
    visas: "Visa applications",
    passports: "Passport applications",
    applicants: "Applicants",
  },
  applicantHint: (count: number) => `${count} application${count === 1 ? "" : "s"}`,
  typeMore: "Type two or more characters to search applications and applicants.",
  searching: "Searching…",
  failed: "Search is unavailable right now. Try again in a moment.",
  noMatches: (q: string) => `Nothing matches “${q}”.`,
  footer: "↑↓ to move · Enter to open · Esc to close",
} as const;

/** `RoleGate` — a page this role can't use explains itself instead of failing. */
export const roleGate = {
  title: "This page isn't available to your role",
  body: (role: string, needs: string) =>
    `You're signed in as ${role}. This page needs ${needs}. Ask a manager if you need access.`,
  back: "Go to your home page",
} as const;

/**
 * Nothing checks an upload before staff open it, so the viewer must not call
 * it "verified" — that is the reviewer's call to make.
 */
export const documentViewer = {
  description: "Uploaded by the applicant — not yet reviewed",
} as const;

/** Detail pages whose record did not load — see `DetailLoadError`. */
export const detailErrors = {
  notFoundTitle: (noun: string) => `This ${noun} doesn't exist`,
  notFoundBody: "The link may be wrong, or the file was removed. Nothing has changed on it.",
  failedTitle: (noun: string) => `Could not load this ${noun}`,
  failedBody: "The service didn't answer. Try again in a moment.",
  retry: "Try again",
} as const;

/** The console's own error boundary (`app/(admin)/admin/(console)/error.tsx`). */
export const consoleError = {
  title: "This page hit a problem",
  body: "Nothing you entered was saved by this error. Try again — if it keeps happening, note the reference and tell the team.",
  reference: "Reference",
  retry: "Try again",
  home: "Back to overview",
} as const;

/** `app/(admin)/admin/(console)/not-found.tsx`. */
export const consoleNotFound = {
  title: "Page not found",
  body: "That address isn't part of the console.",
  home: "Back to overview",
} as const;

export const overview = {
  headingLead: "Good to see you,",
  body: "Here is what moved across the desk this week.",
  stats: {
    visas: "Visa applications",
    passports: "Passport applications",
    customers: "Applicants",
    revenue: "Collected",
  },
  recent: {
    title: "Latest visa applications",
    cta: "View all",
    emptyTitle: "No applications yet",
    emptyBody: "Submissions from the site land here.",
  },
  loadFailed: "Could not load the dashboard",
  /** Triage tiles: each count opens the queue behind it. */
  attention: {
    title: "Needs attention",
    awaitingEvaluation: "Awaiting a price",
    awaitingEvaluationHint: "Submitted, not yet evaluated",
    awaitingPayment: "Awaiting payment",
    awaitingPaymentHint: "Priced, payment not confirmed",
    underReview: "Under review",
    underReviewHint: "Paid, waiting for a decision",
    open: "Open queue",
  },
  viewList: "View list",
  pipeline: { title: "Visa pipeline", body: "Applications by stage" },
  services: { title: "Visas by category" },
  weekly: { title: "Last seven days" },
} as const;

export const passports = {
  headingLead: "Passport",
  headingAccent: "applications.",
  body: "Every booklet request, with its category, validity and stage.",
  searchPlaceholder: "Search by applicant, reference or email",
  empty: {
    title: "No passport applications match",
    body: "Try a different search or clear the stage filter.",
  },
  detail: {
    eyebrow: "Passport application",
    applicant: "Applicant",
    category: "Category",
    validity: "Validity",
    booklet: "Booklet",
    origin: "State of origin",
    notes: "Verification notes",
    noNotes: "Nothing has been recorded against this file yet.",
    advance: "Move to stage",
    noteLabel: "Note for the file",
    notePlaceholder: "What changed, or what the applicant needs to do next",
    rejectionLabel: "Reason for rejection",
    updateLabel: "Update application",
    reply: "Email the applicant",
  },
} as const;

export const applications = {
  headingLead: "Visa",
  headingAccent: "applications.",
  body: "Every file in progress, with its stage, cost and payment position.",
  searchPlaceholder: "Search by name, email, passport number or reference",
  empty: {
    title: "No applications match",
    body: "Try a different search or clear the stage filter.",
  },
  detail: {
    eyebrow: "Visa application",
    timeline: "Progress",
    timelineNote:
      "Reconstructed from the record's own stamps — the service keeps no separate review log.",
    advance: "Move to stage",
    noteLabel: "Verification notes",
    notePlaceholder: "What changed, or what the applicant needs to do next",
    rejectionLabel: "Reason for rejection",
    applicant: "Applicant",
    travel: "Intended travel",
    purpose: "Purpose of visit",
    nationality: "Nationality",
    passport: "Passport number",
    fee: "Total cost",
    paid: "Paid",
    outstanding: "Outstanding",
    updateLabel: "Update application",
    evaluate: "Set the cost",
    evaluateHint:
      "Evaluating sets the total, moves the file to Evaluated and emails the applicant.",
    amountLabel: "Total processing cost",
    installmentLabel: "Allow a 50% instalment",
    evaluateAction: "Save evaluation",
    reply: "Email the applicant",
  },
} as const;

export const customers = {
  headingLead: "Your",
  headingAccent: "applicants.",
  body: "Everyone who has applied, gathered from their applications.",
  searchPlaceholder: "Search by name or email",
  empty: {
    title: "No applicants match",
    body: "Try a different search.",
  },
  copyEmails: "Copy emails",
  emailsCopied: (n: number) => `${n} email${n === 1 ? "" : "s"} copied`,
} as const;

export const settings = {
  headingLead: "Account &",
  headingAccent: "workspace.",
  body: "Who you are, and how the console behaves.",
  profile: { title: "Profile", body: "How you appear on files and replies." },
  notifications: {
    title: "Notifications",
    body: "Where new enquiries and deadline reminders go.",
    unavailable:
      "Email alerts for staff aren't set up yet, so these can't be switched on. Applicants still get their own emails.",
    items: [
      {
        key: "newEnquiry",
        label: "New enquiry",
        hint: "Email me when the form is submitted",
      },
      {
        key: "dueSoon",
        label: "Deadline approaching",
        hint: "Three days before a decision is due",
      },
      {
        key: "weekly",
        label: "Weekly digest",
        hint: "A Monday summary of the pipeline",
      },
    ],
  },
  team: {
    title: "Team",
    body: "Everyone with access to this console, from the service.",
  },
  danger: { title: "Session", body: "Sign out of this device.", action: "Sign out" },
} as const;

export const finance = {
  headingLead: "Financial",
  headingAccent: "operations.",
  body: "Transactions, refund requests and platform fee configuration.",
  searchPlaceholder: "Search by transaction ref, applicant or email",
  tabs: {
    transactions: "Transactions",
    refunds: "Refund Requests",
    config: "Fee Settings",
  },
  cards: {
    outstandingCaption: "Still owed on evaluated applications",
    serviceFee: "Service fee",
    serviceFeeCaption: "As set in Fee Settings",
    surcharge: "Surcharge",
  },
  /** Shown in place of a figure the service did not return — never a guess. */
  unavailable: "—",
  empty: {
    title: "No financial records found",
    body: "Try adjusting your search query or filters.",
  },
} as const;


export const visaStatusLabels: Record<VisaStatus, string> = {
  SUBMITTED: "Submitted",
  EVALUATED: "Evaluated",
  UNDER_REVIEW: "Under review",
  APPROVED: "Approved",
  REJECTED: "Rejected",
};

export const passportStatusLabels: Record<PassportStatus, string> = {
  SUBMITTED: "Submitted",
  EVALUATED: "Evaluated",
  UNDER_REVIEW: "Under review",
  APPROVED: "Approved",
  REJECTED: "Rejected",
};

export const paymentStatusLabels: Record<BackendPaymentStatus, string> = {
  PENDING_EVALUATION: "Awaiting evaluation",
  AWAITING_PAYMENT: "Awaiting payment",
  PARTIALLY_PAID: "Part paid",
  FULLY_PAID: "Paid",
  REFUNDED: "Refunded",
};

export const visaCategoryLabels: Record<BackendVisaCategory, string> = {
  TOURIST: "Tourist",
  BUSINESS: "Business",
  STUDENT: "Student",
  WORK: "Work",
  TRANSIT: "Transit",
};

export const roleLabels: Record<BackendUserRole, string> = {
  MANAGER: "Manager",
  PARTNER: "Partner",
  STAFF: "Staff",
};

/** `FIVE_YEARS` / `THIRTY_TWO_PAGES` and friends read badly untouched. */
export function humanise(value: string) {
  return value
    .toLowerCase()
    .split("_")
    .map((part, i) => (i === 0 ? part.charAt(0).toUpperCase() + part.slice(1) : part))
    .join(" ");
}
