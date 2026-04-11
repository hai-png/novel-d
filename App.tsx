import React, { useState, useEffect, useRef, useCallback } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Marquee from './components/Marquee';
import FeaturedProject from './components/FeaturedProject';
import Portfolio from './components/Portfolio';
import About from './components/About';
import WhyUs from './components/WhyUs';
import Services from './components/Services';
import Process from './components/Process';
import Contact from './components/Contact';
import QuoteForm from './components/QuoteForm';
import Footer from './components/Footer';
import CustomCursor from './components/CustomCursor';
import Preloader from './components/Preloader';
import ExteriorRendering from './components/ExteriorRendering';
import InteriorVisualization from './components/InteriorVisualization'
import VirtualTour from './components/VirtualTour';
import AerialRendering from './components/AerialRendering';
import ImmersiveTours from './components/ImmersiveTours';
import AnimationServices from './components/AnimationServices';
import RealEstateAgentSolutions from './components/RealEstateAgentSolutions';
import InteriorDesignersSolutions from './components/InteriorDesignersSolutions';
import ArchitectSolutions from './components/ArchitectSolutions';
import Projects from './components/Projects';
import { Page } from './types';

// Map URL hash fragments to Page values
const PAGE_FROM_HASH: Record<string, Page> = {
  '/exterior': 'exterior',
  '/interior': 'interior',
  '/virtual-tour': 'virtual-tour',
  '/aerial': 'aerial',
  '/immersive': 'immersive',
  '/animation': 'animation',
  '/real-estate': 'real-estate',
  '/interior-designers': 'interior-designers',
  '/architects': 'architects',
  '/projects': 'projects',
};

const HASH_FROM_PAGE: Record<Page, string> = {
  'home': '#/',
  'exterior': '#/exterior',
  'interior': '#/interior',
  'virtual-tour': '#/virtual-tour',
  'aerial': '#/aerial',
  'immersive': '#/immersive',
  'animation': '#/animation',
  'real-estate': '#/real-estate',
  'interior-designers': '#/interior-designers',
  'architects': '#/architects',
  'projects': '#/projects',
};

const resolvePageFromHash = (hash: string): Page => {
  const key = hash.replace(/^#/, '') || '/';
  if (key === '/' || key === '' || key === 'home') return 'home';
  return PAGE_FROM_HASH[key] || 'home';
};

const App: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState<Page>(() => resolvePageFromHash(window.location.hash));
  const hasScrolledRef = useRef(false);

  const handleNavigate = useCallback((page: Page) => {
    setCurrentPage(page);
    // Sync URL hash with current page
    const newHash = HASH_FROM_PAGE[page];
    if (newHash && window.location.hash !== newHash) {
      window.history.pushState(null, '', newHash);
    }
  }, []);

  // Listen for browser back/forward navigation
  useEffect(() => {
    const onHashChange = () => {
      const page = resolvePageFromHash(window.location.hash);
      setCurrentPage(page);
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  // Listen for navigation scroll events to prevent double-scrolling
  useEffect(() => {
    const handleNavigationScroll = () => {
      hasScrolledRef.current = true;
    };

    window.addEventListener('navigation-scroll-start', handleNavigationScroll);
    return () => window.removeEventListener('navigation-scroll-start', handleNavigationScroll);
  }, []);

  // Scroll to top after page content renders - but only if navigation hasn't already scrolled
  useEffect(() => {
    // If we've already scrolled (from navigation), reset and skip
    if (hasScrolledRef.current) {
      hasScrolledRef.current = false;
      return;
    }

    // Use requestAnimationFrame to ensure DOM is ready
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Fallback scroll after content renders
    const timer = setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 50);

    return () => {
      clearTimeout(timer);
    };
  }, [currentPage]);

  return (
    <div className="relative bg-neutral-950 text-white min-h-screen">
      <Preloader onComplete={() => setLoading(false)} />

      {!loading && (
        <>
          <div className="noise-overlay"></div>
          <CustomCursor />

          <Navbar onNavigate={handleNavigate} />

          <main className="pt-20">
            {currentPage === 'home' && (
                <>
                    <Hero />
                    <Marquee
                      items={['Residential', 'Commercial', 'Interior', 'Exterior', 'Animation', 'VR']}
                    />
                    <FeaturedProject onNavigate={handleNavigate} />
                    <Portfolio onNavigate={handleNavigate} />
                    <About />
                    <Marquee
                      items={['Photorealism', 'Innovation', 'Excellence', 'Precision']}
                      reverse={true}
                    />
                    <Services onNavigate={handleNavigate} />
                    <WhyUs />
                    <Process onNavigate={handleNavigate} />
                    <Contact />
                </>
            )}

            {currentPage === 'exterior' && (
                <ExteriorRendering onNavigate={handleNavigate} />
            )}

            {currentPage === 'interior' && (
                <InteriorVisualization onNavigate={handleNavigate} />
            )}

            {currentPage === 'virtual-tour' && (
                <VirtualTour onNavigate={handleNavigate} />
            )}

            {currentPage === 'aerial' && (
                <AerialRendering onNavigate={handleNavigate} />
            )}

            {currentPage === 'immersive' && (
                <ImmersiveTours onNavigate={handleNavigate} />
            )}

            {currentPage === 'animation' && (
                <AnimationServices onNavigate={handleNavigate} />
            )}

            {currentPage === 'real-estate' && (
                <RealEstateAgentSolutions onNavigate={handleNavigate} />
            )}

            {currentPage === 'interior-designers' && (
                <InteriorDesignersSolutions onNavigate={handleNavigate} />
            )}

            {currentPage === 'architects' && (
                <ArchitectSolutions onNavigate={handleNavigate} />
            )}

            {currentPage === 'projects' && (
                <Projects onNavigate={handleNavigate} />
            )}
          </main>

          <Footer onNavigate={handleNavigate} />
        </>
      )}
    </div>
  );
};

export default App;