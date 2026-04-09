import { LucideIcon } from "lucide-react";

export function StatCard({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="rounded-[28px] border border-white/10 bg-white/5 p-5 shadow-[0_20px_80px_-40px_rgba(0,0,0,0.65)] backdrop-blur-xl">
      <div className="mb-4 flex size-11 items-center justify-center rounded-2xl bg-white/10">
        <Icon className="size-5 text-white" />
      </div>
      <p className="text-sm text-zinc-400">{label}</p>
      <p className="mt-2 text-3xl font-semibold tracking-tight">{value}</p>
      <p className="mt-2 text-sm text-zinc-300">{hint}</p>
    </div>
  );
}
