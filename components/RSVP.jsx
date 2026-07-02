"use client";
import { useState } from "react";

export default function RSVP() {
  const [name, setName] = useState("");
  const [attending, setAttending] = useState(null);
  const [persons, setPersons] = useState(1);
  const [status, setStatus] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    if (!name || attending === null) {
      setStatus({ ok: false, msg: "Please enter your name and select an option." });
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
          guestCount: attending ? persons : 0,
          plusOnes: "",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      setStatus({ ok: true, msg: "Thank you! We look forward to celebrating with you." });
      setName("");
      setAttending(null);
      setPersons(1);
    } catch (err) {
      setStatus({ ok: false, msg: err.message });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="slide rsvp-slide" id="rsvp">
      <div className="rsvp-slide-inner">
        <h2 className="rsvp-slide-title">Reservation</h2>

        <form className="rsvp-slide-form" onSubmit={onSubmit}>
          <input
            className="rsvp-slide-input"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full Name"
            required
          />

          <div className="rsvp-slide-persons">
            <button
              type="button"
              className={`rsvp-persons-btn${persons === 1 ? " active" : ""}`}
              onClick={() => setPersons(1)}
            >
              1 Person
            </button>
            <button
              type="button"
              className={`rsvp-persons-btn${persons === 2 ? " active" : ""}`}
              onClick={() => setPersons(2)}
            >
              2 Persons
            </button>
          </div>

          <div className="rsvp-slide-attend">
            <button
              type="button"
              className={`rsvp-attend-btn accept${attending === true ? " active" : ""}`}
              onClick={() => setAttending(true)}
            >
              Attending ✓
            </button>
            <button
              type="button"
              className={`rsvp-attend-btn decline${attending === false ? " active" : ""}`}
              onClick={() => setAttending(false)}
            >
              Not Attending ✗
            </button>
          </div>

          <button className="rsvp-slide-submit" type="submit" disabled={submitting}>
            {submitting ? "Sending…" : "Confirm"}
          </button>

          {status && (
            <div className={`rsvp-slide-status ${status.ok ? "ok" : "err"}`}>
              {status.msg}
            </div>
          )}
        </form>
      </div>
    </section>
  );
}
