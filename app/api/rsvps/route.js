import { NextResponse } from "next/server";
import { ensureTable, sql } from "@/lib/db";

export const runtime = "nodejs";

function checkKey(request) {
  const url = new URL(request.url);
  const key = url.searchParams.get("key") || request.headers.get("x-admin-key");
  const expected = process.env.ADMIN_KEY;
  if (!expected) return { ok: false, msg: "ADMIN_KEY env var is not set." };
  if (key !== expected) return { ok: false, msg: "Unauthorized." };
  return { ok: true };
}

function toCsv(rows) {
  const header = ["id", "name", "attending", "guest_count", "plus_ones", "created_at"];
  const escape = (v) => {
    const s = v === null || v === undefined ? "" : String(v);
    if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
    return s;
  };
  const lines = [header.join(",")];
  for (const r of rows) {
    lines.push(header.map((h) => escape(r[h])).join(","));
  }
  return lines.join("\n");
}

export async function GET(request) {
  const auth = checkKey(request);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.msg }, { status: 401 });
  }

  try {
    await ensureTable();
    const { rows } = await sql`SELECT * FROM rsvps ORDER BY created_at DESC`;

    const url = new URL(request.url);
    if (url.searchParams.get("format") === "csv") {
      return new NextResponse(toCsv(rows), {
        status: 200,
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="rsvps.csv"`,
        },
      });
    }

    const totals = rows.reduce(
      (acc, r) => {
        if (r.attending) {
          acc.attending += 1;
          acc.guests += Number(r.guest_count) || 0;
        } else {
          acc.declined += 1;
        }
        return acc;
      },
      { attending: 0, declined: 0, guests: 0 }
    );

    return NextResponse.json({ rows, totals });
  } catch (err) {
    console.error("List RSVPs error:", err);
    return NextResponse.json(
      { error: "Failed to load RSVPs. Is the database configured?" },
      { status: 500 }
    );
  }
}
