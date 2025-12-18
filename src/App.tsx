import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Skills } from './components/Skills';
import { Projects } from './components/Projects';
import { Poetry } from './components/Poetry';
import { Contact } from './components/Contact';
import { motion } from 'motion/react';
import heroImg from '@/assets/hero.jpeg';

export default function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [isPoetryOpen, setIsPoetryOpen] = useState(false);

  useEffect(() => {
    // Check for saved theme preference or default to dark mode
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
      setDarkMode(false);
      document.documentElement.classList.remove('dark');
    } else {
      // Default to dark mode
      setDarkMode(true);
      document.documentElement.classList.add('dark');
      if (!savedTheme) {
        localStorage.setItem('theme', 'dark');
      }
    }
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const heroImage = heroImg;

  return (
    <div className="min-h-screen transition-colors duration-300">
      <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} openPoetry={() => setIsPoetryOpen(true)} />
      
      <main>
        <Hero heroImage={heroImage} />
        <About />
        <Skills />
        <Projects />
        <Contact />
      </main>

      {/* Poetry Modal */}
      {isPoetryOpen && <Poetry onClose={() => setIsPoetryOpen(false)} />}

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="py-8 px-4 sm:px-6 lg:px-8 border-t border-[rgb(var(--border))]"
      >
        <div className="max-w-7xl mx-auto text-center text-[rgb(var(--muted-foreground))]">
          <p>© 2025 Nitesh. </p>
          <p className="mt-2">Designed & Developed with React, TypeScript & Tailwind CSS</p>
        </div>
      </motion.footer>
    </div>
  );
}