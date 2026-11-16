import { useEffect, useState } from 'react';
import { scrollToTarget } from '@/utils/scroll';

const chapters = [
  { id: 'about', numeral: 'I', name: 'Preface' },
  { id: 'skills', numeral: 'II', name: 'Instruments' },
  { id: 'projects', numeral: 'III', name: 'Selected works' },
  { id: 'record', numeral: 'IV', name: 'Record' },
  { id: 'verse', numeral: 'V', name: 'Verse' },
  { id: 'contact', numeral: 'VI', name: 'Correspondence' },
];

/** Roman numerals in the left margin marking which chapter is on screen. */
export function ChapterRail() {
  const [active, setActive] = useState(-1);

  useEffect(() => {
    const update = () => {
      const line = window.innerHeight * 0.45;
      let current = -1;
      chapters.forEach((chapter, index) => {
        const element = document.getElementById(chapter.id);
        if (element && element.getBoundingClientRect().top <= line) current = index;
      });
      setActive(current);
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  const goTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) scrollToTarget(element, { offset: -60 });
  };

  return (
    <nav className={`rail ${active >= 0 ? 'is-visible' : ''}`} aria-label="Chapters">
      {chapters.map((chapter, index) => (
        <button
          key={chapter.id}
          type="button"
          className="rail__item"
          aria-current={index === active ? 'true' : undefined}
          aria-label={`${chapter.numeral} — ${chapter.name}`}
          tabIndex={active >= 0 ? 0 : -1}
          onClick={() => goTo(chapter.id)}
        >
          {chapter.numeral}
        </button>
      ))}
    </nav>
  );
}
