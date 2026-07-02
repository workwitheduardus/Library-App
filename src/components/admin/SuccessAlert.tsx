import { useEffect } from "react";
import { X } from "lucide-react";

interface Props {
  message: string;
  onClose: () => void;
  duration?: number;
}

export default function SuccessAlert({
  message,
  onClose,
  duration = 3000,
}: Props) {
  useEffect(() => {
    const t = setTimeout(onClose, duration);
    return () => clearTimeout(t);
  }, [onClose, duration]);

  return (
    <>
      <div
        className="md:hidden fixed left-1/2 -translate-x-1/2 z-50 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-color-success"
        style={{
          top: 68,
          width: 345,
        }}
      >
        <span
          className="flex-1 font-semibold text-white tracking-[-0.02em]"
          style={{ fontSize: 14, lineHeight: "28px" }}
        >
          {message}
        </span>
        <button onClick={onClose} className="shrink-0">
          <X className="w-4 h-4 text-white" strokeWidth={1.33} />
        </button>
      </div>
      <div
        className="hidden md:flex fixed z-50 items-center gap-2 px-3 py-2 rounded-lg bg:color-accent-green"
        style={{ top: 116, left: 1029, width: 291 }}
      >
        <span
          className="flex-1 font-semibold text-white tracking-[-0.02em]"
          style={{ fontSize: 14, lineHeight: "28px" }}
        >
          {message}
        </span>
        <button onClick={onClose} className="shrink-0">
          <X className="w-4 h-4 text-white" strokeWidth={1.33} />
        </button>
      </div>
    </>
  );
}
