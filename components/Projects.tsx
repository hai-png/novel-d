import React, { useState, useRef } from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { useNavigation } from '../hooks/useNavigation';
import { ArrowLeft, ArrowUpRight, Grid3X3, ArrowRight, ArrowLeft as ArrowLeftIcon, Play } from 'lucide-react';
import { Page } from '../types';

// Project type categories based on folder structure
const projectTypes = [
    { id: 'all', label: 'All Projects', icon: Grid3X3 },
    { id: '01_APARTMENT', label: 'Apartment', icon: Grid3X3 },
    { id: '02_MIXED_USE', label: 'Mixed Use', icon: Grid3X3 },
    { id: '03_COMPETITION', label: 'Competition', icon: Grid3X3 },
    { id: '04_HOTEL RESORT', label: 'Hotel & Resort', icon: Grid3X3 },
    { id: '05_MALL', label: 'Mall', icon: Grid3X3 },
    { id: '06_OFFICE', label: 'Office', icon: Grid3X3 },
    { id: '07_RESDENCE', label: 'Residence', icon: Grid3X3 },
    { id: '08_LANDSCAPE', label: 'Landscape', icon: Grid3X3 },
    { id: '09_PROPOSAL', label: 'Proposal', icon: Grid3X3 },
    { id: '11_CAFE ANDRESTAURANT', label: 'Cafe & Restaurant', icon: Grid3X3 }
];

// Dynamically import all media from works folder
const allMediaFiles = import.meta.glob('/assets/images/works/**/*.{webp,jpg,jpeg,png,mp4,mov}', { eager: true, query: '?url', import: 'default' }) as Record<string, string>;

// Helper function to organize media by project type and project name
interface ProjectMedia {
    name: string;
    path: string;
    type: string;
    media: string[];
}

interface ProjectType {
    id: string;
    name: string;
    projects: ProjectMedia[];
}

const organizeProjects = (): ProjectType[] => {
    const projectsMap = new Map<string, ProjectType>();

    Object.entries(allMediaFiles).forEach(([path, media]) => {
        // Extract type and project from path
        // Path format: /assets/images/works/TYPE/PROJECT/...
        const worksIndex = path.indexOf('/works/');
        if (worksIndex === -1) return;
        
        const afterWorks = path.substring(worksIndex + 7); // Skip '/works/'
        const parts = afterWorks.split('/');
        
        if (parts.length >= 2) {
            const typeId = parts[0];
            const projectName = parts[1];
            
            // Skip if this is a nested folder within a project
            if (projectName === 'New folder' || projectName === 'FLOOR' || projectName === 'BEFORE AFTER') {
                return;
            }

            // Get or create project type
            if (!projectsMap.has(typeId)) {
                projectsMap.set(typeId, {
                    id: typeId,
                    name: typeId.replace(/_/g, ' ').replace(/^\d+_/, ''),
                    projects: []
                });
            }

            const projectType = projectsMap.get(typeId)!;
            
            let project = projectType.projects.find(p => p.name === projectName);
            if (!project) {
                project = {
                    name: projectName,
                    path: `/assets/images/works/${typeId}/${projectName}`,
                    type: typeId,
                    media: []
                };
                projectType.projects.push(project);
            }

            // Add media to project
            project.media.push(media as string);
        }
    });

    return Array.from(projectsMap.values());
};

const projectsByType = organizeProjects();

// Video Player Component with controls
const VideoPlayer: React.FC<{ src: string }> = ({ src }) => {
    const [isPlaying, setIsPlaying] = useState(true);
    const [isMuted, setIsMuted] = useState(true);
    const [progress, setProgress] = useState(0);
    const [showControls, setShowControls] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);

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

    const handleTimeUpdate = () => {
        if (videoRef.current) {
            const progress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
            setProgress(progress || 0);
        }
    };

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (videoRef.current) {
            const seekTime = (parseFloat(e.target.value) / 100) * videoRef.current.duration;
            videoRef.current.currentTime = seekTime;
            setProgress(parseFloat(e.target.value));
        }
    };

    const isVideo = src.endsWith('.mp4') || src.endsWith('.mov');

    if (!isVideo) {
        return (
            <img src={src} alt="Project media" className="w-full h-full object-cover" />
        );
    }

    return (
        <div 
            className="relative w-full h-full"
            onMouseEnter={() => setShowControls(true)}
            onMouseLeave={() => setShowControls(false)}
        >
            <video
                ref={videoRef}
                src={src}
                className="w-full h-full object-cover"
                muted={isMuted}
                onTimeUpdate={handleTimeUpdate}
                onClick={togglePlay}
                playsInline
                autoPlay
                loop
            />
            
            {!isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 pointer-events-none">
                    <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20">
                        <Play fill="white" className="w-8 h-8 text-white translate-x-1" />
                    </div>
                </div>
            )}

            <div 
                className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 transition-opacity duration-300 ${
                    showControls ? 'opacity-100' : 'opacity-0'
                }`}
            >
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={progress}
                    onChange={handleSeek}
                    className="w-full h-0.5 bg-white/20 rounded-full appearance-none cursor-pointer mb-2 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2 [&::-webkit-slider-thumb]:h-2 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:cursor-pointer"
                />
                <div className="flex items-center justify-between">
                    <button
                        onClick={togglePlay}
                        className="w-8 h-8 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
                    >
                        {isPlaying ? (
                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <rect x="6" y="4" width="4" height="16" />
                                <rect x="14" y="4" width="4" height="16" />
                            </svg>
                        ) : (
                            <Play fill="white" size={16} className="text-white translate-x-0.5" />
                        )}
                    </button>
                    <button
                        onClick={toggleMute}
                        className="w-8 h-8 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
                    >
                        {isMuted ? (
                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M11 5L6 9H2v6h4l5 4V5zM19.07 4.93L17.66 6.34L18.9 7.58L17.24 9.24L15.83 7.83L14.41 9.24L13 7.83L14.41 6.41L13 5L14.41 3.59L15.83 5L17.24 3.59L18.66 5L20.07 3.59L21.49 5L20.07 6.41L21.49 7.83L20.07 9.24L18.66 7.83L17.24 9.24L18.66 10.66L20.07 9.24L21.49 10.66L20.07 12.07L18.66 10.66L17.24 12.07L18.66 13.49L20.07 12.07L21.49 13.49L20.07 14.9L18.66 13.49L17.24 14.9L18.66 16.32L20.07 14.9L21.49 16.32L20.07 17.73L18.66 16.32L17.24 17.73L18.66 19.15L20.07 17.73L21.49 19.15L20.07 20.56L18.66 19.15L17.24 20.56L15.83 19.15L14.41 20.56L13 19.15L14.41 17.73L13 16.32L14.41 14.9L13 13.49L11.59 14.9L10.17 13.49L11.59 12.07L10.17 10.66L8.76 12.07L7.34 10.66L8.76 9.24L7.34 7.83L8.76 6.41L7.34 5L8.76 3.59L10.17 5L11.59 3.59L13 5L14.41 3.59L15.83 5L17.24 3.59L18.66 5L20.07 3.59L21.49 5L20.07 6.41L21.49 7.83L20.07 9.24L18.66 7.83L17.24 9.24L18.66 10.66L20.07 9.24L21.49 10.66L20.07 12.07L18.66 10.66L17.24 12.07L18.66 13.49L20.07 12.07L21.49 13.49L20.07 14.9L18.66 13.49L17.24 14.9L18.66 16.32L20.07 14.9L21.49 16.32L20.07 17.73L18.66 16.32L17.24 17.73L18.66 19.15L20.07 17.73L21.49 19.15L20.07 20.56L18.66 19.15L17.24 20.56L15.83 19.15L14.41 20.56L13 19.15L14.41 17.73L13 16.32L14.41 14.9L13 13.49L11.59 14.9L10.17 13.49L11.59 12.07L10.17 10.66L8.76 12.07L7.34 10.66L8.76 9.24L7.34 7.83L8.76 6.41L7.34 5L8.76 3.59L10.17 5L11.59 3.59L13 5V5Z" />
                            </svg>
                        ) : (
                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                            </svg>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

// Project Carousel Component
const ProjectCarousel: React.FC<{ media: string[] }> = ({ media }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleNext = () => setCurrentIndex((prev) => (prev + 1) % media.length);
    const handlePrev = () => setCurrentIndex((prev) => (prev - 1 + media.length) % media.length);

    if (media.length === 0) return null;

    return (
        <div className="relative w-full h-full group">
            <div className="absolute inset-0">
                <VideoPlayer src={media[currentIndex]} />
            </div>

            {media.length > 1 && (
                <>
                    <button
                        onClick={handlePrev}
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 hover:bg-white/20 transition-colors opacity-0 group-hover:opacity-100 z-10"
                        aria-label="Previous image"
                    >
                        <ArrowLeftIcon size={20} className="text-white" />
                    </button>
                    <button
                        onClick={handleNext}
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 hover:bg-white/20 transition-colors opacity-0 group-hover:opacity-100 z-10"
                        aria-label="Next image"
                    >
                        <ArrowRight size={20} className="text-white" />
                    </button>

                    {/* Thumbnails */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 bg-black/60 backdrop-blur-md p-2 rounded-xl border border-white/10 z-10 max-w-[80%] overflow-x-auto">
                        {media.slice(0, 5).map((src, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentIndex(idx)}
                                className={`w-12 h-12 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${
                                    currentIndex === idx
                                        ? 'border-white scale-110'
                                        : 'border-white/20 hover:border-white/50 opacity-60 hover:opacity-100'
                                }`}
                            >
                                {src.endsWith('.mp4') || src.endsWith('.mov') ? (
                                    <div className="w-full h-full bg-neutral-800 flex items-center justify-center">
                                        <Play size={16} className="text-white" />
                                    </div>
                                ) : (
                                    <img src={src} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover" />
                                )}
                            </button>
                        ))}
                        {media.length > 5 && (
                            <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center text-white text-xs font-medium border border-white/20">
                                +{media.length - 5}
                            </div>
                        )}
                    </div>

                    {/* Counter */}
                    <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full text-xs text-white font-medium z-10">
                        {currentIndex + 1} / {media.length}
                    </div>
                </>
            )}
        </div>
    );
};

// Project Card Component
const ProjectCard: React.FC<{ project: ProjectMedia; layout: 'full' | 'half' | 'third' }> = ({ project, layout }) => {
    const [ref, isVisible] = useIntersectionObserver({ threshold: 0.1 });

    const heights = {
        full: 'h-[70vh] min-h-[600px]',
        half: 'h-[50vh] min-h-[400px]',
        third: 'h-[40vh] min-h-[350px]'
    };

    return (
        <div
            ref={ref}
            className={`group relative w-full ${heights[layout]} overflow-hidden transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
        >
            <ProjectCarousel media={project.media} />

            {/* Content Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent px-6 lg:px-8 flex flex-col justify-end pb-6 lg:pb-8">
                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-medium uppercase tracking-wider text-white/80">
                            {project.type.replace(/_/g, ' ').replace(/^\d+_/, '')}
                        </span>
                    </div>

                    <h3 className={`${
                        layout === 'full' ? 'text-3xl lg:text-5xl' :
                        layout === 'half' ? 'text-xl lg:text-2xl' :
                        'text-lg lg:text-xl'
                    } font-display text-white mb-2 group-hover:text-neutral-300 transition-colors`}>
                        {project.name}
                    </h3>

                    <p className={`${
                        layout === 'full' ? 'text-lg' :
                        layout === 'half' ? 'text-sm' :
                        'text-xs'
                    } text-neutral-400`}>
                        {project.media.length} media {project.media.length > 1 ? 'items' : 'item'}
                    </p>
                </div>
            </div>
        </div>
    );
};

const Projects: React.FC<{ onNavigate: (page: Page) => void }> = ({ onNavigate }) => {
    const [heroRef, heroVisible] = useIntersectionObserver<HTMLElement>();
    const [activeFilter, setActiveFilter] = useState('all');
    const { navigateToHomeWithScroll } = useNavigation();

    const handleBackToHome = () => {
        navigateToHomeWithScroll(onNavigate, 'work');
    };

    const filteredProjects = activeFilter === 'all'
        ? projectsByType
        : projectsByType.filter(type => type.id === activeFilter);

    // Get all projects from filtered types
    const allProjects = filteredProjects.flatMap(type => 
        type.projects.map(project => ({ ...project, layout: 'third' as const }))
    );

    // Group projects into rows
    const getRowLayout = (projects: any[]) => {
        const rows: { projects: any[]; layout: string }[] = [];
        let i = 0;

        while (i < projects.length) {
            const rowPattern = rows.length % 3;

            if (rowPattern === 0 && projects[i]) {
                rows.push({ projects: [projects[i]], layout: 'full' });
                i++;
            } else if (rowPattern === 1) {
                rows.push({ projects: projects.slice(i, i + 2), layout: 'half' });
                i += 2;
            } else {
                rows.push({ projects: projects.slice(i, i + 3), layout: 'third' });
                i += 3;
            }
        }

        return rows;
    };

    const projectRows = getRowLayout(allProjects);

    return (
        <div className="bg-neutral-950 min-h-screen pt-20">
            {/* Hero */}
            <section ref={heroRef} className="relative py-24 lg:py-32 px-6 lg:px-12 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 to-neutral-950" />
                </div>

                <div className="relative z-10 ">
                    <button
                        onClick={handleBackToHome}
                        className="inline-flex items-center gap-2 text-neutral-400 hover:text-white mb-10 transition-colors text-sm tracking-widest uppercase"
                    >
                        <ArrowLeft size={16} />
                        Back to Home
                    </button>

                    <h1 className={`font-display text-5xl md:text-8xl font-medium mb-8 leading-tight transition-all duration-1000 ${heroVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                        Our <span className="text-stroke text-white/90">Works</span>
                    </h1>

                    <p className={`text-neutral-400 text-lg md:text-xl max-w-2xl leading-relaxed transition-all duration-1000 delay-200 ${heroVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                        Explore our portfolio of architectural visualization projects across diverse categories and scales.
                    </p>
                </div>
            </section>

            {/* Filter Section */}
            <section className="py-12 px-6 lg:px-12 border-t border-white/5 sticky top-20 z-30 bg-neutral-950/95 backdrop-blur-xl">
                <div className="">
                    <div className="flex flex-wrap gap-3 justify-center">
                        {projectTypes.map((filter) => (
                            <button
                                key={filter.id}
                                onClick={() => setActiveFilter(filter.id)}
                                className={`flex items-center gap-2 px-6 py-3 rounded-full border transition-all duration-300 ${
                                    activeFilter === filter.id
                                        ? 'bg-white text-neutral-950 border-white'
                                        : 'bg-transparent text-neutral-400 border-white/10 hover:border-white/30 hover:text-white'
                                }`}
                            >
                                <filter.icon size={16} />
                                <span className="text-sm font-medium">{filter.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Projects Grid */}
            <section className="py-0 px-0">
                <div className="w-full">
                    <div className="flex flex-col">
                        {projectRows.map((row, rowIndex) => (
                            <div key={rowIndex} className="w-full border-b border-white/5">
                                {row.layout === 'full' && row.projects.map((project) => (
                                    <ProjectCard key={project.name} project={project} layout="full" />
                                ))}

                                {row.layout === 'half' && (
                                    <div className="grid grid-cols-1 md:grid-cols-2">
                                        {row.projects.map((project) => (
                                            <div key={project.name} className="border-r border-white/5 last:border-r-0">
                                                <ProjectCard project={project} layout="half" />
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {row.layout === 'third' && (
                                    <div className="grid grid-cols-1 md:grid-cols-3">
                                        {row.projects.map((project, idx) => (
                                            <div key={project.name} className={`border-r border-white/5 last:border-r-0 ${idx > 0 ? '' : ''}`}>
                                                <ProjectCard project={project} layout="third" />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Empty State */}
                    {allProjects.length === 0 && (
                        <div className="text-center py-24">
                            <p className="text-neutral-500 text-lg">No projects found in this category.</p>
                        </div>
                    )}
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 px-6 lg:px-12 bg-neutral-900/30 border-t border-white/5">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="font-display text-4xl md:text-5xl mb-6">
                        Ready to Start Your <span className="text-stroke">Project?</span>
                    </h2>
                    <p className="text-neutral-400 text-lg mb-8 max-w-2xl mx-auto">
                        Let's collaborate to bring your architectural vision to life with stunning visualizations.
                    </p>
                    <a
                        href="#contact"
                        onClick={(e) => {
                            e.preventDefault();
                            navigateToHomeWithScroll(onNavigate, 'contact');
                        }}
                        className="inline-flex items-center gap-2 text-sm border border-white/20 px-6 py-2.5 hover:bg-white hover:text-neutral-950 transition-all duration-300 group cursor-hover"
                    >
                        Start Project
                        <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </a>
                </div>
            </section>
        </div>
    );
};

export default Projects;
