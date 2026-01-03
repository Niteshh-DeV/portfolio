import { useState, useEffect } from 'react';
import { Moon, Sun, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import heroLogo from '@/assets/Krishna.jpeg';

interface NavbarProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

export function Navbar({ darkMode, toggleDarkMode }: NavbarProps) {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = ['About', 'Skills', 'Projects', 'Poetry', 'Contact'];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (section: string) => {
    if (section === 'Poetry') {
      navigate('/poetry');
      setIsMobileMenuOpen(false);
      return;
    }

    // Ensure we are on home, then scroll to the section
    navigate('/');
    setIsMobileMenuOpen(false);

    setTimeout(() => {
      const element = document.getElementById(section.toLowerCase());
      if (!element) return;

      const navbarHeight = 64;
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - navbarHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }, 300);
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'glass-effect shadow-lg' : 'bg-[rgb(var(--background))]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="cursor-pointer"
            onClick={() => {
              navigate('/');
              setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 150);
            }}
          >
            <div className="flex items-center gap-2">
              <img
                src={heroLogo}
                alt="Nitesh logo"
                className="w-auto h-12 rounded-md object-cover"
              />
              <span className="text-5.5xl font-bold" style={{ fontFamily: '"Orbitron", sans-serif' }}>
                NITESH<span style={{ color: '#ff6b35' }}>.DEV</span>
              </span>
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item, index) => (
              <motion.button
                key={item}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0, color: 'rgb(var(--foreground))' }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
                whileHover={{ y: -2, color: '#ff6b35' }}
                onClick={() => scrollToSection(item)}
                className="uppercase tracking-wider font-semibold text-sm"
                style={{ fontFamily: '"Orbitron", sans-serif' }}
              >
                {item}
              </motion.button>
            ))}
            <motion.button
              whileHover={{ scale: 1.1, rotate: 180 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleDarkMode}
              className="p-2 rounded-none bg-[rgb(var(--foreground))] text-[rgb(var(--background))] hover:bg-[rgb(var(--secondary))] transition-colors"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleDarkMode}
              className="p-2 rounded-none bg-[rgb(var(--foreground))] text-[rgb(var(--background))]"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </motion.button>
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-effect"
          >
            <div className="px-4 pt-2 pb-4 space-y-2">
              {navItems.map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item)}
                  className="block w-full text-left px-4 py-2 hover:bg-[rgb(var(--muted))] hover:text-[#ff6b35] rounded-none transition-all duration-300 uppercase tracking-wider font-semibold"
                  style={{ fontFamily: '"Orbitron", sans-serif' }}
                >
                  {item}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}