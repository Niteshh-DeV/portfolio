import { motion } from 'motion/react';
import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { SEO } from '../components/SEO';
import { EASE, Reveal } from '../components/Reveal';
import { Words } from '../components/Kinetic';
import { projects } from '@/data/projects';
import { useTheme } from '../hooks/useTheme';
import { scrollToTarget } from '@/utils/scroll';
import NotFound from './NotFound';

export default function CaseStudy() {
  const { slug } = useParams();
  const { darkMode, toggleDarkMode } = useTheme();

  // Moving from one case study to the next stays on this route, so reset the scroll by hand
  useEffect(() => {
    scrollToTarget(0, { immediate: true });
  }, [slug]);

  const studies = projects.filter((project) => project.caseStudy);
  const position = studies.findIndex((project) => project.slug === slug);
  const project = studies[position];
  if (!project?.caseStudy) return <NotFound />;

  const study = project.caseStudy;
  const next = studies[(position + 1) % studies.length];

  return (
    <div className="page">
      <SEO
        title={`${project.title} — Case study | Nitesh Joshi`}
        description={study.lede}
        url={`https://niteshjoshi.me/work/${project.slug}`}
        type="article"
      />
      <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

      <main className="case" key={project.slug}>
        <header className="case__head">
          <motion.div
            className="case__crumbs label"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <Link to="/">Selected works</Link>
            <span>
              {String(position + 1).padStart(2, '0')} / {String(studies.length).padStart(2, '0')}
            </span>
          </motion.div>

          <Words as="h1" className="case__title" text={project.title} delay={0.15} />

          <motion.p
            className="case__lede"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5, ease: EASE }}
          >
            {study.lede}
          </motion.p>

          <motion.div
            className="case__links"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.7 }}
          >
            {project.live && (
              <a href={project.live} target="_blank" rel="noopener noreferrer" className="link link--accent">
                Visit the site <span className="link__arrow">↗</span>
              </a>
            )}
            {project.github && (
              <a href={project.github} target="_blank" rel="noopener noreferrer" className="link">
                Source code <span className="link__arrow">↗</span>
              </a>
            )}
            {project.isPrivate && <span className="label work__private">Private project — no public links</span>}
          </motion.div>
        </header>

        {project.image && (
          <motion.div
            className="case__cover"
            initial={{ clipPath: 'inset(100% 0 0 0)' }}
            animate={{ clipPath: 'inset(0% 0 0 0)' }}
            transition={{ duration: 1.4, delay: 0.4, ease: [0.76, 0, 0.24, 1] }}
          >
            <img src={project.image} alt={`${project.title} — screenshot`} />
          </motion.div>
        )}

        <Reveal>
          <dl className="case__facts">
            {study.facts.map((fact) => (
              <div key={fact.label} className="case__fact">
                <dt className="label">{fact.label}</dt>
                <dd>{fact.value}</dd>
              </div>
            ))}
          </dl>
        </Reveal>

        <div className="case__sections">
          {study.sections.map((section, index) => (
            <Reveal key={section.heading} className="case__section">
              <span className="label">{String(index + 1).padStart(2, '0')}</span>
              <h2 className="case__heading">{section.heading}</h2>
              <div className="case__body">
                {section.body?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                {section.points && (
                  <ul>
                    {section.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                )}
              </div>
            </Reveal>
          ))}
        </div>

        {next && next.slug !== project.slug && (
          <Link to={`/work/${next.slug}`} className="case__next" data-cursor="Next">
            <span className="label">Next case study</span>
            <span className="case__next-title">{next.title}</span>
          </Link>
        )}
      </main>

      <Footer />
    </div>
  );
}
