/**
 * Placeholder DB types.
 *
 * Replace with generated types once the Supabase project exists:
 *   npx supabase gen types typescript --project-id <id> --schema public > src/types/database.ts
 *
 * Until then this keeps the typed Supabase clients compiling.
 */
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: Record<string, never>;
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      user_role: "student" | "tutor" | "admin";
      verification_status: "pending" | "under_review" | "verified" | "rejected" | "suspended";
      booking_status: "pending" | "confirmed" | "cancelled" | "completed" | "disputed";
      payment_status: "pending" | "succeeded" | "refunded" | "failed";
    };
  };
}
