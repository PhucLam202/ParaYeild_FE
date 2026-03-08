"use client";

import { useState, useEffect, useRef } from "react";

// The total number of frame images in the public/BG folder
const TOTAL_FRAMES = 64;
// Frames per second for the playback
const FPS = 12;

export default function HeroBgAnimation() {
    const [currentFrame, setCurrentFrame] = useState(1);
    const [imagesLoaded, setImagesLoaded] = useState(false);

    // Use refs for animation variables to avoid stale closures in requestAnimationFrame
    const requestRef = useRef<number | null>(null);
    const previousTimeRef = useRef<number | null>(null);
    const directionRef = useRef<number>(1); // 1 = forward, -1 = reverse
    const imageRefs = useRef<HTMLImageElement[]>([]);

    // Preload all images on mount
    useEffect(() => {
        let loadedCount = 0;
        const images: HTMLImageElement[] = [];

        for (let i = 1; i <= TOTAL_FRAMES; i++) {
            const img = new Image();
            img.src = `/BG/C_th_to_202602211100_o96xv_${String(i).padStart(3, "0")}.png`;
            img.onload = () => {
                loadedCount++;
                if (loadedCount === TOTAL_FRAMES) {
                    setImagesLoaded(true);
                }
            };
            img.onerror = () => {
                // To avoid getting stuck if an image fails to load
                loadedCount++;
                if (loadedCount === TOTAL_FRAMES) {
                    setImagesLoaded(true);
                }
            };
            images.push(img);
        }
        imageRefs.current = images;
    }, []);

    // The core animation loop
    useEffect(() => {
        if (!imagesLoaded) return;

        const frameInterval = 1000 / FPS;

        const animate = (time: number) => {
            if (previousTimeRef.current == null) {
                previousTimeRef.current = time;
            }
            const deltaTime = time - previousTimeRef.current;

            if (deltaTime >= frameInterval) {
                setCurrentFrame((prev) => {
                    let next = prev + directionRef.current;

                    if (next >= TOTAL_FRAMES) {
                        next = TOTAL_FRAMES;
                        directionRef.current = -1; // Switch to reverse
                    } else if (next <= 1) {
                        next = 1;
                        directionRef.current = 1; // Switch to forward
                    }

                    return next;
                });

                // Adjust previousTime to ensure smooth timing
                previousTimeRef.current = time - (deltaTime % frameInterval);
            }
            requestRef.current = requestAnimationFrame(animate);
        };

        requestRef.current = requestAnimationFrame(animate);

        return () => {
            if (requestRef.current) {
                cancelAnimationFrame(requestRef.current);
            }
        };
    }, [imagesLoaded]);

    const currentImagePath = `/BG/C_th_to_202602211100_o96xv_${String(currentFrame).padStart(3, "0")}.png`;

    return (
        <div className="absolute inset-0 z-0 pointer-events-none w-full h-full overflow-hidden bg-[#020402] flex items-center justify-center">
            {/* Background Image Container */}
            <div
                className="w-full h-full min-w-[100vw] min-h-[100vh] bg-center bg-cover bg-no-repeat transition-all duration-[80ms] ease-linear opacity-50"
                style={{ backgroundImage: `url(${currentImagePath})` }}
            />
            {/* Overlay to ensure text readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#020402]/40 via-transparent to-[#020402] pointer-events-none mix-blend-multiply" />

            {/* Robust Watermark Mask */}
            {/* 1. Vignette at the bottom to transition into other sections */}
            <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#020402] to-transparent pointer-events-none z-10" />

            {/* 2. Surgical radial-gradient mask for the "Veo" watermark (bottom-right) */}
            <div
                className="absolute bottom-0 right-0 w-40 h-20 pointer-events-none z-10"
                style={{
                    background: 'radial-gradient(circle at bottom right, #020402 0%, #020402 40%, transparent 100%)'
                }}
            />

            {/* 3. Significantly reduced darkening overlay */}
            <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#020402]/60 to-transparent pointer-events-none z-10" />
        </div>
    );
}
