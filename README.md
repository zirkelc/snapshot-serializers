[![CI](https://github.com/zirkelc/snapshot-serializers/actions/workflows/ci.yml/badge.svg)](https://github.com/zirkelc/snapshot-serializers/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/snapshot-serializers)](https://www.npmjs.com/package/snapshot-serializers)
[![npm](https://img.shields.io/npm/dt/snapshot-serializers)](https://www.npmjs.com/package/snapshot-serializers)

# Snapshot Serializers

A collection of snapshot serializers for Jest and Vitest to help manage dynamic values in your test snapshots.

## Installation

```bash
npm install snapshot-serializers
```

## Usage

Snapshot serializers must be added by using `expect.addSnapshotSerializer` API:

```ts
import { replaceProperty } from 'snapshot-serializers';

expect.addSnapshotSerializer(replaceProperty({ property: 'foo' }));
```

### Replace Properties

Replace dynamic properties like auto-generated IDs or timestamps with placeholders in your snapshots:

```typescript
import { replaceProperty } from 'snapshot-serializers';

// Replace single property with default placeholder '[SNAPSHOT_PLACEHOLDER]'
expect.addSnapshotSerializer(replaceProperty({ property: 'id' }));

// Replace multiple properties with custom placeholder
expect.addSnapshotSerializer(
  replaceProperty({
    property: ['createdAt', 'updatedAt'],
    placeholder: '[TIMESTAMP]'
  })
);

// Replace properties matching a pattern
expect.addSnapshotSerializer(
  replaceProperty({
    property: /^date/,
    placeholder: '[DATE]'
  })
);

test('user data snapshot', () => {
  const user = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    name: 'John Doe',
    createdAt: '2024-03-20T12:00:00Z',
    updatedAt: '2024-03-21T15:30:00Z',
    dateJoined: '2024-03-20',
    dateLastLogin: '2024-03-21'
  };
  expect(user).toMatchInlineSnapshot(`
    {
      "id": "[SNAPSHOT_PLACEHOLDER]",
      "name": "John Doe",
      "createdAt": "[TIMESTAMP]",
      "updatedAt": "[TIMESTAMP]",
      "dateJoined": "[DATE]",
      "dateLastLogin": "[DATE]"
    }
  `);
});
```

### Remove Properties

Remove properties that shouldn't be included in snapshots:

```typescript
import { removeProperty } from 'snapshot-serializers';

// Remove single property
expect.addSnapshotSerializer(removeProperty({ property: 'password' }));

// Remove multiple properties
expect.addSnapshotSerializer(
  removeProperty({ property: ['password', 'secretKey', 'token'] })
);

// Remove properties matching a pattern
expect.addSnapshotSerializer(
  removeProperty({ property: /^secret/ })
);

test('user data without sensitive info', () => {
  const user = {
    id: '123',
    email: 'john@example.com',
    password: 'secret123',
    secretKey: 'abc123',
    secretToken: 'xyz789',
    token: 'jwt-token'
  };
  expect(user).toMatchInlineSnapshot(`
    {
      "id": "123",
      "email": "john@example.com"
    }
  `);
});
```

### Type Safety

Provide a type argument to the `replaceProperty` and `removeProperty` functions to get type safety for your properties:

```typescript
import { replaceProperty, removeProperty } from 'snapshot-serializers';

type User = {
  id: string;
  name: string;
  createdAt: string;
};

expect.addSnapshotSerializer(
  // type of property is "id" | "name" | "createdAt"
  replaceProperty<User>({ property: 'id' })
);

expect.addSnapshotSerializer(
  // "invalid" is not assignable to type '"id" | "name" | "createdAt"
  removeProperty<User>({ property: 'invalid' })
);
```

## API

### `replaceProperty<T>(options)`

Creates a serializer that replaces specific property values with placeholders.

- `options.property`: The property to replace. Can be:
  - A single property name
  - An array of property names
  - A RegExp pattern to match multiple properties
- `options.placeholder`: (Optional) Custom placeholder text. Defaults to `[SNAPSHOT_PLACEHOLDER]`

### `removeProperty<T>(options)`

Creates a serializer that removes specific properties from the snapshot.

- `options.property`: The property to remove. Can be:
  - A single property name
  - An array of property names
  - A RegExp pattern to match multiple properties

## License

MIT
