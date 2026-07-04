import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { format } from "date-fns";
import UserLayout from "@/layouts/UserLayout";
import { useMyLoans } from "@/hooks/useMyLoans";
import type { LoanStatusFilter, Loan } from "@/types/api/loans";

const PROFILE_TABS = [
  { label: "Profile", to: "/profile" },
  { label: "Borrowed List", to: "/loans" },
  { label: "Reviews", to: "/reviews" },
];

function ProfileTabs({ active }: { active: string }) {
  return (
    <div
      className="flex items-center gap-2 p-1.5 rounded-2xl w-full md:w-auto"
      style={{ background: "#F5F5F5" }}
    >
      {PROFILE_TABS.map((tab) => (
        <Link
          key={tab.to}
          to={tab.to}
          className={`flex-1 md:flex-none flex items-center justify-center px-4 py-2 rounded-xl font-semibold tracking-[-0.02em] text-sm leading-7 transition-all ${ active === tab.label ? "bg-white font-bold text-neutral-950 shadow-[0px_0px_20px_rgba(203,202,202,0.25)]" : "text-neutral-600 hover:text-neutral-950" }`}
        >
          {tab.label}
        </Link>
      ))}
    </div>
  );
}

/* ── Status badge ── */
function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { bg: string; color: string; label: string }> = {
    BORROWED: { bg: "rgba(36,165,0,0.05)", color: "#24A500", label: "Active" },
    RETURNED: {
      bg: "rgba(83,88,98,0.08)",
      color: "#535862",
      label: "Returned",
    },
    LATE: { bg: "rgba(238,29,82,0.1)", color: "#EE1D52", label: "Overdue" },
  };
  const s = map[status] ?? map["BORROWED"];
  return (
    <span
      className="inline-flex items-center justify-center px-2 font-bold tracking-[-0.02em] text-sm leading-7"
      style={{ background: s.bg, color: s.color, borderRadius: 4, height: 28 }}
    >
      {s.label}
    </span>
  );
}

/* ── Due date badge ── */
function DueDateBadge({ iso }: { iso: string }) {
  const formatted = (() => {
    try {
      return format(new Date(iso), "d MMMM yyyy");
    } catch {
      return iso;
    }
  })();
  return (
    <span className="font-bold text-[#EE1D52] tracking-[-0.02em] text-sm leading-7">
      {formatted}
    </span>
  );
}

/* ── Single loan card ── */
function LoanCard({ loan }: { loan: Loan }) {
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_API_BASE_URL as string;
  const coverSrc = loan.book?.coverImage
    ? `${BASE_URL}/${loan.book.coverImage}`
    : null;

  const borrowedDate = (() => {
    try {
      return format(new Date(loan.borrowedAt), "d MMM yyyy");
    } catch {
      return loan.borrowedAt;
    }
  })();

  return (
    <div
      className="flex flex-col gap-3 p-4 md:p-5 bg-white rounded-2xl shadow-[0px_0px_20px_rgba(203,202,202,0.25)]"
    >
      {/* Row 1: Status + Due Date */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className="font-bold text-neutral-950 tracking-[-0.02em] text-sm leading-7"
          >
            Status
          </span>
          <StatusBadge status={loan.status} />
        </div>
        <div className="flex items-center gap-2">
          <span
            className="font-bold text-neutral-950 tracking-[-0.02em] text-sm leading-7"
          >
            Due Date
          </span>
          <DueDateBadge iso={loan.dueAt} />
        </div>
      </div>

      {/* Divider */}
      <div className="w-full h-px bg-neutral-200" />

      {/* Row 2: Book info + Give Review button */}
      <div className="flex items-center gap-3 md:gap-4">
        {/* Cover */}
        <Link
          to={`/books/${loan.bookId}`}
          className="shrink-0 w-[60px] h-[90px] md:w-[92px] md:h-[138px] bg-neutral-200 rounded overflow-hidden"
        >
          {coverSrc ? (
            <img
              src={coverSrc}
              alt={loan.book?.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center text-neutral-400 text-xs text-center px-1"
            >
              No Cover
            </div>
          )}
        </Link>

        {/* Info + button */}
        <div className="flex flex-col gap-1 flex-1 min-w-0">
          {/* Category badge */}
          <div
            className="inline-flex items-center px-2 border border-neutral-300 self-start"
            style={{ height: 24, borderRadius: 4 }}
          >
            <span
              className="font-bold text-neutral-950 tracking-[-0.02em] text-xs leading-5"
            >
              Category
            </span>
          </div>

          {/* Book name */}
          <p
            className="font-bold text-neutral-950 tracking-[-0.02em] text-sm leading-7 md:text-base md:leading-[30px] line-clamp-2"
          >
            {loan.book?.title ?? "Unknown Book"}
          </p>

          {/* Author */}
          <p
            className="font-medium tracking-[-0.03em] text-xs leading-5 md:text-sm md:leading-7"
            style={{ color: "#414651" }}
          >
            Author name
          </p>

          {/* Date · duration */}
          <p
            className="font-medium text-neutral-950 tracking-[-0.03em] text-xs leading-5 md:text-sm md:leading-7"
          >
            {borrowedDate}
            <span
              className="mx-1 inline-block w-[2px] h-[2px] bg-neutral-950 rounded-full align-middle"
            />
            Duration {loan.durationDays}{" "}
            {loan.durationDays === 1 ? "Day" : "Days"}
          </p>

          {/* Give Review button */}
          <button
            onClick={() => navigate(`/books/${loan.bookId}#reviews`)}
            className="w-full h-10 flex items-center justify-center rounded-full bg-primary hover:bg-primary/90 text-white font-bold tracking-[-0.02em] text-sm leading-7 transition-colors mt-1"
          >
            Give Review
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Filter pills ── */
const FILTERS: { label: string; value: LoanStatusFilter }[] = [
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "Returned", value: "returned" },
  { label: "Overdue", value: "overdue" },
];

/* ── Main page ── */
export default function BorrowedList() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<LoanStatusFilter>("all");
  const [page, setPage] = useState(1);
  const LIMIT = 10;

  const { data, isLoading, isError } = useMyLoans({
    status,
    q: search || undefined,
    page,
    limit: LIMIT,
  });

  const loans = data?.data ?? [];
  const totalPages = data?.meta?.totalPages ?? 1;

  return (
    <UserLayout>
      <div className="flex flex-col w-full px-4 md:px-[120px] py-6 md:py-8 gap-5">
        {/* Tab switcher */}
        <ProfileTabs active="Borrowed List" />

        {/* Page title */}
        <h1
          className="font-bold text-neutral-950 tracking-[-0.02em] text-[24px] leading-9 md:text-[28px] md:leading-[38px]"
        >
          Borrowed List
        </h1>

        {/* Search */}
        <div
          className="flex items-center gap-1.5 px-4 h-11 border border-neutral-300 rounded-full bg-white w-full md:w-[600px]"
        >
          <Search
            className="w-5 h-5 text-neutral-600 shrink-0"
            strokeWidth={1.25}
          />
          <input
            type="text"
            placeholder="Search book"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="flex-1 bg-transparent font-medium text-neutral-600 tracking-[-0.03em] text-sm leading-7 outline-none placeholder:text-neutral-500"
          />
        </div>

        {/* Filter pills */}
        <div className="flex items-center gap-2 flex-wrap">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => {
                setStatus(f.value);
                setPage(1);
              }}
              className="flex items-center justify-center px-4 h-10 rounded-full border transition-colors font-semibold tracking-[-0.02em] text-sm leading-7"
              style={{
                background: status === f.value ? "#F6F9FE" : "transparent",
                borderColor: status === f.value ? "#1C65DA" : "#D5D7DA",
                color: status === f.value ? "#1C65DA" : "#0A0D12",
                fontWeight: status === f.value ? 700 : 600,
              }}
            >
              {f.label}
            </button>
          ))}
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
            className="flex justify-center py-20 text-sm"
            style={{ color: "#EE1D52" }}
          >
            Failed to load loans.
          </div>
        )}

        {/* Empty */}
        {!isLoading && !isError && loans.length === 0 && (
          <div className="flex flex-col items-center gap-3 py-20">
            <p className="text-sm text-neutral-400 text-center">
              No loans found.
            </p>
            <Link
              to="/books"
              className="flex items-center justify-center px-6 h-11 rounded-full bg-primary text-white font-bold tracking-[-0.02em] text-base leading-[30px] hover:bg-primary/90 transition-colors"
            >
              Browse Books
            </Link>
          </div>
        )}

        {/* Loan cards */}
        {!isLoading && !isError && loans.length > 0 && (
          <div className="flex flex-col gap-4">
            {loans.map((loan) => (
              <LoanCard key={loan.id} loan={loan} />
            ))}
          </div>
        )}

        {/* Load More */}
        {!isLoading && page < totalPages && (
          <div className="flex justify-center">
            <button
              onClick={() => setPage((p) => p + 1)}
              className="font-semibold text-neutral-950 tracking-[-0.02em] text-sm leading-7 hover:text-primary transition-colors underline underline-offset-2"
            >
              Load More
            </button>
          </div>
        )}
      </div>
    </UserLayout>
  );
}
