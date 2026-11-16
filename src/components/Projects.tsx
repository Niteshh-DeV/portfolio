import { motion, useMotionValue, useSpring, useTransform, useVelocity } from 'motion/react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useHaptic } from '@/hooks/useHaptic';
import { projects, type Project } from '@/data/projects';
import { EASE, Reveal, SectionHead } from './Reveal';
import { Words } from './Kinetic';

const filters: { name: string; test: (project: Project) => boolean }[] = [
  { name: 'All', test: () => true },
  { name: 'Web', test: (project) => project.tags.includes('React') },
  { name: 'Data/AI', test: (project) => project.tags.includes('Python') },
  { name: 'C++', test: (project) => project.tags.includes('C++') },
];

export function Projects() {
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState('All');
  const { triggerHaptic } = useHaptic();

  // Floating preview that trails the pointer across the list
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const previewX = useSpring(pointerX, { stiffness: 180, damping: 24, mass: 0.6 });
  const previewY = useSpring(pointerY, { stiffness: 180, damping: 24, mass: 0.6 });
  // ...and leans into the direction it is being dragged
  const previewTilt = useSpring(useTransform(useVelocity(previewX), [-1800, 0, 1800], [-10, 0, 10]), {
    stiffness: 160,
    damping: 20,
  });

  const filteredProjects = projects.filter(filters.find((filter) => filter.name === activeFilter)?.test ?? (() => true));

  return (
    <section id="projects" aria-label="Projects" className="section works">
      <SectionHead numeral="III" label="Selected works — Projects" folio="03 / 06" />

      <div className="works__top">
        <Words className="display" text="Selected *works*" />

        {/* Filter Bar */}
        <Reveal className="works__filters" delay={0.1}>
          {filters.map((filter) => (
            <button
              key={filter.name}
              type="button"
              aria-pressed={activeFilter === filter.name}
              onClick={() => {
                setActiveFilter(filter.name);
                triggerHaptic('light');
              }}
              className="works__filter"
            >
              {filter.name}
              <sup>{projects.filter(filter.test).length}</sup>
            </button>
          ))}
        </Reveal>
      </div>

      <div
        className="works__list"
        onMouseMove={(e) => {
          pointerX.set(e.clientX);
          pointerY.set(e.clientY);
        }}
        onMouseLeave={() => setHoveredProject(null)}
      >
        {filteredProjects.map((project, index) => {
          const external = project.live || project.github;

          return (
            <motion.article
              key={project.slug}
              className="work"
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '0px 0px -10% 0px' }}
              transition={{ duration: 0.9, delay: index * 0.05, ease: EASE }}
              onMouseEnter={() => setHoveredProject(project.slug)}
              onTouchStart={() => triggerHaptic('selection')}
            >
              <span className="label">{String(index + 1).padStart(2, '0')}</span>

              <h3 className="work__title">
                {project.caseStudy ? (
                  <Link to={`/work/${project.slug}`} data-cursor="Read" onClick={() => triggerHaptic('medium')}>
                    {project.title}
                  </Link>
                ) : (
                  <a
                    href={external}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cursor={project.live ? 'Visit' : 'Code'}
                    onClick={() => triggerHaptic('medium')}
                  >
                    {project.title}
                  </a>
                )}
              </h3>

              <div className="work__body">
                <p className="work__desc">{project.description}</p>
                <ul className="work__tags">
                  {project.tags.map((tag) => (
                    <li key={tag} className="label">
                      {tag}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="work__links">
                {project.caseStudy && (
                  <Link to={`/work/${project.slug}`} className="link link--accent" onClick={() => triggerHaptic('medium')}>
                    Case study <span className="link__arrow">→</span>
                  </Link>
                )}
                {project.live && (
                  <a
                    href={project.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link"
                    onClick={() => triggerHaptic('medium')}
                  >
                    Live <span className="link__arrow">↗</span>
                  </a>
                )}
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link"
                    onClick={() => triggerHaptic('medium')}
                  >
                    Code <span className="link__arrow">↗</span>
                  </a>
                )}
                {project.isPrivate && <span className="label work__private">Private project</span>}
              </div>

              {project.image && (
                <div className="work__image">
                  <img src={project.image} alt={project.title} loading="lazy" />
                </div>
              )}
            </motion.article>
          );
        })}
      </div>

      <motion.div
        className="works__preview"
        aria-hidden="true"
        style={{ x: previewX, y: previewY, rotate: previewTilt }}
        animate={{ opacity: hoveredProject ? 1 : 0, scale: hoveredProject ? 1 : 0.8 }}
        transition={{ duration: 0.5, ease: EASE }}
      >
        {projects.map((project) => (
          <div key={project.slug} className="works__preview-item" data-active={hoveredProject === project.slug}>
            {project.image ? (
              <img src={project.image} alt="" loading="lazy" />
            ) : (
              <div className="works__blank">{project.isPrivate ? 'खाता' : project.tags[0]}</div>
            )}
          </div>
        ))}
      </motion.div>
    </section>
  );
}
