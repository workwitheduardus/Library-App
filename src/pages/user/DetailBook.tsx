import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Star, ShoppingCart } from "lucide-react";
import { format } from "date-fns";
import UserLayout from "@/layouts/UserLayout";
import BookCard from "@/components/user/BookCard";
import { useBookDetail } from "@/hooks/useBookDetail";
import { useBookReviews, useCreateReview } from "@/hooks/useBookReviews";
import { useRecommendedBooks } from "@/hooks/useRecommendedBooks";
import { useAppSelector } from "@/app/store";

/* ── Star rating display ── */
function StarRow({ rating, size = 16 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-[2px]">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={i <= Math.round(rating)
            ? "fill-[#FFAB0D] text-[#FFAB0D]"
            : "fill-neutral-200 text-neutral-200"
          }
          style={{ width: size, height: size }}
        />
      ))}
    </div>
  );
}

/* ── Interactive star picker ── */
function StarPicker({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          type="button"
          onMouseEnter={() => setHover(i)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(i)}
          className="w-6 h-6 flex items-center justify-center"
        >
          <Star
            className={
              i <= (hover || value) ? "fill-[#FFAB0D] text-[#FFAB0D]" : "fill-neutral-200 text-neutral-200"
            }
            style={{ width: 20, height: 20 }}
          />
        </button>
      ))}
    </div>
  );
}

/* ── Single review card ── */
function ReviewCard({
  userName,
  date,
  rating,
  comment,
  avatarInitial,
}: {
  userName:string;
  date:string;
  rating:number;
  comment:string;
  avatarInitial: string;
}) {
  return (
    <div className="flex flex-col gap-3 pb-4 border-b border-neutral-200 last:border-0">
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <div
          className="w-10 h-10 rounded-full bg-neutral-200 flex items-center justify-center font-bold text-neutral-600 text-sm shrink-0"
        >
          {avatarInitial}
        </div>

        <div className="flex flex-col gap-[2px]">
          <p className="font-bold text-neutral-950 tracking-[-0.02em] text-sm leading-7">
            {userName}
          </p>
          <p className="font-medium text-neutral-500 tracking-[-0.03em] text-xs leading-5">
            {date}
          </p>
        </div>
      </div>

      <StarRow rating={rating} size={14} />

      <p className="font-medium text-neutral-950 tracking-[-0.03em] text-sm leading-7">
        {comment}
      </p>
    </div>
  );
}

/* ── Review form ── */
function ReviewForm({ bookId }: { bookId: number }) {
  const [star,    setStar]    = useState(0);
  const [comment, setComment] = useState("");

  const { mutate: submit, isPending } = useCreateReview(bookId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!star || !comment.trim()) return;
    submit(
      { bookId, star, comment },
      {
        onSuccess: () => {
          setStar(0);
          setComment("");
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 pt-4">
      <p className="font-bold text-neutral-950 tracking-[-0.02em] text-base leading-[30px]">
        Write a Review
      </p>

      <StarPicker value={star} onChange={setStar} />

      <textarea
        placeholder="Share your thoughts about this book..."
        value={comment}
        onChange={e => setComment(e.target.value)}
        className="w-full px-4 py-3 border border-neutral-300 rounded-xl text-sm font-normal text-neutral-950 outline-none focus:border-primary transition-colors resize-none"
        style={{ height: 100 }}
      />

      <button
        type="submit"
        disabled={isPending || !star || !comment.trim()}
        className="w-full h-11 flex items-center justify-center rounded-full bg-primary text-white font-bold tracking-[-0.02em] text-base leading-[30px] disabled:opacity-50 transition-opacity"
      >
        {isPending ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
}

/* ── Main page ── */
export default function DetailBook() {
  const { id }         = useParams<{ id: string }>();
  const bookId         = Number(id);
  const [reviewPage, setReviewPage] = useState(1);

  const isAuthenticated = useAppSelector(s => s.auth.isAuthenticated);

  const { data: book,    isLoading: loadingBook  } = useBookDetail(bookId);
  const { data: reviews, isLoading: loadingReviews } =
    useBookReviews(bookId, reviewPage);
  const { data: related } = useRecommendedBooks({
    by:         "rating",
    categoryId: book?.categoryId,
    limit:      5,
  });

  const BASE_URL  = import.meta.env.VITE_API_BASE_URL as string;
  const coverSrc  = book?.coverImage ? `${BASE_URL}/${book.coverImage}` : null;
  const reviewList = reviews?.data ?? [];

  if (loadingBook) {
    return (
      <UserLayout>
        <div className="flex items-center justify-center min-h-[60vh]
                        text-sm text-neutral-400">
          Loading book...
        </div>
      </UserLayout>
    );
  }

  if (!book) {
    return (
      <UserLayout>
        <div className="flex items-center justify-center min-h-[60vh]
                        text-sm text-neutral-400">
          Book not found.
        </div>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <div className="flex flex-col w-full px-4 md:px-[120px] py-6 md:py-8 gap-8 md:gap-10">

        {/* ── Breadcrumb ── */}
        <nav className="flex items-center gap-2 flex-wrap">
          {[
            { label: "Home",     to: "/"       },
            { label: book.category?.name ?? "Category",
              to: `/books?categoryId=${book.categoryId}` },
            { label: book.title, to: null      },
          ].map((crumb, i, arr) => (
            <span key={i} className="flex items-center gap-2">
              {crumb.to ? (
                <Link
                  to={crumb.to}
                  className="font-medium tracking-[-0.03em] text-sm leading-7 hover:text-primary transition-colors"
                  style={{ color: "#414651" }}
                >
                  {crumb.label}
                </Link>
              ) : (
                <span
                  className="font-medium text-neutral-950 tracking-[-0.03em] text-sm leading-7 line-clamp-1"
                >
                  {crumb.label}
                </span>
              )}
              {i < arr.length - 1 && (
                <span
                  className="font-medium tracking-[-0.03em] text-sm"
                  style={{ color: "#414651" }}
                >
                  &gt;
                </span>
              )}
            </span>
          ))}
        </nav>

        {/*  Book detail  */}
        <div className="flex flex-col md:flex-row md:items-start md:gap-9 w-full">

          {/* Cover */}
          <div
            className="shrink-0 bg-neutral-200 rounded-lg overflow-hidden mx-auto md:mx-0 w-[160px] h-[237px] md:w-[222px] md:h-[328px]"
          >
            {coverSrc ? (
              <img
                src={coverSrc}
                alt={book.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-neutral-400 text-sm">
                No cover
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col gap-4 flex-1 min-w-0 mt-4 md:mt-0">

            {/* Category badge */}
            <div
              className="inline-flex items-center px-2 border border-neutral-300 self-start"
              style={{ height: 28, borderRadius: 6 }}
            >
              <span
                className="font-bold text-neutral-950 tracking-[-0.02em] text-sm leading-7"
              >
                {book.category?.name ?? "Category"}
              </span>
            </div>

            {/* Title */}
            <h1
              className="font-bold text-neutral-950 tracking-[-0.02em] text-[24px] leading-9 md:text-[28px] md:leading-[38px]"
            >
              {book.title}
            </h1>

            {/* Author */}
            <p
              className="font-semibold tracking-[-0.02em] text-base leading-[30px]"
              style={{ color: "#414651" }}
            >
              {book.author?.name ?? "Unknown Author"}
            </p>

            {/* Rating row */}
            <div className="flex items-center gap-2">
              <StarRow rating={book.rating ?? 0} size={20} />
              <span
                className="font-bold text-neutral-950 tracking-[-0.02em] text-base leading-[30px]"
              >
                {book.rating?.toFixed(1) ?? "—"}
              </span>
              <span
                className="font-medium tracking-[-0.03em] text-sm leading-7"
                style={{ color: "#414651" }}
              >
                ({book.reviewCount ?? 0} reviews)
              </span>
            </div>

            {/* Stats row  */}
            <div
              className="flex items-center w-full"
              style={{ height: 60 }}
            >
              {[
                { value: String(book.totalCopies  ?? "—"), label: "Copies"  },
                { value: String(book.borrowCount  ?? "—"), label: "Borrowed" },
                { value: String(book.reviewCount  ?? "—"), label: "Reviews" },
              ].map((stat, i) => (
                <div key={stat.label} className="flex items-center flex-1">
                  <div className="flex flex-col items-start flex-1">
                    <span
                      className="font-bold text-neutral-950 tracking-[-0.03em] text-lg leading-8 md:text-[24px] md:leading-9"
                    >
                      {stat.value}
                    </span>
                    <span
                      className="font-medium text-neutral-950 tracking-[-0.03em] text-sm leading-7"
                    >
                      {stat.label}
                    </span>
                  </div>
                  {i < 2 && (
                    <div
                      className="shrink-0 bg-neutral-300"
                      style={{ width: 1, height: 60, margin: "0 16px" }}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Divider */}
            <div className="w-full h-px bg-neutral-200" />

            {/* Description */}
            <div className="flex flex-col gap-1">
              <p
                className="font-bold text-neutral-950 tracking-[-0.02em] text-xl leading-[34px]"
              >
                Description
              </p>
              <p
                className="font-medium text-neutral-950 tracking-[-0.03em] text-sm leading-7 md:text-base md:leading-[30px]"
              >
                {book.description ?? "No description available."}
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-3 mt-2">
              <button
                className="flex-1 md:flex-none h-12 flex items-center justify-center gap-2 border border-neutral-300 rounded-full font-bold text-neutral-950 tracking-[-0.02em] text-base leading-[30px] hover:border-primary hover:text-primary transition-colors"
                style={{ minWidth: 0 }}
              >
                <ShoppingCart className="w-5 h-5 shrink-0" strokeWidth={2} />
                Add to Cart
              </button>
              <button
                className="flex-1 md:flex-none h-12 flex items-center justify-center rounded-full bg-primary hover:bg-primary/90 text-white font-bold tracking-[-0.02em] text-base leading-[30px] transition-colors"
                style={{ minWidth: 0 }}
              >
                Borrow Now
              </button>
            </div>

          </div>
        </div>

        {/* ── Reviews section ── */}
        <div className="flex flex-col gap-6 w-full">

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h2
                className="font-bold text-neutral-950 tracking-[-0.02em] text-xl leading-[34px] md:text-[24px] md:leading-9"
              >
                Review
              </h2>
              <div className="flex items-center gap-1">
                <Star className="w-5 h-5 fill-[#FFAB0D] text-[#FFAB0D]" />
                <span
                  className="font-bold text-neutral-950 tracking-[-0.02em] text-base leading-[30px]"
                >
                  {book.rating?.toFixed(1) ?? "—"}
                </span>
                <span
                  className="font-medium tracking-[-0.03em] text-sm leading-7"
                  style={{ color: "#414651" }}
                >
                  ({book.reviewCount ?? 0} Ulasan)
                </span>
              </div>
            </div>
          </div>

          {/* Review cards */}
          {loadingReviews ? (
            <p className="text-sm text-neutral-400">Loading reviews...</p>
          ) : reviewList.length === 0 ? (
            <p className="text-sm text-neutral-400">
              No reviews yet. Be the first to review!
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {reviewList.map((review) => (
                <ReviewCard
                  key={review.id}
                  userName={review.userName ?? "Anonymous"}
                  date={format(new Date(review.createdAt), "d MMMM yyyy, HH:mm")}
                  rating={review.star}
                  comment={review.comment}
                  avatarInitial={
                    (review.userName ?? "A")[0].toUpperCase()
                  }
                />
              ))}
            </div>
          )}

          {/* Load more reviews */}
          {(reviews?.meta?.totalPages ?? 1) > reviewPage && (
            <button
              onClick={() => setReviewPage(p => p + 1)}
              className="font-semibold text-neutral-950 tracking-[-0.02em] text-sm leading-7 hover:text-primary transition-colors underline underline-offset-2 self-center"
            >
              Load More
            </button>
          )}

          {/* Write a review  */}
          {isAuthenticated ? (
            <ReviewForm bookId={bookId} />
          ) : (
            <div
              className="flex flex-col items-center gap-3 py-6 px-4 rounded-2xl text-center"
              style={{ background: "#F6F9FE" }}
            >
              <p
                className="font-semibold text-neutral-950 tracking-[-0.02em] text-sm leading-7"
              >
                Login to write a review
              </p>
              <Link
                to="/login"
                className="flex items-center justify-center px-6 h-10 rounded-full bg-primary text-white font-bold tracking-[-0.02em] text-sm leading-7 hover:bg-primary/90 transition-colors"
              >
                Login
              </Link>
            </div>
          )}
        </div>

        {/* ── Related Books ── */}
        {related && related.data.length > 0 && (
          <div className="flex flex-col gap-4 md:gap-5">
            <h2
              className="font-bold text-neutral-950 tracking-[-0.02em] text-xl leading-[34px] md:text-[24px] md:leading-9"
            >
              Related Books
            </h2>

            {/* Mobile:  */}
            <div
              className="md:hidden flex flex-row gap-3 overflow-x-auto pb-2 scrollbar-hide"
            >
              {related.data.map(b => (
                <BookCard key={b.id} book={b} />
              ))}
            </div>

            {/* Desktop: */}
            <div
              className="hidden md:grid gap-4 md:gap-6"
              style={{ gridTemplateColumns: "repeat(5, 1fr)" }}
            >
              {related.data.map(b => (
                <BookCard key={b.id} book={b} />
              ))}
            </div>
          </div>
        )}

      </div>
    </UserLayout>
  );
}