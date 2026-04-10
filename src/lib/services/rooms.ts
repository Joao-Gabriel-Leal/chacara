import { rooms as mockRooms } from "@/lib/mock-data";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function getRoomsData() {
  const supabase = await createServerSupabaseClient();

  if (!supabase) {
    return {
      rooms: mockRooms,
      participants: [],
    };
  }

  const [{ data: roomRows }, { data: profileRows }] = await Promise.all([
    supabase.from("rooms").select("*").order("name"),
    supabase.from("profiles").select("id,full_name,room_id").order("full_name"),
  ]);

  return {
    rooms:
      roomRows?.map((room) => ({
        id: room.id,
        name: room.name,
        capacity: room.capacity,
        vibe: room.vibe ?? "",
        badge: room.badge ?? "Sem badge",
        occupants:
          profileRows
            ?.filter((profile) => profile.room_id === room.id)
            .map((profile) => profile.full_name) ?? [],
      })) ?? mockRooms,
    participants:
      profileRows?.map((profile) => ({
        id: profile.id,
        name: profile.full_name,
        roomId: profile.room_id,
      })) ?? [],
  };
}
