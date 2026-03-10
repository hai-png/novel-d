import React, { useState, useRef, useEffect } from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { ArrowLeft, ChevronDown, Plus, Minus, Trophy, Target, Monitor, Layers, CheckCircle2, Cpu, Globe, Eye, Film, Compass, Sun } from 'lucide-react';
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
        id: 'competition-package',
        title: 'Competition Submission',
        description: 'Everything you need to win — assembled under deadline. A hero exterior at dusk, two emotive interior atmospheres, an aerial context view, and a 30-second cinematic teaser animation. We run a dedicated rush pipeline that delivers complete competition packages in 5–7 days, scaling our team to match your deadline without sacrificing quality.',
        mediaType: 'image' as const,
        src: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=80',
    },
    {
        id: 'planning-approval',
        title: 'Planning & Approval Strategy',
        description: 'A visual case engineered to pass. We produce drone photomontage compositing your building into real site photography, verified aerial shadow studies at critical solar dates, street-level context perspectives showing setbacks and neighbor relationships, and site plan illustrations — every view a planning authority demands, produced to their specification.',
        mediaType: 'image' as const,
        src: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1200&q=80',
    },
    {
        id: 'design-iteration',
        title: 'Rapid Design Iteration',
        description: 'Visual feedback at the speed of design. White clay massing renders delivered within 48 hours to test form and proportion. Then, identical exterior viewpoints rendered with different cladding systems — brick, zinc, timber, composite — so you can compare material options side by side before committing to documentation.',
        mediaType: 'slider' as const,
        before: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=80',
        after: 'https://images.unsplash.com/photo-1558230007-427df37c7689?w=1200&q=80',
        labelBefore: 'Option A',
        labelAfter: 'Option B',
    },
    {
        id: 'cinematic-film',
        title: 'Project Film',
        description: 'A 60–90 second cinematic narrative that no static image can match. The camera sweeps aerially over rooftops, descends to street level through landscaping, enters the lobby, and flows through interior spaces — revealing spatial sequences, material transitions, and the human experience of your architecture. Scored, graded, and branded.',
        mediaType: 'video' as const,
        src: 'https://archicgi.com/wp-content/uploads/2023/08/future-interior-animation-web-min.mp4',
    },
    {
        id: 'immersive-review',
        title: 'Immersive Design Review',
        description: 'Walk your client through the building in real-time. Powered by Unreal Engine, this interactive 3D experience lets stakeholders freely explore spaces, toggle between day and night lighting, and swap material palettes on the fly. Non-technical decision-makers finally understand scale, proportion, and atmosphere — eliminating "I didn\'t picture it like that" after construction.',
        mediaType: 'image' as const,
        src: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=1200&q=80',
    },
    {
        id: 'masterplan',
        title: 'Masterplan & Phasing',
        description: 'Communicate urban strategy at a glance. A single aerial render showing the full development — building use types color-coded, circulation networks mapped, green infrastructure highlighted — followed by an animated phasing sequence showing the project rising from the ground in logical construction order. Essential for investor alignment and council presentations.',
        mediaType: 'image' as const,
        src: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1200&q=80',
    },
    {
        id: 'public-consultation',
        title: 'Public Consultation Kit',
        description: 'Visuals designed to win community support, not architectural awards. People-centric street perspectives with diverse figures, active public realm, and mature landscaping. Combined with simple 3D site plan diagrams and a short animation showing the "before and after" impact on the neighborhood — the visual language that sways public opinion at town hall.',
        mediaType: 'image' as const,
        src: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1200&q=80',
    },
    {
        id: 'technical-diagrams',
        title: 'Technical Communication',
        description: 'Architecture explained visually. Exploded axonometric drawings revealing structural assembly and programmatic zoning. Section perspectives showing vertical connectivity and daylight penetration. 3D detail callouts of facade junctions and window reveals. Every diagram rendered with technical precision and enough beauty to belong in the design report.',
        mediaType: 'image' as const,
        src: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80',
    },
];

const ArchitectSolutions: React.FC<{ onNavigate: (page: Page) => void }> = ({ onNavigate }) => {
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
                    <img src="https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=1200&q=80" alt="Architecture Visualization" className="w-full h-full object-cover opacity-20 grayscale" />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/90 to-transparent" />
                </div>
                <div className="relative z-10 px-6 lg:px-12 text-center lg:text-left">
                    <button onClick={() => onNavigate('home')} className="inline-flex items-center gap-2 text-neutral-400 hover:text-white mb-8 transition-colors text-sm tracking-wide uppercase">
                        <ArrowLeft size={16} /> Back to Home
                    </button>
                    <h1 className={`font-display text-5xl md:text-8xl font-medium mb-8 leading-tight tracking-tighter uppercase transition-all duration-1000 ${heroVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                        For <br /><span className="text-stroke text-white/90">Architects</span>
                    </h1>
                    <p className={`text-neutral-400 text-xl md:text-2xl max-w-3xl leading-relaxed mx-auto lg:mx-0 transition-all duration-1000 delay-200 ${heroVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                        Exterior renders, aerial photomontage, cinematic animation, and real-time immersive reviews — assembled into workflows that win competitions, secure planning, and align stakeholders.
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
                        { title: 'Competition Ready', desc: 'Complete visual packages delivered under deadline pressure — hero shots, context aerials, and teaser films in 5–7 days.', icon: Trophy },
                        { title: 'Planning Proof', desc: 'Verified views, shadow studies, and drone photomontage engineered to satisfy planning authority requirements.', icon: Target },
                        { title: 'Client Clarity', desc: 'Interactive tours and real-time 3D reviews that make non-technical stakeholders understand scale and space.', icon: Monitor },
                        { title: 'Pipeline Fit', desc: 'We accept Revit, Rhino, SketchUp, ArchiCAD — integrating with your tools, not replacing them.', icon: Layers },
                    ].map((item, i) => (
                        <div key={i} className="space-y-6 group">
                            <div className="w-12 h-12 bg-white/5 rounded-lg flex items-center justify-center text-white border border-white/10 group-hover:bg-white group-hover:text-black transition-all mx-auto lg:mx-0"><item.icon size={24} /></div>
                            <h3 className="font-display text-2xl text-white italic">{item.title}</h3>
                            <p className="text-neutral-500 text-sm leading-relaxed">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* What We Deploy */}
            <section className="py-20 px-6 lg:px-12 bg-neutral-900">
                <div className="px-6 lg:px-12 text-center">
                    <p className="text-neutral-500 uppercase tracking-widest text-xs mb-8">Services We Combine For You</p>
                    <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
                        {['Exterior Renders', 'Aerial Views', 'Animation', 'Interior Viz', 'Virtual Tours', 'Immersive 3D'].map((s, i) => (
                            <span key={i} className="text-xl md:text-2xl font-display text-white">{s}</span>
                        ))}
                    </div>
                </div>
            </section>

            {/* Sticky Scroll */}
            <section className="relative bg-neutral-950 border-t border-white/5">
                <div className="px-6 lg:px-12">
                    <div className="text-center py-20">
                        <h2 className="font-display text-4xl md:text-5xl mb-8 tracking-tighter uppercase italic">Tailored Workflows</h2>
                        <p className="text-neutral-400 text-lg max-w-3xl mx-auto">Purpose-built visual strategies for every stage of the architectural process.</p>
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
                                        <button onClick={() => onNavigate('projects')} className="px-6 py-3 border border-white/20 rounded-full text-sm hover:bg-white hover:text-black transition-all uppercase tracking-widest cursor-hover">See Examples</button>
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
                        How We <span className="not-italic text-neutral-400">Work</span>
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { step: '01', title: 'Model & Brief', text: 'Send your 3D model and brief. We scope the deliverables — stills, aerials, animation, tours — and propose a timeline.', icon: Cpu },
                            { step: '02', title: 'Clay Lock', text: 'White clay renders confirm geometry and cameras. Animatics lock pacing. You approve before any materials are applied.', icon: Eye },
                            { step: '03', title: 'Full Production', text: 'Materials, lighting, context, and entourage applied across all outputs — exterior, interior, aerial, and animation — from one unified model.', icon: Globe },
                            { step: '04', title: 'Multi-Format Export', text: '4K stills for print. Animation for presentation. Tour links for web. Immersive builds for reviews. Everything from one source of truth.', icon: CheckCircle2 },
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
                            { q: 'What\'s the fastest you can deliver a competition package?', a: 'Our rush team can deliver a hero exterior, two interiors, an aerial, and a 30-second animation in 5–7 working days. For extreme deadlines (48 hours), we focus on the two highest-impact deliverables.' },
                            { q: 'Can you produce verified views for planning?', a: 'Yes. We produce Accurate Visual Representations (AVRs) with correct solar angles, GPS-matched camera positions, and overlay grids. We can coordinate with your planning consultant on specific methodology requirements.' },
                            { q: 'Do you model the surrounding context?', a: 'Always. We use satellite data, site photos, and OS mapping to model the immediate neighborhood. Key neighbors are modeled at medium detail; wider context uses simplified massing.' },
                            { q: 'How does the immersive design review work technically?', a: 'We optimize your model for Unreal Engine and deploy via cloud-based pixel streaming. You share a browser link with clients — no downloads, no VR headset required. Material and lighting changes happen in real-time.' },
                            { q: 'Can one model produce stills, animation, AND a virtual tour?', a: 'Yes — that\'s our most efficient workflow. One unified 3D scene produces 4K stills, animation frames, 360° panoramas, and real-time assets simultaneously. Visual consistency is guaranteed.' },
                        ].map((item, i) => <FAQItem key={i} question={item.q} answer={item.a} />)}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-32 px-6 lg:px-12 bg-neutral-900 border-t border-white/5">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="font-display text-4xl md:text-8xl mb-12 uppercase tracking-tighter leading-tight italic">Let's Win <br /><span className="text-neutral-500 not-italic">Together</span></h2>
                    <p className="text-neutral-400 text-xl mb-12">From clay model to cinematic film. One studio, one visual language, every deliverable you need.</p>
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

export default ArchitectSolutions;