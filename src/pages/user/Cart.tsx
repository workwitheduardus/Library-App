import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Trash2 } from "lucide-react";
import UserLayout from "@/layouts/UserLayout";
import {
  useCart,
  useRemoveCartItem,
} from "@/hooks/useCart";
import type { CartItem } from "@/types/api/cart";

/* ── Single cart item row ── */
function CartItemRow({
  item,
  checked,
  onCheck,
  onRemove,
  isRemoving,
}: {
  item: CartItem;
  checked: boolean;
  onCheck: () => void;
  onRemove: () => void;
  isRemoving: boolean;
}) {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL as string;
  const coverSrc = item.book?.coverImage
    ? `${BASE_URL}/${item.book.coverImage}`
    : null;

  return (
    <div className="flex items-center gap-3 py-4 border-b border-neutral-200 last:border-0">
      {/* Checkbox */}
      <input
        type="checkbox"
        checked={checked}
        onChange={onCheck}
        className="w-4 h-4 rounded accent-primary cursor-pointer shrink-0"
      />

      {/* Cover */}
      <Link
        to={`/books/${item.bookId}`}
        className="shrink-0 bg-neutral-200 rounded overflow-hidden w-[60px] h-[90px] md:w-[92px] md:h-[138px]"
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
      </Link>

      {/* Info */}
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
          {item.book?.title ?? "Unknown Book"}
        </p>

        {/* Author */}
        <p
          className="font-medium tracking-[-0.03em] text-xs leading-5 md:text-sm md:leading-7"
          style={{ color: "#414651" }}
        >
          Author name
        </p>
      </div>

      {/* Delete button */}
      <button
        onClick={onRemove}
        disabled={isRemoving}
        className="shrink-0 w-8 h-8 flex items-center justify-center text-neutral-400 hover:text-[#EE1D52] transition-colors disabled:opacity-40"
        aria-label="Remove item"
      >
        <Trash2 className="w-5 h-5" strokeWidth={1.5} />
      </button>
    </div>
  );
}

/* ── Loan Summary ── */
function LoanSummary({
  count,
  onBorrow,
  isBorrowing,
  disabled,
}: {
  count: number;
  onBorrow: () => void;
  isBorrowing: boolean;
  disabled: boolean;
}) {
  return (
    <div
      className="flex flex-col gap-4 p-5 bg-white rounded-2xl shadow-[0px_0px_20px_rgba(203,202,202,0.25)]"
    >
      <p
        className="font-bold text-neutral-950 tracking-[-0.02em] text-base leading-[30px]"
      >
        Loan Summary
      </p>

      <div className="flex items-center justify-between">
        <span
          className="font-semibold text-neutral-950 tracking-[-0.02em] text-sm leading-7"
        >
          Total Book
        </span>
        <span
          className="font-bold text-neutral-950 tracking-[-0.02em] text-sm leading-7"
        >
          {count} {count === 1 ? "item" : "items"}
        </span>
      </div>

      <button
        onClick={onBorrow}
        disabled={disabled || isBorrowing}
        className="w-full h-12 flex items-center justify-center rounded-full bg-primary hover:bg-primary/90 text-white font-bold tracking-[-0.02em] text-base leading-[30px] disabled:opacity-40 transition-opacity"
      >
        {isBorrowing ? "Processing..." : "Borrow Book"}
      </button>
    </div>
  );
}

/* ── Main Cart ── */
export default function Cart() {
  const navigate = useNavigate();

  const { data: cart, isLoading, isError } = useCart();
  const { mutate: removeItem, isPending: isRemoving } = useRemoveCartItem();

  const items = cart?.items ?? [];

  /* Selected item IDs */
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const allSelected = items.length > 0 && selectedIds.length === items.length;

  const toggleSelectAll = () => {
    setSelectedIds(allSelected ? [] : items.map((i) => i.id));
  };

  const toggleItem = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const handleBorrow = () => {
    if (selectedIds.length === 0) return;
    navigate("/checkout");
  };

  return (
    <UserLayout>
      <div className="flex flex-col w-full px-4 md:px-[120px] py-6 md:py-8">
        {/* Page title */}
        <h1
          className="font-bold text-neutral-950 tracking-[-0.02em] text-[24px] leading-9 mb-6 md:text-[28px] md:leading-[38px]"
        >
          My Cart
        </h1>

        {/* Loading */}
        {isLoading && (
          <div className="flex justify-center py-20 text-sm text-neutral-400">
            Loading cart...
          </div>
        )}

        {/* Error */}
        {isError && (
          <div
            className="flex justify-center py-20 text-sm"
            style={{ color: "#EE1D52" }}
          >
            Failed to load cart. Try refreshing.
          </div>
        )}

        {/* Empty */}
        {!isLoading && !isError && items.length === 0 && (
          <div className="flex flex-col items-center gap-4 py-20">
            <p className="text-sm text-neutral-400 text-center">
              Your cart is empty.
            </p>
            <Link
              to="/books"
              className="flex items-center justify-center px-6 h-11 rounded-full bg-primary text-white font-bold tracking-[-0.02em] text-base leading-[30px] hover:bg-primary/90 transition-colors"
            >
              Browse Books
            </Link>
          </div>
        )}

        {/* ── Desktop ── */}
        {!isLoading && !isError && items.length > 0 && (
          <div className="hidden md:flex items-start gap-8 w-full">
            {/* Left: item list */}
            <div className="flex-1 min-w-0 flex flex-col">
              {/* Select all row */}
              <div className="flex items-center gap-2 pb-3 border-b border-neutral-200">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={toggleSelectAll}
                  className="w-4 h-4 rounded accent-primary cursor-pointer"
                />
                <span
                  className="font-semibold text-neutral-950 tracking-[-0.02em] text-sm leading-7"
                >
                  Select All
                </span>
              </div>

              {/* Items */}
              {items.map((item) => (
                <CartItemRow
                  key={item.id}
                  item={item}
                  checked={selectedIds.includes(item.id)}
                  onCheck={() => toggleItem(item.id)}
                  onRemove={() => removeItem(item.id)}
                  isRemoving={isRemoving}
                />
              ))}
            </div>

            {/* Right: sticky summary panel */}
            <div className="shrink-0 w-[280px] sticky top-24">
              <LoanSummary
                count={selectedIds.length}
                onBorrow={handleBorrow}
                isBorrowing={false}
                disabled={selectedIds.length === 0}
              />
            </div>
          </div>
        )}

        {/* ── Mobile── */}
        {!isLoading && !isError && items.length > 0 && (
          <div className="md:hidden flex flex-col">
            {/* Select all */}
            <div className="flex items-center gap-2 pb-3 border-b border-neutral-200">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={toggleSelectAll}
                className="w-4 h-4 rounded accent-primary cursor-pointer"
              />
              <span
                className="font-semibold text-neutral-950 tracking-[-0.02em] text-sm leading-7"
              >
                Select All
              </span>
            </div>

            {/* Items */}
            {items.map((item) => (
              <CartItemRow
                key={item.id}
                item={item}
                checked={selectedIds.includes(item.id)}
                onCheck={() => toggleItem(item.id)}
                onRemove={() => removeItem(item.id)}
                isRemoving={isRemoving}
              />
            ))}

            <div className="h-24" />
          </div>
        )}
      </div>

      {/* ── Mobile (Floating Menu state)── */}
      {!isLoading && !isError && items.length > 0 && (
        <div
          className="md:hidden fixed bottom-0 left-0 right-0 z-40 flex items-center justify-between px-4 py-3 bg-white shadow-[0px_0px_20px_rgba(203,202,202,0.25)]"
        >
          <div className="flex flex-col">
            <span
              className="font-semibold text-neutral-950 tracking-[-0.02em] text-xs leading-5"
            >
              Total Book
            </span>
            <span
              className="font-bold text-neutral-950 tracking-[-0.02em] text-sm leading-7"
            >
              {selectedIds.length} {selectedIds.length === 1 ? "item" : "items"}
            </span>
          </div>

          <button
            onClick={handleBorrow}
            disabled={selectedIds.length === 0}
            className="h-11 flex items-center justify-center px-8 rounded-full bg-primary hover:bg-primary/90 text-white font-bold tracking-[-0.02em] text-base leading-[30px] disabled:opacity-40 transition-opacity"
          >Borrow Book
          </button>
        </div>
      )}
    </UserLayout>
  );
}
