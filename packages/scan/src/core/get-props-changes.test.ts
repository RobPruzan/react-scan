import { describe, it, expect } from 'vitest';
import { getPropsChanges, ChangeReason } from '~core/instrumentation';

describe('getPropsChanges', () => {
  it('returns changes for each prop name', () => {
    const fiber = {
      memoizedProps: { a: 2, b: 3 },
      alternate: { memoizedProps: { a: 1 } },
    } as any;

    const changes = getPropsChanges(fiber);

    expect(changes).toEqual([
      { type: ChangeReason.Props, name: 'a', value: 2 },
      { type: ChangeReason.Props, name: 'b', value: 3 },
    ]);
  });
});
