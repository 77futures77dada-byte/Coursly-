/**
 * Partial hand-written DB types — enough for the features that touch Supabase
 * today (chat). Replace wholesale with generated types once the Supabase CLI is
 * wired:
 *   npx supabase gen types typescript --project-id <id> --schema public > src/types/database.ts
 *
 * Only the tables/functions actually queried from the app are modelled. Add more
 * as features land, or regenerate.
 */
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

type UserRole = "student" | "tutor" | "admin";
type VerificationStatus =
  | "pending"
  | "under_review"
  | "verified"
  | "rejected"
  | "suspended";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          locale: string;
          roles: UserRole[];
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          locale?: string;
          roles?: UserRole[];
        };
        Update: {
          full_name?: string | null;
          avatar_url?: string | null;
          locale?: string;
          roles?: UserRole[];
          deleted_at?: string | null;
        };
        Relationships: [];
      };
      tutor_profiles: {
        Row: {
          user_id: string;
          slug: string | null;
          headline: string | null;
          bio: string | null;
          price_hour: number | null;
          currency: string;
          verification_status: VerificationStatus;
          trust_score: number;
          intro_video_url: string | null;
          cancellation_rate: number;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          user_id: string;
          slug?: string | null;
          headline?: string | null;
          bio?: string | null;
          price_hour?: number | null;
        };
        Update: {
          slug?: string | null;
          headline?: string | null;
          bio?: string | null;
          price_hour?: number | null;
          verification_status?: VerificationStatus;
        };
        Relationships: [];
      };
      conversations: {
        Row: {
          id: string;
          student_id: string;
          tutor_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          student_id: string;
          tutor_id: string;
        };
        Update: {
          updated_at?: string;
        };
        Relationships: [];
      };
      messages: {
        Row: {
          id: string;
          conversation_id: string;
          sender_id: string;
          body: string | null;
          attachment_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          conversation_id: string;
          // set server-side by trg_set_message_sender; never send from the client
          sender_id?: string;
          body?: string | null;
          attachment_url?: string | null;
        };
        Update: {
          body?: string | null;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      conversation_partner: {
        Args: { conv_id: string };
        Returns: {
          id: string;
          full_name: string | null;
          avatar_url: string | null;
          locale: string;
        }[];
      };
    };
    Enums: {
      user_role: UserRole;
      verification_status: VerificationStatus;
      booking_status: "pending" | "confirmed" | "cancelled" | "completed" | "disputed";
      payment_status: "pending" | "succeeded" | "refunded" | "failed";
    };
  };
}
