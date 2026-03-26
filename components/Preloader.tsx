import React, { useEffect, useState } from 'react';
import Logo from '/src/assets/images-optimized/branding/logo-nobg.png';

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
      {/* Logo - Large and centered */}
      <img 
        src={Logo} 
        alt="Novel-D Archviz Studio" 
        className="h-60 w-auto object-contain mb-12 animate-[fadeIn_0.5s_ease-out_forwards]"
      />
      
      {/* Animated NOVEL-D Text */}
      <div className="flex space-x-4 text-6xl font-display font-bold text-white overflow-hidden mb-8">
        {['N','O','V','E','L','-','D'].map((char, i) => (
          <span
            key={i}
            className="inline-block"
            style={{ animation: 'slideUp 0.5s forwards', animationDelay: `${i * 0.1}s`, transform: 'translateY(100%)', opacity: 0 }}
          >
            {char}
          </span>
        ))}
      </div>
      
      <style>{`
        @keyframes slideUp { to { transform: translateY(0); opacity: 1; } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>

      {/* Progress Bar */}
      <div className="w-48 h-px bg-white/20 mt-4 relative overflow-hidden">
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
