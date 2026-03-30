import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronUp } from 'lucide-react';
import { useHaptic } from '@/hooks/useHaptic';

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const { triggerHaptic } = useHaptic();

  useEffect(() => {
    const toggleVisibility = () => {
      // Show button when user scrolls down 500px
      if (window.scrollY > 500) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    triggerHaptic('medium');
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, y: 20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.8 }}
          transition={{ duration: 0.3 }}
          onClick={scrollToTop}
          onTouchStart={() => triggerHaptic('selection')}
          className="fixed bottom-8 right-6 md:right-10 z-[100] p-3 rounded-full shadow-lg border border-[rgb(var(--border))] bg-[rgb(var(--muted))]/70 text-[rgb(var(--foreground))] hover:bg-[rgb(var(--foreground))] hover:text-[rgb(var(--background))] hover:border-[rgb(var(--foreground))] backdrop-blur-sm transition-colors cursor-pointer"
          aria-label="Scroll to top"
        >
          <ChevronUp size={28} />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
