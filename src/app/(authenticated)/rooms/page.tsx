import { BedDouble, Users2 } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { rooms } from "@/lib/mock-data";

export default function RoomsPage() {
  return (
    <div className="space-y-4">
      <PageHeader
        eyebrow="Quartos"
        title="Divisao de quartos com visual bonito"
        description="Capacidade, participantes, clima do quarto e badges engraçadas. O admin pode reorganizar tudo."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {rooms.map((room) => (
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
    </div>
  );
}
