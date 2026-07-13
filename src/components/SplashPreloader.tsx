import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
// @ts-ignore
import logoImg from '../assets/images/btm_official_logo_1783925639173.jpg';

interface SplashPreloaderProps {
  isReady: boolean;
  onComplete: () => void;
}

export function SplashPreloader({ isReady, onComplete }: SplashPreloaderProps) {
  const [progress, setProgress] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // Prevent scrolling while preloader is active
    document.body.style.overflow = 'hidden';
    
    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        
        // Slower progress as it gets closer to 100 to feel realistic, unless isReady is true
        if (prev > 85 && !isReady) {
          return prev + Math.random() * 0.5; // slow crawl
        }
        
        const increment = Math.floor(Math.random() * 8) + 4;
        return Math.min(prev + increment, 100);
      });
    }, 80);

    return () => {
      clearInterval(interval);
      document.body.style.overflow = 'unset';
    };
  }, [isReady]);

  // Once progress is 100 and backend is ready, start the fade-out
  useEffect(() => {
    if (progress >= 100 && isReady) {
      const fadeTimeout = setTimeout(() => {
        setIsFadingOut(true);
        const completeTimeout = setTimeout(() => {
          onComplete();
          document.body.style.overflow = 'unset';
        }, 800); // Wait for fade-out transition to finish
        return () => clearTimeout(completeTimeout);
      }, 300); // Brief hold at 100% for aesthetic satisfaction
      return () => clearTimeout(fadeTimeout);
    }
  }, [progress, isReady, onComplete]);

  // If loading takes too long (e.g. backend network lag > 4s), force complete to avoid getting stuck
  useEffect(() => {
    const forceTimeout = setTimeout(() => {
      setProgress(100);
    }, 4000);
    return () => clearTimeout(forceTimeout);
  }, []);

  return (
    <motion.div
      id="btm-splash-preloader"
      initial={{ opacity: 1 }}
      animate={{ opacity: isFadingOut ? 0 : 1 }}
      transition={{ duration: 0.6, ease: 'easeInOut' }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#030303] select-none text-stone-100 overflow-hidden"
    >
      {/* Premium ambient gold radial glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] bg-gradient-to-r from-amber-500/5 to-yellow-600/5 blur-[80px] sm:blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 translate-y-1/2 w-[300px] h-[300px] bg-gradient-to-r from-amber-500/3 to-stone-500/3 blur-[100px] rounded-full pointer-events-none" />

      {/* Decorative luxury background pattern border lines */}
      <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-amber-500/20 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-amber-500/20 to-transparent" />

      {/* Main Content Container */}
      <div className="relative flex flex-col items-center max-w-md w-full px-6 text-center z-10">
        
        {/* Animated pulsing golden ring around the logo */}
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="relative flex items-center justify-center mb-6"
        >
          {/* Pulsing outer aura */}
          <div className="absolute inset-0 rounded-full bg-amber-500/10 blur-xl animate-pulse" />
          
          {/* Logo container */}
          <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full border-2 border-amber-500 bg-[#09090b] flex items-center justify-center p-0.5 shadow-[0_0_30px_rgba(212,175,55,0.25)] overflow-hidden">
            <img
              src={logoImg}
              alt="Balochistan Trusted Mart Logo"
              className="w-full h-full object-cover rounded-full"
              referrerPolicy="no-referrer"
            />
          </div>
        </motion.div>

        {/* Brand Name with high-end luxury typography */}
        <motion.div
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="space-y-1.5 sm:space-y-2 mb-8"
        >
          <h2 className="text-xl sm:text-2xl font-bold font-display tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-600 uppercase">
            BALOCHISTAN TRUSTED MART
          </h2>
          <div className="flex items-center justify-center gap-2">
            <div className="h-[1px] w-8 bg-amber-500/30" />
            <span className="text-[10px] sm:text-xs font-mono tracking-[0.25em] text-amber-500 font-semibold uppercase">
              OFFICIAL (BTM)
            </span>
            <div className="h-[1px] w-8 bg-amber-500/30" />
          </div>
          <p className="text-[11px] sm:text-xs tracking-wider text-stone-400 font-sans italic mt-1">
            Trusted Shop • Live Better
          </p>
        </motion.div>

        {/* Progress and animation indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="w-full max-w-[260px] sm:max-w-[300px] space-y-4"
        >
          {/* Smooth custom gold linear progress bar container */}
          <div className="h-[3px] w-full bg-zinc-900 rounded-full overflow-hidden border border-amber-500/10 relative shadow-inner">
            {/* The animating gold fill */}
            <motion.div
              className="h-full bg-gradient-to-r from-amber-600 via-amber-400 to-yellow-500 rounded-full shadow-[0_0_10px_rgba(212,175,55,0.7)]"
              style={{ width: `${progress}%` }}
              transition={{ ease: 'easeOut' }}
            />
          </div>

          {/* Progress % and loading message */}
          <div className="flex flex-col items-center justify-center space-y-1">
            <span className="text-stone-300 font-mono text-xs font-medium tracking-widest">
              {Math.floor(progress)}%
            </span>
            <span className="text-[11px] tracking-wider text-amber-500/80 font-mono font-medium uppercase animate-pulse">
              Preparing Your Shopping Experience...
            </span>
          </div>
        </motion.div>
      </div>

      {/* Subtle luxury brand footer ornament */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        className="absolute bottom-8 flex flex-col items-center space-y-1"
      >
        <div className="text-[8px] font-mono tracking-[0.4em] text-stone-500 uppercase">
          SECURE ENCRYPTED GATEWAY
        </div>
        <div className="flex items-center gap-1.5 text-[8px] text-stone-600">
          <span>★</span>
          <span>★</span>
          <span>★</span>
        </div>
      </motion.div>
    </motion.div>
  );
}
