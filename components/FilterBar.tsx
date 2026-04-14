"use client";

export type PageFilter = "all" | "under500" | "over500";
export type KuFilter = "all" | "ku" | "nonku";

interface FilterBarProps {
  pageFilter: PageFilter;
  kuFilter: KuFilter;
  onPageFilter: (f: PageFilter) => void;
  onKuFilter: (f: KuFilter) => void;
  total: number;
}

function ToggleGroup<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { label: string; value: T }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex rounded-xl overflow-hidden border border-pink-200">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            value === opt.value
              ? "bg-pink-500 text-white"
              : "bg-white text-gray-600 hover:bg-pink-50"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

export default function FilterBar({
  pageFilter,
  kuFilter,
  onPageFilter,
  onKuFilter,
  total,
}: FilterBarProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 flex-wrap">
      <div className="flex flex-col gap-1">
        <span className="text-xs text-gray-400 font-medium uppercase tracking-wide">
          Length
        </span>
        <ToggleGroup
          options={[
            { label: "All", value: "all" },
            { label: "Under 500 pages", value: "under500" },
            { label: "500+ pages", value: "over500" },
          ]}
          value={pageFilter}
          onChange={onPageFilter}
        />
      </div>

      <div className="flex flex-col gap-1">
        <span className="text-xs text-gray-400 font-medium uppercase tracking-wide">
          Kindle Unlimited
        </span>
        <ToggleGroup
          options={[
            { label: "All", value: "all" },
            { label: "KU Only", value: "ku" },
            { label: "Non-KU", value: "nonku" },
          ]}
          value={kuFilter}
          onChange={onKuFilter}
        />
      </div>

      <p className="text-sm text-gray-400 sm:ml-auto">
        Showing <span className="font-semibold text-gray-600">{total}</span> books
      </p>
    </div>
  );
}
