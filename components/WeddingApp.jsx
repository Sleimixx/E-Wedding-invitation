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
    // touchstart and click are the only trusted user-gesture events
    // that iOS Safari allows audio to start from.
    function onGesture() {
      startMusic();
      document.removeEventListener("touchstart", onGesture);
      document.removeEventListener("click", onGesture);
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
