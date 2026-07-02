
interface Props {
  onCancel: () => void;
  onConfirm: () => void;
  isPending: boolean;
}

export default function DeleteModal({ onCancel, onConfirm, isPending }: Props) {
  return (
    /* Overlay */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.4)" }}
    >
      <div className="flex flex-col gap-4 p-5 bg-white rounded-2xl w-[361px] md:w-[452px] md:gap-8">
        {/* Text */}
        <div className="flex flex-col gap-3">
          <p
            className="font-bold text-neutral-950 tracking-[-0.02em] text-base leading-8 md:text-lg md:tracking-[-0.03em]"
          >
            Delete Data
          </p>
          <p
            className="font-semibold text-neutral-950 tracking-[-0.02em] text-sm md:text-base leading-[30px]"
          >
            Once deleted, you won't be able to recover this data.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-4">
          <button
            onClick={onCancel}
            className="flex-1 flex justify-center rounded-full border border-neutral-300 rounded-full font-bold text-neutral-950 tracking-[-0.02em] h-10 md:h-11 text-sm md:text-base md:leading-[30px]"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isPending}
            className="flex-1 flex justify-center rounded-full font-bold text-white tracking-[-0.02em] h-10 md:h-11 text-sm md:text-base disabled:opacity-60
            bg-color-acent-red md:leading-[30px]"
          >
            {isPending ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
