/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  AppDefinition,
  SolarState,
  NotificationItem,
  NoteItem,
  CustomAppIconOverride,
  BootAnimationId,
  ThemePreset,
} from './types/launcher';
import { APPS_DATA, INITIAL_NOTIFICATIONS, INITIAL_NOTES } from './data/appsData';
import { WALLPAPERS_COLLECTION, FACTORY_DEFAULT_THEME } from './data/customizationData';
import { StatusBar } from './components/launcher/StatusBar';
import { HomeScreen } from './components/launcher/HomeScreen';
import { GlassDock } from './components/launcher/GlassDock';
import { AppDrawer } from './components/launcher/AppDrawer';
import { ControlCenter } from './components/launcher/ControlCenter';
import { NotificationCenter } from './components/launcher/NotificationCenter';
import { IconResizerModal } from './components/launcher/IconResizerModal';
import { VisualCustomizerModal } from './components/launcher/VisualCustomizerModal';
import { GestureBar } from './components/launcher/GestureBar';
import { AppWindow } from './components/apps/AppWindow';
import { DeviceFrame } from './components/frame/DeviceFrame';
import { LockScreen } from './components/system/LockScreen';
import { AlwaysOnDisplay } from './components/system/AlwaysOnDisplay';
import { BootSimulator } from './components/system/BootSimulator';
import { solarSound } from './utils/solarSound';

export default function App() {
  const [apps, setApps] = useState<AppDefinition[]>(APPS_DATA);
  const [activeApp, setActiveApp] = useState<AppDefinition | null>(null);
  const [activeDrawer, setActiveDrawer] = useState(false);
  const [activeControlCenter, setActiveControlCenter] = useState(false);
  const [activeNotifications, setActiveNotifications] = useState(false);
  const [activeIconResizer, setActiveIconResizer] = useState(false);
  const [activeVisualCustomizer, setActiveVisualCustomizer] = useState(false);
  const [customizerInitialTab, setCustomizerInitialTab] = useState<
    'presets' | 'store' | 'diy' | 'ai' | 'sounds' | 'icons' | 'wallpapers' | 'system' | 'lockscreen' | 'aod' | 'boot' | 'performance' | 'fonts' | 'theme'
  >('presets');
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [notes, setNotes] = useState<NoteItem[]>(INITIAL_NOTES);
  const [wallpaper, setWallpaper] = useState<string>('golden');

  // Deep System State
  const [isLocked, setIsLocked] = useState(false);
  const [isAOD, setIsAOD] = useState(false);
  const [isBooting, setIsBooting] = useState(false);

  // Core Solar State
  const [solarState, setSolarState] = useState<SolarState>({
    timeHours: 14.5, // 2:30 PM
    sunPosition: 65, // 65% arc
    timeOfDay: 'golden_hour',
    weatherCondition: 'Sunny',
    temperature: 26,
    uvIndex: 8,
    solarWattage: 840,
    solarCharging: false,
    batteryLevel: 86,
    brightness: 85,
    volume: 70,
    glassTheme: 'golden',
    glassBlur: 24,
    iconTilt3D: true,
    iconScale: 100,
    iconSizePreset: 'md',
    showIconLabels: true,
    soundEnabled: true,
    wifiEnabled: true,
    bluetoothEnabled: true,
    flashlightEnabled: false,
    solarBeamMode: true,

    // UI & Visual Customization Defaults
    themeMode: 'light',
    systemFont: 'sf-pro',
    systemFontSize: 'standard',
    systemTextColor: 'adaptive',
    activeIconPack: 'ios-glass',
    customAppIcons: {},
    parallaxEnabled: true,
    parallaxIntensity: 1.5,
    wallpaperAutoCycle: false,
    wallpaperCycleIntervalSec: 20,

    // Deep System Integration Defaults
    statusBarStyle: 'ios-classic',
    batteryStyle: 'capsule-outside',
    signalStyle: 'bars',
    clockPosition: 'left',
    controlCenterAccent: 'amber',
    notificationCardStyle: 'glass-blur',
    lockClockStyle: 'ios-depth',
    lockWidgets: ['weather', 'battery', 'golden-hour'],
    aodEnabled: true,
    aodTheme: 'eclipse-ring',
    aodCustomText: 'SolOS 3.5 · Stay Golden',
    bootAnimation: 'solar-flare',

    // Lightweight Performance, Battery & Ad-Free Defaults
    performanceMode: 'balanced',
    batterySaver: false,
    reduceMotion: false,
    ramUsageMb: 1180,
    maxRamMb: 6144,
    adFreeVerified: true,

    // Sound Packs & Audio Customization
    activeSoundPack: 'solar-harmonix',
    typingSoundsEnabled: true,
  });

  // Calculate is Dark Mode active for system-wide cascades
  const isDarkMode =
    solarState.themeMode === 'dark' ||
    (solarState.themeMode === 'auto' &&
      (solarState.sunPosition > 82 || solarState.sunPosition < 15));

  // Auto-changing wallpaper loop (Rojoana Naye)
  useEffect(() => {
    if (!solarState.wallpaperAutoCycle) return;
    const interval = setInterval(() => {
      setWallpaper((current) => {
        const idx = WALLPAPERS_COLLECTION.findIndex((w) => w.id === current);
        const nextIdx = (idx + 1) % WALLPAPERS_COLLECTION.length;
        return WALLPAPERS_COLLECTION[nextIdx].id;
      });
    }, 20000);
    return () => clearInterval(interval);
  }, [solarState.wallpaperAutoCycle]);

  // Calculate sun position to time and conditions
  const handleUpdateSunPosition = (pos: number) => {
    // 0 = 6 AM, 50 = 12 PM Noon, 100 = 8 PM Sunset
    const computedHours = 6 + (pos / 100) * 14;
    let condition: 'Sunny' | 'Golden Glow' | 'Solar Flare' | 'Clear Sky' | 'Sun Shower' = 'Sunny';
    let timeOfDay: SolarState['timeOfDay'] = 'noon';

    if (pos < 20) {
      timeOfDay = 'morning';
      condition = 'Clear Sky';
    } else if (pos < 60) {
      timeOfDay = 'noon';
      condition = 'Solar Flare';
    } else if (pos < 85) {
      timeOfDay = 'golden_hour';
      condition = 'Golden Glow';
    } else {
      timeOfDay = 'sunset';
      condition = 'Sunny';
    }

    const calculatedWattage = Math.round(300 + Math.sin((pos / 100) * Math.PI) * 620);
    const calculatedUV = Math.max(1, Math.round(Math.sin((pos / 100) * Math.PI) * 11));
    const calculatedTemp = Math.round(21 + Math.sin((pos / 100) * Math.PI) * 7);

    setSolarState((prev) => ({
      ...prev,
      sunPosition: pos,
      timeHours: computedHours,
      timeOfDay,
      weatherCondition: condition,
      solarWattage: calculatedWattage,
      uvIndex: calculatedUV,
      temperature: calculatedTemp,
    }));
  };

  // Launch App
  const handleLaunchApp = (app: AppDefinition) => {
    solarSound.playLaunch(solarState.soundEnabled);
    setActiveApp(app);
    setActiveDrawer(false);
    setActiveControlCenter(false);
    setActiveNotifications(false);
  };

  const handleOpenAppById = (id: string) => {
    const target = apps.find((a) => a.id === id);
    if (target) {
      handleLaunchApp(target);
    }
  };

  // Toggle simulated solar photovoltaic charging
  const handleToggleSolarCharge = () => {
    setSolarState((prev) => {
      const nextCharge = !prev.solarCharging;
      return {
        ...prev,
        solarCharging: nextCharge,
        batteryLevel: nextCharge ? Math.min(100, prev.batteryLevel + 1) : prev.batteryLevel,
      };
    });
  };

  // Solar charging battery tick simulation
  useEffect(() => {
    if (!solarState.solarCharging) return;
    const interval = setInterval(() => {
      setSolarState((prev) => ({
        ...prev,
        batteryLevel: Math.min(100, prev.batteryLevel + 1),
      }));
    }, 8000);
    return () => clearInterval(interval);
  }, [solarState.solarCharging]);

  // 1-Click Universal Theme Toggle
  const handleToggleThemeMode = () => {
    solarSound.playTap(solarState.soundEnabled);
    setSolarState((prev) => {
      const nextMode = prev.themeMode === 'light' ? 'dark' : prev.themeMode === 'dark' ? 'auto' : 'light';
      return { ...prev, themeMode: nextMode };
    });
  };

  // Per-app custom override handler (har app ka icon badalna)
  const handleUpdateAppOverride = (appId: string, override: CustomAppIconOverride | null) => {
    setSolarState((prev) => {
      const updated = { ...prev.customAppIcons };
      if (override) {
        updated[appId] = override;
      } else {
        delete updated[appId];
      }
      return { ...prev, customAppIcons: updated };
    });
  };

  // Custom Icon Pack import handler
  const handleImportIconPack = (packData: any) => {
    setSolarState((prev) => ({
      ...prev,
      activeIconPack: packData.packId || 'custom',
      customAppIcons: packData.customAppIcons || prev.customAppIcons,
    }));
  };

  // Notifications handlers
  const handleDismissNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const handleClearAllNotifications = () => {
    setNotifications([]);
  };

  // Notes handlers
  const handleAddNote = (note: NoteItem) => {
    setNotes((prev) => [note, ...prev]);
  };

  const handleDeleteNote = (id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  // Deep System: Lock, AOD & Boot Handlers
  const handleLockPhone = () => {
    solarSound.playTap(solarState.soundEnabled);
    setIsLocked(true);
    setIsAOD(false);
    setActiveApp(null);
    setActiveControlCenter(false);
    setActiveNotifications(false);
    setActiveVisualCustomizer(false);
    setActiveIconResizer(false);
    setActiveDrawer(false);
  };

  const handleUnlockPhone = () => {
    setIsLocked(false);
    setIsAOD(false);
  };

  const handleEnterAOD = () => {
    solarSound.playTap(solarState.soundEnabled);
    setIsLocked(false);
    setIsAOD(true);
  };

  const handleWakeAOD = () => {
    solarSound.playTap(solarState.soundEnabled);
    setIsAOD(false);
    setIsLocked(true);
  };

  const handleSimulateBoot = (bootId?: BootAnimationId) => {
    if (bootId) {
      setSolarState((prev) => ({ ...prev, bootAnimation: bootId }));
    }
    setIsBooting(true);
    setIsLocked(false);
    setIsAOD(false);
    setActiveApp(null);
    setActiveControlCenter(false);
    setActiveNotifications(false);
    setActiveVisualCustomizer(false);
    setActiveIconResizer(false);
    setActiveDrawer(false);
  };

  const handleBootComplete = () => {
    setIsBooting(false);
    setIsLocked(true);
  };

  // 1-Click Master Theme Preset Apply
  const handleApplyThemePreset = (preset: ThemePreset) => {
    solarSound.playLaunch(solarState.soundEnabled);
    setWallpaper(preset.wallpaper);
    setSolarState((prev) => ({
      ...prev,
      activeIconPack: preset.iconPack,
      themeMode: preset.themeMode,
      systemFont: preset.systemFont,
      systemFontSize: preset.systemFontSize,
      systemTextColor: preset.systemTextColor,
      statusBarStyle: preset.statusBarStyle,
      batteryStyle: preset.batteryStyle,
      signalStyle: preset.signalStyle,
      clockPosition: preset.clockPosition,
      controlCenterAccent: preset.controlCenterAccent,
      notificationCardStyle: preset.notificationCardStyle,
      lockClockStyle: preset.lockClockStyle,
      lockWidgets: preset.lockWidgets,
      aodTheme: preset.aodTheme,
      bootAnimation: preset.bootAnimation,
      activeSoundPack: preset.soundPack || prev.activeSoundPack,
    }));
  };

  // 1-Click Restore to Factory Defaults ("Pehle Jaisa Restore Karein")
  const handleRestoreFactoryDefaults = () => {
    solarSound.playLaunch(solarState.soundEnabled);
    setWallpaper(FACTORY_DEFAULT_THEME.wallpaper);
    setSolarState((prev) => ({
      ...prev,
      ...FACTORY_DEFAULT_THEME,
      customAppIcons: {},
    }));
  };

  // RAM Cache Purge & Performance Booster
  const handleBoostRAM = () => {
    solarSound.playLaunch(solarState.soundEnabled);
    setSolarState((prev) => ({
      ...prev,
      ramUsageMb: Math.max(720, Math.round(prev.ramUsageMb * 0.55)),
    }));
  };

  // Touch gesture detection for swipe down from status bar / top edge
  const touchStartY = React.useRef<number | null>(null);
  const touchStartX = React.useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    touchStartY.current = e.touches[0].clientY;
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartY.current === null || touchStartX.current === null) return;
    const deltaY = e.changedTouches[0].clientY - touchStartY.current;
    const deltaX = Math.abs(e.changedTouches[0].clientX - touchStartX.current);

    // If downward swipe originating from top area
    if (deltaY > 50 && deltaY > deltaX && touchStartY.current < 140) {
      if (touchStartX.current > window.innerWidth * 0.5) {
        solarSound.playTap(solarState.soundEnabled);
        setActiveControlCenter(true);
      } else {
        solarSound.playTap(solarState.soundEnabled);
        setActiveNotifications(true);
      }
    }

    // If upward swipe originating from lower area (Open App Drawer)
    if (deltaY < -45 && Math.abs(deltaY) > deltaX && !activeApp) {
      solarSound.playTap(solarState.soundEnabled);
      setActiveDrawer(true);
    }

    touchStartY.current = null;
    touchStartX.current = null;
  };

  // Dock items (4 apps)
  const dockApps = apps.filter((a) => a.dockEligible).slice(0, 4);

  return (
    <DeviceFrame
      solarState={solarState}
      wallpaper={wallpaper}
      isLocked={isLocked}
      isAOD={isAOD}
      onSelectWallpaper={setWallpaper}
      onUpdateSunPosition={handleUpdateSunPosition}
      onToggleSound={() =>
        setSolarState((prev) => ({ ...prev, soundEnabled: !prev.soundEnabled }))
      }
      onTriggerNotifications={() => setActiveNotifications(true)}
      onTriggerControlCenter={() => setActiveControlCenter(true)}
      onTriggerAppDrawer={() => setActiveDrawer(true)}
      onTriggerIconResizer={() => setActiveIconResizer(true)}
      onTriggerVisualCustomizer={(tab) => {
        setCustomizerInitialTab(tab || 'icons');
        setActiveVisualCustomizer(true);
      }}
      onToggleThemeMode={handleToggleThemeMode}
      onLockPhone={handleLockPhone}
      onUnlockPhone={handleUnlockPhone}
      onEnterAOD={handleEnterAOD}
      onRebootPhone={() => handleSimulateBoot()}
    >
      <div
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="relative w-full h-full flex flex-col justify-between overflow-hidden select-none"
      >
        {/* Flashlight screen effect */}
        {solarState.flashlightEnabled && (
          <div className="absolute inset-0 bg-yellow-100/90 z-50 pointer-events-none animate-pulse" />
        )}

        {/* Status Bar */}
        <StatusBar
          solarState={solarState}
          onOpenNotifications={() => setActiveNotifications(true)}
          onOpenControlCenter={() => setActiveControlCenter(true)}
        />

        {/* Master Home Screen */}
        <HomeScreen
          apps={apps}
          solarState={solarState}
          notes={notes}
          currentWallpaper={wallpaper}
          onLaunchApp={handleLaunchApp}
          onUpdateSunPosition={handleUpdateSunPosition}
          onToggleSolarCharge={handleToggleSolarCharge}
          onOpenAppById={handleOpenAppById}
          onOpenAppDrawer={() => setActiveDrawer(true)}
          onOpenIconResizer={() => setActiveIconResizer(true)}
          onOpenVisualCustomizer={(tab) => {
            setCustomizerInitialTab(tab || 'presets');
            setActiveVisualCustomizer(true);
          }}
          onOpenThemeStudioTab={(tab) => {
            setCustomizerInitialTab(tab);
            setActiveVisualCustomizer(true);
          }}
          onUpdateSoundPack={(packId) => {
            setSolarState((prev) => ({ ...prev, activeSoundPack: packId }));
          }}
          onRestoreDefaults={handleRestoreFactoryDefaults}
        />

        {/* Glass Bottom Dock */}
        <GlassDock
          dockApps={dockApps}
          soundEnabled={solarState.soundEnabled}
          tiltEnabled={solarState.iconTilt3D}
          iconScale={solarState.iconScale}
          iconPack={solarState.activeIconPack}
          customAppIcons={solarState.customAppIcons}
          isDark={isDarkMode}
          onLaunchApp={handleLaunchApp}
          onOpenAppDrawer={() => setActiveDrawer(true)}
        />

        {/* Master Gesture Bar */}
        <GestureBar
          onGoHome={() => {
            setActiveApp(null);
            setActiveDrawer(false);
            setActiveControlCenter(false);
            setActiveNotifications(false);
            setActiveIconResizer(false);
            setActiveVisualCustomizer(false);
          }}
          soundEnabled={solarState.soundEnabled}
        />

        {/* Slide-up App Drawer */}
        {activeDrawer && (
          <AppDrawer
            apps={apps}
            solarState={solarState}
            onClose={() => setActiveDrawer(false)}
            onLaunchApp={handleLaunchApp}
            onOpenIconResizer={() => {
              setActiveDrawer(false);
              setActiveIconResizer(true);
            }}
            onOpenVisualCustomizer={(tab) => {
              setActiveDrawer(false);
              setCustomizerInitialTab(tab || 'presets');
              setActiveVisualCustomizer(true);
            }}
          />
        )}

        {/* Interactive Master UI & Visual Customizer Modal */}
        {activeVisualCustomizer && (
          <VisualCustomizerModal
            solarState={solarState}
            apps={apps}
            currentWallpaper={wallpaper}
            initialTab={customizerInitialTab}
            onClose={() => setActiveVisualCustomizer(false)}
            onSelectWallpaper={setWallpaper}
            onUpdateSolarState={(updates) =>
              setSolarState((prev) => ({ ...prev, ...updates }))
            }
            onUpdateAppOverride={handleUpdateAppOverride}
            onImportIconPack={handleImportIconPack}
            onApplyThemePreset={handleApplyThemePreset}
            onRestoreDefaults={handleRestoreFactoryDefaults}
            onBoostRAM={handleBoostRAM}
            onTestBoot={handleSimulateBoot}
            onTestAOD={handleEnterAOD}
            onTestLockScreen={handleLockPhone}
          />
        )}

        {/* Interactive Icon Resizer Floating Modal */}
        {activeIconResizer && (
          <IconResizerModal
            solarState={solarState}
            sampleApps={apps}
            onClose={() => setActiveIconResizer(false)}
            onUpdateState={(updates) =>
              setSolarState((prev) => ({ ...prev, ...updates }))
            }
          />
        )}

        {/* Top-Right Control Center Sheet */}
        {activeControlCenter && (
          <ControlCenter
            solarState={solarState}
            onClose={() => setActiveControlCenter(false)}
            onUpdateBrightness={(val) =>
              setSolarState((prev) => ({ ...prev, brightness: val }))
            }
            onUpdateVolume={(val) =>
              setSolarState((prev) => ({ ...prev, volume: val }))
            }
            onToggleWifi={() =>
              setSolarState((prev) => ({ ...prev, wifiEnabled: !prev.wifiEnabled }))
            }
            onToggleBluetooth={() =>
              setSolarState((prev) => ({
                ...prev,
                bluetoothEnabled: !prev.bluetoothEnabled,
              }))
            }
            onToggleFlashlight={() =>
              setSolarState((prev) => ({
                ...prev,
                flashlightEnabled: !prev.flashlightEnabled,
              }))
            }
            onToggleSolarBeam={() =>
              setSolarState((prev) => ({
                ...prev,
                solarBeamMode: !prev.solarBeamMode,
              }))
            }
            onToggleSolarCharge={handleToggleSolarCharge}
            onLaunchApp={(id) => handleOpenAppById(id)}
            onToggleThemeMode={handleToggleThemeMode}
            onTriggerVisualCustomizer={(tab) => {
              setCustomizerInitialTab(tab || 'presets');
              setActiveVisualCustomizer(true);
            }}
            onUpdateSolarState={(updates) =>
              setSolarState((prev) => ({ ...prev, ...updates }))
            }
            onLockPhone={handleLockPhone}
            onEnterAOD={handleEnterAOD}
          />
        )}

        {/* Top-Left Notification Center Sheet */}
        {activeNotifications && (
          <NotificationCenter
            notifications={notifications}
            solarState={solarState}
            onClose={() => setActiveNotifications(false)}
            onDismiss={handleDismissNotification}
            onClearAll={handleClearAllNotifications}
            onOpenAppById={handleOpenAppById}
          />
        )}

        {/* Active Full App Window Modal */}
        {activeApp && (
          <AppWindow
            app={activeApp}
            solarState={solarState}
            notes={notes}
            currentWallpaper={wallpaper}
            onClose={() => setActiveApp(null)}
            onUpdateSunPosition={handleUpdateSunPosition}
            onUpdateState={(updates) =>
              setSolarState((prev) => ({ ...prev, ...updates }))
            }
            onAddNote={handleAddNote}
            onDeleteNote={handleDeleteNote}
            onTriggerVisualCustomizer={(tab) => {
              setCustomizerInitialTab(tab || 'icons');
              setActiveVisualCustomizer(true);
            }}
            onApplyThemePreset={handleApplyThemePreset}
            onRestoreDefaults={handleRestoreFactoryDefaults}
            onLockPhone={handleLockPhone}
            onEnterAOD={handleEnterAOD}
            onRebootPhone={() => handleSimulateBoot()}
          />
        )}

        {/* Cold Boot Simulator */}
        {isBooting && (
          <BootSimulator
            solarState={solarState}
            onComplete={handleBootComplete}
          />
        )}

        {/* AMOLED Always-On Display (AOD) */}
        {isAOD && !isBooting && (
          <AlwaysOnDisplay
            solarState={solarState}
            onWake={handleWakeAOD}
          />
        )}

        {/* Lock Screen with Modular Widgets, Depth Clocks & Swipe Unlock */}
        {isLocked && !isAOD && !isBooting && (
          <LockScreen
            solarState={solarState}
            wallpaper={wallpaper}
            onUnlock={handleUnlockPhone}
            onEnterAOD={handleEnterAOD}
            onLaunchCamera={() => {
              handleUnlockPhone();
              handleOpenAppById('solarcam');
            }}
          />
        )}
      </div>
    </DeviceFrame>
  );
}
