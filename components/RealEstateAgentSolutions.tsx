import React, { useState, useRef, useEffect } from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { ArrowLeft, ChevronDown, Plus, Minus, Zap, Globe, DollarSign, Image as ImageIcon, Smartphone, Clock, Layout, CheckCircle2 } from 'lucide-react';
import { Page } from '../types';
import QuoteForm from './QuoteForm';

const BeforeAfterSlider = ({ before, after, labelBefore = "Before", labelAfter = "After" }: { before: string; after: string; labelBefore?: string; labelAfter?: string }) => {
    const [sliderPosition, setSliderPosition] = useState(50);
    const [isDragging, setIsDragging] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const handleMove = (clientX: number) => {
        if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            setSliderPosition(Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100)));
        }
    };
    useEffect(() => { const up = () => setIsDragging(false); window.addEventListener('mouseup', up); return () => window.removeEventListener('mouseup', up); }, []);
    return (
        <div ref={containerRef} className="relative w-full h-full overflow-hidden cursor-ew-resize select-none group" onMouseMove={e => isDragging && handleMove(e.clientX)} onMouseDown={() => setIsDragging(true)} onTouchMove={e => handleMove(e.touches[0].clientX)}>
            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${before}')` }} />
            <div className="absolute inset-0 h-full overflow-hidden border-r-2 border-white" style={{ width: `${sliderPosition}%` }}>
                <div className="absolute inset-0 h-full bg-cover bg-center" style={{ backgroundImage: `url('${after}')`, width: containerRef.current?.offsetWidth || '100%' }} />
            </div>
            <div className="absolute top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg z-10 group-hover:scale-110 transition-transform" style={{ left: `calc(${sliderPosition}% - 20px)` }}>
                <div className="flex gap-1"><div className="w-0.5 h-4 bg-black/80 rounded-full" /><div className="w-0.5 h-4 bg-black/80 rounded-full" /></div>
            </div>
            <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-md text-xs font-medium uppercase tracking-wider border border-white/10">{labelAfter}</div>
            <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-md text-xs font-medium uppercase tracking-wider border border-white/10">{labelBefore}</div>
        </div>
    );
};

const FAQItem: React.FC<{ question: string; answer: string }> = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border border-white/10 rounded-xl overflow-hidden bg-white/[0.02]">
            <button onClick={() => setIsOpen(!isOpen)} className="w-full px-6 py-5 flex items-center justify-between text-left group cursor-hover">
                <span className="font-medium text-lg text-white group-hover:text-neutral-300 transition-colors pr-8">{question}</span>
                {isOpen ? <Minus className="flex-shrink-0 w-5 h-5 text-neutral-400" /> : <Plus className="flex-shrink-0 w-5 h-5 text-neutral-400" />}
            </button>
            <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="px-6 pb-6 text-neutral-400 leading-relaxed text-sm border-t border-white/5 pt-4">{answer}</div>
            </div>
        </div>
    );
};

const solutionsData = [
    {
        id: 'listing-launch',
        title: 'Listing Launch Kit',
        description: 'Everything a new listing needs to hit the market strong — a twilight exterior hero shot, three virtually staged interior rooms, a 3D floor plan with furniture, and an embeddable 360° virtual tour. One order, one model, all assets delivered together. Formatted for MLS, Zillow, Redfin, and print.',
        mediaType: 'image' as const,
        src: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80',
    },
    {
        id: 'virtual-staging',
        title: 'Virtual Staging & Restyling',
        description: 'Fill empty rooms with aspirational furniture at a fraction of physical staging costs. Choose from curated style packages — Scandi, Mid-Century, Hampton, Industrial — or let us recommend based on your target buyer demographic. Switch styles instantly to A/B test which listing photos generate more inquiries.',
        mediaType: 'slider' as const,
        before: 'https://archicgi.com/wp-content/uploads/2023/07/apartment-photo-without-virtual-staging.jpg',
        after: 'https://archicgi.com/wp-content/uploads/2023/07/real-estate-photo-with-virtual-staging.jpg',
        labelBefore: 'Vacant',
        labelAfter: 'Staged',
    },
    {
        id: 'virtual-renovation',
        title: 'Virtual Renovation',
        description: 'Dated kitchen? Tired bathroom? We digitally strip out the old and install the new — modern cabinetry, updated tiles, contemporary fixtures. Buyers see the potential of a renovation without the mess. Pair with a realistic cost estimate to show ROI and convert hesitant investors into confident buyers.',
        mediaType: 'slider' as const,
        before: 'https://archicgi.com/wp-content/uploads/2022/04/virtual-renovation-for-real-estate-living-room-before.jpg',
        after: 'https://archicgi.com/wp-content/uploads/2022/04/virtual-renovation-for-real-estate-living-room-after.jpg',
        labelBefore: 'Current',
        labelAfter: 'Renovated',
    },
    {
        id: 'off-plan-sales',
        title: 'Off-Plan Sales Package',
        description: 'Sell buildings that don\'t exist yet. From floor plans alone, we produce exterior hero renders, furnished interior scenes, aerial context views, 3D floor plans, a cinematic flythrough animation, and an interactive virtual tour with unit selection. A complete marketing ecosystem that drives deposits before ground is broken.',
        mediaType: 'image' as const,
        src: 'https://images.unsplash.com/photo-1460472178825-e5240623afd5?w=1200&q=80',
    },
    {
        id: 'virtual-open-house',
        title: '24/7 Virtual Open House',
        description: 'An interactive 360° tour with hotspot navigation, floor plan mini-map, and embedded property details. Buyers walk through every room at their own pace from any device — phone, tablet, desktop. Share a single link via email or embed directly into your listing. No app, no download, no scheduling.',
        mediaType: 'image' as const,
        src: 'https://images.unsplash.com/photo-1557900455-628858ed0859?w=1200&q=80',
    },
    {
        id: 'social-content',
        title: 'Social Media Engine',
        description: 'Vertical video tours (9:16) for Reels and TikTok. Landscape walkthroughs (16:9) for YouTube. Square hero crops for feeds. All cut from a single cinematic animation of the property — one production, every platform covered. We deliver ready-to-post files with safe zones for your logo and listing details.',
        mediaType: 'video' as const,
        src: 'https://archicgi.com/wp-content/uploads/2024/01/3d-rendering-for-real-estate-agents-animation-03-web.mp4',
    },
    {
        id: 'aerial-context',
        title: 'Aerial Neighborhood Showcase',
        description: 'Location sells the listing. Aerial renders and drone photomontage show the property in its full surroundings — walking distance to transit, proximity to parks and schools, nearby amenities highlighted. Lot boundaries overlaid on aerial shots eliminate confusion about what\'s included in the sale.',
        mediaType: 'image' as const,
        src: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1200&q=80',
    },
    {
        id: 'sales-center',
        title: 'Interactive Sales Center',
        description: 'A touchscreen experience for your showroom. Buyers select units from an interactive building model, explore interiors with live finish customization, compare balcony views from different floors, and toggle between day and night. Your sales team guides the journey on a large-format display that closes deals.',
        mediaType: 'image' as const,
        src: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=1200&q=80',
    },
];

const RealEstateAgentSolutions: React.FC<{ onNavigate: (page: Page) => void }> = ({ onNavigate }) => {
    const [heroRef, heroVisible] = useIntersectionObserver<HTMLElement>();
    const [activeSolutionIndex, setActiveSolutionIndex] = useState(0);
    const solutionRefs = useRef<(HTMLDivElement | null)[]>([]);
    const [isQuoteFormOpen, setIsQuoteFormOpen] = useState(false);

    useEffect(() => {
        const observers = solutionRefs.current.map((ref, index) => {
            if (!ref) return null;
            const observer = new IntersectionObserver(
                ([entry]) => { if (entry.isIntersecting) setActiveSolutionIndex(index); },
                { threshold: 0.5, rootMargin: '-20% 0px -20% 0px' }
            );
            observer.observe(ref);
            return observer;
        });
        return () => { observers.forEach(obs => obs?.disconnect()); };
    }, []);

    const activeSolution = solutionsData[activeSolutionIndex];
    const handleContact = (e: React.MouseEvent) => { e.preventDefault(); onNavigate('home'); setTimeout(() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }), 100); };

    return (
        <div className="bg-neutral-950 min-h-screen pt-20">
            {/* Hero */}
            <section ref={heroRef} className="relative pt-24 pb-20 px-6 lg:px-12 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img src="https://archicgi.com/wp-content/uploads/2023/07/3d-rendering-for-real-estate-agents-residence.jpg" alt="Real Estate Visualization" className="w-full h-full object-cover opacity-20 grayscale" />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/90 to-transparent" />
                </div>
                <div className="relative z-10 px-6 lg:px-12 text-center lg:text-left">
                    <button onClick={() => onNavigate('home')} className="inline-flex items-center gap-2 text-neutral-400 hover:text-white mb-8 transition-colors text-sm tracking-wide uppercase">
                        <ArrowLeft size={16} /> Back to Home
                    </button>
                    <h1 className={`font-display text-5xl md:text-8xl font-medium mb-8 leading-tight tracking-tighter uppercase transition-all duration-1000 ${heroVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                        For <br /><span className="text-stroke text-white/90">Real Estate</span>
                    </h1>
                    <p className={`text-neutral-400 text-xl md:text-2xl max-w-3xl leading-relaxed mx-auto lg:mx-0 transition-all duration-1000 delay-200 ${heroVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                        Virtual staging, 3D floor plans, cinematic video, aerial context, and interactive tours — packaged to move listings faster, reach remote buyers, and sell off-plan developments.
                    </p>
                </div>
                <div className={`absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 transition-opacity duration-700 ${heroVisible ? 'opacity-100' : 'opacity-0'}`}>
                    <span className="text-xs uppercase tracking-widest text-white/50">Explore Solutions</span>
                    <ChevronDown className="w-5 h-5 text-white/50 animate-bounce" />
                </div>
            </section>

            {/* Value Props */}
            <section className="py-24 px-6 lg:px-12 bg-neutral-950 border-y border-white/5">
                <div className="px-6 lg:px-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 text-center lg:text-left">
                    {[
                        { title: 'List Faster', desc: 'Don\'t wait for renovations or staging furniture. Virtually stage vacant properties and list unbuilt developments today.', icon: Zap },
                        { title: 'Sell Remotely', desc: 'Virtual tours and interactive experiences give out-of-state and international buyers a 24/7 open house on any device.', icon: Globe },
                        { title: 'Spend Less', desc: 'Virtual staging costs 90% less than physical. One 3D model produces stills, video, floor plans, and tours simultaneously.', icon: DollarSign },
                        { title: 'Convert More', desc: 'Furnished rooms, twilight exteriors, and walkthrough video create the emotional hook that makes buyers mentally move in.', icon: ImageIcon },
                    ].map((item, i) => (
                        <div key={i} className="space-y-6 group">
                            <div className="w-12 h-12 bg-white/5 rounded-lg flex items-center justify-center text-white border border-white/10 group-hover:bg-white group-hover:text-black transition-all mx-auto lg:mx-0"><item.icon size={24} /></div>
                            <h3 className="font-display text-2xl text-white italic">{item.title}</h3>
                            <p className="text-neutral-500 text-sm leading-relaxed">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Platform Bar */}
            <section className="py-20 px-6 lg:px-12 bg-neutral-900">
                <div className="px-6 lg:px-12 text-center">
                    <p className="text-neutral-500 uppercase tracking-widest text-xs mb-8">Optimized For</p>
                    <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 hover:opacity-100 transition-opacity duration-500">
                        {['MLS', 'Zillow', 'Redfin', 'Instagram', 'TikTok', 'Print'].map((s, i) => (
                            <span key={i} className="text-xl md:text-2xl font-display text-white">{s}</span>
                        ))}
                    </div>
                </div>
            </section>

            {/* Sticky Scroll */}
            <section className="relative bg-neutral-950 border-t border-white/5">
                <div className="px-6 lg:px-12">
                    <div className="text-center py-20">
                        <h2 className="font-display text-4xl md:text-5xl mb-8 tracking-tighter uppercase italic">The Listing Suite</h2>
                        <p className="text-neutral-400 text-lg max-w-3xl mx-auto">Marketing packages built to sell properties faster.</p>
                    </div>
                    <div className="lg:flex gap-16 pb-32">
                        <div className="hidden lg:block w-1/2 relative">
                            <div className="sticky top-32 h-[60vh] flex items-center">
                                <div className="relative w-full h-full rounded-3xl overflow-hidden border border-white/10 bg-neutral-900 shadow-2xl">
                                    {activeSolution && (
                                        <div key={activeSolution.id} className="absolute inset-0 animate-in fade-in duration-700">
                                            {activeSolution.mediaType === 'image' && <img src={activeSolution.src} className="w-full h-full object-cover" alt={activeSolution.title} />}
                                            {activeSolution.mediaType === 'video' && <video src={activeSolution.src} className="w-full h-full object-cover" autoPlay muted loop playsInline />}
                                            {activeSolution.mediaType === 'slider' && activeSolution.before && activeSolution.after && <BeforeAfterSlider before={activeSolution.before} after={activeSolution.after} labelBefore={activeSolution.labelBefore} labelAfter={activeSolution.labelAfter} />}
                                            <div className="absolute inset-0 bg-black/10 pointer-events-none" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="w-full lg:w-1/2">
                            {solutionsData.map((solution, index) => (
                                <div key={solution.id} ref={el => { solutionRefs.current[index] = el; }} className="min-h-[80vh] flex flex-col justify-center py-20 border-b border-white/5 last:border-0">
                                    <div className="lg:hidden w-full aspect-video rounded-2xl overflow-hidden mb-8 border border-white/10 relative">
                                        {solution.mediaType === 'image' && <img src={solution.src} className="w-full h-full object-cover" alt={solution.title} />}
                                        {solution.mediaType === 'video' && <video src={solution.src} className="w-full h-full object-cover" autoPlay muted loop playsInline />}
                                        {solution.mediaType === 'slider' && solution.before && solution.after && <BeforeAfterSlider before={solution.before} after={solution.after} labelBefore={solution.labelBefore} labelAfter={solution.labelAfter} />}
                                    </div>
                                    <h3 className="font-display text-4xl md:text-5xl text-white mb-6 italic">{solution.title}</h3>
                                    <p className="text-neutral-400 text-lg leading-relaxed mb-8">{solution.description}</p>
                                    <div className="flex gap-4">
                                        <button onClick={() => onNavigate('projects')} className="px-6 py-3 border border-white/20 rounded-full text-sm hover:bg-white hover:text-black transition-all uppercase tracking-widest cursor-hover">View Examples</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Workflow */}
            <section className="py-32 px-6 lg:px-12 bg-neutral-900 border-y border-white/5">
                <div className="px-6 lg:px-12">
                    <h2 className="font-display text-4xl md:text-5xl uppercase tracking-tighter leading-tight italic mb-16 text-center">
                        How It <span className="not-italic text-neutral-400">Works</span>
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { step: '01', title: 'Send Photos or Plans', text: 'Smartphone photos for staging. Floor plans for off-plan. Drone shots for aerial compositing. Whatever you have, we work with it.', icon: CheckCircle2 },
                            { step: '02', title: 'Pick Your Package', text: 'Choose a listing kit, staging-only, or full development suite. Select a furniture style and we propose camera angles.', icon: Layout },
                            { step: '03', title: 'We Produce', text: 'Interior stills, exterior renders, 3D plans, animation, and tour panoramas are all produced in parallel from one unified model.', icon: Clock },
                            { step: '04', title: 'You Launch', text: 'Download MLS-ready images, embed tour links, and post social cuts. Everything formatted for every platform you use.', icon: Smartphone },
                        ].map((item, i) => (
                            <div key={i} className="bg-white/5 p-8 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors relative overflow-hidden group">
                                <span className="text-6xl font-display text-white/5 absolute top-4 right-4 group-hover:text-white/10 transition-colors">{item.step}</span>
                                <item.icon className="w-8 h-8 text-white mb-6" />
                                <h3 className="text-xl font-display text-white mb-4">{item.title}</h3>
                                <p className="text-neutral-400 text-sm leading-relaxed">{item.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className="py-32 px-6 lg:px-12 bg-neutral-950">
                <div className="max-w-3xl mx-auto">
                    <h2 className="font-display text-4xl mb-12 text-center">Frequently Asked <span className="text-stroke">Questions</span></h2>
                    <div className="space-y-4">
                        {[
                            { q: 'How fast can I get staged photos?', a: 'Virtual staging turnaround is 24–48 hours. A full listing launch kit (exterior, interiors, floor plan, tour) is typically 5–7 days.' },
                            { q: 'Do you need professional photography?', a: 'For virtual staging, clean smartphone photos with decent lighting work well. For off-plan properties, we create everything from floor plans — no photography needed at all.' },
                            { q: 'Can I change the furniture style after delivery?', a: 'Yes. We can restyle the same room in a different look for a small additional fee — great for A/B testing which style attracts more inquiries.' },
                            { q: 'Are the images compliant with listing platforms?', a: 'Every file is delivered in the exact resolution, aspect ratio, and file size required by MLS, Zillow, Redfin, and Realtor.com. Print-ready CMYK versions are included separately.' },
                            { q: 'Can buyers access the virtual tour on their phone?', a: 'Yes. Tours are browser-based and fully responsive. On smartphones, gyroscope viewing automatically activates — buyers physically turn the phone to look around. No app or download required.' },
                        ].map((item, i) => <FAQItem key={i} question={item.q} answer={item.a} />)}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-32 px-6 lg:px-12 bg-neutral-900 border-t border-white/5">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="font-display text-4xl md:text-8xl mb-12 uppercase tracking-tighter leading-tight italic">Ready to <br /><span className="text-neutral-500 not-italic">Sell?</span></h2>
                    <p className="text-neutral-400 text-xl mb-12">Staging, tours, video, and aerials — one order, every asset you need to move the listing.</p>
                    <button 
                        onClick={() => setIsQuoteFormOpen(true)}
                        className="inline-block bg-white text-neutral-950 px-10 py-5 text-sm font-medium hover:bg-neutral-200 transition-colors uppercase tracking-[0.2em] cursor-hover"
                    >
                        Get a Free Quote for Your Project
                    </button>
                </div>
            </section>

            {/* Quote Form Modal */}
            <QuoteForm 
                isOpen={isQuoteFormOpen} 
                onClose={() => setIsQuoteFormOpen(false)} 
            />
        </div>
    );
};

export default RealEstateAgentSolutions;