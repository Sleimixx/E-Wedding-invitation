"use client";
import { useRef } from "react";

export default function Hero({ config, onStart }) {
  const { date } = config;
  const sectionRef = useRef(null);

  function handleTap() {
    onStart?.();
    const next = sectionRef.current?.nextElementSibling;
    if (next) next.scrollIntoView({ behavior: "instant" });
  }

  return (
    // Entire slide is the tap target — any tap starts music and advances
    <section className="hero" ref={sectionRef} onClick={handleTap}>
      <div className="slide-bg" />
      <div className="slide-overlay" />

      <div className="hero-couple-img-wrap">
        <img src="/images/eid2.jpeg" alt="Henry & Estelle" className="hero-couple-img" />
      </div>

      <div className="hero-content">
        <span className="hero-first-name">Henry</span>
        <span className="hero-and">&amp;</span>
        <span className="hero-first-name">Estelle</span>
        <div className="hero-date">{date.display}</div>
      </div>

      <div className="hero-start-btn">
        <span className="hero-start-label">Tap to Start</span>
        <span className="hero-start-arrow">↑</span>
      </div>
    </section>
  );
}
