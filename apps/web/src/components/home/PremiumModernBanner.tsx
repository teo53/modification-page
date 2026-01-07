
import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, DollarSign } from 'lucide-react';

type TierType = 'diamond' | 'sapphire' | 'ruby' | 'gold';

interface PremiumModernBannerProps {
    id: string;
    tier: TierType;
    title: string;
    location: string;
    salary: string;
    workHours: string;
    businessName: string;
}

const tierStyles = {
    diamond: {
        badge: 'DIAMOND',
        badgeColor: 'linear-gradient(135deg, #a0a0c0 0%, #e0e0f0 30%, #ffffff 50%, #e0e0f0 70%, #a0a0c0 100%)',
        badgeTextColor: '#0a0a0a',
        glowColor: '255, 255, 255',
        subtleGlow: 'linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(200, 220, 255, 0.15) 50%, rgba(255, 255, 255, 0.1) 100%)',
        iconFill: '#e0e0f0',
        borderColor: 'rgba(255, 255, 255, 0.3)',
        frameGradient: 'linear-gradient(135deg, #666680 0%, #a0a0c0 15%, #e0e0f0 30%, #ffffff 50%, #e0e0f0 70%, #a0a0c0 85%, #666680 100%)',
    },
    sapphire: {
        badge: 'SAPPHIRE',
        badgeColor: 'linear-gradient(135deg, #2a5a9a 0%, #4a8adc 30%, #6abaff 50%, #4a8adc 70%, #2a5a9a 100%)',
        badgeTextColor: '#ffffff',
        glowColor: '106, 186, 255',
        subtleGlow: 'linear-gradient(135deg, rgba(30, 100, 200, 0.25) 0%, rgba(60, 140, 255, 0.15) 50%, rgba(30, 80, 180, 0.2) 100%)',
        iconFill: '#6abaff',
        borderColor: 'rgba(74, 138, 220, 0.4)',
        frameGradient: 'linear-gradient(135deg, #1a3a6a 0%, #2a5a9a 15%, #4a8adc 30%, #6abaff 50%, #4a8adc 70%, #2a5a9a 85%, #1a3a6a 100%)',
    },
    ruby: {
        badge: 'RUBY',
        badgeColor: 'linear-gradient(135deg, #8a2a3a 0%, #c44a5a 30%, #e86a7a 50%, #c44a5a 70%, #8a2a3a 100%)',
        badgeTextColor: '#ffffff',
        glowColor: '232, 106, 122',
        subtleGlow: 'linear-gradient(135deg, rgba(180, 40, 60, 0.25) 0%, rgba(220, 60, 80, 0.15) 50%, rgba(160, 30, 50, 0.2) 100%)',
        iconFill: '#e86a7a',
        borderColor: 'rgba(196, 74, 90, 0.4)',
        frameGradient: 'linear-gradient(135deg, #5a1a22 0%, #8a2a3a 15%, #c44a5a 30%, #e86a7a 50%, #c44a5a 70%, #8a2a3a 85%, #5a1a22 100%)',
    },
    gold: {
        badge: 'GOLD',
        badgeColor: 'linear-gradient(135deg, #9a8044 0%, #d4b866 30%, #f0d078 50%, #d4b866 70%, #9a8044 100%)',
        badgeTextColor: '#0a0a0a',
        glowColor: '212, 184, 102',
        subtleGlow: 'linear-gradient(135deg, rgba(180, 150, 90, 0.15) 0%, transparent 30%, transparent 70%, rgba(180, 150, 90, 0.1) 100%)',
        iconFill: '#d4b866',
        borderColor: 'rgba(180, 150, 90, 0.4)',
        frameGradient: 'linear-gradient(135deg, #3d3322 0%, #8a7442 20%, #c9a84c 40%, #f0d078 50%, #c9a84c 60%, #8a7442 80%, #3d3322 100%)',
    }
};

const PremiumModernBanner: React.FC<PremiumModernBannerProps & { isEditMode?: boolean }> = ({
    id, tier, title, location, salary, workHours: _workHours, businessName, isEditMode = false
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLElement>(null);
    const config = tierStyles[tier];
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    useEffect(() => {
        if (!containerRef.current) return;
        const resizeObserver = new ResizeObserver(entries => {
            for (const entry of entries) {
                setDimensions({
                    width: entry.contentRect.width,
                    height: entry.contentRect.height
                });
            }
        });
        resizeObserver.observe(containerRef.current as HTMLElement);
        return () => resizeObserver.disconnect();
    }, []);

    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (!containerRef.current) return;
        const observer = new IntersectionObserver(([entry]) => {
            setIsVisible(entry.isIntersecting);
        }, { threshold: 0.1 });
        observer.observe(containerRef.current as HTMLElement);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!isVisible) return; // Don't run logic if not visible

        const canvas = canvasRef.current;
        if (!canvas || dimensions.width === 0 || dimensions.height === 0) return;

        // Set exact canvas size to match container
        canvas.width = dimensions.width;
        canvas.height = dimensions.height;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let lastTime = performance.now();
        const margin = 14;
        const frameWidth = canvas.width - margin * 2;
        const frameHeight = canvas.height - margin * 2;

        const getFramePosition = (t: number) => {
            const perimeter = 2 * (frameWidth + frameHeight);
            if (perimeter <= 0) return { x: 0, y: 0 };

            // t is 0..1, map to perimeter
            const pos = ((t % 1) + 1) % 1 * perimeter;

            if (pos < frameWidth) {
                return { x: margin + pos, y: margin };
            } else if (pos < frameWidth + frameHeight) {
                return { x: margin + frameWidth, y: margin + (pos - frameWidth) };
            } else if (pos < 2 * frameWidth + frameHeight) {
                return { x: margin + frameWidth - (pos - frameWidth - frameHeight), y: margin + frameHeight };
            } else {
                return { x: margin, y: margin + frameHeight - (pos - 2 * frameWidth - frameHeight) };
            }
        };

        class LightStream {
            position: number;
            speed: number;
            length: number;
            intensity: number;

            constructor(offset: number, speed: number, length: number, intensity: number) {
                this.position = offset;
                this.speed = speed;
                this.length = length;
                this.intensity = intensity;
            }

            update(deltaTime: number) {
                this.position += this.speed * deltaTime * 0.0001;
                if (this.position > 1) this.position -= 1;
            }

            draw() {
                const segments = 20; // Reduced segments for performance (40 -> 20)
                for (let i = 0; i < segments; i++) {
                    const t1 = this.position - (i / segments) * this.length;
                    const t2 = this.position - ((i + 1) / segments) * this.length;

                    const pos1 = getFramePosition(t1);
                    const pos2 = getFramePosition(t2);

                    const fade = 1 - (i / segments);
                    const alpha = fade * fade * this.intensity;

                    if (alpha < 0.05) continue; // Aggressive culling

                    // Simple white gradient trail
                    const gradient = ctx!.createLinearGradient(pos1.x, pos1.y, pos2.x, pos2.y);

                    if (tier === 'diamond') {
                        gradient.addColorStop(0, `rgba(255, 255, 255, ${alpha})`);
                        gradient.addColorStop(1, `rgba(200, 220, 255, ${alpha * 0.5})`);
                    } else if (tier === 'sapphire') {
                        gradient.addColorStop(0, `rgba(106, 186, 255, ${alpha})`);
                        gradient.addColorStop(1, `rgba(74, 138, 220, ${alpha * 0.5})`);
                    } else if (tier === 'ruby') {
                        gradient.addColorStop(0, `rgba(232, 106, 122, ${alpha})`);
                        gradient.addColorStop(1, `rgba(196, 74, 90, ${alpha * 0.5})`);
                    } else { // Gold
                        gradient.addColorStop(0, `rgba(212, 184, 102, ${alpha})`);
                        gradient.addColorStop(1, `rgba(180, 150, 80, ${alpha * 0.5})`);
                    }

                    ctx!.beginPath();
                    ctx!.moveTo(pos1.x, pos1.y);
                    ctx!.lineTo(pos2.x, pos2.y);
                    ctx!.strokeStyle = gradient;
                    ctx!.lineWidth = 2 + fade * 2;
                    ctx!.lineCap = 'round';
                    ctx!.stroke();
                }

                // Header Glow (Optimized)
                const headPos = getFramePosition(this.position);
                const glowGradient = ctx!.createRadialGradient(
                    headPos.x, headPos.y, 0,
                    headPos.x, headPos.y, 12 // Reduced radius
                );

                const rgb = config.glowColor; // "R, G, B"
                glowGradient.addColorStop(0, `rgba(${rgb}, ${this.intensity * 0.5})`);
                glowGradient.addColorStop(1, `rgba(${rgb}, 0)`);

                ctx!.beginPath();
                ctx!.arc(headPos.x, headPos.y, 12, 0, Math.PI * 2);
                ctx!.fillStyle = glowGradient;
                ctx!.fill();
            }
        }

        class Sparkle {
            x: number = 0;
            y: number = 0;
            size: number = 0;
            life: number = 0;
            maxLife: number = 0;
            delay: number = 0;

            constructor() {
                this.reset(true);
            }

            reset(initial = false) {
                const t = Math.random();
                const pos = getFramePosition(t);
                this.x = pos.x + (Math.random() - 0.5) * 10;
                this.y = pos.y + (Math.random() - 0.5) * 10;
                this.size = Math.random() * 2 + 0.5;
                this.life = 0;
                this.maxLife = Math.random() * 2000 + 1000;
                this.delay = initial ? Math.random() * 3000 : 0;
            }

            update(deltaTime: number) {
                if (this.delay > 0) {
                    this.delay -= deltaTime;
                    return;
                }
                this.life += deltaTime;
                if (this.life > this.maxLife) this.reset();
            }

            draw() {
                if (this.delay > 0) return;
                const progress = this.life / this.maxLife;
                const alpha = Math.sin(progress * Math.PI) * 0.8;
                if (alpha < 0.05) return;

                ctx!.beginPath();
                ctx!.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx!.fillStyle = `rgba(${config.glowColor}, ${alpha})`;
                ctx!.fill();
            }
        }

        const streams = [
            new LightStream(0, 0.15, 0.08, 1),
            new LightStream(0.5, 0.15, 0.08, 1),
            // Removed 2 streams for performance
            // new LightStream(0.25, 0.12, 0.05, 0.6),
            // new LightStream(0.75, 0.12, 0.05, 0.6),
        ];

        const sparkles = Array.from({ length: 12 }, () => new Sparkle()); // Reduced from 20 to 12

        const animate = (currentTime: number) => {
            const deltaTime = currentTime - lastTime;
            lastTime = currentTime;

            ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear

            streams.forEach(s => { s.update(deltaTime); s.draw(); });
            sparkles.forEach(s => { s.update(deltaTime); s.draw(); });

            animationFrameId = requestAnimationFrame(animate);
        };

        animationFrameId = requestAnimationFrame(animate);

        return () => cancelAnimationFrame(animationFrameId);
    }, [dimensions, tier, config, isVisible]); // Re-run when visibility changes

    const Component = isEditMode ? 'div' : Link;
    const linkProps = isEditMode ? {} : { to: `/ad/${id}` };

    const handleClick = (e: React.MouseEvent) => {
        if (isEditMode) {
            e.preventDefault();
        }
    };

    return (
        <Component
            {...linkProps as any}
            onClick={handleClick}
            ref={containerRef as any}
            className="block relative w-full h-[140px] sm:h-[160px] md:h-[200px] rounded-lg group hover:-translate-y-1 transition-transform duration-300"
            style={{
                background: 'linear-gradient(145deg, #0d0d10 0%, #12121a 40%, #0a0a0f 60%, #101018 100%)'
            }}
        >
            {/* 1. Underlying Glow */}
            <div
                className="absolute -inset-[3px] rounded-lg opacity-60 blur-md pointer-events-none transition-opacity duration-1000"
                style={{ background: config.subtleGlow }}
            />

            {/* 2. Main Background Wrapper */}
            <div className="absolute inset-0 rounded-lg overflow-hidden border border-white/5 bg-[#0a0a0a]">

                {/* 3. Static Frame Border (Gradient) - Hide on mobile */}
                <div className="absolute top-[10px] left-[10px] right-[10px] bottom-[10px] sm:top-[14px] sm:left-[14px] sm:right-[14px] sm:bottom-[14px] rounded pointer-events-none z-10">
                    <div className="absolute inset-0 rounded border-[1px] sm:border-[1.5px]" style={{
                        background: config.frameGradient,
                        WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                        WebkitMaskComposite: 'xor',
                        maskComposite: 'exclude',
                        padding: '1px'
                    }} />
                </div>

                {/* 4. Canvas Layer - Hidden on mobile for performance */}
                <canvas ref={canvasRef} className="absolute inset-0 z-20 pointer-events-none hidden sm:block" />

                {/* 5. Content Layer - MOBILE FIRST DESIGN */}
                <div className="relative z-30 h-full flex flex-col sm:flex-row items-center justify-center sm:justify-start px-4 sm:px-5 md:px-10 py-3 sm:py-0">

                    {/* Rotating Logo - Hidden on small mobile */}
                    <div className="hidden sm:block mr-4 md:mr-10 shrink-0">
                        <div className="w-[50px] h-[50px] md:w-[85px] md:h-[85px] relative flex items-center justify-center">
                            <div className="absolute inset-0 rounded-full border opacity-30" style={{ borderColor: config.borderColor }} />
                            <div className="absolute w-[40px] h-[40px] md:w-[70px] md:h-[70px] rounded-full border opacity-50 animate-[spin_20s_linear_infinite]" style={{ borderColor: config.borderColor }} />
                            <span className="text-white/80 text-[9px] md:text-[13px] font-medium tracking-[2px]">{businessName.slice(0, 4)}</span>
                        </div>
                    </div>

                    {/* Text Content - Centered on mobile */}
                    <div className="flex-1 min-w-0 text-center sm:text-left">
                        {/* Tier Badge */}
                        <div
                            className="inline-flex items-center gap-1 px-2 py-0.5 sm:px-2.5 md:px-3.5 md:py-1 rounded-[2px] text-[8px] sm:text-[10px] md:text-[11px] font-bold tracking-[2px] mb-1 sm:mb-2 md:mb-3 shadow-lg"
                            style={{ background: config.badgeColor, color: config.badgeTextColor }}
                        >
                            <span className="text-[7px] sm:text-[9px] md:text-[10px]">✦</span> {config.badge}
                        </div>

                        {/* Title - Larger, single line */}
                        <h1 className="text-[15px] sm:text-[18px] md:text-[26px] font-bold text-white tracking-wide mb-0.5 sm:mb-1 md:mb-1.5 truncate">
                            {title}
                        </h1>

                        {/* Subtitle - Hidden on mobile */}
                        <p className="hidden sm:block text-[9px] md:text-[11px] font-light tracking-[4px] text-white/40 mb-2 md:mb-4 uppercase">
                            Premium Entertainment
                        </p>

                        {/* Info Tags - Simplified on mobile, single line */}
                        <div className="flex items-center justify-center sm:justify-start gap-2 sm:gap-4 md:gap-6 text-[9px] sm:text-[11px] md:text-[13px] text-white/70">
                            <span className="flex items-center gap-1">
                                <MapPin size={10} className="opacity-60" style={{ color: config.iconFill }} />
                                <span className="truncate max-w-[60px] sm:max-w-[100px] md:max-w-none">{location}</span>
                            </span>
                            <span className="hidden sm:inline text-white/30">|</span>
                            <span className="hidden sm:flex items-center gap-1">
                                <DollarSign size={10} className="opacity-60" style={{ color: config.iconFill }} />
                                <span className="truncate max-w-[80px]">{salary}</span>
                            </span>
                        </div>
                    </div>
                </div>

                {/* Ambient Gradient Overlays */}
                <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/5 to-transparent pointer-events-none z-0" />
                <div className="absolute -left-[20%] -top-[50%] w-[60%] h-[200%] pointer-events-none opacity-20 z-0 bg-radial-gradient"
                    style={{ background: `radial-gradient(ellipse, rgba(${config.glowColor}, 0.15) 0%, transparent 70%)` }} />

            </div>
        </Component>
    );
};

export default PremiumModernBanner;
