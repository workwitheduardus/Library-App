import { useState } from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import AdminLayout from "./AdminLayout";
import { useAdminUsers } from "@/hooks/useAdminUsers";
import type { AdminUser } from "@/types/api/admin";

function formatDate(iso: string) {
  try {
    return format(new Date(iso), "d MMM yyyy, HH:mm");
  } catch {
    return iso;
  }
}

/* ── Mobile card ── */
function UserCard({ user, index }: { user: AdminUser; index: number }) {
  const rows: { label: string; value: string; bold?: boolean }[] = [
    { label: "No", value: String(index) },
    { label: "Name", value: user.name },
    { label: "Email", value: user.email, bold: true },
    { label: "Nomor Handphone", value: user.phone, bold: true },
    { label: "Created at", value: formatDate(user.createdAt), bold: true },
  ];

  return (
    <div
      className="w-full flex flex-col gap-1 p-3 bg-white rounded-xl"
      style={{ boxShadow: "0px 0px 20px rgba(203,202,202,0.25)" }}
    >
      {rows.map((r) => (
        <div
          key={r.label}
          className="flex flex-row justify-between items-center w-full"
          style={{ minHeight: 28 }}
        >
          <span
            className="font-semibold text-neutral-950 tracking-[-0.02em]"
            style={{ fontSize: 14, lineHeight: "28px" }}
          >
            {r.label}
          </span>
          <span
            className={`text-neutral-950 tracking-[-0.02em] ${r.bold ? "font-bold" : "font-semibold"}`}
            style={{ fontSize: 14, lineHeight: "28px" }}
          >
            {r.value}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ── Desktop table row ── */
function UserRow({ user, index }: { user: AdminUser; index: number }) {
  const cells = [
    { value: String(index), width: 44 },
    { value: user.name, width: 281 },
    { value: user.phone, width: 281 },
    { value: user.email, width: 281 },
    { value: formatDate(user.createdAt), width: 281 },
  ];

  return (
    <div className="flex flex-row items-start w-full" style={{ height: 64 }}>
      {cells.map((cell, i) => (
        <div
          key={i}
          className="flex items-center px-4 py-2 border-b border-neutral-300"
          style={{
            width: cell.width,
            minWidth: cell.width,
            height: 64,
            flexGrow: i === 0 ? 0 : 1,
          }}
        >
          <span
            className="font-semibold text-neutral-950 tracking-[-0.02em] truncate"
            style={{ fontSize: 16, lineHeight: "30px" }}
          >
            {cell.value}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ── Pagination ── */
function Pagination({
  page,
  totalPages,
  total,
  limit,
  onChange,
}: {
  page: number;
  totalPages: number;
  total: number;
  limit: number;
  onChange: (p: number) => void;
}) {
  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  const pages: (number | "...")[] = [];
  if (totalPages <= 4) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1, 2, 3, "...");
  }

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 w-full mt-4">
      {/* "Showing X to Y of Z entries" — desktop only */}
      <span
        className="hidden md:block font-medium text-neutral-950 tracking-[-0.03em]"
        style={{ fontSize: 16, lineHeight: "30px" }}
      >
        Showing {start} to {end} of {total} entries
      </span>

      {/* Page buttons */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => onChange(page - 1)}
          disabled={page <= 1}
          className="flex items-center gap-1.5 disabled:opacity-40"
        >
          <ChevronLeft className="w-6 h-6 text-neutral-950" strokeWidth={2} />
          <span
            className="font-medium text-neutral-950 tracking-[-0.03em]"
            style={{ fontSize: 16, lineHeight: "30px" }}
          >
            Previous
          </span>
        </button>

        <div className="flex items-center">
          {pages.map((p, i) =>
            p === "..." ? (
              <div
                key={`ellipsis-${i}`}
                className="w-10 h-10 flex items-center justify-center"
              >
                <span
                  className="font-medium text-neutral-950 tracking-[-0.03em] text-center"
                  style={{ fontSize: 16, lineHeight: "30px" }}
                >
                  ...
                </span>
              </div>
            ) : (
              <button
                key={p}
                onClick={() => onChange(p)}
                className="w-10 h-10 flex items-center justify-center"
                style={
                  p === page
                    ? {}
                    : {
                        border: "1px solid #D5D7DA",
                        borderRadius: 10,
                      }
                }
              >
                <span
                  className="font-medium text-neutral-950 tracking-[-0.03em] text-center"
                  style={{ fontSize: 16, lineHeight: "30px" }}
                >
                  {p}
                </span>
              </button>
            ),
          )}
        </div>

        <button
          onClick={() => onChange(page + 1)}
          disabled={page >= totalPages}
          className="flex items-center gap-1.5 disabled:opacity-40"
        >
          <span
            className="font-medium text-neutral-950 tracking-[-0.03em]"
            style={{ fontSize: 16, lineHeight: "30px" }}
          >
            Next
          </span>
          <ChevronRight className="w-6 h-6 text-neutral-950" strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}

/* ── Main page ── */
export default function UserList() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const LIMIT = 10;

  const { data, isLoading, isError } = useAdminUsers({
    q: search || undefined,
    page,
    limit: LIMIT,
  });

  const users = data?.data ?? [];
  const total = data?.meta?.total ?? 0;
  const totalPages = data?.meta?.totalPages ?? 1;

  return (
    <AdminLayout>
      {/* Page title */}
      <h1
        className="font-bold text-neutral-950 mb-6
                   text-[24px] leading-[36px]
                   md:text-[28px] md:leading-[38px] md:tracking-[-0.02em]"
      >
        User
      </h1>

      {/* Search bar */}
      <div
        className="flex items-center gap-1.5 px-4 py-2 border border-neutral-300
                   rounded-full bg-white mb-[15px] md:mb-6 w-full md:w-[600px]"
        style={{ height: 44 }}
      >
        <Search
          className="w-5 h-5 text-neutral-600 shrink-0"
          strokeWidth={1.25}
        />
        <input
          type="text"
          placeholder="Search user"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="flex-1 bg-transparent text-sm font-medium text-neutral-600
                     tracking-[-0.03em] leading-[28px] outline-none placeholder:text-neutral-500"
        />
      </div>

      {/* ── Loading ── */}
      {isLoading && (
        <div className="flex items-center justify-center py-20 text-neutral-400 text-sm">
          Loading users...
        </div>
      )}

      {/* ── Error ── */}
      {isError && (
        <div className="flex items-center justify-center py-20 text-accent-red text-sm">
          Failed to load users. Check your connection and try again.
        </div>
      )}

      {/* ── Mobile: card list ── */}
      {!isLoading && !isError && (
        <div className="flex flex-col gap-[15px] md:hidden">
          {users.length === 0 ? (
            <p className="text-center text-sm text-neutral-400 py-10">
              No users found.
            </p>
          ) : (
            users.map((user, i) => (
              <UserCard
                key={user.id}
                user={user}
                index={(page - 1) * LIMIT + i + 1}
              />
            ))
          )}
          <Pagination
            page={page}
            totalPages={totalPages}
            total={total}
            limit={LIMIT}
            onChange={setPage}
          />
        </div>
      )}

      {/* ── Desktop: table ── */}
      {!isLoading && !isError && (
        <div
          className="hidden md:flex flex-col w-full bg-white border border-neutral-300 rounded-xl p-4"
          style={{ boxShadow: "0px 0px 24px rgba(203,202,202,0.2)" }}
        >
          {/* Table header */}
          <div className="flex flex-row w-full" style={{ height: 64 }}>
            {["No", "Name", "Nomor Handphone", "Email", "Created at"].map(
              (col, i) => (
                <div
                  key={col}
                  className="flex items-center px-4 py-2 bg-neutral-50"
                  style={{
                    width: i === 0 ? 44 : 281,
                    minWidth: i === 0 ? 44 : 281,
                    height: 64,
                    flexGrow: i === 0 ? 0 : 1,
                  }}
                >
                  <span
                    className="font-bold text-neutral-950 tracking-[-0.02em]"
                    style={{ fontSize: 14, lineHeight: "28px" }}
                  >
                    {col}
                  </span>
                </div>
              ),
            )}
          </div>

          {/* Table rows */}
          {users.length === 0 ? (
            <div className="flex items-center justify-center py-10 text-sm text-neutral-400">
              No users found.
            </div>
          ) : (
            users.map((user, i) => (
              <UserRow
                key={user.id}
                user={user}
                index={(page - 1) * LIMIT + i + 1}
              />
            ))
          )}

          {/* Table footer */}
          <Pagination
            page={page}
            totalPages={totalPages}
            total={total}
            limit={LIMIT}
            onChange={setPage}
          />
        </div>
      )}
    </AdminLayout>
  );
}
