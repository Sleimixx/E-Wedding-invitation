"use client";
import { useEffect, useState } from "react";

function diff(target) {
  const now = new Date();
  const ms = Math.max(0, target - now);
  const days = Math.floor(ms / 86400000);
  const hours = Math.floor((ms / 3600000) % 24);
  const minutes = Math.floor((ms / 60000) % 60);
  const seconds = Math.floor((ms / 1000) % 60);
  return { days, hours, minutes, seconds };
}

export default function Countdown({ targetIso }) {
  const target = new Date(targetIso);
  const [t, setT] = useState(() => diff(target));

  useEffect(() => {
    const id = setInterval(() => setT(diff(target)), 1000);
    return () => clearInterval(id);
  }, [targetIso]);

  const items = [
    ["Days", t.days],
    ["Hours", t.hours],
    ["Minutes", t.minutes],
    ["Seconds", t.seconds],
  ];

  return (
    <div className="countdown">
      {items.map(([label, value]) => (
        <div className="countdown-box" key={label}>
          <div className="countdown-num">{String(value).padStart(2, "0")}</div>
          <div className="countdown-label">{label}</div>
        </div>
      ))}
    </div>
  );
}
