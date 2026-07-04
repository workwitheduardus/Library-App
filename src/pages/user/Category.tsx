import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { SlidersHorizontal, X, Star } from "lucide-react";
import UserLayout from "@/layouts/UserLayout";
import BookCard from "@/components/user/BookCard";
import { useCategories } from "@/hooks/useCategories";
import { useBooks } from "@/hooks/useAdminBooks";

/* ── Rating filter options ── */
const RATING_OPTIONS = [
  { label: "4 & up", value: 4 },
  { label: "3 & up", value: 3 },
  { label: "2 & up", value: 2 },
  { label: "1 & up", value: 1 },
];

/* ── Star display ── */
function RatingStars({ count }: { count: number }) {
  return (
    <div className="flex items-center gap-[2px]">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={
            i <= count ? "fill-[#FFAB0D] text-[#FFAB0D]" : "fill-neutral-200 text-neutral-200"
          }
          style={{ width: 14, height: 14 }}
        />
      ))}
    </div>
  );
}

/* ── Filter panel  ── */
function FilterPanel({
  categories,
  selectedCategories,
  selectedRating,
  onCategoryToggle,
  onRatingChange,
  onClear,
}: {
  categories: { id: number; name: string }[];
  selectedCategories: number[];
  selectedRating: number | null;
  onCategoryToggle: (id: number) => void;
  onRatingChange: (v: number | null) => void;
  onClear: () => void;
}) {
  return (
    <div className="flex flex-col gap-5 w-full">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <span
          className="font-bold text-neutral-950 tracking-[-0.02em] text-sm leading-7"
        >
          FILTER
        </span>
        <button
          onClick={onClear}
          className="font-semibold text-primary tracking-[-0.02em] text-xs leading-5 hover:underline"
        >
          Clear all
        </button>
      </div>

      {/* Category filter */}
      <div className="flex flex-col gap-2">
        <p
          className="font-bold text-neutral-950 tracking-[-0.02em] text-sm leading-7"
        >
          Category
        </p>
        <div className="flex flex-col gap-2">
          {categories.map((cat) => {
            const checked = selectedCategories.includes(cat.id);
            return (
              <label
                key={cat.id}
                className="flex items-center gap-2 cursor-pointer group"
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => onCategoryToggle(cat.id)}
                  className="w-4 h-4 rounded border-neutral-300 accent-primary cursor-pointer"
                />
                <span
                  className={`font-medium tracking-[-0.03em] text-sm leading-7
                    ${
                      checked
                        ? "text-primary font-semibold" : "text-neutral-950"
                    }`}
                >
                  {cat.name}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Rating filter */}
      <div className="flex flex-col gap-2">
        <p
          className="font-bold text-neutral-950 tracking-[-0.02em] text-sm leading-7"
        >
          Rating
        </p>
        <div className="flex flex-col gap-2">
          {RATING_OPTIONS.map((opt) => (
            <label
              key={opt.value}
              className="flex items-center gap-2 cursor-pointer"
            >
              <input
                type="radio"
                name="rating"
                checked={selectedRating === opt.value}
                onChange={() =>
                  onRatingChange(
                    selectedRating === opt.value ? null : opt.value,
                  )
                }
                className="w-4 h-4 accent-primary cursor-pointer"
              />
              <RatingStars count={opt.value} />
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Main page ── */
export default function Category() {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get("categoryId")
    ? Number(searchParams.get("categoryId"))
    : null;

  const [selectedCategories, setSelectedCategories] = useState<number[]>(
    initialCategory ? [initialCategory] : [],
  );
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [page, setPage] = useState(1);

  const { data: categories, isLoading: loadingCats } = useCategories();

  const activeCategoryId = selectedCategories[0] ?? undefined;

  const { data, isLoading: loadingBooks } = useBooks({
    categoryId: activeCategoryId,
    minRating: selectedRating ?? undefined,
    page,
    limit: 12,
  });

  const books = data?.data ?? [];
  const totalPages = data?.meta?.totalPages ?? 1;

  const handleCategoryToggle = (id: number) => {
    setPage(1);
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
    );
  };

  const handleRatingChange = (v: number | null) => {
    setPage(1);
    setSelectedRating(v);
  };

  const handleClear = () => {
    setPage(1);
    setSelectedCategories([]);
    setSelectedRating(null);
  };

  const cats = categories ?? [];

  return (
    <UserLayout>
      <div className="flex flex-col w-full px-4 md:px-[120px] py-6 md:py-8">
        <div className="flex items-center justify-between mb-6">
          <h1
            className="font-bold text-neutral-950 tracking-[-0.02em] text-[24px] leading-9 md:text-[28px] md:leading-[38px]"
          >
            Book List
          </h1>

          {/* Mobile filter toggle */}
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="md:hidden flex items-center gap-1.5 px-3 h-9 border border-neutral-300 rounded-full font-semibold text-neutral-950 tracking-[-0.02em] text-xs leading-5"
          >
            <SlidersHorizontal className="w-4 h-4" strokeWidth={1.5} />
            FILTER
          </button>
        </div>

        {/*  Desktop  */}
        <div className="hidden md:flex items-start gap-8 w-full">
          {/* Sidebar  */}
          <div className="shrink-0 w-[220px]">
            {loadingCats ? (
              <p className="text-sm text-neutral-400">Loading filters...</p>
            ) : (
              <FilterPanel
                categories={cats}
                selectedCategories={selectedCategories}
                selectedRating={selectedRating}
                onCategoryToggle={handleCategoryToggle}
                onRatingChange={handleRatingChange}
                onClear={handleClear}
              />
            )}
          </div>

          {/* Book grid — */}
          <div className="flex-1 min-w-0">
            {loadingBooks ? (
              <div
                className="grid gap-4"
                style={{ gridTemplateColumns: "repeat(4, 1fr)" }}
              >
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-full h-[300px] bg-neutral-100 rounded-lg animate-pulse"
                  />
                ))}
              </div>
            ) : books.length === 0 ? (
              <div
                className="flex items-center justify-center py-20 text-sm text-neutral-400"
              >
                No books found. Try adjusting the filters.
              </div>
            ) : (
              <div
                className="grid gap-4 md:gap-6"
                style={{ gridTemplateColumns: "repeat(4, 1fr)" }}
              >
                {books.map((book) => (
                  <BookCard key={book.id} book={book} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="px-4 h-9 border border-neutral-300 rounded-full font-semibold text-neutral-950 tracking-[-0.02em] text-sm leading-7 disabled:opacity-40 hover:border-primary hover:text-primary transition-colors"
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .slice(Math.max(0, page - 3), Math.min(totalPages, page + 2))
                  .map((p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-9 h-9 rounded-full font-bold
                        tracking-[-0.02em] text-sm leading-7 transition-colors
                        ${
                          p === page
                            ? "bg-primary text-white" : "border border-neutral-300 text-neutral-950 hover:border-primary hover:text-primary"
                        }`}
                    >
                      {p}
                    </button>
                  ))}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className="px-4 h-9 border border-neutral-300 rounded-full font-semibold text-neutral-950 tracking-[-0.02em] text-sm leading-7 disabled:opacity-40 hover:border-primary hover:text-primary transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ── Mobile ── */}
        <div className="md:hidden">
          {loadingBooks ? (
            <div className="grid grid-cols-2 gap-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="w-full h-[260px] bg-neutral-100 rounded-lg animate-pulse"
                />
              ))}
            </div>
          ) : books.length === 0 ? (
            <div
              className="flex items-center justify-center py-20 text-sm text-neutral-400"
            >
              No books found.
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {books.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          )}

          {/* Mobile load more */}
          {page < totalPages && (
            <div className="flex justify-center mt-6">
              <button
                onClick={() => setPage((p) => p + 1)}
                className="font-semibold text-neutral-950 tracking-[-0.02em] text-sm leading-7 hover:text-primary transition-colors underline underline-offset-2"
              >
                Load More
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Mobile filter drawer ── */}
      {mobileFilterOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 z-40 bg-black/40"
            onClick={() => setMobileFilterOpen(false)}
          />

          {/* Drawer  */}
          <div
            className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl px-4 pt-4 pb-8 flex flex-col gap-4 max-h-[80vh] overflow-y-auto"
          >
            {/* Drawer header */}
            <div className="flex items-center justify-between">
              <span
                className="font-bold text-neutral-950 tracking-[-0.02em] text-base leading-[30px]"
              >
                Filter
              </span>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-8 h-8 flex items-center justify-center"
              >
                <X className="w-5 h-5 text-neutral-950" strokeWidth={2} />
              </button>
            </div>

            {loadingCats ? (
              <p className="text-sm text-neutral-400">Loading filters...</p>
            ) : (
              <FilterPanel
                categories={cats}
                selectedCategories={selectedCategories}
                selectedRating={selectedRating}
                onCategoryToggle={(id) => {
                  handleCategoryToggle(id);
                }}
                onRatingChange={handleRatingChange}
                onClear={handleClear}
              />
            )}

            {/* Apply button */}
            <button
              onClick={() => setMobileFilterOpen(false)}
              className="w-full h-12 flex items-center justify-center rounded-full bg-primary text-white font-bold tracking-[-0.02em] text-base leading-[30px] mt-2"
            >
              Apply Filter
            </button>
          </div>
        </>
      )}
    </UserLayout>
  );
}
