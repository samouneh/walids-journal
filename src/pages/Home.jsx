import StatsBar from '../components/StatsBar';
import Sidebar from '../components/Sidebar';
import Reveal from '../components/Reveal';

const NAME = 'Walid Messafer';
const SKILLS = ['Excel', 'MATLAB', 'Visio', 'Data Analysis', 'Python'];

export default function Home({ posts, onTogglePin }) {
  return (
    <>
      {/* ── Hero ── */}
      <section className="hero">
        {/* Independent floating orbs */}
        <div className="hero-orbs" aria-hidden="true">
          <div className="hero-orb hero-orb--1" />
          <div className="hero-orb hero-orb--2" />
          <div className="hero-orb hero-orb--3" />
          <div className="hero-orb hero-orb--4" />
        </div>

        {/* Text — bottom-left, no box */}
        <div className="hero-text">
          <p className="hero-greeting">Hello, I'm</p>
          <h1 className="hero-name" aria-label={NAME}>
            {NAME.split('').map((char, i) => (
              <span
                key={i}
                className="hero-char"
                style={{ '--i': i }}
                aria-hidden="true"
              >
                {char === ' ' ? '\u00a0' : char}
              </span>
            ))}
          </h1>
          <div className="hero-line" aria-hidden="true" />
          <p className="hero-subtitle">
            Chemical &amp; Petroleum Engineering &middot; University of Surrey
          </p>
        </div>

        {/* Bottom fade into page */}
        <div className="hero-fade" aria-hidden="true" />
      </section>

      {/* ── Rest of page ── */}
      <StatsBar posts={posts} />
      <div className="home-layout">
        <main className="cv-area">
          <Reveal delay={150}>
            <section className="cv-section cv-section--first">
              <h2>About</h2>
              <p>
                Second-year Chemical &amp; Petroleum Engineering student at the University of Surrey,
                currently averaging a First. I enjoy applying quantitative problem-solving to markets.
                Outside academics I play chess and read widely.
              </p>
            </section>
          </Reveal>

          <Reveal>
            <section className="cv-section">
              <h2>Education</h2>
              <div className="cv-entry">
                <span className="cv-entry-date">2024 – 2027</span>
                <div>
                  <strong>BEng Chemical &amp; Petroleum Engineering</strong>
                  <p>University of Surrey</p>
                </div>
              </div>
              <div className="cv-entry">
                <span className="cv-entry-date">2023</span>
                <div>
                  <strong>A Levels</strong>
                  <p>Herschel Grammar School</p>
                </div>
              </div>
            </section>
          </Reveal>

          <Reveal>
            <section className="cv-section">
              <h2>Experience</h2>
              <div className="cv-entry">
                <span className="cv-entry-date">Oct 2025</span>
                <div>
                  <strong>Hackathon Winner &amp; Designer</strong>
                  <p>Encode Club London Hackathon</p>
                </div>
              </div>
              <div className="cv-entry">
                <span className="cv-entry-date">2023 – Present</span>
                <div>
                  <strong>Medical Laboratory Assistant</strong>
                  <p>Wexham Park Hospital</p>
                </div>
              </div>
            </section>
          </Reveal>

          <Reveal>
            <section className="cv-section">
              <h2>Skills</h2>
              <div className="skills-grid">
                {SKILLS.map((s) => (
                  <span key={s} className="skill-tag">{s}</span>
                ))}
              </div>
            </section>
          </Reveal>
        </main>

        <Reveal delay={200} variant="fade">
          <Sidebar posts={posts} onTogglePin={onTogglePin} />
        </Reveal>
      </div>
    </>
  );
}
