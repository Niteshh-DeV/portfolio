import { motion } from 'motion/react';
import type { ReactNode } from 'react';

export const EASE = [0.16, 1, 0.3, 1] as const;

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}

/** Fades and lifts its children into place the first time they scroll into view. */
export function Reveal({ children, className, delay = 0, y = 28 }: RevealProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={{ duration: 1, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

interface SectionHeadProps {
  numeral: string;
  label: string;
  folio: string;
}

/** Chapter rule: roman numeral, chapter name, folio. */
export function SectionHead({ numeral, label, folio }: SectionHeadProps) {
  return (
    <Reveal className="sec-head" y={12}>
      <span className="sec-head__num">{numeral}.</span>
      <span className="label">{label}</span>
      <span className="label">{folio}</span>
    </Reveal>
  );
}
