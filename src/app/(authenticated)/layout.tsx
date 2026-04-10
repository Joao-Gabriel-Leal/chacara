import { AppShell } from "@/components/app-shell";
import { getCurrentProfile, requireAuthenticatedUser } from "@/lib/auth";
import { AppProfile } from "@/types/domain";

export default async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sessionState = await requireAuthenticatedUser();
  const user = sessionState.user!;
  const profile =
    (await getCurrentProfile()) ??
    ({
      id: user.id,
      name: user.user_metadata.full_name ?? user.email ?? "Participante",
      nickname: user.user_metadata.full_name?.split(" ")[0] ?? "Convidado",
      avatar: `https://api.dicebear.com/9.x/notionists/svg?seed=${encodeURIComponent(user.email ?? user.id)}`,
      bio: "",
      eventStatus: "pending",
      roleInEvent: "participante",
      badge: "Guest",
      itemToBring: "Nada definido",
      amountPaid: 0,
      amountDue: 0,
      paymentStatus: "pending",
      appRole: "member",
      email: user.email,
      roomName: null,
    } satisfies AppProfile);

  return <AppShell currentUser={profile}>{children}</AppShell>;
}
