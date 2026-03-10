import React from 'react';
import { Mail, MapPin } from 'lucide-react';
import QuoteForm from './QuoteForm';

const Contact: React.FC = () => {
  return (
    <section id="contact" className="py-32 bg-neutral-950 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-white/[0.01] rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      <div className="px-6 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          
          {/* Left: Contact Info */}
          <div className="lg:sticky lg:top-32">
            <p className="text-neutral-500 text-sm tracking-[0.3em] uppercase mb-4">Get in Touch</p>
            <h2 className="font-display text-4xl md:text-5xl font-medium mb-6 leading-tight">
              Let's create<br/>something <span className="text-stroke text-white">remarkable</span>
            </h2>
            <p className="text-neutral-400 leading-relaxed mb-12 text-lg">
              Ready to bring your architectural vision to life? We'd love to hear about your project and explore how we can collaborate.
            </p>

            <div className="space-y-6 mb-12">
              <a href="mailto:contact@noveld.com.et" className="flex items-center gap-4 group cursor-hover">
                <div className="w-14 h-14 border border-white/10 flex items-center justify-center group-hover:border-white/30 group-hover:bg-white/5 transition-all duration-500 rounded-full">
                  <Mail className="w-5 h-5 text-neutral-400 group-hover:text-white" />
                </div>
                <div>
                  <p className="text-sm text-neutral-500 mb-1">Email us at</p>
                  <span className="text-white group-hover:text-neutral-300 transition-colors">contact@noveld.com.et</span>
                </div>
              </a>

              <div className="flex items-center gap-4">
                <div className="w-14 h-14 border border-white/10 flex items-center justify-center rounded-full">
                  <MapPin className="w-5 h-5 text-neutral-400" />
                </div>
                <div>
                  <p className="text-sm text-neutral-500 mb-1">Based In</p>
                  <span className="text-white">Addis Ababa, Ethiopia</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Quote Form */}
          <div className="bg-neutral-900/30 border border-white/5 rounded-3xl p-8 backdrop-blur-sm">
            <QuoteForm isInline={true} isCompact={true} />
          </div>

        </div>
      </div>
    </section>
  );
};

export default Contact;
