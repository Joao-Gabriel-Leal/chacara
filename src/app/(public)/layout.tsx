export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.20),_transparent_30%),linear-gradient(180deg,#050505_0%,#101114_100%)] text-white">
      {children}
    </div>
  );
}
