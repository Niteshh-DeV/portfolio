import { useState, useEffect } from 'react';
import { flushSync } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';

import { useHaptic } from '@/hooks/useHaptic';
import { EASE } from './Reveal';
import { Magnetic, useScramble } from './Kinetic';
import { lockScroll, scrollToTarget } from '@/utils/scroll';
import { isSoundOn, setSound } from '@/utils/sound';

interface NavbarProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const navItems = ['About', 'Skills', 'Projects', 'Poetry', 'Contact'];

const menuLinks = [
  { label: 'Email', href: 'mailto:niteshjoshi010@icloud.com' },
  { label: 'GitHub', href: 'https://github.com/Niteshh-DeV' },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/niteshjoshi' },
  { label: 'Instagram', href: 'https://www.instagram.com/nitesh_joshi_/' },
];

function NavLink({ item, index, onSelect }: { item: string; index: number; onSelect: () => void }) {
  const [label, scramble] = useScramble(item);

  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 + index * 0.07, duration: 0.8, ease: EASE }}
      onClick={onSelect}
      onMouseEnter={scramble}
      className="nav__link"
      aria-label={item}
    >
      <sup>0{index + 1}</sup>
      {label}
    </motion.button>
  );
}

export function Navbar({ darkMode, toggleDarkMode }: NavbarProps) {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [soundOn, setSoundOn] = useState(isSoundOn);
  const { triggerHaptic } = useHaptic();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock the page behind the full-screen menu
  useEffect(() => {
    if (!isMobileMenuOpen) return;
    return lockScroll();
  }, [isMobileMenuOpen]);

  const scrollToSection = (section: string) => {
    triggerHaptic('selection');
    if (section === 'Poetry') {
      navigate('/poetry');
      setIsMobileMenuOpen(false);
      return;
    }

    // Ensure we are on home, then scroll to the section
    navigate('/');
    setIsMobileMenuOpen(false);

    // Coming from another route the section only exists once the page transition has finished
    const startedAt = performance.now();
    const scrollWhenReady = () => {
      const element = document.getElementById(section.toLowerCase());
      if (!element) {
        if (performance.now() - startedAt < 3000) requestAnimationFrame(scrollWhenReady);
        return;
      }

      scrollToTarget(element, { offset: -60 });
    };
    scrollWhenReady();
  };

  // The new theme spreads out from the toggle as a growing circle
  const switchTheme = (e: React.MouseEvent) => {
    triggerHaptic('medium');
    const doc = document as Document & {
      startViewTransition?: (update: () => void) => { ready: Promise<void> };
    };
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!doc.startViewTransition || reduceMotion) {
      toggleDarkMode();
      return;
    }

    const x = e.clientX;
    const y = e.clientY;
    const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
    const transition = doc.startViewTransition(() => {
      flushSync(() => toggleDarkMode());
    });
    transition.ready
      .then(() => {
        document.documentElement.animate(
          { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
          { duration: 1000, easing: 'cubic-bezier(0.76, 0, 0.24, 1)', pseudoElement: '::view-transition-new(root)' }
        );
      })
      .catch(() => {});
  };

  const soundButton = (
    <button
      type="button"
      className="nav__theme nav__sound"
      aria-pressed={soundOn}
      aria-label={soundOn ? 'Turn interface sounds off' : 'Turn interface sounds on'}
      onClick={() => {
        setSound(!soundOn);
        setSoundOn(!soundOn);
      }}
    >
      <span className="nav__bars" aria-hidden="true">
        <i />
        <i />
        <i />
      </span>
      Sound
    </button>
  );

  const themeButton = (
    <button
      type="button"
      className="nav__theme"
      onClick={switchTheme}
      onTouchStart={() => triggerHaptic('selection')}
      aria-label={darkMode ? 'Switch to light theme' : 'Switch to dark theme'}
    >
      <i aria-hidden="true" />
      {darkMode ? 'Paper' : 'Ink'}
    </button>
  );

  return (
    <>
      <nav className={`nav ${isScrolled && !isMobileMenuOpen ? 'is-scrolled' : ''}`} aria-label="Primary">
        <button
          type="button"
          className="nav__brand"
          onClick={() => {
            triggerHaptic('light');
            navigate('/');
            setIsMobileMenuOpen(false);
            setTimeout(() => scrollToTarget(0), 150);
          }}
          onTouchStart={() => triggerHaptic('selection')}
          aria-label="Nitesh Joshi — home"
        >
          <span>
            Nitesh <em>Joshi</em>
          </span>
          <span className="deva" aria-hidden="true">नितेश जोशी</span>
        </button>

        {/* Desktop Navigation */}
        <div className="nav__links">
          {navItems.map((item, index) => (
            <NavLink key={item} item={item} index={index} onSelect={() => scrollToSection(item)} />
          ))}
          {soundButton}
          <Magnetic>{themeButton}</Magnetic>
        </div>

        {/* Mobile Menu Button */}
        <div className="nav__mobile">
          {themeButton}
          <button
            type="button"
            className="nav__burger"
            onClick={() => {
              setIsMobileMenuOpen(!isMobileMenuOpen);
              triggerHaptic('light');
            }}
            onTouchStart={() => triggerHaptic('selection')}
            aria-expanded={isMobileMenuOpen}
            aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          >
            {isMobileMenuOpen ? 'Close' : 'Menu'}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="menu"
            data-lenis-prevent
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          >
            <div className="menu__list">
              {navItems.map((item, index) => (
                <motion.button
                  key={item}
                  type="button"
                  className="menu__item"
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 + index * 0.07, duration: 0.9, ease: EASE }}
                  onClick={() => scrollToSection(item)}
                  onTouchStart={() => triggerHaptic('selection')}
                >
                  <span>0{index + 1}</span>
                  {item}
                </motion.button>
              ))}
            </div>
            <div className="menu__foot">
              {soundButton}
              {menuLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="link"
                  {...(link.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                >
                  {link.label} <span className="link__arrow">↗</span>
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
