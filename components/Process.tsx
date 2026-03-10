import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { Page } from '../types';

interface ProcessProps {
    onNavigate?: (page: Page) => void;
}

const steps = [
    { id: '01', title: 'Get a Quote', desc: 'Tell us about your project requirements, timeline, and vision. We\'ll review your needs and provide a customized quote within 24 hours.' },
    { id: '02', title: 'Send Requirements', desc: 'Share your plans, sketches, reference images, and any specific details. The more information you provide, the better we can bring your vision to life.' },
    { id: '03', title: 'Initial Drafts', desc: 'We create the first versions of your project, focusing on composition, lighting, and overall aesthetic direction for your review.' },
    { id: '04', title: 'Feedback', desc: 'Review the drafts and share your feedback. We work collaboratively with you through revisions to ensure every detail aligns with your expectations.' },
    { id: '05', title: 'Finalize & Present', desc: 'Once approved, we apply final touches, optimize for your intended use, and deliver high-quality files ready for presentation or publication.' },
];

const Process: React.FC<ProcessProps> = ({ onNavigate }) => {
  const [ref, isVisible] = useIntersectionObserver<HTMLElement>();

  const handleServicesClick = (e: React.MouseEvent) => {
      e.preventDefault();
      if (onNavigate) {
          onNavigate('home');
          setTimeout(() => {
              const element = document.querySelector('#services');
              if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
              }
          }, 100);
      }
  };

  return (
    <section id="process" className="py-32 bg-neutral-900 overflow-hidden relative" ref={ref}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
            <div className="text-center mb-24">
                <p className="text-neutral-500 text-sm tracking-[0.3em] uppercase mb-4">Workflow</p>
                <h2 className="font-display text-4xl md:text-6xl font-medium mb-6">
                    From Concept to <span className="text-stroke text-white">Completion</span>
                </h2>
                <p className="text-neutral-400 text-lg max-w-2xl mx-auto leading-relaxed">
                    Our streamlined process ensures clear communication, timely delivery, and exceptional results for every project type.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-4 mb-16">
                {steps.map((step, idx) => (
                    <div
                        key={step.id}
                        className={`text-center lg:text-left group transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                        style={{ transitionDelay: `${idx * 150}ms` }}
                    >
                        <div className="relative mb-6">
                            <div className="w-16 h-16 mx-auto lg:mx-0 bg-neutral-950 border border-white/10 rounded-full flex items-center justify-center group-hover:border-white/30 transition-all duration-500">
                                <span className="font-display text-xl">{step.id}</span>
                            </div>
                            {idx !== steps.length - 1 && (
                                <div className="hidden lg:block absolute top-1/2 left-20 w-[calc(100%-5rem)] h-px bg-gradient-to-r from-white/20 to-transparent"></div>
                            )}
                        </div>
                        <h3 className="text-lg font-display mb-2">{step.title}</h3>
                        <p className="text-neutral-400 text-xs leading-relaxed">{step.desc}</p>
                    </div>
                ))}
            </div>

            <div className="text-center">
                <a
                    href="#services"
                    onClick={handleServicesClick}
                    className="inline-flex items-center gap-3 text-sm text-neutral-400 hover:text-white transition-colors group cursor-hover"
                >
                    For more details on specific services and deliverables
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
            </div>
        </div>
    </section>
  );
};

export default Process;
