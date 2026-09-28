import React, { useState, useRef } from 'react';
import { AppDefinition, IconPackId, CustomAppIconOverride } from '../../types/launcher';
import { ICON_PACKS } from '../../data/customizationData';
import { solarSound } from '../../utils/solarSound';

interface AppIcon3DProps {
  app: AppDefinition;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  customScale?: number; // 75 to 130 (%)
  showLabel?: boolean;
  tiltEnabled?: boolean;
  soundEnabled?: boolean;
  iconPack?: IconPackId;
  customOverride?: CustomAppIconOverride;
  textColor?: string;
  isDark?: boolean;
  onClick?: () => void;
}

export const AppIcon3D: React.FC<AppIcon3DProps> = ({
  app,
  size = 'md',
  customScale,
  showLabel = true,
  tiltEnabled = true,
  soundEnabled = true,
  iconPack = 'ios-glass',
  customOverride,
  textColor,
  isDark = false,
  onClick,
}) => {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const iconRef = useRef<HTMLDivElement>(null);

  // Look up icon pack style for this app
  const packDef = ICON_PACKS.find((p) => p.id === iconPack);
  const packStyle = packDef?.appStyles[app.id];

  const displayName = customOverride?.name || app.name;
  const finalGradient = customOverride?.customGradient || packStyle?.gradient || app.iconBgGradient;
  const finalAccent = customOverride?.accentColor || packStyle?.accent || app.accentColor;
  const customEmoji = customOverride?.glyphEmoji || (iconPack !== 'ios-glass' ? packStyle?.emoji : undefined);
  const customImgUrl = customOverride?.customIconUrl;

  // Preset sizes in px (base: 62px)
  const presetSizes: Record<string, number> = {
    xs: 44,
    sm: 52,
    md: 62,
    lg: 70,
    xl: 78,
  };

  // Determine actual pixel dimension
  const basePx = presetSizes[size] || 62;
  const pixelSize = customScale ? Math.round(62 * (customScale / 100)) : basePx;
  const scaleRatio = pixelSize / 62;
  const labelFontSize = Math.max(9.5, Math.min(13, Math.round(11 * scaleRatio * 10) / 10));
  const labelMaxWidth = Math.max(54, Math.round(pixelSize * 1.25));

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!tiltEnabled || !iconRef.current) return;
    const rect = iconRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const maxTilt = 18;
    setTilt({
      x: (y / (rect.height / 2)) * -maxTilt,
      y: (x / (rect.width / 2)) * maxTilt,
    });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  };

  const handleClick = () => {
    solarSound.playTap(soundEnabled);
    if (onClick) {
      onClick();
    }
  };

  // Render high-fidelity iOS-style icon artwork with 3D tactile glass realism
  const renderIOSIconArtwork = () => {
    switch (app.id) {
      case 'suntrack':
        // Authentic iOS Weather icon with 3D radiant sun behind realistic volumetric cloud
        return (
          <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
            {/* Ambient Sun Corona */}
            <div className="absolute top-2 right-2 w-9 h-9 rounded-full bg-amber-400/40 blur-md pointer-events-none" />
            
            {/* Radiant 3D Sun Sphere */}
            <div className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-gradient-to-tr from-amber-500 via-amber-300 to-yellow-100 shadow-[0_0_16px_rgba(251,191,36,0.9),inset_0_2px_4px_rgba(255,255,255,0.8)] border border-amber-200/90 flex items-center justify-center">
              <div className="w-3 h-1.5 bg-white rounded-full opacity-90 blur-[0.4px] -translate-y-1" />
            </div>

            {/* Volumetric 3D iOS Cumulus Cloud with depth shading */}
            <div className="absolute bottom-2 left-2 z-10 filter drop-shadow-[0_4px_10px_rgba(0,0,0,0.3)]">
              <div className="relative w-10 h-6">
                <div className="absolute bottom-0 left-0 w-10 h-4 bg-gradient-to-t from-slate-100 via-white to-white rounded-full border border-white shadow-inner" />
                <div className="absolute bottom-1.5 left-1 w-4 h-4 bg-gradient-to-b from-white via-white to-slate-100 rounded-full border-t border-l border-white" />
                <div className="absolute bottom-2 left-3 w-5.5 h-5.5 bg-gradient-to-b from-white via-white to-slate-200 rounded-full border-t border-white" />
                <div className="absolute bottom-1 right-1.5 w-4 h-4 bg-gradient-to-b from-white via-white to-slate-100 rounded-full border-t border-r border-white" />
                {/* Cloud specular highlight */}
                <div className="absolute top-1 left-3.5 w-3.5 h-1 bg-white rounded-full blur-[0.3px]" />
              </div>
            </div>
          </div>
        );

      case 'solarcam':
        // Authentic iOS Camera icon with precision lens & flash
        return (
          <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-b from-slate-200 via-slate-300 to-slate-400">
            {/* Metallic top flash sensor */}
            <div className="absolute top-1.5 right-2.5 w-2 h-2 rounded-full bg-amber-400/95 border border-amber-600/50 shadow-xs flex items-center justify-center">
              <div className="w-0.5 h-0.5 rounded-full bg-white shadow-xs" />
            </div>

            {/* Outer Knurled Lens Barrel */}
            <div className="relative w-10 h-10 rounded-full bg-gradient-to-b from-slate-700 via-slate-800 to-slate-950 p-[2px] shadow-[0_4px_8px_rgba(0,0,0,0.45)] border border-slate-500">
              {/* Stepped aperture ring */}
              <div className="w-full h-full rounded-full bg-slate-950 border border-amber-400/60 p-[2px] flex items-center justify-center">
                {/* Sapphire Glass Element with chromatic reflection */}
                <div className="relative w-full h-full rounded-full bg-gradient-to-tr from-cyan-950 via-slate-950 to-indigo-950 overflow-hidden flex items-center justify-center shadow-inner">
                  {/* Iridescent optics glare */}
                  <div className="absolute -top-1 -left-1 w-6 h-4 bg-gradient-to-br from-cyan-300/70 via-purple-300/40 to-transparent rotate-45 blur-[0.4px]" />
                  <div className="absolute bottom-0 right-0 w-4 h-3 bg-gradient-to-tl from-amber-400/60 to-transparent rounded-full" />
                  {/* Optical Pupil */}
                  <div className="w-3 h-3 rounded-full bg-black border border-cyan-400/50 shadow-inner flex items-center justify-center">
                    <div className="w-1 h-1 rounded-full bg-white shadow-[0_0_3px_#fff]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'solarbeam':
        // Authentic iOS Messages bubble with glass highlight
        return (
          <div className="relative w-full h-full flex items-center justify-center">
            {/* 3D Glass Chat Bubble */}
            <div className="relative w-[38px] h-[30px] bg-white rounded-[16px] shadow-[0_4px_12px_rgba(0,0,0,0.22)] flex items-center justify-center border border-white">
              {/* Bubble pointer tail */}
              <div className="absolute -bottom-1 left-2.5 w-3.5 h-3.5 bg-white rounded-bl-[4px] rotate-45 shadow-xs" />
              {/* Inner glossy reflection */}
              <div className="absolute inset-0 rounded-[16px] bg-gradient-to-b from-white via-white/95 to-emerald-50/50 pointer-events-none" />
              {/* Specular sheen */}
              <div className="absolute top-1 left-2.5 w-6 h-1.5 bg-white rounded-full blur-[0.4px]" />
              {/* 3 Speech Dots */}
              <div className="relative z-10 flex gap-1.5 items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 shadow-xs" />
                <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 shadow-xs" />
                <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 shadow-xs" />
              </div>
            </div>
          </div>
        );

      case 'solarbrowser':
        // Authentic iOS Safari compass rose on white squircle
        return (
          <div className="relative w-full h-full flex items-center justify-center bg-white">
            {/* Compass Dial */}
            <div className="relative w-11 h-11 rounded-full bg-gradient-to-b from-slate-50 via-white to-slate-100 border border-slate-200/90 shadow-inner flex items-center justify-center">
              {/* 72 Tick marks ring */}
              <svg className="absolute inset-0 w-full h-full text-slate-300 pointer-events-none" viewBox="0 0 44 44">
                <circle cx="22" cy="22" r="19" stroke="currentColor" strokeWidth="1" strokeDasharray="1.5 2.5" />
                <circle cx="22" cy="22" r="16" stroke="rgba(245,158,11,0.3)" strokeWidth="0.5" />
              </svg>

              {/* 3D Faceted Compass Needle */}
              <div className="relative w-2.5 h-9 flex flex-col items-center justify-between transform rotate-45 drop-shadow-[0_2px_5px_rgba(0,0,0,0.35)]">
                {/* Red North Half */}
                <div className="w-0 h-0 border-x-[5px] border-x-transparent border-b-[18px] border-b-rose-500 relative">
                  <div className="absolute top-0 right-0 w-[5px] h-[18px] bg-rose-700 opacity-60" style={{ clipPath: 'polygon(100% 100%, 0 0, 100% 0)' }} />
                </div>
                {/* White South Half */}
                <div className="w-0 h-0 border-x-[5px] border-x-transparent border-t-[18px] border-t-white relative">
                  <div className="absolute top-0 right-0 w-[5px] h-[18px] bg-slate-400 opacity-60" style={{ clipPath: 'polygon(100% 0, 0 100%, 100% 100%)' }} />
                </div>
              </div>

              {/* Center Brass Cap */}
              <div className="absolute w-2 h-2 rounded-full bg-gradient-to-tr from-amber-600 to-yellow-200 border border-white shadow-xs z-10" />
            </div>
          </div>
        );

      case 'solarpulse':
        // Authentic Apple Music style 3D white glossy note on vibrant radiant gradient
        return (
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Apple Music 3D Double Note */}
            <svg
              className="w-8 h-8 text-white filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.3)]"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h6V3h-8z" />
            </svg>
            {/* Specular Note Sheen */}
            <div className="absolute top-3 left-4 w-4 h-1.5 bg-white/50 rounded-full blur-[0.4px]" />
          </div>
        );

      case 'solarcore':
        // Authentic iOS Settings machined aluminum gear
        return (
          <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-b from-slate-200 via-slate-300 to-slate-400">
            {/* Machined Metal Gear */}
            <div className="relative w-11 h-11 flex items-center justify-center drop-shadow-[0_3px_6px_rgba(0,0,0,0.3)]">
              <svg className="w-11 h-11 text-slate-700" viewBox="0 0 40 40" fill="currentColor">
                <path d="M20 13a7 7 0 100 14 7 7 0 000-14zm15.5 5.5l-2.4-.6c-.2-.7-.4-1.4-.8-2l1.4-2.1c.4-.6.3-1.4-.2-1.9l-2-2c-.5-.5-1.3-.6-1.9-.2l-2.1 1.4c-.6-.4-1.3-.6-2-.8l-.6-2.4c-.2-.7-.8-1.2-1.5-1.2h-2.8c-.7 0-1.3.5-1.5 1.2l-.6 2.4c-.7.2-1.4.4-2 .8l-2.1-1.4c-.6-.4-1.4-.3-1.9.2l-2 2c-.5.5-.6 1.3-.2 1.9l1.4 2.1c-.4.6-.6 1.3-.8 2l-2.4.6c-.7.2-1.2.8-1.2 1.5v2.8c0 .7.5 1.3 1.2 1.5l2.4.6c.2.7.4 1.4.8 2l-1.4 2.1c-.4.6-.3 1.4.2 1.9l2 2c.5.5 1.3.6 1.9.2l2.1-1.4c.6.4 1.3.6 2 .8l.6 2.4c.2.7.8 1.2 1.5 1.2h2.8c.7 0 1.3-.5 1.5-1.2l.6-2.4c.7-.2 1.4-.4 2-.8l2.1 1.4c.6.4 1.4.3 1.9-.2l2-2c.5-.5.6-1.3.2-1.9l-1.4-2.1c.4-.6.6-1.3.8-2l2.4-.6c.7-.2 1.2-.8 1.2-1.5v-2.8c0-.7-.5-1.3-1.2-1.5z" />
              </svg>
              {/* Concentric axle */}
              <div className="absolute w-5 h-5 rounded-full bg-gradient-to-tr from-slate-300 via-slate-100 to-slate-200 border border-slate-400 shadow-inner flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-700 shadow-xs" />
              </div>
            </div>
          </div>
        );

      case 'solarcal':
        // Authentic iOS Calendar icon with dynamic live day & numeral
        return (
          <div className="relative w-full h-full flex flex-col justify-between bg-white overflow-hidden shadow-inner">
            {/* Top Red Header */}
            <div className="h-4.5 bg-gradient-to-r from-red-500 via-rose-500 to-red-600 flex items-center justify-center shadow-xs">
              <span className="text-[8px] font-bold text-white tracking-widest uppercase">
                SUN
              </span>
            </div>
            {/* Day Numeral */}
            <div className="flex-1 flex items-center justify-center pb-0.5">
              <span className="font-display font-semibold text-slate-900 text-2xl tracking-tighter leading-none">
                27
              </span>
            </div>
          </div>
        );

      case 'solartime':
        // Authentic iOS Clock face with 12 hour tick marks and ticking hands
        return (
          <div className="relative w-full h-full flex items-center justify-center bg-white">
            <div className="relative w-11 h-11 rounded-full bg-white border border-slate-200 shadow-inner flex items-center justify-center">
              {/* 12, 3, 6, 9 hour ticks */}
              <div className="absolute top-1 w-0.5 h-1.5 bg-slate-800 rounded-full" />
              <div className="absolute right-1 h-0.5 w-1.5 bg-slate-800 rounded-full" />
              <div className="absolute bottom-1 w-0.5 h-1.5 bg-slate-800 rounded-full" />
              <div className="absolute left-1 h-0.5 w-1.5 bg-slate-800 rounded-full" />

              {/* Hour & Minute Hands */}
              <div className="absolute w-[2px] h-3 bg-slate-900 rounded-full -top-1 origin-bottom transform rotate-60 shadow-xs" />
              <div className="absolute w-[1.5px] h-4 bg-slate-800 rounded-full -top-2 origin-bottom transform -rotate-40 shadow-xs" />

              {/* Orange Sweeping Second Hand */}
              <div className="absolute w-[1px] h-4.5 bg-amber-500 rounded-full -top-2.5 origin-bottom transform rotate-140 shadow-xs" />
              <div className="w-1.5 h-1.5 rounded-full bg-amber-600 z-10 shadow-xs" />
            </div>
          </div>
        );

      case 'solarnav':
        // Authentic iOS Maps street grid with highway badge & 3D pin
        return (
          <div className="relative w-full h-full overflow-hidden bg-gradient-to-tr from-emerald-500 via-amber-200 to-sky-400">
            {/* Stylized road grid */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 60 60" fill="none">
              <path d="M-10 20 L70 45" stroke="#FFFFFF" strokeWidth="8" />
              <path d="M-10 20 L70 45" stroke="#FBBF24" strokeWidth="4" />
              <path d="M25 -5 L35 65" stroke="#FFFFFF" strokeWidth="7" />
              <path d="M25 -5 L35 65" stroke="#F97316" strokeWidth="3" />
            </svg>
            {/* 3D Red Location Pin */}
            <div className="absolute top-3.5 right-4 z-10 flex flex-col items-center filter drop-shadow-[0_4px_6px_rgba(0,0,0,0.35)]">
              <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-red-600 to-rose-400 border border-white flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-white" />
              </div>
              <div className="w-0 h-0 border-x-[3px] border-x-transparent border-t-[5px] border-t-red-600 -mt-0.5" />
            </div>
          </div>
        );

      case 'solarenergy':
        // Authentic iOS Battery Widget / Capsule
        return (
          <div className="relative w-full h-full flex items-center justify-center bg-slate-900">
            {/* Outer Battery Capsule */}
            <div className="relative w-10 h-5.5 rounded-lg border-2 border-white/90 p-0.5 flex items-center">
              {/* Battery Terminal Tip */}
              <div className="absolute -right-1.5 w-1 h-2.5 bg-white/90 rounded-r-sm" />
              {/* Green / Golden Energy Fill */}
              <div className="w-4/5 h-full rounded-[3px] bg-gradient-to-r from-emerald-500 via-emerald-400 to-amber-400 flex items-center justify-center shadow-xs">
                {/* Lightning Bolt */}
                <svg className="w-3 h-3 text-white fill-white drop-shadow" viewBox="0 0 24 24">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                </svg>
              </div>
            </div>
          </div>
        );

      case 'solarcalc':
        // Authentic iOS Calculator icon with 4 colored round keys
        return (
          <div className="relative w-full h-full flex flex-col justify-between p-2.5 bg-slate-950">
            {/* Mini LCD Top */}
            <div className="h-2 w-full bg-slate-900 rounded-sm border border-slate-800 flex items-center justify-end px-1">
              <span className="text-[6px] font-mono text-white">0</span>
            </div>
            {/* 4 Apple Calculator round buttons */}
            <div className="grid grid-cols-2 gap-1.5 place-items-center">
              <div className="w-4.5 h-4.5 rounded-full bg-slate-300 text-slate-900 text-[8px] font-bold flex items-center justify-center shadow-xs">
                C
              </div>
              <div className="w-4.5 h-4.5 rounded-full bg-amber-500 text-white text-[9px] font-bold flex items-center justify-center shadow-xs">
                ÷
              </div>
              <div className="w-4.5 h-4.5 rounded-full bg-slate-700 text-white text-[8px] font-bold flex items-center justify-center shadow-xs">
                7
              </div>
              <div className="w-4.5 h-4.5 rounded-full bg-amber-500 text-white text-[9px] font-bold flex items-center justify-center shadow-xs">
                =
              </div>
            </div>
          </div>
        );

      case 'solarnotes':
        // Authentic iOS Notes legal pad with yellow textured band & paper lines
        return (
          <div className="relative w-full h-full flex flex-col bg-white overflow-hidden shadow-inner">
            {/* Top Yellow Leather Header */}
            <div className="h-3.5 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 border-b border-amber-500/40 flex items-center justify-center">
              <div className="w-full border-b border-dashed border-amber-600/40" />
            </div>
            {/* Lined Paper Body */}
            <div className="flex-1 p-1.5 space-y-1 bg-[linear-gradient(to_bottom,transparent_9px,#e2e8f0_10px)] bg-[size:100%_10px]">
              <div className="h-0.5 w-3/4 bg-amber-700/50 rounded-full" />
              <div className="h-0.5 w-1/2 bg-amber-700/40 rounded-full" />
              <div className="h-0.5 w-2/3 bg-amber-700/40 rounded-full" />
            </div>
          </div>
        );

      case 'solwellness':
        // Authentic Apple Mindfulness / Health breathing flower
        return (
          <div className="relative w-full h-full flex items-center justify-center bg-white overflow-hidden">
            {/* Overlapping translucent flower petals */}
            <div className="relative w-10 h-10 flex items-center justify-center animate-solar-pulse">
              {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
                <div
                  key={deg}
                  className="absolute w-4 h-8 rounded-full opacity-60 mix-blend-multiply"
                  style={{
                    background: 'linear-gradient(to bottom, #F472B6, #FBBF24)',
                    transform: `rotate(${deg}deg) translateY(-4px)`,
                  }}
                />
              ))}
              <div className="w-2.5 h-2.5 rounded-full bg-white shadow-xs z-10" />
            </div>
          </div>
        );

      case 'solarvault':
        // Authentic Apple Photos flower petal wheel on white squircle
        return (
          <div className="relative w-full h-full flex items-center justify-center bg-white">
            <div className="relative w-9 h-9 flex items-center justify-center">
              {[
                { deg: 0, color: '#38BDF8' },
                { deg: 45, color: '#818CF8' },
                { deg: 90, color: '#C084FC' },
                { deg: 135, color: '#F472B6' },
                { deg: 180, color: '#FB7185' },
                { deg: 225, color: '#FB923C' },
                { deg: 270, color: '#FBBF24' },
                { deg: 315, color: '#34D399' },
              ].map((p) => (
                <div
                  key={p.deg}
                  className="absolute w-2.5 h-4.5 rounded-full shadow-xs"
                  style={{
                    backgroundColor: p.color,
                    transform: `rotate(${p.deg}deg) translateY(-7px)`,
                  }}
                />
              ))}
              <div className="w-2 h-2 rounded-full bg-white shadow-xs z-10" />
            </div>
          </div>
        );

      case 'solarstudio':
        // Authentic iOS App Store 'A' monogram of overlapping translucent acrylic tools
        return (
          <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-b from-sky-400 via-blue-500 to-indigo-600">
            {/* 3D Overlapping Stylized 'A' */}
            <div className="relative w-9 h-9 flex items-center justify-center drop-shadow-[0_2px_4px_rgba(0,0,0,0.25)]">
              {/* Left Bar (Pencil) */}
              <div className="absolute w-2 h-8 rounded-full bg-white shadow-xs transform -rotate-25 origin-top -translate-x-1" />
              {/* Right Bar (Ruler) */}
              <div className="absolute w-2 h-8 rounded-full bg-white shadow-xs transform rotate-25 origin-top translate-x-1" />
              {/* Cross Bar (Brush) */}
              <div className="absolute w-8 h-2 rounded-full bg-white shadow-xs top-4.5" />
            </div>
          </div>
        );

      case 'solararcade':
        // Authentic Apple Arcade ruby-amber handheld controller
        return (
          <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-tr from-rose-600 via-orange-500 to-amber-400">
            {/* 3D Translucent Gamepad */}
            <div className="relative w-10 h-7 rounded-[14px] bg-white/30 backdrop-blur-sm border border-white/60 shadow-[0_3px_6px_rgba(0,0,0,0.25)] p-1 flex items-center justify-between">
              {/* D-Pad */}
              <div className="relative w-3.5 h-3.5 text-white flex items-center justify-center">
                <div className="w-3.5 h-1 bg-white rounded-xs absolute" />
                <div className="w-1 h-3.5 bg-white rounded-xs absolute" />
              </div>
              {/* Action buttons */}
              <div className="flex flex-col gap-0.5 items-end">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-200 shadow-xs" />
                <div className="w-1.5 h-1.5 rounded-full bg-rose-200 shadow-xs" />
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="w-7 h-7 rounded-full bg-white/80 shadow flex items-center justify-center">
            <span className="text-amber-600 font-bold">☀️</span>
          </div>
        );
    }
  };

  return (
    <div
      ref={iconRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onClick={handleClick}
      className="group relative flex flex-col items-center cursor-pointer select-none touch-manipulation focus:outline-none"
      style={{
        perspective: '700px',
      }}
    >
      {/* 3D Colored Ambient Shadow */}
      <div
        className="absolute inset-0 rounded-[22.5%] transition-all duration-300 pointer-events-none"
        style={{
          boxShadow: isHovered
            ? `0 14px 28px -4px ${finalAccent}55, 0 8px 14px -3px rgba(0,0,0,0.25)`
            : `0 8px 18px -4px ${finalAccent}40, 0 4px 8px -2px rgba(0,0,0,0.15)`,
          transform: isHovered ? 'scale(1.05)' : 'scale(1)',
        }}
      />

      {/* iOS Icon Container with true squircle curvature, bevels, and dynamic 3D physics */}
      <div
        className={`relative ios-icon-surface transition-transform duration-150 ease-out flex items-center justify-center shrink-0 ${
          iconPack === 'neon-cyber'
            ? 'shadow-[0_0_15px_rgba(56,189,248,0.35)]'
            : iconPack === 'golden-solstice'
            ? 'shadow-[0_0_18px_rgba(245,158,11,0.45)]'
            : ''
        }`}
        style={{
          width: `${pixelSize}px`,
          height: `${pixelSize}px`,
          background: finalGradient,
          borderColor:
            iconPack === 'neon-cyber'
              ? finalAccent
              : iconPack === 'golden-solstice'
              ? '#f59e0b'
              : undefined,
          borderWidth: iconPack === 'neon-cyber' || iconPack === 'golden-solstice' ? '1.5px' : undefined,
          transform: isPressed
            ? 'scale(0.88) translateZ(-8px)'
            : isHovered
            ? `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale3d(1.08, 1.08, 1.08) translateZ(10px)`
            : 'rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Render Vector Icon Artwork or Custom Image or Themed Emoji with proportional scale */}
        <div
          className="relative z-10 w-full h-full flex items-center justify-center overflow-hidden rounded-[22.5%]"
          style={{
            transform: isHovered ? `scale(${scaleRatio}) translateZ(12px)` : `scale(${scaleRatio}) translateZ(5px)`,
            transformOrigin: 'center center',
            transition: 'transform 0.15s ease-out',
          }}
        >
          {customImgUrl ? (
            <img
              src={customImgUrl}
              alt={displayName}
              className="w-full h-full object-cover rounded-[22.5%]"
            />
          ) : customEmoji ? (
            <div className="flex items-center justify-center text-3xl select-none filter drop-shadow-md">
              {customEmoji}
            </div>
          ) : (
            renderIOSIconArtwork()
          )}
        </div>

        {/* Authentic iOS Curved Glass Specular Sheen that glides with tilt */}
        <div
          className="ios-icon-sheen transition-transform duration-150"
          style={{
            opacity: isHovered ? 0.95 : 0.72,
            transform: `translate(${tilt.y * 0.8}px, ${tilt.x * -0.8}px)`,
          }}
        />

        {/* Lateral Refractive Glass Prism Highlights (Edge glints) */}
        <div className="absolute inset-0 rounded-[22.5%] pointer-events-none border-t border-l border-white/80 shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.85)] z-20" />

        {/* Ambient bottom shadow vignette */}
        <div className="absolute bottom-0 inset-x-0 h-1/3 bg-gradient-to-t from-black/20 to-transparent pointer-events-none z-15" />
      </div>

      {/* Floating 3D iOS Notification Badge */}
      {typeof app.badge === 'number' && app.badge > 0 && (
        <div
          className="absolute -top-1 -right-1 z-30 min-w-5 h-5 px-1.5 rounded-full bg-rose-500 text-white font-mono text-[10px] font-bold flex items-center justify-center border-1.5 border-white shadow-md animate-pulse"
          style={{
            transform: isHovered ? 'translateZ(24px) scale(1.1)' : 'translateZ(10px)',
          }}
        >
          {app.badge}
        </div>
      )}

      {/* iOS Typography App Label with dynamic font size and adaptive dark mode contrast */}
      {showLabel && (
        <span
          className={`mt-1.5 text-center font-[500] tracking-[-0.01em] transition-colors duration-150 truncate ${
            textColor
              ? ''
              : isDark
              ? 'text-slate-100 drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]'
              : 'text-slate-800 drop-shadow-[0_1px_1.5px_rgba(255,255,255,0.9)]'
          }`}
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: `${labelFontSize}px`,
            maxWidth: `${labelMaxWidth}px`,
            color: textColor && textColor !== 'currentColor' ? textColor : undefined,
          }}
        >
          {displayName}
        </span>
      )}
    </div>
  );
};
