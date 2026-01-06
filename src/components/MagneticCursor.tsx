import { useEffect, useRef, useState } from 'react';

export function MagneticCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const auraRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const position = useRef({ x: 0, y: 0 });
  const auraPosition = useRef({ x: 0, y: 0 });
  const rafId = useRef<number>(0);

  useEffect(() => {
    // Skip on touch devices
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
      return;
    }

    // Hide default cursor globally
    const style = document.createElement('style');
    style.id = 'hide-cursor';
    style.textContent = '*, *::before, *::after { cursor: none !important; }';
    document.head.appendChild(style);

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const animate = () => {
      if (!cursorRef.current || !auraRef.current) {
        rafId.current = requestAnimationFrame(animate);
        return;
      }

      // Cursor follows instantly
      cursorRef.current.style.left = `${position.current.x}px`;
      cursorRef.current.style.top = `${position.current.y}px`;

      // Aura follows with lag
      auraPosition.current.x = lerp(auraPosition.current.x, position.current.x, 0.15);
      auraPosition.current.y = lerp(auraPosition.current.y, position.current.y, 0.15);
      auraRef.current.style.left = `${auraPosition.current.x}px`;
      auraRef.current.style.top = `${auraPosition.current.y}px`;

      rafId.current = requestAnimationFrame(animate);
    };

    const onMouseMove = (e: MouseEvent) => {
      position.current = { x: e.clientX, y: e.clientY };

      // Check what's under cursor
      const el = document.elementFromPoint(e.clientX, e.clientY);
      if (el) {
        const isClickable = 
          el.tagName === 'A' ||
          el.tagName === 'BUTTON' ||
          el.closest('a') !== null ||
          el.closest('button') !== null ||
          el.closest('[role="button"]') !== null ||
          el.closest('[onclick]') !== null ||
          window.getComputedStyle(el).cursor === 'pointer';
        
        setIsHovering(!!isClickable);
      } else {
        setIsHovering(false);
      }
    };

    const onMouseDown = () => setIsClicking(true);
    const onMouseUp = () => setIsClicking(false);

    const onMouseEnter = () => {
      if (cursorRef.current) cursorRef.current.style.opacity = '1';
      if (auraRef.current) auraRef.current.style.opacity = '1';
    };

    const onMouseLeave = () => {
      if (cursorRef.current) cursorRef.current.style.opacity = '0';
      if (auraRef.current) auraRef.current.style.opacity = '0';
    };

    // Initialize position
    position.current = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    auraPosition.current = { ...position.current };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mouseenter', onMouseEnter);
    document.addEventListener('mouseleave', onMouseLeave);

    rafId.current = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseenter', onMouseEnter);
      document.removeEventListener('mouseleave', onMouseLeave);
      cancelAnimationFrame(rafId.current);
      document.getElementById('hide-cursor')?.remove();
    };
  }, []);

  // Skip render on touch devices
  if (typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0)) {
    return null;
  }

  return (
    <>
      {/* Aura - grows and turns orange on hover, shrinks on click */}
      <div
        ref={auraRef}
        style={{
          position: 'fixed',
          pointerEvents: 'none',
          width: isClicking ? '30px' : isHovering ? '80px' : '45px',
          height: isClicking ? '30px' : isHovering ? '80px' : '45px',
          borderRadius: '50%',
          backgroundColor: isHovering ? 'rgba(255, 107, 53, 0.5)' : 'rgba(255, 255, 255, 0.25)',
          boxShadow: isHovering 
            ? '0 0 30px rgba(255, 107, 53, 0.6), 0 0 60px rgba(255, 107, 53, 0.3)'
            : '0 0 15px rgba(255, 255, 255, 0.3)',
          transform: 'translate(-50%, -50%)',
          transition: 'width 0.2s ease-out, height 0.2s ease-out, background-color 0.2s ease-out, box-shadow 0.2s ease-out',
          zIndex: 2147483646,
          opacity: 1,
        }}
      />

      {/* Cursor dot - shrinks on click */}
      <div
        ref={cursorRef}
        style={{
          position: 'fixed',
          pointerEvents: 'none',
          width: isClicking ? '6px' : '12px',
          height: isClicking ? '6px' : '12px',
          borderRadius: '50%',
          backgroundColor: isHovering ? '#ff6b35' : '#ffffff',
          boxShadow: isHovering
            ? '0 0 10px rgba(255, 107, 53, 0.8), 0 0 20px rgba(255, 107, 53, 0.5)'
            : '0 0 8px rgba(255, 255, 255, 0.8)',
          transform: 'translate(-50%, -50%)',
          transition: 'width 0.15s ease-out, height 0.15s ease-out, background-color 0.15s ease-out',
          zIndex: 2147483647,
          opacity: 1,
        }}
      />
    </>
  );
}