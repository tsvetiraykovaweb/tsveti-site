/**
 * Placeholder Database types.
 * Replace with generated types from Supabase CLI once the schema is migrated:
 *   npx supabase gen types typescript --project-id <id> > src/types/database.ts
 */
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      // Populated after first migrations — see docs/DATABASE_SCHEMA.md
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
};
