import React, { useState, useEffect, useCallback } from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Plus,
  Minus,
  Layers,
} from 'lucide-react';
import { Page } from '../types';
import QuoteForm from './QuoteForm';
import PanoramaViewer from './PanoramaViewer';

// Import images from assets (optimized WebP)
import Phase2 from '../src/assets/images-optimized/Phase2.webp';
import GroundFloorDining from '../src/assets/images-optimized/GROUND-FLOOR-DINING-02.webp';

// Import Interactive VR Fusion images from /360/interactive/ folder (lazy-loaded)
// These are loaded dynamically to improve initial page load performance
const interactiveImagePaths = [
  '../src/assets/images-optimized/360/interactive/Panorama(1).webp',
  '../src/assets/images-optimized/360/interactive/Panorama(2).webp',
  '../src/assets/images-optimized/360/interactive/Panorama(3).webp',
];

// Import Contextual Maps image from /360/contextual/ folder (lazy-loaded)
const contextualImagePath = '../src/assets/images-optimized/360/contextual/Panorama.webp';

// Import all normal panorama images from /360/normal/ folder
const normalPanoramaModules = import.meta.glob('../src/assets/images-optimized/360/normal/*.{webp,jpg,png}', { eager: true, import: 'default' }) as Record<string, string>;
const normalPanoramaImages = Object.values(normalPanoramaModules) as string[];

// Lazy image loader hook with loading state and caching
function useLazyImage(src: string) {
  const [loadedSrc, setLoadedSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (loadedSrc) return; // Already loaded
    if (loading) return; // Already loading

    setLoading(true);
    setError(null);

    try {
      const module = await import(/* @vite-ignore */ src);
      setLoadedSrc(module.default);
    } catch (err) {
      console.error(`Failed to load image: ${src}`, err);
      setError(`Failed to load: ${src}`);
    } finally {
      setLoading(false);
    }
  }, [src, loadedSrc, loading]);

  return { loadedSrc, loading, error, load };
}

// Image cache to store loaded images across component re-renders
const imageCache = new Map<string, string>();

// Hook with caching support
function useCachedLazyImage(src: string) {
  const [loadedSrc, setLoadedSrc] = useState<string | null>(imageCache.get(src) || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (loadedSrc) return; // Already loaded
    if (loading) return; // Already loading
    if (imageCache.has(src)) {
      // Found in cache
      setLoadedSrc(imageCache.get(src)!);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const module = await import(/* @vite-ignore */ src);
      const imageUrl = module.default;
      imageCache.set(src, imageUrl);
      setLoadedSrc(imageUrl);
      
      // Preload the actual image data into browser cache
      const img = new Image();
      img.src = imageUrl;
    } catch (err) {
      console.error(`Failed to load image: ${src}`, err);
      setError(`Failed to load: ${src}`);
    } finally {
      setLoading(false);
    }
  }, [src, loadedSrc, loading]);

  return { loadedSrc, loading, error, load };
}

// ── FAQ Accordion ──
const FAQItem: React.FC<{ question: string; answer: string }> = ({
  question,
  answer,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border border-white/10 rounded-xl overflow-hidden bg-white/[0.02]">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-5 flex items-center justify-between text-left group"
      >
        <span className="font-medium text-lg text-white group-hover:text-neutral-300 transition-colors pr-8">
          {question}
        </span>
        {isOpen ? (
          <Minus className="flex-shrink-0 w-5 h-5 text-neutral-400" />
        ) : (
          <Plus className="flex-shrink-0 w-5 h-5 text-neutral-400" />
        )}
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-6 pb-6 text-neutral-400 leading-relaxed text-sm border-t border-white/5 pt-4">
          {answer}
        </div>
      </div>
    </div>
  );
};

// ── Panorama Carousel Component ──
const PanoramaCarousel: React.FC<{ images: string[] }> = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  if (images.length === 0) {
    return (
      <div className="aspect-[4/3] bg-neutral-950 rounded-2xl mb-8 overflow-hidden relative border border-white/10 shadow-2xl flex items-center justify-center">
        <p className="text-neutral-500 text-sm">No panoramas available</p>
      </div>
    );
  }

  return (
    <div className="relative aspect-[4/3] bg-neutral-950 rounded-2xl mb-8 overflow-hidden border border-white/10 shadow-2xl group">
      <PanoramaViewer mode="normal" imageSrc={images[currentIndex]} />
      
      {/* Navigation buttons */}
      {images.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 hover:bg-white/20 transition-all z-10"
            aria-label="Previous panorama"
          >
            <ArrowLeft size={20} className="text-white" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 hover:bg-white/20 transition-all z-10"
            aria-label="Next panorama"
          >
            <ArrowRight size={20} className="text-white" />
          </button>
          
          {/* Counter */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full text-sm text-white font-medium z-10">
            {currentIndex + 1} / {images.length}
          </div>
        </>
      )}
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
        },
        {
            title: "Contextual Maps",
            subtitle: "Real-world integration",
            desc: "Seamless virtual 3D maps that integrate your project model directly into real-world surroundings, helping clients see how the future building fits the neighborhood.",
            features: ["Real-world location integration", "GIS data compatibility", "Interactive location hotspots", "Web & mobile compatible viewer"],
            deliverables: ["3D contextual panorama", "Real-world location integration", "Interactive hotspots", "Web viewer integration"],
            requirements: ["Project 3D model", "Site location/GIS data", "Surrounding context references", "Key viewpoints list"],
            process: [
                { id: "01", title: "Site Analysis", desc: "Gathering GIS data and real-world context imagery for the project location." },
                { id: "02", title: "Model Integration", desc: "Positioning the 3D model accurately within the real-world coordinate system." },
                { id: "03", title: "Context Matching", desc: "Matching lighting, shadows, and atmosphere to blend the model seamlessly with surroundings." },
                { id: "04", title: "Interactive Setup", desc: "Adding location hotspots and navigation for exploring the contextual relationship." }
            ]
        },
        {
            title: "Full Virtual Tour",
            subtitle: "Complete walkthrough experience",
            desc: "A comprehensive multi-room virtual tour with navigation between spaces, interactive hotspots, and a seamless user experience. The ultimate solution for property marketing.",
            features: ["Multi-room navigation", "Interactive floor plan", "Custom branding", "Analytics dashboard"],
            deliverables: ["Complete virtual tour", "Interactive floor plan", "Custom branding elements", "Hosting & analytics"],
            requirements: ["Complete 3D model", "All room layouts", "Branding guidelines", "Navigation preferences"],
            process: [
                { id: "01", title: "Tour Planning", desc: "Mapping out the complete tour route and key viewpoints for each space." },
                { id: "02", title: "Panorama Creation", desc: "Rendering 360° panoramas for each room and key vantage points." },
                { id: "03", title: "Navigation Setup", desc: "Connecting panoramas with clickable navigation points and transitions." },
                { id: "04", title: "Final Integration", desc: "Adding branding, floor plan, and deploying to hosting platform." }
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

// ── Demo config ──
// Using paths instead of static imports for lazy loading
const demoVariantsPaths = [
  { name: 'View 1', path: interactiveImagePaths[0] },
  { name: 'View 2', path: interactiveImagePaths[1] },
  { name: 'View 3', path: interactiveImagePaths[2] },
];

const demoHotspots = [
  {
    position: [400, 0, -100] as [number, number, number],
    label: 'Main Entrance',
    description:
      'Double-height entry foyer with marble flooring and custom millwork.',
  },
  {
    position: [-200, -100, 300] as [number, number, number],
    label: 'Lounge Area',
    description:
      'Featuring custom Italian leather seating and integrated smart lighting systems.',
  },
  {
    position: [100, 200, 200] as [number, number, number],
    label: 'Smart Lighting',
    description:
      'Fully automated Lutron system allowing for 5 distinct mood settings.',
  },
];

const contextualMapsHotspots = [
  {
    position: [300, 50, -150] as [number, number, number],
    label: 'Project Location',
    description: 'Strategically positioned in the heart of the developing district with excellent connectivity.',
  },
  {
    position: [-250, -50, 250] as [number, number, number],
    label: 'Nearby Amenities',
    description: 'Walking distance to shopping centers, schools, parks, and public transportation hubs.',
  },
  {
    position: [150, 150, 200] as [number, number, number],
    label: 'Future Development',
    description: 'Planned commercial zone with office spaces and retail outlets scheduled for 2027.',
  },
  {
    position: [-100, 100, -300] as [number, number, number],
    label: 'Green Spaces',
    description: 'Adjacent to the city\'s largest urban park with jogging trails and recreational facilities.',
  },
];

// ══════════════════════════════════════════
// Component
// ══════════════════════════════════════════
const VirtualTour: React.FC<{ onNavigate: (page: Page) => void }> = ({
  onNavigate,
}) => {
  const [heroRef, heroVisible] =
    useIntersectionObserver<HTMLElement>();
  const [isQuoteFormOpen, setIsQuoteFormOpen] = useState(false);

  // Lazy load Interactive VR images with caching
  const interactive1 = useCachedLazyImage(interactiveImagePaths[0]);
  const interactive2 = useCachedLazyImage(interactiveImagePaths[1]);
  const interactive3 = useCachedLazyImage(interactiveImagePaths[2]);
  
  // Lazy load Contextual Maps image with caching
  const contextual = useCachedLazyImage(contextualImagePath);
  
  // Build demo variants with loaded sources
  const demoVariants = [
    { name: 'View 1', src: interactive1.loadedSrc || '', path: interactiveImagePaths[0] },
    { name: 'View 2', src: interactive2.loadedSrc || '', path: interactiveImagePaths[1] },
    { name: 'View 3', src: interactive3.loadedSrc || '', path: interactiveImagePaths[2] },
  ].filter(v => v.src); // Filter out unloaded variants
  
  // Load first interactive image on mount, then preload others progressively
  useEffect(() => {
    interactive1.load();
    // Preload second image after a short delay for progressive loading
    const timer1 = setTimeout(() => interactive2.load(), 300);
    const timer2 = setTimeout(() => interactive3.load(), 600);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);
  
  // Track which variant is selected (by index)
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const currentVariant = demoVariants[selectedVariantIndex]?.src || '';

  // Smart preload: when user selects a variant, preload adjacent ones
  const handleVariantChange = useCallback((newSrc: string) => {
    const idx = demoVariants.findIndex(v => v.src === newSrc);
    if (idx !== -1) {
      setSelectedVariantIndex(idx);
      
      // Preload next and previous variants for faster switching
      const nextIdx = (idx + 1) % demoVariants.length;
      const prevIdx = (idx - 1 + demoVariants.length) % demoVariants.length;
      
      // Load adjacent images if not already loaded
      if (!demoVariants[nextIdx]?.src) {
        import(/* @vite-ignore */ demoVariants[nextIdx].path)
          .then(module => {
            imageCache.set(demoVariants[nextIdx].path, module.default);
            const img = new Image();
            img.src = module.default;
          })
          .catch(err => console.error('Failed to preload next variant:', err));
      }
      
      if (!demoVariants[prevIdx]?.src) {
        import(/* @vite-ignore */ demoVariants[prevIdx].path)
          .then(module => {
            imageCache.set(demoVariants[prevIdx].path, module.default);
            const img = new Image();
            img.src = module.default;
          })
          .catch(err => console.error('Failed to preload previous variant:', err));
      }
    }
  }, [demoVariants]);

  // Load contextual image when section is about to be visible
  const [contextualSectionRef, contextualSectionVisible] = useIntersectionObserver<HTMLElement>({ threshold: 0.1 });
  
  useEffect(() => {
    if (contextualSectionVisible) {
      contextual.load();
    }
  }, [contextualSectionVisible]);

  return (
    <div className="bg-neutral-950 min-h-screen pt-20">
      {/* ═══ Hero ═══ */}
      <section
        ref={heroRef}
        className="relative py-24 lg:py-32 px-6 lg:px-12 overflow-hidden"
      >
        <div className="absolute inset-0 z-0">
          <img
            src="https://archicgi.com/wp-content/uploads/2023/11/virtual-tour-real-estate-3d-rendering.jpg"
            alt="Virtual Tour Hero"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/90 to-transparent" />
        </div>

        <div className="relative z-10 ">
          <button
            onClick={() => onNavigate('home')}
            className="inline-flex items-center gap-2 text-neutral-400 hover:text-white mb-10 transition-colors text-sm tracking-widest uppercase"
          >
            <ArrowLeft size={16} /> Back to Services
          </button>

          <h1
            className={`font-display text-5xl md:text-8xl font-medium mb-8 leading-tight transition-all duration-1000 ${
              heroVisible
                ? 'translate-y-0 opacity-100'
                : 'translate-y-10 opacity-0'
            }`}
          >
            3D Virtual <br />
            <span className="text-stroke text-white/90">Tours</span>
          </h1>

          <p
            className={`text-neutral-400 text-lg md:text-xl max-w-2xl leading-relaxed transition-all duration-1000 delay-200 ${
              heroVisible
                ? 'translate-y-0 opacity-100'
                : 'translate-y-10 opacity-0'
            }`}
          >
            Give your clients a sense of presence in the unbuilt space.
            Interactive 3D rendering for virtual tours that bring designs
            to life and win projects faster.
          </p>
        </div>
      </section>

      {/* ═══ Impact Grid ═══ */}
      <section className="py-20 px-6 lg:px-12 border-t border-white/5">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {[
            {
              title: 'Online Showings',
              desc: 'Let prospects explore every corner at their own pace. Your digital twin property works for you while you sleep.',
            },
            {
              title: 'Attention Gainer',
              desc: "Stop the scroll. Why look at competitor's flat drawings when they can step inside your interactive universe?",
            },
            {
              title: 'Lifestyle Vision',
              desc: 'Sell the experience, not just walls. Use 3D virtual tour rendering to help buyers imagine their morning coffee in the sun.',
            },
            {
              title: 'Presale Power',
              desc: 'Developers can start preselling before the first brick is laid. Visual proof of value increases buyer confidence.',
            },
          ].map((item, i) => (
            <div key={i} className="group cursor-default">
              <h3 className="font-display text-2xl mb-4 text-white group-hover:text-neutral-400 transition-colors">
                {item.title}
              </h3>
              <p className="text-neutral-500 text-sm leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ Interaction Features Grid ═══ */}
      <section className="py-24 px-6 lg:px-12 bg-neutral-900/50 border-y border-white/5">
        <div className="">
          <div className="mb-16">
            <h2 className="font-display text-4xl md:text-6xl mb-6 leading-tight">
              Interaction{' '}
              <span className="text-stroke">Features</span>
            </h2>
            <p className="text-neutral-500 max-w-xl">
              We push the boundaries of web-based visualization with
              specialized features that provide deeper immersion.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* 1 — Normal 360 Panorama with Carousel */}
            <div className="group cursor-default">
              <PanoramaCarousel images={normalPanoramaImages} />
              <h3 className="text-2xl font-display mb-3">
                Normal 360 Panorama
              </h3>
              <p className="text-neutral-400 text-sm leading-relaxed mb-6">
                High-resolution 360° panoramic renders that allow viewers to look in every direction. Perfect for virtual property tours and immersive marketing experiences.
              </p>
              <div className="flex items-center gap-4 text-xs uppercase tracking-widest text-white/40">
                <span>8K Resolution</span>
                <div className="w-1 h-1 bg-white/40 rounded-full" />
                <span>Full 360° View</span>
              </div>
            </div>

            {/* 2 — Virtual Staging (Split) */}
            <div className="group cursor-default">
              <div className="aspect-[4/3] bg-neutral-950 rounded-2xl mb-8 overflow-hidden relative border border-white/10 shadow-2xl">
                <PanoramaViewer
                  mode="split"
                  imageSrcBefore={Phase2}
                  imageSrcAfter={GroundFloorDining}
                />
              </div>
              <h3 className="text-2xl font-display mb-3">
                Virtual Staging
              </h3>
              <p className="text-neutral-400 text-sm leading-relaxed mb-6">
                A powerful sales tool for showing potential. Our
                split-screen slider lets buyers instantly compare the raw
                space with a fully furnished, professionally designed
                vision.
              </p>
              <div className="flex items-center gap-4 text-xs uppercase tracking-widest text-white/40">
                <span>Sales Accelerator</span>
                <div className="w-1 h-1 bg-white/40 rounded-full" />
                <span>Visual Comparison</span>
              </div>
            </div>
          </div>

          {/* ═══ Sticky Scroll Container for VR Fusion & Contextual Maps ═══ */}
          <div className="mt-24">
            <div className="bg-neutral-900/50">
              {/* Section header — scrolls away normally */}
              <div className="px-6 lg:px-12 pt-24 pb-16 ">
                <div className="flex items-center gap-4 mb-6">
                  <Layers className="w-8 h-8 text-white/60" />
                  <span className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Advanced Features</span>
                </div>
                <h2 className="font-display text-4xl md:text-6xl mb-6 leading-tight">
                  Immersive <span className="text-stroke">Experiences</span>
                </h2>
                <p className="text-neutral-500 max-w-xl">
                  Full-width interactive experiences with real-time customization and contextual intelligence.
                </p>
              </div>

              {/* Sticky scroll container */}
              <div
                className="relative"
                style={{ height: `${2 * 100}vh` }}
              >
                {/* 3 — Interactive VR Fusion (Full Width) */}
                <div className="sticky top-0 h-screen flex items-center overflow-hidden" style={{ zIndex: 10 }}>
                  <div className="absolute inset-0 bg-neutral-900/95 backdrop-blur-sm" />
                  <div className="relative z-10 w-full px-6 lg:px-12 py-16 group">
                    <p className="text-xs text-neutral-600 tracking-widest uppercase mb-6 font-medium">01 / 02</p>

                    {/* Title, Description and Features - Top */}
                    <div className="mb-8">
                      <h3 className="text-3xl font-display mb-4 text-white">
                        Interactive VR Fusion
                      </h3>
                      <p className="text-neutral-400 text-sm leading-relaxed mb-6 max-w-3xl">
                        The ultimate interactive experience. VR Fusion allows
                        users to change interior design, lighting scenarios, and
                        inspect details via hotspots while exploring the space in
                        real-time.
                      </p>
                      <div className="flex items-center gap-4 text-xs uppercase tracking-widest text-white/40">
                        <span>Real-Time Modding</span>
                        <div className="w-1 h-1 bg-white/40 rounded-full" />
                        <span>Guided Paths</span>
                      </div>
                    </div>

                    {/* Panorama Viewer */}
                    <div className="aspect-[21/9] bg-neutral-950 rounded-2xl mb-8 overflow-hidden relative border border-white/10 shadow-2xl">
                      {demoVariants.length === 0 ? (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4" />
                            <p className="text-neutral-500 text-sm">Loading interactive experience...</p>
                          </div>
                        </div>
                      ) : (
                        <PanoramaViewer
                          mode="interactive"
                          imageSrc={currentVariant}
                          hotspots={demoHotspots}
                          variants={demoVariants}
                          onVariantChange={handleVariantChange}
                        />
                      )}
                    </div>
                  </div>
                </div>

                {/* 4 — Contextual Maps (Full Width) */}
                <div ref={contextualSectionRef} className="sticky top-0 h-screen flex items-center overflow-hidden" style={{ zIndex: 11 }}>
                  <div className="absolute inset-0 bg-neutral-900/95 backdrop-blur-sm" />
                  <div className="relative z-10 w-full px-6 lg:px-12 py-16 group">
                    <p className="text-xs text-neutral-600 tracking-widest uppercase mb-6 font-medium">02 / 02</p>

                    {/* Title, Description and Features - Top */}
                    <div className="mb-8">
                      <h3 className="text-3xl font-display mb-4 text-white">
                        Contextual Maps
                      </h3>
                      <p className="text-neutral-400 text-sm leading-relaxed mb-6 max-w-3xl">
                        We create seamless virtual 3D maps that integrate your project model directly into real-world surroundings, helping clients see how the future building fits the neighborhood.
                      </p>
                      <div className="flex items-center gap-4 text-xs uppercase tracking-widest text-white/40">
                        <span>Real-World Integration</span>
                        <div className="w-1 h-1 bg-white/40 rounded-full" />
                        <span>Location Intelligence</span>
                      </div>
                    </div>

                    {/* Panorama Viewer with hotspots open by default */}
                    <div className="aspect-[21/9] bg-neutral-950 rounded-2xl mb-8 overflow-hidden relative border border-white/10 shadow-2xl">
                      {!contextual.loadedSrc && !contextual.error ? (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4" />
                            <p className="text-neutral-500 text-sm">Loading contextual map...</p>
                          </div>
                        </div>
                      ) : contextual.error ? (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <p className="text-red-400 text-sm">{contextual.error}</p>
                        </div>
                      ) : (
                        <PanoramaViewer
                          mode="interactive"
                          imageSrc={contextual.loadedSrc!}
                          hotspots={contextualMapsHotspots}
                          hotspotsOpenByDefault={true}
                          initialRotation={90}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ Virtual Tour ═══ */}
      <section className="py-24 px-6 lg:px-12">
        <div className="">
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl md:text-5xl mb-6">
              Virtual <span className="text-stroke">Tour</span>
            </h2>
            <p className="text-neutral-400 leading-relaxed max-w-3xl mx-auto">
              A virtual tour 3D rendering lets prospects explore every
              room and corner at their own pace. It works like a real
              estate agent available around the clock, showcasing the
              atmosphere and lifestyle your project promises.
            </p>
          </div>
          
          {/* Embedded Virtual Tour */}
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
            <iframe
              src="https://hai-png.github.io/"
              title="Virtual Tour Experience"
              className="absolute inset-0 w-full h-full"
              allow="fullscreen"
              allowFullScreen
            />
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
            <div className="bg-neutral-900/50 border border-white/5 rounded-xl p-6">
              <h4 className="text-white font-medium mb-2 uppercase tracking-widest text-xs">
                24/7 Showings
              </h4>
              <p className="text-neutral-500 text-sm">
                Online access anytime, anywhere in the world.
              </p>
            </div>
            <div className="bg-neutral-900/50 border border-white/5 rounded-xl p-6">
              <h4 className="text-white font-medium mb-2 uppercase tracking-widest text-xs">
                Emotional Link
              </h4>
              <p className="text-neutral-500 text-sm">
                Help buyers connect with the textures and light.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ Industry Sectors ═══ */}
      <section className="py-24 px-6 lg:px-12 bg-neutral-950">
        <div className="">
          <div className="mb-12">
            <h2 className="font-display text-4xl mb-4">
              Tailored For{' '}
              <span className="text-stroke">Every Industry</span>
            </h2>
            <p className="text-neutral-500">
              Virtual tour solutions customized for your specific market
              needs.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'Residential Developments',
                desc: 'Perfect for off-plan sales. Buyers explore layouts and amenities before the building exists.',
              },
              {
                title: 'Commercial Real Estate',
                desc: 'Attract high-value tenants. Walk them through planned offices and restaurants.',
              },
              {
                title: 'Hospitality Projects',
                desc: 'Promote your venue early to investors. Ideal for franchise pitches and partnership acquisition.',
              },
              {
                title: 'Infrastructure & Civic',
                desc: 'Explain large-scale public projects clearly to investors and city officials.',
              },
              {
                title: 'Retail & Mixed-Use',
                desc: 'Secure lease talks early. Show interior layouts and merchandising flows.',
              },
              {
                title: 'Custom Homes',
                desc: 'Help private clients refine design choices and get emotionally invested.',
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-neutral-900 border border-white/5 p-8 rounded-xl hover:border-white/20 transition-colors group"
              >
                <h3 className="text-xl font-display text-white mb-3 italic">
                  {item.title}
                </h3>
                <p className="text-neutral-500 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ PROJECT SPECS & CTA ═══ */}
      <ProjectSpecsCTA onOpenQuote={() => setIsQuoteFormOpen(true)} />

      {/* ═══ FAQ ═══ */}
      <section className="py-24 px-6 lg:px-12">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-display text-4xl mb-12 text-center">
            Frequently Asked{' '}
            <span className="text-stroke">Questions</span>
          </h2>
          <div className="space-y-4">
            {[
              {
                q: 'How Can I Use 3D Virtual Tours?',
                a: 'There are 3 ways: posting them on websites, apps, and social media. You can upload the HTML file to your site or embed it using an iframe.',
              },
              {
                q: 'What are the benefits of 3D house tours?',
                a: 'They show future homes in photorealistic quality 24/7, attracting more prospects. Interactive features allow viewers to explore at their own pace.',
              },
              {
                q: 'Are your 3D home tours VR-compatible?',
                a: 'We can create VR interactive tours using Unreal Engine. Standard web tours are made in 3ds Max/Corona and are viewable in VR browsers but differ from full VR apps.',
              },
              {
                q: 'What references do I need to provide?',
                a: 'Floor plans, elevations, furniture layouts, lighting schemes, material selections, and hotspot locations for navigation.',
              },
              {
                q: 'How much does a 3D virtual tour cost?',
                a: 'The cost depends on the project size, number of panoramic points, and interactivity level. Contact us for an estimate.',
              },
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

export default VirtualTour;
