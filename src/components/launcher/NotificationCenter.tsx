import React from 'react';
import { NotificationItem, SolarState } from '../../types/launcher';
import { Bell, Sparkles, X, Check, Trash2, ArrowUpRight } from 'lucide-react';
import { solarSound } from '../../utils/solarSound';

interface NotificationCenterProps {
  notifications: NotificationItem[];
  solarState: SolarState;
  onClose: () => void;
  onDismiss: (id: string) => void;
  onClearAll: () => void;
  onOpenAppById: (appId: string) => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  notifications,
  solarState,
  onClose,
  onDismiss,
  onClearAll,
  onOpenAppById,
}) => {
  return (
    <div className="absolute inset-0 z-50 bg-black/40 backdrop-blur-xl flex flex-col justify-start p-4 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex items-center justify-between pt-2 pb-3 px-1 text-white">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-amber-300" />
          <span className="font-display font-bold text-sm tracking-tight">
            Sunny Notifications
          </span>
          {notifications.length > 0 && (
            <span className="px-1.5 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-mono font-bold">
              {notifications.length}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {notifications.length > 0 && (
            <button
              onClick={() => {
                solarSound.playTap(solarState.soundEnabled);
                onClearAll();
              }}
              className="text-[11px] font-medium text-white/80 hover:text-white px-2 py-1 rounded-lg hover:bg-white/10 transition-colors"
            >
              Clear All
            </button>
          )}
          <button
            onClick={() => {
              solarSound.playTap(solarState.soundEnabled);
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center hover:bg-white/30 text-white active:scale-95 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Solar Daily Overview Card */}
      <div className="glass-panel bg-white/35 rounded-3xl p-4 border border-white/70 shadow-lg mb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">☀️</span>
            <div>
              <h4 className="font-display font-bold text-xs text-slate-900">
                Daily Solar Advisory
              </h4>
              <p className="text-[10px] text-slate-600 font-medium">
                Peak sunlight index reached · Golden hour begins at 06:20 PM
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="flex-1 overflow-y-auto no-scrollbar space-y-2.5 pb-6">
        {notifications.length === 0 ? (
          <div className="py-16 text-center text-white/70">
            <Sparkles className="w-10 h-10 mx-auto mb-2 text-amber-300/80" />
            <p className="text-sm font-semibold">All caught up under the sun!</p>
            <p className="text-xs text-white/50 mt-1">No pending notifications</p>
          </div>
        ) : (
          notifications.map((item) => {
            const cardStyleClass =
              solarState.notificationCardStyle === 'solid-dark'
                ? 'bg-zinc-900/95 border border-zinc-700/80 text-white shadow-xl hover:bg-zinc-800'
                : solarState.notificationCardStyle === 'minimal-outline'
                ? 'bg-black/35 backdrop-blur-md border border-amber-400/50 text-white shadow-md hover:bg-black/50'
                : 'glass-panel bg-white/40 dark:bg-zinc-800/60 border border-white/70 dark:border-white/10 text-slate-900 dark:text-white shadow-md hover:bg-white/60 dark:hover:bg-zinc-800';

            const titleColor =
              solarState.notificationCardStyle === 'solid-dark' || solarState.notificationCardStyle === 'minimal-outline'
                ? 'text-white'
                : 'text-slate-900 dark:text-white';

            const subColor =
              solarState.notificationCardStyle === 'solid-dark' || solarState.notificationCardStyle === 'minimal-outline'
                ? 'text-zinc-300'
                : 'text-slate-700 dark:text-zinc-300';

            return (
              <div
                key={item.id}
                className={`group relative rounded-[22px] p-3.5 transition-all ${cardStyleClass}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2.5 flex-1">
                    <div className="w-8 h-8 rounded-[10px] bg-gradient-to-tr from-amber-400 to-yellow-300 flex items-center justify-center text-sm shadow-xs shrink-0 border border-white/60">
                      {item.iconEmoji}
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <div className="flex items-center justify-between">
                        <span className={`font-semibold text-xs truncate ${titleColor}`} style={{ fontFamily: 'var(--font-display)' }}>
                          {item.appName}
                        </span>
                        <span className="text-[10px] opacity-75 font-medium">
                          {item.timeAgo}
                        </span>
                      </div>
                      <p className={`text-[11px] font-semibold mt-0.5 ${titleColor}`}>
                        {item.title}
                      </p>
                      <p className={`text-xs mt-0.5 line-clamp-2 leading-relaxed opacity-90 ${subColor}`}>
                        {item.message}
                      </p>
                    </div>
                  </div>

                  {/* Dismiss button */}
                  <button
                    onClick={() => {
                      solarSound.playTap(solarState.soundEnabled);
                      onDismiss(item.id);
                    }}
                    className="w-6 h-6 rounded-full opacity-60 hover:opacity-100 hover:bg-white/20 flex items-center justify-center shrink-0 transition-opacity"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Action Bar */}
                <div className="flex items-center justify-end gap-2 mt-2 pt-2 border-t border-white/10">
                  <button
                    onClick={() => {
                      solarSound.playTap(solarState.soundEnabled);
                      onOpenAppById(item.appId);
                      onClose();
                    }}
                    className="px-3 py-1 rounded-full bg-white/70 dark:bg-white/20 hover:bg-white text-slate-800 dark:text-white text-[11px] font-semibold flex items-center gap-1 shadow-xs active:scale-95 transition-all border border-white/80 dark:border-white/10"
                  >
                    <span>Open</span>
                    <ArrowUpRight className="w-3 h-3 text-amber-500" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
