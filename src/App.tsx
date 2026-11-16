import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CaseStudy from './pages/CaseStudy';
import NotFound from './pages/NotFound';
import { Poetry } from './components/Poetry';
import { MagneticCursor } from './components/MagneticCursor';
import { ScrollToTop } from './components/ScrollToTop';
import { Loader } from './components/Loader';
import { RouteCurtain, ScrollProgress, ROUTE_HOLD, routeArea } from './components/Kinetic';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence, MotionConfig } from 'motion/react';
import { useTheme } from './hooks/useTheme';
import { scrollToTarget, startSmoothScroll } from './utils/scroll';
import { attachSounds } from './utils/sound';

const LOADER_SEEN_KEY = 'loader-seen';

// The loader plays once per browser session; later page loads go straight in
function shouldShowLoader() {
  try {
    return sessionStorage.getItem(LOADER_SEEN_KEY) === null;
  } catch {
    return true;
  }
}

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(shouldShowLoader);

  // Theme is initialised by useTheme on mount
  useTheme();

  useEffect(() => {
    if (!isLoading) return;
    const timer = setTimeout(() => {
      setIsLoading(false);
      try {
        sessionStorage.setItem(LOADER_SEEN_KEY, '1');
      } catch {
        // storage unavailable: the loader simply shows again next time
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [isLoading]);

  useEffect(() => {
    const stopScroll = startSmoothScroll();
    const stopSounds = attachSounds();
    return () => {
      stopScroll();
      stopSounds();
    };
  }, []);

  return (
    // reducedMotion="user": people who ask their system for less motion get fades instead of movement
    <MotionConfig reducedMotion="user">
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
            <ScrollProgress />
            <ScrollToTop />
            <RouteCurtain />
            {/* The outgoing page is held in place until the curtain has closed over it */}
            <AnimatePresence mode="wait" onExitComplete={() => scrollToTarget(0, { immediate: true })}>
              <motion.div
                key={routeArea(location.pathname)}
                exit={{ opacity: 0, transition: { duration: 0.01, delay: ROUTE_HOLD } }}
              >
                <Routes location={location}>
                  <Route path="/" element={<HomePage />} />
                  {/* one route for the index and an open poem, so opening a poem never remounts the page */}
                  <Route path="/poetry/:slug?" element={<Poetry onClose={() => navigate('/')} />} />
                  <Route path="/work/:slug" element={<CaseStudy />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </MotionConfig>
  );
}
