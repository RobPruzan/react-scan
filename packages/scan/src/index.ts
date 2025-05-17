// Polyfills must load before anything else
import './polyfills';

// Bippy has a side-effect that installs the hook.
import 'bippy';

export * from './core/index';
