import React, { useState, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize } from 'lucide-react';

interface VideoPlayerProps {
    src: string;
    autoPlay?: boolean;
    muted?: boolean;
    loop?: boolean;
    aspectRatio?: 'video' | 'vertical' | 'wide' | 'custom';
    className?: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
    src,
    autoPlay = true,
    muted = true,
    loop = true,
    aspectRatio = 'video',
    className = ''
}) => {
    const [isPlaying, setIsPlaying] = useState(autoPlay);
    const [isMuted, setIsMuted] = useState(muted);
    const [progress, setProgress] = useState(0);
    const [showControls, setShowControls] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const aspectClass = aspectRatio === 'vertical' 
        ? 'aspect-[9/16] max-h-[600px]' 
        : aspectRatio === 'wide'
        ? 'aspect-[21/9]'
        : aspectRatio === 'custom'
        ? ''
        : 'aspect-[4/3]';

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

    const handleMouseEnter = () => {
        setShowControls(true);
        if (controlsTimeoutRef.current) {
            clearTimeout(controlsTimeoutRef.current);
        }
    };

    const handleMouseLeave = () => {
        controlsTimeoutRef.current = setTimeout(() => {
            setShowControls(false);
        }, 300);
    };

    return (
        <div 
            className={`relative ${aspectClass} rounded-2xl overflow-hidden bg-neutral-900 group ${className}`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <video
                ref={videoRef}
                src={src}
                className="w-full h-full object-cover"
                muted={isMuted}
                onTimeUpdate={handleTimeUpdate}
                onEnded={handleEnded}
                onClick={togglePlay}
                playsInline
                autoPlay={autoPlay}
                loop={loop}
            />

            {/* Play/Pause overlay indicator */}
            {!isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 pointer-events-none">
                    <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20">
                        <Play fill="white" className="w-10 h-10 text-white translate-x-1" />
                    </div>
                </div>
            )}

            {/* Controls overlay - appears on hover */}
            <div 
                className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 transition-opacity duration-300 z-20 ${
                    showControls ? 'opacity-100' : 'opacity-0'
                }`}
            >
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

export default VideoPlayer;
