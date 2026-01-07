import { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { Hero } from '../components/Hero';
import { About } from '../components/About';
import { Skills } from '../components/Skills';
import { Projects } from '../components/Projects';
import { Contact } from '../components/Contact';
import { SEO } from '../components/SEO';
import { motion } from 'motion/react';
import heroImg from '@/assets/hero.jpeg';
import heroImg2 from '@/assets/Hero3.jpeg';

export default function HomePage() {
  const [darkMode, setDarkMode] = useState(true);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
      setDarkMode(false);
      document.documentElement.classList.remove('dark');
    } else {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
      if (!savedTheme) {
        localStorage.setItem('theme', 'dark');
      }
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['about', 'skills', 'projects', 'contact'];
      const scrollPosition = window.scrollY + window.innerHeight / 3;

      if (window.scrollY < 100) {
        setActiveSection('home');
        return;
      }

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(sectionId);
            return;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const seoData = {
    home: {
      title: 'Nitesh Joshi | Computer Engineering Student & Developer',
      description: 'Computer Engineering student from Nepal passionate about AI/ML, open source, and building meaningful digital experiences.',
      url: 'https://niteshjoshi.me'
    },
    about: {
      title: 'About Me',
      description: 'Learn more about Nitesh Joshi - Computer Engineering student, poet, and passionate creator combining technical expertise with artistic expression.',
      url: 'https://niteshjoshi.me#about'
    },
    skills: {
      title: 'Skills & Technologies',
      description: 'Explore my technical skills including AI/ML, web development, programming languages, and modern development tools.',
      url: 'https://niteshjoshi.me#skills'
    },
    projects: {
      title: 'Projects & Portfolio',
      description: 'Explore my development projects including web applications, AI/ML experiments, C++ and Python projects, and open source contributions.',
      url: 'https://niteshjoshi.me#projects'
    },
    contact: {
      title: 'Contact Me',
      description: 'Get in touch with Nitesh Joshi. Connect via email, GitHub, LinkedIn, or social media. Let us collaborate on exciting projects!',
      url: 'https://niteshjoshi.me#contact'
    }
  } as const;

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
      <SEO
        title={seoData[activeSection as keyof typeof seoData].title}
        description={seoData[activeSection as keyof typeof seoData].description}
        url={seoData[activeSection as keyof typeof seoData].url}
      />

      <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

      <main>
        <Hero heroImage={heroImage} hoverHeroImage={heroImg2} />
        <About />
        <Skills />
        <Projects />
        <Contact />
      </main>

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
