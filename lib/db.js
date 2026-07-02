import { sql } from "@vercel/postgres";

let ensured = false;

export async function ensureTable() {
  if (ensured) return;
  await sql`
    CREATE TABLE IF NOT EXISTS rsvps (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      attending BOOLEAN NOT NULL,
      guest_count INTEGER NOT NULL DEFAULT 1,
      plus_ones TEXT DEFAULT '',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `;
  ensured = true;
}

export { sql };
