import { createAdminClient } from "@/lib/supabase/admin";

export const HEARTBEAT_ID = "supabase-heartbeat";

export type HeartbeatRow = {
  id: string;
  last_seen_at: string;
  run_count: number;
  last_status: string | null;
  last_error: string | null;
};

export type HeartbeatRunResult =
  | {
      ok: true;
      row: HeartbeatRow;
    }
  | {
      ok: false;
      error: string;
    };

/**
 * Records a successful Supabase heartbeat via service role (server-only).
 * No personal data is written.
 */
export async function runSupabaseHeartbeat(): Promise<HeartbeatRunResult> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase.rpc("record_maintenance_heartbeat");

    if (error) {
      await recordHeartbeatFailure(error.message);
      return { ok: false, error: error.message };
    }

    if (!data) {
      const message = "Heartbeat RPC returned no row";
      await recordHeartbeatFailure(message);
      return { ok: false, error: message };
    }

    return { ok: true, row: data as HeartbeatRow };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "unknown heartbeat error";
    await recordHeartbeatFailure(message);
    return { ok: false, error: message };
  }
}

async function recordHeartbeatFailure(message: string): Promise<void> {
  try {
    const supabase = createAdminClient();
    const trimmed = message.trim().slice(0, 500);

    const { data: existing } = await supabase
      .from("maintenance_heartbeats")
      .select("run_count")
      .eq("id", HEARTBEAT_ID)
      .maybeSingle();

    await supabase.from("maintenance_heartbeats").upsert(
      {
        id: HEARTBEAT_ID,
        last_seen_at: new Date().toISOString(),
        run_count: existing?.run_count ?? 0,
        last_status: "error",
        last_error: trimmed || "unknown error",
      },
      { onConflict: "id" },
    );
  } catch {
    // Best-effort — cron response still reports the failure.
  }
}
