import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Page } from '../types';

// Import featured works images from HOME PAGE/featured_works folder
const featuredImages = import.meta.glob('/src/assets/images-optimized/HOME PAGE/featured_works/*.{webp,jpg,jpeg,png}', { eager: true, import: 'default' }) as Record<string, string>;
const featuredGallery = Object.values(featuredImages);

// Import all interior images as fallback
const interiorImages = import.meta.glob('/src/assets/images-optimized/interior/**/*.webp', { eager: true, import: 'default' }) as Record<string, string>;
const interiorGallery = Object.values(interiorImages);

// Import all exterior images as fallback
const exteriorImages = import.meta.glob('/src/assets/images-optimized/exterior/**/*.webp', { eager: true, import: 'default' }) as Record<string, string>;
const exteriorGallery = Object.values(exteriorImages);

// Use featured gallery if available, otherwise combine all images for the portfolio
const allProjects = featuredGallery.length > 0 ? featuredGallery : [...interiorGallery, ...exteriorGallery];

interface PortfolioProps {
  onNavigate?: (page: Page) => void;
}

const Portfolio: React.FC<PortfolioProps> = ({ onNavigate }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [translateX, setTranslateX] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current || !scrollContainerRef.current) return;
      
      const containerTop = containerRef.current.offsetTop;
      const containerHeight = containerRef.current.offsetHeight;
      const windowHeight = window.innerHeight;
      const scrollPos = window.scrollY;

      // Calculate how far we've scrolled into the container
      const offset = scrollPos - containerTop;
      const maxScroll = containerHeight - windowHeight;
      const scrollPercentage = Math.max(0, Math.min(1, offset / maxScroll));

      // Calculate horizontal movement
      const contentWidth = scrollContainerRef.current.scrollWidth;
      const maxTranslate = contentWidth - window.innerWidth;
      
      setTranslateX(scrollPercentage * maxTranslate);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Init

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section 
      id="work" 
      ref={containerRef} 
      className="relative h-[400vh] bg-neutral-950"
    >
      <div className="sticky top-0 h-screen overflow-hidden flex flex-col justify-center">
        <div className="px-6 lg:px-12 mb-8 flex items-end justify-between">
            <div>
                <p className="text-neutral-500 text-sm tracking-[0.3em] uppercase mb-4">Portfolio</p>
                <h2 className="font-display text-4xl md:text-6xl font-medium">Selected <span className="text-stroke">Work</span></h2>
            </div>
            <p className="hidden lg:block text-neutral-500 text-sm">Scroll to explore →</p>
        </div>

        <div
          ref={scrollContainerRef}
          className="flex gap-8 px-6 lg:px-12 w-max"
          style={{ transform: `translateX(-${translateX}px)`, transition: 'transform 0.1s linear' }}
        >
          {allProjects.map((image, index) => (
            <div
                key={index}
                className="group relative w-[80vw] md:w-[600px] aspect-[4/3] flex-shrink-0 overflow-hidden cursor-hover bg-neutral-900"
            >
                <img
                    src={image}
                    alt={`Portfolio Project ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
            </div>
          ))}

          {/* End CTA */}
          <div className="w-[300px] flex-shrink-0 flex items-center justify-center">
            <button 
                onClick={() => onNavigate && onNavigate('projects')}
                className="group flex flex-col items-center gap-6 text-center cursor-hover"
            >
                <div className="w-32 h-32 border border-white/20 rounded-full flex items-center justify-center group-hover:bg-white group-hover:border-white transition-all duration-500">
                    <ArrowRight className="w-8 h-8 text-white group-hover:text-neutral-950 transition-colors" />
                </div>
                <span className="text-sm text-neutral-400 group-hover:text-white transition-colors">View All Projects</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Portfolio;