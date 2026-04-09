import { MessageCircle, Pin, ThumbsUp } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { feedPosts } from "@/lib/mock-data";

export default function FeedPage() {
  return (
    <div className="space-y-4">
      <PageHeader
        eyebrow="Mural"
        title="Feed interno no estilo rede social"
        description="Posts, comentarios e avisos fixados pelo admin em uma interface social para o grupo."
      />

      <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <aside className="rounded-[28px] border border-white/10 bg-white/5 p-6">
          <h2 className="font-heading text-2xl font-semibold">Novo post</h2>
          <div className="mt-4 space-y-3">
            <Input placeholder="Compartilhe um aviso, ideia ou caos controlado..." />
            <Button className="w-full rounded-full bg-emerald-400 text-black hover:bg-emerald-300">
              Publicar
            </Button>
          </div>
        </aside>

        <section className="space-y-4">
          {feedPosts.map((post) => (
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
