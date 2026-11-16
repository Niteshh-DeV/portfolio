import { motion, useScroll, useTransform } from 'motion/react';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHaptic } from '@/hooks/useHaptic';
import cvPdf from '@/assets/CV/Nitesh Joshi-2.pdf';
import { EASE } from './Reveal';
import { createPortraitGL, type PortraitGL } from '@/utils/portraitGL';
import { scrollToTarget } from '@/utils/scroll';

interface HeroProps {
  heroImage: string;
  hoverHeroImage?: string;
}

const kathmanduTime = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Asia/Kathmandu',
  hour: '2-digit',
  minute: '2-digit',
});

export function Hero({ heroImage, hoverHeroImage }: HeroProps) {
  const navigate = useNavigate();
  const { triggerHaptic } = useHaptic();
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const portraitRef = useRef<HTMLButtonElement>(null);
  const colourRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [inColour, setInColour] = useState(false);
  const inColourRef = useRef(inColour);
  const [canHover, setCanHover] = useState(false);
  const [time, setTime] = useState(() => kathmanduTime.format(new Date()));

  useEffect(() => {
    const timer = setInterval(() => setTime(kathmanduTime.format(new Date())), 20000);
    return () => clearInterval(timer);
  }, []);

  // Lens: the colour portrait shows through a circle that trails the pointer
  useEffect(() => {
    const stage = stageRef.current;
    const portrait = portraitRef.current;
    const colour = colourRef.current;
    if (!stage || !portrait || !colour) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    setCanHover(true);

    const target = { x: portrait.offsetWidth / 2, y: portrait.offsetHeight * 0.38, r: 0 };
    const current = { ...target };
    let hovering = false;
    let rafId = 0;

    // With WebGL the lens becomes a liquid blob; without it the CSS circle below stays
    const canvas = canvasRef.current;
    let liquid: PortraitGL | null = null;
    let disposed = false;
    if (canvas && hoverHeroImage) {
      createPortraitGL(canvas, heroImage, hoverHeroImage).then((instance) => {
        if (disposed) instance?.dispose();
        else liquid = instance;
      });
    }

    const radius = () => {
      if (inColourRef.current) return Math.hypot(portrait.offsetWidth, portrait.offsetHeight) * 1.1;
      return hovering ? Math.min(portrait.offsetWidth * 0.36, 160) : 0;
    };

    const tick = () => {
      target.r = radius();
      current.x += (target.x - current.x) * 0.16;
      current.y += (target.y - current.y) * 0.16;
      current.r += (target.r - current.r) * 0.1;
      colour.style.setProperty('--lx', `${current.x.toFixed(1)}px`);
      colour.style.setProperty('--ly', `${current.y.toFixed(1)}px`);
      const open = current.r > 0.5;
      if (liquid && canvas) {
        liquid.render(current.x, current.y, Math.max(0, current.r), performance.now() / 1000);
        canvas.classList.toggle('is-live', open);
      } else {
        colour.style.setProperty('--lr', `${Math.max(0, current.r).toFixed(1)}px`);
      }

      const settled =
        Math.abs(target.x - current.x) < 0.2 &&
        Math.abs(target.y - current.y) < 0.2 &&
        Math.abs(target.r - current.r) < 0.2;
      // the liquid edge keeps moving for as long as the lens is open
      rafId = settled && !(liquid && open) ? 0 : requestAnimationFrame(tick);
    };

    const wake = () => {
      if (!rafId) rafId = requestAnimationFrame(tick);
    };

    const onMove = (e: MouseEvent) => {
      const box = portrait.getBoundingClientRect();
      target.x = e.clientX - box.left;
      target.y = e.clientY - box.top;
      const reach = 90;
      hovering =
        target.x > -reach && target.x < box.width + reach && target.y > -reach && target.y < box.height + reach;
      wake();
    };

    const onLeave = () => {
      hovering = false;
      wake();
    };

    stage.addEventListener('mousemove', onMove);
    stage.addEventListener('mouseleave', onLeave);
    portrait.addEventListener('click', wake);

    return () => {
      stage.removeEventListener('mousemove', onMove);
      stage.removeEventListener('mouseleave', onLeave);
      portrait.removeEventListener('click', wake);
      cancelAnimationFrame(rafId);
      disposed = true;
      liquid?.dispose();
    };
  }, []);

  const toggleColour = () => {
    triggerHaptic('medium');
    inColourRef.current = !inColour;
    setInColour(!inColour);
  };

  const scrollToAbout = () => {
    const element = document.getElementById('about');
    if (element) scrollToTarget(element, { offset: -60 });
  };

  const goToPoetry = () => {
    triggerHaptic('medium');
    navigate('/poetry');
  };

  // Leaving the hero: the two halves of the name drift apart and the portrait sinks
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] });
  const driftLeft = useTransform(scrollYProgress, [0, 1], ['0vw', '-14vw']);
  const driftRight = useTransform(scrollYProgress, [0, 1], ['0vw', '14vw']);
  const portraitY = useTransform(scrollYProgress, [0, 1], ['0%', '22%']);
  const portraitScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);

  const lineIn = (delay: number) => ({
    initial: { y: '115%' },
    animate: { y: 0 },
    transition: { duration: 1.4, delay, ease: EASE },
  });

  const fadeIn = (delay: number) => ({
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 1, delay, ease: EASE },
  });

  // opacity only: these two are positioned with a CSS transform
  const appear = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 1.2, delay: 1.2 },
  };

  return (
    <section className="hero" aria-label="Introduction" ref={sectionRef}>
      <div className="hero__stage" ref={stageRef}>
        <h1 className="hero__title">
          <span className="hero__line hero__line--a">
            <motion.span {...lineIn(0.45)} style={{ x: driftLeft }}>Nitesh</motion.span>
          </span>
          <span className="hero__line hero__line--b">
            <motion.span {...lineIn(0.6)} style={{ x: driftRight }}>Joshi</motion.span>
          </span>
        </h1>

        <motion.button
          type="button"
          ref={portraitRef}
          className="portrait"
          style={{ y: portraitY, scale: portraitScale }}
          aria-pressed={inColour}
          aria-label="Portrait of Nitesh Joshi — toggle colour"
          data-cursor-quiet
          onClick={toggleColour}
          initial={{ clipPath: 'inset(100% 0 0 0)' }}
          animate={{ clipPath: 'inset(0% 0 0 0)' }}
          transition={{ duration: 1.5, delay: 0.3, ease: [0.76, 0, 0.24, 1] }}
        >
          <motion.img
            className="portrait__mono"
            src={heroImage}
            alt="Nitesh Joshi - Profile"
            initial={{ scale: 1.25 }}
            animate={{ scale: 1 }}
            transition={{ duration: 2, delay: 0.3, ease: EASE }}
          />
          {hoverHeroImage && (
            <img ref={colourRef} className="portrait__colour" src={hoverHeroImage} alt="" aria-hidden="true" />
          )}
          <canvas ref={canvasRef} className="portrait__gl" aria-hidden="true" />
          <span className="portrait__hint label">
            {canHover ? 'Hover — in colour' : inColour ? 'Tap — in mono' : 'Tap — in colour'}
          </span>
        </motion.button>

        <motion.span className="hero__side label" {...appear}>
          Portfolio — Vol. MMXXVI
        </motion.span>
        <motion.span className="hero__deva" aria-hidden="true" {...appear}>
          नितेश जोशी
        </motion.span>
      </div>

      <motion.div className="hero__meta" {...fadeIn(1.1)}>
        <div>
          <p className="hero__lede">
            <strong>Engineering student, poet, AI/ML enthusiast &amp; passionate creator</strong> — blending
            engineering precision with creative storytelling.
          </p>
          <div className="hero__actions">
            <a
              href={cvPdf}
              download="Nitesh_Joshi_CV.pdf"
              className="link"
              onClick={() => triggerHaptic('medium')}
              onTouchStart={() => triggerHaptic('selection')}
              aria-label="Download CV"
            >
              Download CV <span className="link__arrow">↓</span>
            </a>
            <button
              type="button"
              className="link link--accent"
              onClick={goToPoetry}
              onTouchStart={() => triggerHaptic('selection')}
              aria-label="Open poetry section"
            >
              Read my poetry <span className="link__arrow">↗</span>
            </button>
          </div>
        </div>

        <button
          type="button"
          className="hero__scroll label"
          onClick={() => {
            scrollToAbout();
            triggerHaptic('light');
          }}
          aria-label="Scroll to about section"
        >
          Scroll
          <i aria-hidden="true" />
        </button>

        <div className="hero__place label">
          <span>Mahendranagar, Nepal</span>
          <span>
            28.96° N, 80.18° E — <b>{time}</b> NPT
          </span>
        </div>
      </motion.div>
    </section>
  );
}
