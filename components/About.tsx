import React from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

// Import images from HOME PAGE/about_us folder
const aboutImages = import.meta.glob('/src/assets/images-optimized/HOME PAGE/about_us/*.{webp,jpg,jpeg,png}', { eager: true, import: 'default' }) as Record<string, string>;
const aboutGallery = Object.values(aboutImages);

const Counter = ({ end, duration = 2000 }: { end: number, duration?: number }) => {
    const [ref, isVisible] = useIntersectionObserver<HTMLSpanElement>();
    const [count, setCount] = React.useState(0);

    React.useEffect(() => {
        if (!isVisible) return;
        let start = 0;
        const increment = end / (duration / 16);
        const timer = setInterval(() => {
            start += increment;
            if (start >= end) {
                setCount(end);
                clearInterval(timer);
            } else {
                setCount(Math.floor(start));
            }
        }, 16);
        return () => clearInterval(timer);
    }, [isVisible, end, duration]);

    return <span ref={ref}>{count}</span>;
}

const About: React.FC = () => {
  return (
    <section id="about" className="relative bg-neutral-950">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* Sticky Text Side */}
        <div className="lg:h-screen lg:sticky lg:top-0 flex items-center bg-neutral-900 px-6 lg:px-12 py-20 lg:py-0 border-r border-white/5">
            <div>
                <p className="text-neutral-500 text-sm tracking-[0.3em] uppercase mb-4">About Us</p>
                <h2 className="font-display text-4xl md:text-6xl font-medium mb-8 leading-tight">
                    Precision meets<br/>
                    <span className="text-stroke text-white">artistry</span>
                </h2>
                <div className="space-y-6 text-neutral-400 leading-relaxed max-w-xl">
                    <p>
                        Novel-D is a creative studio specializing in architectural visualization, 3D animation, immersive virtual tours, and digital content for real estate and design professionals.
                    </p>
                    <p>
                        We combine cutting-edge technology with artistic expertise to deliver compelling visual solutions—from photorealistic stills and cinematic animations to interactive 360° experiences and virtual staging. Whether you're an architect, developer, interior designer, or real estate agent, we help you showcase your vision with impact.
                    </p>
                </div>

                <div className="flex flex-wrap gap-4 my-12">
                    {['3ds Max', 'V-Ray', 'Corona', 'Unreal Engine', 'Blender', 'After Effects'].map(tech => (
                        <span key={tech} className="px-4 py-2 border border-white/10 text-sm text-neutral-400 hover:border-white/30 hover:text-white transition-all cursor-default">
                            {tech}
                        </span>
                    ))}
                </div>

                <div className="grid grid-cols-3 gap-8 pt-12 border-t border-white/10">
                    <div>
                        <p className="text-5xl font-display text-white mb-2">
                            <Counter end={200} />+
                        </p>
                        <p className="text-neutral-500 text-sm">Deliveries</p>
                    </div>
                    <div>
                        <p className="text-5xl font-display text-white mb-2">
                            <Counter end={6} />
                        </p>
                        <p className="text-neutral-500 text-sm">Core Services</p>
                    </div>
                    <div>
                        <p className="text-5xl font-display text-white mb-2">
                            <Counter end={95} />%
                        </p>
                        <p className="text-neutral-500 text-sm">Repeat Clients</p>
                    </div>
                </div>
            </div>
        </div>

        {/* Scrolling Images Side */}
        <div className="bg-neutral-950 py-32 px-6 lg:px-12 space-y-24">
            {aboutGallery.length > 0 ? aboutGallery.map((src, idx) => {
                const [ref, isVisible] = useIntersectionObserver({ threshold: 0.2, rootMargin: '0px' });
                return (
                    <div key={idx} ref={ref} className="relative overflow-hidden group">
                         <div className={`absolute inset-0 bg-neutral-950 z-10 transition-transform duration-1000 ease-in-out origin-top ${isVisible ? 'scale-y-0' : 'scale-y-100'}`}></div>
                         <img
                            src={src}
                            alt={`Studio ${idx + 1}`}
                            className="w-full aspect-[4/3] object-cover transition-transform duration-1000 group-hover:scale-105"
                        />
                    </div>
                )
            }) : (
                [
                    'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80',
                    'https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=800&q=80',
                    'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&q=80'
                ].map((src, idx) => {
                    const [ref, isVisible] = useIntersectionObserver({ threshold: 0.2, rootMargin: '0px' });
                    return (
                        <div key={idx} ref={ref} className="relative overflow-hidden group">
                             <div className={`absolute inset-0 bg-neutral-950 z-10 transition-transform duration-1000 ease-in-out origin-top ${isVisible ? 'scale-y-0' : 'scale-y-100'}`}></div>
                             <img
                                src={src}
                                alt={`Studio ${idx + 1}`}
                                className="w-full aspect-[4/3] object-cover transition-transform duration-1000 group-hover:scale-105"
                            />
                        </div>
                    )
                })
            )}
        </div>
      </div>
    </section>
  );
};

export default About;