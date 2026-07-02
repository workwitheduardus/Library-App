import { useNavigate, useLocation } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppSelector } from "@/app/store";
import BookyLogo from "@/assets/Booky-logo.svg";

const TABS = [
  { label: "Borrowed List", path: "/admin/loans" },
  { label: "User", path: "/admin/users" },
  { label: "Book List", path: "/admin/books" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAppSelector((s) => s.auth.user);

  return (
    <div className="min-h-screen bg-white">
      {/* ── Header ── */}
      <header
        className="w-full bg-white flex items-center justify-between px-4 md:px-[120px]"
        style={{
          height: 64,
          boxShadow: "0px 0px 20px rgba(203,202,202,0.25)",
        }}
      >
        {/* Logo — mobile: 40px, desktop: 42px */}
        <div className="flex items-center gap-[15px]">
          <img
            src={BookyLogo}
            alt="Booky"
            className="w-[40px] h-[40px] md:w-[42px] md:h-[42px] shrink-0"
          />
          <span
            className="hidden md:block font-bold text-neutral-950"
            style={{ fontSize: 32, lineHeight: "42px" }}
          >
            Booky
          </span>
        </div>

        {/* User avatar + name */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 md:gap-4">
            {/* Avatar circle */}
            <div className="w-[40px] h-[40px] md:w-[48px] md:h-[48px] rounded-full bg-neutral-200 shrink-0 overflow-hidden">
              <div className="w-full h-full flex items-center justify-center text-neutral-600 font-semibold text-sm">
                {user?.name?.[0]?.toUpperCase() ?? "A"}
              </div>
            </div>
            {/* Name + chevron — desktop only */}
            <span
              className="hidden md:block font-semibold text-neutral-950 tracking-[-0.02em]"
              style={{ fontSize: 18, lineHeight: "32px" }}
            >
              {user?.name ?? "Admin"}
            </span>
            <ChevronDown className="hidden md:block w-6 h-6 text-neutral-950" />
          </div>
        </div>
      </header>

      {/* ── Content area ── */}
      <main className="px-4 md:px-[120px] pt-[30px] pb-10">
        <div
          className="flex items-center gap-2 p-2 rounded-2xl mb-[30px]"
          style={{ background: "#F5F5F5" }}
        >
          {TABS.map((tab) => {
            const active = location.pathname === tab.path;
            return (
              <button
                key={tab.path}
                onClick={() => navigate(tab.path)}
                className={cn(
                  "flex-1 flex items-center justify-center px-3 py-2 rounded-xl transition-all",
                  "font-quicksand tracking-[-0.02em]",
                  active
                    ? "bg-white font-bold text-neutral-950 text-sm md:text-base"
                    : "font-medium text-neutral-600 text-sm md:text-base tracking-[-0.03em]",
                )}
                style={
                  active
                    ? { boxShadow: "0px 0px 20px rgba(203,202,202,0.25)" }
                    : {}
                }
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {children}
      </main>
    </div>
  );
}
