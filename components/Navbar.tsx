import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowUpRight, ChevronDown } from 'lucide-react';
import { Page } from '../types';

interface NavbarProps {
  onNavigate: (page: Page) => void;
}

const Navbar: React.FC<NavbarProps> = ({ onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    onNavigate('home');
    // Small timeout to allow view switch before scrolling
    setTimeout(() => {
        if (href === '#') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else if (href.startsWith('#')) {
            const element = document.querySelector(href);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }, 100);
    setIsOpen(false);
  };

  const handleSolutionClick = (page: Page) => {
      onNavigate(page);
      setIsOpen(false);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${scrolled ? 'bg-neutral-950/90 backdrop-blur-xl border-b border-white/5 py-4' : 'py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between">
        <a
          href="#"
          onClick={(e) => handleNavClick(e, '#')}
          className="text-2xl font-display font-medium tracking-wide relative group cursor-hover"
        >
          Novel-D
          <span className="absolute -bottom-1 left-0 w-0 h-px bg-white transition-all duration-500 group-hover:w-full"></span>
        </a>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-12">
          <button
            onClick={() => onNavigate('projects')}
            className="text-sm text-neutral-300 hover:text-white transition-colors relative group cursor-hover"
          >
            Work
            <span className="absolute -bottom-1 left-0 w-0 h-px bg-white transition-all duration-300 group-hover:w-full"></span>
          </button>

          <a
            href="#services"
            onClick={(e) => handleNavClick(e, '#services')}
            className="text-sm text-neutral-300 hover:text-white transition-colors relative group cursor-hover"
          >
            Services
            <span className="absolute -bottom-1 left-0 w-0 h-px bg-white transition-all duration-300 group-hover:w-full"></span>
          </a>

          {/* Solutions Dropdown */}
          <div className="relative group">
              <button className="text-sm text-neutral-300 hover:text-white transition-colors flex items-center gap-1 py-2 cursor-hover">
                  Solutions
                  <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-300" />
              </button>
              <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-2">
                  <div className="bg-neutral-900 border border-white/10 rounded-xl p-2 w-56 shadow-2xl backdrop-blur-xl">
                      <button 
                        onClick={() => handleSolutionClick('architects')}
                        className="w-full text-left px-4 py-3 text-sm text-neutral-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors cursor-hover block"
                      >
                          For Architects
                      </button>
                      <button 
                        onClick={() => handleSolutionClick('interior-designers')}
                        className="w-full text-left px-4 py-3 text-sm text-neutral-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors cursor-hover block"
                      >
                          For Interior Designers
                      </button>
                      <button 
                        onClick={() => handleSolutionClick('real-estate')}
                        className="w-full text-left px-4 py-3 text-sm text-neutral-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors cursor-hover block"
                      >
                          For Real Estate Agents
                      </button>
                  </div>
              </div>
          </div>
        </div>

        <a
            href="#contact"
            onClick={(e) => handleNavClick(e, '#contact')}
            className="hidden md:flex items-center gap-2 text-sm border border-white/20 px-6 py-2.5 hover:bg-white hover:text-neutral-950 transition-all duration-300 group cursor-hover"
        >
          Start Project
          <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </a>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden text-white p-2 z-50 relative cursor-hover"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`fixed inset-0 bg-neutral-950 z-40 transition-transform duration-500 flex items-center justify-center ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col items-center gap-8 p-6 w-full">
          <button
            onClick={() => { onNavigate('projects'); setIsOpen(false); }}
            className="text-4xl font-display text-neutral-300 hover:text-white transition-colors"
          >
            Work
          </button>
          <a
            href="#services"
            className="text-4xl font-display text-neutral-300 hover:text-white transition-colors"
            onClick={(e) => handleNavClick(e, '#services')}
          >
            Services
          </a>
          
          <div className="flex flex-col items-center gap-4 w-full border-y border-white/5 py-8">
              <span className="text-sm text-neutral-500 uppercase tracking-widest">Solutions</span>
              <button 
                onClick={() => handleSolutionClick('architects')}
                className="text-2xl font-display text-neutral-300 hover:text-white transition-colors"
              >
                  Architects
              </button>
              <button 
                onClick={() => handleSolutionClick('interior-designers')}
                className="text-2xl font-display text-neutral-300 hover:text-white transition-colors"
              >
                  Interior Designers
              </button>
              <button 
                onClick={() => handleSolutionClick('real-estate')}
                className="text-2xl font-display text-neutral-300 hover:text-white transition-colors"
              >
                  Real Estate Agents
              </button>
          </div>

          <a
            href="#contact"
            onClick={(e) => handleNavClick(e, '#contact')}
            className="text-xl text-white border border-white/20 px-8 py-3 mt-4"
          >
            Start Project
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;