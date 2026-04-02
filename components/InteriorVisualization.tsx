import React, { useState } from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { useNavigation } from '../hooks/useNavigation';
import { ArrowLeft, CheckCircle2, Play, Plus, Minus, ArrowRight, Box, Grid3X3, Rotate3D, Pause, Volume2, VolumeX, Maximize } from 'lucide-react';
import { Page } from '../types';
import QuoteForm from './QuoteForm';
import PanoramaViewer from './PanoramaViewer';

// Import 3D floor plan images
const floorPlanImages = import.meta.glob('/src/assets/images-optimized/interior/3d-floor-plans-and-dollhouse-gallery/*.{webp,jpg,jpeg,png}', { eager: true, import: 'default' }) as Record<string, string>;
const floorPlanGallery = Object.values(floorPlanImages);

// Import carousel images for Still Renderings
const carouselImages = import.meta.glob('/src/assets/images-optimized/interior/carousel/*.webp', { eager: true, import: 'default' }) as Record<string, string>;
const carouselGallery = Object.values(carouselImages);

// Import panoramic images for 360° Virtual Tours (from panoramas-gallery only)
const panoramaImagesGallery = import.meta.glob('/src/assets/images-optimized/interior/panoramas-gallery/*.{webp,jpg,jpeg,png}', { eager: true, import: 'default' }) as Record<string, string>;
const panoramaGallery = Object.values(panoramaImagesGallery);

// Import featured works images for Visual Excellence gallery (all formats)
const featuredWorksImages = import.meta.glob('/src/assets/images-optimized/interior/featured-works/*.{webp,jpg,jpeg,png}', { eager: true, import: 'default' }) as Record<string, string>;
const featuredWorksGallery = Object.values(featuredWorksImages);

// Import 3D Animation video
const animationVideoImport = import.meta.glob('/src/assets/images-optimized/interior/animation/*.mp4', { eager: true, import: 'default' }) as Record<string, string>;
const animationVideo = Object.values(animationVideoImport)[0] || '';

const FloorPlanGallery: React.FC<{ images: string[] }> = ({ images }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleNext = () => setCurrentIndex((prev) => (prev + 1) % images.length);
    const handlePrev = () => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);

    return (
        <div className="relative w-full h-[45vh] lg:h-full rounded-2xl overflow-hidden bg-neutral-800 flex flex-col">
            {/* Title */}
            <div className="px-4 py-3 bg-neutral-900/80 backdrop-blur-sm border-b border-white/10 flex-shrink-0">
                <h4 className="text-sm font-medium text-white">3D Floor Plan Gallery</h4>
            </div>
            
            <div className="flex-1 relative">
                <img
                    src={images[currentIndex]}
                    alt={`3D Floor Plan ${currentIndex + 1}`}
                    className="w-full h-full object-contain"
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
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-md px-4 py-2 rounded-full text-sm text-white font-medium">
                    {currentIndex + 1} / {images.length}
                </div>
            </div>
        </div>
    );
};

const StillRenderingsGallery: React.FC<{ images: string[] }> = ({ images }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleNext = () => setCurrentIndex((prev) => (prev + 1) % images.length);
    const handlePrev = () => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);

    return (
        <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-neutral-800">
            <img
                src={images[currentIndex]}
                alt={`Still Rendering ${currentIndex + 1}`}
                className="w-full h-full object-cover"
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
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-md px-4 py-2 rounded-full text-sm text-white font-medium">
                {currentIndex + 1} / {images.length}
            </div>
        </div>
    );
};

const PanoramaGallery: React.FC<{ images: string[] }> = ({ images }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleNext = () => setCurrentIndex((prev) => (prev + 1) % images.length);
    const handlePrev = () => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);

    if (images.length === 0) {
        return (
            <div className="relative w-full h-[60vh] lg:h-full rounded-2xl overflow-hidden bg-neutral-800 flex items-center justify-center">
                <div className="text-center text-neutral-400">
                    <Rotate3D size={48} className="mx-auto mb-4 opacity-50" />
                    <p>No panoramic images available</p>
                </div>
            </div>
        );
    }

    return (
        <div className="relative w-full h-[45vh] lg:h-full rounded-2xl overflow-hidden bg-neutral-900 border border-white/10 flex flex-col">
            {/* Title */}
            <div className="px-4 py-3 bg-neutral-900/80 backdrop-blur-sm border-b border-white/10 flex-shrink-0 flex items-center justify-between">
                <h4 className="text-sm font-medium text-white">360° Panorama Gallery</h4>
                <div className="flex items-center gap-2 text-xs text-neutral-400">
                    <Rotate3D size={14} className="text-green-400" />
                    <span>360° View</span>
                </div>
            </div>
            
            {/* Panorama Viewer */}
            <div className="flex-1 relative">
                <PanoramaViewer
                    mode="normal"
                    imageSrc={images[currentIndex]}
                />

                {/* Navigation buttons */}
                <button
                    onClick={handlePrev}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 hover:bg-white/20 transition-colors z-40"
                    aria-label="Previous panorama"
                >
                    <ArrowLeft size={24} className="text-white" />
                </button>
                <button
                    onClick={handleNext}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 hover:bg-white/20 transition-colors z-40"
                    aria-label="Next panorama"
                >
                    <ArrowRight size={24} className="text-white" />
                </button>

                {/* Counter & Info */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full text-sm text-white font-medium flex items-center gap-3 z-40">
                    <Rotate3D size={14} className="text-green-400" />
                    <span>{currentIndex + 1} / {images.length}</span>
                </div>

                {/* Thumbnail strip */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 flex gap-2 bg-black/60 backdrop-blur-md p-2 rounded-xl border border-white/10 z-40 max-w-[80%] overflow-x-auto">
                    {images.slice(0, 6).map((img, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentIndex(idx)}
                            className={`w-12 h-12 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${
                                currentIndex === idx
                                    ? 'border-white scale-110'
                                    : 'border-white/20 hover:border-white/50 opacity-60 hover:opacity-100'
                            }`}
                        >
                            <img src={img} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover" />
                        </button>
                    ))}
                    {images.length > 6 && (
                        <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center text-white text-xs font-medium border border-white/20 flex-shrink-0">
                            +{images.length - 6}
                        </div>
                    )}
                </div>
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

const AnimationVideoPlayer: React.FC = () => {
    const [isPlaying, setIsPlaying] = useState(true);
    const [isMuted, setIsMuted] = useState(true);
    const [progress, setProgress] = useState(0);
    const videoRef = React.useRef<HTMLVideoElement>(null);

    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const toggleMute = () => {
        if (videoRef.current) {
            videoRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    const toggleFullscreen = () => {
        if (videoRef.current) {
            if (document.fullscreenElement) {
                document.exitFullscreen();
            } else {
                videoRef.current.requestFullscreen();
            }
        }
    };

    const handleTimeUpdate = () => {
        if (videoRef.current) {
            const progress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
            setProgress(progress || 0);
        }
    };

    const handleEnded = () => {
        setIsPlaying(false);
        setProgress(0);
    };

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (videoRef.current) {
            const seekTime = (parseFloat(e.target.value) / 100) * videoRef.current.duration;
            videoRef.current.currentTime = seekTime;
            setProgress(parseFloat(e.target.value));
        }
    };

    return (
        <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-neutral-900 group">
            <video
                ref={videoRef}
                src={animationVideo}
                className="w-full h-full object-cover"
                muted={isMuted}
                onTimeUpdate={handleTimeUpdate}
                onEnded={handleEnded}
                onClick={togglePlay}
                playsInline
                autoPlay
                loop
            />

            {/* Play/Pause overlay indicator */}
            {!isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                    <button
                        onClick={togglePlay}
                        className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 hover:bg-white/20 hover:scale-110 transition-all duration-300"
                        aria-label="Play video"
                    >
                        <Play fill="white" className="w-10 h-10 text-white translate-x-1" />
                    </button>
                </div>
            )}

            {/* Controls overlay - appears on hover */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {/* Progress bar */}
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={progress}
                    onChange={handleSeek}
                    className="w-full h-1 bg-white/20 rounded-full appearance-none cursor-pointer mb-3 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:cursor-pointer"
                    aria-label="Video progress"
                />

                {/* Control buttons */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={togglePlay}
                            className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
                            aria-label={isPlaying ? 'Pause' : 'Play'}
                        >
                            {isPlaying ? (
                                <Pause size={20} className="text-white" />
                            ) : (
                                <Play fill="white" size={20} className="text-white translate-x-0.5" />
                            )}
                        </button>

                        <button
                            onClick={toggleMute}
                            className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
                            aria-label={isMuted ? 'Unmute' : 'Mute'}
                        >
                            {isMuted ? (
                                <VolumeX size={20} className="text-white" />
                            ) : (
                                <Volume2 size={20} className="text-white" />
                            )}
                        </button>
                    </div>

                    <button
                        onClick={toggleFullscreen}
                        className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
                        aria-label="Fullscreen"
                    >
                        <Maximize size={20} className="text-white" />
                    </button>
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
            title: "Still Renderings",
            subtitle: "Photorealistic images",
            desc: "Photorealistic images that showcase colors, textures, and lighting with exceptional accuracy. Perfect for presentations, catalogs, and high-end portfolios.",
            features: ["4K resolution (3840x2160)", "Photorealistic lighting", "Multiple viewpoints", "Print-ready files"],
            deliverables: ["4K resolution (3840x2160)", "PNG/JPG format", "Print-ready 300 DPI", "Web-optimized versions"],
            requirements: ["Floor Plans", "Material References", "Lighting Plan", "Key Viewpoints"],
            process: [
                { id: "01", title: "Submit Drawings", desc: "Share your floor plans, sketches, or 3D models with material references and desired viewpoints." },
                { id: "02", title: "3D Modeling & Texturing", desc: "We construct accurate 3D geometry from your drawings and apply photorealistic materials matching your references—capturing surface details, colors, and finishes precisely." },
                { id: "03", title: "Lighting & Rendering", desc: "Realistic lighting is set up to match your desired mood and time of day. We render high-quality drafts for your review and feedback." },
                { id: "04", title: "Post-Production & Delivery", desc: "Final renders are color-corrected and enhanced. You receive print-ready and web-optimized files for immediate use." }
            ]
        },
        {
            title: "3D Animation",
            subtitle: "Cinematic videos",
            desc: "Cinematic videos that demonstrate spatial relationships and movement flow. Create emotional connections through dynamic storytelling.",
            features: ["4K video (MP4)", "30fps or 60fps", "Color graded", "Web and presentation ready"],
            deliverables: ["4K video (MP4)", "30fps or 60fps", "Color graded", "Web and presentation ready"],
            requirements: ["3D model or floor plans", "Camera path preferences", "Material references", "Target duration"],
            process: [
                { id: "01", title: "Plan Camera Path", desc: "Discuss the route and key moments you want to highlight in the walkthrough." },
                { id: "02", title: "Create Animation", desc: "We animate smooth camera movements and render frame-by-frame at 4K quality." },
                { id: "03", title: "Review & Revise", desc: "Watch the draft video and request adjustments to timing, path, or visuals." },
                { id: "04", title: "Receive Final Video", desc: "Get your polished video in all required formats, ready to present or publish." }
            ]
        },
        {
            title: "3D Floor Plans",
            subtitle: "Spatial layouts",
            desc: "Clear overhead views that show spatial layout and furniture arrangement at a glance. Essential for real estate listings, lease presentations, and quick client approvals.",
            features: ["High-res PNG/JPG", "PDF with dimensions", "Multiple floor levels", "Transparent background option"],
            deliverables: ["High-res PNG/JPG", "PDF with dimensions", "Multiple floor levels", "Transparent background option"],
            requirements: ["CAD floor plans", "Furniture specs", "Dimension requirements", "View angle preference"],
            process: [
                { id: "01", title: "Share Plans", desc: "Send your CAD drawings with furniture requirements and dimension specifications." },
                { id: "02", title: "We Model in 3D", desc: "Convert your 2D plans into 3D with walls, floors, and furniture accurately placed." },
                { id: "03", title: "Review Layout", desc: "Check the 3D floor plan and request any adjustments to furniture or annotations." },
                { id: "04", title: "Get Final Files", desc: "Receive annotated floor plans in PDF and image formats, ready to use." }
            ]
        },
        {
            title: "3D Virtual Tours",
            subtitle: "Interactive experiences",
            desc: "Interactive experiences that allow viewers to navigate spaces freely. Detailed panoramic views compatible with web, mobile, and VR headsets.",
            features: ["360° panoramic renders", "Web player (HTML5)", "VR headset support", "Mobile responsive"],
            deliverables: ["360° panoramic renders", "Web player (HTML5)", "VR headset support", "Mobile responsive"],
            requirements: ["3D model or floor plans", "Navigation points", "Platform preference", "Branding assets"],
            process: [
                { id: "01", title: "Define Viewpoints", desc: "Identify key locations throughout the space for 360° camera placement." },
                { id: "02", title: "Render Panoramas", desc: "We create full spherical renders from each viewpoint with accurate lighting." },
                { id: "03", title: "Build Tour", desc: "Connect viewpoints with navigation hotspots. You review the interactive experience." },
                { id: "04", title: "Launch Tour", desc: "Publish to your website or share via link. Works on all devices and VR headsets." }
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

const InteriorVisualization: React.FC<{ onNavigate: (page: Page) => void }> = ({ onNavigate }) => {
    const [heroRef, heroVisible] = useIntersectionObserver<HTMLElement>({ threshold: 0.1 });
    const [isQuoteFormOpen, setIsQuoteFormOpen] = useState(false);
    const { navigateToServices } = useNavigation();

    const immersiveItems = [
        {
            title: '3D Floor Plans',
            description: 'Clear overhead views that show spatial layout and furniture arrangement at a glance. Essential for real estate listings, lease presentations, and quick client approvals.',
            imgSrc: floorPlanGallery.length > 0 ? floorPlanGallery[0] : '/interior/3d-floor-plans-and-dollhouse-gallery/fallback.png',
            imgAlt: '3D Floor Plans',
            label: 'View Floor Plan',
            features: ['Furniture layout included', 'Dimension annotations', 'Multiple floor levels', 'Export to PDF/Image']
        },
        {
            title: '360° Panoramas',
            description: 'Full spherical views that let clients explore every angle. Perfect for virtual open houses, remote presentations, and interactive web experiences.',
            imgSrc: panoramaGallery.length > 0 ? panoramaGallery[0] : 'https://archicgi.com/wp-content/uploads/2025/03/living-room-interior-3d-rendering-MU5SFJXV-4000x2250.jpg',
            imgAlt: '360° Panoramas',
            label: 'Explore 360° View',
            features: ['Full 360° panoramic views', 'Interactive navigation', 'VR headset compatible', 'Web & mobile ready', 'Custom branding options']
        }
    ];

    const assetCards = [
        {
            imgSrc: carouselGallery.length > 0 ? carouselGallery[0] : 'https://archicgi.com/wp-content/uploads/2025/09/interior-render-drawing-room.webp',
            imgAlt: 'Still Render',
            hasPlay: false,
            title: 'Still Renderings',
            desc: 'Photorealistic images that showcase colors, textures, and lighting with exceptional accuracy. Perfect for presentations, catalogs, and high-end portfolios.',
            features: ['4K resolution (3840x2160)', 'Photorealistic lighting', 'Multiple viewpoints', 'Print-ready 300 DPI']
        },
        {
            imgSrc: 'https://archicgi.com/wp-content/uploads/2025/09/interior-3D-animation-cover-frame-png.webp',
            imgAlt: '3D Animation',
            hasPlay: true,
            title: '3D Animation',
            desc: 'Cinematic videos that demonstrate spatial relationships and movement flow. Create emotional connections through dynamic storytelling.',
            features: ['4K video output', '30fps smooth playback', 'Cinematic camera moves', 'Color graded']
        },
    ];

    const faqs = [
        { q: 'How do I start a project?', a: 'Email us at contact@noveld.com.et, book a call, or message us on chat. Share your floor plans and requirements. We respond within 24 hours with a quote.' },
        { q: 'What is 3D interior rendering?', a: 'Creating photorealistic images of interior spaces using 3D software. It lets you see and approve designs before construction begins.' },
        { q: 'How much does it cost?', a: 'Depends on room complexity, resolution, and deliverable type. Contact us with your project details for a custom quote.' },
        { q: 'How long does it take?', a: '3-5 days per room for still images. Animations and virtual tours take 1-2 weeks. Rush delivery available.' },
        { q: 'What software do you use?', a: '3ds Max, Corona Renderer, V-Ray for rendering. Unreal Engine 5 for virtual tours. Adobe Suite for post-production.' },
        { q: 'What files will I receive?', a: 'High-resolution PNG/JPG for print and web. MP4 for videos. HTML5 player for virtual tours. Other formats on request.' },
    ];

    return (
        <div className="bg-neutral-950 min-h-screen pt-20">

            {/* ── Hero ─────────────────────────────────────────────── */}
            <section ref={heroRef} className="relative py-24 lg:py-32 px-6 lg:px-12 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://archicgi.com/wp-content/uploads/2025/09/living-room-interior-3d-visualization.webp?id=32098"
                        alt=""
                        aria-hidden="true"
                        className="w-full h-full object-cover opacity-20"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/90 to-transparent" />
                </div>

                <div className="relative z-10 px-6 lg:px-12">
                    <button
                        onClick={() => navigateToServices(onNavigate)}
                        className="inline-flex items-center gap-2 text-neutral-400 hover:text-white mb-10 transition-colors text-sm tracking-widest uppercase"
                    >
                        <ArrowLeft size={16} />
                        Back to Services
                    </button>

                    <h1 className={`font-display text-5xl md:text-8xl font-medium mb-8 leading-tight transition-all duration-1000 ${heroVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                        3D Interior <br />
                        <span className="text-stroke text-white/90">Visualization</span>
                    </h1>

                    <p className={`text-neutral-400 text-lg md:text-xl max-w-2xl leading-relaxed transition-all duration-1000 delay-200 ${heroVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                        Photorealistic renders and animations for architecture firms, interior designers, and real estate developers. Win more projects with visuals that sell.Transform your interior concepts into stunning, lifelike visuals. From residential spaces to commercial environments
                    </p>
                </div>
            </section>

            {/* ── Why Choose Us ────────────────────────────────────── */}
            <section className="py-20 border-t border-white/5">
                <div className="px-6 lg:px-12 grid grid-cols-1 md:grid-cols-3 gap-12">
                    {[
                        { title: 'Photorealistic Quality', desc: "You will receive imagery that's indistinguishable from reality. Your clients, stakeholders, and subscribers will be impressed by the level of detail and lighting accuracy." },
                        { title: 'Customization',          desc: 'We can provide you with any 3D interior design solution you require. Be it static imagery, a cinematic 3D walkthrough, or a virtual 3D Tour for immersive experiences.' },
                        { title: 'Dedicated Team',         desc: 'You will be assigned a CGI team with a project manager and art director. They will work on all your tasks, acting as an extension of your in-house team.' },
                    ].map((item, i) => (
                        <div key={i} className="group cursor-default">
                            <h3 className="font-display text-2xl mb-4 text-white group-hover:text-neutral-400 transition-colors">{item.title}</h3>
                            <p className="text-neutral-500 text-sm leading-relaxed">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── Versatile Interior Assets ─────────────────────────── */}
            <section className="py-24 bg-neutral-900/50">
                <div className="px-6 lg:px-12">
                    <div className="mb-16">
                        <h2 className="font-display text-4xl md:text-6xl mb-6 leading-tight">
                            Versatile <span className="text-stroke">Interior Assets</span>
                        </h2>
                        <p className="text-neutral-500 max-w-xl"> Still renders, animations, floor plans, and virtual tours—everything you need to present and sell your designs </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {assetCards.map((card, i) => (
                            <div key={i} className="group">
                                {/* Still Renderings - Gallery Carousel */}
                                {i === 0 ? (
                                    <StillRenderingsGallery images={carouselGallery} />
                                ) : (
                                    /* 3D Animation - Video Player */
                                    <AnimationVideoPlayer />
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

            {/* ── Immersive Experiences — sticky scroll ─────────────── */}
            <section className="bg-neutral-900/50">
                {/* Section header — scrolls away normally */}
                <div className="px-6 lg:px-12 pt-24 pb-16">
                    <div className="flex items-center gap-4 mb-6">
                        <Rotate3D className="w-8 h-8 text-white/60" />
                        <span className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Interactive Assets</span>
                    </div>
                    <h2 className="font-display text-4xl md:text-6xl mb-6 leading-tight">
                        3D Floor Plan & <span className="text-stroke">360° Panoramas</span>
                    </h2>
                    <p className="text-neutral-500 max-w-xl">
                        Let clients explore spaces at their own pace. Works on web, mobile, and VR headsets.
                    </p>
                </div>

                {/*
                 * The outer div height = number of cards × 100vh
                 * Each card sticks for exactly 100vh of scroll, then
                 * the next card slides over it. No extra spacer needed.
                 */}
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

                            {/* Card content - fits within viewport on mobile, original on desktop */}
                            <div className="relative z-10 w-full px-6 lg:px-12 py-8 lg:py-16 group h-full flex flex-col">
                                {/* Step counter */}
                                <p className="text-xs text-neutral-600 tracking-widest uppercase mb-4 lg:mb-6 font-medium flex-shrink-0">
                                    {String(i + 1).padStart(2, '0')} / {String(immersiveItems.length).padStart(2, '0')}
                                </p>

                                {/* Header content - flexible but limited */}
                                <div className="flex-shrink-0 mb-4 lg:mb-6">
                                    <h3 className="text-2xl md:text-3xl lg:text-4xl font-display mb-3 lg:mb-4 text-white">
                                        {item.title}
                                    </h3>
                                    <p className="text-neutral-400 text-sm leading-relaxed max-w-xl mb-4 lg:mb-6">
                                        {item.description}
                                    </p>

                                    {/* Features List - compact on mobile, original on desktop */}
                                    <div className="grid grid-cols-2 gap-2 lg:gap-3 mb-4 lg:mb-6">
                                        {item.features.map((feature, idx) => (
                                            <div key={idx} className="flex items-center gap-2 text-xs lg:text-sm text-neutral-300">
                                                <CheckCircle2 size={12} className="text-green-500 flex-shrink-0" />
                                                {feature}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Gallery - takes remaining space on mobile, original height on desktop */}
                                <div className="flex-1 min-h-0 mb-4 lg:mb-0 lg:h-auto">
                                    {i === 0 ? (
                                        <FloorPlanGallery images={floorPlanGallery} />
                                    ) : (
                                        /* Virtual Tours - 360° Panorama Gallery */
                                        <PanoramaGallery images={panoramaGallery} />
                                    )}
                                </div>
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
                            Visual <span className="text-stroke">Excellence</span>
                        </h2>
                        <p className="text-neutral-500">
                            A selection of photorealistic interior renders spanning residential and commercial projects.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 auto-rows-[200px] gap-4">
                        {featuredWorksGallery.map((src, i) => {
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
                                        alt={`Interior render ${i + 1}`}
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
            <ProjectSpecsCTA onOpenQuote={() => setIsQuoteFormOpen(true)} />

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

export default InteriorVisualization;
