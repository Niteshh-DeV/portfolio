import { useEffect, useRef, useState } from 'react';

const INTERACTIVE = 'a, button, [role="button"], label, summary';
const TEXT_ENTRY = 'input, textarea';

export function MagneticCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [enabled] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches
  );
  const [mode, setMode] = useState<'idle' | 'hover' | 'text' | 'label'>('idle');
  const [label, setLabel] = useState('');
  const [isDown, setIsDown] = useState(false);
  const [isHidden, setIsHidden] = useState(true);

  useEffect(() => {
    if (!enabled) return;

    // Hide default cursor globally
    const style = document.createElement('style');
    style.id = 'hide-cursor';
    style.textContent = '*, *::before, *::after { cursor: none !important; }';
    document.head.appendChild(style);

    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const current = { ...target };
    let rafId = 0;

    const tick = () => {
      current.x += (target.x - current.x) * 0.22;
      current.y += (target.y - current.y) * 0.22;
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${current.x}px, ${current.y}px, 0)`;
      }
      rafId = requestAnimationFrame(tick);
    };

    const onMouseMove = (e: MouseEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
      setIsHidden(false);
    };

    const onMouseOver = (e: MouseEvent) => {
      const el = e.target as Element | null;
      if (!el?.closest) return;

      const labelled = el.closest<HTMLElement>('[data-cursor]');
      if (el.closest('[data-cursor-quiet]')) {
        // keep the dot small so it doesn't cover what's underneath
        setMode('idle');
      } else if (labelled) {
        setLabel(labelled.dataset.cursor ?? '');
        setMode('label');
      } else if (el.closest(TEXT_ENTRY)) {
        setMode('text');
      } else if (el.closest(INTERACTIVE)) {
        setMode('hover');
      } else {
        setMode('idle');
      }
    };

    const onMouseDown = () => setIsDown(true);
    const onMouseUp = () => setIsDown(false);
    const onLeave = () => setIsHidden(true);

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseover', onMouseOver);
    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mouseup', onMouseUp);
    document.documentElement.addEventListener('mouseleave', onLeave);
    rafId = requestAnimationFrame(tick);

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseover', onMouseOver);
      document.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('mouseup', onMouseUp);
      document.documentElement.removeEventListener('mouseleave', onLeave);
      cancelAnimationFrame(rafId);
      document.getElementById('hide-cursor')?.remove();
    };
  }, [enabled]);

  // Skip render on touch devices
  if (!enabled) return null;

  const classes = [
    'cursor',
    mode !== 'idle' ? `is-${mode}` : '',
    isDown && mode !== 'label' ? 'is-down' : '',
    isHidden ? 'is-hidden' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div ref={cursorRef} className={classes} aria-hidden="true">
      <div className="cursor__dot">{mode === 'label' ? label : ''}</div>
    </div>
  );
}
