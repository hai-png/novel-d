import React from 'react';
import { Instagram, Send, ArrowUpRight, Music2 } from 'lucide-react';
import { Page } from '../types';

interface FooterProps {
    onNavigate?: (page: Page) => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const handleNavClick = (e: React.MouseEvent, href: string) => {
    e.preventDefault();

    const executeScroll = () => {
        if (href === '#') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else if (href.startsWith('#')) {
            const element = document.querySelector(href);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }
    };

    if (onNavigate) {
        onNavigate('home');
        setTimeout(executeScroll, 100);
    } else {
        executeScroll();
    }
  };

  return (
    <footer className="bg-neutral-900 border-t border-white/5 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
          <div className="md:col-span-2">
            <a href="#" onClick={(e) => handleNavClick(e, '#')} className="text-3xl font-display font-medium tracking-wide block mb-8">
              Novel-D
            </a>
            <p className="text-neutral-400 max-w-sm leading-relaxed mb-8">
              Crafting digital masterpieces that breathe life into architectural visions. bridging the gap between imagination and reality.
            </p>
            <div className="flex gap-4">
              {[Instagram, Send, Music2].map((Icon, idx) => (
                <a key={idx} href="#" className="w-10 h-10 border border-white/10 flex items-center justify-center hover:bg-white hover:text-neutral-900 transition-all duration-300 rounded-full">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-white font-medium mb-6">Sitemap</h4>
            <ul className="space-y-4">
              <li><a href="#work" onClick={(e) => handleNavClick(e, '#work')} className="text-neutral-400 hover:text-white transition-colors text-sm">Selected Work</a></li>
              <li><a href="#about" onClick={(e) => handleNavClick(e, '#about')} className="text-neutral-400 hover:text-white transition-colors text-sm">About Studio</a></li>
              <li><a href="#services" onClick={(e) => handleNavClick(e, '#services')} className="text-neutral-400 hover:text-white transition-colors text-sm">Services</a></li>
              <li><a href="#contact" onClick={(e) => handleNavClick(e, '#contact')} className="text-neutral-400 hover:text-white transition-colors text-sm">Contact Us</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-medium mb-6">Contact</h4>
            <ul className="space-y-4">
              <li>
                <a href="mailto:contact@noveld.com.et" className="text-neutral-400 hover:text-white transition-colors text-sm flex items-center gap-2 group">
                  contact@noveld.com.et
                  <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </li>
              <li className="text-neutral-400 text-sm">
                Addis ababa Ethiopia 
              </li>
              <li className="text-neutral-400 text-sm mt-4">
                +251 906422230
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-neutral-600 text-sm">© 2024 Noved-d Studio. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
