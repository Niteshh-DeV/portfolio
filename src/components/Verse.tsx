import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { poems } from '@/data/poems';
import manuscriptImg from '@/assets/Handwritten/imgg2.webp';
import { useHaptic } from '@/hooks/useHaptic';
import { EASE, SectionHead } from './Reveal';

const FEATURED_POEM_ID = 8;
const EXCERPT_LINES = 7;

/** A poem excerpt set large between the projects and the contact section. */
export function Verse() {
  const navigate = useNavigate();
  const { triggerHaptic } = useHaptic();

  // The notebook page and the quotation mark slide at their own pace as the panel passes
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });
  const manuscriptY = useTransform(scrollYProgress, [0, 1], ['18%', '-18%']);
  const manuscriptRotate = useTransform(scrollYProgress, [0, 1], [9, 2]);
  const markY = useTransform(scrollYProgress, [0, 1], ['-12%', '14%']);

  const poem = poems.find((p) => p.id === FEATURED_POEM_ID) ?? poems.find((p) => p.lines.length > 0);
  if (!poem) return null;

  const firstBreak = poem.lines.indexOf('');
  const stanza = poem.lines.slice(0, firstBreak > 0 ? Math.min(firstBreak, EXCERPT_LINES) : EXCERPT_LINES);

  return (
    <section id="verse" className="verse" aria-label="Poetry" ref={sectionRef}>
      <motion.span className="verse__mark" aria-hidden="true" style={{ y: markY }}>“</motion.span>

      <SectionHead numeral="V" label="Verse — From the anthology" folio="05 / 06" />

      <div className="verse__grid">
        <blockquote className="verse__poem">
          {stanza.map((line, index) => (
            <motion.span
              key={index}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '0px 0px -12% 0px' }}
              transition={{ duration: 1.1, delay: index * 0.09, ease: EASE }}
            >
              {line}
            </motion.span>
          ))}
        </blockquote>

        <motion.figure className="verse__manuscript" style={{ y: manuscriptY, rotate: manuscriptRotate }}>
          <img src={manuscriptImg} alt="A handwritten notebook page of the poem “The Voyage”" loading="lazy" />
          <figcaption className="label">From the notebook — “The Voyage”</figcaption>
        </motion.figure>

        <div className="verse__foot">
          <cite className="verse__cite">
            “{poem.title}” <span className="label">— {poem.date}</span>
          </cite>
          <button
            type="button"
            className="link"
            data-cursor="Read"
            onClick={() => {
              triggerHaptic('medium');
              navigate('/poetry');
            }}
          >
            Read all {poems.length} poems <span className="link__arrow">↗</span>
          </button>
        </div>
      </div>
    </section>
  );
}
