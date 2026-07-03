"use client";
import { useState, useRef, useCallback } from "react";
import * as XLSX from "xlsx";

function findColumns(headers) {
  const nameIdx = headers.findIndex((h) => h.includes("name"));
  // Prefer explicit "phone"/"tel" over bare "number" to avoid matching "number of attendees"
  const phoneIdx = (() => {
    const i = headers.findIndex((h) => h.includes("phone") || h.includes("tel"));
    if (i !== -1) return i;
    return headers.findIndex((h) => h.includes("number") && !h.includes("attend") && !h.includes("area") && !h.includes("code"));
  })();
  const areaCodeIdx = headers.findIndex((h) => h.includes("area") || (h.includes("code") && !h.includes("post") && !h.includes("zip")));
  const attendeesIdx = headers.findIndex((h) => h.includes("attend") || h.includes("guest") || h.includes("person"));
  return { nameIdx, phoneIdx, areaCodeIdx, attendeesIdx };
}

function parseAreaCode(raw) {
  return String(raw ?? "").replace(/\D/g, "");
}

function parseExcel(buffer) {
  const wb = XLSX.read(buffer, { type: "array" });
  const ws = wb.Sheets[wb.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(ws, { header: 1 });
  if (rows.length < 2) throw new Error("File is empty.");

  const headers = rows[0].map((h) => String(h).trim().toLowerCase());
  const { nameIdx, phoneIdx, areaCodeIdx, attendeesIdx } = findColumns(headers);

  if (nameIdx === -1) throw new Error("Missing 'Name' column.");
  if (phoneIdx === -1) throw new Error("Missing 'Phone number' column.");

  return rows.slice(1).filter((r) => r[nameIdx]).map((r) => ({
    name: String(r[nameIdx] ?? "").trim(),
    phone: String(r[phoneIdx] ?? "").trim().replace(/[\s\-().+]/g, ""),
    areaCode: areaCodeIdx !== -1 ? parseAreaCode(r[areaCodeIdx]) : "",
    attendees: attendeesIdx !== -1 ? Number(r[attendeesIdx]) || 1 : 1,
  }));
}

function parseCSV(text) {
  const lines = text.trim().split(/\r?\n/);
  const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
  const { nameIdx, phoneIdx, areaCodeIdx, attendeesIdx } = findColumns(headers);

  if (nameIdx === -1 || phoneIdx === -1) throw new Error("CSV must have a 'name' and a 'phone' column.");

  return lines.slice(1).filter(Boolean).map((line) => {
    const cols = line.split(",").map((c) => c.trim().replace(/^"|"$/g, ""));
    return {
      name: cols[nameIdx],
      phone: cols[phoneIdx].replace(/[\s\-().+]/g, ""),
      areaCode: areaCodeIdx !== -1 ? parseAreaCode(cols[areaCodeIdx]) : "",
      attendees: attendeesIdx !== -1 ? Number(cols[attendeesIdx]) || 1 : 1,
    };
  });
}

const SITE_URL = "https://e-wedding-invitation-beta.vercel.app";

function buildMessage(template, name, attendees) {
  const personalizedUrl = `${SITE_URL}?name=${encodeURIComponent(name)}&guests=${attendees}`;
  return template
    .replace(/\{name\}/gi, name)
    .replace(/\{attendees\}/gi, String(attendees))
    .replace(/\{link\}/gi, personalizedUrl);
}

export default function SendPage() {
  const [guests, setGuests] = useState([]);
  const [countryCode, setCountryCode] = useState("961");
  const [template, setTemplate] = useState(
`Hello {name} 🥂💍
The countdown is officially on... and we can't say "I do" without YOU! 🤍
We're beyond excited to invite you to celebrate the biggest party of our lives as we become Mr. & Mrs EID²💕✨
We're reserving {attendees} spot(s) just for you!
Click the link below to discover all the wedding details and confirm your attendance 💃🕺
{link}
Please let us know if you'll be joining the celebration by the 1st of August.
We seriously can't wait to celebrate, make unforgettable memories, and dance the night away with our favorite people!
See you on the dance floor! ❤️
With love,
Henry & Estelle
#EID² 💕`
  );
  const [error, setError] = useState("");
  const [fileName, setFileName] = useState("");
  const [copied, setCopied] = useState(null);
  const fileRef = useRef(null);

  const handleSend = useCallback((i, guest, rawMsg) => {
    const code = (guest.areaCode || countryCode).replace(/\D/g, "");
    const clean = code + guest.phone.replace(/\D/g, "");
    navigator.clipboard.writeText(rawMsg).catch(() => {});
    setCopied(i);
    setTimeout(() => setCopied((c) => (c === i ? null : c)), 3000);
    window.open(`https://wa.me/${clean}`, "_blank", "noopener,noreferrer");
  }, [countryCode]);

  function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    setFileName(file.name);
    setError("");
    setGuests([]);

    const isExcel = /\.(xlsx|xls)$/i.test(file.name);

    if (isExcel) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          setGuests(parseExcel(new Uint8Array(ev.target.result)));
        } catch (err) {
          setError(err.message);
        }
      };
      reader.readAsArrayBuffer(file);
    } else {
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          setGuests(parseCSV(ev.target.result));
        } catch (err) {
          setError(err.message);
        }
      };
      reader.readAsText(file);
    }
  }

  const links = template && guests.length
    ? guests.map((g) => ({ ...g, msg: buildMessage(template, g.name, g.attendees) }))
    : [];

  return (
    <main className="send-page">
      <div className="send-inner">
        <h1 className="send-title">WhatsApp Invite Sender</h1>
        <p className="send-sub">Upload your guest list, write your message, then tap each link to send.</p>

        {/* Step 1: File */}
        <div className="send-step">
          <div className="send-step-num">1</div>
          <div className="send-step-body">
            <p className="send-step-label">Upload guest list</p>
            <p className="send-step-hint">
              Supports <strong>.xlsx</strong> and <strong>.csv</strong>. Columns:{" "}
              <strong>Name</strong>, <strong>Area code</strong> (optional), <strong>Phone number</strong>, <strong>Number of attendees</strong>.
            </p>
            <div className="send-file-row">
              <button className="send-upload-btn" onClick={() => fileRef.current?.click()}>
                {fileName ? `✓ ${fileName}` : "Choose file (.xlsx / .csv)"}
              </button>
              <input
                ref={fileRef}
                type="file"
                accept=".xlsx,.xls,.csv,text/csv"
                onChange={handleFile}
                style={{ display: "none" }}
              />
            </div>
            {error && <p className="send-error">{error}</p>}
            {guests.length > 0 && (
              <p className="send-success">✓ {guests.length} guests loaded</p>
            )}
          </div>
        </div>

        {/* Step 2: Country code */}
        <div className="send-step">
          <div className="send-step-num">2</div>
          <div className="send-step-body">
            <p className="send-step-label">Country code</p>
            <p className="send-step-hint">
              Digits only — prepended to every phone number in the file (e.g. <strong>961</strong> for Lebanon).
            </p>
            <div className="send-country-row">
              <span className="send-country-plus">+</span>
              <input
                className="send-country-input"
                type="text"
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value.replace(/\D/g, ""))}
                maxLength={4}
                placeholder="961"
              />
            </div>
          </div>
        </div>

        {/* Step 3: Template */}
        <div className="send-step">
          <div className="send-step-num">3</div>
          <div className="send-step-body">
            <p className="send-step-label">Message template</p>
            <p className="send-step-hint">
              <code>{"{name}"}</code> → guest name &nbsp;·&nbsp;
              <code>{"{attendees}"}</code> → number of spots &nbsp;·&nbsp;
              <code>{"{link}"}</code> → personalized RSVP link
            </p>
            <textarea
              className="send-textarea"
              rows={10}
              value={template}
              onChange={(e) => setTemplate(e.target.value)}
            />
          </div>
        </div>

        {/* Step 4: Send */}
        {links.length > 0 && (
          <div className="send-step">
            <div className="send-step-num">4</div>
            <div className="send-step-body">
              <p className="send-step-label">Send messages</p>
              <p className="send-step-hint">Tap a button — message is copied to clipboard and WhatsApp opens. Just paste and send.</p>
              <div className="send-list">
                {links.map((g, i) => (
                  <div key={i} className="send-row">
                    <div className="send-guest-info">
                      <span className="send-guest-name">{g.name}</span>
                      <span className="send-guest-phone">+{g.areaCode || countryCode} {g.phone} · {g.attendees} pax</span>
                    </div>
                    <button
                      className={`send-wa-btn${copied === i ? " send-wa-btn--copied" : ""}`}
                      onClick={() => handleSend(i, g, g.msg)}
                    >
                      {copied === i ? "Copied ✓" : "Send ↗"}
                    </button>
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
