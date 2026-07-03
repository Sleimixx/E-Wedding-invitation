import { NextResponse } from "next/server";
import { ensureTable, sql } from "@/lib/db";

export const runtime = "nodejs";

export async function POST(request) {
  try {
    const body = await request.json();
    const name = String(body.name || "").trim().slice(0, 200);
    const attending = Boolean(body.attending);
    const guestCount = Math.max(0, Math.min(10, Number(body.guestCount) || 1));
    const plusOnes = String(body.plusOnes || "").trim().slice(0, 500);

    if (!name) {
      return NextResponse.json({ error: "Name is required." }, { status: 400 });
    }

    await ensureTable();
    const existing = await sql`SELECT id FROM rsvps WHERE LOWER(name) = LOWER(${name}) LIMIT 1`;
    if (existing.rows.length > 0) {
      await sql`
        UPDATE rsvps
        SET attending = ${attending}, guest_count = ${guestCount}, plus_ones = ${plusOnes}
        WHERE LOWER(name) = LOWER(${name})
      `;
    } else {
      await sql`
        INSERT INTO rsvps (name, attending, guest_count, plus_ones)
        VALUES (${name}, ${attending}, ${guestCount}, ${plusOnes})
      `;
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("RSVP error:", err);
    return NextResponse.json(
      { error: "Failed to save RSVP. Is the database configured?" },
      { status: 500 }
    );
  }
}
