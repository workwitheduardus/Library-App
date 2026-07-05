import { useState } from "react";
import { Search } from "lucide-react";
import { format } from "date-fns";
import AdminLayout from "./AdminLayout";
import { useAdminLoans } from "@/hooks/useAdminLoans";
import type { AdminLoan } from "@/types/api/admin";
import type { AdminLoanStatusFilter } from "@/types/api/admin";

/* ── helpers ── */
function formatDate(iso: string) {
  try {
    return format(new Date(iso), "d MMM yyyy");
  } catch {
    return iso;
  }
}

function formatDuration(days: number) {
  return `Duration ${days} ${days === 1 ? "Day" : "Days"}`;
}

/* ── Status badge ── */
function StatusBadge({ status }: { status: string }) {
  const isReturned = status === "RETURNED";
  const isLate = status === "LATE";

  let bg = "rgba(36,165,0,0.05)";
  let color = "#24A500";
  let label = "Active";

  if (isReturned) {
    bg = "rgba(83,88,98,0.08)";
    color = "#535862";
    label = "Returned";
  }
  if (isLate) {
    bg = "rgba(238,29,82,0.1)";
    color = "#EE1D52";
    label = "Overdue";
  }

  return (
    <span
      className="inline-flex items-center justify-center px-2 rounded font-bold
                 tracking-[-0.02em] text-sm leading-7"
      style={{ background: bg, color, height: 32, borderRadius: 4 }}
    >
      {label}
    </span>
  );
}

/* ── Due date badge ── */
function DueDateBadge({ iso }: { iso: string }) {
  return (
    <span
      className="inline-flex items-center justify-center px-2 font-bold
                 text-neutral-950 tracking-[-0.02em] text-sm leading-7"
      style={{ background: "rgba(238,29,82,0.1)", borderRadius: 4, height: 32 }}
    >
      {formatDate(iso)}
    </span>
  );
}

/* ── Single loan card ── */
function LoanCard({ loan }: { loan: AdminLoan }) {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL as string;
  const coverSrc = loan.book?.coverImage
    ? `${BASE_URL}/${loan.book.coverImage}`
    : null;

  return (
    <div
      className="w-full flex flex-col gap-4 p-4 md:p-5 bg-white rounded-2xl"
      style={{ boxShadow: "0px 0px 20px rgba(203,202,202,0.25)" }}
    >
      {/* ── Row 1: Status + Due Date ── */}
      <div
        className="flex items-center justify-between w-full"
        style={{ minHeight: 32 }}
      >
        {/* Status */}
        <div className="flex items-center gap-3">
          <span
            className="font-bold text-neutral-950 tracking-[-0.02em]
                       text-sm leading-7 md:text-base md:leading-[30px]"
          >
            Status
          </span>
          <StatusBadge status={loan.status} />
        </div>

        {/* Due Date */}
        <div className="flex items-center gap-3">
          <span
            className="font-bold text-neutral-950 tracking-[-0.02em]
                       text-sm leading-7 md:text-base md:leading-[30px]"
          >
            Due Date
          </span>
          <DueDateBadge iso={loan.dueAt} />
        </div>
      </div>

      {/* Divider */}
      <div className="w-full h-px bg-neutral-300" />

      {/* ── Row 2: Book info + Borrower ── */}
      <div className="flex items-center justify-between w-full">
        {/* Book: cover + details */}
        <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
          <div className="shrink-0 w-[92px] h-[138px] bg-neutral-200 rounded overflow-hidden">
            {coverSrc ? (
              <img
                src={coverSrc}
                alt={loan.book?.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center
                                text-neutral-400 text-xs text-center px-1"
              >
                No Cover
              </div>
            )}
          </div>

          {/* Text info */}
          <div className="flex flex-col gap-1 min-w-0">
            {/* Category badge */}
            <div
              className="inline-flex items-center justify-center px-2 border
                         border-neutral-300 self-start"
              style={{ height: 28, borderRadius: 6 }}
            >
              <span
                className="font-bold text-neutral-950 tracking-[-0.02em] text-sm"
                style={{ lineHeight: "28px" }}
              >
                Category
              </span>
            </div>

            {/* Book name */}
            <p
              className="font-bold text-neutral-950 tracking-[-0.02em] truncate
                         text-base leading-[30px]
                         md:text-xl md:leading-[34px]"
            >
              {loan.book?.title ?? "Unknown Book"}
            </p>

            {/* Author */}
            <p
              className="font-medium truncate tracking-[-0.03em]
                         text-sm leading-7
                         md:text-base md:leading-[30px]"
              style={{ color: "#414651" }}
            >
              Author name
            </p>

            {/* Borrow date */}
            <div className="flex items-center gap-2">
              <span
                className="font-bold text-neutral-950 tracking-[-0.02em]
                           text-sm leading-7 md:text-base md:leading-[30px]"
              >
                {formatDate(loan.borrowedAt)}
              </span>
              {/* Dot separator */}
              <span className="w-[2px] h-[2px] rounded-full bg-neutral-950 shrink-0" />
              <span
                className="font-bold text-neutral-950 tracking-[-0.02em]
                           text-sm leading-7 md:text-base md:leading-[30px]"
              >
                {formatDuration(loan.durationDays)}
              </span>
            </div>
          </div>
        </div>

        {/* Borrower name  */}
        <div
          className="flex flex-col justify-center items-start shrink-0 pl-4"
          style={{ width: "clamp(110px, 12%, 126px)" }}
        >
          <span
            className="font-semibold text-neutral-950 tracking-[-0.02em]
                       text-sm leading-7 md:text-base md:leading-[30px]"
          >
            borrower's name
          </span>
          <span
            className="font-bold text-neutral-950 tracking-[-0.02em]
                       text-base leading-[30px] md:text-xl md:leading-[34px]"
          >
            {loan.borrower?.name ?? "—"}
          </span>
        </div>
      </div>
    </div>
  );
}

/* ── Filter pills ── */
const FILTERS: { label: string; value: AdminLoanStatusFilter }[] = [
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "Returned", value: "returned" },
  { label: "Overdue", value: "overdue" },
];

/* ── Main page ── */
export default function BorrowedList() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<AdminLoanStatusFilter>("all");
  const [page, setPage] = useState(1);
  const LIMIT = 10;

  const { data, isLoading, isError } = useAdminLoans({
    status: statusFilter,
    q: search || undefined,
    page,
    limit: LIMIT,
  });

  const loans = data?.data ?? [];

  return (
    <AdminLayout>
      {/* Page title */}
      <h1
        className="font-bold text-neutral-950 mb-4
                   text-[24px] leading-9
                   md:text-[28px] md:leading-[38px] md:tracking-[-0.03em]"
      >
        Borrowed List
      </h1>

      {/* Search bar */}
      <div
        className="flex items-center gap-1.5 px-4 border border-neutral-300
                   rounded-full bg-white mb-4 w-full md:w-[600px]
                   h-11 md:h-12"
      >
        <Search
          className="w-5 h-5 text-neutral-600 shrink-0"
          strokeWidth={1.25}
        />
        <input
          type="text"
          placeholder="Search"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="flex-1 bg-transparent font-medium text-neutral-600
                     tracking-[-0.03em] leading-7 outline-none
                     placeholder:text-neutral-500 text-sm"
        />
      </div>

      {/* Filter pills — All / Active / Returned / Overdue */}
      <div className="flex items-center gap-2 md:gap-3 flex-wrap mb-4 md:mb-6">
        {FILTERS.map((f) => {
          const active = statusFilter === f.value;
          return (
            <button
              key={f.value}
              onClick={() => {
                setStatusFilter(f.value);
                setPage(1);
              }}
              className="flex items-center justify-center px-4 h-10 rounded-full
                         border transition-colors tracking-[-0.02em]"
              style={{
                background: active ? "#F6F9FE" : "transparent",
                borderColor: active ? "#1C65DA" : "#D5D7DA",
                color: active ? "#1C65DA" : "#0A0D12",
                fontWeight: active ? 700 : 600,
                fontSize: 16,
                lineHeight: "30px",
              }}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex justify-center py-20 text-sm text-neutral-400">
          Loading loans...
        </div>
      )}

      {/* Error */}
      {isError && (
        <div
          className="flex justify-center py-20 text-sm font-medium"
          style={{ color: "#D9206E" }}
        >
          Failed to load loans. Try refreshing.
        </div>
      )}

      {/* Loan cards */}
      {!isLoading && !isError && (
        <div className="flex flex-col gap-4 md:gap-[15px]">
          {loans.length === 0 ? (
            <p className="text-center text-sm text-neutral-400 py-10">
              No loans found.
            </p>
          ) : (
            loans.map((loan) => <LoanCard key={loan.id} loan={loan} />)
          )}
        </div>
      )}
    </AdminLayout>
  );
}
