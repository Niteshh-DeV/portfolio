import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect, useMemo } from 'react';
import { Quote, Heart, X, ChevronDown, Share2 } from 'lucide-react';
import { Navbar } from './Navbar';
import { SEO } from './SEO';
import heroLogo from '@/assets/Krishna.jpeg';
import { fetchLikes, incrementLike, decrementLike } from '@/utils/poetryApi';
import { poems as poemsData } from '@/data/poems';

interface PoetryProps {
  onClose?: () => void;
}
export function Poetry({}: PoetryProps) {
  const [darkMode, setDarkMode] = useState(true);
  const [liked, setLiked] = useState<number[]>([]);
  const [likeCounts, setLikeCounts] = useState<number[]>([]);
  const [showAll, setShowAll] = useState(false);
  const [selectedPoem, setSelectedPoem] = useState<number | null>(null);
  const [shareStatus, setShareStatus] = useState<string | null>(null);

  const toSlug = (title: string, index: number) => {
    const base = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') || 'poem';
    return `${base}-${index + 1}`;
  };

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

  const poems = useMemo(() => poemsData, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Load user's liked poems from localStorage (client-side preference)
    const storedLiked = localStorage.getItem('poetry-liked');
    setLiked(storedLiked ? JSON.parse(storedLiked) : []);

    // Fetch like counts from backend API
    const loadLikes = async () => {
      try {
        const likesData = await fetchLikes();
        const normalizedCounts = poems.map((_, idx) => likesData[idx] ?? 0);
        setLikeCounts(normalizedCounts);
      } catch (error) {
        console.error('Failed to load likes:', error);
        // Fallback to empty counts if API fails
        setLikeCounts(poems.map(() => 0));
      }
    };

    loadLikes();
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const slug = params.get('poem');

    if (!slug) return;

    const matchedIndex = poems.findIndex((poem, idx) => toSlug(poem.title, idx) === slug);
    if (matchedIndex >= 0) {
      setSelectedPoem(matchedIndex);
      const targetCard = document.getElementById(`poem-${matchedIndex}`);
      targetCard?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    // Save user's liked poems to localStorage (client-side preference only)
    localStorage.setItem('poetry-liked', JSON.stringify(liked));
  }, [liked]);

  const openPoem = (index: number) => {
    setSelectedPoem(index);
    if (typeof window === 'undefined') return;

    const url = new URL(window.location.href);
    url.searchParams.set('poem', toSlug(poems[index].title, index));
    window.history.replaceState({}, '', url.toString());
  };

  const closePoem = () => {
    setSelectedPoem(null);
    if (typeof window === 'undefined') return;

    const url = new URL(window.location.href);
    url.searchParams.delete('poem');
    window.history.replaceState({}, '', url.toString());
  };

  const showShareStatus = (message: string) => {
    setShareStatus(message);
    setTimeout(() => setShareStatus(null), 2200);
  };

  const sharePoem = async (index: number) => {
    if (typeof window === 'undefined') return;

    const slug = toSlug(poems[index].title, index);
    const url = new URL(window.location.href);
    url.searchParams.set('poem', slug);
    const shareUrl = url.toString();

    try {
      if (navigator.share) {
        await navigator.share({
          title: poems[index].title,
          text: 'Read this poem',
          url: shareUrl
        });
        showShareStatus('Shared');
      } else if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareUrl);
        showShareStatus('Link copied');
      } else {
        showShareStatus('Copy not supported');
      }
    } catch (error) {
      console.error('Share failed:', error);
      showShareStatus('Share failed');
    }
  };

  const highlightedPoems = useMemo(() => poems.slice(0, 6), [poems]);
  const morePoems = useMemo(() => poems.slice(6), [poems]);
  const displayedPoems = showAll ? poems : highlightedPoems;

  const toggleLike = async (index: number) => {
    const alreadyLiked = liked.includes(index);
    
    // Optimistically update UI
    setLiked(prev => {
      return alreadyLiked ? prev.filter(i => i !== index) : [...prev, index];
    });

    setLikeCounts(prevCounts => {
      const nextCounts = prevCounts.length ? [...prevCounts] : poems.map(() => 0);
      const nextValue = (nextCounts[index] ?? 0) + (alreadyLiked ? -1 : 1);
      nextCounts[index] = Math.max(0, nextValue);
      return nextCounts;
    });

    // Update backend
    try {
      if (alreadyLiked) {
        const newCount = await decrementLike(index);
        setLikeCounts(prevCounts => {
          const updated = [...prevCounts];
          updated[index] = newCount;
          return updated;
        });
      } else {
        const newCount = await incrementLike(index);
        setLikeCounts(prevCounts => {
          const updated = [...prevCounts];
          updated[index] = newCount;
          return updated;
        });
      }
    } catch (error) {
      console.error('Failed to update like:', error);
      // Show user-friendly error message
      alert('Failed to update like. Please check your connection and try again.');
      // Revert optimistic update on error
      setLiked(prev => {
        return alreadyLiked ? [...prev, index] : prev.filter(i => i !== index);
      });
      setLikeCounts(prevCounts => {
        const nextCounts = [...prevCounts];
        const nextValue = (nextCounts[index] ?? 0) + (alreadyLiked ? 1 : -1);
        nextCounts[index] = Math.max(0, nextValue);
        return nextCounts;
      });
    }
  };

  const getSnippet = (lines: string[]) => {
    return lines.filter(line => line !== '').slice(0, 3);
  };

  return (
    <div className="relative min-h-screen bg-[rgb(var(--background))] overflow-hidden">
      <SEO 
        title="Poetry | Nitesh Joshi"
        description="Explore Nitesh Joshi's collection of heartfelt poems and verses. Discover poetry about love, life, and personal reflections."
        url="https://niteshjoshi.me/poetry"
        type="article"
      />
      <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

      {/* Spacer to clear the fixed navbar */}
      <div className="h-20 md:h-24" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-0 pb-28 md:pb-36">
        <div className="flex flex-col items-center text-center gap-4 mb-16">
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="flex items-center gap-2 cursor-pointer select-none"
            onClick={() => (window.location.href = '/')}
          >
            <img
              src={heroLogo}
              alt="Nitesh logo"
              className="w-auto h-12 rounded-md object-cover"
            />
            <span className="text-5.5xl font-bold" style={{ fontFamily: '"Orbitron", sans-serif' }}>
              Nitesh<span style={{ color: '#ff6b35' }}>.Dev</span>
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl font-semibold tracking-tight"
          >
            Poems
          </motion.h1>
          <motion.h2
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="text-lg md:text-xl text-[rgb(var(--muted-foreground))]"
          >
            Where code meets feelings.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-sm md:text-base text-[rgb(var(--muted-foreground))] max-w-xl text-center leading-relaxed"
          >
            A dedicated space for the verses, memories, and quiet thoughts. Lean back, scroll slow, and tap to read in full.
          </motion.p>
        </div>

          {/* Poems Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 auto-rows-fr">
            {displayedPoems.map((poem, poemIndex) => {
                const likeCount = likeCounts[poemIndex] ?? 0;
                const slug = toSlug(poem.title, poemIndex);

                return (
                  <motion.div
                    id={`poem-${poemIndex}`}
                    key={slug}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, ease: [0.43, 0.13, 0.23, 0.96] }}
                    whileHover={{ scale: 1.15, zIndex: 10 }}
                    onClick={() => openPoem(poemIndex)}
                    className="relative group cursor-pointer z-0 hover:z-10 h-full"
                  >
                  <motion.div 
                    className="glass-effect p-6 rounded-lg border-2 border-[rgb(var(--border))] group-hover:border-[rgb(var(--foreground))] transition-all shadow-lg shadow-[rgba(0,0,0,0.06)] h-full flex flex-col"
                    whileHover={{
                      boxShadow: '0 25px 50px -12px rgba(255, 255, 255, 0.25)'
                    }}
                    transition={{ duration: 0.35, ease: [0.43, 0.13, 0.23, 0.96] }}
                  >
                  {/* Glow effect on hover - same as hero image */}
                  <motion.div
                    className="absolute inset-0 rounded-lg pointer-events-none"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 0.3 }}
                    transition={{ duration: 0.6 }}
                    style={{
                      background: 'radial-gradient(circle at center, rgba(255,255,255,0.2) 0%, transparent 70%)',
                    }}
                  />
                  
                  <Quote className="absolute top-4 right-4 text-[rgb(var(--foreground))] opacity-10 group-hover:opacity-30 transition-opacity" size={32} />
                  
                  <h4 className="mb-2 uppercase tracking-wider text-sm">{poem.title}</h4>
                  <p className="text-[rgb(var(--muted-foreground))] text-xs mb-4">{poem.date}</p>
                  
                  {/* Snippet Preview */}
                  <div className="space-y-2 mb-4 font-['Raleway',sans-serif] italic flex-grow">
                    {getSnippet(poem.lines).map((line, lineIndex) => (
                      <p key={lineIndex} className="text-sm leading-relaxed text-[rgb(var(--muted-foreground))]">
                        {line}
                      </p>
                    ))}
                    <p className="text-xs text-[rgb(var(--foreground))] opacity-60 mt-3">
                      Click to read full poem →
                    </p>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleLike(poemIndex);
                    }}
                    className="flex items-center gap-2 mt-auto"
                  >
                    <Heart
                      size={18}
                      className={`transition-colors ${
                        liked.includes(poemIndex)
                          ? 'fill-[rgb(var(--foreground))] text-[rgb(var(--foreground))]'
                          : 'text-[rgb(var(--muted-foreground))]'
                      }`}
                    />
                    <span className="text-xs text-[rgb(var(--muted-foreground))]">
                      {liked.includes(poemIndex) ? 'Liked' : 'Like'} - {likeCount}
                    </span>
                  </motion.button>
                  </motion.div>
                  </motion.div>
                );
              })}
        </div>

              {/* Read More Button */}
              {!showAll && morePoems.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="mt-12 mb-16 text-center"
                >
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowAll(true)}
                    className="px-8 py-3 bg-[rgb(var(--foreground))] text-[rgb(var(--background))] rounded-lg hover:bg-[rgb(var(--secondary))] transition-all flex items-center gap-2 mx-auto shadow-lg shadow-[rgba(0,0,0,0.08)]"
                  >
                    Read More Poems
                    <ChevronDown size={20} />
                  </motion.button>
                </motion.div>
              )}

              {showAll && (
                <div className="mt-12 mb-16 text-center">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowAll(false)}
                    className="px-8 py-3 bg-[rgb(var(--muted))] text-[rgb(var(--foreground))] rounded-lg border border-[rgb(var(--border))] hover:bg-[rgb(var(--foreground))] hover:text-[rgb(var(--background))] transition-all flex items-center gap-2 mx-auto shadow-lg shadow-[rgba(0,0,0,0.08)]"
                  >
                    Show Less
                  </motion.button>
                </div>
              )}

            </div>
            {/* Full Poem View */}
            <AnimatePresence>
              {selectedPoem !== null && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/90 backdrop-blur-md z-[60] flex items-center justify-center p-4"
                  onClick={closePoem}
                >
                  <div className="pointer-events-none absolute inset-0">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.2),_transparent_70%)] blur-3xl opacity-80" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_35%_45%,_rgba(255,255,255,0.1),_transparent_60%)] blur-3xl opacity-70" />
                  </div>
                  <motion.div
                    initial={{ scale: 0.92, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.92, opacity: 0, y: 20 }}
                    transition={{ type: 'spring', damping: 18 }}
                    className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Glow effect behind the card */}
                    <div 
                      className="absolute inset-0 rounded-2xl pointer-events-none opacity-30 blur-2xl"
                      style={{
                        background: 'radial-gradient(circle at center, rgba(255,255,255,0.25) 0%, transparent 70%)',
                      }}
                    />
                    <div className="relative bg-[rgb(var(--background))] rounded-2xl border-2 border-[rgb(var(--border))] p-12 md:p-14 shadow-2xl">

                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.08, rotate: 90 }}
                        whileTap={{ scale: 0.92 }}
                        onClick={closePoem}
                        className="absolute top-4 right-4 md:top-5 md:right-5 z-20 p-2 bg-[rgb(var(--foreground))] text-[rgb(var(--background))] rounded-full hover:bg-[rgb(var(--secondary))] transition-colors"
                      >
                        <X size={20} />
                      </motion.button>

                      <Quote className="absolute top-5 left-5 text-[rgb(var(--foreground))] opacity-10" size={48} />

                      <motion.div
                        initial={{ opacity: 0, y: -16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 }}
                        className="text-center mb-10"
                      >
                        <h2 className="mb-2 uppercase tracking-wider">{poems[selectedPoem].title}</h2>
                        <p className="text-[rgb(var(--muted-foreground))] text-sm">{poems[selectedPoem].date}</p>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="mt-6 space-y-4 mb-8 font-['Raleway',sans-serif] max-w-xl mx-auto"
                      >
                        {poems[selectedPoem].lines.map((line, lineIndex) => (
                          <motion.p
                            key={lineIndex}
                            initial={{ opacity: 0, x: -14 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.35 + lineIndex * 0.08 }}
                            className={line === '' ? 'h-4' : 'text-center italic leading-relaxed'}
                          >
                            {line}
                          </motion.p>
                        ))}
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="flex flex-col items-center gap-3"
                      >
                        <div className="flex flex-wrap justify-center gap-3">
                          <motion.button
                            whileHover={{ scale: 1.06 }}
                            whileTap={{ scale: 0.94 }}
                            onClick={() => toggleLike(selectedPoem)}
                            className="flex items-center gap-3 px-6 py-3 bg-[rgb(var(--muted))] rounded-full border border-[rgb(var(--border))] hover:bg-[rgb(var(--foreground))] hover:text-[rgb(var(--background))] transition-all shadow-lg shadow-[rgba(0,0,0,0.12)]"
                          >
                            <Heart
                              size={20}
                              className={`transition-colors ${
                                liked.includes(selectedPoem)
                                  ? 'fill-[rgb(var(--foreground))] text-[rgb(var(--foreground))]'
                                  : ''
                              }`}
                            />
                            <span className="text-sm">
                              {liked.includes(selectedPoem) ? 'Liked' : 'Like this poem'} - {likeCounts[selectedPoem] ?? 0}
                            </span>
                          </motion.button>

                          <motion.button
                            whileHover={{ scale: 1.06 }}
                            whileTap={{ scale: 0.94 }}
                            onClick={() => sharePoem(selectedPoem)}
                            className="flex items-center gap-2 px-6 py-3 bg-[rgb(var(--background))] rounded-full border border-[rgb(var(--border))] hover:bg-[rgb(var(--muted))] transition-all shadow-lg shadow-[rgba(0,0,0,0.12)]"
                          >
                            <Share2 size={18} />
                            <span className="text-sm">Share link</span>
                          </motion.button>
                        </div>

                        {shareStatus && (
                          <p className="text-xs text-[rgb(var(--muted-foreground))]">{shareStatus}</p>
                        )}
                      </motion.div>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

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
