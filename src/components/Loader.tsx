import { motion, animate } from 'motion/react';
import { useEffect, useState } from 'react';
import { EASE } from './Reveal';

export function Loader() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const controls = animate(0, 100, {
      duration: 1.7,
      ease: [0.65, 0, 0.35, 1],
      onUpdate: (value) => setCount(Math.round(value)),
    });
    return () => controls.stop();
  }, []);

  return (
    <motion.div
      className="loader"
      initial={{ y: 0 }}
      exit={{ y: '-100%', transition: { duration: 1, ease: [0.76, 0, 0.24, 1] } }}
      aria-label="Loading"
      role="status"
    >
      <div className="loader__top">
        <span className="label">Portfolio — Vol. MMXXVI</span>
        <span className="label">Engineer &amp; Poet</span>
      </div>

      <div className="loader__centre">
        <motion.span
          className="loader__deva"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          नितेश जोशी
        </motion.span>
        <div className="loader__name">
          <motion.span
            initial={{ y: '110%' }}
            animate={{ y: 0 }}
            transition={{ duration: 1.1, delay: 0.1, ease: EASE }}
          >
            Nitesh <em>Joshi</em>
          </motion.span>
        </div>
      </div>

      <div className="loader__bottom">
        <span className="label">Mahendranagar, Nepal</span>
        <span className="loader__count">{String(count).padStart(3, '0')}</span>
      </div>

      <motion.div
        className="loader__bar"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.7, ease: [0.65, 0, 0.35, 1] }}
      />
    </motion.div>
  );
}
