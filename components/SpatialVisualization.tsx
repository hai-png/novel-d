import React, { useState } from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { ArrowLeft, ArrowRight, Layers, Monitor, Map, PenTool, CheckCircle2, ChevronDown, ChevronLeft, ChevronRight, MousePointer2, Box, Eye, Scan, Play, FileText, Download, Briefcase, Users, Plus, Minus } from 'lucide-react';
import { Page } from '../types';

// Enriched Data
const detailedServicesData = [
    {
        title: "3D Floor Plans & Dollhouse",
        subtitle: "Spatial Clarity",
        desc: "Transform blueprints into photorealistic spatial views. From classic top-down plans to revolutionary dollhouse cutaways.",
        types: [
            { name: "Top-Down View", desc: "Classic bird's-eye perspective showing complete layout.", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80" },
            { name: "Angled Perspective", desc: "45-degree view with plan and elevation info.", image: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=1200&q=80" },
            { name: "Furnished Layout", desc: "Complete interior staging with furniture.", image: "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=1200&q=80" },
            { name: "Dollhouse View", desc: "Section cut showing all floors in one 3D view.", image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200&q=80" },
            { name: "Isometric View", desc: "Technical precision for architectural presentations.", image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80" }
        ],
        process: [
            { id: "01", title: "Submission", desc: "Send your CAD files, sketches, or hand-drawn plans along with style preferences and furniture requirements." },
            { id: "02", title: "Drafting", desc: "Our team models the layout to scale, raising walls and placing key architectural elements for your review." },
            { id: "03", title: "Styling", desc: "We apply textures, lighting, and furniture according to your mood board to bring the space to life." },
            { id: "04", title: "Delivery", desc: "Receive high-resolution files in multiple formats (JPG, PNG, PDF) ready for print and digital use." }
        ],
        specs: {
            deliverables: ["High-resolution renders", "Multiple file formats (JPG, PNG, PDF)", "Web-optimized versions", "Dimension annotations available"],
            requirements: ["Floor plan (CAD, PDF, or sketch)", "Dimensions (if not in drawing)", "Style/mood references", "Furniture preferences"]
        }
    },
    {
        title: "Presentation Design",
        subtitle: "Winning Narratives",
        desc: "Compelling pitch decks and project presentations that win clients and approvals. From concept boards to investor-ready slide decks.",
        types: [
            { name: "Pitch Decks", desc: "Investor-ready PowerPoint/Keynote presentations.", image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&q=80" },
            { name: "Mood Boards", desc: "Concept and design direction visualization.", image: "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=1200&q=80" },
            { name: "Project Booklets", desc: "Comprehensive project documentation.", image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=1200&q=80" },
            { name: "Property Brochures", desc: "High-end marketing collateral.", image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=1200&q=80" }
        ],
        process: [
            { id: "01", title: "Content Strategy", desc: "We analyze your project goals and define the narrative structure and key messages for maximum impact." },
            { id: "02", title: "Design Layout", desc: "Creating visually stunning layouts that align with your brand and communicate effectively." },
            { id: "03", title: "Refinement", desc: "Iterating on the design based on your feedback to ensure clarity and persuasion." },
            { id: "04", title: "Final Export", desc: "Delivering editable files and print-ready PDFs optimized for your specific presentation needs." }
        ],
        specs: {
            deliverables: ["Editable source files (PPT, KEY, INDD)", "Print-ready PDFs", "Web-optimized versions", "Brand guidelines compliance"],
            requirements: ["PowerPoint / Keynote", "Adobe InDesign", "PDF (interactive & print)", "Google Slides"]
        }
    },
    {
        title: "Site Plan Graphics",
        subtitle: "Context & Scale",
        desc: "Attractive site plans and master plans for marketing and planning applications. Landscape visualization and urban context graphics.",
        types: [
            { name: "Illustrated Site Plan", desc: "Artistic site layouts for marketing.", image: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1200&q=80" },
            { name: "Master Plan", desc: "Large-scale development overviews.", image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1200&q=80" },
            { name: "Landscape Vis", desc: "Environmental context graphics.", image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1200&q=80" },
            { name: "Urban Context", desc: "Neighborhood integration views.", image: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=1200&q=80" }
        ],
        process: [
            { id: "01", title: "Site Analysis", desc: "Reviewing survey data, CAD files, and context photos to understand the environment." },
            { id: "02", title: "Graphic Dev", desc: "Creating illustrated site plans with landscape, context, and design elements that tell your story." },
            { id: "03", title: "Review", desc: "Fine-tuning colors, labels, and details to ensure accuracy and visual appeal." },
            { id: "04", title: "Delivery", desc: "Providing high-resolution raster images and layered vector files for diverse applications." }
        ],
        specs: {
            deliverables: ["High-resolution raster images", "Vector files (AI, PDF)", "Layered source files", "Multiple scale versions"],
            requirements: ["Site survey / CAD base", "Proposed layout drawings", "Context / aerial imagery", "Style references"]
        }
    },
    {
        title: "Diagrams & Illustrations",
        subtitle: "Visual Logic",
        desc: "Clear visual explanations and artistic representations. From technical diagrams to watercolor illustrations that convey design intent.",
        types: [
            { name: "Concept Diagrams", desc: "Design rationale and process graphics.", image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80" },
            { name: "Infographics", desc: "Data and process visualization.", image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80" },
            { name: "Watercolor Style", desc: "Soft, atmospheric artistic renditions.", image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1200&q=80" },
            { name: "Line Art", desc: "Clean, minimalist drawings.", image: "https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=1200&q=80" },
            { name: "Digital Collage", desc: "Modern mixed media compositions.", image: "https://images.unsplash.com/photo-1574958269340-fa927503f3dd?w=1200&q=80" }
        ],
        process: [
            { id: "01", title: "Concept", desc: "Understanding your message and selecting the appropriate visual style to communicate it." },
            { id: "02", title: "Drafting", desc: "Creating initial sketches and compositions to establish the visual language." },
            { id: "03", title: "Polishing", desc: "Refining details, colors, and textures to create a cohesive and professional look." },
            { id: "04", title: "Final Art", desc: "Delivering polished graphics in multiple formats suitable for print, web, and presentations." }
        ],
        specs: {
            deliverables: ["Vector files (AI, SVG, EPS)", "Editable source files", "High-res raster (PNG, TIFF)", "Layered PSD files"],
            requirements: ["High-res raster (PNG, TIFF)", "Layered PSD files", "Print-ready PDFs", "Web-optimized versions"]
        }
    }
];

const ServiceDetailItem: React.FC<{ feature: typeof detailedServicesData[0]; idx: number }> = ({ feature, idx }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % feature.types.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + feature.types.length) % feature.types.length);
    };

    return (
        <div className="py-24 border-t border-white/5">
            <div className="px-6 lg:px-12">
                <div className={`flex flex-col lg:flex-row gap-16 items-center mb-16 ${idx % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
                    
                    {/* Visual Side */}
                    <div className="w-full lg:w-1/2 aspect-[4/3] relative group overflow-hidden rounded-2xl bg-neutral-900">
                        <div className="absolute inset-0">
                            <img 
                                src={feature.types[currentImageIndex].image} 
                                alt={feature.types[currentImageIndex].name}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500"></div>
                        </div>

                        {/* Gallery Controls */}
                        <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between z-20">
                            <div className="text-white">
                                <div className="text-xs uppercase tracking-widest text-white/60 mb-1">Type</div>
                                <h4 className="text-lg font-display">{feature.types[currentImageIndex].name}</h4>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={prevImage} className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-white hover:text-black transition-all">
                                    <ChevronLeft size={16} />
                                </button>
                                <button onClick={nextImage} className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-white hover:text-black transition-all">
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Content Side */}
                    <div className="w-full lg:w-1/2">
                        <div className="flex items-center gap-4 mb-6">
                            <span className="text-sm font-medium text-neutral-500 uppercase tracking-widest">0{idx + 1}</span>
                            <div className="h-px w-12 bg-neutral-800"></div>
                            <span className="text-sm font-medium text-neutral-400 uppercase tracking-widest">{feature.subtitle}</span>
                        </div>

                        <h2 className="text-3xl lg:text-4xl font-display mb-6 leading-tight">
                            {feature.title}
                        </h2>
                        <p className="text-neutral-400 text-lg leading-relaxed">
                            {feature.desc}
                        </p>
                    </div>
                </div>

                {/* Full Width Process Grid */}
                <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-8 opacity-70 border-b border-white/10 pb-4">Production Process</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {feature.process.map((step) => (
                            <div key={step.id} className="bg-white/5 p-6 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
                                <span className="text-neutral-500 font-display text-2xl block mb-3">{step.id}</span>
                                <h5 className="text-white font-medium mb-2">{step.title}</h5>
                                <p className="text-neutral-400 text-sm leading-relaxed">{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const ProjectSpecsCTA: React.FC = () => {
    const [selectedServiceIdx, setSelectedServiceIdx] = useState(0);
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
                            <p className="text-neutral-400 mb-8 text-sm">Select a service to view specific requirements and deliverables for your project.</p>
                            
                            <div className="space-y-2">
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
                        <div className="lg:col-span-8 bg-black/20 rounded-2xl p-8 border border-white/5 flex flex-col justify-between">
                            <div>
                                <h3 className="text-xl font-display text-white mb-6 flex items-center gap-3">
                                    <span className="text-white/40">Specifications for</span>
                                    {selectedService.title}
                                </h3>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                    <div>
                                        <h4 className="text-xs font-bold text-green-400 uppercase tracking-widest mb-4">What You Get (Deliverables)</h4>
                                        <ul className="space-y-3">
                                            {selectedService.specs.deliverables.map((item, i) => (
                                                <li key={i} className="flex items-start gap-3 text-sm text-neutral-300">
                                                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5 flex-shrink-0"></div>
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-4">What We Need (Requirements)</h4>
                                        <ul className="space-y-3">
                                            {selectedService.specs.requirements.map((item, i) => (
                                                <li key={i} className="flex items-start gap-3 text-sm text-neutral-300">
                                                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6">
                                <p className="text-neutral-500 text-sm">Ready to bring this vision to life?</p>
                                <button onClick={() => window.location.href = '#contact'} className="w-full sm:w-auto bg-white text-neutral-950 px-8 py-4 text-sm font-medium hover:bg-neutral-200 transition-colors uppercase tracking-widest flex items-center justify-center gap-3 cursor-hover">
                                    Start {selectedService.title}
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

const SpatialVisualization: React.FC<{ onNavigate: (page: Page) => void }> = ({ onNavigate }) => {
    const [heroRef, heroVisible] = useIntersectionObserver<HTMLElement>();
    
    return (
        <div className="bg-neutral-950 min-h-screen pt-20">
            {/* Hero */}
            <section ref={heroRef} className="relative py-24 lg:py-32 px-6 lg:px-12 overflow-hidden">
                 <div className="absolute inset-0 z-0">
                    <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80"
                        alt="Spatial Visualization Hero" className="w-full h-full object-cover opacity-20" />
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
                        Spatial <br/>
                        <span className="text-stroke text-white/90">Visualization</span>
                    </h1>
                    
                    <p className={`text-neutral-400 text-lg md:text-xl max-w-2xl leading-relaxed transition-all duration-1000 delay-200 ${heroVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                        Transform architectural concepts into compelling visual narratives. From floor plans to presentation graphics—we make your designs speak.
                    </p>
                </div>

                {/* Scroll Indicator */}
                <div className={`absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 transition-opacity duration-700 ${heroVisible ? 'opacity-100' : 'opacity-0'}`}>
                    <span className="text-xs uppercase tracking-widest text-white/50">Explore Services</span>
                    <ChevronDown className="w-5 h-5 text-white/50 animate-bounce" />
                </div>
            </section>

             {/* Impact Grid (Value Propositions) */}
            <section className="py-20 px-6 lg:px-12 border-t border-white/5">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {[
                        { title: "Spatial Clarity", desc: "Communicate complex layouts instantly with intuitive 3D floor plans and dollhouse views that remove ambiguity for buyers." },
                        { title: "Investor Confidence", desc: "Professional pitch decks, site plans, and masterplans that validate development potential and secure necessary funding." },
                        { title: "Visual Storytelling", desc: "Artistic illustrations and concept diagrams that convey the mood, lifestyle, and design intent beyond simple dimensions." }
                    ].map((item, i) => (
                        <div key={i} className="group cursor-default">
                             <div className="h-px w-12 bg-white/20 mb-6 group-hover:w-full transition-all duration-500"></div>
                            <h3 className="font-display text-2xl mb-4 text-white group-hover:text-neutral-400 transition-colors">{item.title}</h3>
                            <p className="text-neutral-500 text-sm leading-relaxed">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Core Solutions Intro */}
            <section className="pt-24 px-6 lg:px-12 bg-neutral-900/50 border-t border-white/5">
                <div className="text-center">
                    <h2 className="font-display text-4xl md:text-6xl mb-6 leading-tight">Core <span className="text-stroke">Solutions</span></h2>
                    <p className="text-neutral-500 max-w-xl mx-auto">Four specialized services to bring your architectural vision to life.</p>
                </div>
            </section>

            {/* Vertical Features List */}
            {detailedServicesData.map((feature, idx) => (
                <ServiceDetailItem key={idx} feature={feature} idx={idx} />
            ))}

            {/* Dynamic Project Specs & CTA */}
             <ProjectSpecsCTA />

        </div>
    );
};

export default SpatialVisualization;