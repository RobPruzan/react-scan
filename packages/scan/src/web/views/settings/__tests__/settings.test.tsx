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
    instrumentation: {
      isPaused: {
        value: false,
      },
    },
  },
  setOptions: jest.fn(),
  readLocalStorage: jest.fn(),
  saveLocalStorage: jest.fn(),
}));

jest.mock('~web/state', () => ({
  signalWidgetViews: {
    value: {
      view: 'settings',
    },
  },
}));

jest.mock('~web/utils/helpers', () => ({
  cn: jest.fn((classes) => classes.filter(Boolean).join(' ')),
  readLocalStorage: jest.fn(),
  saveLocalStorage: jest.fn(),
}));

describe('SettingsView', () => {
  it('renders settings view with correct options', () => {
    const { getByText } = render(<SettingsView />);
    
    expect(getByText('Settings')).toBeInTheDocument();
    expect(getByText('Outline Re-renders')).toBeInTheDocument();
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

  it('toggles outline re-renders when clicked', () => {
    const { getByLabelText } = render(<SettingsView />);
    
    fireEvent.click(getByLabelText('Outline Re-renders'));
    
    expect(ReactScanInternals.instrumentation.isPaused.value).toBe(true);
  });

  it('closes view when close button is clicked', () => {
    const { getByTitle } = render(<SettingsView />);
    
    fireEvent.click(getByTitle('Close'));
    
    expect(signalWidgetViews.value).toEqual({ view: 'none' });
  });
});
