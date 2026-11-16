import type { Poem } from '@/data/poems';

export const toSlug = (title: string, id: number) => {
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '') || 'poem';
  return `${base}-${id}`;
};

export const poemSlug = (poem: Poem) => toSlug(poem.title, poem.id);

export const poemPath = (poem: Poem) => `/poetry/${poemSlug(poem)}`;

/** Non-empty lines, trimmed. */
export const poemLines = (poem: Poem) => poem.lines.map((line) => line.trim()).filter((line) => line !== '');

/** Untitled poems are known by their first line, as in a first-line index. */
export function poemHeading(poem: Poem) {
  const lines = poemLines(poem);
  const isFirstLine = poem.title.trim().toLowerCase() === 'untitled' && lines.length > 0;
  return { heading: isFirstLine ? lines[0] : poem.title, isFirstLine };
}

export const parseDateValue = (dateStr: string) => {
  if (!dateStr) return 0;
  // remove parenthetical time info and ordinals (st,nd,rd,th)
  const cleaned = dateStr.replace(/\(.*\)/, '').replace(/(\d+)(st|nd|rd|th)/gi, '$1').trim();
  // Try direct parse
  const parsed = Date.parse(cleaned);
  if (!isNaN(parsed)) return parsed;
  // Try to find a year fallback
  const yearMatch = cleaned.match(/(\d{4})/);
  if (yearMatch) {
    return new Date(Number(yearMatch[1]), 0, 1).getTime();
  }
  return 0;
};

export const poemYear = (poem: Poem) => poem.date.match(/(\d{4})/)?.[1] ?? 'Undated';
