import { ArrowLeft, Star, Bookmark } from "lucide-react";
import { useBookDetail } from "@/hooks/useAdminBooks";
import type { Book } from "@/types/api/books";

interface Props {
  book: Book;
  onBack: () => void;
}

export default function PreviewBook({ book, onBack }: Props) {
  const { data, isLoading } = useBookDetail(book.id);
  const BASE_URL = import.meta.env.VITE_API_BASE_URL as string;
  const coverSrc = book.coverImage ? `${BASE_URL}/${book.coverImage}` : null;

  return (
    <div className="flex flex-col gap-4 pb-24 md:pb-0">
      {/* Back row */}
      <div
        className="flex items-center gap-1.5. md:gap-3"
        style={{ height: 34 }}
      >
        <button onClick={onBack}>
          <ArrowLeft
            className="w-6 h-6 md:w-8 md:h-8 text-neutral-950"
            strokeWidth={1.875}
          />
        </button>
        <span
          className="font-bold text-neutral-950 tracking-[-0.02em] text-xl md:text-[28px] md:tracking-[-0.03em]"
          style={{ lineHeight: "38px" }}
        >
          Preview Book
        </span>
      </div>

      {/* Cover */}
      <div className="flex flex-col md:flex-row md:item-start md:gap-9 w-full">
        <div
          className="shrink-0 bg-neutral-200 overflow-hidden rounded-lg
                     mx-auto md:mx-0"
          style={{
            width: "clamp(222px, 28%, 337px)",
            height: "clamp(328px, 41%, 498px)",
          }}
        >
          {coverSrc ? (
            <img
              src={coverSrc}
              alt={book.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center
                              text-neutral-400 text-sm"
            >
              No cover
            </div>
          )}
        </div>

        {/* Info column */}
        <div className="flex flex-col gap-4 md:gap-5 flex-1 min-w-0 mt-4 md:mt-0">
          {/* Category badge */}
          <div
            className="inline-flex items-center px-2 border border-neutral-300 self-start"
            style={{ height: 28, borderRadius: 6 }}
          >
            <span
              className="font-bold text-neutral-950 tracking-[-0.02em]"
              style={{ fontSize: 14, lineHeight: "28px" }}
            >
              Category
            </span>
          </div>

          {/* Title */}
          <p
            className="font-bold text-neutral-950 tracking-[-0.02em]
                       text-[24px] leading-9
                       md:text-[28px] md:leading-[38px]"
          >
            {book.title}
          </p>

          {/* Author*/}
          <p
            className="font-semibold tracking-[-0.02em]
                       text-sm md:text-base md:leading-[30px]"
            style={{ color: "#414651" }}
          >
            Author
          </p>

          {/* Rating */}
          <div className="flex items-center gap-[2px]">
            <Star className="w-6 h-6 fill-[#FFAB0D] text-[#FFAB0D]" />
            <span
              className="font-bold tracking-[-0.02em]"
              style={{ fontSize: 16, lineHeight: "30px", color: "#181D27" }}
            >
              {book.rating?.toFixed(1) ?? "—"}
            </span>
          </div>

          {/* Stats row — Copies | Rating | Reviews */}
          <div
            className="flex items-center w-full"
            style={{ height: "clamp(60px, 8vh, 66px)" }}
          >
            {[
              { value: String(book.totalCopies ?? "—"), label: "Copies" },
              { value: book.rating?.toFixed(1) ?? "—", label: "Rating" },
              { value: String(book.reviewCount ?? "—"), label: "Reviews" },
            ].map((stat, i) => (
              <div key={stat.label} className="flex items-center flex-1">
                <div className="flex flex-col items-start flex-1">
                  <span
                    className="font-bold text-neutral-950 tracking-[-0.03em]
                               text-lg md:text-[24px]"
                    style={{ lineHeight: "36px" }}
                  >
                    {stat.value}
                  </span>
                  <span
                    className="font-medium text-neutral-950 tracking-[-0.03em]
                               text-sm md:text-base md:leading-[30px]"
                  >
                    {stat.label}
                  </span>
                </div>
                {i < 2 && (
                  <div
                    className="shrink-0 bg-neutral-300"
                    style={{ width: 1, height: 66, margin: "0 20px" }}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-neutral-300" />

          {/* Description */}
          {isLoading ? (
            <p className="text-sm text-neutral-400">Loading...</p>
          ) : (
            <div className="flex flex-col gap-1">
              <p
                className="font-bold text-neutral-950 tracking-[-0.02em]"
                style={{ fontSize: 20, lineHeight: "34px" }}
              >
                Description
              </p>
              <p
                className="font-medium text-neutral-950 tracking-[-0.03em]
                           text-sm leading-7 md:text-base md:leading-[30px]"
              >
                {data?.description ??
                  book.description ??
                  "No description available."}
              </p>
            </div>
          )}

          {/* Action buttons */}
          <div className="hidden md:flex items-center gap-3 mt-2">
            <button
              className="flex items-center justify-center border border-neutral-300
                         rounded-full font-bold text-neutral-950 tracking-[-0.02em]"
              style={{
                width: 200,
                height: 48,
                fontSize: 16,
                lineHeight: "30px",
              }}
            >
              Add to Cart
            </button>
            <button
              className="flex items-center justify-center rounded-full font-bold
                         text-white tracking-[-0.02em] bg-primary"
              style={{
                width: 200,
                height: 48,
                fontSize: 16,
                lineHeight: "30px",
              }}
            >
              Borrow Now
            </button>
          </div>
        </div>
      </div>

      {/* Mobile fixed bottom bar */}
      <div
        className="md:hidden fixed bottom-0 left-0 right-0 flex items-center
                   gap-3 p-4 bg-white"
        style={{ boxShadow: "0px 0px 20px rgba(203,202,202,0.25)" }}
      >
        <button
          className="flex-1 h-10 flex items-center justify-center border border-neutral-300
                     rounded-full font-bold text-neutral-950 tracking-[-0.02em]"
          style={{ fontSize: 14, lineHeight: "28px" }}
        >
          Add to Cart
        </button>
        <button
          className="flex-1 h-10 flex items-center justify-center rounded-full font-bold
                     text-white bg-primary tracking-[-0.02em]"
          style={{ fontSize: 14, lineHeight: "28px" }}
        >
          Borrow Now
        </button>
        <button
          className="w-10 h-10 flex items-center justify-center border
                           border-neutral-300 rounded-full shrink-0"
        >
          <Bookmark className="w-5 h-5 text-neutral-950" strokeWidth={2.08} />
        </button>
      </div>
    </div>
  );
}