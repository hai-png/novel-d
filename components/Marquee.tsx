import React from 'react';

interface MarqueeProps {
  items: string[];
  reverse?: boolean;
}

const Marquee: React.FC<MarqueeProps> = ({ items, reverse = false }) => {
  return (
    <div className="py-6 bg-neutral-900/50 border-y border-white/5 overflow-hidden">
      <div className={`flex whitespace-nowrap w-max ${reverse ? 'animate-marquee-reverse' : 'animate-marquee'}`}>
        {[...Array(2)].map((_, i) => (
          <div key={i} className="flex items-center">
            {items.map((item, index) => (
              <React.Fragment key={`${i}-${index}`}>
                <span className="inline-block mx-8 text-3xl font-display text-neutral-700 hover:text-white transition-colors cursor-default">
                  {item}
                </span>
                <span className="inline-block mx-8 text-neutral-800">✦</span>
              </React.Fragment>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Marquee;