import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceRole) {
  console.error(
    "Defina NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY antes de rodar o seed.",
  );
  process.exit(1);
}

const supabase = createClient(url, serviceRole, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const seedUsers = [
  "Milena",
  "Alexandre",
  "Gustavo",
  "Joao G",
  "Vitor",
  "Dolly",
  "Ian",
  "Mona",
  "Vimpa",
  "Bibi",
  "Kat",
  "Guilherme",
  "Vinicio",
  "Alan",
  "Tiago",
  "Gabi",
  "Erick",
  "Arthur",
  "Karol",
  "Leandro",
];

for (const [index, name] of seedUsers.entries()) {
  const email = `${name.toLowerCase().replace(/\s+/g, "")}@chacarahub.dev`;
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password: "123456",
    email_confirm: true,
    user_metadata: {
      full_name: name,
    },
  });

  if (error) {
    console.error(`Erro ao criar ${email}:`, error.message);
    continue;
  }

  const { error: profileError } = await supabase.from("profiles").upsert({
    id: data.user.id,
    full_name: name,
    nickname: name.split(" ")[0],
    bio: "Perfil seed do Chacara Hub.",
    event_status: "confirmed",
    role_in_event: "participante",
    special_badge: index === 3 ? "Builder" : "Guest",
    app_role: index === 3 ? "admin" : "member",
    amount_due: 240,
    room_id: null,
    item_to_bring: ["Gelo", "Carvao", "Snacks", "Refri"][index % 4],
  });

  if (profileError) {
    console.error(`Erro ao criar profile de ${email}:`, profileError.message);
  } else {
    console.log(`Usuario seedado: ${email}`);
  }
}
