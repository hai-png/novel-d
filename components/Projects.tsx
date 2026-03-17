import React, { useState } from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { useNavigation } from '../hooks/useNavigation';
import { ArrowLeft, ArrowUpRight, Grid3X3, Building2, Home, Trees, Building } from 'lucide-react';
import { Page } from '../types';

// Project data with categories
const projectsData = [
    {
        id: 1,
        title: 'Modern Residential Complex',
        category: 'residential',
        image: 'https://archicgi.com/wp-content/uploads/2025/03/living-room-interior-3d-rendering-MU5SFJXV-4000x2250.jpg',
        location: 'Los Angeles, CA',
        year: '2024',
        size: 'large'
    },
    {
        id: 2,
        title: 'Urban Office Tower',
        category: 'commercial',
        image: 'https://archicgi.com/wp-content/uploads/2024/03/mid-rise-building-exterior-3d-visualization.jpg',
        location: 'New York, NY',
        year: '2024',
        size: 'large'
    },
    {
        id: 3,
        title: 'Luxury Villa',
        category: 'residential',
        image: 'https://archicgi.com/wp-content/uploads/2021/04/photorealistic-3d-exterior-rendering-for-luxurious-villas.jpg',
        location: 'Miami, FL',
        year: '2023',
        size: 'medium'
    },
    {
        id: 4,
        title: 'Mixed-Use Development',
        category: 'mixed-use',
        image: 'https://archicgi.com/wp-content/uploads/2023/08/3d-exterior-rendering-urban-redevelopment.jpg',
        location: 'Chicago, IL',
        year: '2024',
        size: 'large'
    },
    {
        id: 5,
        title: 'Boutique Hotel',
        category: 'hospitality',
        image: 'https://archicgi.com/wp-content/uploads/2025/06/lifestyle-render-resort-restaurant-FM8RAPAD.jpg',
        location: 'San Francisco, CA',
        year: '2023',
        size: 'medium'
    },
    {
        id: 6,
        title: 'Community Park',
        category: 'landscape',
        image: 'https://archicgi.com/wp-content/uploads/2023/08/aerial-3d-rendering-urban-development.jpg',
        location: 'Seattle, WA',
        year: '2024',
        size: 'medium'
    },
    {
        id: 7,
        title: 'Modern Apartment',
        category: 'residential',
        image: 'https://archicgi.com/wp-content/uploads/2025/09/dining-room-interior-3d-render.webp',
        location: 'Boston, MA',
        year: '2023',
        size: 'small'
    },
    {
        id: 8,
        title: 'Retail Complex',
        category: 'commercial',
        image: 'https://archicgi.com/wp-content/uploads/2025/09/interior-render-drawing-room.webp',
        location: 'Austin, TX',
        year: '2024',
        size: 'small'
    },
    {
        id: 9,
        title: 'Waterfront Estate',
        category: 'residential',
        image: 'https://archicgi.com/wp-content/uploads/2021/04/photorealistic-residential-exterior-3d-rendering-on-the-waterfront.jpg',
        location: 'San Diego, CA',
        year: '2023',
        size: 'medium'
    }
];

const filterOptions = [
    { id: 'all', label: 'All Projects', icon: Grid3X3 },
    { id: 'residential', label: 'Residential', icon: Home },
    { id: 'commercial', label: 'Commercial', icon: Building2 },
    { id: 'hospitality', label: 'Hospitality', icon: Building },
    { id: 'landscape', label: 'Landscape', icon: Trees },
    { id: 'mixed-use', label: 'Mixed-Use', icon: Grid3X3 }
];

const Projects: React.FC<{ onNavigate: (page: Page) => void }> = ({ onNavigate }) => {
    const [heroRef, heroVisible] = useIntersectionObserver<HTMLElement>();
    const [activeFilter, setActiveFilter] = useState('all');
    const { navigateToHomeWithScroll } = useNavigation();

    const handleBackToHome = () => {
        navigateToHomeWithScroll(onNavigate, 'work');
    };

    const filteredProjects = activeFilter === 'all' 
        ? projectsData 
        : projectsData.filter(project => project.category === activeFilter);

    // Group projects into alternating row layouts
    const getRowLayout = (projects: typeof projectsData) => {
        const rows: { projects: typeof projectsData; layout: string }[] = [];
        let i = 0;
        
        while (i < projects.length) {
            // Alternate between different row patterns
            const rowPattern = rows.length % 3;
            
            if (rowPattern === 0) {
                // Full width single project
                rows.push({ projects: [projects[i]], layout: 'full' });
                i++;
            } else if (rowPattern === 1) {
                // Two projects side by side
                rows.push({ projects: projects.slice(i, i + 2), layout: 'half' });
                i += 2;
            } else {
                // Three projects (one large + two small)
                rows.push({ projects: projects.slice(i, i + 3), layout: 'third' });
                i += 3;
            }
        }
        
        return rows;
    };

    const projectRows = getRowLayout(filteredProjects);

    return (
        <div className="bg-neutral-950 min-h-screen pt-20">
            {/* ═══ Hero ═══ */}
            <section ref={heroRef} className="relative py-24 lg:py-32 px-6 lg:px-12 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://archicgi.com/wp-content/uploads/2023/11/virtual-tour-real-estate-3d-rendering.jpg"
                        alt="Projects Hero"
                        className="w-full h-full object-cover opacity-20"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/90 to-transparent" />
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
                        Our <span className="text-stroke text-white/90">Projects</span>
                    </h1>

                    <p className={`text-neutral-400 text-lg md:text-xl max-w-2xl leading-relaxed transition-all duration-1000 delay-200 ${heroVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                        Explore our portfolio of architectural visualization projects across residential, commercial, and hospitality sectors.
                    </p>
                </div>
            </section>

            {/* ═══ Filter Section ═══ */}
            <section className="py-12 px-6 lg:px-12 border-t border-white/5 sticky top-20 z-30 bg-neutral-950/95 backdrop-blur-xl">
                <div className="">
                    <div className="flex flex-wrap gap-3 justify-center">
                        {filterOptions.map((filter) => (
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

            {/* ═══ Projects Grid (Bento Grid - Full Horizontal Rows) ═══ */}
            <section className="py-0 px-0">
                <div className="w-full">
                    <div className="flex flex-col">
                        {projectRows.map((row, rowIndex) => (
                            <div key={rowIndex} className="w-full border-b border-white/5">
                                {row.layout === 'full' && row.projects.map((project) => (
                                    <div
                                        key={project.id}
                                        className="group relative w-full h-[70vh] min-h-[600px] overflow-hidden"
                                    >
                                        {/* Image */}
                                        <div className="absolute inset-0">
                                            <img
                                                src={project.image}
                                                alt={project.title}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-60 group-hover:opacity-40"
                                            />
                                        </div>

                                        {/* Content Overlay */}
                                        <div className="absolute inset-0 px-6 lg:px-12 flex flex-col justify-end pb-12 lg:pb-16">
                                            <div className="max-w-7xl w-full mx-auto">
                                                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                                    <div className="flex items-center gap-3 mb-4">
                                                        <span className="px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-xs font-medium uppercase tracking-wider text-white/80">
                                                            {project.category}
                                                        </span>
                                                        <span className="text-sm text-white/60">{project.year}</span>
                                                    </div>
                                                    
                                                    <h3 className="text-3xl lg:text-5xl font-display text-white mb-4 group-hover:text-neutral-300 transition-colors">
                                                        {project.title}
                                                    </h3>
                                                    
                                                    <p className="text-lg text-neutral-400 flex items-center gap-2">
                                                        <span>{project.location}</span>
                                                    </p>
                                                </div>

                                                {/* View Project Link */}
                                                <div className="absolute bottom-12 right-12 lg:bottom-16 lg:right-12 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                    <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 group-hover:bg-white group-hover:text-neutral-950 transition-all">
                                                        <ArrowUpRight size={24} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {row.layout === 'half' && (
                                    <div className="grid grid-cols-1 md:grid-cols-2">
                                        {row.projects.map((project) => (
                                            <div
                                                key={project.id}
                                                className="group relative w-full h-[50vh] min-h-[400px] overflow-hidden border-r border-white/5 last:border-r-0"
                                            >
                                                {/* Image */}
                                                <div className="absolute inset-0">
                                                    <img
                                                        src={project.image}
                                                        alt={project.title}
                                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-60 group-hover:opacity-40"
                                                    />
                                                </div>

                                                {/* Content Overlay */}
                                                <div className="absolute inset-0 px-6 lg:px-8 flex flex-col justify-end pb-8 lg:pb-10">
                                                    <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                                        <div className="flex items-center gap-2 mb-3">
                                                            <span className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-medium uppercase tracking-wider text-white/80">
                                                                {project.category}
                                                            </span>
                                                            <span className="text-xs text-white/60">{project.year}</span>
                                                        </div>
                                                        
                                                        <h3 className="text-xl lg:text-2xl font-display text-white mb-2 group-hover:text-neutral-300 transition-colors">
                                                            {project.title}
                                                        </h3>
                                                        
                                                        <p className="text-sm text-neutral-400 flex items-center gap-1">
                                                            <span>{project.location}</span>
                                                        </p>
                                                    </div>

                                                    {/* View Project Link */}
                                                    <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                        <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 group-hover:bg-white group-hover:text-neutral-950 transition-all">
                                                            <ArrowUpRight size={20} />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {row.layout === 'third' && (
                                    <div className="grid grid-cols-1 md:grid-cols-3">
                                        {row.projects.map((project, idx) => (
                                            <div
                                                key={project.id}
                                                className={`group relative w-full h-[40vh] min-h-[350px] overflow-hidden ${
                                                    idx === 0 ? 'md:col-span-1' : 'border-r border-white/5'
                                                }`}
                                            >
                                                {/* Image */}
                                                <div className="absolute inset-0">
                                                    <img
                                                        src={project.image}
                                                        alt={project.title}
                                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-60 group-hover:opacity-40"
                                                    />
                                                </div>

                                                {/* Content Overlay */}
                                                <div className="absolute inset-0 px-6 lg:px-6 flex flex-col justify-end pb-6 lg:pb-8">
                                                    <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                                        <div className="flex items-center gap-2 mb-3">
                                                            <span className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-medium uppercase tracking-wider text-white/80">
                                                                {project.category}
                                                            </span>
                                                            <span className="text-xs text-white/60">{project.year}</span>
                                                        </div>
                                                        
                                                        <h3 className="text-lg lg:text-xl font-display text-white mb-2 group-hover:text-neutral-300 transition-colors">
                                                            {project.title}
                                                        </h3>
                                                        
                                                        <p className="text-xs text-neutral-400 flex items-center gap-1">
                                                            <span>{project.location}</span>
                                                        </p>
                                                    </div>

                                                    {/* View Project Link */}
                                                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                        <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 group-hover:bg-white group-hover:text-neutral-950 transition-all">
                                                            <ArrowUpRight size={16} />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Empty State */}
                    {filteredProjects.length === 0 && (
                        <div className="text-center py-24">
                            <p className="text-neutral-500 text-lg">No projects found in this category.</p>
                        </div>
                    )}
                </div>
            </section>

            {/* ═══ CTA Section ═══ */}
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
                        className="hidden md:inline-flex items-center gap-2 text-sm border border-white/20 px-6 py-2.5 hover:bg-white hover:text-neutral-950 transition-all duration-300 group cursor-hover"
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
