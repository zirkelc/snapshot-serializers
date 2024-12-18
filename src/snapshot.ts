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
 * Replace properties in the snapshot with placeholders.
 */
interface ReplaceProperty<TType extends Record<string, unknown>> {
  /**
   * The name of the property or properties to replace.
   * Can be a single property, an array of properties, or a RegExp pattern.
   */
  property: Properties<TType> | Array<Properties<TType>> | RegExp;
  /**
   * The placeholder to replace the properties with.
   */
  placeholder?: string;
}

/**
 * Replace properties in the snapshot with placeholders.
 *
 * @example
 * ```typescript
 * import { replaceProperty } from '@your-scope/snapshot-serializers';
 *
 * // Replace single property
 * expect.addSnapshotSerializer(replaceProperty<{ foo: string }>({ property: 'foo' }));
 *
 * // Replace multiple properties
 * expect.addSnapshotSerializer(replaceProperty<{ foo: string, bar: number }>({
 *   property: ['foo', 'bar']
 * }));
 *
 * // Replace properties by pattern
 * expect.addSnapshotSerializer(replaceProperty<Record<string, unknown>>({
 *   property: /^test/,
 *   placeholder: '[TEST_PLACEHOLDER]'
 * }));
 * ```
 */
export const replaceProperty = <TType extends Record<string, unknown>>({
  property,
  placeholder = PLACEHOLDER,
}: ReplaceProperty<TType>): SnapshotSerializer => {
  return {
    test(val) {
      if (!isObject(val)) return false;

      if (property instanceof RegExp) {
        return Object.keys(val).some(
          (key) => property.test(key) && val[key] !== placeholder,
        );
      }

      if (Array.isArray(property)) {
        return property.some(
          (prop) =>
            hasProperty(val, prop as string) &&
            val[prop as string] !== placeholder,
        );
      }

      return (
        hasProperty(val, property as string) &&
        val[property as string] !== placeholder
      );
    },
    serialize(val, config, indentation, depth, refs, printer) {
      const clone = { ...(val as Record<string, unknown>) };

      if (property instanceof RegExp) {
        for (const key of Object.keys(clone)) {
          if (property.test(key)) {
            clone[key] = placeholder;
          }
        }
      } else if (Array.isArray(property)) {
        for (const prop of property) {
          if (hasProperty(clone, prop as string)) {
            clone[prop as string] = placeholder;
          }
        }
      } else {
        clone[property as string] = placeholder;
      }

      return printer(clone, config, indentation, depth, refs);
    },
  };
};

/**
 * Remove properties from the snapshot.
 */
type RemoveProperty<TType extends Record<string, unknown>> = {
  /**
   * The name of the property or properties to remove.
   * Can be a single property, an array of properties, or a RegExp pattern.
   */
  property: Properties<TType> | Array<Properties<TType>> | RegExp;
};

/**
 * Remove properties from the snapshot.
 *
 * @example
 * ```typescript
 * import { removeProperty } from '@your-scope/snapshot-serializers';
 *
 * // Remove single property
 * expect.addSnapshotSerializer(removeProperty<{ foo: string }>({ property: 'foo' }));
 *
 * // Remove multiple properties
 * expect.addSnapshotSerializer(removeProperty<{ foo: string, bar: number }>({
 *   property: ['foo', 'bar']
 * }));
 *
 * // Remove properties by pattern
 * expect.addSnapshotSerializer(removeProperty<Record<string, unknown>>({
 *   property: /^test/
 * }));
 * ```
 */
export const removeProperty = <TType extends Record<string, unknown>>({
  property,
}: RemoveProperty<TType>): SnapshotSerializer => {
  return {
    test(val) {
      if (!isObject(val)) return false;

      if (property instanceof RegExp) {
        return Object.keys(val).some((key) => property.test(key));
      }

      if (Array.isArray(property)) {
        return property.some((prop) => hasProperty(val, prop as string));
      }

      return hasProperty(val, property as string);
    },
    serialize(val, config, indentation, depth, refs, printer) {
      const clone = { ...(val as Record<string, unknown>) };

      if (property instanceof RegExp) {
        for (const key of Object.keys(clone)) {
          if (property.test(key)) {
            delete clone[key];
          }
        }
      } else if (Array.isArray(property)) {
        for (const prop of property) {
          delete clone[prop as string];
        }
      } else {
        delete clone[property as string];
      }

      return printer(clone, config, indentation, depth, refs);
    },
  };
};
