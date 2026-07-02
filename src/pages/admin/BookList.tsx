import { useState } from "react";
import { Search, Plus } from "lucide-react";
import AdminLayout from "./AdminLayout";
import BookCard from "@/components/admin/BookCard";
import DeleteModal from "@/components/admin/DeleteModal";
import SuccessAlert from "@/components/admin/SuccessAlert";
import PreviewBook from "@/components/admin/PreviewBook";
import AddBookForm from "@/components/admin/AddBookForm";
import EditBookForm from "@/components/admin/EditBookForm";
import { useBooks, useDeleteBook } from "@/hooks/useAdminBooks";
import type { Book } from "@/types/api/books";

type View = "list" | "preview" | "add" | "edit";

export default function BookList() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [view, setView] = useState<View>("list");
  const [selected, setSelected] = useState<Book | null>(null);
  const [toDelete, setToDelete] = useState<Book | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const LIMIT = 12;

  const { data, isLoading, isError } = useBooks({
    q: search || undefined,
    page,
    limit: LIMIT,
  });

  const { mutate: deleteBook, isPending: isDeleting } = useDeleteBook();

  const books = data?.data ?? [];

  const handleDelete = () => {
    if (!toDelete) return;
    deleteBook(toDelete.id, {
      onSuccess: () => {
        setToDelete(null);
        setSuccessMsg("Book deleted successfully.");
      },
    });
  };

  // Sub-views
  if (view === "preview" && selected) {
    return (
      <AdminLayout>
        <PreviewBook book={selected} onBack={() => setView("list")} />
      </AdminLayout>
    );
  }

  if (view === "add") {
    return (
      <AdminLayout>
        <AddBookForm
          onBack={() => setView("list")}
          onSuccess={() => {
            setView("list");
            setSuccessMsg("Book added successfully.");
          }}
        />
      </AdminLayout>
    );
  }

  if (view === "edit" && selected) {
    return (
      <AdminLayout>
        <EditBookForm
          book={selected}
          onBack={() => setView("list")}
          onSuccess={() => {
            setView("list");
            setSuccessMsg("Book updated successfully.");
          }}
        />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      {/* Success alert */}
      {successMsg && (
        <SuccessAlert
          message={successMsg}
          onClose={() => setSuccessMsg(null)}
        />
      )}

      {/* Delete modal */}
      {toDelete && (
        <DeleteModal
          onCancel={() => setToDelete(null)}
          onConfirm={handleDelete}
          isPending={isDeleting}
        />
      )}

      {/* Page title */}
      <h1
        className="font-bold text-neutral-950 mb-4"
        style={{ fontSize: 24, lineHeight: "36px" }}
      >
        Book List
      </h1>

      {/* Add book button */}
      <button
        onClick={() => setView("add")}
        className="w-full h-11 flex items-center justify-center gap-2 rounded-full bg-primary text-white font-bold tracking-[-0.02em] mb-4"
        style={{ fontSize: 16, lineHeight: "30px" }}
      >
        <Plus className="w-4 h-4" />
        Add Book
      </button>

      {/* Search */}
      <div
        className="flex items-center gap-1.5 px-4 border border-neutral-300 rounded-full bg-white mb-4 w-full"
        style={{ height: 44 }}
      >
        <Search
          className="w-5 h-5 text-neutral-600 shrink-0"
          strokeWidth={1.25}
        />
        <input
          type="text"
          placeholder="Search book"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="flex-1 bg-transparent text-sm font-medium text-neutral-600 tracking-[-0.03em] leading-7 outline-none placeholder:text-neutral-500"
        />
      </div>

      {/* Category filter pills */}
      <div className="flex items-center gap-2 flex-wrap mb-4">
        {["All", "Fiction", "Business", "Science", "History"].map((cat, i) => (
          <button
            key={cat}
            className="flex items-center justify-center px-4 h-10 rounded-full border text-sm font-semibold tracking-[-0.02em] transition-colors"
            style={
              i === 0
                ? {
                    background: "color-primary-100",
                    borderColor: "color-primary",
                    color: "color-primary",
                    fontWeight: 700,
                  }
                : { borderColor: "color-neutral-300", color: "neutral-950" }
            }
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Book cards */}
      {isLoading && (
        <div className="flex justify-center py-20 text-sm text-neutral-400">
          Loading books...
        </div>
      )}

      {isError && (
        <div className="flex justify-center py-20 text-sm text-accent-red">
          Failed to load books.
        </div>
      )}

      {!isLoading && !isError && (
        <div className="flex flex-col gap-4">
          {books.length === 0 ? (
            <p className="text-center text-sm text-neutral-400 py-10">
              No books found.
            </p>
          ) : (
            books.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                onPreview={(b) => {
                  setSelected(b);
                  setView("preview");
                }}
                onEdit={(b) => {
                  setSelected(b);
                  setView("edit");
                }}
                onDelete={(b) => setToDelete(b)}
              />
            ))
          )}
        </div>
      )}
    </AdminLayout>
  );
}
