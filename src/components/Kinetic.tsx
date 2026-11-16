import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from 'motion/react';
import { Fragment, useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { EASE } from './Reveal';
import { playTone } from '@/utils/sound';

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* --------------------------------------------------------------------------
   Words — heading whose words rise out of a mask, one after another.
   Wrap a word in *asterisks* to set it in accent italics.
   -------------------------------------------------------------------------- */

const wordTags = { h1: motion.h1, h2: motion.h2, span: motion.span };

interface WordsProps {
  text: string;
  as?: keyof typeof wordTags;
  className?: string;
  delay?: number;
}

export function Words({ text, as = 'h2', className, delay = 0 }: WordsProps) {
  const Tag = wordTags[as];

  return (
    <Tag
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.09, delayChildren: delay } } }}
    >
      {text.split(' ').map((raw, index) => {
        const emphasised = raw.startsWith('*') && raw.endsWith('*');
        const word = emphasised ? raw.slice(1, -1) : raw;
        return (
          <Fragment key={index}>
            <span className="word">
              <motion.span
                className="word__in"
                variants={{ hidden: { y: '118%' }, show: { y: 0, transition: { duration: 1.2, ease: EASE } } }}
              >
                {emphasised ? <em>{word}</em> : word}
              </motion.span>
            </span>{' '}
          </Fragment>
        );
      })}
    </Tag>
  );
}

/* --------------------------------------------------------------------------
   Magnetic — children lean toward the pointer and spring back.
   -------------------------------------------------------------------------- */

interface MagneticProps {
  children: ReactNode;
  className?: string;
  strength?: number;
}

export function Magnetic({ children, className, strength = 0.35 }: MagneticProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 220, damping: 14, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 220, damping: 14, mass: 0.4 });

  return (
    <motion.div
      className={className}
      style={{ x: springX, y: springY, display: 'inline-block' }}
      onMouseMove={(e) => {
        const box = e.currentTarget.getBoundingClientRect();
        x.set((e.clientX - (box.left + box.width / 2)) * strength);
        y.set((e.clientY - (box.top + box.height / 2)) * strength);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}

/* --------------------------------------------------------------------------
   useScramble — decodes a label out of random glyphs, left to right.
   -------------------------------------------------------------------------- */

const GLYPHS = 'ABCDEFGHIKLMNOPRSTUVXYZ/\\_—+';

export function useScramble(text: string) {
  const [output, setOutput] = useState(text);
  const rafId = useRef(0);

  const scramble = useCallback(() => {
    if (prefersReducedMotion()) return;
    cancelAnimationFrame(rafId.current);
    let frame = 0;

    const tick = () => {
      frame += 1;
      const revealed = frame / 3;
      setOutput(
        text
          .split('')
          .map((char, index) =>
            index < revealed || char === ' ' ? char : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
          )
          .join('')
      );
      if (revealed < text.length) rafId.current = requestAnimationFrame(tick);
    };

    tick();
  }, [text]);

  useEffect(() => () => cancelAnimationFrame(rafId.current), []);

  return [output, scramble] as const;
}

/* --------------------------------------------------------------------------
   ScrollProgress — hairline across the top that fills with the page.
   -------------------------------------------------------------------------- */

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 28, mass: 0.4 });
  return <motion.div className="progress" style={{ scaleX }} aria-hidden="true" />;
}

/* --------------------------------------------------------------------------
   Marquee — drifts on its own; scrolling speeds it up and sets its direction.
   -------------------------------------------------------------------------- */

export function Marquee({ items }: { items: string[] }) {
  const position = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });
  const boost = useTransform(smoothVelocity, [-2000, 0, 2000], [-5, 0, 5], { clamp: false });
  const direction = useRef(-1);
  const still = useRef(prefersReducedMotion());

  useAnimationFrame((_, delta) => {
    if (still.current) return;
    const push = boost.get();
    if (push < 0) direction.current = 1;
    else if (push > 0) direction.current = -1;

    // position is a percentage of the track, which holds the items twice
    let next = position.get() + direction.current * 1.3 * (delta / 1000) * (1 + Math.abs(push));
    if (next <= -50) next += 50;
    if (next > 0) next -= 50;
    position.set(next);
  });

  const x = useTransform(position, (value) => `${value}%`);

  return (
    <div className="marquee" aria-hidden="true">
      <motion.div className="marquee__track" style={{ x }}>
        {[0, 1].map((group) => (
          <div key={group} className="marquee__group">
            {items.map((item, index) => (
              <Fragment key={index}>
                <span>{item}</span>
                <i />
              </Fragment>
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  );
}

/* --------------------------------------------------------------------------
   RouteCurtain — a panel sweeps up over the page while the route swaps under it.
   -------------------------------------------------------------------------- */

/**
 * Pages that share a first path segment are one area: opening a poem or moving
 * between case studies stays inside it, so the curtain only falls between areas.
 */
export const routeArea = (pathname: string) => pathname.split('/')[1] ?? '';

const CURTAIN_TITLES: Record<string, string> = { '': 'Portfolio', poetry: 'Poems', work: 'Works' };

/** How long the outgoing page is held before it unmounts (the curtain is closed by then). */
export const ROUTE_HOLD = 0.52;

export function RouteCurtain() {
  const { pathname } = useLocation();
  const area = routeArea(pathname);
  const [initialArea] = useState(area);
  const hasNavigated = useRef(false);
  if (area !== initialArea) hasNavigated.current = true;

  useEffect(() => {
    if (hasNavigated.current) playTone('page');
  }, [area]);

  // The loader already covers the first paint
  if (!hasNavigated.current) return null;

  return (
    <motion.div
      key={area}
      className="curtain"
      aria-hidden="true"
      initial={{ y: '100%' }}
      animate={{ y: ['100%', '0%', '0%', '-100%'] }}
      transition={{ duration: 1.3, times: [0, 0.4, 0.56, 1], ease: [[0.76, 0, 0.24, 1], 'linear', [0.76, 0, 0.24, 1]] }}
    >
      <span>{CURTAIN_TITLES[area] ?? 'Portfolio'}</span>
    </motion.div>
  );
}
