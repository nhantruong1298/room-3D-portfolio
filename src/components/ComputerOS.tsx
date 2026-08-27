import React, { useState, useEffect } from 'react';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { CVData } from '../types';
import { playSound } from '../utils/audio';

interface ComputerOSProps {
  cvData: CVData;
  onOpenCVEditor?: () => void;
  onBackToRoom: () => void;
}

const CAKE_RESUME_URL =
  'https://www.cake.me/s--3TK6cMSsMrw6KJDCIQbpNw--/nhan-truong-fde9e2';

export const ComputerOS: React.FC<ComputerOSProps> = ({ onBackToRoom }) => {
  const [currentTime, setCurrentTime] = useState('10:24 AM');
  const [currentDate, setCurrentDate] = useState('26/08/2026');
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);
  const [isSelectedIcon, setIsSelectedIcon] = useState(false);

  // Windows 7 Live System Clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        })
      );
      setCurrentDate(
        now.toLocaleDateString('en-US', {
          month: '2-digit',
          day: '2-digit',
          year: 'numeric',
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Direct Resume Link Action
  const handleOpenResume = () => {
    playSound('open');
    if (typeof window !== 'undefined') {
      window.open(CAKE_RESUME_URL, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div
      id="devos-desktop-container"
      className="absolute inset-0 z-40 flex flex-col justify-between overflow-hidden animate-fadeIn select-none font-sans"
      onClick={() => {
        if (isStartMenuOpen) setIsStartMenuOpen(false);
      }}
      style={{
        background: `radial-gradient(ellipse at 50% 35%, #0d2844 0%, #081a2e 45%, #040e1b 75%, #02060d 100%)`,
      }}
    >
      {/* ========================================================= */}
      {/* 1. SLEEK DEVELOPER WORKSPACE WALLPAPER BACKGROUND */}
      {/* ========================================================= */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Glowing radial light burst behind the Dev logo */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[550px] opacity-70"
          style={{
            background:
              'radial-gradient(circle, rgba(56, 189, 248, 0.35) 0%, rgba(14, 116, 144, 0.15) 50%, transparent 75%)',
          }}
        />

        {/* Diagonal Tech Grid / Light Rays */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            background:
              'repeating-linear-gradient(65deg, transparent, transparent 80px, rgba(56,189,248,0.1) 80px, rgba(56,189,248,0.1) 120px)',
          }}
        />

        {/* Central Developer Emblem */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[55%] flex flex-col items-center pointer-events-none select-none opacity-90">
          <div className="relative w-44 h-44 drop-shadow-[0_15px_35px_rgba(0,0,0,0.6)] flex items-center justify-center">
            <svg
              viewBox="0 0 200 200"
              className="w-full h-full filter drop-shadow-[0_0_25px_rgba(56,189,248,0.5)]"
            >
              <defs>
                <linearGradient id="devCyanGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#38bdf8" />
                  <stop offset="100%" stopColor="#0284c7" />
                </linearGradient>
                <linearGradient id="devEmeraldGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#34d399" />
                  <stop offset="100%" stopColor="#059669" />
                </linearGradient>
              </defs>

              {/* Glowing Outer Hexagon */}
              <polygon
                points="100,20 170,60 170,140 100,180 30,140 30,60"
                fill="rgba(14, 165, 233, 0.15)"
                stroke="url(#devCyanGrad)"
                strokeWidth="3.5"
                strokeLinejoin="round"
              />

              {/* Inner Accent Hexagon */}
              <polygon
                points="100,35 155,67 155,133 100,165 45,133 45,67"
                fill="none"
                stroke="rgba(52, 211, 153, 0.4)"
                strokeWidth="1.5"
                strokeDasharray="6 4"
              />

              {/* Stylized Code Brackets */}
              <path
                d="M 80,75 L 55,100 L 80,125"
                fill="none"
                stroke="#ffffff"
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M 120,75 L 145,100 L 120,125"
                fill="none"
                stroke="#ffffff"
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M 108,70 L 92,130"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="4"
                strokeLinecap="round"
              />
            </svg>
          </div>

          {/* DevOS Text Branding */}
          <div className="mt-2 text-center text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
            <p className="text-[11px] uppercase tracking-[0.25em] text-sky-200/80 font-mono mt-0.5 font-semibold">
              WORKSTATION
            </p>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. DESKTOP AREA: CLEAN ICON FOR RESUME */}
      {/* ========================================================= */}
      <div className="relative flex-1 p-6 z-20 flex flex-col justify-start items-start">
        {/* Classic Windows 7 Desktop Icon */}
        <div
          id="win7-resume-icon"
          onClick={(e) => {
            e.stopPropagation();
            setIsSelectedIcon(true);
            handleOpenResume();
          }}
          onDoubleClick={(e) => {
            e.stopPropagation();
            handleOpenResume();
          }}
          className={`group flex flex-col items-center justify-center p-2.5 rounded-lg w-24 h-28 cursor-pointer transition-all ${
            isSelectedIcon
              ? 'bg-sky-400/25 border border-sky-300/50 shadow-[inset_0_0_10px_rgba(255,255,255,0.4)]'
              : 'hover:bg-sky-400/15 hover:border hover:border-sky-300/30 border border-transparent'
          }`}
          title="Click to open Resume"
        >
          {/* Classic Adobe PDF / Document Icon with Windows 7 Shortcut Arrow */}
          <div className="relative w-14 h-14 flex items-center justify-center">
            {/* Document sheet */}
            <div className="w-11 h-14 bg-gradient-to-b from-white via-slate-100 to-slate-200 rounded-sm shadow-[0_4px_10px_rgba(0,0,0,0.4)] border border-slate-300 flex flex-col items-center justify-between p-1">
              {/* Red PDF banner */}
              <div className="w-full h-4 bg-gradient-to-r from-red-600 to-red-500 rounded-[2px] flex items-center justify-center text-[9px] font-black text-white tracking-widest shadow-inner">
                PDF
              </div>
              {/* Document lines */}
              <div className="w-full space-y-1 px-0.5">
                <div className="w-full h-[2px] bg-slate-400 rounded-full" />
                <div className="w-3/4 h-[2px] bg-slate-400 rounded-full" />
                <div className="w-5/6 h-[2px] bg-slate-400 rounded-full" />
              </div>
              {/* Bottom mini badge */}
              <div className="text-[7px] font-bold text-slate-600 uppercase font-mono">
                DOC
              </div>
            </div>

            {/* Windows 7 Shortcut Curved Arrow Overlay */}
            <div className="absolute -bottom-1 -left-1 w-5 h-5 bg-white rounded-[2px] border border-slate-400 shadow-sm flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-blue-600 fill-current">
                <path d="M14 4l-4 4h3v6c0 1.1-.9 2-2 2H6v2h5c2.2 0 4-1.8 4-4V8h3l-4-4z" />
              </svg>
            </div>
          </div>

          {/* Icon Text Label - ONLY Resume */}
          <span className="text-xs text-white font-medium text-center mt-2 px-1.5 py-0.5 rounded leading-tight drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] max-w-full truncate">
            Resume
          </span>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 3. WINDOWS 7 START MENU (CLASSIC AERO GLASS POPUP) */}
      {/* ========================================================= */}
      {isStartMenuOpen && (
        <div
          id="win7-start-menu"
          onClick={(e) => e.stopPropagation()}
          className="absolute bottom-11 left-0 z-50 w-96 rounded-t-lg bg-[#0e2746]/95 border-t border-r border-sky-400/40 shadow-[0_0_30px_rgba(0,0,0,0.8)] backdrop-blur-xl flex flex-col overflow-hidden animate-scaleUp"
        >
          {/* Top user profile header */}
          <div className="flex items-center justify-between p-3.5 bg-gradient-to-r from-sky-900/60 to-slate-900/60 border-b border-sky-500/20">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-lg bg-gradient-to-tr from-sky-400 to-blue-600 p-0.5 shadow-md">
                <div className="w-full h-full rounded-[6px] bg-slate-900 flex items-center justify-center text-xl">
                  👨‍💻
                </div>
              </div>
              <div>
                <h3 className="text-sm font-bold text-white leading-tight">
                  Truong Trong Nhan
                </h3>
                <p className="text-[11px] text-sky-300">Mobile Developer</p>
              </div>
            </div>
          </div>

          {/* Two-Column Windows 7 Menu Body */}
          <div className="flex bg-slate-950/80 p-2 gap-2 text-xs">
            {/* Left Programs list */}
            <div className="flex-1 bg-white/95 rounded p-2 text-slate-800 space-y-1 shadow-inner">
              <button
                onClick={handleOpenResume}
                className="w-full flex items-center gap-2.5 p-2 rounded hover:bg-sky-100 transition-colors text-left font-semibold text-slate-900 group cursor-pointer"
              >
                <div className="w-7 h-7 rounded bg-red-500 flex items-center justify-center text-white font-bold text-xs shadow-sm">
                  PDF
                </div>
                <div className="flex-1">
                  <div className="text-xs group-hover:text-sky-700">Resume</div>
                  <div className="text-[10px] text-slate-500">Open online resume</div>
                </div>
              </button>
            </div>

            {/* Right System links */}
            <div className="w-36 flex flex-col justify-between py-1 px-2 text-[11px] text-slate-300 space-y-2">
              <div className="space-y-1.5">
                <div className="font-semibold text-white hover:text-sky-300 cursor-pointer">
                  Documents
                </div>
                <div className="font-semibold text-white hover:text-sky-300 cursor-pointer">
                  Pictures
                </div>
                <div className="font-semibold text-white hover:text-sky-300 cursor-pointer">
                  Computer
                </div>
                <div className="font-semibold text-white hover:text-sky-300 cursor-pointer">
                  Control Panel
                </div>
              </div>

              {/* Shut down button */}
              <button
                onClick={onBackToRoom}
                className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded bg-red-900/80 hover:bg-red-800 border border-red-500/40 text-red-200 text-xs font-semibold cursor-pointer active:scale-95"
              >
                <span>Back to Room</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 4. AUTHENTIC WINDOWS 7 AERO GLASS TASKBAR */}
      {/* ========================================================= */}
      <div
        id="win7-aero-taskbar"
        className="h-10 z-40 relative flex items-center justify-between select-none shadow-[0_-2px_15px_rgba(0,0,0,0.6)]"
        style={{
          background:
            'linear-gradient(180deg, rgba(70, 130, 180, 0.55) 0%, rgba(20, 60, 100, 0.85) 50%, rgba(5, 25, 50, 0.95) 100%)',
          backdropFilter: 'blur(16px)',
          borderTop: '1px solid rgba(135, 206, 250, 0.45)',
          boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.35)',
        }}
      >
        {/* Left Side: Windows 7 Start Orb + Pinned Taskbar Apps */}
        <div className="flex items-center h-full">
          {/* Glowing DevOS Start Orb */}
          <button
            id="devos-start-orb"
            onClick={(e) => {
              e.stopPropagation();
              playSound('click');
              setIsStartMenuOpen((prev) => !prev);
            }}
            className="group relative -top-1 ml-1.5 w-11 h-11 rounded-full flex items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95 focus:outline-none"
            style={{
              background:
                'radial-gradient(circle at 35% 30%, #38bdf8 0%, #0284c7 55%, #0369a1 100%)',
              boxShadow:
                '0 0 12px rgba(56, 189, 248, 0.7), inset 0 2px 4px rgba(255, 255, 255, 0.8), inset 0 -2px 4px rgba(0, 0, 0, 0.6)',
              border: '1.5px solid rgba(255, 255, 255, 0.8)',
            }}
            title="DevOS Menu"
          >
            {/* Custom Code Brackets inside Start Orb */}
            <span className="text-white font-mono font-bold text-xs tracking-tighter drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
              &lt;/&gt;
            </span>
          </button>

          {/* Quick Launch / Pinned Taskbar Items */}
          <div className="flex items-center h-full ml-2 space-x-1">
            {/* Resume Pinned Taskbar Button */}
            <button
              onClick={handleOpenResume}
              className="flex items-center gap-1.5 px-3 h-8 rounded bg-sky-400/20 hover:bg-sky-400/40 border border-sky-300/40 text-white text-xs font-semibold shadow-inner transition-colors cursor-pointer"
              title="Click to open Resume"
            >
              <span className="w-3.5 h-3.5 bg-red-600 text-white text-[8px] font-black rounded-sm flex items-center justify-center">
                PDF
              </span>
              <span className="drop-shadow">Resume</span>
              <ExternalLink className="w-3 h-3 text-sky-200" />
            </button>
          </div>
        </div>

        {/* Right Side: Windows 7 System Tray & Aero Peek "Show Desktop" */}
        <div className="flex items-center h-full">
          {/* Notification Area Icons */}
          <div className="flex items-center space-x-2 px-2 text-slate-200 text-xs">
            {/* System Tray Arrow */}
            <span className="text-[10px] text-sky-200 hover:text-white cursor-pointer px-1">▲</span>
            {/* Network Icon */}
            <svg viewBox="0 0 24 24" className="w-4 h-4 text-sky-200 fill-current">
              <path d="M12 4C7.31 4 3.07 5.9 0 8.98L12 21 24 8.98C20.93 5.9 16.69 4 12 4z" />
            </svg>
            {/* Volume Speaker Icon */}
            <svg viewBox="0 0 24 24" className="w-4 h-4 text-sky-200 fill-current">
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
            </svg>
            {/* Action Center White Flag */}
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-white fill-current">
              <path d="M14.4 6L14 4H5v17h2v-7h5.6l.4 2h7V6z" />
            </svg>
          </div>

          {/* Windows 7 Tray Clock */}
          <div className="flex flex-col items-center justify-center px-3 h-full border-l border-sky-400/20 text-[11px] text-white font-sans leading-tight cursor-pointer hover:bg-sky-400/20 transition-colors">
            <span className="font-semibold drop-shadow">{currentTime}</span>
            <span className="text-[10px] text-sky-200 drop-shadow">{currentDate}</span>
          </div>

          {/* Windows 7 Iconic "Show Desktop" Glass Sliver at Far Right */}
          <div
            onClick={onBackToRoom}
            className="w-3.5 h-full bg-sky-300/20 hover:bg-sky-200/50 border-l border-sky-300/40 cursor-pointer transition-colors"
            title="Show Desktop / Back to Room"
          />
        </div>
      </div>

      {/* ========================================================= */}
      {/* 5. YELLOW-ON-NAVY ROUND BACK BUTTON AT BOTTOM-LEFT */}
      {/* ========================================================= */}
      <button
        id="btn-back-to-room"
        onClick={() => {
          playSound('close');
          onBackToRoom();
        }}
        className="absolute bottom-16 left-5 z-50 w-14 h-14 rounded-full bg-[#0c2444] hover:bg-[#091b33] border-2 border-[#163a69] flex items-center justify-center text-amber-400 shadow-2xl shadow-black/80 transition-transform active:scale-90 cursor-pointer group"
        title="Back to 3D Room"
      >
        <ArrowLeft className="w-7 h-7 stroke-[3] group-hover:-translate-x-0.5 transition-transform" />
      </button>
    </div>
  );
};
