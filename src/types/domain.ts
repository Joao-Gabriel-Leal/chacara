import {
  GalleryCategory,
  PaymentStatus,
  PollStatus,
  Profile,
} from "@/types/app";

export interface AppProfile extends Profile {
  email?: string;
  roomName?: string | null;
}

export interface EventSettingsRecord {
  id: string;
  name: string;
  tagline: string | null;
  event_date: string;
  location: string;
  hero_title: string | null;
  hero_subtitle: string | null;
  total_cost: number;
  amount_per_person: number;
  pix_instructions: string | null;
}

export interface PaymentSummaryRecord {
  user_id: string;
  full_name: string;
  amount_due: number;
  amount_paid: number;
  payment_status: PaymentStatus;
}

export interface PaymentSubmissionRecord {
  id: string;
  user_id: string;
  amount: number;
  status: PaymentStatus;
  proof_path: string | null;
  note: string | null;
  created_at: string;
}

export interface GalleryItemRecord {
  id: string;
  user_id: string;
  url: string | null;
  external_url: string | null;
  category: GalleryCategory;
  likes_count: number;
  caption: string | null;
  is_featured: boolean;
  is_approved: boolean;
  source: "internal" | "external";
  created_at: string;
}

export interface PollRecord {
  id: string;
  title: string;
  description: string | null;
  status: PollStatus;
  created_at: string;
}
