export default function Hero({ config }) {
  const { couple, date, hero } = config;
  return (
    <section className="hero">
      <div
        className="hero-bg"
        style={{ backgroundImage: `url(${hero.backgroundImage})` }}
      />
      <div className="hero-content">
        <div className="hero-tagline">{hero.tagline}</div>
        <h1 className="hero-names">
          {couple.brideName}
          <div className="hero-and">&amp;</div>
          {couple.groomName}
        </h1>
        <div className="hero-subtitle">{hero.subtitle}</div>
        <div className="hero-date">{date.display}</div>
      </div>
    </section>
  );
}
