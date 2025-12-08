import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const slides = [
    {
        id: 1,
        image: "https://images.unsplash.com/photo-1566737236500-c8ac43014a67?q=80&w=1920&auto=format&fit=crop",
        title: "강남 No.1 하이퍼블릭",
        subtitle: "최고의 대우, 당일 지급 보장",
        color: "from-primary/80"
    },
    {
        id: 2,
        image: "https://images.unsplash.com/photo-1570872626485-d8ffea69f463?q=80&w=1920&auto=format&fit=crop",
        title: "홍대 핫플레이스 라운지",
        subtitle: "주말 알바 급구, 시급 5만원+",
        color: "from-secondary/80"
    },
    {
        id: 3,
        image: "https://images.unsplash.com/photo-1514525253440-b393452e8d26?q=80&w=1920&auto=format&fit=crop",
        title: "이태원 프리미엄 클럽",
        subtitle: "모델급 스탭 모집, 숙소 지원",
        color: "from-purple-600/80"
    }
];

const HeroSection: React.FC = () => {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    const prev = () => setCurrent((curr) => (curr === 0 ? slides.length - 1 : curr - 1));
    const next = () => setCurrent((curr) => (curr + 1) % slides.length);

    return (
        <div className="relative w-full h-[400px] md:h-[500px] overflow-hidden bg-black">
            {/* Slides */}
            {slides.map((slide, index) => (
                <div
                    key={slide.id}
                    className={`absolute inset-0 transition-opacity duration-1000 ${index === current ? 'opacity-100' : 'opacity-0'
                        }`}
                >
                    <img
                        src={slide.image}
                        alt={slide.title}
                        className="w-full h-full object-cover opacity-60"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-r ${slide.color} to-transparent`} />

                    <div className="absolute inset-0 flex items-center container mx-auto px-4">
                        <div className="max-w-2xl space-y-4 animate-fade-in-up">
                            <span className="inline-block px-3 py-1 rounded-full border border-white/30 text-white text-sm backdrop-blur-sm">
                                Premium Ad
                            </span>
                            <h2 className="text-4xl md:text-6xl font-bold text-white leading-tight">
                                {slide.title}
                            </h2>
                            <p className="text-xl md:text-2xl text-white/90">
                                {slide.subtitle}
                            </p>
                            <button className="mt-6 px-8 py-3 bg-white text-black font-bold rounded-full hover:bg-primary hover:text-white transition-colors">
                                자세히 보기
                            </button>
                        </div>
                    </div>
                </div>
            ))}

            {/* Controls */}
            <button
                onClick={prev}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/20 text-white hover:bg-black/50 transition-colors"
            >
                <ChevronLeft size={32} />
            </button>
            <button
                onClick={next}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/20 text-white hover:bg-black/50 transition-colors"
            >
                <ChevronRight size={32} />
            </button>

            {/* Indicators */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                {slides.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setCurrent(i)}
                        className={`w-2.5 h-2.5 rounded-full transition-all ${i === current ? 'bg-white w-8' : 'bg-white/50'
                            }`}
                    />
                ))}
            </div>
        </div>
    );
};

export default HeroSection;
