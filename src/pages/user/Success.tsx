import { useLocation, Link } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import { format, addDays } from "date-fns";
import UserLayout from "@/layouts/UserLayout";

export default function Success() {
  const location = useLocation();

  const state = location.state as {
    borrowDate?: string;
    duration?: number;
  } | null;
  const borrowDate =
    state?.borrowDate ?? new Date().toISOString().split("T")[0];
  const duration = state?.duration ?? 7;

  const returnDate = (() => {
    try {
      return format(addDays(new Date(borrowDate), duration), "d MMMM yyyy");
    } catch {
      return "—";
    }
  })();

  return (
    <UserLayout>
      <div
        className="flex flex-1 items-center justify-center px-4 py-16 md:py-24 min-h-[60vh]"
      >
        <div
          className="flex flex-col items-center gap-5 text-center w-full max-w-[361px] md:max-w-[480px]"
        >
          {/* Checkmark icon */}
          <div
            className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-primary flex items-center justify-center shrink-0"
          >
            <CheckCircle
              className="w-8 h-8 md:w-10 md:h-10 text-white fill-white"
              strokeWidth={2.5}
            />
          </div>

          {/* Heading */}
          <h1
            className="font-bold text-neutral-950 tracking-[-0.02em] text-[24px] leading-9 md:text-[28px] md:leading-[38px]"
          >
            Borrowing Successful!
          </h1>

          {/* Subtext */}
          <p
            className="font-medium text-neutral-950 tracking-[-0.03em] text-sm leading-7 md:text-base md:leading-[30px]"
          >
            Your book has been successfully borrowed. Please return it by{" "}
            <span className="font-bold text-[#EE1D52]">{returnDate}</span>
          </p>

          {/* CTA button  */}
          <Link
            to="/loans"
            className="flex items-center justify-center px-8 h-12 rounded-full bg-primary hover:bg-primary/90 text-white font-bold tracking-[-0.02em] text-base leading-[30px] transition-colors mt-2"
          >
            See Borrowed List
          </Link>
        </div>
      </div>
    </UserLayout>
  );
}
