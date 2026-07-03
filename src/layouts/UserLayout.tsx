import type { ReactNode } from "react";
import UserHeader from "@/components/user/UserHeader";

export default function UserLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      <UserHeader />
      <main className="flex-1">{children}</main>
    </div>
  );
}
