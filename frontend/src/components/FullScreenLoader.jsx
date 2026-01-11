import React from "react";

export default function FullScreenLoader({ text = "Loading..." }) {
  return (
    // 1. Background: Light, semi-transparent white with blur (Glassmorphism)
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/90 backdrop-blur-sm transition-all duration-300">
      
      <div className="flex flex-col items-center gap-4">

        {/* 2. Professional Spinner */}
        <div className="relative flex items-center justify-center">
          {/* Static Ring (Track) */}
          <div className="w-12 h-12 rounded-full border-4 border-slate-200"></div>
          
          {/* Spinning Ring (Indicator) */}
          <div className="absolute top-0 left-0 w-12 h-12 rounded-full border-4 border-slate-900 border-t-transparent border-r-transparent animate-spin"></div>
        </div>

        {/* 3. Text: Simple, dark, and subtle pulse */}
        <p className="text-slate-500 font-semibold text-sm tracking-widest uppercase animate-pulse">
          {text}
        </p>

      </div>
    </div>
  );
}