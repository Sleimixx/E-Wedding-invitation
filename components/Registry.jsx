export default function Registry({ registry }) {
  return (
    <section className="section">
      <h2 className="section-title">Gifts</h2>
      <p className="registry-message">{registry.message}</p>
      <div className="registry-links">
        {registry.links.map((l) => (
          <a
            key={l.url}
            className="registry-link"
            href={l.url}
            target="_blank"
            rel="noreferrer"
          >
            {l.label}
          </a>
        ))}
      </div>
    </section>
  );
}
