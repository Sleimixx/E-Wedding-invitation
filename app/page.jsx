import config from "@/config/wedding.json";
import Hero from "@/components/Hero";
import Countdown from "@/components/Countdown";
import OurStory from "@/components/OurStory";
import EventDetails from "@/components/EventDetails";
import Gallery from "@/components/Gallery";
import Registry from "@/components/Registry";
import RSVP from "@/components/RSVP";
import MusicPlayer from "@/components/MusicPlayer";

export default function Home() {
  return (
    <main>
      <Hero config={config} />
      <section className="section">
        <h2 className="section-title">Counting Down</h2>
        <Countdown targetIso={config.date.iso} />
      </section>
      <OurStory story={config.story} />
      <EventDetails events={config.events} />
      <Gallery images={config.gallery} />
      <Registry registry={config.registry} />
      <RSVP rsvp={config.rsvp} />
      <footer className="footer">
        <div className="footer-names">
          {config.couple.brideName} &amp; {config.couple.groomName}
        </div>
        <div className="footer-hashtag">{config.couple.hashtag}</div>
      </footer>
      <MusicPlayer music={config.music} />
    </main>
  );
}
