import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useHaptic } from '@/hooks/useHaptic';
import { Magnetic } from './Kinetic';
import { scrollToTarget } from '@/utils/scroll';

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const { triggerHaptic } = useHaptic();

  useEffect(() => {
    const toggleVisibility = () => {
      // Show button when user scrolls down 500px
      setIsVisible(window.scrollY > 500);
    };

    window.addEventListener('scroll', toggleVisibility, { passive: true });
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    triggerHaptic('medium');
    scrollToTarget(0);
  };

  return (
    <Magnetic className="to-top-wrap">
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.4 }}
          onClick={scrollToTop}
          onTouchStart={() => triggerHaptic('selection')}
          className="to-top"
          aria-label="Scroll to top"
        >
          ↑
        </motion.button>
      )}
    </AnimatePresence>
    </Magnetic>
  );
}
