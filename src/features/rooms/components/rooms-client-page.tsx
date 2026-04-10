"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { BedDouble, Plus, Users2 } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/browser";
import { getRoomsData } from "@/lib/services/rooms";

export function RoomsClientPage({
  initialData,
  isAdmin,
}: {
  initialData: Awaited<ReturnType<typeof getRoomsData>>;
  isAdmin: boolean;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  async function createRoom(formData: FormData) {
    const supabase = createClient();
    if (!supabase) {
      toast.error("Supabase indisponivel.");
      return;
    }

    const { error } = await supabase.from("rooms").insert({
      name: String(formData.get("name") ?? ""),
      capacity: Number(formData.get("capacity") ?? 0),
      vibe: String(formData.get("vibe") ?? ""),
      badge: String(formData.get("badge") ?? ""),
    });

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Quarto criado.");
    startTransition(() => router.refresh());
  }

  async function assignParticipant(participantId: string, roomId: string) {
    const supabase = createClient();
    if (!supabase) {
      toast.error("Supabase indisponivel.");
      return;
    }

    const { error } = await supabase
      .from("profiles")
      .update({ room_id: roomId === "none" ? null : roomId })
      .eq("id", participantId);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Quarto atualizado.");
    startTransition(() => router.refresh());
  }

  return (
    <div className="space-y-4">
      <PageHeader
        eyebrow="Quartos"
        title="Divisao de quartos com visual bonito"
        description="Capacidade, participantes e movimentacao real entre quartos."
      />

      {isAdmin ? (
        <form action={createRoom} className="grid gap-3 rounded-[28px] border border-white/10 bg-white/5 p-5 md:grid-cols-4">
          <div className="space-y-2">
            <Label>Nome</Label>
            <Input name="name" placeholder="Suite Vista Piscina" />
          </div>
          <div className="space-y-2">
            <Label>Capacidade</Label>
            <Input name="capacity" type="number" min="1" placeholder="4" />
          </div>
          <div className="space-y-2">
            <Label>Clima</Label>
            <Input name="vibe" placeholder="perto da piscina" />
          </div>
          <div className="space-y-2">
            <Label>Badge</Label>
            <Input name="badge" placeholder="Premium Deck" />
          </div>
          <Button type="submit" className="md:col-span-4 rounded-full bg-emerald-400 text-black hover:bg-emerald-300">
            <Plus className="mr-2 size-4" />
            Cadastrar quarto
          </Button>
        </form>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {initialData.rooms.map((room) => (
          <div key={room.id} className="rounded-[28px] border border-white/10 bg-white/5 p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-heading text-2xl font-semibold">{room.name}</p>
                <p className="mt-2 text-sm text-zinc-400">{room.vibe}</p>
              </div>
              <Badge className="rounded-full bg-amber-400/15 text-amber-100">
                {room.badge}
              </Badge>
            </div>
            <div className="mt-6 flex items-center gap-2 text-sm text-zinc-300">
              <BedDouble className="size-4 text-emerald-200" />
              Capacidade {room.capacity}
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm text-zinc-300">
              <Users2 className="size-4 text-emerald-200" />
              {room.occupants.length} pessoas alocadas
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              {room.occupants.map((occupant) => (
                <Badge key={occupant} className="rounded-full bg-white/10 text-white">
                  {occupant}
                </Badge>
              ))}
            </div>
          </div>
        ))}
      </div>

      {isAdmin ? (
        <div className="rounded-[28px] border border-white/10 bg-white/5 p-6">
          <h2 className="font-heading text-2xl font-semibold">Mover pessoas</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {initialData.participants.map((participant) => (
              <div key={participant.id} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="font-medium">{participant.name}</p>
                <select
                  className="mt-3 flex h-10 w-full rounded-xl border border-white/10 bg-black/20 px-3 text-sm"
                  value={participant.roomId ?? "none"}
                  onChange={(event) => assignParticipant(participant.id, event.target.value)}
                  disabled={isPending}
                >
                  <option value="none">Sem quarto</option>
                  {initialData.rooms.map((room) => (
                    <option key={room.id} value={room.id}>
                      {room.name}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
