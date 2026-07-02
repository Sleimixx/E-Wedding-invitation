"use client";
import { useEffect, useRef, useState } from "react";

export default function MusicPlayer({ music, audioRef: externalRef }) {
  const internalRef = useRef(null);
  const audioRef = externalRef ?? internalRef;
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = music.volume ?? 0.5;
  }, [music.volume]);

  function toggle() {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.play().then(() => setPlaying(true)).catch(() => {});
    }
  }

  if (!music?.src) return null;

  return (
    <>
      {!externalRef && (
        <audio ref={internalRef} src={music.src} loop={music.loop} preload="auto" />
      )}
      <button
        className="music-toggle"
        onClick={toggle}
        aria-label={playing ? "Pause music" : "Play music"}
        title={playing ? "Pause music" : "Play music"}
      >
        {playing ? "⏸" : "♫"}
      </button>
    </>
  );
}
