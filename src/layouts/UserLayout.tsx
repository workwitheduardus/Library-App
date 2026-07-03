import type { ReactNode } from "react";
import UserHeader from "@/components/user/UserHeader";
import UserFooter from "@/components/user/UserFooter";

export default function UserLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      <UserHeader />
      <main className="flex-1">{children}</main>
      <UserFooter />
    </div>
  );
}
