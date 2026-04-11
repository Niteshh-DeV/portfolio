import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import { Poetry } from './components/Poetry';
import { MagneticCursor } from './components/MagneticCursor';
import { ScrollToTop } from './components/ScrollToTop';
import { Loader } from './components/Loader';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme } from './hooks/useTheme';

export default function App() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  // Theme is initialised by useTheme on mount
  useTheme();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isLoading ? (
        <Loader key="loader" />
      ) : (
        <motion.div
          key="content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="h-full"
        >
          <MagneticCursor />
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/poetry" element={<Poetry onClose={() => navigate('/')} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </motion.div>
      )}
    </AnimatePresence>
  );
}