export type AppRole = "member" | "admin";
export type EventStatus = "confirmed" | "maybe" | "pending";
export type PaymentStatus = "paid" | "partial" | "pending";
export type GallerySource = "internal" | "external";
export type GalleryCategory =
  | "chegada"
  | "churrasco"
  | "piscina"
  | "resenha"
  | "madrugada";
export type PlanningCategory =
  | "comidas"
  | "bebidas"
  | "utensilios"
  | "quartos"
  | "transporte"
  | "mercado";
export type PollStatus = "active" | "closed";
export type GameType =
  | "quem-e-mais-provavel"
  | "roleta-do-caos"
  | "quiz-do-grupo"
  | "bingo-do-role";

export interface Profile {
  id: string;
  name: string;
  nickname: string;
  avatar: string;
  bio: string;
  eventStatus: EventStatus;
  roleInEvent: string;
  badge: string;
  roomId?: string;
  itemToBring: string;
  amountPaid: number;
  amountDue: number;
  paymentStatus: PaymentStatus;
  appRole: AppRole;
}

export interface GalleryItem {
  id: string;
  userId: string;
  url: string;
  externalUrl?: string;
  category: GalleryCategory;
  likesCount: number;
  createdAt: string;
  isFeatured: boolean;
  isApproved: boolean;
  source: GallerySource;
  caption: string;
  author: string;
}

export interface ExternalAlbum {
  id: string;
  title: string;
  href: string;
  description: string;
}

export interface PlanningItem {
  id: string;
  name: string;
  category: PlanningCategory;
  quantity: string;
  responsible: string;
  status: "pending" | "bought";
  note?: string;
}

export interface Room {
  id: string;
  name: string;
  capacity: number;
  vibe: string;
  badge: string;
  occupants: string[];
}

export interface Poll {
  id: string;
  title: string;
  description: string;
  status: PollStatus;
  totalVotes: number;
  options: Array<{
    id: string;
    label: string;
    votes: number;
  }>;
}

export interface FeedPost {
  id: string;
  author: string;
  avatar: string;
  createdAt: string;
  content: string;
  comments: number;
  likes: number;
  pinned?: boolean;
}

export interface GameRankingEntry {
  user: string;
  points: number;
  streak: string;
}

export interface GameCard {
  id: GameType;
  title: string;
  description: string;
  accent: string;
  players: number;
}

export interface DashboardSummary {
  welcomeTitle: string;
  welcomeMessage: string;
  highlightedNotice: string;
  recentPhotos: GalleryItem[];
  activePolls: Poll[];
  gameRanking: GameRankingEntry[];
}

export interface AdminMetrics {
  metrics: Array<{
    label: string;
    value: string;
    hint: string;
  }>;
}
