import { externalAlbums, galleryItems } from "@/lib/mock-data";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function getGalleryData() {
  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    return {
      appGallery: galleryItems,
      albums: externalAlbums,
    };
  }

  const [{ data: appGallery }, { data: albums }, { data: profiles }] = await Promise.all([
    supabase
      .from("gallery_items")
      .select("id,user_id,url,external_url,category,likes_count,caption,is_featured,is_approved,source,created_at")
      .eq("is_approved", true)
      .order("created_at", { ascending: false }),
    supabase.from("external_albums").select("*").order("created_at", { ascending: false }),
    supabase.from("profiles").select("id,full_name"),
  ]);

  const profileMap = new Map(
    (profiles ?? []).map((profile) => [profile.id, profile.full_name]),
  );

  return {
    appGallery:
      appGallery?.map((photo, index) => ({
        id: photo.id,
        userId: photo.user_id,
        url: photo.url ?? galleryItems[index % galleryItems.length].url,
        externalUrl: photo.external_url ?? undefined,
        category: photo.category,
        likesCount: photo.likes_count,
        createdAt: new Date(photo.created_at).toLocaleDateString("pt-BR"),
        isFeatured: photo.is_featured,
        isApproved: photo.is_approved,
        source: photo.source,
        caption: photo.caption ?? "Sem legenda",
        author: profileMap.get(photo.user_id) ?? "Convidado",
      })) ?? galleryItems,
    albums:
      albums?.map((album) => ({
        id: album.id,
        title: album.title,
        href: album.href,
        description: album.description ?? "",
      })) ?? externalAlbums,
  };
}
