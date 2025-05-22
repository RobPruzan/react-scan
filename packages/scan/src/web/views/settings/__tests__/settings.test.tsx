import { render, fireEvent } from '@testing-library/preact';
import { ReactScanInternals, setOptions } from '~core/index';
import { signalWidgetViews } from '~web/state';
import { SettingsView } from '../index';

jest.mock('~core/index', () => ({
  ReactScanInternals: {
    options: {
      value: {
        animationSpeed: 'fast',
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
  signalWidgetViews: {
    value: {
      view: 'settings',
    },
  },
}));

describe('SettingsView', () => {
  it('renders settings view with correct options', () => {
    const { getByText } = render(<SettingsView />);
    
    expect(getByText('Settings')).toBeInTheDocument();
    expect(getByText('Animation Speed')).toBeInTheDocument();
    expect(getByText('Track Unnecessary Renders')).toBeInTheDocument();
    expect(getByText('Show Logs')).toBeInTheDocument();
    expect(getByText('Show FPS Meter')).toBeInTheDocument();
    expect(getByText('Show Notification Count')).toBeInTheDocument();
  });

  it('calls setOptions when a toggle is clicked', () => {
    const { getByLabelText } = render(<SettingsView />);
    
    fireEvent.click(getByLabelText('Track Unnecessary Renders'));
    
    expect(setOptions).toHaveBeenCalledWith(expect.objectContaining({
      trackUnnecessaryRenders: false,
    }));
  });

  it('closes view when close button is clicked', () => {
    const { getByTitle } = render(<SettingsView />);
    
    fireEvent.click(getByTitle('Close'));
    
    expect(signalWidgetViews.value).toEqual({ view: 'none' });
  });
});
