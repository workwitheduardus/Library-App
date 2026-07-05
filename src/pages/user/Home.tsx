import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import UserLayout from "@/layouts/UserLayout";
import BookCard from "@/components/user/BookCard";
import { useRecommendedBooks } from "@/hooks/useRecommendedBooks";
import { useCategories } from "@/hooks/useCategories";
import { usePopularAuthors } from "@/hooks/usePopularAuthors";
import { useAppSelector } from "@/app/store";

/* ── Category icon map ── */
const CATEGORY_ICONS: Record<string, string> = {
  "Fiction":"📖",
  "Non-Fiction":"📰",
  "Self-Improvement":"🌱",
  "Finance":"💰",
  "Science & Technology":  "🔬",
  "Education":"🎓",
};

/* ── Popular Author card ── */
function AuthorCard({
  id,
  name,
  bookCount,
}: {
  id: number;
  name: string;
  bookCount: number;
  photo?: string;
}) {
  return (
    <Link
      to={`/authors/${id}/books`}
      className="flex flex-col items-center gap-2 shrink-0 w-[72px] md:w-[120px]"
    >
      {/* Avatar */}
      <div
        className="w-[60px] h-[60px] md:w-[80px] md:h-[80px] rounded-full bg-neutral-200 overflow-hidden shrink-0 flex items-center justify-center font-bold text-neutral-600 text-lg"
      >
        {name[0].toUpperCase()}
      </div>

      {/* Name */}
      <p
        className="font-semibold text-neutral-950 tracking-[-0.02em] text-xs leading-[22px] text-center line-clamp-2 md:text-sm md:leading-7"
      >
        {name}
      </p>

      {/* Book count */}
      <p
        className="font-medium tracking-[-0.03em] text-xs leading-[22px] text-center"
        style={{ color: "#414651" }}
      >
        {bookCount} {bookCount === 1 ? "Book" : "Books"}
      </p>
    </Link>
  );
}


{/* Main Home page */}

export default function Home() {
  const [activeDot,    setActiveDot]    = useState(0);
  const [loadMore,     setLoadMore]     = useState(false);
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);

  const { data: recommendedData, isLoading: loadingBooks } =
    useRecommendedBooks({ by: "rating", limit: loadMore ? 16 : 8 });

  const { data: categories, isLoading: loadingCats } = useCategories();
  const { data: authors,    isLoading: loadingAuthors } = usePopularAuthors(4);

  const books = recommendedData?.data ?? [];

  return (
    <UserLayout>
      <div className="flex flex-col w-full">

        {/* ── Hero Banner ── */}
        <section
          className="w-full flex items-center justify-center relative overflow-hidden h-[200px] md:h-[280px]"
          style={{
            background: "linear-gradient(135deg, #1C65DA 0%, #5B9BF0 100%)",
          }}
        >
          {/* Text content */}
          <div className="flex flex-col items-center gap-2 z-10 px-4 text-center">
            <h1
              className="font-bold text-white tracking-[-0.02em] text-[28px] leading-[38px] md:text-[40px] md:leading-[52px]"
            >
              Welcome to
              <br />
              Booky
            </h1>
          </div>

          {/* Carousel dots */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
            {[0, 1, 2].map((i) => (
              <button
                key={i}
                onClick={() => setActiveDot(i)}
                className={`rounded-full transition-all duration-200
                  ${activeDot === i
                    ? "w-4 h-2 bg-white"
                    : "w-2 h-2 bg-white/50"
                  }`}
              />
            ))}
          </div>
        </section>

        {/* ── Page content ── */}
        <div className="flex flex-col gap-6 md:gap-10 px-4 md:px-[120px] py-6 md:py-8">

          {/* ── Category icons ── */}
          <section className="flex flex-col gap-4">
            {loadingCats ? (
              <div className="h-20 flex items-center justify-center text-sm text-neutral-400">
                Loading categories...
              </div>
            ) : (
              <div
                className="flex flex-row items-center gap-4 md:gap-6 overflow-x-auto pb-1 scrollbar-hide"
              >
                {(categories ?? []).map((cat) => (
                  <Link
                    key={cat.id}
                    to={`/books?categoryId=${cat.id}`}
                    className="flex flex-col items-center gap-1 shrink-0 group"
                  >
                    {/* Icon box */}
                    <div
                      className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-xl bg-neutral-100 group-hover:bg-primary/10 transition-colors text-xl md:text-2xl"
                    >
                      {CATEGORY_ICONS[cat.name] ?? "📚"}
                    </div>
                    {/* Label */}
                    <span
                      className="font-semibold text-neutral-950 tracking-[-0.02em] text-[10px] leading-5 text-center md:text-xs md:leading-[22px] group-hover:text-primary transition-colors"
                    >
                      {cat.name}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </section>

          {/* ── Recommendation section ── */}
          <section className="flex flex-col gap-4 md:gap-5">
            <div className="flex items-center justify-between">
              <h2
                className="font-bold text-neutral-950 tracking-[-0.02em] text-xl leading-[34px] md:text-[24px] md:leading-9"
              >
                Recommendation
              </h2>
              <Link
                to="/books"
                className="flex items-center gap-1 font-semibold text-primary tracking-[-0.02em] text-sm leading-7 hover:underline"
              >
                See all
                <ChevronRight className="w-4 h-4" strokeWidth={2} />
              </Link>
            </div>

            {loadingBooks ? (
              <div className="h-40 flex items-center justify-center text-sm text-neutral-400">
                Loading books...
              </div>
            ) : books.length === 0 ? (
              <p className="text-sm text-neutral-400 text-center py-8">
                No recommendations yet.
              </p>
            ) : (
              <>
                {/* Mobile*/}
                <div
                  className="md:hidden flex flex-row gap-3 overflow-x-auto pb-2 scrollbar-hide"
                >
                  {books.map((book) => (
                    <BookCard key={book.id} book={book} />
                  ))}
                </div>

                {/* Desktop */}
                <div
                  className="hidden md:grid gap-4 md:gap-6"
                  style={{ gridTemplateColumns: "repeat(5, 1fr)" }}
                >
                  {books.map((book) => (
                    <BookCard key={book.id} book={book} />
                  ))}
                </div>
              </>
            )}

            {/* Load More button */}
            {!loadMore && books.length >= 8 && (
              <div className="flex justify-center mt-2">
                <button
                  onClick={() => setLoadMore(true)}
                  className="font-semibold text-neutral-950 tracking-[-0.02em] text-sm leading-7 hover:text-primary transition-colors underline underline-offset-2"
                >
                  Load More
                </button>
              </div>
            )}
          </section>

          {/* ── Popular Authors ── */}
          <section className="flex flex-col gap-4 md:gap-5">
            <div className="flex items-center justify-between">
              <h2
                className="font-bold text-neutral-950 tracking-[-0.02em] text-xl leading-[34px] md:text-[24px] md:leading-9"
              >
                Popular Authors
              </h2>
              <Link
                to="/authors"
                className="flex items-center gap-1 font-semibold text-primary tracking-[-0.02em] text-sm leading-7 hover:underline"
              >
                See all
                <ChevronRight className="w-4 h-4" strokeWidth={2} />
              </Link>
            </div>

            {loadingAuthors ? (
              <div className="h-24 flex items-center justify-center text-sm text-neutral-400">
                Loading authors...
              </div>
            ) : (
              <div className="flex flex-row items-start gap-6 md:gap-10 overflow-x-auto pb-1 scrollbar-hide">
                {(authors ?? []).map((author) => (
                  <AuthorCard
                    key={author.id}
                    id={author.id} 
                    name={author.name}
                    bookCount={author.bookCount}
                  />
                ))}
              </div>
            )}
          </section>

          {/* Before login  */}
          {!isAuthenticated && (
            <section
              className="flex flex-col items-center gap-4 py-8 px-6 rounded-2xl text-center"
              style={{ background: "#F6F9FE" }}
            >
              <p
                className="font-bold text-neutral-950 tracking-[-0.02em] text-lg leading-8 md:text-[24px] md:leading-9"
              >
                Join Booky today
              </p>
              <p
                className="font-medium tracking-[-0.03em] text-sm leading-7 md:text-base md:leading-[30px] max-w-[320px]"
                style={{ color: "#414651" }}
              >
                Create an account to borrow books, write reviews, and track
                your reading history.
              </p>
              <div className="flex items-center gap-3">
                <Link
                  to="/register"
                  className="flex items-center justify-center px-6 h-11 rounded-full bg-primary text-white font-bold tracking-[-0.02em] text-base leading-[30px] hover:bg-primary/90 transition-colors"
                >
                  Register
                </Link>
                <Link
                  to="/login"
                  className="flex items-center justify-center px-6 h-11 rounded-full border border-neutral-300 font-bold text-neutral-950 tracking-[-0.02em] text-base leading-[30px] hover:border-primary hover:text-primary transition-colors"
                >
                  Login
                </Link>
              </div>
            </section>
          )}

        </div>
      </div>
    </UserLayout>
  );
}