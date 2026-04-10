import { BadgeCheck, UserSquare2 } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { ProfileForm } from "@/features/profile/components/profile-form";
import { getCurrentProfile, requireAuthenticatedUser } from "@/lib/auth";
import { AppProfile } from "@/types/domain";

export default async function ProfilePage() {
  const sessionState = await requireAuthenticatedUser();
  const user = sessionState.user!;
  const profile =
    (await getCurrentProfile()) ??
    {
      id: user.id,
      name: user.user_metadata.full_name ?? user.email ?? "Participante",
      nickname: user.user_metadata.full_name?.split(" ")[0] ?? "Convidado",
      avatar: `https://api.dicebear.com/9.x/notionists/svg?seed=${encodeURIComponent(user.email ?? user.id)}`,
      bio: "",
      eventStatus: "pending" as const,
      roleInEvent: "participante",
      badge: "Guest",
      itemToBring: "Nada definido",
      amountPaid: 0,
      amountDue: 0,
      paymentStatus: "pending" as const,
      appRole: "member" as const,
      email: user.email,
      roomName: null,
    } satisfies AppProfile;

  return (
    <div className="space-y-4">
      <PageHeader
        eyebrow="Perfil"
        title="Seu perfil no evento"
        description="Edite nome, apelido, bio, funcao no role e prepare seu cartao de identidade dentro do app."
      />

      <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[28px] border border-white/10 bg-white/5 p-6">
          <div className="flex items-center gap-3">
            <UserSquare2 className="size-5 text-emerald-200" />
            <h2 className="font-heading text-2xl font-semibold">Resumo</h2>
          </div>
          <div className="mt-6 space-y-4">
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <p className="text-sm text-zinc-400">Status no evento</p>
              <p className="mt-1 font-medium capitalize">{profile.eventStatus}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <p className="text-sm text-zinc-400">Cargo especial</p>
              <p className="mt-1 font-medium">{profile.badge}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <p className="text-sm text-zinc-400">Item para levar</p>
              <p className="mt-1 font-medium">{profile.itemToBring}</p>
            </div>
          </div>
        </div>
        <div className="rounded-[28px] border border-white/10 bg-white/5 p-6">
          <div className="mb-6 flex items-center gap-3">
            <BadgeCheck className="size-5 text-emerald-200" />
            <h2 className="font-heading text-2xl font-semibold">Editar dados</h2>
          </div>
          <ProfileForm profile={profile} />
        </div>
      </div>
    </div>
  );
}
