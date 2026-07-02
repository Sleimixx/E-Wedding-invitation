export default function ParentsHomes() {
  return (
    <section className="slide parents-slide" id="parents">
      <div className="slide-bg" />
      <div className="slide-overlay" />
      <div className="parents-inner">
        <h2 className="parents-title">Join us at our homes</h2>
        <div className="parents-divider" />

        <div className="parents-grid">
          <div className="parents-card">
            <p className="parents-card-names">Edgard &amp; Marleine Eid</p>
            <a
              className="parents-map-btn"
              href="https://www.google.com/maps?q=33.9681255,35.6181734&z=17&hl=en"
              target="_blank"
              rel="noopener noreferrer"
            >
              📍 View on Maps
            </a>
          </div>

          <div className="parents-card-divider" />

          <div className="parents-card">
            <p className="parents-card-names">Henri &amp; Josiane Eid</p>
            <a
              className="parents-map-btn"
              href="https://goo.gl/maps/sTgHckPVpkDuB3JU7"
              target="_blank"
              rel="noopener noreferrer"
            >
              📍 View on Maps
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
