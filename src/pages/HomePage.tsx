import { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { Hero } from '../components/Hero';
import { About } from '../components/About';
import { Skills } from '../components/Skills';
import { Projects } from '../components/Projects';
import { Record } from '../components/Record';
import { Verse } from '../components/Verse';
import { Contact } from '../components/Contact';
import { Footer } from '../components/Footer';
import { SEO } from '../components/SEO';
import { ChapterRail } from '../components/ChapterRail';
import { Marquee } from '../components/Kinetic';
import { useTheme } from '../hooks/useTheme';
import heroImg from '@/assets/hero.webp';
import heroImg2 from '@/assets/Hero3.webp';

const marqueeTitles = [
  'Engineering Student', 'Poet', 'AI/ML Enthusiast', 'Passionate Creator',
  'Engineering Student', 'Poet', 'AI/ML Enthusiast', 'Passionate Creator',
];

export default function HomePage() {
  const { darkMode, toggleDarkMode } = useTheme();
  const [activeSection, setActiveSection] = useState('home');

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

    window.addEventListener('scroll', handleScroll, { passive: true });
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

  const heroImage = heroImg;

  return (
    <div className="page">
      <SEO
        title={seoData[activeSection as keyof typeof seoData].title}
        description={seoData[activeSection as keyof typeof seoData].description}
        url={seoData[activeSection as keyof typeof seoData].url}
      />

      <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <ChapterRail />

      <main>
        <Hero heroImage={heroImage} hoverHeroImage={heroImg2} />

        <Marquee items={marqueeTitles} />

        <About />
        <Skills />
        <Projects />
        <Record />
        <Verse />
        <Contact />
      </main>

      <Footer />
    </div>
  );
}
