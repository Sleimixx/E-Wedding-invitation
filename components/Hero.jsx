"use client";
import { useRef, useEffect } from "react";

export default function Hero({ config, onStart }) {
  const { date } = config;
  const sectionRef = useRef(null);

  useEffect(() => {
    // Lock scrolling so the user must tap the button (click = trusted audio gesture on all browsers)
    document.documentElement.style.overflow = "hidden";
    return () => { document.documentElement.style.overflow = ""; };
  }, []);

  function handleStart() {
    // Unlock scroll before navigating
    document.documentElement.style.overflow = "";
    onStart?.();
    requestAnimationFrame(() => {
      const next = sectionRef.current?.nextElementSibling;
      if (next) next.scrollIntoView({ behavior: "instant" });
    });
  }

  return (
    <section className="hero" ref={sectionRef}>
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

      <button className="hero-start-btn" onClick={handleStart}>
        <span className="hero-start-label">Tap to Start</span>
        <span className="hero-start-arrow">↑</span>
      </button>
    </section>
  );
}
