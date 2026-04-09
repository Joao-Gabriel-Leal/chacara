import { ReactNode } from "react";

export function AuthCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-[32px] border border-white/10 bg-black/35 p-6 shadow-[0_40px_120px_-60px_rgba(16,185,129,0.5)] backdrop-blur-2xl">
      <div className="mb-6 space-y-2">
        <h1 className="font-heading text-3xl font-semibold tracking-tight">{title}</h1>
        <p className="text-sm text-zinc-300">{description}</p>
      </div>
      {children}
    </div>
  );
}
