import React, { useState, useRef, useEffect } from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { useNavigation } from '../hooks/useNavigation';
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
        id: 'sell-the-invisible',
        title: 'Sell Before You Build',
        description: 'Drive deposits before ground is broken. From architectural plans alone, we build your complete pre-sales ecosystem: photorealistic exterior hero shots at golden hour, styled interior lifestyle renders for every unit type, aerial context views showing the development in its neighborhood, a cinematic launch film, furnished 3D floor plans, a multi-room interactive virtual tour with customizable finishes, and a sales center touchscreen app with unit selection and availability filtering. Everything an off-plan buyer needs to commit — delivered months before construction completes.',
        problem: 'I need to sell something that doesn\'t exist yet',
        value: 'Revenue before construction',
        mediaType: 'video' as const,
        src: 'https://archicgi.com/wp-content/uploads/2023/08/future-interior-animation-web-min.mp4',
    },
    {
        id: 'investor-confidence',
        title: 'The Investor Confidence Package',
        description: 'Visuals that speak to ROI, not just aesthetics. We deliver aerial masterplan views showing the development at scale, phasing animations illustrating the construction and delivery timeline, styled interior renders that demonstrate market positioning, construction progress timelapse frameworks, and a branded presentation deck — everything an investor needs to see the return before writing the check. Keep stakeholders engaged and confident from capital raise through handover.',
        problem: 'I need to secure investor buy-in early',
        value: 'Confidence and clarity for stakeholders',
        mediaType: 'image' as const,
        src: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&q=80',
    },
    {
        id: 'listing-transformation',
        title: 'The Listing Transformation',
        description: 'Turn an empty property into a scroll-stopping listing in 48 hours. We virtually stage every key room in a style matched to your target demographic — Scandi minimalist, Hamptons luxury, industrial chic — at 90% less than physical staging. Convert your daytime exterior into a dramatic twilight hero shot with glowing windows. Deliver a furnished 3D floor plan that communicates layout at a glance, plus dollhouse cutaway views that show the full spatial flow. The complete visual upgrade that makes buyers stop scrolling and start calling.',
        problem: 'My listing isn\'t getting enough engagement',
        value: 'More clicks, faster sales, higher prices',
        mediaType: 'slider' as const,
        before: 'https://archicgi.com/wp-content/uploads/2023/07/apartment-photo-without-virtual-staging.jpg',
        after: 'https://archicgi.com/wp-content/uploads/2023/07/real-estate-photo-with-virtual-staging.jpg',
        labelBefore: 'Vacant',
        labelAfter: 'Staged',
    },
    {
        id: 'listing-rescue',
        title: 'The Stale Listing Reset',
        description: 'Your property has been sitting on the market too long. The algorithm has buried it, and buyers have scrolled past it. We completely reimagine the visual identity: re-stage rooms targeting a different demographic, add a twilight exterior conversion, produce fresh aerial context imagery highlighting nearby amenities, and deliver a new set of social video clips. A visual reset that makes a stale listing feel brand new — to both the algorithm and the buyer.',
        problem: 'My listing has gone cold',
        value: 'Renewed interest and fresh momentum',
        mediaType: 'slider' as const,
        before: 'https://archicgi.com/wp-content/uploads/2023/07/apartment-photo-without-virtual-staging.jpg',
        after: 'https://archicgi.com/wp-content/uploads/2023/07/real-estate-photo-with-virtual-staging.jpg',
        labelBefore: 'Before',
        labelAfter: 'After',
    },
    {
        id: 'twilight-conversion',
        title: 'Twilight & Lighting Magic',
        description: 'The single highest-impact visual upgrade for any listing. We convert daytime exteriors into dramatic dusk hero shots with warmly glowing windows and a cinematic sky — proven to increase click-through rates and time-on-listing across every major portal. One image that makes any property feel premium.',
        problem: 'My listing looks ordinary in daylight',
        value: 'Dramatic, premium appeal that stands out',
        mediaType: 'slider' as const,
        before: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80',
        after: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1200&q=80',
        labelBefore: 'Day',
        labelAfter: 'Dusk',
    },
    {
        id: 'always-open',
        title: 'The 24/7 Open House',
        description: 'Your listing never closes. We give international and out-of-state buyers a complete property experience from their couch: 8K 360° panoramas of every room with hotspot navigation, a cinematic walkthrough film that conveys spatial flow, dollhouse cutaway views showing the full layout, interactive floor plans, and information overlays — all accessible via a single shareable link on any device including VR headsets. Embed directly into your MLS listing, website, or email campaign. No app download, no scheduling, no missed opportunities.',
        problem: 'Remote/international buyers can\'t visit in person',
        value: '24/7 global access, no missed opportunities',
        mediaType: 'image' as const,
        src: 'https://images.unsplash.com/photo-1557900455-628858ed0859?w=1200&q=80',
    },
    {
        id: 'sell-the-location',
        title: 'Sell the Location',
        description: 'Location is everything — and we make it visible. Aerial renders and drone photomontages highlighting proximity to transit, schools, parks, and amenities. An interactive neighborhood map with key points of interest pinned. Pedestrian-level exterior renders showing streetscape activity and local life. Lot boundary overlays and walking distance indicators. Contextual video content proving lifestyle value to buyers who\'ve never visited the area. Because the best unit in a bad location doesn\'t sell — and a great location poorly communicated sells slowly.',
        problem: 'Buyers don\'t understand the location value',
        value: 'Sell the lifestyle, not just the unit',
        mediaType: 'image' as const,
        src: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1200&q=80',
    },
    {
        id: 'social-content-engine',
        title: 'Social-First Content Engine',
        description: 'Content designed for the algorithm, not the brochure. One production session delivers weeks of postable content: punchy vertical (9:16) property tours with fast cuts and music for Instagram Reels and TikTok, dramatic before-after staging reveals, aerial fly-arounds that open with scale and descend to detail, room-by-room transition reels, cinematic landscape cuts for YouTube and Facebook, and square crops for feed posts. Every asset optimized for maximum engagement on its target platform — maximizing your reach without multiplying your spend.',
        problem: 'I need content that performs on social media',
        value: 'Weeks of platform-optimized content from one session',
        mediaType: 'video' as const,
        src: 'https://archicgi.com/wp-content/uploads/2024/01/3d-rendering-for-real-estate-agents-animation-03-web.mp4',
    },
    {
        id: 'brand-ecosystem',
        title: 'The Development Brand Ecosystem',
        description: 'Treat your building like a luxury product. We produce a complete branded visual system: exterior hero shots, interior lifestyle renders, aerial context views, a cinematic teaser film, interactive virtual tours, print-ready 8K images for hoardings and brochures (CMYK-ready with safe zones for text and logo), and a sales center touchscreen application — all unified by your development\'s color palette, typography, and visual identity. One studio, one visual language, every touchpoint covered.',
        problem: 'I need a unified brand for my development',
        value: 'Premium positioning across every touchpoint',
        mediaType: 'image' as const,
        src: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1200&q=80',
    },
];

const RealEstateAgentSolutions: React.FC<{ onNavigate: (page: Page) => void }> = ({ onNavigate }) => {
    const [heroRef, heroVisible] = useIntersectionObserver<HTMLElement>();
    const [activeSolutionIndex, setActiveSolutionIndex] = useState(0);
    const solutionRefs = useRef<(HTMLDivElement | null)[]>([]);
    const [isQuoteFormOpen, setIsQuoteFormOpen] = useState(false);
    const { navigateToContact } = useNavigation();

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
    const handleContact = (e: React.MouseEvent) => { e.preventDefault(); navigateToContact(onNavigate); };

    return (
        <div className="bg-neutral-950 min-h-screen pt-20">
            {/* Hero */}
            <section ref={heroRef} className="relative pt-24 pb-20 px-6 lg:px-12 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img src="https://archicgi.com/wp-content/uploads/2023/07/3d-rendering-for-real-estate-agents-residence.jpg" alt="Real Estate Visualization" className="w-full h-full object-cover opacity-20 grayscale" />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/90 to-transparent" />
                </div>
                <div className="relative z-10 px-6 lg:px-12 text-center lg:text-left">
                    <button onClick={() => { onNavigate('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="inline-flex items-center gap-2 text-neutral-400 hover:text-white mb-8 transition-colors text-sm tracking-wide uppercase">
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
                                <div className="relative w-full h-full rounded-3xl overflow-hidden border border-white/10 bg-neutral-900 shadow-2xl p-12 flex flex-col justify-center">
                                    {activeSolution && (
                                        <div key={activeSolution.id} className="animate-in fade-in duration-700 space-y-8">
                                            <div className="space-y-4">
                                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-full text-red-400 text-xs uppercase tracking-wider">
                                                    Problem
                                                </div>
                                                <p className="text-white text-2xl font-display leading-relaxed">
                                                    "{activeSolution.problem}"
                                                </p>
                                            </div>
                                            <div className="w-full h-px bg-gradient-to-r from-white/20 to-transparent" />
                                            <div className="space-y-4">
                                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-full text-green-400 text-xs uppercase tracking-wider">
                                                    Value
                                                </div>
                                                <p className="text-white text-2xl font-display leading-relaxed">
                                                    {activeSolution.value}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="w-full lg:w-1/2">
                            {solutionsData.map((solution, index) => (
                                <div key={solution.id} ref={el => { solutionRefs.current[index] = el; }} className="min-h-[80vh] flex flex-col justify-center py-20 border-b border-white/5 last:border-0">
                                    <div className="lg:hidden w-full aspect-video rounded-2xl overflow-hidden mb-8 border border-white/10 relative p-8 flex flex-col justify-center bg-neutral-900">
                                        <div className="space-y-6">
                                            <div className="space-y-3">
                                                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-500/10 border border-red-500/20 rounded-full text-red-400 text-xs uppercase tracking-wider">
                                                    Problem
                                                </div>
                                                <p className="text-white text-lg font-display leading-relaxed">
                                                    "{solution.problem}"
                                                </p>
                                            </div>
                                            <div className="w-full h-px bg-gradient-to-r from-white/20 to-transparent" />
                                            <div className="space-y-3">
                                                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-500/10 border border-green-500/20 rounded-full text-green-400 text-xs uppercase tracking-wider">
                                                    Value
                                                </div>
                                                <p className="text-white text-lg font-display leading-relaxed">
                                                    {solution.value}
                                                </p>
                                            </div>
                                        </div>
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
