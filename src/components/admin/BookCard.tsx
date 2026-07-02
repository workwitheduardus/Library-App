import { useState } from "react";
import { MoreHorizontal, Star } from "lucide-react";
import type { Book } from "@/types/api/books";
import BookMenu from "./BookMenu";

interface Props {
  book: Book;
  onPreview: (book: Book) => void;
  onEdit: (book: Book) => void;
  onDelete: (book: Book) => void;
}

export default function BookCard({ book, onPreview, onEdit, onDelete }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

  const coverSrc = book.coverImage ? `${BASE_URL}/${book.coverImage}` : null;

  return (
    <div
      className="w-full flex flex-row items-center justify-between p-4 bg-white rounded-2xl md:p-5"
      style={{
        boxShadow: "0px 0px 20px rgba(203,202,202,0.25)",
      }}
    >
      {/* Left: cover + info */}
      <div className="flex flex-row items-center gap-3 md:gap-4 flex-1">
        {/* Cover image — 92×138 per Figma */}
        <div className="shrink-0 w-[92px] h-[138px] bg-neutral-200 rounded overflow-hidden">
          {coverSrc ? (
            <img
              src={coverSrc}
              alt={book.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-neutral-400 text-xs text-center px-1">
              No Cover
            </div>
          )}
        </div>

        {/* Text info */}
        <div className="flex flex-col gap-1 md:gap-[4px] flex-1 min-w-0">
          {/* Category badge */}
          <div
            className="inline-flex items-center justify-center px-2 border border-neutral-300 rounded-md self-start"
            style={{ height: 28 }}
          >
            <span
              className="font-bold text-neutral-950 tracking-[-0.02em] truncate"
              style={{ fontSize: 14, lineHeight: "28px", maxWidth: 142 }}
            >
              Category
            </span>
          </div>

          {/* Title */}
          <p
            className="font-bold text-neutral-950 text-sm md:text-lg md:tracking-[-0.02em]"
            style={{ lineHeight: "28px" }}
          >
            {book.title}
          </p>

          {/* Author */}
          <p
            className="font-medium text-neutral-700 tracking-[-0.03em] truncate"
            style={{ fontSize: 14, lineHeight: "28px" }}
          >
            Author
          </p>

          {/* Rating */}
          <div className="flex items-center gap-[2px]">
            <Star className="w-6 h-6 fill-[#FFAB0D] text-[#FFAB0D]" />
            <span
              className="font-bold text-neutral-950 tracking-[-0.02em]"
              style={{ fontSize: 14, lineHeight: "28px" }}
            >
              {book.rating?.toFixed(1) ?? "—"}
            </span>
          </div>
        </div>
      </div>

      {/* Three-dot menu button */}
      <div className="relative shrink-0 self-start md:hidden">
        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="w-6 h-6 flex items-center justify-center"
        >
          <MoreHorizontal
            className="w-6 h-6 text-neutral-950"
            strokeWidth={2}
          />
        </button>

        {menuOpen && (
          <BookMenu
            onPreview={() => {
              setMenuOpen(false);
              onPreview(book);
            }}
            onEdit={() => {
              setMenuOpen(false);
              onEdit(book);
            }}
            onDelete={() => {
              setMenuOpen(false);
              onDelete(book);
            }}
            onClose={() => setMenuOpen(false)}
          />
        )}
      </div>
      {/* ── Desktop inline buttons ── */}
      <div className="hidden md:flex items-center shrink-0" style={{ gap: 13 }}>
        <button
          onClick={() => onPreview(book)}
          className="flex items-center justify-center border border-neutral-300
                     rounded-full font-bold text-neutral-950 tracking-[-0.02em]"
          style={{ width: 95, height: 48, fontSize: 16, lineHeight: "30px" }}
        >
          Preview
        </button>
        <button
          onClick={() => onEdit(book)}
          className="flex items-center justify-center border border-neutral-300
                     rounded-full font-bold text-neutral-950 tracking-[-0.02em]"
          style={{ width: 95, height: 48, fontSize: 16, lineHeight: "30px" }}
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(book)}
          className="flex items-center justify-center border border-neutral-300
                     rounded-full font-bold tracking-[-0.02em]"
          style={{
            width: 95,
            height: 48,
            fontSize: 16,
            lineHeight: "30px",
            color: "#EE1D52",
          }}
        >
          Delete
        </button>
      </div>
    </div>
  );
}
