import React from 'react';
import { Instagram, Send, Music2, Phone, Mail, MapPin, ArrowUpRight } from 'lucide-react';
import { Page } from '../types';
import { useNavigation } from '../hooks/useNavigation';

interface FooterProps {
    onNavigate?: (page: Page) => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { navigateToHomeWithScroll } = useNavigation();

  const handleNavClick = (e: React.MouseEvent, href: string) => {
    e.preventDefault();

    if (onNavigate) {
        if (href === '#') {
            onNavigate('home');
            setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 50);
        } else if (href.startsWith('#')) {
            navigateToHomeWithScroll(onNavigate, href.substring(1));
        }
    } else {
        if (href === '#') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else if (href.startsWith('#')) {
            const element = document.querySelector(href);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }
  };

  return (
    <footer className="bg-neutral-900 border-t border-white/5 pt-20 pb-10">
      <div className="px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
          <div>
            <a href="#" onClick={(e) => handleNavClick(e, '#')} className="text-3xl font-display font-medium tracking-wide block mb-8">
              Novel-D
            </a>
            <p className="text-neutral-400 max-w-sm leading-relaxed mb-8">
              Crafting digital masterpieces that breathe life into architectural visions. bridging the gap between imagination and reality.
            </p>
          </div>

          <div className="md:col-span-1 md:col-start-2 grid grid-cols-1 sm:grid-cols-2 gap-12">
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
                <li className="flex items-center gap-2 text-neutral-400 text-sm">
                  <Mail size={14} className="flex-shrink-0" />
                  <a href="mailto:contact@noveld.com.et" className="hover:text-white transition-colors flex items-center gap-2 group">
                    contact@noveld.com.et
                    <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </li>
                <li className="flex items-start gap-2 text-neutral-400 text-sm">
                  <MapPin size={14} className="flex-shrink-0 mt-0.5" />
                  <span>Addis ababa Ethiopia</span>
                </li>
                <li className="flex items-center gap-2 text-neutral-400 text-sm">
                  <Phone size={14} className="flex-shrink-0" />
                  <a href="tel:+251906422230" className="hover:text-white transition-colors">
                    +251 906422230
                  </a>
                </li>
              </ul>
              
              <div className="flex gap-4 mt-8 pt-6 border-t border-white/5">
                {[Instagram, Send, Music2].map((Icon, idx) => (
                  <a key={idx} href="#" className="w-10 h-10 border border-white/10 flex items-center justify-center hover:bg-white hover:text-neutral-900 transition-all duration-300 rounded-full">
                    <Icon size={18} />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8">
          <p className="text-neutral-600 text-sm">© 2024 Novel-D Studio. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
