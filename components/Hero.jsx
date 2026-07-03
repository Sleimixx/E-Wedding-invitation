"use client";
import { useRef, useEffect } from "react";

export default function Hero({ config, onStart }) {
  const { date } = config;
  const sectionRef = useRef(null);

  useEffect(() => {
    const hero = sectionRef.current;
    if (!hero) return;
    // Block touch-scroll from hero until button is tapped
    hero.style.touchAction = "none";
    return () => { hero.style.touchAction = ""; };
  }, []);

  function handleTap() {
    // Unlock swipe navigation before advancing
    if (sectionRef.current) sectionRef.current.style.touchAction = "";
    onStart?.();
    const next = sectionRef.current?.nextElementSibling;
    if (next) next.scrollIntoView({ behavior: "instant" });
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

      <div className="hero-start-btn" onClick={handleTap}>
        <span className="hero-start-label">Tap to Start</span>
        <span className="hero-start-arrow">↑</span>
      </div>
    </section>
  );
}
