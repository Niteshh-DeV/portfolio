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
  const [isImageExpanded, setIsImageExpanded] = useState(false);
  const [hoveredIcon, setHoveredIcon] = useState<string | null>(null);

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
      const navbarHeight = 64;
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - navbarHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Smooth Dark Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-800" />
      
      {/* Subtle overlay pattern */}
      <div className="absolute inset-0 opacity-10" 
        style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-20 relative z-10 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative z-20 md:pr-8 order-2 md:order-1"
          >
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-gray-300 mb-2 text-sm md:text-base tracking-wide"
            >
              Hi, I am
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-2 text-white drop-shadow-lg text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold leading-tight"
              style={{ 
                fontFamily: '"Permanent Marker", cursive',
                textShadow: '0 4px 6px rgba(0, 0, 0, 0.4)'
              }}
            >
              Nitesh Joshi
            </motion.h1>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mb-8 md:mb-12 text-base md:text-xl h-8 flex items-center"
            >
              <h3 className="text-gray-400 font-light">
                {displayedText}
                <span className="animate-pulse">|</span>
              </h3>
            </motion.div>
          </motion.div>

          {/* Image with Expand Effect */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative z-20 flex justify-center md:justify-end order-1 md:order-2"
            onMouseEnter={() => setIsImageExpanded(true)}
            onMouseLeave={() => setIsImageExpanded(false)}
          >
            <motion.div 
              className="relative w-64 sm:w-80 md:w-full md:max-w-xl lg:max-w-2xl xl:max-w-3xl cursor-pointer"
              animate={{
                scale: isImageExpanded ? 1.15 : 1,
                z: isImageExpanded ? 50 : 0,
              }}
              transition={{ 
                duration: 0.6,
                ease: [0.43, 0.13, 0.23, 0.96]
              }}
            >
              <motion.img
                src={heroImage}
                alt="Nitesh Joshi - Profile"
                className="w-full h-auto object-contain rounded-2xl"
                animate={{
                  boxShadow: isImageExpanded 
                    ? '0 25px 50px -12px rgba(255, 255, 255, 0.25)' 
                    : '0 20px 25px -5px rgba(0, 0, 0, 0.5)'
                }}
                transition={{ duration: 0.6 }}
              />
              
              {/* Glow effect on hover */}
              <motion.div
                className="absolute inset-0 rounded-2xl pointer-events-none"
                animate={{
                  opacity: isImageExpanded ? 0.3 : 0,
                }}
                transition={{ duration: 0.6 }}
                style={{
                  background: 'radial-gradient(circle at center, rgba(255,255,255,0.2) 0%, transparent 70%)',
                }}
              />
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Social Icons - Bottom Left Vertical (hidden on mobile to avoid overlap) */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.8 }}
        className="hidden md:flex absolute bottom-8 left-6 md:left-10 flex-col gap-6 z-20"
      >
        <a href="mailto:niteshjoshi010@icloud.com" aria-label="Email">
          <motion.div
            whileHover={{ scale: 1.15, x: 5 }}
            whileTap={{ scale: 0.95 }}
            onMouseEnter={() => setHoveredIcon('email')}
            onMouseLeave={() => setHoveredIcon(null)}
            animate={{
              backgroundColor: hoveredIcon === 'email' ? 'rgba(255, 255, 255, 1)' : 'rgba(255, 255, 255, 0.1)'
            }}
            transition={{ duration: 0.3 }}
            className="w-16 h-16 md:w-18 md:h-18 rounded-full flex items-center justify-center cursor-pointer backdrop-blur-sm shadow-lg border border-white/20"
          >
            <motion.div
              animate={{
                color: hoveredIcon === 'email' ? '#000000' : '#ffffff'
              }}
              transition={{ duration: 0.3 }}
            >
              <Mail size={26} className="md:w-7 md:h-7" />
            </motion.div>
          </motion.div>
        </a>
        <a href="https://github.com/Niteshh-DeV" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
          <motion.div
            whileHover={{ scale: 1.15, x: 5 }}
            whileTap={{ scale: 0.95 }}
            onMouseEnter={() => setHoveredIcon('github')}
            onMouseLeave={() => setHoveredIcon(null)}
            animate={{
              backgroundColor: hoveredIcon === 'github' ? 'rgba(255, 255, 255, 1)' : 'rgba(255, 255, 255, 0.1)'
            }}
            transition={{ duration: 0.3 }}
            className="w-16 h-16 md:w-18 md:h-18 rounded-full flex items-center justify-center cursor-pointer backdrop-blur-sm shadow-lg border border-white/20"
          >
            <motion.div
              animate={{
                color: hoveredIcon === 'github' ? '#000000' : '#ffffff'
              }}
              transition={{ duration: 0.3 }}
            >
              <Github size={26} className="md:w-7 md:h-7" />
            </motion.div>
          </motion.div>
        </a>
        <a href="https://linkedin.com/in/niteshjoshi" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
          <motion.div
            whileHover={{ scale: 1.15, x: 5 }}
            whileTap={{ scale: 0.95 }}
            onMouseEnter={() => setHoveredIcon('linkedin')}
            onMouseLeave={() => setHoveredIcon(null)}
            animate={{
              backgroundColor: hoveredIcon === 'linkedin' ? 'rgba(255, 255, 255, 1)' : 'rgba(255, 255, 255, 0.1)'
            }}
            transition={{ duration: 0.3 }}
            className="w-16 h-16 md:w-18 md:h-18 rounded-full flex items-center justify-center cursor-pointer backdrop-blur-sm shadow-lg border border-white/20"
          >
            <motion.div
              animate={{
                color: hoveredIcon === 'linkedin' ? '#000000' : '#ffffff'
              }}
              transition={{ duration: 0.3 }}
            >
              <Linkedin size={26} className="md:w-7 md:h-7" />
            </motion.div>
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
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-white/10 p-3 rounded-full hover:bg-white/20 transition-colors z-20 border border-white/20"
        aria-label="Scroll to about section"
      >
        <ChevronDown size={32} className="text-white" />
      </motion.button>
    </section>
  );
}
