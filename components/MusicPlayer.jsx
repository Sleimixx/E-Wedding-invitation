"use client";
import { useEffect, useRef, useState } from "react";

export default function MusicPlayer({ music }) {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = music.volume ?? 0.5;

    if (music.autoplay) {
      audio.play().then(() => setPlaying(true)).catch(() => {
        // Browsers block autoplay without a gesture; wait for one.
        const onGesture = () => {
          audio.play().then(() => setPlaying(true)).catch(() => {});
          window.removeEventListener("click", onGesture);
          window.removeEventListener("touchstart", onGesture);
        };
        window.addEventListener("click", onGesture, { once: true });
        window.addEventListener("touchstart", onGesture, { once: true });
      });
    }
  }, [music.autoplay, music.volume]);

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
      <audio ref={audioRef} src={music.src} loop={music.loop} preload="auto" />
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
