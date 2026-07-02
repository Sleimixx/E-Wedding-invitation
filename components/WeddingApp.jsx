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
    // Try autoplay immediately on mount (works on desktop/Android)
    audio.play()
      .then(() => { startedRef.current = true; setPlaying(true); })
      .catch(() => {
        // Browser blocked autoplay (iOS) — fall through to gesture listeners
      });
  }, []);

  useEffect(() => {
    function onGesture() {
      const audio = audioRef.current;
      if (!audio || startedRef.current) return;
      startedRef.current = true;
      audio.volume = config.music.volume ?? 0.5;
      audio.play()
        .then(() => {
          setPlaying(true);
          document.removeEventListener("touchstart", onGesture);
          document.removeEventListener("click", onGesture);
        })
        .catch(() => {
          startedRef.current = false;
        });
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
