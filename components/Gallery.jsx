export default function Gallery({ images }) {
  if (!images?.length) return null;
  return (
    <section className="section">
      <h2 className="section-title">Moments</h2>
      <div className="gallery-grid">
        {images.map((src, i) => (
          <div
            key={i}
            className="gallery-item"
            style={{ backgroundImage: `url(${src})` }}
          />
        ))}
      </div>
    </section>
  );
}
