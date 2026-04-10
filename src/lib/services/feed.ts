import { feedPosts } from "@/lib/mock-data";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function getFeedData() {
  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    return {
      posts: feedPosts,
    };
  }

  const [{ data: posts }, { data: comments }, { data: profiles }] = await Promise.all([
    supabase.from("posts").select("*").order("created_at", { ascending: false }),
    supabase.from("post_comments").select("id,post_id").order("created_at", { ascending: false }),
    supabase.from("profiles").select("id,full_name,avatar_url"),
  ]);

  const profileMap = new Map((profiles ?? []).map((profile) => [profile.id, profile]));
  const commentMap = new Map<string, number>();
  (comments ?? []).forEach((comment) => {
    commentMap.set(comment.post_id, (commentMap.get(comment.post_id) ?? 0) + 1);
  });

  return {
    posts:
      posts?.map((post) => {
        const author = profileMap.get(post.user_id);
        return {
          id: post.id,
          author: author?.full_name ?? "Convidado",
          avatar:
            author?.avatar_url ??
            `https://api.dicebear.com/9.x/notionists/svg?seed=${encodeURIComponent(author?.full_name ?? "Convidado")}`,
          createdAt: new Date(post.created_at).toLocaleString("pt-BR"),
          content: post.content,
          comments: commentMap.get(post.id) ?? 0,
          likes: 0,
          pinned: post.is_pinned,
        };
      }) ?? feedPosts,
  };
}
