import React, { useState } from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import {
    ArrowLeft,
    CheckCircle2,
    Play,
    Plus,
    Minus,
    ArrowRight,
    Box,
    Film,
    Plane,
    Building2,
    Share2,
    Heart,
    Eye,
    ChevronDown,
    Layers,
    Clock,
    Smartphone
} from 'lucide-react';
import { Page } from '../types';
import QuoteForm from './QuoteForm';

// Import animation videos from specific subfolders under /src/assets/images-optimized/animation/
const allAnimationVideosMp4 = import.meta.glob('/src/assets/images-optimized/animation/**/*.mp4', { eager: true, import: 'default' }) as Record<string, string>;
const allAnimationVideosMov = import.meta.glob('/src/assets/images-optimized/animation/**/*.mov', { eager: true, import: 'default' }) as Record<string, string>;
const allAnimationVideos = { ...allAnimationVideosMp4, ...allAnimationVideosMov };

// Organize videos by exact folder paths
const getVideosFromFolder = (folderName: string): string[] => {
    return Object.entries(allAnimationVideos)
        .filter(([path]) => path.includes(`/animation/${folderName}/`))
        .map(([, src]) => src as string);
};

const showreelGallery = getVideosFromFolder('main showreel');
const walkthroughGallery = getVideosFromFolder('walkthrough ');
const flythroughGallery = getVideosFromFolder('flythroughs');
const phasingGallery = getVideosFromFolder('phasing');
const timelapseGallery = getVideosFromFolder('timelapse');
const socialMediaGallery = getVideosFromFolder('social-media');

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

// Video Gallery Component for Walkthrough/Flythrough
const VideoGallery: React.FC<{ videos: string[]; title: string }> = ({ videos, title }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleNext = () => setCurrentIndex((prev) => (prev + 1) % videos.length);
    const handlePrev = () => setCurrentIndex((prev) => (prev - 1 + videos.length) % videos.length);

    if (videos.length === 0) {
        return (
            <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-neutral-800 flex items-center justify-center">
                <div className="text-center text-neutral-400">
                    <Film size={48} className="mx-auto mb-4 opacity-50" />
                    <p>No videos available</p>
                </div>
            </div>
        );
    }

    return (
        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-neutral-900 group">
            <video
                src={videos[currentIndex]}
                className="w-full h-full object-cover"
                autoPlay
                muted
                loop
                playsInline
            />
            
            {/* Navigation buttons */}
            {videos.length > 1 && (
                <>
                    <button
                        onClick={handlePrev}
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 hover:bg-white/20 transition-colors"
                        aria-label="Previous video"
                    >
                        <ArrowLeft size={24} className="text-white" />
                    </button>
                    <button
                        onClick={handleNext}
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 hover:bg-white/20 transition-colors"
                        aria-label="Next video"
                    >
                        <ArrowRight size={24} className="text-white" />
                    </button>
                </>
            )}

            {/* Counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full text-sm text-white font-medium">
                {currentIndex + 1} / {videos.length}
            </div>
        </div>
    );
};

// ── Project Specs & CTA ───────────────────────────────────────────────
const ProjectSpecsCTA: React.FC<{ onOpenQuote: (service?: string) => void }> = ({ onOpenQuote }) => {
    const [selectedServiceIdx, setSelectedServiceIdx] = useState(0);
    const detailedServicesData = [
        {
            title: "Architectural Walkthrough",
            subtitle: "Immersive first-person animations",
            desc: "Guide viewers through spaces as if walking inside. Create emotional connections with properties before they're built.",
            features: ["4K resolution (3840x2160)", "30fps or 60fps frame rates", "H.264/H.265 codec", "Licensed music included"],
            deliverables: ["4K resolution (3840x2160)", "30fps or 60fps frame rates", "H.264/H.265 codec", "Licensed music included"],
            requirements: ["3D Model (Revit/Sketchup)", "Material References", "Lighting Plan", "Key Viewpoints"],
            process: [
                { id: "01", title: "Storyboard", desc: "Planning narrative flow and camera paths to ensure the story aligns with project goals." },
                { id: "02", title: "3D Setup", desc: "Preparing the model, setting up lighting environments, and applying initial textures." },
                { id: "03", title: "Rendering", desc: "High-quality frame-by-frame rendering using our render farm for 4K output." },
                { id: "04", title: "Post-Production", desc: "Color grading, motion graphics overlay, and sound design/mixing for the final cut." }
            ]
        },
        {
            title: "Aerial Flythrough",
            subtitle: "Cinematic drone perspectives",
            desc: "Showcase developments from above. Perfect for revealing masterplans, neighborhood context, and creating dramatic reveals.",
            features: ["4K/8K resolution available", "Realistic sky and atmosphere", "Context buildings included", "Terrain modeling"],
            deliverables: ["4K/8K resolution available", "Realistic sky and atmosphere", "Context buildings included", "Terrain modeling"],
            requirements: ["Site Plan / GIS Data", "Landscape Design", "Surrounding Context Photos", "Preferred Flight Paths"],
            process: [
                { id: "01", title: "Site Modeling", desc: "Building the large-scale terrain and surrounding context geometry from GIS data." },
                { id: "02", title: "Flight Path", desc: "Designing cinematic camera movements simulating drone physics." },
                { id: "03", title: "Atmosphere", desc: "Volumetric clouds, fog, and sun positioning for dramatic lighting." },
                { id: "04", title: "Final Cut", desc: "Compositing, motion blur, and integrating background scores." }
            ]
        },
        {
            title: "Phasing Animation",
            subtitle: "Construction Sequence",
            desc: "Visualize the step-by-step construction process. Show how a building evolves from foundation to completion with precise technical accuracy.",
            features: ["4K resolution standard", "Phase labels and annotations", "Timeline integration", "Technical accuracy"],
            deliverables: ["4K resolution standard", "Phase labels and annotations", "Timeline integration", "Technical accuracy"],
            requirements: ["Construction Schedule", "Phase Drawings", "Engineering Plans", "Milestone Definitions"],
            process: [
                { id: "01", title: "Schedule Review", desc: "Analyzing construction timeline and milestones." },
                { id: "02", title: "Phase Modeling", desc: "Creating separate models for each phase." },
                { id: "03", title: "Transition Animation", desc: "Smooth morphing between construction stages." },
                { id: "04", title: "Technical Overlay", desc: "Adding annotations and phase labels." }
            ]
        },
        {
            title: "Social Media Content",
            subtitle: "Short-Form Vertical Video",
            desc: "Engaging clips optimized for Instagram Reels, TikTok, and YouTube Shorts. Capture attention in the first 3 seconds with dynamic cuts and trending formats.",
            features: ["9:16 Vertical (1080x1920)", "15-60 second clips", "Trending audio integration", "Caption overlays"],
            deliverables: ["9:16 Vertical (1080x1920)", "15-60 second clips", "Trending audio integration", "Caption overlays"],
            requirements: ["Brand Guidelines", "Key Selling Points", "Target Audience Info", "Style References"],
            process: [
                { id: "01", title: "Platform Strategy", desc: "Choosing the right format for each channel." },
                { id: "02", title: "Hook Creation", desc: "Designing attention-grabbing openings." },
                { id: "03", title: "Fast-Paced Editing", desc: "Quick cuts synced to trending audio." },
                { id: "04", title: "Caption & Hashtag", desc: "Optimizing for discoverability." }
            ]
        },
        {
            title: "Timelapse Video",
            subtitle: "Construction Progress",
            desc: "Condense months of construction into minutes. Document the building process with professional timelapse photography and smooth transitions.",
            features: ["4K resolution output", "30fps smooth playback", "Weather-resistant capture", "Cloud storage backup"],
            deliverables: ["4K resolution output", "30fps smooth playback", "Weather-resistant capture", "Cloud storage backup"],
            requirements: ["Site Access Permission", "Power Source", "Mounting Location", "Project Timeline"],
            process: [
                { id: "01", title: "Camera Setup", desc: "Installing weatherproof equipment on-site." },
                { id: "02", title: "Interval Capture", desc: "Automated photography at set intervals." },
                { id: "03", title: "Stabilization", desc: "Aligning frames for smooth playback." },
                { id: "04", title: "Color & Music", desc: "Grading and soundtrack integration." }
            ]
        }
    ];

    const selectedService = detailedServicesData[selectedServiceIdx];

    return (
        <section className="py-24 px-6 lg:px-12 bg-neutral-900/30 border-t border-white/5">
            <div className="">
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

// ── Main Component ────────────────────────────────────────────────────
const AnimationServices: React.FC<{ onNavigate: (page: Page) => void }> = ({ onNavigate }) => {
    const [heroRef, heroVisible] = useIntersectionObserver<HTMLElement>({ threshold: 0.1 });
    const [isQuoteFormOpen, setIsQuoteFormOpen] = useState(false);
    const [selectedService, setSelectedService] = useState<string | undefined>(undefined);

    const handleOpenQuote = (service?: string) => {
        setSelectedService(service);
        setIsQuoteFormOpen(true);
    };

    // ── Data: Walkthrough & Flythrough Grid ───────────────────────────
    const walkthroughFlythroughData = [
        {
            title: "Architectural Walkthrough",
            subtitle: "Immersive first-person animations",
            desc: "Guide viewers through spaces as if walking inside. Create emotional connections with properties before they're built.",
            icon: Building2,
            features: ["4K resolution (3840x2160)", "30fps or 60fps frame rates", "H.264/H.265 codec", "Licensed music included"]
        },
        {
            title: "Aerial Flythrough",
            subtitle: "Cinematic drone perspectives",
            desc: "Showcase developments from above. Perfect for revealing masterplans, neighborhood context, and creating dramatic reveals.",
            icon: Plane,
            features: ["4K/8K resolution available", "Realistic sky and atmosphere", "Context buildings included", "Terrain modeling"]
        }
    ];

    // ── Data: Specialized Animations (Phasing, Social, Timelapse) ────
    const specializedAnimationsData = [
        {
            title: "Phasing Animation",
            subtitle: "Construction Sequence",
            desc: "Visualize the step-by-step construction process. Show how a building evolves from foundation to completion with precise technical accuracy.",
            icon: Layers,
            features: ["4K resolution standard", "Phase labels and annotations", "Timeline integration", "Technical accuracy"]
        },
        {
            title: "Social Media Content",
            subtitle: "Short-Form Vertical Video",
            desc: "Engaging clips optimized for Instagram Reels, TikTok, and YouTube Shorts. Capture attention in the first 3 seconds with dynamic cuts and trending formats.",
            icon: Smartphone,
            features: ["9:16 Vertical (1080x1920)", "15-60 second clips", "Trending audio integration", "Caption overlays"]
        },
        {
            title: "Timelapse Video",
            subtitle: "Construction Progress",
            desc: "Condense months of construction into minutes. Document the building process with professional timelapse photography and smooth transitions.",
            icon: Clock,
            features: ["4K resolution output", "30fps smooth playback", "Weather-resistant capture", "Cloud storage backup"]
        }
    ];

    // ── Data: Impact Stats ────────────────────────────────────────────
    const impactStats = [
        { title: "10x Engagement", desc: "Video content receives 10x more engagement than static images on social media platforms, extending your reach organically.", icon: Share2 },
        { title: "Emotional Connection", desc: "Motion and music create powerful emotional responses that static images simply cannot achieve, building stronger buyer intent.", icon: Heart },
        { title: "Spatial Understanding", desc: "Movement through space gives viewers a true sense of scale, proportion, and flow that floor plans cannot convey.", icon: Eye }
    ];

    // ── Data: FAQ ─────────────────────────────────────────────────────
    const faqs = [
        { q: 'What is the typical turnaround time?', a: 'Standard projects take 5-10 business days. Rush delivery is available for an additional fee.' },
        { q: 'What file formats do you deliver?', a: 'We deliver MP4 (H.264/H.265) for videos, JPG/PNG for stills, and interactive formats for virtual tours.' },
        { q: 'Can you work with my existing 3D models?', a: 'Yes, we accept Revit, SketchUp, 3ds Max, Rhino, and Blender files. We optimize them for animation.' },
        { q: 'Do you provide music and sound effects?', a: 'Yes, we include licensed music and professional sound mixing in all animation packages.' },
        { q: 'What resolution do you deliver?', a: 'Standard delivery is 4K (3840x2160). 8K is available for aerial and specialized projects.' },
    ];

    return (
        <div className="bg-neutral-950 min-h-screen pt-20">

            {/* ════════════════════════════════════════════════════════
                HERO SECTION
            ════════════════════════════════════════════════════════ */}
            <section ref={heroRef} className="relative py-24 lg:py-32 px-6 lg:px-12 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=80"
                        alt=""
                        aria-hidden="true"
                        className="w-full h-full object-cover opacity-20"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/90 to-transparent" />
                </div>

                <div className="relative z-10 ">
                    <button
                        onClick={() => onNavigate('home')}
                        className="inline-flex items-center gap-2 text-neutral-400 hover:text-white mb-10 transition-colors text-sm tracking-widest uppercase"
                    >
                        <ArrowLeft size={16} />
                        Back to Services
                    </button>

                    <h1 className={`font-display text-5xl md:text-8xl font-medium mb-8 leading-tight transition-all duration-1000 ${heroVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                        3D <br />
                        <span className="text-stroke text-white/90">Animation</span>
                    </h1>

                    <p className={`text-neutral-400 text-lg md:text-xl max-w-2xl leading-relaxed transition-all duration-1000 delay-200 ${heroVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                        Bring your architectural vision to life with cinematic animations. From property walkthroughs to aerial flythroughs—we create motion that moves people.
                    </p>
                </div>

                {/* Scroll Indicator */}
                <div className={`absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 transition-opacity duration-700 ${heroVisible ? 'opacity-100' : 'opacity-0'}`}>
                    <span className="text-xs uppercase tracking-widest text-white/50">Explore Motion</span>
                    <ChevronDown className="w-5 h-5 text-white/50 animate-bounce" />
                </div>
            </section>

            {/* ════════════════════════════════════════════════════════
                SHOWREEL SECTION
            ════════════════════════════════════════════════════════ */}
            <section className="py-20 px-6 lg:px-12 bg-neutral-900 border-y border-white/5">
                <div className="">
                    <div className="relative aspect-video rounded-3xl overflow-hidden bg-neutral-900">
                        {showreelGallery.length > 0 ? (
                            <video
                                src={showreelGallery[0]}
                                className="w-full h-full object-cover"
                                autoPlay
                                muted
                                loop
                                playsInline
                            />
                        ) : (
                            <div className="w-full h-full bg-neutral-800 flex items-center justify-center">
                                <div className="text-center text-neutral-400">
                                    <Film size={48} className="mx-auto mb-4 opacity-50" />
                                    <p>Showreel video not available</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* ════════════════════════════════════════════════════════
                IMPACT GRID
            ════════════════════════════════════════════════════════ */}
            <section className="py-20 px-6 lg:px-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {impactStats.map((item, i) => (
                        <div key={i} className="group cursor-default">
                            <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mb-6 text-white border border-white/10 group-hover:bg-white group-hover:text-black transition-all duration-300">
                                <item.icon size={24} />
                            </div>
                            <h3 className="font-display text-2xl mb-4 text-white group-hover:text-neutral-400 transition-colors">{item.title}</h3>
                            <p className="text-neutral-500 text-sm leading-relaxed">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ════════════════════════════════════════════════════════
                WALKTHROUGH & FLYTHROUGH GRID
            ════════════════════════════════════════════════════════ */}
            <section className="py-24 px-6 lg:px-12 bg-neutral-900/50 border-t border-white/5">
                <div className="">
                    <div className="mb-16 text-center">
                        <h2 className="font-display text-4xl md:text-6xl mb-6 leading-tight">
                            Walkthrough & <span className="text-stroke">Flythrough</span>
                        </h2>
                        <p className="text-neutral-500 max-w-2xl mx-auto">
                            Cinematic animations that guide viewers through your spaces with professional camera work and storytelling.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {walkthroughFlythroughData.map((service, idx) => (
                            <div key={idx} className="group">
                                {/* Video Gallery for each service - using ONLY /animation/ folder videos */}
                                {idx === 0 ? (
                                    <VideoGallery videos={walkthroughGallery.length > 0 ? walkthroughGallery : flythroughGallery} title={service.title} />
                                ) : (
                                    <VideoGallery videos={flythroughGallery} title={service.title} />
                                )}
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="text-xs font-bold text-neutral-500 uppercase tracking-widest">0{idx + 1}</span>
                                    <div className="h-px w-8 bg-neutral-700"></div>
                                    <span className="text-xs font-medium text-neutral-400 uppercase tracking-widest">{service.subtitle}</span>
                                </div>
                                <h3 className="text-2xl font-display mb-3 text-white">{service.title}</h3>
                                <p className="text-neutral-400 text-sm leading-relaxed mb-6">{service.desc}</p>

                                {/* Features List */}
                                <div>
                                    <h4 className="text-xs font-bold text-green-400 uppercase tracking-widest mb-3">Features</h4>
                                    <div className="grid grid-cols-2 gap-3">
                                        {service.features.map((item, i) => (
                                            <div key={i} className="flex items-center gap-2 text-sm text-neutral-300">
                                                <CheckCircle2 size={14} className="text-green-500 flex-shrink-0" />
                                                {item}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ════════════════════════════════════════════════════════
                SPECIALIZED ANIMATIONS (STICKY SCROLL)
            ════════════════════════════════════════════════════════ */}
            <section className="bg-neutral-900/50">
                {/* Section header — scrolls away normally */}
                <div className="px-6 lg:px-12 pt-24 pb-16 ">
                    <div className="flex items-center gap-4 mb-6">
                        <Film className="w-8 h-8 text-white/60" />
                        <span className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Technical Visualizations</span>
                    </div>
                    <h2 className="font-display text-4xl md:text-6xl mb-6 leading-tight">
                        Specialized <span className="text-stroke">Animations</span>
                    </h2>
                    <p className="text-neutral-500 max-w-xl">
                        Technical visualizations and social-ready content for every platform and purpose.
                    </p>
                </div>

                {/* Sticky scroll container */}
                <div
                    className="relative"
                    style={{ height: `${specializedAnimationsData.length * 100}vh` }}
                >
                    {specializedAnimationsData.map((item, i) => (
                        <div
                            key={i}
                            className="sticky top-0 h-screen flex items-center overflow-hidden"
                            style={{ zIndex: 10 + i }}
                        >
                            {/* Full-bleed card background */}
                            <div className="absolute inset-0 bg-neutral-900/95 backdrop-blur-sm" />

                            {/* Card content */}
                            <div className="relative z-10 w-full px-6 lg:px-12 py-16 group">
                                {/* Step counter */}
                                <p className="text-xs text-neutral-600 tracking-widest uppercase mb-6 font-medium">
                                    {String(i + 1).padStart(2, '0')} / {String(specializedAnimationsData.length).padStart(2, '0')}
                                </p>

                                <h3 className="text-3xl md:text-4xl font-display mb-4 text-white">
                                    {item.title}
                                </h3>
                                <p className="text-neutral-400 text-sm leading-relaxed max-w-xl mb-10">
                                    {item.desc}
                                </p>

                                {/* Features List */}
                                <div className="grid grid-cols-2 gap-3 mb-8">
                                    {item.features.map((feature, idx) => (
                                        <div key={idx} className="flex items-center gap-2 text-sm text-neutral-300">
                                            <CheckCircle2 size={14} className="text-green-500 flex-shrink-0" />
                                            {feature}
                                        </div>
                                    ))}
                                </div>

                                {/* Video from respective /animation/ subfolder */}
                                {item.title === "Phasing Animation" && phasingGallery.length > 0 ? (
                                    <div className="aspect-video w-full overflow-hidden rounded-2xl bg-neutral-900 relative">
                                        <video
                                            src={phasingGallery[0]}
                                            className="w-full h-full object-cover"
                                            autoPlay
                                            muted
                                            loop
                                            playsInline
                                        />
                                    </div>
                                ) : item.title === "Timelapse Video" && timelapseGallery.length > 0 ? (
                                    <div className="aspect-video w-full overflow-hidden rounded-2xl bg-neutral-900 relative">
                                        <video
                                            src={timelapseGallery[0]}
                                            className="w-full h-full object-cover"
                                            autoPlay
                                            muted
                                            loop
                                            playsInline
                                        />
                                    </div>
                                ) : item.title === "Social Media Content" && socialMediaGallery.length > 0 ? (
                                    <div className="aspect-[9/16] max-h-[600px] w-full overflow-hidden rounded-2xl bg-neutral-900 relative">
                                        <video
                                            src={socialMediaGallery[0]}
                                            className="w-full h-full object-cover"
                                            autoPlay
                                            muted
                                            loop
                                            playsInline
                                        />
                                    </div>
                                ) : (
                                    <div className="aspect-video w-full overflow-hidden rounded-2xl bg-neutral-800 relative flex items-center justify-center">
                                        <div className="text-center text-neutral-400">
                                            <item.icon className="w-14 h-14 mx-auto mb-4 opacity-50" />
                                            <p>Video coming soon</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ════════════════════════════════════════════════════════
                PROJECT SPECS & CTA
            ════════════════════════════════════════════════════════ */}
            <ProjectSpecsCTA onOpenQuote={handleOpenQuote} />

            {/* ════════════════════════════════════════════════════════
                FAQ SECTION
            ════════════════════════════════════════════════════════ */}
            <section className="py-24 px-6 lg:px-12">
                <div className="max-w-3xl mx-auto">
                    <h2 className="font-display text-4xl mb-12 text-center">
                        Frequently Asked <span className="text-stroke">Questions</span>
                    </h2>
                    <div className="space-y-4">
                        {faqs.map((item, i) => (
                            <FAQItem key={i} question={item.q} answer={item.a} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Quote Form Modal */}
            <QuoteForm 
                isOpen={isQuoteFormOpen} 
                onClose={() => setIsQuoteFormOpen(false)} 
                preselectedService={selectedService}
            />

        </div>
    );
};

export default AnimationServices;
