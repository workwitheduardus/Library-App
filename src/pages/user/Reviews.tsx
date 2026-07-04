import { useState } from "react";
import { Star, Trash2, X } from "lucide-react";
import { format } from "date-fns";
import UserLayout from "@/layouts/UserLayout";
import ProfileTabs from "@/components/user/ProfileTabs";
import { useMyReviews, useDeleteMyReview } from "@/hooks/useMyReviews";
import type { Review } from "@/types/api/reviews";

/* ── Star display ── */
function StarDisplay({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-[2px]">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={
            i <= rating
              ? "fill-[#FFAB0D] text-[#FFAB0D]"
              : "fill-neutral-200 text-neutral-200"
          }
          style={{ width: 16, height: 16 }}
        />
      ))}
    </div>
  );
}

/* ── Single review card ── */
function ReviewCard({
  review,
  onDelete,
  isDeleting,
}: {
  review: Review;
  onDelete: () => void;
  isDeleting: boolean;
}) {

  const dateStr = (() => {
    try {
      return format(new Date(review.createdAt), "d MMMM yyyy, HH:mm");
    } catch {
      return review.createdAt;
    }
  })();

  return (
    <div
      className="flex flex-col gap-3 p-4 md:p-5 bg-white rounded-2xl shadow-[0px_0px_20px_rgba(203,202,202,0.25)]"
    >
      {/* Top row: date + delete */}
      <div className="flex items-center justify-between">
        <span
          className="font-medium tracking-[-0.03em] text-xs leading-5 md:text-sm md:leading-7"
          style={{ color: "#414651" }}
        >
          {dateStr}
        </span>
        <button
          onClick={onDelete}
          disabled={isDeleting}
          className="w-8 h-8 flex items-center justify-center text-neutral-400 hover:text-[#EE1D52] transition-colors disabled:opacity-40"
          aria-label="Delete review"
        >
          <Trash2 className="w-4 h-4" strokeWidth={1.5} />
        </button>
      </div>

      {/* Book info row */}
      <div className="flex items-start gap-3 md:gap-4">
        {/* Cover */}
        <div
          className="shrink-0 w-[60px] h-[90px] bg-neutral-200 rounded overflow-hidden"
        >
          <div
            className="w-full h-full flex items-center justify-center text-neutral-400 text-xs text-center px-1"
          >
            No Cover
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-col gap-1 flex-1 min-w-0">
          {/* Category badge */}
          <div
            className="inline-flex items-center px-2 border border-neutral-300 self-start"
            style={{ height: 24, borderRadius: 4 }}
          >
            <span
              className="font-bold text-neutral-950 tracking-[-0.02em] text-xs leading-5"
            >
              Category
            </span>
          </div>

          {/* Book name */}
          <p
            className="font-bold text-neutral-950 tracking-[-0.02em] text-sm leading-7 md:text-base md:leading-[30px] line-clamp-2"
          >
            Book Name
          </p>

          {/* Author */}
          <p
            className="font-medium tracking-[-0.03em] text-xs leading-5 md:text-sm md:leading-7"
            style={{ color: "#414651" }}
          >
            Author name
          </p>

          {/* Stars */}
          <StarDisplay rating={review.star} />
        </div>
      </div>

      {/* Comment */}
      <p
        className="font-medium text-neutral-950 tracking-[-0.03em] text-sm leading-7"
      >
        {review.comment}
      </p>
    </div>
  );
}

/* ── Give Review modal ── */
function GiveReviewModal({ onClose }: { onClose: () => void }) {
  const [star, setStar] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.4)" }}
    >
      <div
        className="flex flex-col gap-4 p-5 bg-white rounded-2xl w-[361px] md:w-[420px]"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <p
            className="font-bold text-neutral-950 tracking-[-0.02em] text-base leading-[30px]"
          >
            Give Review
          </p>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center text-neutral-400 hover:text-neutral-950 transition-colors"
          >
            <X className="w-5 h-5" strokeWidth={2} />
          </button>
        </div>

        {/* Star picker */}
        <div className="flex items-center justify-center gap-2 py-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <button
              key={i}
              type="button"
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(0)}
              onClick={() => setStar(i)}
              className="w-8 h-8 flex items-center justify-center"
            >
              <Star
                className={
                  i <= (hover || star)
                    ? "fill-[#FFAB0D] text-[#FFAB0D]"
                    : "fill-neutral-200 text-neutral-200"
                }
                style={{ width: 28, height: 28 }}
              />
            </button>
          ))}
        </div>

        {/* Textarea */}
        <textarea
          placeholder="Share your thoughts about this book..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full px-4 py-3 border border-neutral-300 rounded-xl text-sm font-normal text-neutral-950 outline-none focus:border-primary transition-colors resize-none"
          style={{ height: 100 }}
        />

        {/* Send button */}
        <button
          disabled={!star || !comment.trim()}
          className="w-full h-12 flex items-center justify-center rounded-full bg-primary hover:bg-primary/90 text-white font-bold tracking-[-0.02em] text-base leading-[30px] disabled:opacity-40 transition-opacity"
        >
          Send
        </button>
      </div>
    </div>
  );
}

/* ── Main page ── */
export default function Reviews() {
  const [showModal, setShowModal] = useState(false);
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useMyReviews({ page, limit: 10 });
  const { mutate: deleteReview, isPending: isDeleting } = useDeleteMyReview();

  const reviews = data?.data ?? [];
  const totalPages = data?.meta?.totalPages ?? 1;

  return (
    <UserLayout>
      <div
        className="flex flex-col w-full px-4 md:px-[120px] py-6 md:py-8 gap-5"
      >
        {/* Tab switcher */}
        <ProfileTabs active="Reviews" />

        {/* Page title + Give Review button */}
        <div className="flex items-center justify-between">
          <h1
            className="font-bold text-neutral-950 tracking-[-0.02em] text-[24px] leading-9 md:text-[28px] md:leading-[38px]"
          >
            Reviews
          </h1>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center justify-center px-5 h-10 rounded-full bg-primary hover:bg-primary/90 text-white font-bold tracking-[-0.02em] text-sm leading-7 transition-colors"
          >
            Give Review
          </button>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex justify-center py-20 text-sm text-neutral-400">
            Loading reviews...
          </div>
        )}

        {/* Error */}
        {isError && (
          <div
            className="flex justify-center py-20 text-sm font-medium"
            style={{ color: "#EE1D52" }}
          >
            Failed to load reviews.
          </div>
        )}

        {/* Empty */}
        {!isLoading && !isError && reviews.length === 0 && (
          <div className="flex flex-col items-center gap-3 py-20">
            <p className="text-sm text-neutral-400 text-center">
              You haven't written any reviews yet.
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center justify-center px-6 h-11 rounded-full bg-primary text-white font-bold tracking-[-0.02em] text-base leading-[30px] hover:bg-primary/90 transition-colors"
            >
              Write a Review
            </button>
          </div>
        )}

        {/* Review cards */}
        {!isLoading && !isError && reviews.length > 0 && (
          <div className="flex flex-col gap-4">
            {reviews.map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
                onDelete={() => deleteReview(review.id)}
                isDeleting={isDeleting}
              />
            ))}
          </div>
        )}

        {/* Load more */}
        {!isLoading && page < totalPages && (
          <div className="flex justify-center">
            <button
              onClick={() => setPage((p) => p + 1)}
              className="font-semibold text-neutral-950 tracking-[-0.02em] text-sm leading-7 hover:text-primary transition-colors underline underline-offset-2"
            >
              Load More
            </button>
          </div>
        )}
      </div>

      {/* Give Review modal */}
      {showModal && <GiveReviewModal onClose={() => setShowModal(false)} />}
    </UserLayout>
  );
}
