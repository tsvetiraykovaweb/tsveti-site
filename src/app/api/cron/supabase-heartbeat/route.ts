import { NextResponse } from "next/server";
import { runSupabaseHeartbeat } from "@/lib/maintenance/heartbeat";

export const dynamic = "force-dynamic";

function isCronAuthorized(request: Request): boolean {
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret) return false;

  const header = request.headers.get("authorization");
  if (!header?.startsWith("Bearer ")) return false;

  const token = header.slice("Bearer ".length).trim();
  return token === secret;
}

export async function GET(request: Request) {
  const timestamp = new Date().toISOString();

  if (!isCronAuthorized(request)) {
    return NextResponse.json(
      { status: "unauthorized", timestamp },
      { status: 401 },
    );
  }

  const result = await runSupabaseHeartbeat();

  if (!result.ok) {
    return NextResponse.json(
      {
        status: "error",
        timestamp,
        heartbeat: {
          ok: false,
          error: result.error,
        },
      },
      { status: 500 },
    );
  }

  return NextResponse.json({
    status: "ok",
    timestamp,
    heartbeat: {
      ok: true,
      id: result.row.id,
      last_seen_at: result.row.last_seen_at,
      run_count: result.row.run_count,
      last_status: result.row.last_status,
    },
  });
}
