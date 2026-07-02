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
    // Works immediately on desktop / Android Chrome
    audio.play()
      .then(() => { startedRef.current = true; setPlaying(true); })
      .catch(() => { /* iOS blocks autoplay — touchend listener handles it */ });
  }, []);

  useEffect(() => {
    function onClick() {
      const audio = audioRef.current;
      if (!audio || startedRef.current) return;
      startedRef.current = true;
      audio.volume = config.music.volume ?? 0.5;
      audio.play()
        .then(() => {
          setPlaying(true);
          document.removeEventListener("click", onClick);
        })
        .catch(() => { startedRef.current = false; });
    }
    document.addEventListener("click", onClick);
    return () => { document.removeEventListener("click", onClick); };
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
