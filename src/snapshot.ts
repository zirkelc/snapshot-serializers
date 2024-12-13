import type { SnapshotSerializer } from 'vitest';

export const PLACEHOLDER = '[SNAPSHOT_PLACEHOLDER]';

/**
 * Check if a value is an object.
 */
const isObject = (val: any) => val && typeof val === 'object';

/**
 * Check if a value is an object and has a property.
 */
const hasProperty = (
  val: any,
  property: string,
): val is Record<string, unknown> =>
  isObject(val) && Object.hasOwn(val, property);

/**
 * Get the properties of an object.
 */
type Properties<T> = T extends object
  ? {
      [K in keyof T]: K | Properties<T[K]>;
    }[keyof T]
  : never;

/**
 * Replace a property in the snapshot with a placeholder.
 */
interface ReplaceProperty<TType extends Record<string, unknown>> {
  /**
   * The name of the property to replace.
   */
  property: Properties<TType>;
  /**
   * The placeholder to replace the property with.
   */
  placeholder?: string;
} /**
 * Replace a property in the snapshot with a placeholder.
 *
 * @example
 * ```typescript
 * import { replaceProperty } from '@your-scope/snapshot-serializers';
 *
 * expect.addSnapshotSerializer(replaceProperty<{ foo: string }>({ property: 'foo' }));
 *
 * expect({ foo: 'foo' }).toMatchInlineSnapshot(`{ "foo": "[SNAPSHOT_PLACEHOLDER]" }`);
 * ```
 */
export const replaceProperty = <TType extends Record<string, unknown>>({
  property,
  placeholder = PLACEHOLDER,
}: ReplaceProperty<TType>): SnapshotSerializer => {
  return {
    test(val) {
      return hasProperty(val, property) && val[property] !== placeholder;
    },
    serialize(val, config, indentation, depth, refs, printer) {
      return printer(
        {
          ...(val as Record<string, unknown>),
          [property]: placeholder,
        },
        config,
        indentation,
        depth,
        refs,
      );
    },
    // print(val, print) {
    //   return print({
    //     ...(val as Record<string, unknown>),
    //     [name]: placeholder,
    //   });
    // },
  };
};

/**
 * Remove a property from the snapshot.
 */
type RemoveProperty<TType extends Record<string, unknown>> = {
  /**
   * The name of the property to remove.
   */
  property: Properties<TType>;
};

/**
 * Remove a property from the snapshot.
 *
 * @example
 * ```typescript
 * import { removeProperty } from '@your-scope/snapshot-serializers';
 *
 * expect.addSnapshotSerializer(removeProperty<{ foo: string }>({ property: 'foo' }));
 *
 * expect({ foo: 'foo' }).toMatchInlineSnapshot(`{}`);
 * ```
 */
export const removeProperty = <TType extends Record<string, unknown>>({
  property,
}: RemoveProperty<TType>): SnapshotSerializer => {
  return {
    test(val) {
      return hasProperty(val, property);
    },
    serialize(val, config, indentation, depth, refs, printer) {
      // shallow clone is enough because we are deleting a direct property
      const clone = { ...(val as Record<string, unknown>) };
      delete clone[property];

      return printer(clone, config, indentation, depth, refs);
    },
    // print(val, print) {
    //   const clone = { ...(val as Record<string, unknown>) };
    //   delete clone[property];

    //   return print(clone);
    // },
  };
};
