import { AppShell } from "@/components/app-shell";
import { getCurrentProfile, requireAuthenticatedUser } from "@/lib/auth";
import { currentUser } from "@/lib/mock-data";

export default async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAuthenticatedUser();
  const profile = (await getCurrentProfile()) ?? currentUser;

  return <AppShell currentUser={profile}>{children}</AppShell>;
}
