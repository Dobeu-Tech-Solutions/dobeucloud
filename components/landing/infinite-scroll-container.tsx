'use client';

import { useEffect, useRef, ReactNode } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface InfiniteScrollContainerProps {
  children: ReactNode;
}

export function InfiniteScrollContainer({ children }: InfiniteScrollContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
  });

  // Smooth scroll behavior
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const scrollAmount = e.deltaY * 0.8; // Reduce scroll speed for smoothness
      window.scrollBy({
        top: scrollAmount,
        behavior: 'smooth',
      });
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
    }

    return () => {
      if (container) {
        container.removeEventListener('wheel', handleWheel);
      }
    };
  }, []);

  // Parallax effect for background
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);

  return (
    <div ref={containerRef} className="relative w-full overflow-x-hidden">
      {/* Background with parallax effect */}
      <motion.div
        className="fixed inset-0 -z-10"
        style={{
          backgroundImage: 'linear-gradient(to bottom, #0f172a, #1e293b)',
          y: backgroundY,
        }}
      />
      
      {/* Gradient overlays for depth */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-b from-transparent via-black/5 to-black/10" />
      
      {/* Content */}
      <div className="relative">
        {children}
      </div>
      
      {/* Scroll indicator */}
      <motion.div
        className="fixed right-4 top-1/2 -translate-y-1/2 w-1 h-24 bg-white/10 rounded-full overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <motion.div
          className="absolute top-0 left-0 w-full bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"
          style={{
            height: '40%',
            y: useTransform(scrollYProgress, [0, 1], ['0%', '60%']),
          }}
        />
      </motion.div>
    </div>
  );
}
