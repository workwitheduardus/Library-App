import { Link } from "react-router-dom";

const PROFILE_TABS = [
  { label: "Profile", to: "/profile" },
  { label: "Borrowed List", to: "/loans" },
  { label: "Reviews", to: "/reviews" },
];

export default function ProfileTabs({ active }: { active: string }) {
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
