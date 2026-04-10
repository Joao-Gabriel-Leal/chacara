"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Crown, Dice5, Sparkles, Zap } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/browser";
import { getGamesData } from "@/lib/services/games";

type GamesData = Awaited<ReturnType<typeof getGamesData>>;

const defaultPoints: Record<string, number> = {
  "quem-e-mais-provavel": 10,
  "roleta-do-caos": 15,
  "quiz-do-grupo": 20,
  "bingo-do-role": 12,
};

export function GamesClientPage({
  initialData,
  currentUserId,
}: {
  initialData: GamesData;
  currentUserId?: string;
}) {
  const router = useRouter();
  const [selectedPlayer, setSelectedPlayer] = useState<string>("");
  const [note, setNote] = useState("");
  const [points, setPoints] = useState(10);
  const [isPending, startTransition] = useTransition();

  const { data } = useQuery({
    queryKey: ["games", "data"],
    queryFn: async () => initialData,
    initialData,
  });

  async function registerScore(gameType: string, targetUserId: string, score: number, reason: string) {
    const supabase = createClient();

    if (!supabase || !currentUserId) {
      toast.error("Sessao ou Supabase indisponivel.");
      return;
    }

    const { data: session, error: sessionError } = await supabase
      .from("game_sessions")
      .insert({
        game_type: gameType,
        title: reason || `Sessao ${gameType}`,
        created_by: currentUserId,
      })
      .select("id")
      .single();

    if (sessionError || !session) {
      toast.error(sessionError?.message ?? "Nao foi possivel criar a sessao.");
      return;
    }

    const { error: actionError } = await supabase.from("game_actions").insert({
      session_id: session.id,
      actor_id: currentUserId,
      payload: {
        target_user_id: targetUserId,
        points: score,
        reason,
      },
    });

    if (actionError) {
      toast.error(actionError.message);
      return;
    }

    const { error: scoreError } = await supabase.from("game_score_events").insert({
      session_id: session.id,
      user_id: targetUserId,
      points: score,
      reason,
    });

    if (scoreError) {
      toast.error(scoreError.message);
      return;
    }

    toast.success("Jogada registrada e pontuacao atualizada.");
    startTransition(() => {
      router.refresh();
    });
  }

  async function spinChaosWheel() {
    if (data.players.length === 0) {
      toast.error("Nao ha participantes para sortear.");
      return;
    }

    const randomPlayer =
      data.players[Math.floor(Math.random() * data.players.length)];
    const randomPoints = [5, 10, 15, 20][Math.floor(Math.random() * 4)];
    await registerScore(
      "roleta-do-caos",
      randomPlayer.id,
      randomPoints,
      `Roleta do Caos: ${randomPlayer.name} recebeu ${randomPoints} pontos`,
    );
  }

  return (
    <div className="space-y-4">
      <PageHeader
        eyebrow="Jogos"
        title="Competicao com ranking unificado"
        description="Agora com sessoes e pontuacao persistidas no banco para voce testar o role de verdade."
      />

      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="grid gap-4 md:grid-cols-2">
          {data.cards.map((game) => (
            <div key={game.id} className="rounded-[28px] border border-white/10 bg-white/5 p-6">
              <div className={`rounded-[24px] bg-gradient-to-br ${game.accent} p-5 text-black`}>
                <p className="text-sm uppercase tracking-[0.25em]">Jogo</p>
                <h2 className="mt-2 font-heading text-3xl font-semibold">{game.title}</h2>
                <p className="mt-3 text-sm">{game.description}</p>
              </div>
              <div className="mt-5 flex items-center justify-between">
                <Badge className="rounded-full bg-white/10 text-white">
                  {game.players} sessoes registradas
                </Badge>
                {game.id === "roleta-do-caos" ? (
                  <Button
                    className="rounded-full bg-white text-black hover:bg-zinc-200"
                    onClick={spinChaosWheel}
                    disabled={isPending}
                  >
                    <Dice5 className="mr-2 size-4" />
                    Girar roleta
                  </Button>
                ) : (
                  <Dialog>
                    <DialogTrigger className="inline-flex h-9 items-center justify-center rounded-full bg-white px-4 text-sm font-medium text-black transition hover:bg-zinc-200">
                      Jogar agora
                    </DialogTrigger>
                    <DialogContent className="border-white/10 bg-zinc-950 text-white">
                      <DialogHeader>
                        <DialogTitle>{game.title}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Participante pontuado</Label>
                          <Select
                            value={selectedPlayer}
                            onValueChange={(value) => {
                              setSelectedPlayer(value ?? "");
                              setPoints(defaultPoints[game.id] ?? 10);
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Escolha alguem" />
                            </SelectTrigger>
                            <SelectContent>
                              {data.players.map((player) => (
                                <SelectItem key={player.id} value={player.id}>
                                  {player.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Pontos</Label>
                          <Input
                            type="number"
                            value={points}
                            onChange={(event) => setPoints(Number(event.target.value))}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Resumo da jogada</Label>
                          <Textarea
                            value={note}
                            onChange={(event) => setNote(event.target.value)}
                            placeholder="Ex.: acertou a resposta do quiz"
                          />
                        </div>
                        <Button
                          className="w-full rounded-full bg-emerald-400 text-black hover:bg-emerald-300"
                          disabled={!selectedPlayer || isPending}
                          onClick={async () => {
                            await registerScore(
                              game.id,
                              selectedPlayer,
                              points,
                              note || `${game.title} registrado`,
                            );
                            setNote("");
                            setSelectedPlayer("");
                          }}
                        >
                          <Sparkles className="mr-2 size-4" />
                          Registrar jogada
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            </div>
          ))}
        </section>

        <aside className="rounded-[28px] border border-white/10 bg-white/5 p-6">
          <div className="flex items-center gap-3">
            <Crown className="size-5 text-amber-200" />
            <h2 className="font-heading text-2xl font-semibold">Ranking geral</h2>
          </div>
          <div className="mt-6 space-y-3">
            {data.ranking.map((entry, index) => (
              <div
                key={`${entry.user}-${index}`}
                className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-4 py-3"
              >
                <div>
                  <p className="font-medium">
                    #{index + 1} {entry.user}
                  </p>
                  <p className="text-sm text-zinc-400">{entry.streak}</p>
                </div>
                <Badge className="rounded-full bg-emerald-400/15 text-emerald-100">
                  <Zap className="mr-1 size-3" />
                  {entry.points}
                </Badge>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
