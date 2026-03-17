import React, { useState, useRef, useEffect } from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { useNavigation } from '../hooks/useNavigation';
import { ArrowLeft, ChevronDown, Plus, Minus, Palette, UserCheck, Image as ImageIcon, Lightbulb, Eye, Layers, PenTool, CheckCircle2, Box, Camera } from 'lucide-react';
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
    // ═══════════════════════════════════════════════════════════════
    // PROBLEM: "Clients can't visualize the finished space from samples"
    // VALUE: Visceral emotional preview that drives approval
    // ═══════════════════════════════════════════════════════════════
    {
        id: 'see-before-you-build',
        title: 'See It Before It\'s Built',
        description: 'Turn your mood board into a photorealistic 4K environment your client can feel. We focus on the intangibles that swatches can\'t convey — soft linen draping over an armchair, warm pools of light falling across a stone floor, the way morning sun hits a marble backsplash. Every key room rendered with the exact emotional atmosphere you intended, so clients experience the finished space viscerally — not intellectually. Approvals happen in the room, not three revisions later.',
        mediaType: 'image' as const,
        src: 'https://archicgi.com/wp-content/uploads/2023/08/3d-visualization-interior-living-room.jpeg',
    },

    // ═══════════════════════════════════════════════════════════════
    // PROBLEM: "Material and finish decisions take too many rounds"
    // VALUE: Objective side-by-side comparisons that end debates
    // ═══════════════════════════════════════════════════════════════
    {
        id: 'eliminate-guesswork',
        title: 'Eliminate Material Guesswork',
        description: 'End "I didn\'t think it would look like that" forever. We render the same view with different material options side by side — oak vs walnut flooring, warm vs cool marble veining, matte vs gloss cabinetry — plus day-to-night lighting studies that prove your lighting scheme works at every hour, comparing Kelvin temperatures in context. A systematic visual decision-making tool that protects against expensive on-site changes, reassures hesitant clients, and turns subjective taste debates into confident, documented choices.',
        mediaType: 'slider' as const,
        before: 'https://archicgi.com/wp-content/uploads/2025/09/living-room-interior-3d-rendering-MU5SFJXV-4000x2250.jpg',
        after: 'https://archicgi.com/wp-content/uploads/2025/09/interior-render-drawing-room.webp',
        labelBefore: 'Option A',
        labelAfter: 'Option B',
    },

    // ═══════════════════════════════════════════════════════════════
    // PROBLEM: "Lighting design is hard to validate before install"
    // VALUE: Test every fixture and condition in advance
    // ═══════════════════════════════════════════════════════════════
    {
        id: 'lighting-validation',
        title: 'Validate Lighting Before Installation',
        description: 'Test your entire lighting plan before a single fixture is ordered. We render the same space across natural daylight, warm evening ambiance, and full artificial illumination — showing precisely how your downlights, pendants, sconces, and accent strips interact with surfaces and transform the atmosphere through the day. Compare warm vs cool Kelvin temperatures, adjust fixture placement, and lock in the perfect mood with photographic evidence — not guesswork.',
        mediaType: 'slider' as const,
        before: 'https://archicgi.com/wp-content/uploads/2024/09/3d-visualization-large-hotel-malta-befor.jpg',
        after: 'https://archicgi.com/wp-content/uploads/2024/09/exterior-render-commercial-real-estate-malta-after.jpg',
        labelBefore: 'Natural Light',
        labelAfter: 'Evening Ambiance',
    },

    // ═══════════════════════════════════════════════════════════════
    // PROBLEM: "Client meetings end without decisions"
    // VALUE: Real-time co-design that locks in choices on the spot
    // ═══════════════════════════════════════════════════════════════
    {
        id: 'decide-in-the-room',
        title: 'Decide in the Room',
        description: 'Stop losing weeks to post-meeting revision cycles. Our real-time interactive environment lets you and your client co-design during the meeting: swap kitchen cabinets, toggle between two sofa options, change wall colors, switch flooring materials — every combination updates instantly on screen. Clients see the impact of their choices in context, gain confidence immediately, and sign off before they leave the room. The most powerful design approval tool available.',
        mediaType: 'slider' as const,
        before: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=1200&q=80',
        after: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1200&q=80',
        labelBefore: 'Scheme A',
        labelAfter: 'Scheme B',
    },

    // ═══════════════════════════════════════════════════════════════
    // PROBLEM: "High-value clients are overseas and can't visit"
    // VALUE: Full design experience delivered remotely
    // ═══════════════════════════════════════════════════════════════
    {
        id: 'present-anywhere',
        title: 'Present to Clients Anywhere',
        description: 'Your best clients are in Dubai, London, or New York. We deliver the complete design experience remotely: every room rendered in 4K with consistent material accuracy, connected by a full 8K 360° virtual tour with intuitive room-to-room navigation, real-time material customization controls they can interact with themselves, and a cinematic walkthrough film for the initial "wow" moment. All accessible via a single shareable link on any device or VR headset. Your design presentation becomes an immersive experience, not a PDF attachment.',
        mediaType: 'video' as const,
        src: 'https://archicgi.com/wp-content/uploads/2023/08/future-interior-animation-web-min.mp4',
    },

    // ═══════════════════════════════════════════════════════════════
    // PROBLEM: "I have no time or budget for content creation"
    // VALUE: Portfolio and social content from project models
    // ═══════════════════════════════════════════════════════════════
    {
        id: 'grow-your-brand',
        title: 'Grow Your Practice\'s Brand',
        description: 'Build a compelling public presence without a separate production budget. From every project\'s 3D model, we extract a full content pipeline: vertical slow-pan video loops (9:16) for Instagram Reels and TikTok, square crops for feed posts, cinematic landscape clips for YouTube, and high-resolution portfolio stills for your website and publications. One project delivers weeks of scroll-stopping content that showcases your design talent and attracts the next client.',
        mediaType: 'image' as const,
        src: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=1200&q=80',
    },
];

const InteriorDesignersSolutions: React.FC<{ onNavigate: (page: Page) => void }> = ({ onNavigate }) => {
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
                    <img src="https://archicgi.com/wp-content/uploads/2023/08/3d-rendering-for-interior-designers.jpg" alt="Interior Design Visualization" className="w-full h-full object-cover opacity-20 grayscale" />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/90 to-transparent" />
                </div>
                <div className="relative z-10 px-6 lg:px-12 text-center lg:text-left">
                    <button onClick={() => { onNavigate('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="inline-flex items-center gap-2 text-neutral-400 hover:text-white mb-8 transition-colors text-sm tracking-wide uppercase">
                        <ArrowLeft size={16} /> Back to Home
                    </button>
                    <h1 className={`font-display text-5xl md:text-8xl font-medium mb-8 leading-tight tracking-tighter uppercase transition-all duration-1000 ${heroVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                        For Interior <br /><span className="text-stroke text-white/90">Designers</span>
                    </h1>
                    <p className={`text-neutral-400 text-xl md:text-2xl max-w-3xl leading-relaxed mx-auto lg:mx-0 transition-all duration-1000 delay-200 ${heroVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                        Photorealistic stills, lighting studies, real-time material configurators, and walkthrough animation — workflows that validate your design decisions and get client approval faster.
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
                        { title: 'Material Truth', desc: 'Physically simulated fabrics, stone, metal, and timber. Your specification rendered with texture and light accuracy that matches reality.', icon: Palette },
                        { title: 'Faster Approval', desc: 'Clients see exactly what they\'re getting. Stills, tours, and live configurators eliminate revision cycles and miscommunication.', icon: UserCheck },
                        { title: 'Portfolio Ready', desc: 'Publish high-end imagery for projects still under construction — or designs that were never built. No photographer needed.', icon: ImageIcon },
                        { title: 'Risk Reduction', desc: 'Test bold choices in photorealistic context before ordering. Prevent costly on-site changes and protect your design intent.', icon: Lightbulb },
                    ].map((item, i) => (
                        <div key={i} className="space-y-6 group">
                            <div className="w-12 h-12 bg-white/5 rounded-lg flex items-center justify-center text-white border border-white/10 group-hover:bg-white group-hover:text-black transition-all mx-auto lg:mx-0"><item.icon size={24} /></div>
                            <h3 className="font-display text-2xl text-white italic">{item.title}</h3>
                            <p className="text-neutral-500 text-sm leading-relaxed">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Materials Bar */}
            <section className="py-20 px-6 lg:px-12 bg-neutral-900">
                <div className="px-6 lg:px-12 text-center">
                    <p className="text-neutral-500 uppercase tracking-widest text-xs mb-8">Materials We Simulate</p>
                    <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 hover:opacity-100 transition-opacity duration-500">
                        {['Velvet', 'Marble', 'Brass', 'Bouclé', 'Limestone', 'Walnut', 'Linen'].map((s, i) => (
                            <span key={i} className="text-xl md:text-2xl font-display text-white italic">{s}</span>
                        ))}
                    </div>
                </div>
            </section>

            {/* Sticky Scroll */}
            <section className="relative bg-neutral-950 border-t border-white/5">
                <div className="px-6 lg:px-12">
                    <div className="text-center py-20">
                        <h2 className="font-display text-4xl md:text-5xl mb-8 tracking-tighter uppercase italic">Design Workflows</h2>
                        <p className="text-neutral-400 text-lg max-w-3xl mx-auto">Visual solutions for every stage of the interior design process.</p>
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
                                        <button onClick={() => onNavigate('projects')} className="px-6 py-3 border border-white/20 rounded-full text-sm hover:bg-white hover:text-black transition-all uppercase tracking-widest cursor-hover">View Portfolio</button>
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
                    <h2 className="font-display text-4xl md:text-5xl uppercase tracking-tighter leading-tight italic mb-16 text-center">The Design <span className="not-italic text-neutral-400">Loop</span></h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { step: '01', title: 'Share Your Vision', text: 'Send CAD plans, mood boards, and your FF&E schedule. Tell us what you need — stills, animation, tour, configurator, or all of it.', icon: PenTool },
                            { step: '02', title: 'White Model Review', text: 'We deliver clay renders to confirm geometry, furniture scale, and camera angles. For animation, a low-res animatic locks pacing.', icon: Box },
                            { step: '03', title: 'Material Application', text: 'Your specified fabrics, finishes, and fixtures are applied across every deliverable — stills, panoramas, and video frames — from one model.', icon: Palette },
                            { step: '04', title: 'Delivery & Review', text: '4K stills for presentations. Tour links for remote clients. Video for social. Immersive builds for live reviews. Revisions included.', icon: CheckCircle2 },
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
                            { q: 'Can you model bespoke furniture from my drawings?', a: 'Yes. Send us your sketches, reference photos, or shop drawings and we model custom pieces from scratch — down to stitching, grain direction, and hardware finish.' },
                            { q: 'How accurate are the material textures?', a: 'We use high-resolution PBR textures with physically accurate light behavior. If you specify a manufacturer product (e.g., a Kvadrat fabric or Calacatta Oro marble), we source or create an exact digital match.' },
                            { q: 'What\'s the difference between stills, a tour, and a configurator?', a: 'Stills are fixed 4K images. A virtual tour is a set of linked 360° panoramas navigated via hotspots. A configurator is a real-time 3D environment where you change materials live. They serve different purposes and can be combined.' },
                            { q: 'Do you offer pricing for full home projects?', a: 'Yes. For projects including multiple rooms, a walkthrough animation, and a virtual tour, we offer project-based pricing that is significantly more efficient than per-room rates.' },
                            { q: 'Can the same model produce stills AND a walkthrough video?', a: 'Absolutely. We build one unified 3D scene and extract 4K stills, animation frames, 360° panoramas, and real-time assets in parallel. Visual consistency across every output is guaranteed.' },
                        ].map((item, i) => <FAQItem key={i} question={item.q} answer={item.a} />)}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-32 px-6 lg:px-12 bg-neutral-900 border-t border-white/5">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="font-display text-4xl md:text-8xl mb-12 uppercase tracking-tighter leading-tight italic">Show the <br /><span className="text-neutral-500 not-italic">Design</span></h2>
                    <p className="text-neutral-400 text-xl mb-12">Stop explaining, start showing. From mood board to walkthrough — let's bring your interiors to life.</p>
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

export default InteriorDesignersSolutions;
