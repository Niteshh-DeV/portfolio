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
        
        {/* Black side with diagonal cut (right) - Hidden on mobile */}
        <div 
          className="hidden md:block absolute top-0 right-0 h-full bg-black"
          style={{
            width: '55%',
            clipPath: 'polygon(15% 0, 100% 0, 100% 100%, 0% 100%)'
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 relative z-10 w-full">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Text Content - Left Side (Light background) */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative z-20"
          >
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-black/60 mb-4 text-lg"
            >
              Hi, I am
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-4 text-black text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold"
            >
              Nitesh Joshi
            </motion.h1>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mb-6 md:mb-8 text-base sm:text-lg md:text-xl h-7 md:h-8 flex items-center"
            >
              <h3 className="text-black/60">
                {displayedText}
                <span className="animate-pulse">|</span>
              </h3>
            </motion.div>

            {/* Social Icons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex gap-3 md:gap-4 mb-6 md:mb-8"
            >
              <a href="mailto:niteshjoshi010@icloud.com">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-12 h-12 rounded-full bg-black/10 hover:bg-black hover:text-white flex items-center justify-center transition-all"
                >
                  <Mail size={20} />
                </motion.button>
              </a>
              <a href="https://github.com/Niteshh-DeV" target="_blank" rel="noopener noreferrer">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-12 h-12 rounded-full bg-black/10 hover:bg-black hover:text-white flex items-center justify-center transition-all"
                >
                  <Github size={20} />
                </motion.button>
              </a>
              <a href="https://linkedin.com/in/niteshjoshi" target="_blank" rel="noopener noreferrer">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-12 h-12 rounded-full bg-black/10 hover:bg-black hover:text-white flex items-center justify-center transition-all"
                >
                  <Linkedin size={20} />
                </motion.button>
              </a>
            </motion.div>
          </motion.div>

          {/* Image - Right Side (Black background) - NO ANIMATION */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative z-20 flex justify-center md:justify-end order-first md:order-last"
          >
            <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-lg lg:max-w-xl">
              <img
                src={heroImage}
                alt="Profile"
                className="w-full h-auto object-cover rounded-lg shadow-lg"
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 10, 0] }}
        transition={{
          opacity: { delay: 1 },
          y: { duration: 2, repeat: Infinity }
        }}
        onClick={scrollToAbout}
        className="absolute bottom-4 md:bottom-8 left-1/2 transform -translate-x-1/2 bg-black/10 p-2 md:p-3 rounded-full hover:bg-black/20 transition-colors"
      >
        <ChevronDown size={24} className="text-black md:w-8 md:h-8" />
      </motion.button>
    </section>
  );
}