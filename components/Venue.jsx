export default function Venue() {
  return (
    <section className="slide venue-slide" id="venue">
      <div className="event-slide-inner">
        <div className="event-slide-icon">🥂</div>
        <h2 className="event-slide-title">Reception</h2>
        <p className="event-slide-time">8:30 PM</p>
        <div className="event-slide-divider" />
        <p className="event-slide-venue">Lotus Venue</p>
        <p className="event-slide-location">Feytroun</p>
        <a
          className="event-slide-btn"
          href="https://www.google.com/maps/place/Lotus+Venue/@33.9985963,35.7479292,17z"
          target="_blank"
          rel="noopener noreferrer"
        >
          Get Directions
        </a>
      </div>
    </section>
  );
}
