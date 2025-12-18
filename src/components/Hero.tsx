import { motion } from 'motion/react';
import { ChevronDown, Mail, Github, Linkedin } from 'lucide-react';
import { useState, useEffect } from 'react';

interface HeroProps {
  heroImage: string;
}

export function Hero({ heroImage }: HeroProps) {
  const titles = [
    'Engineering Student',
    'Poet',
    'AI/ML Enthusiast',
    'Passionate Creator',
  ];

  const [currentTitleIndex, setCurrentTitleIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(150);

  useEffect(() => {
    const currentTitle = titles[currentTitleIndex];

    const handleTyping = () => {
      if (!isDeleting) {
        // Typing
        if (displayedText.length < currentTitle.length) {
          setDisplayedText(currentTitle.substring(0, displayedText.length + 1));
          setTypingSpeed(150);
        } else {
          // Finished typing, wait then start deleting
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        // Deleting
        if (displayedText.length > 0) {
          setDisplayedText(currentTitle.substring(0, displayedText.length - 1));
          setTypingSpeed(100);
        } else {
          // Finished deleting, move to next title
          setIsDeleting(false);
          setCurrentTitleIndex((prev) => (prev + 1) % titles.length);
        }
      }
    };

    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [displayedText, isDeleting, currentTitleIndex, typingSpeed, titles]);

  const scrollToAbout = () => {
    const element = document.getElementById('about');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Diagonal Split Background */}
      <div className="absolute inset-0">
        {/* Light side (left) */}
        <div className="absolute inset-0 bg-[#D7D7D7]" />
        
        {/* Black side with diagonal cut (right) */}
        <div 
          className="absolute top-0 right-0 h-full bg-black"
          style={{
            width: '100%',
            clipPath: 'polygon(55% 0, 100% 0, 100% 100%, 35% 100%)'
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 relative z-10 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Text Content - Left Side (Light background) */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative z-20 md:pr-8"
          >
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-black mb-2 text-sm md:text-base tracking-wide"
            >
              Hi, I am
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-2 text-black text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-tight"
              style={{ fontFamily: '"Permanent Marker", cursive' }}
            >
              Nitesh Joshi
            </motion.h1>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mb-8 md:mb-12 text-lg md:text-xl h-8 flex items-center"
            >
              <h3 className="text-black/60 font-light">
                {displayedText}
                <span className="animate-pulse">|</span>
              </h3>
            </motion.div>
          </motion.div>

          {/* Image - Right Side (Black background) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative z-20 flex justify-center md:justify-end"
          >
            <div className="relative w-full max-w-lg md:max-w-xl lg:max-w-2xl xl:max-w-3xl">
              <img
                src={heroImage}
                alt="Nitesh Joshi - Profile"
                className="w-full h-auto object-contain rounded-2xl"
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Social Icons - Bottom Left Vertical */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.8 }}
        className="absolute bottom-8 left-6 md:left-10 flex flex-col gap-6 z-20"
      >
        <a href="mailto:niteshjoshi010@icloud.com" aria-label="Email">
          <motion.div
            whileHover={{ scale: 1.15, x: 5 }}
            whileTap={{ scale: 0.95 }}
            className="w-16 h-16 md:w-18 md:h-18 rounded-full bg-black/15 hover:bg-black text-black hover:text-white flex items-center justify-center transition-colors cursor-pointer backdrop-blur-sm shadow-lg"
          >
            <Mail size={26} className="md:w-7 md:h-7" />
          </motion.div>
        </a>
        <a href="https://github.com/Niteshh-DeV" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
          <motion.div
            whileHover={{ scale: 1.15, x: 5 }}
            whileTap={{ scale: 0.95 }}
            className="w-16 h-16 md:w-18 md:h-18 rounded-full bg-black/15 hover:bg-black text-black hover:text-white flex items-center justify-center transition-colors cursor-pointer backdrop-blur-sm shadow-lg"
          >
            <Github size={26} className="md:w-7 md:h-7" />
          </motion.div>
        </a>
        <a href="https://linkedin.com/in/niteshjoshi" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
          <motion.div
            whileHover={{ scale: 1.15, x: 5 }}
            whileTap={{ scale: 0.95 }}
            className="w-16 h-16 md:w-18 md:h-18 rounded-full bg-black/15 hover:bg-black text-black hover:text-white flex items-center justify-center transition-colors cursor-pointer backdrop-blur-sm shadow-lg"
          >
            <Linkedin size={26} className="md:w-7 md:h-7" />
          </motion.div>
        </a>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 10, 0] }}
        transition={{
          opacity: { delay: 1 },
          y: { duration: 2, repeat: Infinity }
        }}
        onClick={scrollToAbout}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-black/10 p-3 rounded-full hover:bg-black/20 transition-colors"
        aria-label="Scroll to about section"
      >
        <ChevronDown size={32} className="text-black" />
      </motion.button>
    </section>
  );
}