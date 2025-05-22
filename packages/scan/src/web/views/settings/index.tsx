import { useEffect, useState } from 'preact/hooks';
import { ReactScanInternals, setOptions } from '~core/index';
import { Icon } from '~web/components/icon';
import { Slider } from '~web/components/slider';
import { Toggle } from '~web/components/toggle';
import { signalIsSettingsOpen } from '~web/state';
import { cn } from '~web/utils/helpers';

const animationSpeedLabels = {
  0: 'Off',
  1: 'Slow',
  2: 'Fast',
};

export const SettingsPanel = () => {
  const [options, setLocalOptions] = useState({
    animationSpeed: ReactScanInternals.options.value.animationSpeed,
    trackUnnecessaryRenders: ReactScanInternals.options.value.trackUnnecessaryRenders,
    log: ReactScanInternals.options.value.log,
    showFPS: ReactScanInternals.options.value.showFPS,
    showNotificationCount: ReactScanInternals.options.value.showNotificationCount,
  });

  useEffect(() => {
    setLocalOptions({
      animationSpeed: ReactScanInternals.options.value.animationSpeed,
      trackUnnecessaryRenders: ReactScanInternals.options.value.trackUnnecessaryRenders,
      log: ReactScanInternals.options.value.log,
      showFPS: ReactScanInternals.options.value.showFPS,
      showNotificationCount: ReactScanInternals.options.value.showNotificationCount,
    });
  }, [ReactScanInternals.options.value]);

  const handleToggleChange = (option: string) => (e: Event) => {
    const target = e.target as HTMLInputElement;
    const newOptions = {
      ...options,
      [option]: target.checked,
    };
    setLocalOptions(newOptions);
    setOptions(newOptions);
  };

  const handleAnimationSpeedChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    const value = Number(target.value);
    const newOptions = {
      ...options,
      animationSpeed: value,
    };
    setLocalOptions(newOptions);
    setOptions(newOptions);
  };

  const isSettingsOpen = signalIsSettingsOpen.value;

  return (
    <div
      className={cn(
        'absolute top-9 right-0 bg-black border border-[#222] rounded-lg p-4 w-64 shadow-lg z-50',
        'transition-all duration-300',
        isSettingsOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white text-sm font-medium">Settings</h3>
        <button
          className="text-gray-400 hover:text-white"
          onClick={() => {
            signalIsSettingsOpen.value = false;
          }}
        >
          <Icon name="icon-close" size={16} />
        </button>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="block text-xs text-gray-400">Animation Speed</label>
          <div className="flex items-center justify-between">
            <Slider
              value={options.animationSpeed}
              min={0}
              max={2}
              onChange={handleAnimationSpeedChange}
              className="flex-1 mr-2"
            />
            <span className="text-xs text-white min-w-[40px] text-right">
              {animationSpeedLabels[options.animationSpeed as keyof typeof animationSpeedLabels]}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <label className="text-xs text-gray-400">Track Unnecessary Renders</label>
          <Toggle
            checked={options.trackUnnecessaryRenders}
            onChange={handleToggleChange('trackUnnecessaryRenders')}
          />
        </div>

        <div className="flex items-center justify-between">
          <label className="text-xs text-gray-400">Show Logs</label>
          <Toggle
            checked={options.log}
            onChange={handleToggleChange('log')}
          />
        </div>

        <div className="flex items-center justify-between">
          <label className="text-xs text-gray-400">Show FPS Meter</label>
          <Toggle
            checked={options.showFPS}
            onChange={handleToggleChange('showFPS')}
          />
        </div>

        <div className="flex items-center justify-between">
          <label className="text-xs text-gray-400">Show Notification Count</label>
          <Toggle
            checked={options.showNotificationCount}
            onChange={handleToggleChange('showNotificationCount')}
          />
        </div>
      </div>
    </div>
  );
};
