import { useEffect, useState } from "react";
import { X } from "lucide-react";

const SnackBar = ({ message, type, onRemove }) => {
  const [visible, setVisible] = useState(false);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const enterTimer = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(enterTimer);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setFading(true), 2500);
    return () => clearTimeout(timer);
  }, []);

  const handleTransitionEnd = () => {
    if (fading) onRemove();
  };

  const bgColor =
    type === "success"
      ? "bg-green-50 border-green-200 text-green-700 dark:bg-green-900/30 dark:border-green-700 dark:text-green-300"
      : "bg-red-50 border-red-200 text-red-700 dark:bg-red-900/30 dark:border-red-700 dark:text-red-300";

  return (
    <div
      onTransitionEnd={handleTransitionEnd}
      className={`min-w-[220px] max-w-sm flex items-center justify-between gap-3 px-4 py-3 rounded-lg border shadow-lg text-sm font-medium transition-all duration-300
        ${bgColor} pointer-events-auto
        ${visible && !fading ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"}`}
    >
      <span className="flex-1 break-words leading-snug">{message}</span>
      <button
        onClick={() => setFading(true)}
        aria-label="Close"
        className="flex items-center justify-center h-7 w-7 rounded-full transition-colors hover:bg-black/10 dark:hover:bg-white/10"
      >
        <X size={14} strokeWidth={2} />
      </button>
    </div>
  );
};

export default SnackBar;
