"use client";
import { useState } from "react";

export default function RSVP({ rsvp }) {
  const [name, setName] = useState("");
  const [attending, setAttending] = useState(null);
  const [guestCount, setGuestCount] = useState(1);
  const [plusOnes, setPlusOnes] = useState("");
  const [status, setStatus] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    if (!name || attending === null) {
      setStatus({ ok: false, msg: "Please add your name and choose an option." });
      return;
    }
    setSubmitting(true);
    setStatus(null);
    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          attending,
          guestCount: attending ? Number(guestCount) : 0,
          plusOnes: attending ? plusOnes : "",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      setStatus({ ok: true, msg: "Thank you! Your RSVP has been received." });
      setName("");
      setAttending(null);
      setGuestCount(1);
      setPlusOnes("");
    } catch (err) {
      setStatus({ ok: false, msg: err.message });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="rsvp" id="rsvp">
      <div className="rsvp-inner">
        <h2 className="section-title">RSVP</h2>
        <div className="rsvp-deadline">Please reply by {rsvp.deadline}</div>
        <p style={{ textAlign: "center", marginBottom: "2rem" }}>{rsvp.message}</p>
        <form className="rsvp-form" onSubmit={onSubmit}>
          <label>
            Your Name
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full name"
              required
            />
          </label>

          <label>
            Will you attend?
            <div className="rsvp-attend">
              <button
                type="button"
                className={attending === true ? "active" : ""}
                onClick={() => setAttending(true)}
              >
                Joyfully accept
              </button>
              <button
                type="button"
                className={attending === false ? "active" : ""}
                onClick={() => setAttending(false)}
              >
                Regretfully decline
              </button>
            </div>
          </label>

          {attending && (
            <>
              <label>
                Number of guests (including you)
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={guestCount}
                  onChange={(e) => setGuestCount(e.target.value)}
                />
              </label>
              {Number(guestCount) > 1 && (
                <label>
                  Names of your +1s
                  <input
                    type="text"
                    value={plusOnes}
                    onChange={(e) => setPlusOnes(e.target.value)}
                    placeholder="e.g. Jane Doe, John Smith"
                  />
                </label>
              )}
            </>
          )}

          <button className="rsvp-submit" type="submit" disabled={submitting}>
            {submitting ? "Sending..." : "Send RSVP"}
          </button>

          {status && (
            <div className={`rsvp-status ${status.ok ? "ok" : "err"}`}>
              {status.msg}
            </div>
          )}
        </form>
      </div>
    </section>
  );
}
