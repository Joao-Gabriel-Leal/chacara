"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/browser";
import { Button } from "@/components/ui/button";

export function SignOutButton() {
  const router = useRouter();

  return (
    <Button
      className="rounded-full bg-white text-black hover:bg-zinc-200"
      onClick={async () => {
        const supabase = createClient();

        if (supabase) {
          await supabase.auth.signOut();
        }

        toast.success("Sessao encerrada.");
        router.push("/login");
        router.refresh();
      }}
    >
      <LogOut className="mr-2 size-4" />
      Sair
    </Button>
  );
}
