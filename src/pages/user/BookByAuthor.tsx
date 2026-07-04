import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import UserLayout from "@/layouts/UserLayout";
import BookCard from "@/components/user/BookCard";
import { getAuthorBooksApi } from "@/api/authors.api";

export default function BookByAuthor() {
  const { id } = useParams<{ id: string }>();
  const authorId = Number(id);
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["author-books", authorId, page],
    queryFn: () => getAuthorBooksApi(authorId, page, 12),
    enabled: !!authorId,
  });

  const author = data?.author;
  const books = data?.books?.data ?? [];
  const totalPages = data?.books?.meta?.totalPages ?? 1;

  return (
    <UserLayout>
      <div className="flex flex-col w-full px-4 md:px-[120px] py-6 md:py-8 gap-6 md:gap-8">
        {/* ── Author card ── */}
        {isLoading ? (
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-neutral-100 animate-pulse" />
            <div className="flex flex-col gap-1">
              <div className="w-32 h-5 bg-neutral-100 rounded animate-pulse" />
              <div className="w-20 h-4 bg-neutral-100 rounded animate-pulse" />
            </div>
          </div>
        ) : author ? (
          <div className="flex items-center gap-3 md:gap-4">
            {/* Avatar */}
            <div
              className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-neutral-200 overflow-hidden shrink-0 flex items-center justify-center font-bold text-neutral-600 text-lg"
            >
              {author.name?.[0]?.toUpperCase() ?? "A"}
            </div>

            {/* Name + book count */}
            <div className="flex flex-col gap-[2px]">
              <p
                className="font-bold text-neutral-950 tracking-[-0.02em] text-base leading-[30px] md:text-xl md:leading-[34px]"
              >
                {author.name}
              </p>
              <p
                className="font-medium tracking-[-0.03em]
                           text-sm leading-7"
                style={{ color: "#414651" }}
              >
                {data?.books?.meta?.total ?? 0} books
              </p>
            </div>
          </div>
        ) : null}

        {/* ── Book List section ── */}
        <div className="flex flex-col gap-4 md:gap-5">
          <h2
            className="font-bold text-neutral-950 tracking-[-0.02em] text-xl leading-[34px] md:text-[24px] md:leading-9"
          >
            Book List
          </h2>

          {/* Loading skeleton */}
          {isLoading && (
            <>
              {/* Desktop skeleton */}
              <div
                className="hidden md:grid gap-6"
                style={{ gridTemplateColumns: "repeat(5, 1fr)" }}
              >
                {Array.from({ length: 10 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-full h-[300px] bg-neutral-100 rounded-lg animate-pulse"
                  />
                ))}
              </div>
              {/* Mobile skeleton */}
              <div className="md:hidden grid grid-cols-2 gap-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-full h-[260px] bg-neutral-100 rounded-lg animate-pulse"
                  />
                ))}
              </div>
            </>
          )}

          {/* Error */}
          {isError && (
            <div
              className="flex items-center justify-center py-20 text-sm text-neutral-400"
            >
              Failed to load books. Try refreshing.
            </div>
          )}

          {/* Empty */}
          {!isLoading && !isError && books.length === 0 && (
            <div
              className="flex items-center justify-center py-20 text-sm text-neutral-400"
            >
              No books found for this author.
            </div>
          )}

          {/* Desktop */}
          {!isLoading && books.length > 0 && (
            <div
              className="hidden md:grid gap-6"
              style={{ gridTemplateColumns: "repeat(5, 1fr)" }}
            >
              {books.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          )}

          {/* Mobile */}
          {!isLoading && books.length > 0 && (
            <div className="md:hidden grid grid-cols-2 gap-3">
              {books.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          )}

          {/* Pagination — desktop */}
          {!isLoading && totalPages > 1 && (
            <div className="hidden md:flex items-center justify-center gap-2 mt-4">
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
                    className={`w-9 h-9 rounded-full font-bold tracking-[-0.02em]
                      text-sm transition-colors
                      ${ p === page ? "bg-primary text-white" : "border border-neutral-300 text-neutral-950 hover:border-primary hover:text-primary"
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

          {/* Load more  */}
          {!isLoading && page < totalPages && (
            <div className="md:hidden flex justify-center mt-4">
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
    </UserLayout>
  );
}
