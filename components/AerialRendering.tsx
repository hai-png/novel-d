import React, { useState, useRef, useEffect } from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { ArrowLeft, ArrowRight, Camera, Box, Palette, Image as ImageIcon, Layers, Monitor, Film, CheckCircle2, Plus, Minus } from 'lucide-react';
import { Page } from '../types';
import QuoteForm from './QuoteForm';

// Import aerial assets from /aerial/ folder (optimized WebP for images, MP4 for videos)
import AerialStaticBefore from '../src/assets/images-optimized/aerial/static/aerialstaticbefore.webp';
import AerialStaticAfter from '../src/assets/images-optimized/aerial/static/aerialstaticafter.webp';
import AerialAnimBefore from '../src/assets/images-optimized/aerial/animation/aerialanimatiobefore.mp4';
import AerialAnimAfter from '../src/assets/images-optimized/aerial/animation/aeriaanimationlafter.mp4';

// ── FAQ Component ─────────────────────────────────────────────────────
const FAQItem: React.FC<{ question: string; answer: string }> = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border border-white/10 rounded-xl overflow-hidden bg-white/[0.02]">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full px-6 py-5 flex items-center justify-between text-left group"
                aria-expanded={isOpen}
            >
                <span className="font-medium text-lg text-white group-hover:text-neutral-300 transition-colors pr-8">
                    {question}
                </span>
                {isOpen
                    ? <Minus className="flex-shrink-0 w-5 h-5 text-neutral-400" />
                    : <Plus className="flex-shrink-0 w-5 h-5 text-neutral-400" />
                }
            </button>
            <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                }`}
            >
                <div className="px-6 pb-6 pt-4 text-neutral-400 leading-relaxed text-sm border-t border-white/5">
                    {answer}
                </div>
            </div>
        </div>
    );
};

// ── Project Specs & CTA ───────────────────────────────────────────────
const ProjectSpecsCTA: React.FC<{ onOpenQuote: (service?: string) => void }> = ({ onOpenQuote }) => {
    const [selectedServiceIdx, setSelectedServiceIdx] = useState(0);
    const detailedServicesData = [
        {
            title: "Still Aerial Rendering",
            subtitle: "Photomontage integration",
            desc: "A drone photo makes a highly accurate and 100% realistic background for the 3D model. The resulting image helps customers see how the design fits the surroundings.",
            features: ["Photorealistic integration", "Accurate scale", "Real context", "High-resolution output"],
            deliverables: ["4K resolution (3840x2160)", "PNG/JPG format", "Print-ready 300 DPI", "Web-optimized versions"],
            requirements: ["Drone footage or site photos", "3D model or CAD files", "Camera angle references", "Lighting preferences"],
            process: [
                { id: "01", title: "Footage Analysis", desc: "Reviewing drone photography for camera angles, lighting, and perspective matching." },
                { id: "02", title: "3D Integration", desc: "Modeling and positioning the building to match the aerial photography perspective." },
                { id: "03", title: "Lighting Match", desc: "Matching 3D lighting to the real-world conditions in the drone footage." },
                { id: "04", title: "Final Compositing", desc: "Blending CGI with photography for seamless photorealistic results." }
            ]
        },
        {
            title: "Aerial 3D Animation",
            subtitle: "Cinematic flythroughs",
            desc: "Drone aerial videos help create visually powerful animations. 3D artists combine the model with footage for a Hollywood-style visual experience.",
            features: ["4K video output", "Cinematic camera moves", "30fps smooth playback", "Licensed music included"],
            deliverables: ["4K resolution video", "30fps or 60fps frame rates", "H.264/H.265 codec", "Licensed background music"],
            requirements: ["Drone video footage", "3D model or CAD files", "Camera path preferences", "Music style preferences"],
            process: [
                { id: "01", title: "Footage Review", desc: "Analyzing drone video for camera movement, speed, and framing." },
                { id: "02", title: "Animation Setup", desc: "Matching 3D camera movement to the aerial footage trajectory." },
                { id: "03", title: "CGI Integration", desc: "Rendering 3D elements frame-by-frame to match the video footage." },
                { id: "04", title: "Post-Production", desc: "Color grading, sound design, and final editing for cinematic impact." }
            ]
        }
    ];

    const selectedService = detailedServicesData[selectedServiceIdx];

    return (
        <section className="py-24 px-6 lg:px-12 bg-neutral-900/30 border-t border-white/5">
            <div className="max-w-7xl mx-auto">
                <div className="bg-gradient-to-br from-neutral-900 to-neutral-950 border border-white/10 rounded-3xl p-8 lg:p-16 relative overflow-hidden">
                    {/* Background Deco */}
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/[0.02] rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 relative z-10">
                        {/* Left: Selector */}
                        <div className="lg:col-span-4 flex flex-col justify-center">
                            <h2 className="font-display text-3xl md:text-4xl mb-6">Project <span className="text-neutral-400 italic">Specs</span></h2>
                            <p className="text-neutral-400 mb-8 text-sm">Select a service to view deliverables, requirements, and process.</p>

                            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                                {detailedServicesData.map((service, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedServiceIdx(idx)}
                                        className={`w-full text-left px-6 py-4 rounded-xl border transition-all duration-300 flex items-center justify-between group ${
                                            selectedServiceIdx === idx
                                            ? 'bg-white text-neutral-950 border-white'
                                            : 'bg-transparent text-neutral-400 border-white/10 hover:border-white/30 hover:text-white'
                                        }`}
                                    >
                                        <span className="font-medium">{service.title}</span>
                                        {selectedServiceIdx === idx && <CheckCircle2 size={16} />}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Middle/Right: Dynamic Specs */}
                        <div className="lg:col-span-8 bg-black/20 rounded-2xl p-8 border border-white/5 flex flex-col gap-6">
                            <div>
                                <h3 className="text-xl font-display text-white mb-6">
                                    {selectedService.title}
                                </h3>

                                {/* Deliverables and Requirements - Side by Side */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    {/* Deliverables Column */}
                                    <div>
                                        <h4 className="text-xs font-bold text-green-400 uppercase tracking-widest mb-3">Deliverables</h4>
                                        <ul className="space-y-2">
                                            {selectedService.deliverables.map((item, i) => (
                                                <li key={i} className="flex items-start gap-3 text-sm text-neutral-300">
                                                    <CheckCircle2 size={16} className="text-green-500 flex-shrink-0 mt-0.5" />
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Requirements Column */}
                                    <div>
                                        <h4 className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-3">Requirements</h4>
                                        <ul className="space-y-2">
                                            {selectedService.requirements.map((item, i) => (
                                                <li key={i} className="flex items-start gap-3 text-sm text-neutral-300">
                                                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                {/* Process */}
                                <div>
                                    <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-8 opacity-70 border-b border-white/10 pb-4">Production Process</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {selectedService.process.map((step) => (
                                            <div key={step.id} className="bg-white/5 p-6 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
                                                <span className="text-neutral-500 font-display text-2xl block mb-3">{step.id}</span>
                                                <h5 className="text-white font-medium mb-2">{step.title}</h5>
                                                <p className="text-neutral-400 text-sm leading-relaxed">{step.desc}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6">
                                <p className="text-neutral-500 text-sm">Ready to bring this vision to life?</p>
                                <button 
                                    onClick={() => onOpenQuote(selectedService.title)}
                                    className="w-full sm:w-auto bg-white text-neutral-950 px-8 py-4 text-sm font-medium hover:bg-neutral-200 transition-colors uppercase tracking-widest flex items-center justify-center gap-3 cursor-hover"
                                >
                                    Get a Free Quote for Your Project
                                    <ArrowRight size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

const MediaCompareSlider: React.FC<{
    before: string;
    after: string;
    type: 'image' | 'video';
    labelBefore?: string;
    labelAfter?: string;
}> = ({ before, after, type, labelBefore = "Initial", labelAfter = "Final" }) => {
    const [sliderPosition, setSliderPosition] = useState(50);
    const [isDragging, setIsDragging] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const [width, setWidth] = useState(0);

    useEffect(() => {
        if (containerRef.current) {
            setWidth(containerRef.current.offsetWidth);
        }
        const handleResize = () => {
             if (containerRef.current) {
                setWidth(containerRef.current.offsetWidth);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleMove = (clientX: number) => {
        if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
            const percent = Math.max(0, Math.min(100, (x / rect.width) * 100));
            setSliderPosition(percent);
        }
    };

    const handleMouseDown = () => setIsDragging(true);
    const handleMouseUp = () => setIsDragging(false);
    const handleMouseMove = (e: React.MouseEvent) => {
        if (isDragging) handleMove(e.clientX);
    };
    const handleTouchMove = (e: React.TouchEvent) => {
        handleMove(e.touches[0].clientX);
    };

    useEffect(() => {
        const handleGlobalMouseUp = () => setIsDragging(false);
        window.addEventListener('mouseup', handleGlobalMouseUp);
        return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
    }, []);

    return (
        <div
            ref={containerRef}
            className="relative w-full h-full select-none group cursor-col-resize"
            onMouseMove={handleMouseMove}
            onMouseDown={handleMouseDown}
            onTouchMove={handleTouchMove}
            onTouchStart={handleMouseDown}
        >
            {/* Background Layer (Right Side / After) */}
            {type === 'image' ? (
                 <img src={after} alt={labelAfter} className="absolute inset-0 w-full h-full object-cover pointer-events-none" />
            ) : (
                <video src={after} className="absolute inset-0 w-full h-full object-cover pointer-events-none" autoPlay muted loop playsInline />
            )}

            {/* Foreground Layer (Left Side / Before) - Clipped */}
            <div
                className="absolute inset-0 h-full overflow-hidden border-r-2 border-white/80"
                style={{ width: `${sliderPosition}%` }}
            >
                {type === 'image' ? (
                     <img
                        src={before}
                        alt={labelBefore}
                        className="absolute inset-0 max-w-none h-full object-cover pointer-events-none"
                        style={{ width: width || '100%' }}
                    />
                ) : (
                    <video
                        src={before}
                        className="absolute inset-0 max-w-none h-full object-cover pointer-events-none"
                        style={{ width: width || '100%' }}
                        autoPlay muted loop playsInline
                    />
                )}
            </div>

             {/* Slider Handle */}
            <div
                className="absolute top-1/2 -translate-y-1/2 w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(0,0,0,0.3)] z-10 hover:scale-110 transition-transform"
                style={{ left: `calc(${sliderPosition}% - 18px)` }}
            >
               <div className="flex gap-1">
                    <div className="w-0.5 h-3 bg-neutral-900/80 rounded-full"></div>
                    <div className="w-0.5 h-3 bg-neutral-900/80 rounded-full"></div>
                </div>
            </div>

             {/* Labels */}
            <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest text-white border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none shadow-lg translate-y-2 group-hover:translate-y-0">
                {labelBefore}
            </div>
            <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest text-white border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none shadow-lg translate-y-2 group-hover:translate-y-0">
                {labelAfter}
            </div>
        </div>
    );
};

const AerialRendering: React.FC<{ onNavigate: (page: Page) => void }> = ({ onNavigate }) => {
    const [heroRef, heroVisible] = useIntersectionObserver<HTMLElement>();
    const [isQuoteFormOpen, setIsQuoteFormOpen] = useState(false);

    return (
        <div className="bg-neutral-950 min-h-screen pt-20">
            {/* Hero Section */}
            <section ref={heroRef} className="relative py-24 lg:py-32 px-6 lg:px-12 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img src="https://archicgi.com/wp-content/uploads/2023/11/aerial-3d-rendering-real-estate-marketing.jpg"
                        alt="Aerial Rendering Hero" className="w-full h-full object-cover opacity-30" />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/90 to-transparent"></div>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto">
                    <button 
                        onClick={() => onNavigate('home')}
                        className="inline-flex items-center gap-2 text-neutral-400 hover:text-white mb-10 transition-colors text-sm tracking-widest uppercase cursor-hover"
                    >
                        <ArrowLeft size={16} /> Back to Services
                    </button>
                    
                    <h1 className={`font-display text-5xl md:text-8xl font-medium mb-8 leading-tight transition-all duration-1000 ${heroVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                        Aerial 3D <br/>
                        <span className="text-stroke text-white/90">Rendering</span>
                    </h1>
                    
                    <p className={`text-neutral-400 text-lg md:text-xl max-w-2xl leading-relaxed transition-all duration-1000 delay-200 ${heroVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                         Showcase your property in its true context. Provide a bird's-eye view of large-scale developments and their relationship with the surrounding environment.
                    </p>
                </div>
            </section>

             {/* Impact Grid (Value Propositions) */}
            <section className="py-20 px-6 lg:px-12 border-t border-white/5">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
                    {[
                        { title: "Unparalleled Photorealism", desc: "Drone footage makes up to 70% of the visual assets, ensuring an authentic and grounded feel for every render." },
                        { title: "100% Accuracy", desc: "Surroundings come from actual site photography—accurate down to the smallest detail of the neighboring landscape." },
                        { title: "Cost Efficiency", desc: "By integrating CGI with real drone footage, we reduce the need for environment modeling, passing the savings to you." }
                    ].map((item, i) => (
                        <div key={i} className="group cursor-default">
                             <div className="h-px w-12 bg-white/20 mb-6 group-hover:w-full transition-all duration-500"></div>
                            <h3 className="font-display text-2xl mb-4 text-white group-hover:text-neutral-400 transition-colors">{item.title}</h3>
                            <p className="text-neutral-500 text-sm leading-relaxed">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Versatile Aerial Solutions (Still & Animation) */}
            <section className="py-24 px-6 lg:px-12 bg-neutral-900/50">
                <div className="w-full">
                    <div className="mb-16 max-w-7xl mx-auto">
                         <h2 className="font-display text-4xl md:text-6xl mb-6 leading-tight">Visual <span className="text-stroke">Solutions</span></h2>
                         <p className="text-neutral-500 max-w-xl">From static photomontages to cinematic flythroughs, we provide the tools to sell your vision.</p>
                    </div>

                    <div className="grid grid-cols-1 gap-16 max-w-5xl mx-auto">
                        {/* Still Rendering Comparison */}
                        <div className="w-full">
                            <div className="aspect-[4/3] w-full overflow-hidden rounded-2xl bg-neutral-800 mb-8 shadow-2xl border border-white/5">
                                <MediaCompareSlider
                                    type="image"
                                    before={AerialStaticBefore}
                                    after={AerialStaticAfter}
                                    labelBefore="Drone Photo"
                                    labelAfter="Final Render"
                                />
                            </div>
                            <h3 className="text-2xl font-display mb-3">Still Aerial Rendering</h3>
                            <p className="text-neutral-400 text-sm leading-relaxed">A drone photo makes a highly accurate and 100% realistic background for the 3D model. The resulting image helps customers see how the design fits the surroundings.</p>
                        </div>

                         {/* Animation Comparison */}
                        <div className="w-full">
                            <div className="aspect-[4/3] w-full overflow-hidden rounded-2xl bg-neutral-800 mb-8 shadow-2xl border border-white/5">
                                <MediaCompareSlider
                                    type="video"
                                    before={AerialAnimBefore}
                                    after={AerialAnimAfter}
                                    labelBefore="Initial Footage"
                                    labelAfter="CG Animation"
                                />
                            </div>
                            <h3 className="text-2xl font-display mb-3">Aerial 3D Animation</h3>
                            <p className="text-neutral-400 text-sm leading-relaxed">Drone aerial videos help create visually powerful animations. 3D artists combine the model with footage for a Hollywood-style visual experience.</p>
                        </div>
                    </div>
                </div>
            </section>

             {/* Aerial Services Range */}
            <section className="py-24 px-6 lg:px-12 bg-neutral-950">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-12">
                         <h2 className="font-display text-4xl mb-4">Our <span className="text-stroke">Aerial Services</span></h2>
                         <p className="text-neutral-500">Comprehensive solutions for every stage of development.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            { title: "Drone Photomontages", desc: "Authentic integration of 3D models into real high-altitude photography for context and scale." },
                            { title: "Masterplan Visualization", desc: "Large-scale overviews focused on zoning, circulation, and the harmony of urban design." },
                            { title: "Phasing Sequences", desc: "Before-and-after or development stage visuals critical for stakeholder and planning presentations." },
                            { title: "Animated Flythroughs", desc: "Cinematic aerial videos highlighting site dynamics and architectural rhythm across the landscape." },
                            { title: "Marketing Collateral", desc: "High-impact imagery optimized for investor brochures, web listings, and large-format print." },
                            { title: "Context Integration", desc: "Show your project within Google Maps or existing GIS data to demonstrate local fit and accessibility." }
                        ].map((item, i) => (
                            <div key={i} className="bg-neutral-900 border border-white/5 p-8 rounded-xl hover:border-white/20 transition-colors group">
                                <h3 className="text-xl font-display text-white mb-3 italic">{item.title}</h3>
                                <p className="text-neutral-500 text-sm leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ════════════════════════════════════════════════════════
                PROJECT SPECS & CTA
            ════════════════════════════════════════════════════════ */}
            <ProjectSpecsCTA onOpenQuote={() => setIsQuoteFormOpen(true)} />

            {/* ════════════════════════════════════════════════════════
                FAQ SECTION
            ════════════════════════════════════════════════════════ */}
            <section className="py-24 px-6 lg:px-12">
                <div className="max-w-3xl mx-auto">
                    <h2 className="font-display text-4xl mb-12 text-center">
                        Frequently Asked <span className="text-stroke">Questions</span>
                    </h2>
                    <div className="space-y-4">
                        {[
                            { q: 'What is aerial rendering?', a: 'Aerial rendering combines 3D models with real drone photography to create photorealistic bird\'s eye views of your project in its actual context.' },
                            { q: 'What do I need to provide?', a: 'We need drone footage or site photos, your 3D model or CAD files, camera angle references, and lighting preferences to get started.' },
                            { q: 'How long does it take?', a: 'A standard aerial rendering project takes 3-5 days depending on complexity. Animation projects may take 5-7 days.' },
                            { q: 'Can you work with existing drone footage?', a: 'Yes, we specialize in integrating 3D models with existing drone photography and video footage.' },
                            { q: 'What resolution do you deliver?', a: 'We deliver 4K resolution (3840x2160) for both still images and animations, with print-ready 300 DPI options available.' }
                        ].map((item, i) => (
                            <FAQItem key={i} question={item.q} answer={item.a} />
                        ))}
                    </div>
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

export default AerialRendering;