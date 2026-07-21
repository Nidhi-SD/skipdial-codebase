"use client";

import React, { useEffect, useRef, useState } from "react";

const TOTAL_FRAMES = 240;
const INITIAL_LOAD_COUNT = 30; // Number of frames to load before starting animation

export function FullPageScrollBgCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);

  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  const currentFrameRef = useRef<number>(0);
  const targetFrameRef = useRef<number>(0);
  const animationFrameIdRef = useRef<number | null>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);

  // 1. Progressive Preloading
  useEffect(() => {
    let isMounted = true;
    const loadedImages: HTMLImageElement[] = new Array(TOTAL_FRAMES);
    let count = 0;

    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      const frameNum = String(i).padStart(4, "0");
      img.src = `/page-bg-frames/frame_${frameNum}.jpg`;

      const handleLoadOrError = () => {
        if (!isMounted) return;
        count++;
        // Unlock the initial render once the first batch is ready
        if (count === INITIAL_LOAD_COUNT && !isLoaded) {
          setIsLoaded(true);
        }
        // Fallback in case we have fewer than INITIAL_LOAD_COUNT frames
        if (count === TOTAL_FRAMES && !isLoaded) {
          setIsLoaded(true);
        }
      };

      img.onload = handleLoadOrError;
      img.onerror = handleLoadOrError;

      loadedImages[i - 1] = img;
    }

    imagesRef.current = loadedImages;

    return () => {
      isMounted = false;
    };
  }, [isLoaded]);

  // 2. Draw frame on canvas
  const drawFrame = (frameIndex: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const imgList = imagesRef.current;
    const clampedIndex = Math.max(0, Math.min(TOTAL_FRAMES - 1, Math.round(frameIndex)));
    const img = imgList[clampedIndex];

    if (!img || !img.complete || img.naturalWidth === 0) return;

    const dpr = window.devicePixelRatio || 1;
    const width = window.innerWidth;
    const height = window.innerHeight;

    if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
      canvas.width = width * dpr;
      canvas.height = height * dpr;
    }

    ctx.save();
    ctx.scale(dpr, dpr);

    const imgAspect = img.naturalWidth / img.naturalHeight;
    const canvasAspect = width / height;

    let drawWidth: number;
    let drawHeight: number;
    let offsetX: number;
    let offsetY: number;

    if (canvasAspect > imgAspect) {
      drawWidth = width;
      drawHeight = width / imgAspect;
      offsetX = 0;
      offsetY = (height - drawHeight) / 2;
    } else {
      drawWidth = height * imgAspect;
      drawHeight = height;
      offsetX = (width - drawWidth) / 2;
      offsetY = 0;
    }

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);
    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    ctx.restore();
  };

  // 3. Scroll tracking (mapping scroll to target frame)
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;

      if (docHeight <= 0) return;

      // Slight easing curve to pace the animation (spends slightly more time in the early frames)
      const rawProgress = Math.max(0, Math.min(1, scrollY / docHeight));
      const pacedProgress = Math.pow(rawProgress, 0.9);

      targetFrameRef.current = pacedProgress * (TOTAL_FRAMES - 1);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  // 4. Smooth Lerp Animation Loop + Dynamic DOM Updates
  useEffect(() => {
    let lastDrawnFrame = -1;

    const renderLoop = () => {
      // Lerp frame
      const diff = targetFrameRef.current - currentFrameRef.current;
      currentFrameRef.current += diff * 0.12;

      const frameToDraw = Math.round(currentFrameRef.current);
      if (frameToDraw !== lastDrawnFrame) {
        drawFrame(currentFrameRef.current);
        lastDrawnFrame = frameToDraw;
      }

      // Dynamic Depth of Field & Parallax (runs every frame for smooth sync)
      const smoothedProgress = currentFrameRef.current / (TOTAL_FRAMES - 1);
      
      // Update canvas parallax
      if (canvasRef.current) {
        const yOffset = smoothedProgress * -60; // Drift up by 60px over the page
        canvasRef.current.style.transform = `scale(1.05) translateY(${yOffset}px)`;
      }

      // Update overlay blur and opacity dynamically
      if (overlayRef.current) {
        // Blur goes from 0px to 12px
        const blurAmount = smoothedProgress * 12;
        // White wash: starts high enough that hero copy stays legible over the
        // busiest frames, then deepens so later text sections read cleanly.
        const opacityAmount = 0.55 + smoothedProgress * 0.32;
        
        overlayRef.current.style.backdropFilter = `blur(${blurAmount}px)`;
        // Vendor-prefixed twin isn't in CSSStyleDeclaration's typings — set it
        // through setProperty so Safari still gets the blur.
        overlayRef.current.style.setProperty(
          "-webkit-backdrop-filter",
          `blur(${blurAmount}px)`
        );
        overlayRef.current.style.backgroundColor = `rgba(255, 255, 255, ${opacityAmount})`;
      }

      animationFrameIdRef.current = requestAnimationFrame(renderLoop);
    };

    animationFrameIdRef.current = requestAnimationFrame(renderLoop);

    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, [isLoaded]);

  return (
    <>
      {/* Full-screen fixed background canvas with Parallax */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full object-cover z-[-3] pointer-events-none block"
        style={{ transformOrigin: 'center center' }}
      />

      {/* Cinematic Film Grain Overlay */}
      <div
        className="fixed inset-0 z-[-2] pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Dynamic Depth of Field Overlay (Blur & Opacity handled by JS ref) */}
      <div 
        ref={overlayRef}
        className="fixed inset-0 z-[-1] pointer-events-none"
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.3)',
          backdropFilter: 'blur(0px)',
          WebkitBackdropFilter: 'blur(0px)',
        }}
      />
    </>
  );
}
