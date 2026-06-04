import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import heroImage from "./assets/hero.png";
import "./App.css";

const THEME_STORAGE_KEY = "portfolio-theme";

const THEME_OPTIONS = [
  { label: "Light", value: "light" },
  { label: "Dark", value: "dark" },
  { label: "System", value: "system" },
];

const NAV_LINKS = [
  { label: "Work", id: "work" },
  { label: "About", id: "about" },
  { label: "Skills", id: "skills" },
  { label: "Contact", id: "contact" },
];

const PROJECTS = [
  {
    title: "SmartClinic",
    eyebrow: "Flagship project",
    stack: "React, Node.js, PostgreSQL, Drizzle ORM, Express",
    description:
      "A multi-role healthcare portal with separate dashboards for patients, doctors, receptionists, and admins, all backed by one secure API.",
    details: [
      "Designed five related PostgreSQL tables with reproducible Drizzle migrations.",
      "Built server-enforced role permissions and session auth with HTTP-only cookies.",
      "Used TanStack Query for cache invalidation and optimistic dashboard updates.",
    ],
    accent: "blue",
  },
  {
    title: "AI Chess Engine",
    eyebrow: "Algorithms",
    stack: "Python, Minimax, Alpha-Beta Pruning",
    description:
      "A chess AI with tuned evaluation heuristics for material, mobility, and center control.",
    details: [
      "Cut evaluated nodes by roughly 50% at the same depth with alpha-beta pruning.",
      "Logged node counts per move to analyze search depth, time, and complexity.",
    ],
    accent: "green",
  },
  {
    title: "E-Commerce Store",
    eyebrow: "Full stack",
    stack: "MERN Stack, React, Node.js, MongoDB",
    description:
      "A complete store with a React frontend, Express REST API, and flexible product data modeling.",
    details: [
      "Implemented cart state with context and reducer for consistent navigation.",
      "Modeled variable product attributes without schema migration overhead.",
    ],
    accent: "amber",
  },
  {
    title: "Netmirror Cinema",
    eyebrow: "Frontend",
    stack: "HTML, CSS, JavaScript, HCI Principles",
    description:
      "A responsive cinema booking interface with seat selection, live availability, and confirmation flows.",
    details: [
      "Applied keyboard navigation, ARIA labels, and accessible contrast choices.",
      "Structured CSS with component-scoped naming for easier future expansion.",
    ],
    accent: "pink",
  },
  {
    title: "Restaurant Management System",
    eyebrow: "Database design",
    stack: "SQL, Relational Design, System Architecture",
    description:
      "A normalized restaurant database covering orders, inventory, staff scheduling, and menu management.",
    details: [
      "Reduced redundancy by roughly 40% compared with the flat-table prototype.",
      "Enforced integrity using foreign keys, cascades, and check constraints.",
    ],
    accent: "blue",
  },
  {
    title: "2D Game Engine",
    eyebrow: "Systems",
    stack: "C++, SDL, Fixed Timestep Loop",
    description:
      "A small engine with decoupled physics and rendering loops for stable frame pacing.",
    details: [
      "Kept frame-time variance below 5% under normal CPU load.",
      "Profiled and improved texture uploads, event polling, and collision checks.",
    ],
    accent: "green",
  },
];

const SKILL_GROUPS = [
  {
    title: "Frontend",
    items: ["React", "Vite", "Tailwind", "TanStack Query", "Accessible UI"],
  },
  {
    title: "Backend",
    items: ["Node.js", "Express", "REST APIs", "Session Auth", "Security"],
  },
  {
    title: "Data",
    items: ["PostgreSQL", "Drizzle ORM", "MongoDB", "SQL", "Schema Design"],
  },
  {
    title: "Learning",
    items: ["Docker", "GitHub Actions", "AWS/GCP", "Linux", "Observability"],
  },
];

const METRICS = [
  ["NUST", "Computer Science"],
  ["2027", "Expected Graduation"],
  ["65%", "SmartClinic Backend Effort"],
  ["5 min", "Local Onboarding Target"],
];

function useActiveSection(ids) {
  const [active, setActive] = useState(ids[0]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible?.target?.id) {
          setActive(visible.target.id);
        }
      },
      { rootMargin: "-20% 0px -55% 0px", threshold: [0.15, 0.35, 0.6] },
    );

    ids.forEach((id) => {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, [ids]);

  return active;
}

function getStoredThemeSetting() {
  if (typeof window === "undefined") return "system";

  const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
  return THEME_OPTIONS.some((option) => option.value === storedTheme) ? storedTheme : "system";
}

function getSystemTheme() {
  if (typeof window === "undefined") return "dark";
  return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

function useThemePreference() {
  const [themeSetting, setThemeSetting] = useState(getStoredThemeSetting);
  const [systemTheme, setSystemTheme] = useState(getSystemTheme);
  const effectiveTheme = themeSetting === "system" ? systemTheme : themeSetting;

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: light)");
    const handleChange = () => setSystemTheme(mediaQuery.matches ? "light" : "dark");

    handleChange();
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  useLayoutEffect(() => {
    document.documentElement.dataset.theme = effectiveTheme;
    document.documentElement.style.colorScheme = effectiveTheme;
  }, [effectiveTheme]);

  useEffect(() => {
    window.localStorage.setItem(THEME_STORAGE_KEY, themeSetting);
  }, [themeSetting]);

  return { effectiveTheme, setThemeSetting, themeSetting };
}

function ProjectCard({ project, index }) {
  return (
    <article className={`project-card project-card--${project.accent}`}>
      <div className="project-card__top">
        <span>{project.eyebrow}</span>
        <span>{String(index + 1).padStart(2, "0")}</span>
      </div>
      <h3>{project.title}</h3>
      <p>{project.description}</p>
      <ul>
        {project.details.map((detail) => (
          <li key={detail}>{detail}</li>
        ))}
      </ul>
      <div className="project-card__stack">{project.stack}</div>
    </article>
  );
}

export default function App() {
  const sectionIds = useMemo(() => NAV_LINKS.map((link) => link.id), []);
  const activeSection = useActiveSection(sectionIds);
  const { effectiveTheme, setThemeSetting, themeSetting } = useThemePreference();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <main className="site-shell">
      <header className={`site-nav ${scrolled ? "site-nav--scrolled" : ""}`}>
        <button className="brand" type="button" onClick={() => scrollToSection("top")}>
          <span>AB</span>
          Abrar Butt
        </button>

        <nav className={`nav-links ${menuOpen ? "nav-links--open" : ""}`} aria-label="Primary navigation">
          {NAV_LINKS.map((link) => (
            <button
              className={activeSection === link.id ? "is-active" : ""}
              key={link.id}
              type="button"
              onClick={() => scrollToSection(link.id)}
            >
              {link.label}
            </button>
          ))}
        </nav>

        <div className="theme-setting" role="group" aria-label={`Theme setting. Current theme is ${effectiveTheme}.`}>
          {THEME_OPTIONS.map((option) => (
            <button
              className={themeSetting === option.value ? "is-selected" : ""}
              key={option.value}
              type="button"
              aria-pressed={themeSetting === option.value}
              onClick={() => setThemeSetting(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>

        <button
          className="menu-toggle"
          type="button"
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span />
          <span />
        </button>
      </header>

      <section className="hero section-band" id="top">
        <div className="hero__content">
          <div className="eyebrow">Software Developer · Full-Stack Web & App Development</div>
          <h1>
            Building practical software with clean APIs, thoughtful interfaces, and production discipline.
          </h1>
          <p>
            Computer Science student at NUST focused on full-stack engineering. I take ideas from schema design
            and REST APIs through polished React dashboards, with DevOps and cloud deployment becoming part of the toolkit.
          </p>
          <div className="hero__actions">
            <button className="button button--primary" type="button" onClick={() => scrollToSection("work")}>
              View Projects
            </button>
            <a className="button button--secondary" href="mailto:abrarbuttmi7@gmail.com">
              Contact Me
            </a>
          </div>
        </div>
        <div className="hero__visual" aria-label="Portfolio technical preview">
          <div className="visual-panel">
            <img src="profile.jpg" alt="" />
          </div>
        </div>
      </section>

      <section className="stats-strip" aria-label="Portfolio highlights">
        {METRICS.map(([value, label]) => (
          <div key={label}>
            <strong>{value}</strong>
            <span>{label}</span>
          </div>
        ))}
      </section>

      <section className="section-band section-band--muted" id="work">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Selected work</span>
            <h2>Projects with real architecture behind the interface.</h2>
          </div>
          <p>
            The work below covers healthcare portals, algorithms, e-commerce, accessible booking flows,
            relational design, and systems programming.
          </p>
        </div>

        <div className="project-grid">
          {PROJECTS.map((project, index) => (
            <ProjectCard key={project.title} project={project} index={index} />
          ))}
        </div>
      </section>

      <section className="section-band about" id="about">
        <div className="about__copy">
          <span className="eyebrow">About</span>
          <h2>I like owning the whole path from data model to user flow.</h2>
          <p>
            My strongest project, SmartClinic, was built from scratch as a production-grade clinic management
            portal. The backend carries the security boundary with role checks on every endpoint, while the frontend
            gives each user type a purpose-built dashboard.
          </p>
          <p>
            I am currently growing deeper into Docker, CI/CD, cloud fundamentals, infrastructure as code, Linux,
            shell scripting, and observability so I can ship features responsibly from commit to production.
          </p>
        </div>

        <div className="timeline" aria-label="Experience and education">
          <article>
            <span>2025</span>
            <h3>Cyber Security Intern</h3>
            <p>Cybersecurity Zone, NUST · security analysis, risk assessments, and vulnerability reporting.</p>
          </article>
          <article>
            <span>2024 - Present</span>
            <h3>Volunteer Fundraiser</h3>
            <p>Shaukat Khanum Memorial Cancer Hospital · campaign outreach analysis and team coordination.</p>
          </article>
          <article>
            <span>Expected 2027</span>
            <h3>Bachelor of Computer Science</h3>
            <p>National University of Sciences & Technology, Islamabad.</p>
          </article>
        </div>
      </section>

      <section className="section-band section-band--muted" id="skills">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Skills</span>
            <h2>A stack built around shipping full-stack products.</h2>
          </div>
          <p>
            Comfortable across React interfaces, Express APIs, relational schemas, and the deployment fundamentals
            needed to keep improving as an engineer.
          </p>
        </div>

        <div className="skill-grid">
          {SKILL_GROUPS.map((group) => (
            <article key={group.title} className="skill-card">
              <h3>{group.title}</h3>
              <div>
                {group.items.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="contact section-band" id="contact">
        <span className="eyebrow">Contact</span>
        <h2>Have a role, project, or collaboration in mind?</h2>
        <p>
          I am open to software development, full-stack engineering, and cloud or DevOps-focused opportunities.
          Based in Islamabad, Pakistan.
        </p>
        <div className="contact__actions">
          <a className="button button--primary" href="mailto:abrarbuttmi7@gmail.com" target="_blank">
            abrarbuttmi7@gmail.com
          </a>
          <a className="button button--secondary" href="tel:+923279903862">
            +92 327 990 3862
          </a>
        </div>
        <div className="social-links">
          <a href="https://github.com/Abrarbut" target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a href="https://www.linkedin.com/in/abrar-butt-bb761639a/" target="_blank" rel="noreferrer">
            LinkedIn
          </a>
        </div>
      </section>

      <footer className="site-footer">
        <span>© 2026 Abrar Butt</span>
        <span>Designed and built with React + Vite.</span>
      </footer>
    </main>
  );
}
