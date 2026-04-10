"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Camera,
  ClipboardList,
  DoorOpen,
  Flame,
  Gamepad2,
  LayoutDashboard,
  MessageSquareHeart,
  PieChart,
  ShieldCheck,
  UserCircle2,
} from "lucide-react";
import { AppProfile } from "@/types/domain";
import { ThemeToggle } from "@/components/theme-toggle";
import { SignOutButton } from "@/components/sign-out-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const navigation = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/profile", label: "Perfil", icon: UserCircle2 },
  { href: "/finance", label: "Financeiro", icon: PieChart },
  { href: "/gallery", label: "Galeria", icon: Camera },
  { href: "/organization", label: "Organizacao", icon: ClipboardList },
  { href: "/rooms", label: "Quartos", icon: DoorOpen },
  { href: "/polls", label: "Enquetes", icon: Flame },
  { href: "/games", label: "Jogos", icon: Gamepad2 },
  { href: "/feed", label: "Mural", icon: MessageSquareHeart },
];

export function AppShell({
  children,
  currentUser,
}: {
  children: React.ReactNode;
  currentUser: AppProfile;
}) {
  const pathname = usePathname();
  const items = currentUser.appRole === "admin"
    ? [...navigation, { href: "/admin", label: "Admin", icon: ShieldCheck }]
    : navigation;

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.18),_transparent_25%),linear-gradient(180deg,#09090b_0%,#101114_100%)] text-white">
      <div className="mx-auto flex min-h-screen max-w-[1600px] gap-6 px-4 py-4 md:px-6">
        <aside className="sticky top-4 hidden h-[calc(100vh-2rem)] w-72 flex-col rounded-[32px] border border-white/10 bg-black/30 p-5 backdrop-blur-2xl lg:flex">
          <div className="flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-emerald-400/20 text-emerald-200 shadow-lg shadow-emerald-900/30">
              <Flame className="size-6" />
            </div>
            <div>
              <p className="font-heading text-lg font-semibold">Chacara Hub</p>
              <p className="text-sm text-zinc-400">Weekend operating system</p>
            </div>
          </div>

          <div className="mt-8 flex items-center gap-3 rounded-[26px] border border-white/10 bg-white/5 p-3">
            <Avatar className="size-12 border border-white/10">
              <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
              <AvatarFallback>{currentUser.nickname.slice(0, 2)}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate font-medium">{currentUser.name}</p>
              <p className="truncate text-sm text-zinc-400">{currentUser.roleInEvent}</p>
            </div>
            <Badge className="ml-auto rounded-full bg-emerald-400/15 text-emerald-200">
              {currentUser.badge}
            </Badge>
          </div>

          <nav className="mt-8 flex-1 space-y-2">
            {items.map(({ href, label, icon: Icon }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition",
                    active
                      ? "bg-white text-zinc-950 shadow-lg"
                      : "text-zinc-300 hover:bg-white/8 hover:text-white",
                  )}
                >
                  <Icon className="size-4" />
                  {label}
                </Link>
              );
            })}
          </nav>

          <div className="rounded-[24px] border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-4">
            <p className="text-sm font-medium">Evento com 20 convidados</p>
            <p className="mt-2 text-sm text-zinc-400">
              Tudo centralizado: convites, comprovantes, fotos e ranking.
            </p>
          </div>
        </aside>

        <div className="flex min-h-screen flex-1 flex-col gap-4">
          <header className="sticky top-4 z-30 flex items-center justify-between rounded-[28px] border border-white/10 bg-black/30 px-4 py-3 backdrop-blur-2xl">
            <div>
              <p className="text-sm text-zinc-400">Painel oficial do evento</p>
              <p className="font-heading text-xl font-semibold tracking-tight">
                Tudo que o grupo precisa, em um lugar so
              </p>
            </div>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <SignOutButton />
            </div>
          </header>

          <main className="flex-1">{children}</main>
        </div>
      </div>
    </div>
  );
}
