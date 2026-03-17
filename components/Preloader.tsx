import React, { useEffect, useState } from 'react';

const Preloader: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [percent, setPercent] = useState(0);
  const [hide, setHide] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setPercent(p => {
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(() => setHide(true), 500);
          setTimeout(onComplete, 1000);
          return 100;
        }
        return p + Math.floor(Math.random() * 10) + 1;
      });
    }, 150);
    return () => clearInterval(interval);
  }, [onComplete]);

  if (hide) return null;

  return (
    <div className={`fixed inset-0 z-[10000] bg-neutral-950 flex flex-col items-center justify-center transition-opacity duration-500 ${percent === 100 ? 'opacity-0' : 'opacity-100'}`}>
      <div className="flex space-x-4 text-6xl font-display font-bold text-white overflow-hidden">
        {['N','O','V','E','L','-','D'].map((char, i) => (
          <span
            key={i}
            className="inline-block animate-[float3_1s_ease-out_forwards]"
            style={{ animationDelay: `${i * 0.1}s`, transform: 'translateY(100%)', opacity: 0, animation: 'slideUp 0.5s forwards' }}
          >
            {char}
          </span>
        ))}
      </div>
      <style>{`
        @keyframes slideUp { to { transform: translateY(0); opacity: 1; } }
      `}</style>

      <div className="w-48 h-px bg-white/20 mt-8 relative overflow-hidden">
        <div
            className="absolute top-0 left-0 h-full bg-white transition-all duration-200"
            style={{ width: `${percent}%` }}
        ></div>
      </div>
      <div className="mt-4 text-xs text-neutral-500 tracking-widest">{percent}%</div>
    </div>
  );
};

export default Preloader;