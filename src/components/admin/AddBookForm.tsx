import { useState, useRef } from "react";
import { ArrowLeft, ChevronDown, Upload } from "lucide-react";
import { useCreateBook } from "@/hooks/useAdminBooks";
import type { CreateBookRequest } from "@/types/api/books";

interface Props {
  onBack: () => void;
  onSuccess: () => void;
}

export default function AddBookForm({ onBack, onSuccess }: Props) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [isbn, setIsbn] = useState("");
  const [description, setDescription] = useState("");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const { mutate: createBook, isPending } = useCreateBook();

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
  };

  const handleSubmit = () => {
    if (!title || !isbn || !categoryId) return;
    const payload: CreateBookRequest = {
      title,
      isbn,
      categoryId: Number(categoryId),
      authorName: author || undefined,
      description: description || undefined,
      coverImage: coverFile ?? undefined,
    };
    createBook(payload, { onSuccess });
  };

  const inputBase = `w-full h-12 px-4 border border-neutral-300 rounded-xl outline-none focus:border-primary transition-colors bg-white`;
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
            Add Book
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
            className={`${inputBase} text-sm font-normal`}
            placeholder="Book title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
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
            className={`${inputBase} text-sm font-normal`}
            placeholder="Author name"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
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
              className={`${inputBase} pr-10 font-medium text-neutral-500
                          text-base tracking-[-0.03em]`}
              placeholder="Select category"
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

        {/* ISBN */}
        <div className="flex flex-col gap-[2px]">
          <label
            className={`${labelBase} text-sm`}
            style={{ lineHeight: "28px" }}
          >
            ISBN
          </label>
          <input
            className={`${inputBase} text-sm font-normal`}
            placeholder="ISBN number"
            value={isbn}
            onChange={(e) => setIsbn(e.target.value)}
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
                       text-sm font-normal outline-none focus:border-primary
                       transition-colors resize-none bg-white"
            style={{ height: 101 }}
            placeholder="Book description"
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
            style={{ minHeight: 144 }}
            onClick={() => fileRef.current?.click()}
          >
            {coverPreview ? (
              <img
                src={coverPreview}
                alt="cover preview"
                className="w-[92px] h-[138px] object-cover rounded"
              />
            ) : (
              <>
                <div
                  className="flex items-center justify-center border border-neutral-300"
                  style={{ width: 40, height: 40, borderRadius: 8 }}
                >
                  <Upload
                    className="w-5 h-5 text-neutral-950"
                    strokeWidth={1.67}
                  />
                </div>
                <div className="flex flex-col items-center gap-1 text-center">
                  <div className="flex items-center gap-1">
                    <span
                      className="font-bold text-primary tracking-[-0.02em]"
                      style={{ fontSize: 14, lineHeight: "28px" }}
                    >
                      Click to upload
                    </span>
                    <span
                      className="font-semibold text-neutral-950 tracking-[-0.02em]"
                      style={{ fontSize: 14, lineHeight: "28px" }}
                    >
                      or drag and drop
                    </span>
                  </div>
                  <span
                    className="font-semibold text-neutral-950 tracking-[-0.02em]
                               text-center"
                    style={{ fontSize: 14, lineHeight: "28px" }}
                  >
                    PNG, JPG, GIF or WebP (max 5MB)
                  </span>
                </div>
              </>
            )}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFile}
            />
          </div>
        </div>

        {/* Save button */}
        <button
          onClick={handleSubmit}
          disabled={isPending || !title || !isbn || !categoryId}
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
