export default function EventDetails({ events }) {
  return (
    <section className="section">
      <h2 className="section-title">The Details</h2>
      <div className="events-grid">
        {events.map((e) => (
          <div className="event-card" key={e.name}>
            <div className="event-name">{e.name}</div>
            <div className="event-time">{e.time}</div>
            <div>{e.date}</div>
            <div className="event-venue">{e.venue}</div>
            <div className="event-address">{e.address}</div>
            {e.dressCode && (
              <div className="event-dress">Dress: {e.dressCode}</div>
            )}
            {e.mapsUrl && (
              <a
                className="event-map"
                href={e.mapsUrl}
                target="_blank"
                rel="noreferrer"
              >
                Open in Maps
              </a>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
