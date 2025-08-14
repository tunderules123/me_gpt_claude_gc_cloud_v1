import React from "react";

export default function TagButton({
  tag,
  active,
  onClick,
}: {
  tag: "@gpt" | "@claude";
  active: boolean;
  onClick: () => void;
}) {
  const base =
    "px-3 py-1 rounded-full border text-sm transition-colors select-none";
  const styles = active
    ? "border-blue-600 text-blue-700 bg-blue-50"
    : "border-gray-300 text-gray-700 bg-white hover:bg-gray-50";
  return (
    <button className={`${base} ${styles}`} onClick={onClick} type="button">
      {tag}
    </button>
  );
}