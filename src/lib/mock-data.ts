import {
  AdminMetrics,
  DashboardSummary,
  ExternalAlbum,
  FeedPost,
  GameCard,
  GameRankingEntry,
  GalleryItem,
  PlanningItem,
  Poll,
  Profile,
  Room,
} from "@/types/app";

export const eventSettings = {
  name: "Chacara Hub",
  tagline: "O painel premium do nosso final de semana mais caotico e memoravel.",
  location: "Chacara Horizonte, Mairinque - SP",
  startsAt: "2026-12-12T12:00:00-03:00",
  totalCost: 4800,
  amountPerPerson: 240,
  pixKey: "pix@chacarahub.dev",
};

export const profiles: Profile[] = [
  ["Milena", "Mih", "Rainha do briefing", "confirmed", "curadoria", "Host Gold"],
  ["Alexandre", "Ale", "Mestre da churrasqueira", "confirmed", "churras", "Pit Master"],
  ["Gustavo", "Gusta", "Chega com caixa de som e opiniao", "confirmed", "playlist", "Sound Captain"],
  ["Joao G", "JG", "Resolve bug e traz gelo", "confirmed", "ops", "Builder"],
  ["Vitor", "Vit", "Logistica e memes em tempo real", "confirmed", "transporte", "Road Lead"],
  ["Dolly", "Dol", "Curadora oficial da madrugada", "confirmed", "after", "Night Shift"],
  ["Ian", "Ian", "Fiscal do baralho e da resenha", "confirmed", "jogos", "Game Master"],
  ["Mona", "Mona", "Fotografa nao oficial do role", "confirmed", "fotos", "Lens Club"],
  ["Vimpa", "Vimpa", "Sempre aparece com uma surpresa", "maybe", "caos", "Wildcard"],
  ["Bibi", "Bibi", "Checklists impecaveis", "confirmed", "mercado", "Checklist Pro"],
  ["Kat", "Kat", "Rainha do close e das enquetes", "confirmed", "social", "Trend Setter"],
  ["Guilherme", "Gui", "Acha desconto e cupom de tudo", "pending", "financeiro", "Deal Hunter"],
  ["Vinicio", "Vini", "Leva energia de festival", "confirmed", "ativacao", "Festival Mode"],
  ["Alan", "Alan", "Engenharia do improviso", "confirmed", "estrutura", "Fixer"],
  ["Tiago", "Ti", "Sempre traz historia nova", "confirmed", "resenha", "Lore Keeper"],
  ["Gabi", "Gabi", "Documenta tudo", "confirmed", "conteudo", "Story Dept"],
  ["Erick", "Erick", "Pontualidade duvidosa, carisma alto", "pending", "chegada", "Late Legend"],
  ["Arthur", "Arthur", "Tatico dos jogos", "confirmed", "competicao", "MVP"],
  ["Karol", "Karol", "Decora tudo com capricho", "confirmed", "decor", "Art Director"],
  ["Leandro", "Le", "Resolve crise em 3 minutos", "confirmed", "apoio", "Crisis Mode"],
].map(([name, nickname, bio, eventStatus, roleInEvent, badge], index) => ({
  id: `user-${index + 1}`,
  name,
  nickname,
  avatar: `https://api.dicebear.com/9.x/notionists/svg?seed=${encodeURIComponent(name)}`,
  bio,
  eventStatus: eventStatus as Profile["eventStatus"],
  roleInEvent,
  badge,
  roomId: `room-${(index % 5) + 1}`,
  itemToBring: ["Gelo", "Carvao", "Snacks", "Refri", "Jogos", "Caixa de som"][index % 6],
  amountPaid: index % 3 === 0 ? 240 : index % 3 === 1 ? 120 : 0,
  amountDue: 240,
  paymentStatus:
    index % 3 === 0 ? "paid" : index % 3 === 1 ? "partial" : "pending",
  appRole: index === 3 ? "admin" : "member",
}));

export const currentUser = profiles[3];

export const recentEvents = [
  "Playlist colaborativa reaberta ate sexta",
  "Quarto Vista Piscina ganhou mais uma vaga",
  "Admin aprovou 3 comprovantes hoje",
];

export const galleryItems: GalleryItem[] = [
  {
    id: "photo-1",
    userId: "user-8",
    url: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80",
    category: "chegada",
    likesCount: 32,
    createdAt: "Ha 2h",
    isFeatured: true,
    isApproved: true,
    source: "internal",
    caption: "Check-in com sol baixo e energia alta.",
    author: "Mona",
  },
  {
    id: "photo-2",
    userId: "user-2",
    url: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80",
    category: "churrasco",
    likesCount: 21,
    createdAt: "Ha 6h",
    isFeatured: false,
    isApproved: true,
    source: "internal",
    caption: "A grelha tava trabalhando em horario de pico.",
    author: "Alexandre",
  },
  {
    id: "photo-3",
    userId: "user-10",
    url: "https://images.unsplash.com/photo-1505236858219-8359eb29e329?auto=format&fit=crop&w=1200&q=80",
    category: "piscina",
    likesCount: 27,
    createdAt: "Ontem",
    isFeatured: false,
    isApproved: true,
    source: "internal",
    caption: "Momento premium antes do caos oficial.",
    author: "Bibi",
  },
  {
    id: "photo-4",
    userId: "user-6",
    url: "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=1200&q=80",
    category: "resenha",
    likesCount: 43,
    createdAt: "Ontem",
    isFeatured: false,
    isApproved: true,
    source: "internal",
    caption: "Painel espontaneo da resenha.",
    author: "Dolly",
  },
];

export const externalAlbums: ExternalAlbum[] = [
  { id: "album-1", title: "Dia 1", href: "https://photos.google.com", description: "Chegada, quartos e primeiro churrasco." },
  { id: "album-2", title: "Piscina & Sunset", href: "https://drive.google.com", description: "As fotos em alta para quem quer baixar tudo." },
  { id: "album-3", title: "Madrugada Cinematica", href: "https://photos.google.com", description: "Curadoria das melhores fotos da madrugada." },
];

export const planningItems: PlanningItem[] = [
  { id: "p1", name: "Carvao Premium", category: "comidas", quantity: "4 sacos", responsible: "Alexandre", status: "bought", note: "Ja separado" },
  { id: "p2", name: "Gin", category: "bebidas", quantity: "6 garrafas", responsible: "Milena", status: "pending", note: "Fechar marca ate quinta" },
  { id: "p3", name: "Copos resistentes", category: "utensilios", quantity: "50 un", responsible: "Bibi", status: "bought", note: "Nao descartavel" },
  { id: "p4", name: "Carro da ida", category: "transporte", quantity: "2 vagas", responsible: "Vitor", status: "pending", note: "Arthur talvez dirija" },
  { id: "p5", name: "Compras do mercado", category: "mercado", quantity: "1 rodada grande", responsible: "Gui", status: "pending", note: "Conferir carnes e gelo" },
  { id: "p6", name: "Roupa de cama extra", category: "quartos", quantity: "3 kits", responsible: "Karol", status: "bought", note: "Lavanderia ok" },
];

export const rooms: Room[] = [
  { id: "room-1", name: "Vista Piscina", capacity: 4, vibe: "sol da manha e acesso rapido ao caos", badge: "Premium Deck", occupants: ["Milena", "Mona", "Karol", "Gabi"] },
  { id: "room-2", name: "Suite do Churras", capacity: 4, vibe: "perto da churrasqueira e do som", badge: "Smoke Club", occupants: ["Alexandre", "Gustavo", "Ian", "Arthur"] },
  { id: "room-3", name: "Refugio da Resenha", capacity: 4, vibe: "onde o after comeca", badge: "After Safehouse", occupants: ["Dolly", "Tiago", "Vinicio", "Alan"] },
  { id: "room-4", name: "Ninho da Logistica", capacity: 4, vibe: "saida rapida para mercado e transporte", badge: "Ops Base", occupants: ["Joao G", "Vitor", "Leandro", "Erick"] },
  { id: "room-5", name: "Salao Flex", capacity: 4, vibe: "acomoda quem decide em cima da hora", badge: "Wildcard", occupants: ["Bibi", "Kat", "Guilherme", "Vimpa"] },
];

export const polls: Poll[] = [
  {
    id: "poll-1",
    title: "Tema da noite de sabado",
    description: "Escolha o mood principal do after.",
    status: "active",
    totalVotes: 16,
    options: [
      { id: "a", label: "Sunset chic", votes: 7 },
      { id: "b", label: "Esporte fino ironico", votes: 5 },
      { id: "c", label: "Camisa de time aleatoria", votes: 4 },
    ],
  },
  {
    id: "poll-2",
    title: "Cafe da manha de domingo",
    description: "Pra nao sofrer no dia seguinte.",
    status: "active",
    totalVotes: 11,
    options: [
      { id: "a", label: "Pao na chapa", votes: 4 },
      { id: "b", label: "Brunch completo", votes: 6 },
      { id: "c", label: "Pedido delivery", votes: 1 },
    ],
  },
];

export const feedPosts: FeedPost[] = [
  {
    id: "post-1",
    author: "Milena",
    avatar: profiles[0].avatar,
    createdAt: "Agora mesmo",
    content: "Lista de quartos atualizada. Se alguem trocar de ideia ate amanha, me chama no painel de quartos.",
    comments: 6,
    likes: 18,
    pinned: true,
  },
  {
    id: "post-2",
    author: "Gustavo",
    avatar: profiles[2].avatar,
    createdAt: "Ha 40 min",
    content: "Abri uma enquete nova com os estilos da noite. Votem antes de eu cometer crimes musicais.",
    comments: 4,
    likes: 22,
  },
  {
    id: "post-3",
    author: "Mona",
    avatar: profiles[7].avatar,
    createdAt: "Ha 2h",
    content: "Quem tiver foto boa da chegada me marca na galeria pra eu sugerir pro destaque.",
    comments: 3,
    likes: 14,
  },
];

export const gameCards: GameCard[] = [
  { id: "quem-e-mais-provavel", title: "Quem e mais provavel?", description: "Rounds rapidos, votacao e pontos por acerto de consenso.", accent: "from-amber-400 to-orange-500", players: 18 },
  { id: "roleta-do-caos", title: "Roleta do Caos", description: "Desafios imprevisiveis e mini-missoes para o grupo.", accent: "from-fuchsia-500 to-rose-500", players: 15 },
  { id: "quiz-do-grupo", title: "Quiz do Grupo", description: "Perguntas internas, fofocas historicas e memoria coletiva.", accent: "from-cyan-400 to-blue-500", players: 20 },
  { id: "bingo-do-role", title: "Bingo do Role", description: "Cartela viva com acontecimentos classicos do fim de semana.", accent: "from-emerald-400 to-lime-500", players: 17 },
];

export const gameRanking: GameRankingEntry[] = [
  { user: "Arthur", points: 1480, streak: "4 vitorias" },
  { user: "Kat", points: 1330, streak: "subiu 2 posicoes" },
  { user: "Joao G", points: 1285, streak: "consistencia absurda" },
  { user: "Dolly", points: 1210, streak: "brilha na madrugada" },
  { user: "Milena", points: 1170, streak: "lidera em consenso" },
];

export const paymentHistory = [
  { id: "pay-1", user: "Milena", amount: 240, status: "paid", submittedAt: "09 Abr", proofLabel: "PIX #3091" },
  { id: "pay-2", user: "Joao G", amount: 240, status: "paid", submittedAt: "08 Abr", proofLabel: "PIX #3011" },
  { id: "pay-3", user: "Guilherme", amount: 120, status: "partial", submittedAt: "08 Abr", proofLabel: "Entrada #3002" },
  { id: "pay-4", user: "Erick", amount: 0, status: "pending", submittedAt: "Aguardando", proofLabel: "Sem envio" },
] as const;

export const adminMetrics: AdminMetrics = {
  metrics: [
    { label: "Arrecadado", value: "R$ 2.880", hint: "60% da meta confirmada" },
    { label: "Fotos aprovadas", value: "84", hint: "12 aguardando moderacao" },
    { label: "Convites ativos", value: "5", hint: "2 ainda nao resgatados" },
    { label: "Enquetes abertas", value: "2", hint: "27 votos hoje" },
  ],
};

export const dashboardSummary: DashboardSummary = {
  welcomeTitle: `Bem-vindo de volta, ${currentUser.nickname}`,
  welcomeMessage:
    "Seu painel junta tudo o que voce precisa para chegar no evento sem perder nada do caos organizado.",
  highlightedNotice:
    "Seu quarto atual e o Ninho da Logistica. Ainda falta anexar o comprovante final para fechar o pagamento.",
  recentPhotos: galleryItems.slice(0, 3),
  activePolls: polls,
  gameRanking,
};
