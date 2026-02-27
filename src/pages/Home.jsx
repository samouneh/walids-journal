import StatsBar from '../components/StatsBar';
import Sidebar from '../components/Sidebar';
import Reveal from '../components/Reveal';

export default function Home({ posts, onTogglePin }) {
  return (
    <>
      <StatsBar posts={posts} />
      <div className="home-layout">
        <main className="cv-area">
          <Reveal>
            <h1>Walid Messafer</h1>
            <p className="cv-subtitle">Chemical & Petroleum Engineering · University of Surrey</p>
          </Reveal>

          <Reveal delay={150}>
            <section className="cv-section">
              <h2>About</h2>
              <p>
                Second-year Chemical & Petroleum Engineering student at the University of Surrey,
                currently averaging a First. I enjoy applying quantitative problem-solving to markets
                and am studying for the Investment Management Certificate (IMC). Outside academics I
                play chess and read widely.
              </p>
            </section>
          </Reveal>

          <Reveal>
            <section className="cv-section">
              <h2>Education</h2>
              <div className="cv-entry">
                <span className="cv-entry-date">2024 – 2027</span>
                <div>
                  <strong>BEng Chemical & Petroleum Engineering</strong>
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
                  <strong>Hackathon Winner & Designer</strong>
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
                {['Excel', 'MATLAB', 'Visio', 'Data Analysis', 'Python'].map((s) => (
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
