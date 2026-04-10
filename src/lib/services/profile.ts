import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function updateProfileByUserId(
  userId: string,
  values: {
    name: string;
    nickname: string;
    bio: string;
    roleInEvent: string;
  },
) {
  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    return { error: null };
  }

  return supabase
    .from("profiles")
    .update({
      full_name: values.name,
      nickname: values.nickname,
      bio: values.bio,
      role_in_event: values.roleInEvent,
    })
    .eq("id", userId);
}
