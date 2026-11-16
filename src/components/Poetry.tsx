import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect, useMemo, useRef, useCallback, Fragment } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { toast } from 'sonner';
import { Navbar } from './Navbar';
import { SEO } from './SEO';
import { Footer } from './Footer';
import { EASE } from './Reveal';
import heroLogo from '@/assets/Krishna.webp';
import { fetchLikes, incrementLike, decrementLike, migrateLikes } from '@/utils/poetryApi';
import { poems as poemsData } from '@/data/poems';
import { parseDateValue, poemHeading, poemLines, poemSlug, poemYear } from '@/utils/poems';
import { lockScroll } from '@/utils/scroll';
import { playTone } from '@/utils/sound';
import { useHaptic } from '@/hooks/useHaptic';
import { useTheme } from '@/hooks/useTheme';

interface PoetryProps {
  onClose?: () => void;
}

/** Play/pause for a poem that has a recorded reading (`audio` in the poem data). */
function Reading({ src }: { src: string }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) void audio.play();
    else audio.pause();
  };

  return (
    <div className="reading">
      <audio
        ref={audioRef}
        src={src}
        preload="none"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setProgress(0)}
        onTimeUpdate={(e) => {
          const { currentTime, duration } = e.currentTarget;
          setProgress(duration ? currentTime / duration : 0);
        }}
      />
      <button type="button" className="link" onClick={toggle} aria-pressed={playing}>
        {playing ? 'Pause' : 'Listen'} <span className="link__arrow">{playing ? '❙❙' : '▶'}</span>
      </button>
      <span className="reading__bar" aria-hidden="true">
        <i style={{ transform: `scaleX(${progress})` }} />
      </span>
      <span className="label">Read by the author</span>
    </div>
  );
}

export function Poetry({}: PoetryProps) {
  const { darkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();
  const { slug: routeSlug } = useParams();
  const [liked, setLiked] = useState<string[]>([]);
  const [likeCounts, setLikeCounts] = useState<number[]>([]);
  const [shareStatus, setShareStatus] = useState<string | null>(null);
  const [viewVersion, setViewVersion] = useState<'lines' | 'image' | 'altImage'>('lines');
  const [isLoadingLikes, setIsLoadingLikes] = useState(true);
  const [activeYear, setActiveYear] = useState('All');
  const likeDebounceRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());
  const { triggerHaptic } = useHaptic();

  const toLikeId = (id: number) => `poem-${id}`;

  const toLegacyLikeId = (title: string, date: string) => {
    const base = `${title}-${date}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') || 'poem';
    return base;
  };

  // keep base poems (stable indices) for likes/migrations, but build a sorted display list
  const poems = useMemo(() => poemsData, []);

  const displayList = useMemo(() => {
    const list = poems.map((p, idx) => ({ poem: p, origIndex: idx }));
    list.sort((a, b) => parseDateValue(b.poem.date) - parseDateValue(a.poem.date));
    return list;
  }, [poems]);

  // The open poem lives in the URL: /poetry/<slug>
  const selectedPoem = useMemo(() => {
    if (!routeSlug) return null;
    const index = poems.findIndex((poem) => poemSlug(poem) === routeSlug);
    return index >= 0 ? index : null;
  }, [poems, routeSlug]);

  const getPoemIdByIndex = useCallback(
    (index: number) => toLikeId(poems[index].id),
    [poems]
  );

  const getKnownLikeIds = useCallback(
    (index: number) => {
      const poem = poems[index];
      if (!poem) return [];
      return [
        toLegacyLikeId(poem.title, poem.date),
        ...(poem.legacyDates ?? []).map((legacyDate) => toLegacyLikeId(poem.title, legacyDate)),
      ];
    },
    [poems]
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Load user's liked poems from localStorage (client-side preference)
    const storedLiked = localStorage.getItem('poetry-liked');
    if (storedLiked) {
      try {
        const parsed = JSON.parse(storedLiked);
        if (Array.isArray(parsed)) {
          const normalized = parsed
            .map((item) => {
              if (typeof item === 'string') {
                if (poems.some((poem) => toLikeId(poem.id) === item)) {
                  return item;
                }

                const legacyMatch = poems.find((_, index) => getKnownLikeIds(index).includes(item));
                if (legacyMatch) {
                  return toLikeId(legacyMatch.id);
                }

                return null;
              }

              if (typeof item === 'number' && poems[item]) {
                return toLikeId(poems[item].id);
              }

              return null;
            })
            .filter((item): item is string => Boolean(item));
          setLiked(Array.from(new Set(normalized)));
        } else {
          setLiked([]);
        }
      } catch {
        setLiked([]);
      }
    } else {
      setLiked([]);
    }

    const loadLikes = async () => {
      try {
        const likesData = await fetchLikes();
        const migrationMap: Record<string, number> = {};
        const removeKeys = new Set<string>();

        Object.entries(likesData).forEach(([key, rawCount]) => {
          const count = Number(rawCount) || 0;
          if (!count) return;

          if (/^\d+$/.test(key)) {
            const num = Number(key);
            // If the numeric key corresponds to a poem `id`, prefer that mapping (stable id storage)
            const poemById = poems.find((p) => p.id === num);
            if (poemById) {
              const poemId = toLikeId(poemById.id);
              migrationMap[poemId] = Math.max(migrationMap[poemId] ?? 0, count);
              removeKeys.add(key);
              return;
            }

            // Fallback: numeric key might be an old index-based key
            const index = num;
            if (!poems[index]) return;
            const poemId = toLikeId(poems[index].id);
            migrationMap[poemId] = Math.max(migrationMap[poemId] ?? 0, count);
            removeKeys.add(key);
            return;
          }

          const poemIndex = poems.findIndex(
            (poem, index) => toLikeId(poem.id) === key || getKnownLikeIds(index).includes(key)
          );

          if (poemIndex >= 0) {
            const poemId = toLikeId(poems[poemIndex].id);
            migrationMap[poemId] = Math.max(migrationMap[poemId] ?? 0, count);
            if (key !== poemId) {
              removeKeys.add(key);
            }
          }
        });

        if (Object.keys(migrationMap).length) {
          try {
            await migrateLikes(migrationMap, Array.from(removeKeys));
          } catch (error) {
            console.error('Failed to migrate likes:', error);
          }
        }

        const refreshed = Object.keys(migrationMap).length ? await fetchLikes() : likesData;
        const normalizedCounts = poems.map((poem) => refreshed[toLikeId(poem.id)] ?? 0);
        setLikeCounts(normalizedCounts);
      } catch (error) {
        console.error('Failed to load likes:', error);
        toast.error('Failed to load likes. Please refresh the page.');
        setLikeCounts(poems.map(() => 0));
      } finally {
        setIsLoadingLikes(false);
      }
    };

    loadLikes();
  }, [poems, getKnownLikeIds]);

  // Links shared before poems had their own pages used /poetry?poem=<slug>
  useEffect(() => {
    const legacySlug = new URLSearchParams(window.location.search).get('poem');
    if (legacySlug && poems.some((poem) => poemSlug(poem) === legacySlug)) {
      navigate(`/poetry/${legacySlug}`, { replace: true });
    } else if (routeSlug && !poems.some((poem) => poemSlug(poem) === routeSlug)) {
      navigate('/poetry', { replace: true });
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    // Save user's liked poems to localStorage (client-side preference only)
    localStorage.setItem('poetry-liked', JSON.stringify(liked));
  }, [liked]);

  // choose default view for the poem (prefer typed lines, then image)
  useEffect(() => {
    if (selectedPoem === null) return;
    const poem = poems[selectedPoem];
    if (poem.lines && poem.lines.length > 0) setViewVersion('lines');
    else if (poem.image) setViewVersion('image');
    else if (poem.altImage) setViewVersion('altImage');
  }, [selectedPoem, poems]);

  const openPoem = (index: number, { replace = false } = {}) => {
    playTone('page');
    navigate(`/poetry/${poemSlug(poems[index])}`, { replace });
  };

  const closePoem = () => {
    navigate('/poetry');
  };

  const showShareStatus = (message: string) => {
    setShareStatus(message);
    setTimeout(() => setShareStatus(null), 2200);
  };

  const openRandomPoem = () => {
    openPoem(Math.floor(Math.random() * poems.length));
  };

  const getTodaysPick = useCallback(() => {
    const today = new Date();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
    const pickIndex = dayOfYear % poems.length;
    return pickIndex;
  }, [poems.length]);

  const sharePoem = async (index: number) => {
    if (typeof window === 'undefined') return;

    const shareUrl = `${window.location.origin}/poetry/${poemSlug(poems[index])}`;

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

  const cycleVersion = (index: number) => {
    const poem = poems[index];
    if (!poem) return;
    const options: ('lines' | 'image' | 'altImage')[] = [];
    if (poem.lines && poem.lines.length > 0) options.push('lines');
    if (poem.image) options.push('image');
    if (poem.altImage) options.push('altImage');
    if (!options.length) return;
    const current = viewVersion;
    const idx = Math.max(0, options.indexOf(current));
    const next = options[(idx + 1) % options.length];
    setViewVersion(next);
  };

  const readerRef = useRef<HTMLDivElement>(null);
  const readerProgressRef = useRef<HTMLSpanElement>(null);

  const selectedPosition = selectedPoem === null ? -1 : displayList.findIndex((entry) => entry.origIndex === selectedPoem);

  // Move through the poems in the order the index lists them
  const stepPoem = (delta: number) => {
    if (selectedPosition < 0) return;
    const next = (selectedPosition + delta + displayList.length) % displayList.length;
    // replace, so Back leaves the reader instead of walking through every poem read
    openPoem(displayList[next].origIndex, { replace: true });
    readerRef.current?.scrollTo({ top: 0 });
    if (readerProgressRef.current) readerProgressRef.current.style.transform = 'scaleX(0)';
  };

  const updateReaderProgress = () => {
    const reader = readerRef.current;
    if (!reader || !readerProgressRef.current) return;
    const scrollable = reader.scrollHeight - reader.clientHeight;
    const progress = scrollable > 0 ? reader.scrollTop / scrollable : 0;
    readerProgressRef.current.style.transform = `scaleX(${progress.toFixed(4)})`;
  };

  // Reader overlay: lock the page behind it for as long as a poem is open
  const isReading = selectedPoem !== null;
  useEffect(() => {
    if (!isReading) return;
    return lockScroll();
  }, [isReading]);

  // Escape closes, arrow keys turn the page
  useEffect(() => {
    if (selectedPoem === null) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closePoem();
      if (e.key === 'ArrowRight') stepPoem(1);
      if (e.key === 'ArrowLeft') stepPoem(-1);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [selectedPoem]);

  const toggleLike = useCallback(async (index: number) => {
    const poemId = getPoemIdByIndex(index);
    // Clear any pending debounce for this poem
    const existingTimeout = likeDebounceRef.current.get(poemId);
    if (existingTimeout) {
      clearTimeout(existingTimeout);
      likeDebounceRef.current.delete(poemId);
    }

    const alreadyLiked = liked.includes(poemId);

    // Optimistically update UI
    setLiked(prev => {
      return alreadyLiked ? prev.filter(id => id !== poemId) : [...prev, poemId];
    });

    setLikeCounts(prevCounts => {
      const nextCounts = prevCounts.length ? [...prevCounts] : poems.map(() => 0);
      const nextValue = (nextCounts[index] ?? 0) + (alreadyLiked ? -1 : 1);
      nextCounts[index] = Math.max(0, nextValue);
      return nextCounts;
    });

    // Debounce backend update
    const timeout = setTimeout(async () => {
      try {
        if (alreadyLiked) {
          const newCount = await decrementLike(poemId);
          setLikeCounts(prevCounts => {
            const updated = [...prevCounts];
            updated[index] = newCount;
            return updated;
          });
        } else {
          const newCount = await incrementLike(poemId);
          setLikeCounts(prevCounts => {
            const updated = [...prevCounts];
            updated[index] = newCount;
            return updated;
          });
        }
      } catch (error) {
        console.error('Failed to update like:', error);
        toast.error('Failed to update like. Please check your connection.');
        // Revert optimistic update on error
        setLiked(prev => {
          return alreadyLiked ? [...prev, poemId] : prev.filter(id => id !== poemId);
        });
        setLikeCounts(prevCounts => {
          const nextCounts = [...prevCounts];
          const nextValue = (nextCounts[index] ?? 0) + (alreadyLiked ? 1 : -1);
          nextCounts[index] = Math.max(0, nextValue);
          return nextCounts;
        });
      } finally {
        likeDebounceRef.current.delete(poemId);
      }
    }, 300);

    likeDebounceRef.current.set(poemId, timeout);
  }, [liked, poems, getPoemIdByIndex]);

  const formatCount = (index: number) => (isLoadingLikes ? '—' : String(likeCounts[index] ?? 0));

  // Collections: the poems grouped by the year they were written
  const years = useMemo(() => {
    const counts = new Map<string, number>();
    displayList.forEach(({ poem }) => counts.set(poemYear(poem), (counts.get(poemYear(poem)) ?? 0) + 1));
    return Array.from(counts, ([year, count]) => ({ year, count }));
  }, [displayList]);

  const visibleList = activeYear === 'All' ? displayList : displayList.filter(({ poem }) => poemYear(poem) === activeYear);

  const current = selectedPoem === null ? null : poems[selectedPoem];
  const currentLines = current ? poemLines(current) : [];

  return (
    <div className="page">
      {current ? (
        <SEO
          title={`${poemHeading(current).heading} — a poem by Nitesh Joshi`}
          description={currentLines.slice(0, 3).join(' / ') || `A handwritten poem by Nitesh Joshi, ${current.date}.`}
          url={`https://niteshjoshi.me/poetry/${poemSlug(current)}`}
          image={`https://niteshjoshi.me/og/${poemSlug(current)}.jpg`}
          type="article"
        />
      ) : (
        <SEO
          title="Poetry | Nitesh Joshi"
          description="Explore Nitesh Joshi's collection of heartfelt poems and verses. Discover poetry about love, life, and personal reflections."
          url="https://niteshjoshi.me/poetry"
          type="article"
        />
      )}
      <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

      <main className="anthology">
        <header className="anthology__head">
          <div style={{ overflow: 'hidden', padding: '0.1em 0 0.12em' }}>
            <motion.h1
              className="anthology__title"
              initial={{ y: '110%' }}
              animate={{ y: 0 }}
              transition={{ duration: 1.3, delay: 0.1, ease: EASE }}
            >
              Poe<em>ms</em>
            </motion.h1>
          </div>

          <motion.div
            className="anthology__aside"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5, ease: EASE }}
          >
            <img src={heroLogo} alt="" className="anthology__emblem" />
            <h2 className="anthology__sub">Where code meets feelings.</h2>
            <p>
              A dedicated space for the verses, memories, and quiet thoughts. Lean back, scroll slow, and tap to read in full.
            </p>

            {/* Action Buttons */}
            <div className="anthology__actions">
              <button
                type="button"
                className="link"
                onClick={() => {
                  triggerHaptic('light');
                  openRandomPoem();
                }}
                onTouchStart={() => triggerHaptic('selection')}
              >
                Random Poem <span className="link__arrow">↗</span>
              </button>
              <button
                type="button"
                className="link link--accent"
                onClick={() => {
                  triggerHaptic('light');
                  openPoem(getTodaysPick());
                }}
                onTouchStart={() => triggerHaptic('selection')}
              >
                Today&apos;s Pick <span className="link__arrow">↗</span>
              </button>
            </div>
          </motion.div>
        </header>

        {/* Poems index */}
        <div className="toc__head">
          <span className="label">Index of poems — newest first</span>
          <div className="works__filters" role="group" aria-label="Filter poems by year">
            {[{ year: 'All', count: displayList.length }, ...years].map(({ year, count }) => (
              <button
                key={year}
                type="button"
                className="works__filter"
                aria-pressed={activeYear === year}
                onClick={() => {
                  triggerHaptic('light');
                  setActiveYear(year);
                }}
              >
                {year}
                <sup>{count}</sup>
              </button>
            ))}
          </div>
        </div>

        <div className="toc">
          {visibleList.map(({ poem, origIndex }, displayIndex) => {
            const poemId = getPoemIdByIndex(origIndex);
            const isLiked = liked.includes(poemId);
            const snippet = poemLines(poem).slice(0, 3);
            const isHandwritten = Boolean(poem.image) && snippet.length === 0;
            const { heading, isFirstLine } = poemHeading(poem);
            const preview = isHandwritten
              ? 'Handwritten manuscript'
              : (isFirstLine ? snippet.slice(1) : snippet.slice(0, 2)).join(' / ');
            const year = poemYear(poem);
            const opensYear = displayIndex === 0 || poemYear(visibleList[displayIndex - 1].poem) !== year;

            return (
              <Fragment key={poemSlug(poem)}>
                {opensYear && (
                  <div className="toc__year">
                    <span className="toc__year-number">{year}</span>
                    <span className="label">
                      {years.find((entry) => entry.year === year)?.count} poems
                    </span>
                  </div>
                )}

                <motion.article
                  id={`poem-${origIndex}`}
                  className="poem-row"
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '0px 0px -6% 0px' }}
                  transition={{ duration: 0.9, ease: EASE }}
                >
                  <button
                    type="button"
                    className="poem-row__open"
                    data-cursor="Read"
                    aria-label={`Read ${isFirstLine ? `untitled poem: ${heading}` : heading}`}
                    onClick={() => {
                      triggerHaptic('medium');
                      openPoem(origIndex);
                    }}
                    onTouchStart={() => triggerHaptic('light')}
                  />

                  <span className="label">{String(displayIndex + 1).padStart(2, '0')}</span>

                  <h3 className={`poem-row__title ${isFirstLine ? 'poem-row__title--first-line' : ''}`} lang={poem.lang}>
                    {heading}
                  </h3>

                  <p className="poem-row__snippet" lang={poem.lang}>{preview}</p>

                  <div className="poem-row__meta">
                    <span className="label">{poem.date}</span>
                    <button
                      type="button"
                      className="like"
                      aria-pressed={isLiked}
                      aria-label={`${isLiked ? 'Unlike' : 'Like'} this poem`}
                      onClick={() => {
                        triggerHaptic(isLiked ? 'light' : 'medium');
                        toggleLike(origIndex);
                      }}
                      onTouchStart={() => triggerHaptic('selection')}
                    >
                      <Heart size={14} />
                      {formatCount(origIndex)}
                    </button>
                  </div>
                </motion.article>
              </Fragment>
            );
          })}
        </div>
      </main>

      {/* Full Poem View */}
      <AnimatePresence>
        {selectedPoem !== null && current && (() => {
          const currentLiked = liked.includes(getPoemIdByIndex(selectedPoem));
          const showImage = viewVersion === 'image' && Boolean(current.image);
          const showAlt = viewVersion === 'altImage' && Boolean(current.altImage);

          return (
            <motion.div
              key="reader"
              className="reader"
              role="dialog"
              aria-modal="true"
              aria-label={current.title}
              initial={{ clipPath: 'inset(100% 0 0 0)' }}
              animate={{ clipPath: 'inset(0% 0 0 0)' }}
              exit={{ clipPath: 'inset(0 0 100% 0)' }}
              transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
            >
              <div className="reader__scroll" ref={readerRef} onScroll={updateReaderProgress} data-lenis-prevent>
              <div className="reader__bar">
                <span className="label">
                  Poems — {String(selectedPosition + 1).padStart(2, '0')} / {displayList.length}
                </span>
                <span className="reader__progress" ref={readerProgressRef} aria-hidden="true" />
                <button
                  type="button"
                  className="link"
                  autoFocus
                  onClick={() => {
                    triggerHaptic('medium');
                    closePoem();
                  }}
                  onTouchStart={() => triggerHaptic('light')}
                >
                  Close <span className="link__arrow">✕</span>
                </button>
              </div>

              <article className="reader__page" key={selectedPoem} lang={current.lang}>
                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 0.45, ease: EASE }}
                >
                  <p className="label">{current.date}</p>
                  <h2 className="reader__title">{current.title}</h2>
                  {current.audio && <Reading src={current.audio} />}
                </motion.div>

                <div>
                  {showImage || showAlt ? (
                    <motion.img
                      key={viewVersion}
                      src={showImage ? current.image : current.altImage}
                      alt={showImage ? current.title : `${current.title} (alternate)`}
                      className="reader__image"
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.9, delay: 0.5, ease: EASE }}
                    />
                  ) : (
                    current.lines.map((line, lineIndex) => (
                      <motion.p
                        key={lineIndex}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.55 + Math.min(lineIndex, 30) * 0.045, ease: EASE }}
                        className={line === '' ? 'reader__gap' : 'reader__line'}
                      >
                        {line}
                      </motion.p>
                    ))
                  )}
                </div>

                <span className="reader__end" aria-hidden="true">◆◆◆</span>

                <div className="reader__actions">
                  <button
                    type="button"
                    className="like"
                    aria-pressed={currentLiked}
                    onClick={() => {
                      triggerHaptic(currentLiked ? 'light' : 'medium');
                      toggleLike(selectedPoem);
                    }}
                    onTouchStart={() => triggerHaptic('selection')}
                  >
                    <Heart size={16} />
                    {currentLiked ? 'Liked' : 'Like this poem'} — {formatCount(selectedPoem)}
                  </button>

                  <button
                    type="button"
                    className="link"
                    onClick={() => {
                      triggerHaptic('medium');
                      sharePoem(selectedPoem);
                    }}
                    onTouchStart={() => triggerHaptic('light')}
                  >
                    Share link <span className="link__arrow">↗</span>
                  </button>

                  {current.hasAltVersion && (
                    <button
                      type="button"
                      className="link"
                      onClick={() => {
                        triggerHaptic('medium');
                        cycleVersion(selectedPoem);
                      }}
                      onTouchStart={() => triggerHaptic('light')}
                    >
                      Toggle version
                    </button>
                  )}

                  <span className="label" aria-live="polite">{shareStatus}</span>
                </div>

                <nav className="reader__nav" aria-label="More poems">
                  {([-1, 1] as const).map((delta) => {
                    const neighbour = displayList[(selectedPosition + delta + displayList.length) % displayList.length].poem;

                    return (
                      <button
                        key={delta}
                        type="button"
                        className={`reader__step ${delta > 0 ? 'reader__step--next' : ''}`}
                        onClick={() => {
                          triggerHaptic('light');
                          stepPoem(delta);
                        }}
                      >
                        <span className="label">{delta < 0 ? '← Previous' : 'Next →'}</span>
                        <span className="reader__step-title">{poemHeading(neighbour).heading}</span>
                      </button>
                    );
                  })}
                </nav>
              </article>
              </div>
            </motion.div>
          );
        })()}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
