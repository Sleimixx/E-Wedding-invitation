"use client";
import { useRef, useState, useEffect } from "react";
import Hero from "./Hero";
import MusicPlayer from "./MusicPlayer";

export default function WeddingApp({ config, children }) {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const startedRef = useRef(false);

  function startMusic() {
    const audio = audioRef.current;
    if (!audio || startedRef.current) return;
    startedRef.current = true;
    audio.volume = config.music.volume ?? 0.5;
    audio.play()
      .then(() => setPlaying(true))
      .catch(() => { startedRef.current = false; });
  }

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = config.music.volume ?? 0.5;
    // Try unmuted autoplay first (desktop / Android Chrome)
    audio.play()
      .then(() => { startedRef.current = true; setPlaying(true); })
      .catch(() => {
        // Unmuted autoplay blocked — try muted (iOS allows muted autoplay)
        audio.muted = true;
        audio.play().catch(() => { /* both blocked; gesture listener handles it */ });
      });
  }, []);

  useEffect(() => {
    function onGesture() {
      const audio = audioRef.current;
      if (!audio || startedRef.current) return;

      // If already playing muted, just unmute — no play() call = no iOS restriction
      if (audio.muted && !audio.paused) {
        audio.muted = false;
        startedRef.current = true;
        setPlaying(true);
        document.removeEventListener("touchstart", onGesture);
        document.removeEventListener("click", onGesture);
        return;
      }

      // Audio not playing yet — full play attempt (works on tap/click)
      startedRef.current = true;
      audio.muted = false;
      audio.play()
        .then(() => {
          setPlaying(true);
          document.removeEventListener("touchstart", onGesture);
          document.removeEventListener("click", onGesture);
        })
        .catch(() => { startedRef.current = false; });
    }
    document.addEventListener("touchstart", onGesture, { passive: true });
    document.addEventListener("click", onGesture);
    return () => {
      document.removeEventListener("touchstart", onGesture);
      document.removeEventListener("click", onGesture);
    };
  }, []);

  return (
    <>
      <audio
        ref={audioRef}
        src={config.music.src}
        type="audio/mpeg"
        loop={config.music.loop}
        preload="auto"
      />
      <Hero config={config} onStart={startMusic} />
      {children}
      <MusicPlayer audioRef={audioRef} playing={playing} setPlaying={setPlaying} />
    </>
  );
}
