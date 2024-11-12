import type { SnapshotSerializer, expect } from 'vitest';

export const PLACEHOLDER = '[SNAPSHOT_PLACEHOLDER]';

type ReplaceProperty = {
  /**
   * The name of the property to replace.
   */
  property: string;
  /**
   * The placeholder to replace the property with.
   */
  placeholder?: string;
};

/**
 * Replace a property in the snapshot with a placeholder.
 *
 * @example
 * ```typescript
 * import { replaceProperty } from '@your-scope/snapshot-serializers';
 *
 * expect.addSnapshotSerializer(replaceProperty({ property: 'foo' }));
 *
 * expect({ foo: 'foo' }).toMatchInlineSnapshot(`{ "foo": "[SNAPSHOT_PLACEHOLDER]" }`);
 * ```
 */
export const replaceProperty = ({
  property,
  placeholder = PLACEHOLDER,
}: ReplaceProperty): SnapshotSerializer => {
  return {
    test(val) {
      return (
        val &&
        typeof val === 'object' &&
        Object.hasOwn(val, property) &&
        val[property] !== placeholder
      );
    },
    print(val, print) {
      return print({
        ...(val as Record<string, unknown>),
        [property]: placeholder,
      });
    },
  };
};

type RemoveProperty = {
  /**
   * The name of the property to remove.
   */
  property: string;
};

/**
 * Remove a property from the snapshot.
 *
 * @example
 * ```typescript
 * import { removeProperty } from '@your-scope/snapshot-serializers';
 *
 * expect.addSnapshotSerializer(removeProperty({ property: 'foo' }));
 *
 * expect({ foo: 'foo' }).toMatchInlineSnapshot(`{}`);
 * ```
 */
export const removeProperty = ({
  property,
}: RemoveProperty): SnapshotSerializer => {
  return {
    test(val) {
      return val && typeof val === 'object' && Object.hasOwn(val, property);
    },
    print(val, print) {
      const clone = { ...(val as Record<string, unknown>) };
      delete clone[property];

      return print(clone);
    },
  };
};
