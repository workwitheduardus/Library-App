import { useState, useRef } from "react";
import { ArrowLeft, ChevronDown, Upload } from "lucide-react";
import { useUpdateBook } from "@/hooks/useAdminBooks";
import type { Book } from "@/types/api/books";
import type { UpdateBookRequest } from "@/types/api/books";

interface Props {
  book: Book;
  onBack: () => void;
  onSuccess: () => void;
}

export default function EditBookForm({ book, onBack, onSuccess }: Props) {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

  const [title, setTitle] = useState(book.title);
  const [isbn, setIsbn] = useState(book.isbn);
  const [description, setDescription] = useState(book.description ?? "");
  const [categoryId, setCategoryId] = useState(String(book.categoryId));
  const [coverPreview, setCoverPreview] = useState<string | null>(
    book.coverImage ? `${BASE_URL}/${book.coverImage}` : null,
  );
  const fileRef = useRef<HTMLInputElement>(null);

  const { mutate: updateBook, isPending } = useUpdateBook();

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setCoverPreview(URL.createObjectURL(file));
  };

  const handleSubmit = () => {
    const payload: UpdateBookRequest = {
      title,
      isbn,
      description,
      categoryId: Number(categoryId),
    };
    updateBook({ id: book.id, payload }, { onSuccess });
  };

  const inputBase = `w-full h-12 px-4 border border-neutral-300 rounded-xl font-semibold text-neutral-950 outline-none focus:border-primary transition-colors bg-white
  tracking-[-0.02em]`;
  const labelBase = `font-bold text-neutral-950 tracking-[-0.02em]`;

  return (
    <div className="w-full md:flex md:justify-center">
      <div className="flex flex-col gap-4 pb-6 w-full md:w-[529px]">
        {/* Back row */}
        <div
          className="flex items-center gap-2 md:gap-3"
          style={{ minHeight: 36 }}
        >
          <button onClick={onBack}>
            <ArrowLeft
              className="w-6 h-6 md:w-8 md:h-8 text-neutral-950"
              strokeWidth={1.875}
            />
          </button>
          <span
            className="font-bold text-neutral-950 tracking-[-0.02em]
                       text-xl md:text-[24px]"
            style={{ lineHeight: "36px" }}
          >
            Edit Book
          </span>
        </div>

        {/* Title */}
        <div className="flex flex-col gap-[2px]">
          <label
            className={`${labelBase} text-sm`}
            style={{ lineHeight: "28px" }}
          >
            Title
          </label>
          <input
            className={`${inputBase} text-base`}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* ISBN */}
        <div className="flex flex-col gap-[2px]">
          <label
            className={`${labelBase} text-sm`}
            style={{ lineHeight: "28px" }}
          >
            ISBN
          </label>
          <input
            className={`${inputBase} text-base`}
            value={isbn}
            onChange={(e) => setIsbn(e.target.value)}
          />
        </div>

        {/* Category */}
        <div className="flex flex-col gap-[2px]">
          <label
            className={`${labelBase} text-sm`}
            style={{ lineHeight: "28px" }}
          >
            Category
          </label>
          <div className="relative">
            <input
              className={`${inputBase} pr-10 text-base`}
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
            />
            <ChevronDown
              className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5
                         text-neutral-950"
              strokeWidth={2}
            />
          </div>
        </div>

        {/* Author */}
        <div className="flex flex-col gap-[2px]">
          <label
            className={`${labelBase} text-sm`}
            style={{ lineHeight: "28px" }}
          >
            Author
          </label>
          <input
            className={`${inputBase} text-base`}
            placeholder="Author name or ID"
          />
        </div>

        {/* Description */}
        <div className="flex flex-col gap-[2px]">
          <label
            className={`${labelBase} text-sm`}
            style={{ lineHeight: "28px" }}
          >
            Description
          </label>
          <textarea
            className="w-full px-4 py-2 border border-neutral-300 rounded-xl
                       font-semibold text-neutral-950 outline-none
                       focus:border-primary transition-colors resize-none bg-white
                       tracking-[-0.02em]"
            style={{ height: 256, fontSize: 16, lineHeight: "30px" }}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Cover Image upload */}
        <div className="flex flex-col gap-[2px]">
          <label
            className={`${labelBase} text-sm`}
            style={{ lineHeight: "28px" }}
          >
            Cover Image
          </label>
          <div
            className="w-full flex flex-col items-center justify-center gap-3
                       p-6 border border-dashed border-neutral-300 rounded-xl
                       bg-white cursor-pointer"
            style={{ minHeight: 262 }}
            onClick={() => fileRef.current?.click()}
          >
            {coverPreview && (
              <img
                src={coverPreview}
                alt="book cover"
                className="w-[92px] h-[138px] object-cover rounded"
              />
            )}

            <div
              className="flex items-center gap-3"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className="flex items-center gap-1.5 px-3 h-10 border
                           border-neutral-300 rounded-lg text-sm font-medium
                           text-neutral-950"
                onClick={() => fileRef.current?.click()}
              >
                <Upload className="w-4 h-4" strokeWidth={1.5} />
                Change image
              </button>
              {coverPreview && (
                <button
                  type="button"
                  className="flex items-center gap-1.5 px-3 h-10 border
                             rounded-lg text-sm font-medium"
                  style={{ color: "#D9206E", borderColor: "#D9206E" }}
                  onClick={() => setCoverPreview(null)}
                >
                  Remove image
                </button>
              )}
            </div>

            <p
              className="font-medium text-neutral-950 tracking-[-0.03em]
                         text-sm text-center"
              style={{ lineHeight: "28px" }}
            >
              PNG, JPG, GIF or WebP (max 5MB)
            </p>

            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFile}
            />
          </div>
        </div>

        {/* Save */}
        <button
          onClick={handleSubmit}
          disabled={isPending}
          className="w-full h-12 flex items-center justify-center rounded-full
                     bg-primary text-white font-bold tracking-[-0.02em]
                     disabled:opacity-50 transition-opacity"
          style={{ fontSize: 16, lineHeight: "30px" }}
        >
          {isPending ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
}
