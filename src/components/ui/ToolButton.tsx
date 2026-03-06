"use client";

interface ToolButtonProps {
  label: string;
  icon: string;
  active: boolean;
  onClick: () => void;
  shortcut?: string;
}

export default function ToolButton({ label, icon, active, onClick, shortcut }: ToolButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-0.5 px-3 py-2 rounded transition-colors ${
        active
          ? "bg-blue-600 text-white"
          : "bg-gray-800 text-gray-300 hover:bg-gray-700"
      }`}
      title={shortcut ? `${label} (${shortcut})` : label}
    >
      <span className="text-lg">{icon}</span>
      <span className="text-[10px]">{label}</span>
    </button>
  );
}
