import React from 'react';
import { AppDefinition, IconPackId, CustomAppIconOverride } from '../../types/launcher';
import { AppIcon3D } from '../icons/AppIcon3D';
import { LayoutGrid } from 'lucide-react';
import { solarSound } from '../../utils/solarSound';

interface GlassDockProps {
  dockApps: AppDefinition[];
  soundEnabled: boolean;
  tiltEnabled: boolean;
  iconScale?: number;
  iconPack?: IconPackId;
  customAppIcons?: Record<string, CustomAppIconOverride>;
  isDark?: boolean;
  onLaunchApp: (app: AppDefinition) => void;
  onOpenAppDrawer: () => void;
}

export const GlassDock: React.FC<GlassDockProps> = ({
  dockApps,
  soundEnabled,
  tiltEnabled,
  iconScale = 100,
  iconPack = 'ios-glass',
  customAppIcons = {},
  isDark = false,
  onLaunchApp,
  onOpenAppDrawer,
}) => {
  // Clamped dock scale so it never overflows the horizontal dock pill
  const dockScale = Math.max(78, Math.min(114, iconScale));
  const dockButtonPx = Math.round(60 * (dockScale / 100));

  return (
    <div className="w-full px-4 pb-3 pt-0 flex justify-center z-20">
      {/* Floating Apple Liquid Glass Dock */}
      <div className="relative glass-dock rounded-[34px] px-3.5 py-2.5 flex items-center justify-between max-w-[365px] w-full transition-all duration-300">
        {/* Specular Top Rim Highlight */}
        <div className="absolute top-0 inset-x-8 h-[1px] bg-gradient-to-r from-transparent via-white/90 to-transparent pointer-events-none" />

        {/* 4 Primary Dock Apps */}
        {dockApps.map((app) => (
          <div key={app.id} className="relative group flex flex-col items-center">
            {/* Mirror Glass Floor Reflection */}
            <div className="dock-reflection">
              <AppIcon3D
                app={app}
                customScale={dockScale}
                showLabel={false}
                tiltEnabled={false}
                soundEnabled={false}
                iconPack={iconPack}
                customOverride={customAppIcons[app.id]}
                isDark={isDark}
              />
            </div>

            {/* Main 3D Icon */}
            <AppIcon3D
              app={app}
              customScale={dockScale}
              showLabel={false}
              tiltEnabled={tiltEnabled}
              soundEnabled={soundEnabled}
              iconPack={iconPack}
              customOverride={customAppIcons[app.id]}
              isDark={isDark}
              onClick={() => onLaunchApp(app)}
            />
          </div>
        ))}

        {/* App Drawer Pill Button */}
        <div className="relative group flex flex-col items-center">
          <button
            onClick={() => {
              solarSound.playTap(soundEnabled);
              onOpenAppDrawer();
            }}
            style={{
              width: `${dockButtonPx}px`,
              height: `${dockButtonPx}px`,
            }}
            className="ios-icon-surface bg-gradient-to-b from-white/95 via-slate-100 to-slate-200/90 flex flex-col items-center justify-center hover:scale-105 active:scale-90 transition-all focus:outline-none group shadow-md shrink-0 cursor-pointer"
            title="Open App Drawer (All Apps)"
          >
            <div className="grid grid-cols-2 gap-1 p-1">
              <span className="w-2.5 h-2.5 rounded-[4px] bg-amber-500 shadow-xs" />
              <span className="w-2.5 h-2.5 rounded-[4px] bg-sky-500 shadow-xs" />
              <span className="w-2.5 h-2.5 rounded-[4px] bg-emerald-500 shadow-xs" />
              <span className="w-2.5 h-2.5 rounded-[4px] bg-rose-500 shadow-xs" />
            </div>
            {/* iOS Specular Sheen */}
            <div className="ios-icon-sheen opacity-70" />
          </button>
        </div>
      </div>
    </div>
  );
};
