import React, { useEffect, useState } from 'react';

const Hero: React.FC = () => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Simulate loading delay for animation trigger
    const timer = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden animate-gradient bg-gradient-to-br from-neutral-900 via-neutral-950 to-neutral-900">
      {/* Decorative Floating Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-white/5 animate-morph blur-3xl animate-float-1 rounded-full"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-white/3 animate-morph blur-3xl animate-float-2 rounded-full"></div>
        
        <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
            <line x1="0" y1="50%" x2="100%" y2="50%" stroke="white" strokeWidth="0.5" className={`transition-all duration-[2s] ease-in-out ${loaded ? 'stroke-dashoffset-0' : 'stroke-dashoffset-[2000] stroke-dasharray-[2000]'}`} />
            <line x1="50%" y1="0" x2="50%" y2="100%" stroke="white" strokeWidth="0.5" className={`transition-all duration-[2s] ease-in-out ${loaded ? 'stroke-dashoffset-0' : 'stroke-dashoffset-[2000] stroke-dasharray-[2000]'}`} />
        </svg>
      </div>

      <div className="relative z-10 text-center px-4">
        <div className="overflow-hidden mb-2">
            <p className={`text-neutral-400 text-sm tracking-[0.3em] uppercase transition-all duration-1000 delay-300 ${loaded ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>
                Architectural Visualization
            </p>
        </div>
        
        <h1 className="font-display text-6xl md:text-8xl lg:text-9xl font-medium tracking-tight mb-8">
            <span className="block overflow-hidden">
                <span className={`block transition-transform duration-1000 delay-500 ${loaded ? 'translate-y-0' : 'translate-y-full'}`}>
                    BEYOND
                </span>
            </span>
            <span className="block overflow-hidden">
                <span className={`block transition-transform duration-1000 delay-700 text-stroke ${loaded ? 'translate-y-0' : 'translate-y-full'}`}>
                    REALITY
                </span>
            </span>
        </h1>

        <div className={`transition-opacity duration-1000 delay-1000 ${loaded ? 'opacity-100' : 'opacity-0'}`}>
             <p className="max-w-lg mx-auto text-neutral-400 leading-relaxed mb-10">
                We craft digital masterpieces that breathe life into architectural visions, bridging the gap between imagination and reality.
             </p>
             <a href="#work" className="inline-block border border-white/20 rounded-full px-8 py-4 hover:bg-white hover:text-black transition-all duration-300 cursor-hover">
                Explore Portfolio
             </a>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 animate-bounce">
          <span className="text-[10px] tracking-widest text-neutral-500 uppercase">Scroll</span>
          <div className="w-px h-12 bg-gradient-to-b from-white to-transparent"></div>
      </div>
    </section>
  );
};

export default Hero;