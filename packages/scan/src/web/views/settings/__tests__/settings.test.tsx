import { render, fireEvent } from '@testing-library/preact';
import { ReactScanInternals, setOptions } from '~core/index';
import { signalIsSettingsOpen } from '~web/state';
import { SettingsPanel } from '../index';

jest.mock('~core/index', () => ({
  ReactScanInternals: {
    options: {
      value: {
        animationSpeed: 1,
        trackUnnecessaryRenders: true,
        log: false,
        showFPS: true,
        showNotificationCount: false,
      },
    },
  },
  setOptions: jest.fn(),
}));

jest.mock('~web/state', () => ({
  signalIsSettingsOpen: {
    value: true,
  },
}));

describe('SettingsPanel', () => {
  it('renders settings panel with correct options', () => {
    const { getByText, getByTitle } = render(<SettingsPanel />);
    
    expect(getByText('Settings')).toBeInTheDocument();
    expect(getByText('Animation Speed')).toBeInTheDocument();
    expect(getByText('Track Unnecessary Renders')).toBeInTheDocument();
    expect(getByText('Show Logs')).toBeInTheDocument();
    expect(getByText('Show FPS Meter')).toBeInTheDocument();
    expect(getByText('Show Notification Count')).toBeInTheDocument();
  });

  it('calls setOptions when a toggle is clicked', () => {
    const { getByLabelText } = render(<SettingsPanel />);
    
    fireEvent.click(getByLabelText('Track Unnecessary Renders'));
    
    expect(setOptions).toHaveBeenCalledWith(expect.objectContaining({
      trackUnnecessaryRenders: false,
    }));
  });

  it('closes panel when close button is clicked', () => {
    const { getByTitle } = render(<SettingsPanel />);
    
    fireEvent.click(getByTitle('Close'));
    
    expect(signalIsSettingsOpen.value).toBe(false);
  });
});
