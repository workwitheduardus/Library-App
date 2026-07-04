import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { format, addDays } from "date-fns";
import UserLayout from "@/layouts/UserLayout";
import { useMe } from "@/hooks/useMe";
import { useCart, useBorrowFromCart } from "@/hooks/useCart";

const DURATION_OPTIONS = [
  { label: "3 Days", value: 3 },
  { label: "5 Days", value: 5 },
  { label: "10 Days", value: 10 },
];

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-[2px]">
      <span
        className="font-semibold text-neutral-950 tracking-[-0.02em]
                   text-sm leading-7"
      >
        {label}
      </span>
      <div
        className="w-full h-12 px-4 flex items-center border border-neutral-200
                   rounded-xl bg-neutral-50"
      >
        <span
          className="font-medium text-neutral-950 tracking-[-0.03em]
                     text-sm leading-7"
        >
          {value}
        </span>
      </div>
    </div>
  );
}

export default function Checkout() {
  const navigate = useNavigate();

  const { data: me, isLoading: loadingMe } = useMe();
  const { data: cart, isLoading: loadingCart } = useCart();
  const { mutate: borrow, isPending: isBorrowing } = useBorrowFromCart();

  const BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

  /* ── form state ── */
  const [borrowDate, setBorrowDate] = useState(
    format(new Date(), "yyyy-MM-dd"),
  );
  const [duration, setDuration] = useState(3);
  const [agreeReturn, setAgreeReturn] = useState(false);
  const [agreePolicy, setAgreePolicy] = useState(false);

  const returnDate = useMemo(() => {
    try {
      return format(addDays(new Date(borrowDate), duration), "d MMMM yyyy");
    } catch {
      return "—";
    }
  }, [borrowDate, duration]);

  const items = cart?.items ?? [];
  const canSubmit =
    agreeReturn && agreePolicy && items.length > 0 && !isBorrowing;

  const handleConfirm = () => {
    if (!canSubmit) return;
    borrow(
      {
        itemIds: items.map((i) => i.id),
        days: duration,
        borrowDate,
      },
      {
        onSuccess: () =>
          navigate("/success", {
            state: { borrowDate, duration },
          }),
      },
    );
  };

  const isLoading = loadingMe || loadingCart;

  return (
    <UserLayout>
      <div className="flex flex-col w-full px-4 md:px-[120px] py-6 md:py-8">
        {/* Page title */}
        <h1
          className="font-bold text-neutral-950 tracking-[-0.02em]
                     text-[24px] leading-9 mb-6
                     md:text-[28px] md:leading-[38px]"
        >
          Checkout
        </h1>

        {isLoading ? (
          <div className="flex justify-center py-20 text-sm text-neutral-400">
            Loading...
          </div>
        ) : (
          /* ── Desktop &  Mobile  ── */
          <div className="flex flex-col md:flex-row md:items-start md:gap-8 w-full">
            {/* ── LEFT COLUMN ── */}
            <div className="flex flex-col gap-6 flex-1 min-w-0">
              {/* User Information */}
              <div
                className="flex flex-col gap-4 p-5 bg-white rounded-2xl shadow-[0px_0px_20px_rgba(203,202,202,0.25)]"
              >
                <h2
                  className="font-bold text-neutral-950 tracking-[-0.02em] text-base leading-[30px]"
                >
                  User Information
                </h2>

                <InfoRow label="Name" value={me?.name ?? "—"} />
                <InfoRow label="Email" value={me?.email ?? "—"} />
                <InfoRow label="Nomor Handphone" value={me?.phone ?? "—"} />
              </div>

              {/* Book List */}
              <div
                className="flex flex-col gap-4 p-5 bg-white rounded-2xl shadow-[0px_0px_20px_rgba(203,202,202,0.25)]"
              >
                <h2
                  className="font-bold text-neutral-950 tracking-[-0.02em] text-base leading-[30px]"
                >
                  Book List
                </h2>

                {items.length === 0 ? (
                  <p className="text-sm text-neutral-400">No items in cart.</p>
                ) : (
                  <div className="flex flex-col divide-y divide-neutral-200">
                    {items.map((item) => {
                      const coverSrc = item.book?.coverImage
                        ? `${BASE_URL}/${item.book.coverImage}`
                        : null;
                      return (
                        <div
                          key={item.id}
                          className="flex items-center gap-3 py-3 first:pt-0"
                        >
                          {/* Cover */}
                          <div
                            className="shrink-0 w-[60px] h-[90px] bg-neutral-200 rounded overflow-hidden"
                          >
                            {coverSrc ? (
                              <img
                                src={coverSrc}
                                alt={item.book?.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div
                                className="w-full h-full flex items-center justify-center text-neutral-400 text-xs text-center px-1"
                              >
                                No Cover
                              </div>
                            )}
                          </div>

                          {/* Info */}
                          <div className="flex flex-col gap-1 min-w-0">
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
                            <p
                              className="font-bold text-neutral-950 tracking-[-0.02em] text-sm leading-7 line-clamp-2"
                            >
                              {item.book?.title ?? "Unknown Book"}
                            </p>
                            <p
                              className="font-medium tracking-[-0.03em] text-xs leading-5"
                              style={{ color: "#414651" }}
                            >
                              Author name
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* ── RIGHT COLUMN  ── */}
            <div
              className="flex flex-col gap-5 p-5 bg-white rounded-2xl shadow-[0px_0px_20px_rgba(203,202,202,0.25)] mt-6 md:mt-0 md:w-[340px] md:shrink-0 md:sticky md:top-24"
            >
              <h2
                className="font-bold text-neutral-950 tracking-[-0.02em] text-base leading-[30px]"
              >
                Complete Your Borrow Request
              </h2>

              {/* Borrow Date */}
              <div className="flex flex-col gap-[2px]">
                <label
                  className="font-bold text-neutral-950 tracking-[-0.02em] text-sm leading-7"
                >
                  Borrow Date
                </label>
                <input
                  type="date"
                  value={borrowDate}
                  min={format(new Date(), "yyyy-MM-dd")}
                  onChange={(e) => setBorrowDate(e.target.value)}
                  className="w-full h-12 px-4 border border-neutral-300 rounded-xl text-sm font-medium text-neutral-950 outline-none focus:border-primary transition-colors bg-white"
                />
              </div>

              {/* Borrow Duration  */}
              <div className="flex flex-col gap-2">
                <label
                  className="font-bold text-neutral-950 tracking-[-0.02em] text-sm leading-7"
                >
                  Borrow Duration
                </label>
                <div className="flex flex-col gap-2">
                  {DURATION_OPTIONS.map((opt) => (
                    <label
                      key={opt.value}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="duration"
                        value={opt.value}
                        checked={duration === opt.value}
                        onChange={() => setDuration(opt.value)}
                        className="w-4 h-4 accent-primary cursor-pointer"
                      />
                      <span
                        className="font-medium text-neutral-950 tracking-[-0.03em] text-sm leading-7"
                      >
                        {opt.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Return Date — calculated, red text */}
              <div className="flex flex-col gap-[2px]">
                <span
                  className="font-bold text-neutral-950 tracking-[-0.02em] text-sm leading-7"
                >
                  Return Date
                </span>
                <p className="font-medium tracking-[-0.03em] text-sm leading-7">
                  Please return the book no later than{" "}
                  <span className="font-bold text-[#EE1D52]">{returnDate}</span>
                </p>
              </div>

              {/* Checkboxes */}
              <div className="flex flex-col gap-3">
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreeReturn}
                    onChange={(e) => setAgreeReturn(e.target.checked)}
                    className="w-4 h-4 mt-1 rounded accent-primary cursor-pointer shrink-0"
                  />
                  <span
                    className="font-medium text-neutral-950 tracking-[-0.03em] text-sm leading-7"
                  >
                    I agree to return the book(s) before the due date.
                  </span>
                </label>

                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreePolicy}
                    onChange={(e) => setAgreePolicy(e.target.checked)}
                    className="w-4 h-4 mt-1 rounded accent-primary cursor-pointer shrink-0"
                  />
                  <span
                    className="font-medium text-neutral-950 tracking-[-0.03em] text-sm leading-7"
                  >
                    I accept the library borrowing policy.
                  </span>
                </label>
              </div>

              {/* Confirm & Borrow */}
              <button
                onClick={handleConfirm}
                disabled={!canSubmit}
                className="w-full h-12 flex items-center justify-center rounded-full bg-primary hover:bg-primary/90 text-white font-bold tracking-[-0.02em] text-base leading-[30px] disabled:opacity-40 transition-opacity"
              >
                {isBorrowing ? "Processing..." : "Confirm & Borrow"}
              </button>
            </div>
          </div>
        )}
      </div>
    </UserLayout>
  );
}
