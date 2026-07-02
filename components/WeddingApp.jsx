"use client";
import { useRef, useState } from "react";
import Hero from "./Hero";
import MusicPlayer from "./MusicPlayer";

export default function WeddingApp({ config, children }) {
  const audioRef = useRef(null);
  const [musicStarted, setMusicStarted] = useState(false);

  function startMusic() {
    const audio = audioRef.current;
    if (!audio || musicStarted) return;
    audio.volume = config.music.volume ?? 0.5;
    audio.play().catch(() => {});
    setMusicStarted(true);
  }

  return (
    <>
      <audio
        ref={audioRef}
        src={config.music.src}
        loop={config.music.loop}
        preload="auto"
      />
      <Hero config={config} onStart={startMusic} />
      {children}
      <MusicPlayer music={config.music} audioRef={audioRef} />
    </>
  );
}
