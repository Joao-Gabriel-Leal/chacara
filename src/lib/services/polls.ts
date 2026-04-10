import { polls as mockPolls } from "@/lib/mock-data";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function getPollsData(currentUserId?: string) {
  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    return {
      polls: mockPolls,
      hasVotes: new Set<string>(),
    };
  }

  const [{ data: pollRows }, { data: optionRows }, { data: voteRows }] = await Promise.all([
    supabase.from("polls").select("*").order("created_at", { ascending: false }),
    supabase.from("poll_options").select("*").order("sort_order"),
    supabase.from("poll_votes").select("poll_id,option_id,user_id"),
  ]);

  const votesByOption = new Map<string, number>();
  const votesByPoll = new Map<string, number>();
  const currentVotes = new Set<string>();

  (voteRows ?? []).forEach((vote) => {
    votesByOption.set(vote.option_id, (votesByOption.get(vote.option_id) ?? 0) + 1);
    votesByPoll.set(vote.poll_id, (votesByPoll.get(vote.poll_id) ?? 0) + 1);
    if (vote.user_id === currentUserId) {
      currentVotes.add(vote.poll_id);
    }
  });

  return {
    polls:
      pollRows?.map((poll) => ({
        id: poll.id,
        title: poll.title,
        description: poll.description ?? "",
        status: poll.status,
        totalVotes: votesByPoll.get(poll.id) ?? 0,
        options:
          optionRows
            ?.filter((option) => option.poll_id === poll.id)
            .map((option) => ({
              id: option.id,
              label: option.label,
              votes: votesByOption.get(option.id) ?? 0,
            })) ?? [],
      })) ?? mockPolls,
    hasVotes: currentVotes,
  };
}
