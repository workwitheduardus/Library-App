import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import type { Book } from "@/types/api/books";

interface Props {
  book: Book;
}

export default function BookCard({ book }: Props) {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL as string;
  const coverSrc = book.coverImage ? `${BASE_URL}/${book.coverImage}` : null;

  return (
    <Link
      to={`/books/${book.id}`}
      className="flex flex-col gap-2 w-[120px] md:w-[182px] shrink-0 group"
    >
      {/* Cover  */}
      <div
        className="w-full bg-neutral-200 rounded-lg overflow-hidden h-[180px] md:h-[273px] shrink-0"
      >
        {coverSrc ? (
          <img
            src={coverSrc}
            alt={book.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center text-neutral-400 text-xs text-center px-2"
          >
            No Cover
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col gap-[2px]">
        {/* Book name */}
        <p
          className="font-bold text-neutral-950 tracking-[-0.02em] text-sm leading-7 line-clamp-2"
        >
          {book.title}
        </p>

        {/* Author */}
        <p
          className="font-medium tracking-[-0.03em] text-xs leading-[22px] line-clamp-1"
          style={{ color: "#414651" }}
        >
          Author
        </p>

        {/* Rating */}
        <div className="flex items-center gap-[2px]">
          <Star className="w-4 h-4 fill-[#FFAB0D] text-[#FFAB0D] shrink-0" />
          <span
            className="font-bold text-neutral-950 tracking-[-0.02em] text-xs leading-[22px]"
          >
            {book.rating?.toFixed(1) ?? "—"}
          </span>
        </div>
      </div>
    </Link>
  );
}
