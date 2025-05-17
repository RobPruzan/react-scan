import { describe, it, expect } from 'vitest';
import { transform } from './utils';

describe('component type detection', () => {
  it('marks client components', async () => {
    const input = `
      'use client';
      export const ClientComp = () => <div />;
    `;
    const result = await transform(input);
    expect(result).toContain("ClientComp.__reactScanComponentType = 'client'");
  });

  it('marks server components by default', async () => {
    const input = `
      export const ServerComp = () => <div />;
    `;
    const result = await transform(input);
    expect(result).toContain("ServerComp.__reactScanComponentType = 'server'");
  });
});
