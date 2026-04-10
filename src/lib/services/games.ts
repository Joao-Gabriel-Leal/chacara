import { gameCards, gameRanking, profiles } from "@/lib/mock-data";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function getGamesData() {
  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    return {
      cards: gameCards,
      ranking: gameRanking,
      players: profiles.map((profile) => ({
        id: profile.id,
        name: profile.name,
      })),
    };
  }

  const [{ data: sessionCounts }, { data: scoreEvents }, { data: playerRows }] = await Promise.all([
    supabase.from("game_sessions").select("game_type"),
    supabase.from("game_score_events").select("user_id,points"),
    supabase.from("profiles").select("id,full_name").order("full_name"),
  ]);

  const counts = new Map<string, number>();
  (sessionCounts ?? []).forEach((row) => {
    counts.set(row.game_type, (counts.get(row.game_type) ?? 0) + 1);
  });

  const scoreMap = new Map<string, number>();
  (scoreEvents ?? []).forEach((row) => {
    scoreMap.set(row.user_id, (scoreMap.get(row.user_id) ?? 0) + row.points);
  });

  const playerMap = new Map(
    (playerRows ?? []).map((player) => [player.id, player.full_name]),
  );

  const ranking = [...scoreMap.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([userId, points], index) => ({
      user: playerMap.get(userId) ?? "Convidado",
      points,
      streak: index === 0 ? "lider atual" : "pontuando no role",
    }));

  return {
    cards: gameCards.map((card) => ({
      ...card,
      players: counts.get(card.id) ?? 0,
    })),
    ranking: ranking.length > 0 ? ranking : gameRanking,
    players:
      playerRows?.map((player) => ({
        id: player.id,
        name: player.full_name,
      })) ?? profiles.map((profile) => ({ id: profile.id, name: profile.name })),
  };
}
