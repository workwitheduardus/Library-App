import { useEffect, useRef } from "react";

interface Props {
  onPreview: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onClose: () => void;
}

export default function BookMenu({
  onPreview,
  onEdit,
  onDelete,
  onClose,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [onClose]);

  return (
    <div
      ref={ref}
      className="absolute right-0 top-8 z-30 flex flex-col gap-4 p-4 bg-white rounded-2xl"
      style={{ width: 154, boxShadow: "0px 0px 20px rgba(203,202,202,0.25)" }}
    >
      {[
        { label: "Preview", color: "neutral-950", action: onPreview },
        { label: "Edit", color: "neutral-950", action: onEdit },
        { label: "Delete", color: "color-acent-red", action: onDelete },
      ].map((item) => (
        <button
          key={item.label}
          onClick={item.action}
          className="w-full text-left font-semibold tracking-[-0.02em]"
          style={{ fontSize: 14, lineHeight: "30px", color: item.color }}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
