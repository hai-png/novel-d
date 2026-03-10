import React, { useEffect, useState, useRef } from 'react';

const CustomCursor: React.FC = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const outlineRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${clientX}px, ${clientY}px) translate(-50%, -50%)`;
      }
      // Add a slight delay/lag to the outline for organic feel
      if (outlineRef.current) {
        outlineRef.current.animate({
          transform: `translate(${clientX}px, ${clientY}px) translate(-50%, -50%)`
        }, { duration: 500, fill: 'forwards' });
      }
    };

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isLink = target.closest('a, button, input, textarea, select, .cursor-hover');
      setHovered(!!isLink);
    };

    window.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseover', onMouseOver);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseover', onMouseOver);
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="cursor-dot hidden md:block" />
      <div 
        ref={outlineRef} 
        className={`cursor-outline hidden md:block ${hovered ? 'hover' : ''}`}
      />
    </>
  );
};

export default CustomCursor;