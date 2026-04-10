"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { MessageCircle, Pin, Send, ThumbsUp } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/page-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/browser";
import { getFeedData } from "@/lib/services/feed";

export function FeedClientPage({
  initialData,
  currentUserId,
  isAdmin,
}: {
  initialData: Awaited<ReturnType<typeof getFeedData>>;
  currentUserId?: string;
  isAdmin: boolean;
}) {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [isPending, startTransition] = useTransition();

  async function createPost() {
    const supabase = createClient();
    if (!supabase || !currentUserId || !content) {
      toast.error("Preencha o post.");
      return;
    }

    const { error } = await supabase.from("posts").insert({
      user_id: currentUserId,
      content,
      is_pinned: false,
    });

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Post publicado.");
    setContent("");
    startTransition(() => router.refresh());
  }

  async function togglePin(postId: string, value: boolean) {
    const supabase = createClient();
    if (!supabase) {
      toast.error("Supabase indisponivel.");
      return;
    }

    const { error } = await supabase.from("posts").update({ is_pinned: value }).eq("id", postId);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Post atualizado.");
    startTransition(() => router.refresh());
  }

  return (
    <div className="space-y-4">
      <PageHeader
        eyebrow="Mural"
        title="Feed interno no estilo rede social"
        description="Posts reais do grupo, com fixacao de avisos pelo admin."
      />

      <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <aside className="rounded-[28px] border border-white/10 bg-white/5 p-6">
          <h2 className="font-heading text-2xl font-semibold">Novo post</h2>
          <div className="mt-4 space-y-3">
            <Input value={content} onChange={(event) => setContent(event.target.value)} placeholder="Compartilhe um aviso, ideia ou caos controlado..." />
            <Button className="w-full rounded-full bg-emerald-400 text-black hover:bg-emerald-300" onClick={createPost} disabled={isPending}>
              <Send className="mr-2 size-4" />
              Publicar
            </Button>
          </div>
        </aside>

        <section className="space-y-4">
          {initialData.posts.map((post) => (
            <article key={post.id} className="rounded-[28px] border border-white/10 bg-white/5 p-6">
              <div className="flex items-start gap-3">
                <Avatar className="size-12 border border-white/10">
                  <AvatarImage src={post.avatar} alt={post.author} />
                  <AvatarFallback>{post.author.slice(0, 2)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-medium">{post.author}</p>
                      <p className="text-sm text-zinc-400">{post.createdAt}</p>
                    </div>
                    {post.pinned ? (
                      <Badge className="rounded-full bg-amber-400/15 text-amber-100">
                        <Pin className="mr-1 size-3" />
                        Fixo
                      </Badge>
                    ) : null}
                  </div>
                  <p className="mt-4 leading-7 text-zinc-200">{post.content}</p>
                  <div className="mt-5 flex gap-3">
                    <Button variant="ghost" className="rounded-full text-zinc-200 hover:bg-white/10">
                      <ThumbsUp className="mr-2 size-4" />
                      {post.likes}
                    </Button>
                    <Button variant="ghost" className="rounded-full text-zinc-200 hover:bg-white/10">
                      <MessageCircle className="mr-2 size-4" />
                      {post.comments}
                    </Button>
                    {isAdmin ? (
                      <Button
                        variant="outline"
                        className="rounded-full border-white/10 bg-white/5"
                        onClick={() => togglePin(post.id, !post.pinned)}
                      >
                        {post.pinned ? "Desafixar" : "Fixar"}
                      </Button>
                    ) : null}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </section>
      </div>
    </div>
  );
}
