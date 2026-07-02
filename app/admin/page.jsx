"use client";
import { useState } from "react";

export default function AdminPage() {
  const [key, setKey] = useState("");
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function load(e) {
    e?.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/rsvps?key=${encodeURIComponent(key)}`);
      const body = await res.json();
      if (!res.ok) throw new Error(body.error || "Failed to load");
      setData(body);
    } catch (err) {
      setError(err.message);
      setData(null);
    } finally {
      setLoading(false);
    }
  }

  function downloadCsv() {
    const url = `/api/rsvps?format=csv&key=${encodeURIComponent(key)}`;
    window.open(url, "_blank");
  }

  return (
    <main style={{ maxWidth: 960, margin: "0 auto", padding: "3rem 1.5rem" }}>
      <h1 style={{ fontFamily: "var(--font-heading)", marginBottom: "1.5rem" }}>
        RSVP Admin
      </h1>

      <form onSubmit={load} style={{ display: "flex", gap: "0.75rem", marginBottom: "2rem" }}>
        <input
          type="password"
          placeholder="Admin key"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          style={{
            flex: 1,
            padding: "0.75rem 1rem",
            border: "1px solid #ccc",
            borderRadius: 4,
            fontSize: "1rem",
          }}
        />
        <button
          type="submit"
          disabled={loading || !key}
          style={{
            padding: "0.75rem 1.5rem",
            background: "var(--color-primary)",
            color: "white",
            border: "none",
            borderRadius: 4,
            fontSize: "0.9rem",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          {loading ? "Loading..." : "Load"}
        </button>
        {data && (
          <button
            type="button"
            onClick={downloadCsv}
            style={{
              padding: "0.75rem 1.5rem",
              background: "var(--color-accent)",
              color: "white",
              border: "none",
              borderRadius: 4,
              fontSize: "0.9rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            Export CSV
          </button>
        )}
      </form>

      {error && (
        <div
          style={{
            background: "#fdeaea",
            color: "#8b2020",
            padding: "1rem",
            borderRadius: 4,
            marginBottom: "1.5rem",
          }}
        >
          {error}
        </div>
      )}

      {data && (
        <>
          <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem", flexWrap: "wrap" }}>
            <Stat label="Attending" value={data.totals.attending} />
            <Stat label="Declined" value={data.totals.declined} />
            <Stat label="Total guests" value={data.totals.guests} />
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#f5f2ed", textAlign: "left" }}>
                  <th style={cellStyle}>Name</th>
                  <th style={cellStyle}>Attending</th>
                  <th style={cellStyle}>Guests</th>
                  <th style={cellStyle}>+1s</th>
                  <th style={cellStyle}>Submitted</th>
                </tr>
              </thead>
              <tbody>
                {data.rows.map((r) => (
                  <tr key={r.id} style={{ borderTop: "1px solid #eee" }}>
                    <td style={cellStyle}>{r.name}</td>
                    <td style={cellStyle}>{r.attending ? "Yes" : "No"}</td>
                    <td style={cellStyle}>{r.guest_count}</td>
                    <td style={cellStyle}>{r.plus_ones || "—"}</td>
                    <td style={cellStyle}>
                      {new Date(r.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </main>
  );
}

const cellStyle = { padding: "0.75rem 1rem" };

function Stat({ label, value }) {
  return (
    <div
      style={{
        flex: 1,
        minWidth: 140,
        padding: "1.25rem",
        border: "1px solid #eee",
        borderRadius: 4,
        background: "white",
      }}
    >
      <div style={{ fontSize: "0.8rem", letterSpacing: "0.15em", textTransform: "uppercase", opacity: 0.7 }}>
        {label}
      </div>
      <div style={{ fontSize: "2rem", fontFamily: "var(--font-heading)", marginTop: "0.5rem" }}>
        {value}
      </div>
    </div>
  );
}
