"use client";
import { useRef, useState, useEffect } from "react";
import Hero from "./Hero";
import MusicPlayer from "./MusicPlayer";

export default function WeddingApp({ config, children }) {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const startedRef = useRef(false);

  function startMusic() {
    if (startedRef.current) return;
    const audio = audioRef.current;
    if (!audio) return;
    startedRef.current = true;
    audio.volume = config.music.volume ?? 0.5;
    audio.play()
      .then(() => setPlaying(true))
      .catch(() => { startedRef.current = false; });
  }

  useEffect(() => {
    function onFirstInteraction() {
      startMusic();
      window.removeEventListener("scroll", onFirstInteraction);
      window.removeEventListener("touchstart", onFirstInteraction);
      window.removeEventListener("touchmove", onFirstInteraction);
    }
    window.addEventListener("scroll", onFirstInteraction, { passive: true });
    window.addEventListener("touchstart", onFirstInteraction, { passive: true });
    window.addEventListener("touchmove", onFirstInteraction, { passive: true });
    return () => {
      window.removeEventListener("scroll", onFirstInteraction);
      window.removeEventListener("touchstart", onFirstInteraction);
      window.removeEventListener("touchmove", onFirstInteraction);
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
