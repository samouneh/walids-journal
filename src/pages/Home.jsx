import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import StatsBar from '../components/StatsBar';
import Sidebar from '../components/Sidebar';
import Reveal from '../components/Reveal';
import { excerpt, catSlug, relTime } from '../utils/format';

const NAME = 'Walid Messafer';
const SKILLS = ['Financial Modelling', 'Excel & VBA', 'Python', 'Data Analysis', 'Equity Research'];

const ALL_CATEGORIES = [
  'Markets & Investing',
  'Financial Modelling',
  'Reading & Research',
  'Projects & Analysis',
  'Industry Notes',
];

/* Accent colour for each category — matches the cat-* CSS classes */
const CAT_HUE = {
  'Markets & Investing':  { h: 213, s: '88%', l: '58%' },
  'Financial Modelling': { h: 152, s: '72%', l: '40%' },
  'Reading & Research':              { h: 36,  s: '80%', l: '52%' },
  'Projects & Analysis':              { h: 262, s: '68%', l: '54%' },
  'Industry Notes':                { h: 215, s: '16%', l: '48%' },
};


export default function Home({ posts, onTogglePin }) {
  const location = useLocation();

  /* When OS animation is off, CSS keyframes are suppressed — run orbs via rAF instead */
  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!mql.matches) return;

    const orbs = Array.from(document.querySelectorAll('.hero-orb'));
    orbs.forEach((o) => { o.style.animationDuration = '0s'; });

    const params = [
      { fx: 0.072, fy: 0.095, ax: 110, ay: 80, sx: 0.042, phase: 0.0 },
      { fx: 0.058, fy: 0.077, ax: 95,  ay: 70, sx: 0.038, phase: 1.7 },
      { fx: 0.091, fy: 0.062, ax: 120, ay: 60, sx: 0.051, phase: 3.1 },
      { fx: 0.065, fy: 0.083, ax: 80,  ay: 55, sx: 0.035, phase: 4.8 },
    ];

    let rafId;
    function tick() {
      const t = performance.now() / 1000;
      orbs.forEach((orb, i) => {
        const p = params[i];
        const x = Math.sin(t * p.fx + p.phase) * p.ax;
        const y = Math.cos(t * p.fy + p.phase) * p.ay;
        const s = 1 + Math.sin(t * p.sx + p.phase) * 0.09;
        orb.style.transform = `translate(${x.toFixed(1)}px,${y.toFixed(1)}px) scale(${s.toFixed(3)})`;
      });
      rafId = requestAnimationFrame(tick);
    }
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  /* Scroll to #topics if navigated here with that intent */
  useEffect(() => {
    const target = sessionStorage.getItem('scrollTo');
    if (target) {
      sessionStorage.removeItem('scrollTo');
      setTimeout(() => {
        document.getElementById(target)?.scrollIntoView({ behavior: 'smooth' });
      }, 120);
    }
  }, [location]);

  /* Build topic card data — sorted by post count desc */
  const topicCards = ALL_CATEGORIES
    .map((cat) => {
      const catPosts = posts
        .filter((p) => p.category === cat)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      return { cat, count: catPosts.length, latest: catPosts[0] ?? null };
    })
    .sort((a, b) => b.count - a.count);

  /* Featured Work — pinned posts, max 3 */
  const featured = posts.filter((p) => p.pinned).slice(0, 3);

  /* Currently working on — posts explicitly marked in-progress */
  const nowPosts = posts
    .filter((p) => p.inProgress)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  /* For each in-progress post, count how many total posts share a tag (depth indicator) */
  function tagDepth(post) {
    if (!post.tags.length) return 0;
    return posts.filter((p) => p.id !== post.id && p.tags.some((t) => post.tags.includes(t))).length;
  }

  return (
    <>
      {/* ── Hero ── */}
      <section className="hero">
        <div className="hero-orbs" aria-hidden="true">
          <div className="hero-orb hero-orb--1" />
          <div className="hero-orb hero-orb--2" />
          <div className="hero-orb hero-orb--3" />
          <div className="hero-orb hero-orb--4" />
        </div>

        <div className="hero-text">
          <p className="hero-greeting">Hello, I'm</p>
          <h1 className="hero-name" aria-label={NAME}>
            {NAME.split('').map((char, i) => (
              <span key={i} className="hero-char" style={{ '--i': i }} aria-hidden="true">
                {char === ' ' ? '\u00a0' : char}
              </span>
            ))}
          </h1>
          <div className="hero-line" aria-hidden="true" />
          <p className="hero-subtitle">
            Engineering &times; Finance &middot; University of Surrey
          </p>
        </div>

        <div className="hero-fade" aria-hidden="true" />
      </section>

      {/* ── Now Dashboard ── */}
      <div className="now-dashboard">
        <span className="now-dashboard-live">
          <span className="now-dashboard-dot" />
          Now
        </span>
        <div className="now-dashboard-items">
          <span className="now-dashboard-item">📐 Year 2 · Chemical &amp; Petroleum Engineering</span>
          <span className="now-dashboard-item">📊 Studying IMC</span>
          <span className="now-dashboard-item">🏆 Hackathon Winner · Encode London</span>
          <span className="now-dashboard-item">🛠 Building Journal AI</span>
          {nowPosts.map(p => (
            <Link key={p.id} to={`/post/${p.id}`} className="now-dashboard-item">
              ✍️ {p.title}
            </Link>
          ))}
        </div>
      </div>

      {/* ── Stats ── */}
      <StatsBar posts={posts} />

      {/* ── What I'm Working On Right Now ── */}
      {nowPosts.length > 0 && (
        <section className="now-section">
          <Reveal>
            <div className="now-header">
              <span className="now-pulse" aria-hidden="true" />
              <h2 className="now-title">What I'm Working On Right Now</h2>
            </div>
          </Reveal>
          <div className="now-timeline">
            {nowPosts.map((post, i) => {
              const depth = tagDepth(post);
              return (
                <Reveal key={post.id} delay={i * 70}>
                  <div className="now-timeline-item">
                    <span className="now-timeline-dot" />
                    <Link to={`/post/${post.id}`} className="now-card">
                      <div className="now-card-top">
                        <span className={`post-card-category cat-${catSlug(post.category)}`}>
                          {post.category}
                        </span>
                        <span className="now-card-time">{relTime(post.createdAt)}</span>
                      </div>
                      <h3 className="now-card-title">{post.title}</h3>
                      <p className="now-card-excerpt">{excerpt(post.content, 100)}</p>
                      {depth > 0 && (
                        <span className="now-card-depth">
                          {depth} related {depth === 1 ? 'entry' : 'entries'} logged
                        </span>
                      )}
                    </Link>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </section>
      )}

      {/* ── Featured Work (pinned posts) ── */}
      {featured.length > 0 && (
        <section className="featured-section">
          <Reveal>
            <div className="featured-header">
              <h2 className="featured-title">Featured Work</h2>
              <p className="featured-sub">Pinned entries I'm most proud of.</p>
            </div>
          </Reveal>

          <div className="featured-grid">
            {featured.map((post, i) => (
              <Reveal key={post.id} delay={i * 80}>
                <Link to={`/post/${post.id}`} className="featured-card">
                  <span className={`post-card-category cat-${catSlug(post.category)}`}>
                    {post.category}
                  </span>
                  <h3 className="featured-card-title">{post.title}</h3>
                  <p className="featured-card-excerpt">{excerpt(post.content, 120)}</p>
                  <span className="featured-card-cta">Read more →</span>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* ── Topics bento ── */}
      <section id="topics" className="topics-section">
        <Reveal>
          <div className="topics-header">
            <h2 className="topics-title">Topics</h2>
            <p className="topics-sub">Everything I've been writing about, by category.</p>
          </div>
        </Reveal>

        <div className="topics-grid">
          {topicCards.map((t, i) => {
            const hue   = CAT_HUE[t.cat];
            const color = `hsl(${hue.h},${hue.s},${hue.l})`;
            const bg    = `hsla(${hue.h},${hue.s},${hue.l},0.07)`;
            const border= `hsla(${hue.h},${hue.s},${hue.l},0.18)`;

            return (
              <Reveal key={t.cat} delay={i * 60}>
                <Link
                  to={`/archive?cat=${encodeURIComponent(t.cat)}`}
                  className={`topic-card ${i === 0 ? 'topic-card--lg' : 'topic-card--sm'}`}
                  style={{ '--tc': color, '--tc-bg': bg, '--tc-border': border }}
                >
                  {/* Accent bar along the top */}
                  <span className="topic-card-bar" aria-hidden="true" />

                  <div className="topic-card-top">
                    <span className={`topic-card-label post-card-category cat-${catSlug(t.cat)}`}>
                      {t.cat}
                    </span>
                    <span className="topic-card-count">
                      {t.count} {t.count === 1 ? 'entry' : 'entries'}
                    </span>
                  </div>

                  {t.latest ? (
                    <div className="topic-card-body">
                      <p className="topic-card-latest-title">{t.latest.title}</p>
                      <p className="topic-card-excerpt">{excerpt(t.latest.content)}</p>
                    </div>
                  ) : (
                    <p className="topic-card-empty">No entries yet — start writing →</p>
                  )}

                  <span className="topic-card-cta">Browse {t.cat} →</span>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </section>


      {/* ── CV + Sidebar ── */}
      <div className="home-layout">
        <main className="cv-area">
          <Reveal delay={150}>
            <section className="cv-section cv-section--first">
              <h2>About</h2>
              <p>
                Second-year Chemical &amp; Petroleum Engineering student at the University of Surrey,
                currently averaging a First. Passionate about applying quantitative engineering
                methods to financial analysis &mdash; from DCF modelling to systematic investment
                research. This journal documents my journey into finance.
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