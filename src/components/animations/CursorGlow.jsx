import React, { useState, useEffect } from 'react';

/**
 * Desktop-Only Ambient Cursor Glow
 * 
 * Provides a subtle golden warmth following the cursor in key areas.
 * Automatically deactivates on touch screens, mobile devices, and when reduced motion is preferred.
 * Zero layout impact, strictly pointer-events-none.
 */
const CursorGlow = () => {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Only enable on desktop pointer devices
    const isPointerFine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!isPointerFine || prefersReducedMotion) return;

    const handleMouseMove = (e) => {
      setPos({ x: e.clientX, y: e.clientY });
      if (!visible) setVisible(true);
    };

    const handleMouseLeave = () => {
      setVisible(false);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      className="fixed pointer-events-none z-30 transition-opacity duration-300"
      style={{
        left: `${pos.x}px`,
        top: `${pos.y}px`,
        transform: 'translate(-50%, -50%)',
        width: '320px',
        height: '320px',
        background: 'radial-gradient(circle, rgba(200, 160, 81, 0.08) 0%, rgba(200, 160, 81, 0.02) 45%, rgba(0,0,0,0) 70%)',
        borderRadius: '50%',
      }}
      aria-hidden="true"
    />
  );
};

export default CursorGlow;
