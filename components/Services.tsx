import React from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { Video, PenTool, ArrowRight, Building2, Armchair, Box, Globe, Plane } from 'lucide-react';
import { Service, Page } from '../types';

const services: Service[] = [
    { id: 1, id_tag: 'exterior-rendering', title: 'Exterior Rendering', description: 'Photorealistic visualizations of building exteriors, landscapes, and urban environments lighting.', icon: <Building2 size={32} />, link: '#' },
    { id: 2, id_tag: 'interior-visualization', title: 'Interior Rendering', description: 'Detailed interior spaces showcasing lighting, textures, and furniture arrangements.', icon: <Armchair size={32} />, link: '#' },
    { id: 3, id_tag: 'immersive', title: 'Immersive 3D Tours', description: 'Interactive walkthroughs allowing users to navigate spaces freely in real-time.', icon: <Box size={32} />, link: '#' },
    { id: 4, id_tag: 'virtual-tour', title: 'Virtual Tour', description: 'High-definition 360-degree panoramic tours compatible with web, mobile, and VR headsets.', icon: <Globe size={32} />, link: '#' },
    { id: 5, id_tag: 'aerial-rendering', title: 'Aerial Rendering', description: 'Bird\'s-eye views integrating projects into their surrounding context and environment.', icon: <Plane size={32} />, link: '#' },
    { id: 7, id_tag: 'animation', title: '3D Animations', description: 'Cinematic motion graphics and fly-throughs telling the compelling story of your project.', icon: <Video size={32} />, link: '#' },
];

interface ServiceCardProps {
    service: Service;
    index: number;
    onNavigate: (page: Page) => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, index, onNavigate }) => {
    const [ref, isVisible] = useIntersectionObserver<HTMLAnchorElement>();
    
    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        if (service.id_tag === 'exterior-rendering') {
            onNavigate('exterior');
        } else if (service.id_tag === 'interior-visualization') {
            onNavigate('interior');
        } else if (service.id_tag === 'virtual-tour') {
            onNavigate('virtual-tour');
        } else if (service.id_tag === 'aerial-rendering') {
            onNavigate('aerial');
        } else if (service.id_tag === 'immersive') {
            onNavigate('immersive');
        } else if (service.id_tag === 'animation') {
            onNavigate('animation');
        }
        window.scrollTo(0, 0);
    };

    return (
        <a 
            ref={ref}
            href={service.link}
            onClick={handleClick}
            className={`block p-10 border border-white/5 bg-gradient-to-br from-white/[0.02] to-transparent hover:from-white/[0.05] transition-all duration-500 group cursor-hover ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}
            style={{ transitionDelay: `${index * 100}ms` }}
        >
            <div className="w-16 h-16 border border-white/20 flex items-center justify-center mb-8 text-neutral-400 group-hover:text-white group-hover:border-white/40 group-hover:rotate-6 transition-all duration-500">
                {service.icon}
            </div>
            <h3 className="text-2xl font-display mb-4 group-hover:translate-x-2 transition-transform duration-500">{service.title}</h3>
            <p className="text-neutral-400 text-sm leading-relaxed group-hover:text-neutral-300 transition-colors mb-6">{service.description}</p>
            
            <div className="flex items-center gap-2 text-sm text-neutral-500 group-hover:text-white transition-colors font-medium">
                <span>Learn more</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
        </a>
    );
};

interface ServicesProps {
    onNavigate: (page: Page) => void;
}

const Services: React.FC<ServicesProps> = ({ onNavigate }) => {
    return (
        <section id="services" className="py-32 bg-neutral-950 relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-white/[0.02] rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/4 left-0 w-[400px] h-[400px] bg-white/[0.01] rounded-full blur-3xl"></div>
            </div>

            <div className="px-6 lg:px-12 relative z-10">
                <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-20">
                    <div>
                        <p className="text-neutral-500 text-sm tracking-[0.3em] uppercase mb-4">What We Do</p>
                        <h2 className="font-display text-4xl md:text-6xl font-medium">Our <span className="text-stroke text-white">Services</span></h2>
                    </div>
                    <p className="text-neutral-400 max-w-md mt-6 lg:mt-0">Comprehensive visualization solutions tailored to bring your architectural vision to life.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {services.map((service, index) => (
                        <ServiceCard key={service.id} service={service} index={index} onNavigate={onNavigate} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Services;