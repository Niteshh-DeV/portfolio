import { motion } from 'motion/react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { SEO } from '../components/SEO';
import { EASE } from '../components/Reveal';
import { poems } from '@/data/poems';
import { poemHeading, poemLines, poemPath } from '@/utils/poems';
import { useTheme } from '../hooks/useTheme';

export default function NotFound() {
  const { darkMode, toggleDarkMode } = useTheme();

  // A different line of verse keeps the lost visitor company each time
  const [verse] = useState(() => {
    const withLines = poems.filter((poem) => poemLines(poem).length > 1);
    const poem = withLines[Math.floor(Math.random() * withLines.length)];
    const lines = poemLines(poem);
    const start = Math.floor(Math.random() * (lines.length - 1));
    return { poem, lines: lines.slice(start, start + 2) };
  });

  return (
    <div className="page">
      <SEO title="Page not found | Nitesh Joshi" description="This page was never written." />
      <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

      <main className="lost">
        <div style={{ overflow: 'hidden' }}>
          <motion.h1
            className="lost__code"
            initial={{ y: '110%' }}
            animate={{ y: 0 }}
            transition={{ duration: 1.3, delay: 0.1, ease: EASE }}
          >
            4<em>0</em>4
          </motion.h1>
        </div>

        <motion.div
          className="lost__body"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5, ease: EASE }}
        >
          <p className="lost__title">This page was never written.</p>

          <blockquote className="lost__verse">
            {verse.lines.map((line) => (
              <span key={line}>{line}</span>
            ))}
            <cite className="label">
              — from <Link to={poemPath(verse.poem)}>“{poemHeading(verse.poem).heading}”</Link>
            </cite>
          </blockquote>

          <div className="lost__links">
            <Link to="/" className="link">
              Back to the portfolio <span className="link__arrow">↗</span>
            </Link>
            <Link to="/poetry" className="link link--accent">
              Read the poems <span className="link__arrow">↗</span>
            </Link>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
