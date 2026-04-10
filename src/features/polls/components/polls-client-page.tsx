"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { BarChart3, Plus, Vote } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/browser";
import { getPollsData } from "@/lib/services/polls";

export function PollsClientPage({
  initialData,
  currentUserId,
  isAdmin,
}: {
  initialData: Awaited<ReturnType<typeof getPollsData>>;
  currentUserId?: string;
  isAdmin: boolean;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [options, setOptions] = useState(["", "", ""]);

  async function vote(pollId: string, optionId: string) {
    const supabase = createClient();
    if (!supabase || !currentUserId) {
      toast.error("Sessao indisponivel.");
      return;
    }

    const { error } = await supabase.from("poll_votes").insert({
      poll_id: pollId,
      option_id: optionId,
      user_id: currentUserId,
    });

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Voto registrado.");
    startTransition(() => router.refresh());
  }

  async function createPoll() {
    const supabase = createClient();
    if (!supabase || !currentUserId) {
      toast.error("Sessao indisponivel.");
      return;
    }

    const validOptions = options.filter(Boolean);
    if (!title || validOptions.length < 2) {
      toast.error("Preencha titulo e pelo menos 2 opcoes.");
      return;
    }

    const { data: poll, error: pollError } = await supabase
      .from("polls")
      .insert({
        title,
        description,
        status: "active",
        created_by: currentUserId,
      })
      .select("id")
      .single();

    if (pollError || !poll) {
      toast.error(pollError?.message ?? "Nao foi possivel criar a enquete.");
      return;
    }

    const { error: optionsError } = await supabase.from("poll_options").insert(
      validOptions.map((label, index) => ({
        poll_id: poll.id,
        label,
        sort_order: index,
      })),
    );

    if (optionsError) {
      toast.error(optionsError.message);
      return;
    }

    toast.success("Enquete criada.");
    setTitle("");
    setDescription("");
    setOptions(["", "", ""]);
    startTransition(() => router.refresh());
  }

  return (
    <div className="space-y-4">
      <PageHeader
        eyebrow="Enquetes"
        title="Votacao unica com resultado em tempo real"
        description="Criacao, voto e contagem real no banco."
        action={
          isAdmin ? (
            <Dialog>
              <DialogTrigger className="inline-flex h-10 items-center justify-center rounded-full bg-emerald-400 px-4 text-sm font-medium text-black transition hover:bg-emerald-300">
                <Plus className="mr-2 size-4" />
                Nova enquete
              </DialogTrigger>
              <DialogContent className="border-white/10 bg-zinc-950 text-white">
                <DialogHeader>
                  <DialogTitle>Criar enquete</DialogTitle>
                </DialogHeader>
                <div className="space-y-3">
                  <Input placeholder="Titulo" value={title} onChange={(event) => setTitle(event.target.value)} />
                  <Textarea placeholder="Descricao" value={description} onChange={(event) => setDescription(event.target.value)} />
                  {options.map((option, index) => (
                    <Input
                      key={index}
                      placeholder={`Opcao ${index + 1}`}
                      value={option}
                      onChange={(event) => {
                        const clone = [...options];
                        clone[index] = event.target.value;
                        setOptions(clone);
                      }}
                    />
                  ))}
                  <Button className="w-full rounded-full bg-emerald-400 text-black hover:bg-emerald-300" onClick={createPoll}>
                    Criar
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          ) : null
        }
      />

      <div className="grid gap-4 xl:grid-cols-2">
        {initialData.polls.map((poll) => (
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
                const percentage = poll.totalVotes > 0 ? (option.votes / poll.totalVotes) * 100 : 0;
                return (
                  <div key={option.id} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">{option.label}</p>
                      <p className="text-sm text-zinc-400">{option.votes} votos</p>
                    </div>
                    <Progress value={percentage} className="mt-3 h-2 bg-white/10" />
                    <Button
                      className="mt-3 rounded-full bg-emerald-400 text-black hover:bg-emerald-300"
                      disabled={initialData.hasVotes.has(poll.id) || isPending}
                      onClick={() => vote(poll.id, option.id)}
                    >
                      <Vote className="mr-2 size-4" />
                      {initialData.hasVotes.has(poll.id) ? "Voto registrado" : "Votar"}
                    </Button>
                  </div>
                );
              })}
            </div>
            <div className="mt-6 flex gap-3">
              <Button variant="outline" className="rounded-full border-white/10 bg-white/5">
                <BarChart3 className="mr-2 size-4" />
                {poll.totalVotes} votos totais
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
