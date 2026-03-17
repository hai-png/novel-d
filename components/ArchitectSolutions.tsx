import React, { useState, useRef, useEffect } from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { useNavigation } from '../hooks/useNavigation';
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
        title: 'Win the Competition',
        description: 'You have three weeks and one shot. From a single model handoff, we deliver the complete visual submission: atmospheric exterior hero shots at golden hour, aerial photomontages composited into real drone photography of the site, key interior moments that sell the spatial experience, technical diagrams — exploded axonometrics, section perspectives, and site plan illustrations — and a 60-second cinematic flythrough tying it all together. Built for deadline pressure: our rush pipeline can deliver full packages in under a week.',
        problem: 'I need to win a competition under deadline pressure',
        value: 'A jury-ready visual package, fast',
        mediaType: 'image' as const,
        src: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=1200&q=80',
    },
    {
        id: 'client-comprehension',
        title: 'Make Clients See What You See',
        description: 'Your client doesn\'t read plans. We translate your design into their language: photorealistic exterior and interior stills that capture materiality and light, a cinematic first-person walkthrough showing the experience of moving through the building, room-by-room 360° panoramas they can explore on their phone, furnished 3D floor plans that communicate scale, and dollhouse cutaway views that explain spatial hierarchy at a glance. Shareable via a single link with decision-makers who can\'t attend the meeting. The complete package that eliminates "I didn\'t realize it would look like that."',
        problem: 'My client doesn\'t understand the design from drawings',
        value: 'Instant comprehension, faster sign-off',
        mediaType: 'image' as const,
        src: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=1200&q=80',
    },
    {
        id: 'design-decisions',
        title: 'Resolve Design Decisions Visually',
        description: 'Before you specify, see it at full scale. We render the same viewpoint with multiple options — brick versus zinc versus timber cladding, warm versus cool lighting temperatures, day versus dusk versus night conditions — creating a systematic visual matrix that transforms subjective taste debates into objective design conversations. Includes digital maquettes (pure white clay renders) for early massing reviews and full photorealistic stills for final material sign-off. Avoid costly post-tender changes with evidence your client can hold in their hands.',
        problem: 'Material and facade decisions stall the project',
        value: 'Objective visual evidence that accelerates decisions',
        mediaType: 'slider' as const,
        before: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=80',
        after: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&q=80',
        labelBefore: 'Brick Option',
        labelAfter: 'Zinc Option',
    },
    {
        id: 'immersive-review',
        title: 'Real-Time Design Review',
        description: 'Replace pin-up boards with immersive experiences. We deliver interactive real-time 3D environments where your design team and clients orbit the exterior, walk through interiors, toggle between day and night lighting, switch weather conditions, compare cladding options, and test furniture layouts — all live during the meeting at interactive frame rates. Decisions happen in the room, not in follow-up emails. Accessible via web browser, large-format touchscreen, or VR headset.',
        problem: 'Design reviews are slow and decisions happen in emails',
        value: 'Real-time collaborative exploration, decisions in the room',
        mediaType: 'image' as const,
        src: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=1200&q=80',
    },
    {
        id: 'planning-evidence',
        title: 'Planning & Technical Evidence',
        description: 'Visual documentation that satisfies planning authorities. Precise aerial shadow studies simulating accurate solar positioning for your latitude at specific dates and times throughout the year. Aerial photomontages composited into verified site photography. Construction phasing animations showing the build sequence from foundations through completion. Exploded axonometrics, section perspectives, and site plan diagrams rendered with technical clarity and visual authority. Everything you need to demonstrate compliance and win approval.',
        problem: 'Planning submissions need technical visual evidence',
        value: 'Compliant, precise, approval-ready documentation',
        mediaType: 'image' as const,
        src: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&q=80',
    },
    {
        id: 'masterplan-at-scale',
        title: 'Communicate the Masterplan',
        description: 'Show the full scope at every scale. We combine aerial context films — cinematic drone-style flythroughs revealing how your buildings integrate with the city fabric — with technical masterplan illustrations including site plans, circulation diagrams, phasing graphics, and construction sequencing animations. The complete visual narrative from urban strategy down to unit detail, essential for investor presentations, stakeholder alignment, and public consultation.',
        problem: 'I need to communicate a large-scale masterplan',
        value: 'Multi-scale narrative from city context to unit detail',
        mediaType: 'video' as const,
        src: 'https://archicgi.com/wp-content/uploads/2022/05/virtual-reality-architecture-presentation.mp4',
    },
    {
        id: 'practice-visibility',
        title: 'Build Your Practice\'s Brand',
        description: 'Build your firm\'s public presence without hiring a film crew. From your existing visualization models, we produce a rolling content pipeline: vertical 9:16 fly-arounds for Instagram Reels, polished portfolio renders of projects still in construction, cinematic 30-second project teasers for LinkedIn, and high-resolution stills for awards submissions and publications — giving you months of content from a single production session.',
        problem: 'My practice has no consistent public presence',
        value: 'Months of content from existing project models',
        mediaType: 'video' as const,
        src: 'https://archicgi.com/wp-content/uploads/2024/01/3d-rendering-for-real-estate-agents-animation-03-web.mp4',
    },
    {
        id: 'concept-to-completion',
        title: 'Concept to Completion',
        description: 'A phased visualization program that grows with your project. Digital maquettes at concept stage, photorealistic stills at DA submission, aerial photomontage for planning, cinematic animation for marketing launch, and immersive tours for the sales center. One studio, one visual language, from first sketch to final sale — eliminating ramp-up time, maintaining consistency, and compounding quality with every phase.',
        problem: 'I need one partner from concept through sale',
        value: 'Visual consistency, no ramp-up time, compounding quality',
        mediaType: 'image' as const,
        src: 'https://images.unsplash.com/photo-1460472178825-e5240623afd5?w=1200&q=80',
    },
];

const ArchitectSolutions: React.FC<{ onNavigate: (page: Page) => void }> = ({ onNavigate }) => {
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
                    <img src="https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=1200&q=80" alt="Architecture Visualization" className="w-full h-full object-cover opacity-20 grayscale" />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/90 to-transparent" />
                </div>
                <div className="relative z-10 px-6 lg:px-12 text-center lg:text-left">
                    <button onClick={() => { onNavigate('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="inline-flex items-center gap-2 text-neutral-400 hover:text-white mb-8 transition-colors text-sm tracking-wide uppercase">
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
