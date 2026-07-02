"use client";
import { useRef } from "react";

export default function Hero({ config, onStart }) {
  const { date, hero } = config;
  const sectionRef = useRef(null);

  function handleStart() {
    onStart?.();
    const next = sectionRef.current?.nextElementSibling;
    if (next) {
      next.scrollIntoView({ behavior: "instant" });
    }
  }

  return (
    <section className="hero" ref={sectionRef}>
      <div className="hero-bg" style={{ backgroundImage: `url(${hero.backgroundImage})` }} />
      <div className="hero-overlay" />

      <div className="hero-couple-img-wrap">
        <img src="/images/eid2.jpeg" alt="Henry & Estelle" className="hero-couple-img" />
      </div>

      <div className="hero-content">
        <span className="hero-first-name">Henry</span>
        <span className="hero-and">&amp;</span>
        <span className="hero-first-name">Estelle</span>
        <div className="hero-date">{date.display}</div>
      </div>

      <button className="hero-start-btn" onClick={handleStart}>
        <span className="hero-start-label">Swipe to Start</span>
        <span className="hero-start-arrow">↑</span>
      </button>
    </section>
  );
}
