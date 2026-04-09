import { BarChart3, Vote } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { polls } from "@/lib/mock-data";

export default function PollsPage() {
  return (
    <div className="space-y-4">
      <PageHeader
        eyebrow="Enquetes"
        title="Votacao unica com resultado em tempo real"
        description="Admin abre enquetes e o grupo vota uma vez. O app ja prepara o terreno para persistir isso no Supabase."
      />

      <div className="grid gap-4 xl:grid-cols-2">
        {polls.map((poll) => (
          <div key={poll.id} className="rounded-[28px] border border-white/10 bg-white/5 p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-heading text-2xl font-semibold">{poll.title}</p>
                <p className="mt-2 text-sm text-zinc-400">{poll.description}</p>
              </div>
              <Badge className="rounded-full bg-emerald-400/15 capitalize text-emerald-100">
                {poll.status}
              </Badge>
            </div>
            <div className="mt-6 space-y-4">
              {poll.options.map((option) => {
                const percentage = (option.votes / poll.totalVotes) * 100;
                return (
                  <div key={option.id} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">{option.label}</p>
                      <p className="text-sm text-zinc-400">{option.votes} votos</p>
                    </div>
                    <Progress value={percentage} className="mt-3 h-2 bg-white/10" />
                  </div>
                );
              })}
            </div>
            <div className="mt-6 flex gap-3">
              <Button className="rounded-full bg-emerald-400 text-black hover:bg-emerald-300">
                <Vote className="mr-2 size-4" />
                Votar
              </Button>
              <Button variant="outline" className="rounded-full border-white/10 bg-white/5">
                <BarChart3 className="mr-2 size-4" />
                Ver resultados
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
