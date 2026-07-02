export default function OurStory({ story }) {
  return (
    <section className="section">
      <h2 className="section-title">{story.title}</h2>
      <div className="story-grid">
        <div
          className="story-photo"
          style={{ backgroundImage: `url(${story.photo})` }}
        />
        <div className="story-text">
          {story.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </div>
    </section>
  );
}
