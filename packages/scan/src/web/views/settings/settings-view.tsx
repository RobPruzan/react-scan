import { forwardRef } from 'preact/compat';
import { useEffect, useState } from 'preact/hooks';
import { ReactScanInternals, setOptions } from '~core/index';
import { Icon } from '~web/components/icon';
import { Slider } from '~web/components/slider';
import { Toggle } from '~web/components/toggle';
import { signalWidgetViews } from '~web/state';
import { cn } from '~web/utils/helpers';

const animationSpeedLabels = {
  0: 'Off',
  1: 'Slow',
  2: 'Fast',
};

const getAnimationSpeedValue = (speed: 'off' | 'slow' | 'fast' | undefined): number => {
  if (speed === 'off') return 0;
  if (speed === 'slow') return 1;
  if (speed === 'fast') return 2;
  return 1; // Default to slow
};

const getAnimationSpeedString = (value: number): 'off' | 'slow' | 'fast' => {
  if (value === 0) return 'off';
  if (value === 1) return 'slow';
  return 'fast';
};

export const SettingsView = forwardRef<HTMLDivElement>((_, ref) => {
  const [options, setLocalOptions] = useState({
    animationSpeedValue: getAnimationSpeedValue(ReactScanInternals.options.value.animationSpeed),
    trackUnnecessaryRenders: ReactScanInternals.options.value.trackUnnecessaryRenders || false,
    log: ReactScanInternals.options.value.log || false,
    showFPS: ReactScanInternals.options.value.showFPS || false,
    showNotificationCount: ReactScanInternals.options.value.showNotificationCount || false,
  });

  useEffect(() => {
    setLocalOptions({
      animationSpeedValue: getAnimationSpeedValue(ReactScanInternals.options.value.animationSpeed),
      trackUnnecessaryRenders: ReactScanInternals.options.value.trackUnnecessaryRenders || false,
      log: ReactScanInternals.options.value.log || false,
      showFPS: ReactScanInternals.options.value.showFPS || false,
      showNotificationCount: ReactScanInternals.options.value.showNotificationCount || false,
    });
  }, [ReactScanInternals.options.value]);

  const handleToggleChange = (option: string) => (e: Event) => {
    const target = e.target as HTMLInputElement;
    const newLocalOptions = {
      ...options,
      [option]: target.checked,
    };
    setLocalOptions(newLocalOptions);
    
    setOptions({
      ...ReactScanInternals.options.value,
      [option]: target.checked,
    });
  };

  const handleAnimationSpeedChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    const value = Number(target.value);
    const newLocalOptions = {
      ...options,
      animationSpeedValue: value,
    };
    setLocalOptions(newLocalOptions);
    
    setOptions({
      ...ReactScanInternals.options.value,
      animationSpeed: getAnimationSpeedString(value),
    });
  };

  return (
    <div ref={ref} className="h-full w-full flex flex-col">
      <div className="w-full h-[48px] flex items-center justify-between px-4 border-b border-[#27272A]">
        <h3 className="text-white text-sm font-medium">Settings</h3>
        <button
          className="text-gray-400 hover:text-white"
          onClick={() => {
            signalWidgetViews.value = { view: 'none' };
          }}
          title="Close"
        >
          <Icon name="icon-close" size={16} />
        </button>
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-6">
          <div className="space-y-4">
            <h4 className="text-xs text-gray-400 uppercase font-medium">Performance</h4>
            
            <div className="space-y-2">
              <label className="block text-xs text-gray-400">Animation Speed</label>
              <div className="flex items-center justify-between">
                <Slider
                  value={options.animationSpeedValue}
                  min={0}
                  max={2}
                  onChange={handleAnimationSpeedChange}
                  className="flex-1 mr-2"
                />
                <span className="text-xs text-white min-w-[40px] text-right">
                  {animationSpeedLabels[options.animationSpeedValue as keyof typeof animationSpeedLabels]}
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
          </div>

          <div className="space-y-4">
            <h4 className="text-xs text-gray-400 uppercase font-medium">Display</h4>
            
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
      </div>
    </div>
  );
});
