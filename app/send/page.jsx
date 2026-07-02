"use client";
import { useState, useRef } from "react";

function parseCSV(text) {
  const lines = text.trim().split(/\r?\n/);
  const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
  const nameIdx = headers.findIndex((h) => h.includes("name"));
  const phoneIdx = headers.findIndex((h) => h.includes("phone") || h.includes("number") || h.includes("tel"));

  if (nameIdx === -1 || phoneIdx === -1) {
    throw new Error("CSV must have a 'name' column and a 'phone' column.");
  }

  return lines.slice(1).filter(Boolean).map((line) => {
    const cols = line.split(",").map((c) => c.trim().replace(/^"|"$/g, ""));
    return { name: cols[nameIdx], phone: sanitizePhone(cols[phoneIdx]) };
  });
}

function sanitizePhone(raw) {
  return raw.replace(/[\s\-().]/g, "");
}

const SITE_URL = "https://e-wedding-invitation-beta.vercel.app";

function buildLink(phone, template, name) {
  const personalizedUrl = `${SITE_URL}?name=${encodeURIComponent(name)}`;
  const msg = template
    .replace(/\{name\}/gi, name)
    .replace(/\{link\}/gi, personalizedUrl);
  return `https://wa.me/${phone.replace("+", "")}?text=${encodeURIComponent(msg)}`;
}

export default function SendPage() {
  const [guests, setGuests] = useState([]);
  const [template, setTemplate] = useState("");
  const [error, setError] = useState("");
  const [fileName, setFileName] = useState("");
  const fileRef = useRef(null);

  function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = parseCSV(ev.target.result);
        setGuests(parsed);
        setError("");
      } catch (err) {
        setError(err.message);
        setGuests([]);
      }
    };
    reader.readAsText(file);
  }

  const links = template && guests.length
    ? guests.map((g) => ({ ...g, url: buildLink(g.phone, template, g.name) }))
    : [];

  return (
    <main className="send-page">
      <div className="send-inner">
        <h1 className="send-title">WhatsApp Invite Sender</h1>
        <p className="send-sub">
          Upload your guest CSV, write your message, then tap each link to send.
        </p>

        {/* Step 1: CSV */}
        <div className="send-step">
          <div className="send-step-num">1</div>
          <div className="send-step-body">
            <p className="send-step-label">Upload guest list CSV</p>
            <p className="send-step-hint">
              CSV must have a <strong>name</strong> column and a <strong>phone</strong> column.
              Phone numbers should include country code (e.g. +96170123456).
            </p>
            <button className="send-upload-btn" onClick={() => fileRef.current?.click()}>
              {fileName ? `✓ ${fileName}` : "Choose CSV file"}
            </button>
            <input
              ref={fileRef}
              type="file"
              accept=".csv,text/csv"
              onChange={handleFile}
              style={{ display: "none" }}
            />
            {error && <p className="send-error">{error}</p>}
            {guests.length > 0 && (
              <p className="send-success">✓ {guests.length} guests loaded</p>
            )}
          </div>
        </div>

        {/* Step 2: Template */}
        <div className="send-step">
          <div className="send-step-num">2</div>
          <div className="send-step-body">
            <p className="send-step-label">Write your message</p>
            <p className="send-step-hint">
              Use <code>{"{name}"}</code> for the guest&apos;s name and <code>{"{link}"}</code> for their personalized RSVP link (auto-fills their name on the reservation page).
            </p>
            <textarea
              className="send-textarea"
              rows={6}
              value={template}
              onChange={(e) => setTemplate(e.target.value)}
              placeholder={`Dear {name},\n\nWe joyfully invite you to celebrate the wedding of Estelle & Henry on August 21, 2026.\n\nKindly RSVP here: {link}`}
            />
          </div>
        </div>

        {/* Step 3: Links */}
        {links.length > 0 && (
          <div className="send-step">
            <div className="send-step-num">3</div>
            <div className="send-step-body">
              <p className="send-step-label">Send messages</p>
              <p className="send-step-hint">
                Tap each button — WhatsApp opens with the message ready to send.
              </p>
              <div className="send-list">
                {links.map((g, i) => (
                  <div key={i} className="send-row">
                    <div className="send-guest-info">
                      <span className="send-guest-name">{g.name}</span>
                      <span className="send-guest-phone">{g.phone}</span>
                    </div>
                    <a
                      className="send-wa-btn"
                      href={g.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Send ↗
                    </a>
                  </div>
                ))}
              </div>
              <p className="send-total">{links.length} messages ready</p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
