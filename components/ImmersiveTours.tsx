import React, { useState, useRef, useEffect } from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { useNavigation } from '../hooks/useNavigation';
import { ArrowLeft, ChevronDown, Plus, Minus, Monitor, Globe, Glasses, Layers, Box, Code, Cloud, CheckCircle2, ArrowRight, Play } from 'lucide-react';
import { Page } from '../types';
import QuoteForm from './QuoteForm';
import VideoPlayer from './VideoPlayer';

// FAQ Component
const FAQItem: React.FC<{ question: string, answer: string }> = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border border-white/10 rounded-xl overflow-hidden bg-white/[0.02]">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full px-6 py-5 flex items-center justify-between text-left group cursor-hover"
            >
                <span className="font-medium text-lg text-white group-hover:text-neutral-300 transition-colors pr-8">{question}</span>
                {isOpen ? <Minus className="flex-shrink-0 w-5 h-5 text-neutral-400" /> : <Plus className="flex-shrink-0 w-5 h-5 text-neutral-400" />}
            </button>
            <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="px-6 pb-6 text-neutral-400 leading-relaxed text-sm border-t border-white/5 pt-4">
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
            title: "Normal 360 Panorama",
            subtitle: "Spherical imagery",
            desc: "High-resolution 360° panoramic renders that allow viewers to look in every direction. Perfect for virtual property tours and immersive marketing.",
            features: ["8K resolution (7680x3840)", "Full 360° horizontal view", "180° vertical coverage", "Web & mobile compatible"],
            deliverables: ["8K panoramic renders", "JPG/PNG format", "Equirectangular projection", "Web viewer integration"],
            requirements: ["3D model or floor plans", "Camera positions", "Lighting preferences", "Furnishing specifications"],
            process: [
                { id: "01", title: "Camera Setup", desc: "Positioning 360° cameras at strategic viewpoints throughout the space." },
                { id: "02", title: "Spherical Rendering", desc: "Rendering full spherical panoramas with proper lighting and materials." },
                { id: "03", title: "Stitching", desc: "Seamlessly blending multiple renders for complete coverage." },
                { id: "04", title: "Delivery", desc: "Exporting in equirectangular format for web or VR platforms." }
            ]
        },
        {
            title: "Virtual Staging",
            subtitle: "Digital furnishing",
            desc: "Transform empty spaces into beautifully furnished homes. Show potential buyers how rooms can be utilized with stylish, modern furniture.",
            features: ["Photorealistic furniture", "Multiple style options", "Scale accurate", "Instant transformation"],
            deliverables: ["Staged panoramic views", "Multiple furniture styles", "Before/after comparisons", "High-resolution renders"],
            requirements: ["Empty space 3D model", "Style preferences", "Target demographic", "Budget tier references"],
            process: [
                { id: "01", title: "Space Analysis", desc: "Understanding room dimensions, lighting, and architectural features." },
                { id: "02", title: "Style Selection", desc: "Choosing furniture styles that match the target audience and price point." },
                { id: "03", title: "3D Placement", desc: "Positioning furniture, decor, and accessories with proper scale." },
                { id: "04", title: "Final Rendering", desc: "Creating photorealistic renders with proper lighting and shadows." }
            ]
        },
        {
            title: "Interactive VR Fusion",
            subtitle: "Mixed reality tours",
            desc: "Combine real photography with CGI elements for hybrid experiences. Add virtual furniture, finishes, or architectural changes to existing spaces.",
            features: ["Photo + CGI blend", "Real-time switching", "VR headset ready", "Interactive hotspots"],
            deliverables: ["Hybrid VR experiences", "Interactive hotspots", "Multiple finish options", "Web & VR compatible"],
            requirements: ["Existing space photos", "3D model of additions", "Interaction requirements", "Platform preferences"],
            process: [
                { id: "01", title: "Photo Capture", desc: "Taking high-resolution photographs of the existing space." },
                { id: "02", title: "3D Integration", desc: "Modeling and positioning CGI elements to match the photography." },
                { id: "03", title: "Lighting Match", desc: "Matching CGI lighting to the real-world photo conditions." },
                { id: "04", title: "Interactive Build", desc: "Adding hotspots, switches, and navigation for user interaction." }
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

// Sticky Feature Scroll Component
const features = [
    {
        title: "Amenities Showcase",
        desc: "Allow potential clients to stroll through common areas, pools, and gyms. Interactive pop-ups provide detailed specifications about equipment and finishes.",
        video: "https://archicgi.com/wp-content/uploads/2025/10/Unlock-the-Full-Potential-of-Your-Property-with-3D-Amenity-Showcases.mp4",
        tags: ["Interactive Popups", "Free Roam", "Detailed Specs"]
    },
    {
        title: "Interior Customization",
        desc: "An in-built configurator lets users swap floor finishes, kitchen cabinets, and furniture styles instantly, helping them visualize their dream home.",
        video: "/src/assets/images-optimized/interactive/interior/Twinmotion 2026-02-20 15-36-55-edited-final.mp4",
        tags: ["Real-time Configurator", "Material Swapping", "Instant Visuals"]
    },
    {
        title: "Time & Weather Control",
        desc: "Viewers can toggle between sunny mornings, golden hours, or cozy rainy evenings to experience the property's atmosphere in any condition.",
        video: "/src/assets/images-optimized/interactive/weather/MetropolitanReal - Unreal Editor 2026-01-11 17-34-35 (online-video-cutter.com).mp4",
        tags: ["Day/Night Cycle", "Weather Systems", "Atmospheric Lighting"]
    },
    {
        title: "Unit Selector",
        desc: "A seamless interface to filter and select available units from a 3D building model, instantly transporting the user inside the specific apartment.",
        video: "/src/assets/images-optimized/interactive/unitselector/TemerProperties - Unreal Editor 2026-02-22 15-35-43 (online-video-cutter.com).mp4",
        tags: ["3D Filtering", "Inventory System", "Instant Teleport"]
    }
];

const FeatureScrollSection: React.FC = () => {
    return (
        <section className="relative bg-neutral-950 pt-24 pb-48 px-6 lg:px-12 border-t border-white/5">
            <div className="mb-24 text-center">
                 <h2 className="font-display text-4xl md:text-6xl mb-6 leading-tight">Interactive <span className="text-stroke">Features</span></h2>
                 <p className="text-neutral-500 max-w-2xl mx-auto text-lg">
                    Discover the powerful tools embedded within our immersive tours designed to convert interest into action.
                 </p>
            </div>

            <div className="relative">
                {features.map((feature, idx) => (
                    <div
                        key={idx}
                        className="sticky top-24 lg:top-32 min-h-[80vh] lg:min-h-[700px] py-12"
                    >
                         <div className="bg-neutral-900/90 backdrop-blur-xl border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl hover:border-white/20 transition-colors duration-500">
                            <div className="grid grid-cols-1 lg:grid-cols-2 h-full min-h-[600px] lg:min-h-[700px]">
                                {/* Media Side */}
                                <div className={`relative h-[400px] lg:h-auto ${idx % 2 === 1 ? 'lg:order-2' : 'lg:order-1'}`}>
                                    <VideoPlayer 
                                        src={feature.video}
                                        aspectRatio="video"
                                        className="w-full h-full"
                                    />
                                </div>

                                {/* Text Side */}
                                <div className={`p-8 md:p-12 lg:p-16 flex flex-col justify-center ${idx % 2 === 1 ? 'lg:order-1' : 'lg:order-2'}`}>
                                     <span className="inline-block px-4 py-2 bg-white/5 border border-white/10 rounded-full text-xs font-medium uppercase tracking-widest text-neutral-400 mb-8 w-fit">
                                        Feature 0{idx + 1}
                                     </span>
                                     <h3 className="font-display text-3xl md:text-4xl lg:text-5xl mb-6 text-white leading-tight">
                                        {feature.title}
                                     </h3>
                                     <p className="text-neutral-400 text-lg leading-relaxed mb-8">
                                        {feature.desc}
                                     </p>
                                     
                                     <div className="flex flex-wrap gap-3 mt-auto">
                                         {feature.tags.map((tag, i) => (
                                             <span key={i} className="px-4 py-2 bg-white/5 rounded-full text-xs font-medium text-neutral-500 border border-white/5 hover:bg-white/10 hover:text-white transition-colors cursor-default">
                                                 {tag}
                                             </span>
                                         ))}
                                     </div>

                                     <div className="flex items-center gap-2 text-white/60 hover:text-white transition-colors mt-8 cursor-pointer w-fit group">
                                        <span className="text-sm font-medium tracking-wide">Explore Details</span>
                                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                     </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};


const ImmersiveTours: React.FC<{ onNavigate: (page: Page) => void }> = ({ onNavigate }) => {
    const [heroRef, heroVisible] = useIntersectionObserver<HTMLElement>();
    const [isQuoteFormOpen, setIsQuoteFormOpen] = useState(false);
    const { navigateToServices } = useNavigation();

    return (
        <div className="bg-neutral-950 min-h-screen pt-20">
            {/* Hero */}
            <section ref={heroRef} className="relative py-24 lg:py-32 px-6 lg:px-12 overflow-hidden">
                 <div className="absolute inset-0 z-0">
                    <img src="https://archicgi.com/wp-content/uploads/2025/10/10013.YnUv7_NL-png.webp"
                        alt="Immersive Tour Hero" className="w-full h-full object-cover opacity-30" />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/80 to-transparent"></div>
                </div>
                
                <div className="relative z-10 ">
                    <button
                        onClick={() => navigateToServices(onNavigate)}
                        className="inline-flex items-center gap-2 text-neutral-400 hover:text-white mb-10 transition-colors text-sm tracking-widest uppercase cursor-hover"
                    >
                        <ArrowLeft size={16} /> Back to Services
                    </button>
                    
                    <h1 className={`font-display text-5xl md:text-8xl font-medium mb-8 leading-tight transition-all duration-1000 ${heroVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                        Immersive <br/>
                        <span className="text-stroke text-white/90">3D Experiences</span>
                    </h1>
                    
                    <p className={`text-neutral-300 text-lg md:text-2xl max-w-3xl leading-relaxed transition-all duration-1000 delay-200 ${heroVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                        Pre-sell and pre-lease properties effortlessly with next-generation interactive tours powered by Unreal Engine.
                    </p>
                </div>
                
                {/* Scroll Indicator */}
                <div className={`absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 transition-opacity duration-700 ${heroVisible ? 'opacity-100' : 'opacity-0'}`}>
                    <span className="text-xs uppercase tracking-widest text-white/50">Explore Features</span>
                    <ChevronDown className="w-5 h-5 text-white/50 animate-bounce" />
                </div>
            </section>

             {/* Impact Grid (Value Propositions) */}
            <section className="py-20 px-6 lg:px-12 border-t border-white/5">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {[
                        { title: "Unmatched Engagement", desc: "Interactive tours keep users engaged 300% longer than static images. Transform passive viewers into active explorers." },
                        { title: "Global Accessibility", desc: "Break geographical barriers. With Pixel Streaming, clients anywhere in the world can experience high-fidelity tours on any device." },
                        { title: "Accelerated Sales", desc: "Empower buyers to connect emotionally with the space. Real-time customization builds ownership before the purchase." }
                    ].map((item, i) => (
                        <div key={i} className="group cursor-default">
                             <div className="h-px w-12 bg-white/20 mb-6 group-hover:w-full transition-all duration-500"></div>
                            <h3 className="font-display text-2xl mb-4 text-white group-hover:text-neutral-400 transition-colors">{item.title}</h3>
                            <p className="text-neutral-500 text-sm leading-relaxed">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

             {/* Versatile Interactive Solutions (Matching ExteriorRendering Style) */}
             <section className="py-24 px-6 lg:px-12 bg-neutral-900/50">
                <div className="">
                    <div className="mb-16">
                         <h2 className="font-display text-4xl md:text-6xl mb-6 leading-tight">Versatile <span className="text-stroke">Solutions</span></h2>
                         <p className="text-neutral-500 max-w-xl">Whether for expansive developments or intimate interiors, we have the interactive solution to match.</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Exterior Interactive */}
                        <div className="group cursor-hover">
                            <VideoPlayer 
                                src="../src/assets/images-optimized/interactive/exterior/TemerProperties - Unreal Editor 2026-02-22 15-35-43 (online-video-cutter.com).mp4"
                                aspectRatio="video"
                                className="mb-8"
                            />
                            <h3 className="text-2xl font-display mb-3">Exterior Interactive Tours</h3>
                            <p className="text-neutral-400 text-sm leading-relaxed">Let clients fly around the development, explore amenities, and understand the project's scale within its environment. Perfect for masterplans and multi-building complexes.</p>
                        </div>

                         {/* Interior Interactive */}
                        <div className="group cursor-hover">
                            <VideoPlayer 
                                src="../src/assets/images-optimized/interactive/interior/Twinmotion 2026-02-20 15-36-55-clip.mp4"
                                aspectRatio="video"
                                className="mb-8"
                            />
                            <h3 className="text-2xl font-display mb-3">Interior Interactive Tours</h3>
                            <p className="text-neutral-400 text-sm leading-relaxed">Walk through every room, open doors, and interact with the space. High-fidelity textures and lighting make it feel like the property is already built.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Sticky Scroll Feature Section (Updated) */}
            <FeatureScrollSection />

            {/* Flexible Presentation Methods */}
            <section className="py-24 px-6 lg:px-12 bg-neutral-950 z-20 relative">
                <div className="">
                    <div className="mb-12">
                         <h2 className="font-display text-4xl mb-4">Deployment <span className="text-stroke">Options</span></h2>
                         <p className="text-neutral-500">Deliver your experience exactly where your audience is.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                         {[
                             { 
                                 title: "Online Streaming", 
                                 desc: "Zero downloads. Stream directly to any web browser via Pixel Streaming.", 
                                 icon: Globe
                             },
                             { 
                                 title: "Offline Executable", 
                                 desc: "Native Windows application for maximum performance in showrooms.", 
                                 icon: Monitor
                             },
                             { 
                                 title: "Virtual Reality", 
                                 desc: "Full immersion via Meta Quest or HTC Vive headsets.", 
                                 icon: Glasses
                             }
                         ].map((item, idx) => (
                            <div key={idx} className="bg-neutral-900 border border-white/5 p-8 rounded-2xl hover:border-white/20 transition-all group">
                                <div className="w-12 h-12 bg-neutral-950 border border-white/10 rounded-lg flex items-center justify-center mb-6 text-white group-hover:scale-110 transition-transform">
                                    <item.icon size={24} />
                                </div>
                                <h3 className="font-display text-xl mb-3 text-white">{item.title}</h3>
                                <p className="text-neutral-500 text-sm leading-relaxed">{item.desc}</p>
                            </div>
                         ))}
                    </div>
                </div>
            </section>

             {/* Interactive Pipeline (Process Section) */}
             <section className="py-24 px-6 lg:px-12 bg-neutral-900 border-y border-white/5 z-20 relative">
                <div className="">
                    <h2 className="font-display text-4xl md:text-6xl mb-16 text-center">Interactive <span className="text-stroke">Pipeline</span></h2>
                    
                    <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden lg:block absolute top-8 left-[10%] right-[10%] h-px bg-gradient-to-r from-neutral-800 via-white/20 to-neutral-800 z-0"></div>

                        {[
                            { id: "01", title: "Asset Prep", desc: "Optimizing 3D models for real-time performance.", icon: Layers },
                            { id: "02", title: "Scene Build", desc: "Setting up lighting and materials in Unreal Engine 5.", icon: Box },
                            { id: "03", title: "Logic Setup", desc: "Programming interactivity and UI functionality.", icon: Code },
                            { id: "04", title: "Deployment", desc: "Cloud setup for streaming or packaging for install.", icon: Cloud }
                        ].map((step, idx) => (
                            <div key={idx} className="relative z-10 bg-neutral-950/80 backdrop-blur-sm border border-white/5 p-8 rounded-2xl hover:border-white/20 transition-all group cursor-default">
                                <div className="w-16 h-16 bg-neutral-900 border border-white/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-white group-hover:text-neutral-950 transition-all duration-500 shadow-lg">
                                    <step.icon size={24} className="transition-colors" />
                                </div>
                                <span className="text-xs font-bold text-neutral-600 mb-3 block tracking-widest uppercase">Stage {step.id}</span>
                                <h3 className="text-xl font-display text-white mb-3">{step.title}</h3>
                                <p className="text-neutral-400 text-sm leading-relaxed">{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

             {/* Briefing/Requirements Section */}
             <section className="py-24 px-6 lg:px-12 bg-neutral-900/30 border-t border-white/5 z-20 relative">
                <div className="">
                    <div className="bg-gradient-to-br from-neutral-900 to-neutral-950 border border-white/10 rounded-3xl p-8 lg:p-16 relative overflow-hidden">
                        {/* Background Deco */}
                        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/[0.02] rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 relative z-10">
                            <div>
                                <h2 className="font-display text-3xl md:text-4xl mb-8">Technical <span className="text-neutral-400 italic">Requirements</span></h2>
                                <p className="text-neutral-400 mb-8">To build a seamless interactive experience, we align on both design and technical specifications early in the process.</p>
                                
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {[
                                        "3D Models (Revit/SketchUp)",
                                        "Interior Design Brief",
                                        "UI/UX Branding Guidelines",
                                        "Target Hardware Specs",
                                        "Desired Interactive Features",
                                        "Deployment Platform"
                                    ].map((req, i) => (
                                        <div key={i} className="flex items-center gap-3 text-sm text-neutral-300">
                                            <CheckCircle2 size={16} className="text-white/40 flex-shrink-0" />
                                            {req}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex flex-col justify-center lg:border-l border-white/10 lg:pl-16">
                                <h3 className="font-display text-3xl md:text-5xl mb-6">Build The <br/><span className="italic text-neutral-400">Future</span></h3>
                                <p className="text-neutral-500 mb-8">Partner with Novel-D to create immersive sales tools that convert.</p>
                                <button 
                                    onClick={() => setIsQuoteFormOpen(true)}
                                    className="bg-white text-neutral-950 px-8 py-4 text-sm font-medium hover:bg-neutral-200 transition-colors uppercase tracking-widest flex items-center justify-center gap-3 w-fit cursor-hover"
                                >
                                    Get a Free Quote for Your Project
                                    <ArrowRight size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

             {/* ═══ PROJECT SPECS & CTA ═══ */}
             <ProjectSpecsCTA onOpenQuote={() => setIsQuoteFormOpen(true)} />

             {/* FAQ */}
             <section className="py-24 px-6 lg:px-12 z-20 relative">
                <div className="max-w-3xl mx-auto">
                    <h2 className="font-display text-4xl mb-12 text-center">Frequently Asked <span className="text-stroke">Questions</span></h2>
                    <div className="space-y-4">
                        {[
                            { q: "What hardware do I need to run this?", a: "For Online Streaming (Pixel Streaming), any device with a modern web browser works. For Offline applications, a PC with an RTX 3060 or higher is recommended for best performance." },
                            { q: "Can this be integrated into my website?", a: "Yes, we provide an iframe or API that allows you to embed the tour directly into your existing website, keeping users in your ecosystem." },
                            { q: "How long does it take to produce?", a: "A standard interactive project takes 4-8 weeks, depending on the scale of the property and the complexity of interactions required." },
                            { q: "Does it work on mobile devices?", a: "Yes, our Pixel Streaming solution includes touch controls optimized for smartphones and tablets." },
                            { q: "Can I use the assets for other marketing?", a: "Absolutely. The high-fidelity 3D environment we build can be used to generate unlimited high-res still renders and cinematic videos." }
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

export default ImmersiveTours;