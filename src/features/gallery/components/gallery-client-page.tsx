"use client";

import Image from "next/image";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Heart, Link2, Sparkles, UploadCloud } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createClient } from "@/lib/supabase/browser";
import { getGalleryData } from "@/lib/services/gallery";

export function GalleryClientPage({
  initialGallery,
  initialAlbums,
  currentUserId,
}: {
  initialGallery: Awaited<ReturnType<typeof getGalleryData>>["appGallery"];
  initialAlbums: Awaited<ReturnType<typeof getGalleryData>>["albums"];
  currentUserId?: string;
}) {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [caption, setCaption] = useState("");
  const [category, setCategory] = useState("resenha");
  const [externalLink, setExternalLink] = useState("");
  const [externalCaption, setExternalCaption] = useState("");
  const [isPending, startTransition] = useTransition();
  const { data: photos = [] } = useQuery({
    queryKey: ["gallery", "items"],
    queryFn: async () => initialGallery,
    initialData: initialGallery,
  });

  async function uploadInternalPhoto() {
    const supabase = createClient();

    if (!supabase || !currentUserId || !file) {
      toast.error("Escolha uma imagem e esteja logado para enviar.");
      return;
    }

    const extension = file.name.split(".").pop() ?? "jpg";
    const filePath = `${currentUserId}/${Date.now()}.${extension}`;

    const { error: uploadError } = await supabase.storage
      .from("gallery")
      .upload(filePath, file, {
        upsert: true,
      });

    if (uploadError) {
      toast.error(uploadError.message);
      return;
    }

    const { data: publicUrlData } = supabase.storage.from("gallery").getPublicUrl(filePath);
    const { error: insertError } = await supabase.from("gallery_items").insert({
      user_id: currentUserId,
      url: publicUrlData.publicUrl,
      category,
      caption: caption || "Nova foto do role",
      is_featured: false,
      is_approved: true,
      source: "internal",
    });

    if (insertError) {
      toast.error(insertError.message);
      return;
    }

    toast.success("Foto enviada para a galeria.");
    setFile(null);
    setCaption("");
    startTransition(() => router.refresh());
  }

  async function submitExternalSuggestion() {
    const supabase = createClient();

    if (!supabase || !currentUserId || !externalLink) {
      toast.error("Preencha o link externo.");
      return;
    }

    const { error } = await supabase.from("gallery_items").insert({
      user_id: currentUserId,
      external_url: externalLink,
      category,
      caption: externalCaption || "Sugestao externa",
      is_featured: false,
      is_approved: false,
      source: "external",
    });

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Sugestao enviada para curadoria.");
    setExternalLink("");
    setExternalCaption("");
    startTransition(() => router.refresh());
  }

  return (
    <div className="space-y-4">
      <PageHeader
        eyebrow="Galeria"
        title="Sistema hibrido de fotos em 3 camadas"
        description="Album completo externo, galeria interna premium e fluxo de curadoria para destaque."
      />

      <Tabs defaultValue="app" className="space-y-4">
        <TabsList className="grid h-auto grid-cols-3 rounded-[24px] border border-white/10 bg-white/5 p-1">
          <TabsTrigger value="app" className="rounded-[20px]">
            Galeria do App
          </TabsTrigger>
          <TabsTrigger value="albums" className="rounded-[20px]">
            Album Completo
          </TabsTrigger>
          <TabsTrigger value="curation" className="rounded-[20px]">
            Sugerir Fotos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="app" className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            {["todas", "chegada", "churrasco", "piscina", "resenha", "madrugada"].map(
              (filter) => (
                <Badge key={filter} className="rounded-full bg-white/10 px-4 py-2 capitalize text-white">
                  {filter}
                </Badge>
              ),
            )}
          </div>
          <div className="columns-1 gap-4 space-y-4 md:columns-2 xl:columns-3">
            {photos.map((photo) => (
              <div key={photo.id} className="break-inside-avoid rounded-[28px] border border-white/10 bg-white/5 p-3">
                <Image
                  src={photo.url}
                  alt={photo.caption}
                  width={1200}
                  height={900}
                  className="w-full rounded-[22px] object-cover"
                />
                <div className="space-y-3 p-2 pt-4">
                  <div className="flex items-center justify-between">
                    <Badge className="rounded-full bg-black/20 capitalize text-white">{photo.category}</Badge>
                    {photo.isFeatured ? (
                      <Badge className="rounded-full bg-amber-400/15 text-amber-100">
                        <Sparkles className="mr-1 size-3" />
                        Destaque
                      </Badge>
                    ) : null}
                  </div>
                  <div>
                    <p className="font-medium">{photo.caption}</p>
                    <p className="text-sm text-zinc-400">
                      {photo.author} - {photo.createdAt}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <Button variant="ghost" className="rounded-full text-zinc-200 hover:bg-white/10">
                      <Heart className="mr-2 size-4" />
                      {photo.likesCount} curtidas
                    </Button>
                    <Button variant="outline" className="rounded-full border-white/10 bg-white/5">
                      Sugerir destaque
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="albums">
          <div className="grid gap-4 md:grid-cols-3">
            {initialAlbums.map((album) => (
              <a
                key={album.id}
                href={album.href}
                target="_blank"
                rel="noreferrer"
                className="rounded-[28px] border border-white/10 bg-white/5 p-6 transition hover:-translate-y-1 hover:bg-white/10"
              >
                <Link2 className="size-5 text-emerald-200" />
                <h3 className="mt-4 font-heading text-2xl font-semibold">{album.title}</h3>
                <p className="mt-3 text-sm leading-7 text-zinc-300">{album.description}</p>
              </a>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="curation">
          <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-[28px] border border-white/10 bg-white/5 p-6">
              <div className="mb-4 flex items-center gap-3">
                <UploadCloud className="size-5 text-emerald-200" />
                <h3 className="font-heading text-2xl font-semibold">Upload interno</h3>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Arquivo</Label>
                  <Input type="file" accept="image/*" onChange={(event) => setFile(event.target.files?.[0] ?? null)} />
                </div>
                <div className="space-y-2">
                  <Label>Categoria</Label>
                  <select
                    className="flex h-10 w-full rounded-xl border border-white/10 bg-black/20 px-3 text-sm"
                    value={category}
                    onChange={(event) => setCategory(event.target.value)}
                  >
                    {["chegada", "churrasco", "piscina", "resenha", "madrugada"].map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>
                <Input
                  placeholder="Legenda premium para a foto"
                  value={caption}
                  onChange={(event) => setCaption(event.target.value)}
                />
                <Button
                  className="w-full rounded-full bg-emerald-400 text-black hover:bg-emerald-300"
                  onClick={uploadInternalPhoto}
                  disabled={isPending}
                >
                  Enviar e sugerir
                </Button>
              </div>
            </div>
            <div className="rounded-[28px] border border-white/10 bg-white/5 p-6">
              <div className="mb-4 flex items-center gap-3">
                <Link2 className="size-5 text-emerald-200" />
                <h3 className="font-heading text-2xl font-semibold">Link externo</h3>
              </div>
              <div className="space-y-4">
                <Input
                  placeholder="https://photos.google.com/..."
                  value={externalLink}
                  onChange={(event) => setExternalLink(event.target.value)}
                />
                <Input
                  placeholder="Contexto ou legenda da sugestao"
                  value={externalCaption}
                  onChange={(event) => setExternalCaption(event.target.value)}
                />
                <Button
                  variant="outline"
                  className="w-full rounded-full border-white/10 bg-white/5"
                  onClick={submitExternalSuggestion}
                  disabled={isPending}
                >
                  Sugerir link para destaque
                </Button>
              </div>
              <p className="mt-4 text-sm text-zinc-400">
                A curadoria aprovada vai para a galeria principal. A foto original continua em qualidade maxima.
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
