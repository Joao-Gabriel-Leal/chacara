const required = {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
};

export function hasSupabaseEnv() {
  return Boolean(required.supabaseUrl && required.supabaseAnonKey);
}

export const appEnv = {
  appName: "Chacara Hub",
  eventDate: process.env.NEXT_PUBLIC_EVENT_DATE ?? "2026-12-12T12:00:00-03:00",
  eventLocation:
    process.env.NEXT_PUBLIC_EVENT_LOCATION ?? "Chacara Horizonte, Mairinque - SP",
};
