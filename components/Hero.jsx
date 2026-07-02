"use client";
import { useRef } from "react";

export default function Hero({ config, onStart }) {
  const { couple, date, hero } = config;
  const sectionRef = useRef(null);

  function handleStart() {
    onStart?.();
    const next = sectionRef.current?.nextElementSibling;
    if (next) {
      next.scrollIntoView({ behavior: "smooth" });
    }
  }

  return (
    <section className="hero" ref={sectionRef}>
      <div
        className="hero-bg"
        style={{ backgroundImage: `url(${hero.backgroundImage})` }}
      />
      <div className="hero-overlay" />

      <div className="hero-content">
        <h1 className="hero-names">
          <span className="hero-first-name">Henry</span>
          <span className="hero-and">&amp;</span>
          <span className="hero-first-name">Estelle</span>
        </h1>
        <div className="hero-date">{date.display}</div>
      </div>

      <button className="hero-start-btn" onClick={handleStart}>
        <span className="hero-start-label">Swipe to Start</span>
        <span className="hero-start-arrow">↑</span>
      </button>
    </section>
  );
}
