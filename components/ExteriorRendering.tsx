import React, { useState, useRef, useEffect } from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { ArrowLeft, CheckCircle2, Play, Plus, Minus, ArrowRight, Box, Grid3X3, Sun, Layers } from 'lucide-react';
import { Page } from '../types';
import QuoteForm from './QuoteForm';

// Dynamically import all featured works images (all formats)
const featuredImages = import.meta.glob('/src/assets/images-optimized/exterior/featured-works/*.{webp,jpg,jpeg,png}', { eager: true, import: 'default' }) as Record<string, string>;
const galleryImages = Object.values(featuredImages);

// Import all lighting scenario images
const lightingImages = import.meta.glob('/src/assets/images-optimized/exterior/lighting/*.{webp,jpg,jpeg,png}', { eager: true, import: 'default' }) as Record<string, string>;
const lightingGallery = Object.values(lightingImages);
// Create pairs for before/after comparison (assumes images are ordered: before1, after1, before2, after2, etc.)
const lightingPairs = lightingGallery.reduce((pairs, img, idx) => {
    if (idx % 2 === 0 && lightingGallery[idx + 1]) {
        pairs.push({ before: img, after: lightingGallery[idx + 1] });
    }
    return pairs;
}, [] as { before: string; after: string }[]);

// Import landscape illustration images
const landscapeImages = import.meta.glob('/src/assets/images-optimized/exterior/landsacpe/*.{png,jpg,jpeg,webp}', { eager: true, import: 'default' }) as Record<string, string>;
const landscapeGallery = Object.values(landscapeImages).filter((_, i) => i < 10); // Limit to first 10 images
// Create pairs for hover effect (swap order: hover first, then default)
const landscapePairs = landscapeGallery.reduce((pairs, img, idx) => {
    if (idx % 2 === 0 && landscapeGallery[idx + 1]) {
        pairs.push({ default: landscapeGallery[idx + 1], hover: img });
    }
    return pairs;
}, [] as { default: string; hover: string }[]);

// Import animation videos
const animationVideos = import.meta.glob('/src/assets/images-optimized/exterior/animation/*.mp4', { eager: true, import: 'default' }) as Record<string, string>;
const animationGallery = Object.values(animationVideos);

// Import carousel images for Still Renderings
const carouselImages = import.meta.glob('/src/assets/images-optimized/exterior/carousel/*.{webp,jpg,jpeg,png}', { eager: true, import: 'default' }) as Record<string, string>;
const carouselGallery = Object.values(carouselImages);

const LightingCarousel: React.FC<{ pairs: { before: string; after: string }[] }> = ({ pairs }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [sliderPosition, setSliderPosition] = useState(50);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);

    const handleNext = () => setCurrentIndex((prev) => (prev + 1) % pairs.length);
    const handlePrev = () => setCurrentIndex((prev) => (prev - 1 + pairs.length) % pairs.length);

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
    const handleMouseMove = (e: React.MouseEvent) => { if (isDragging) handleMove(e.clientX); };
    const handleTouchMove = (e: React.TouchEvent) => { handleMove(e.touches[0].clientX); };

    useEffect(() => {
        const handleGlobalMouseUp = () => setIsDragging(false);
        window.addEventListener('mouseup', handleGlobalMouseUp);
        return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
    }, []);

    if (pairs.length === 0) {
        return (
            <div className="relative w-full aspect-[21/9] rounded-2xl overflow-hidden bg-neutral-800 flex items-center justify-center">
                <div className="text-center text-neutral-400">
                    <Sun size={48} className="mx-auto mb-4 opacity-50" />
                    <p>No lighting images available</p>
                </div>
            </div>
        );
    }

    const currentPair = pairs[currentIndex];

    return (
        <div
            ref={containerRef}
            className="relative w-full aspect-[21/9] rounded-2xl overflow-hidden bg-neutral-900 border border-white/10 cursor-ew-resize select-none"
            onMouseMove={handleMouseMove}
            onMouseDown={handleMouseDown}
            onTouchMove={handleTouchMove}
        >
            {/* After (base layer) */}
            <div
                className="absolute inset-0 w-full h-full bg-cover bg-center"
                style={{ backgroundImage: `url('${currentPair.after}')` }}
            />

            {/* Before (clipped layer) */}
            <div
                className="absolute inset-0 h-full overflow-hidden border-r-2 border-white"
                style={{ width: `${sliderPosition}%` }}
            >
                <div
                    className="absolute inset-0 h-full bg-cover bg-center"
                    style={{
                        backgroundImage: `url('${currentPair.before}')`,
                        width: containerRef.current?.offsetWidth || '100%'
                    }}
                />
            </div>

            {/* Drag handle */}
            <div
                className="absolute top-1/2 -translate-y-1/2 w-14 h-14 bg-white rounded-full flex flex-col items-center justify-center shadow-lg z-10 pointer-events-none"
                style={{ left: `calc(${sliderPosition}% - 28px)` }}
            >
                <div className="flex gap-0.5 mb-0.5">
                    <div className="w-0 h-0 border-y-4 border-y-transparent border-r-[6px] border-r-black" />
                    <div className="w-0 h-0 border-y-4 border-y-transparent border-l-[6px] border-l-black" />
                </div>
                <span className="text-[8px] font-medium text-black uppercase tracking-tight whitespace-nowrap">Drag</span>
            </div>

            {/* Labels */}
            <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-md text-xs font-medium uppercase tracking-wider text-white border border-white/10 flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-blue-400" />
                Night
            </div>
            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-md text-xs font-medium uppercase tracking-wider text-neutral-950 border border-white flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-yellow-400" />
                Day
            </div>

            {/* Navigation buttons */}
            <button
                onClick={handlePrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 hover:bg-white/20 transition-colors z-20"
                aria-label="Previous pair"
            >
                <ArrowLeft size={24} className="text-white" />
            </button>
            <button
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 hover:bg-white/20 transition-colors z-20"
                aria-label="Next pair"
            >
                <ArrowRight size={24} className="text-white" />
            </button>

            {/* Counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full text-sm text-white font-medium flex items-center gap-2 z-20">
                <Sun size={14} className="text-yellow-400" />
                <span>{currentIndex + 1} / {pairs.length}</span>
                <span className="text-neutral-400 text-xs">Lighting Pair</span>
            </div>

            {/* Thumbnail strip - one per pair */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 flex gap-2 bg-black/60 backdrop-blur-md p-2 rounded-xl border border-white/10 z-20">
                {pairs.map((pair, idx) => (
                    <button
                        key={idx}
                        onClick={() => setCurrentIndex(idx)}
                        className={`w-20 h-12 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 relative ${
                            currentIndex === idx 
                                ? 'border-yellow-400 scale-110' 
                                : 'border-white/20 hover:border-white/50 opacity-60 hover:opacity-100'
                        }`}
                    >
                        {/* Mini split preview */}
                        <div className="absolute inset-0 flex">
                            <div 
                                className="h-full bg-cover bg-center" 
                                style={{ 
                                    backgroundImage: `url('${pair.before}')`,
                                    width: '50%'
                                }} 
                            />
                            <div 
                                className="h-full bg-cover bg-center" 
                                style={{ 
                                    backgroundImage: `url('${pair.after}')`,
                                    width: '50%'
                                }} 
                            />
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};

const LandscapeHoverCarousel: React.FC<{ pairs: { default: string; hover: string }[] }> = ({ pairs }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    const handleNext = () => setCurrentIndex((prev) => (prev + 1) % pairs.length);
    const handlePrev = () => setCurrentIndex((prev) => (prev - 1 + pairs.length) % pairs.length);

    if (pairs.length === 0) {
        return (
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-neutral-800 flex items-center justify-center">
                <div className="text-center text-neutral-400">
                    <Layers size={48} className="mx-auto mb-4 opacity-50" />
                    <p>No landscape illustrations available</p>
                </div>
            </div>
        );
    }

    const currentPair = pairs[currentIndex];

    return (
        <div 
            className="relative w-full aspect-video rounded-2xl overflow-hidden bg-neutral-900 border border-white/10 group"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Images - crossfade transition */}
            <div className="absolute inset-0 transition-opacity duration-500 ease-in-out">
                {/* Default image */}
                <img
                    src={currentPair.default}
                    alt={`Landscape illustration ${currentIndex + 1}`}
                    className={`w-full h-full object-cover transition-opacity duration-500 ${isHovered ? 'opacity-0' : 'opacity-100'}`}
                />
            </div>
            <div className="absolute inset-0 transition-opacity duration-500 ease-in-out">
                {/* Hover image */}
                <img
                    src={currentPair.hover}
                    alt={`Landscape illustration ${currentIndex + 1} (hover state)`}
                    className={`w-full h-full object-cover transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
                />
            </div>

            {/* Navigation buttons */}
            <button
                onClick={handlePrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 hover:bg-white/20 transition-colors opacity-0 group-hover:opacity-100"
                aria-label="Previous illustration"
            >
                <ArrowLeft size={24} className="text-white" />
            </button>
            <button
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 hover:bg-white/20 transition-colors opacity-0 group-hover:opacity-100"
                aria-label="Next illustration"
            >
                <ArrowRight size={24} className="text-white" />
            </button>

            {/* Hover hint - centered and bigger (shown on default state, hidden on hover) */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20 transition-opacity duration-300">
                <div className={`bg-black/60 backdrop-blur-md px-6 py-3 rounded-full border border-white/20 text-white font-medium flex items-center gap-3 ${isHovered ? 'opacity-0' : 'opacity-100'}`}>
                    <Layers size={20} className="text-green-400" />
                    <span className="text-base">Hover to see realistic image</span>
                </div>
            </div>

            {/* Counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full text-sm text-white font-medium flex items-center gap-2">
                <Layers size={14} className="text-green-400" />
                <span>{currentIndex + 1} / {pairs.length}</span>
                <span className="text-neutral-400 text-xs">Landscape Illustration</span>
            </div>

            {/* Thumbnail strip */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 flex gap-2 bg-black/60 backdrop-blur-md p-2 rounded-xl border border-white/10 max-w-[80%] overflow-x-auto">
                {pairs.slice(0, 5).map((pair, idx) => (
                    <button
                        key={idx}
                        onClick={() => setCurrentIndex(idx)}
                        className={`w-16 h-10 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 relative ${
                            currentIndex === idx 
                                ? 'border-green-400 scale-110' 
                                : 'border-white/20 hover:border-white/50 opacity-60 hover:opacity-100'
                        }`}
                    >
                        <img src={pair.default} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                ))}
                {pairs.length > 5 && (
                    <div className="w-16 h-10 rounded-lg bg-white/10 flex items-center justify-center text-white text-xs font-medium border border-white/20">
                        +{pairs.length - 5}
                    </div>
                )}
            </div>

            {/* Hover indicator badge */}
            <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-md text-xs font-medium uppercase tracking-wider text-white border border-white/20 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className={`w-2 h-2 rounded-full ${isHovered ? 'bg-green-400 animate-pulse' : 'bg-white/40'}`} />
                <span>Hover Active</span>
            </div>
        </div>
    );
};

const StillRenderCarousel: React.FC<{ images: string[] }> = ({ images }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleNext = () => setCurrentIndex((prev) => (prev + 1) % images.length);
    const handlePrev = () => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);

    if (images.length === 0) {
        return (
            <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-neutral-800 flex items-center justify-center">
                <div className="text-center text-neutral-400">
                    <Grid3X3 size={48} className="mx-auto mb-4 opacity-50" />
                    <p>No images available</p>
                </div>
            </div>
        );
    }

    return (
        <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-neutral-900 border border-white/10 group">
            {/* Main Image */}
            <img
                src={images[currentIndex]}
                alt={`Still rendering ${currentIndex + 1}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />

            {/* Navigation buttons */}
            <button
                onClick={handlePrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 hover:bg-white/20 transition-colors"
                aria-label="Previous image"
            >
                <ArrowLeft size={24} className="text-white" />
            </button>
            <button
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 hover:bg-white/20 transition-colors"
                aria-label="Next image"
            >
                <ArrowRight size={24} className="text-white" />
            </button>

            {/* Counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full text-sm text-white font-medium flex items-center gap-2">
                <Grid3X3 size={14} className="text-blue-400" />
                <span>{currentIndex + 1} / {images.length}</span>
                <span className="text-neutral-400 text-xs">Still Render</span>
            </div>
        </div>
    );
};

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
            title: "Still 3D Renders",
            subtitle: "Photorealistic images",
            desc: "Show the real estate from any camera angle, in any light and environment. You will get magazine-worthy exterior renderings that will capture viewers' hearts.",
            features: ["4K resolution (3840x2160)", "Photorealistic lighting", "Material accuracy", "Print-ready 300 DPI"],
            deliverables: ["4K resolution (3840x2160)", "PNG/JPG format", "Print-ready 300 DPI", "Web-optimized versions"],
            requirements: ["Site Plans", "Material References", "Landscape Design", "Key Viewpoints"],
            process: [
                { id: "01", title: "3D Modeling", desc: "Creating accurate 3D geometry from architectural drawings and site specifications." },
                { id: "02", title: "Materials", desc: "Applying photorealistic textures and materials based on references provided." },
                { id: "03", title: "Lighting", desc: "Setting up realistic lighting scenarios to match the desired time of day and atmosphere." },
                { id: "04", title: "Rendering", desc: "High-quality final output with post-processing for perfect color and contrast." }
            ]
        },
        {
            title: "3D Exterior Animation",
            subtitle: "Cinematic videos",
            desc: "The 3D animated video will show every benefit of your design — in movement, with all the special effects you want, and with cinematic impact.",
            features: ["4K video output", "30fps smooth playback", "Cinematic camera moves", "Licensed music included"],
            deliverables: ["4K resolution video", "30fps or 60fps frame rates", "H.264/H.265 codec", "Licensed background music"],
            requirements: ["3D Model or Floor Plans", "Camera Path Preferences", "Material References", "Lighting Preferences"],
            process: [
                { id: "01", title: "Storyboard", desc: "Planning the camera path and narrative flow to showcase the exterior effectively." },
                { id: "02", title: "Animation Setup", desc: "Creating smooth camera movements and setting up the scene for rendering." },
                { id: "03", title: "Rendering", desc: "Frame-by-frame high-quality rendering using our render farm for 4K output." },
                { id: "04", title: "Post-Production", desc: "Color grading, sound design, and final editing for a polished cinematic result." }
            ]
        },
        {
            title: "Lighting Scenarios",
            subtitle: "Day to night visualization",
            desc: "Visualize your architecture across different times of day. Our CG artists can replicate the crisp light of a morning sun or the atmospheric glow of city lights at night.",
            features: ["Multiple time options", "Atmospheric lighting", "Mood variations", "Consistent framing"],
            deliverables: ["Multiple lighting scenarios", "Day/dusk/night options", "Consistent camera angles", "High-resolution renders"],
            requirements: ["Complete 3D Model", "Lighting References", "Time of Day Preferences", "Atmosphere Goals"],
            process: [
                { id: "01", title: "Sun Study", desc: "Analyzing sun position and angles for different times of day." },
                { id: "02", title: "Light Setup", desc: "Creating realistic artificial and natural lighting scenarios." },
                { id: "03", title: "Atmosphere", desc: "Adding volumetric effects, fog, and environmental elements." },
                { id: "04", title: "Final Output", desc: "Rendering multiple scenarios with consistent quality and framing." }
            ]
        },
        {
            title: "Illustrations",
            subtitle: "Technical diagrams",
            desc: "Detailed technical illustrations for site plans, landscape designs, and master plans. Perfect for presentations, planning approvals, and marketing materials.",
            features: ["Site plan illustrations", "Landscape diagrams", "Master plan views", "Technical accuracy"],
            deliverables: ["High-resolution illustrations", "Vector files (AI/EPS)", "PDF with annotations", "Multiple view options"],
            requirements: ["CAD Site Plans", "Landscape Design", "Master Plan Drawings", "Annotation Requirements"],
            process: [
                { id: "01", title: "Plan Setup", desc: "Importing and cleaning up CAD drawings for illustration conversion." },
                { id: "02", title: "Style Definition", desc: "Establishing visual style, color palette, and level of detail." },
                { id: "03", title: "Illustration", desc: "Creating detailed technical illustrations with proper annotations." },
                { id: "04", title: "Final Output", desc: "Exporting in required formats with proper scaling and resolution." }
            ]
        }
    ];

    const selectedService = detailedServicesData[selectedServiceIdx];

    return (
        <section className="py-24 px-6 lg:px-12 bg-neutral-900/30 border-t border-white/5">
            <div className="px-6 lg:px-12">
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

const ExteriorRendering: React.FC<{ onNavigate: (page: Page) => void }> = ({ onNavigate }) => {
    const [heroRef, heroVisible] = useIntersectionObserver<HTMLElement>({ threshold: 0.1 });
    const [isQuoteFormOpen, setIsQuoteFormOpen] = useState(false);

    const immersiveItems = [
        {
            title: 'Lighting Scenarios',
            description: 'Visualize your architecture across different times of day. Our CG artists can replicate the crisp light of a morning sun or the atmospheric glow of city lights at night.',
            imgSrc: 'https://archicgi.com/wp-content/uploads/2024/09/3d-visualization-large-hotel-malta-befor.jpg',
            imgAlt: 'Lighting Scenarios',
            label: 'View Lighting Options',
            features: ['Multiple time options', 'Atmospheric lighting', 'Mood variations', 'Consistent framing'],
            useCarousel: true
        },
        {
            title: 'Illustrations',
            description: 'Detailed technical illustrations for site plans, landscape designs, and master plans. Perfect for presentations, planning approvals, and marketing materials.',
            imgSrc: 'https://archicgi.com/wp-content/uploads/2023/09/3d-floor-plan-rendering-for-residential-house.jpg',
            imgAlt: 'Illustrations',
            label: 'View Illustrations',
            features: ['Site plan illustrations', 'Landscape diagrams', 'Master plan views', 'Technical accuracy'],
            useLandscapeCarousel: true
        }
    ];

    const assetCards = [
        {
            imgSrc: 'https://archicgi.com/wp-content/uploads/2024/03/mid-rise-building-exterior-3d-visualization.jpg',
            imgAlt: 'Still Render',
            hasPlay: false,
            title: 'Still 3D Renders',
            desc: "Show the real estate from any camera angle, in any light and environment. You will get magazine-worthy exterior renderings that will capture viewers' hearts.",
            features: ['4K resolution (3840x2160)', 'Photorealistic lighting', 'Material accuracy', 'Print-ready 300 DPI'],
            useCarousel: true
        },
        {
            videoSrc: animationGallery.length > 0 ? animationGallery[0] : 'https://archicgi.com/wp-content/uploads/2022/07/3d-animation-for-real-estate-project-new-york.jpg',
            imgAlt: '3D Animation',
            hasPlay: true,
            title: '3D Exterior Animation',
            desc: 'The 3D animated video will show every benefit of your design — in movement, with all the special effects you want, and with cinematic impact.',
            features: ['4K video output', '30fps smooth playback', 'Cinematic camera moves', 'Licensed music included'],
            useVideo: true
        },
    ];

    const faqs = [
        { q: 'What information is required to get a project started?', a: 'To provide you with a high-quality 3D architectural rendering, we need a brief. It includes DWG, PDF, or hand-drawn sketches, reference images for lighting and environment, and material specifications.' },
        { q: 'How long does it take to create a 3D architectural rendering?', a: 'On average, it takes 3-5 days. The exact turnaround depends on the complexity of the project and the number of views requested.' },
        { q: 'What is the cost of 3D exterior rendering?', a: 'The cost depends on the project scope, level of detail, and number of renders. We offer flexible pricing starting from competitive rates for high-res views.' },
        { q: 'How many revisions are included?', a: 'We include 2 rounds of free revisions at the intermediate stages (clay and final color) to ensure the result matches your vision perfectly.' },
    ];

    return (
        <div className="bg-neutral-950 min-h-screen pt-20">

            {/* ── Hero ─────────────────────────────────────────────── */}
            <section ref={heroRef} className="relative py-24 lg:py-32 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://archicgi.com/wp-content/uploads/2023/08/3d-exterior-rendering-urban-redevelopment.jpg"
                        alt=""
                        aria-hidden="true"
                        className="w-full h-full object-cover opacity-20"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/90 to-transparent" />
                </div>

                <div className="relative z-10 px-6 lg:px-12">
                    <button
                        onClick={() => onNavigate('home')}
                        className="inline-flex items-center gap-2 text-neutral-400 hover:text-white mb-10 transition-colors text-sm tracking-widest uppercase"
                    >
                        <ArrowLeft size={16} />
                        Back to Services
                    </button>

                    <h1 className={`font-display text-5xl md:text-8xl font-medium mb-8 leading-tight transition-all duration-1000 ${heroVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                        3D Exterior <br />
                        <span className="text-stroke text-white/90">Rendering</span>
                    </h1>

                    <p className={`text-neutral-400 text-lg md:text-xl max-w-2xl leading-relaxed transition-all duration-1000 delay-200 ${heroVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                        Harness the power of CGI to communicate your ideas. Showcase the future look of buildings and their surroundings with photorealistic 3D imagery that evokes emotion and captures detail.
                    </p>
                </div>
            </section>

            {/* ════════════════════════════════════════════════════════
                IMPACT GRID
            ════════════════════════════════════════════════════════ */}
            <section className="py-20">
                <div className="px-6 lg:px-12 grid grid-cols-1 md:grid-cols-3 gap-12">
                    {[
                        { title: 'Project Development', desc: 'Show all design options — with finishes, materials, doors, windows, etc. With 3D exterior rendering, analyzing variations becomes effortless.', icon: Box },
                        { title: 'Architectural Presentation', desc: 'Impress clients with CG artwork showing your exterior design in detail — in a photoreal environment, with beautiful lighting scenarios.', icon: Grid3X3 },
                        { title: 'Property Marketing', desc: 'Pre-sell real estate faster than ever before — with showstopping 3D masterpieces that will help your listings stand out in any market.', icon: Play },
                    ].map((item, i) => (
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
                VERSATILE CGI ASSETS
            ════════════════════════════════════════════════════════ */}
            <section className="py-24 bg-neutral-900/50 border-t border-white/5">
                <div className="px-6 lg:px-12">
                    <div className="mb-16 text-center">
                        <h2 className="font-display text-4xl md:text-6xl mb-6 leading-tight">
                            Versatile <span className="text-stroke">CGI Assets</span>
                        </h2>
                        <p className="text-neutral-500 max-w-2xl mx-auto">
                            Use these solutions to make your idea the center of attention everywhere: at client presentations, competitions, social media, and on your website.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {assetCards.map((card, i) => (
                            <div key={i} className="group">
                                {card.useCarousel ? (
                                    <StillRenderCarousel images={carouselGallery} />
                                ) : card.useVideo ? (
                                    <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-neutral-800 mb-8 relative">
                                        <video
                                            autoPlay
                                            muted
                                            loop
                                            playsInline
                                            className="w-full h-full object-cover"
                                        >
                                            <source src={card.videoSrc} type="video/mp4" />
                                        </video>
                                    </div>
                                ) : (
                                    <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-neutral-800 mb-8 relative">
                                        <img
                                            src={card.imgSrc}
                                            alt={card.imgAlt}
                                            className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ${card.hasPlay ? 'opacity-60' : ''}`}
                                        />
                                        {card.hasPlay && (
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 group-hover:scale-110 transition-transform duration-300">
                                                    <Play fill="white" className="w-6 h-6 text-white translate-x-0.5" />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                                <h3 className="text-2xl font-display mb-3 text-white">{card.title}</h3>
                                <p className="text-neutral-400 text-sm leading-relaxed mb-6">{card.desc}</p>

                                {/* Features List */}
                                <div>
                                    <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-3">Features</h4>
                                    <div className="grid grid-cols-2 gap-3">
                                        {card.features.map((feature, idx) => (
                                            <div key={idx} className="flex items-center gap-2 text-sm text-neutral-300">
                                                <CheckCircle2 size={14} className="text-neutral-500 flex-shrink-0" />
                                                {feature}
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
                IMMERSIVE EXPERIENCES (STICKY SCROLL)
            ════════════════════════════════════════════════════════ */}
            <section className="bg-neutral-900/50">
                {/* Section header — scrolls away normally */}
                <div className="px-6 lg:px-12 pt-24 pb-16">
                    <h2 className="font-display text-4xl md:text-6xl mb-6 leading-tight">
                        Lighting & <span className="text-stroke">Perspectives</span>
                    </h2>
                    <p className="text-neutral-500 max-w-xl">
                        From lighting to perspective, every angle of your project captured with precision.
                    </p>
                </div>

                {/* Sticky scroll container */}
                <div
                    className="relative"
                    style={{ height: `${immersiveItems.length * 100}vh` }}
                >
                    {immersiveItems.map((item, i) => (
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
                                    {String(i + 1).padStart(2, '0')} / {String(immersiveItems.length).padStart(2, '0')}
                                </p>

                                <h3 className="text-3xl md:text-4xl font-display mb-4 text-white">
                                    {item.title}
                                </h3>
                                <p className="text-neutral-400 text-sm leading-relaxed max-w-xl mb-10">
                                    {item.description}
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

                                {/* Carousel or Image */}
                                {item.useCarousel ? (
                                    <LightingCarousel pairs={lightingPairs} />
                                ) : item.useLandscapeCarousel ? (
                                    <LandscapeHoverCarousel pairs={landscapePairs} />
                                ) : (
                                    <div className="aspect-video w-full overflow-hidden rounded-2xl bg-neutral-800 relative flex items-center justify-center">
                                        <img
                                            src={item.imgSrc}
                                            alt={item.imgAlt}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-40"
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="flex flex-col items-center gap-4">
                                                <Box className="w-14 h-14 text-white group-hover:scale-110 transition-transform duration-300" />
                                                <span className="text-white text-base font-medium tracking-widest uppercase">
                                                    {item.label}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ════════════════════════════════════════════════════════
                GALLERY SECTION
            ════════════════════════════════════════════════════════ */}
            <section className="py-24 bg-neutral-950">
                <div className="px-6 lg:px-12">
                    <div className="mb-12">
                        <h2 className="font-display text-4xl mb-4">
                            Featured <span className="text-stroke">Exteriors</span>
                        </h2>
                        <p className="text-neutral-500">A collection of our favourite projects.</p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 auto-rows-[200px] gap-4">
                        {galleryImages.map((src, i) => {
                            // Create mosaic pattern with varied sizes
                            const isLarge = i % 5 === 0;
                            const isTall = i % 7 === 0;
                            const isWide = i % 11 === 0;
                            
                            return (
                                <div 
                                    key={i} 
                                    className={`group overflow-hidden rounded-lg bg-neutral-800 ${
                                        isLarge ? 'col-span-2 row-span-2' : 
                                        isTall ? 'row-span-2' : 
                                        isWide ? 'col-span-2' : ''
                                    }`}
                                >
                                    <img
                                        src={src}
                                        alt={`Exterior render ${i + 1}`}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        loading="lazy"
                                    />
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ════════════════════════════════════════════════════════
                PROJECT SPECS & CTA
            ════════════════════════════════════════════════════════ */}
            <ProjectSpecsCTA onOpenQuote={(service) => {
                setIsQuoteFormOpen(true);
            }} />

            {/* ── FAQ ──────────────────────────────────────────────── */}
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
            />

        </div>
    );
};

export default ExteriorRendering;