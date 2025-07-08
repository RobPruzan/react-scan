import { ReactComponentNamePlugin } from '../src/webpack';

describe('ReactComponentNamePlugin', () => {
  it('should create plugin instance', () => {
    const plugin = new ReactComponentNamePlugin();
    expect(plugin).toBeInstanceOf(ReactComponentNamePlugin);
  });

  it('should accept options', () => {
    const options = {
      include: /\.tsx?$/,
      exclude: /node_modules/,
      flags: {
        noTryCatchDisplayNames: true,
      },
    };
    
    const plugin = new ReactComponentNamePlugin(options);
    expect(plugin).toBeInstanceOf(ReactComponentNamePlugin);
  });

  it('should have apply method', () => {
    const plugin = new ReactComponentNamePlugin();
    expect(typeof plugin.apply).toBe('function');
  });
});
