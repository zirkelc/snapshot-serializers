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
import { removeProperty } from 'snapshot-serializers';

// Replace IDs with a default placeholder '[SNAPSHOT_PLACEHOLDER]'
expect.addSnapshotSerializer(replaceProperty({ property: 'id' }));

// Replace timestamps with a custom placeholder
expect.addSnapshotSerializer(
  replaceProperty({
    property: 'createdAt',
    placeholder: '[TIMESTAMP]'
  })
);

test('user data snapshot', () => {
  const user = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    name: 'John Doe',
    createdAt: '2024-03-20T12:00:00Z'
  };
  expect(user).toMatchInlineSnapshot(`
    {
      "id": "[SNAPSHOT_PLACEHOLDER]",
      "name": "John Doe",
      "createdAt": "[TIMESTAMP]"
    }
  `);
});
```

### Remove Properties

Remove properties that shouldn't be included in snapshots:

```typescript
import { removeProperty } from 'snapshot-serializers';

// Remove sensitive or unnecessary data from snapshots
expect.addSnapshotSerializer(removeProperty({ property: 'password' }));

test('user data without sensitive info', () => {
  const user = {
    id: '123',
    email: 'john@example.com',
    password: 'secret123'
  };
  expect(user).toMatchInlineSnapshot(`
    {
      "id": "123",
      "email": "john@example.com"
    }
  `);
});
```

## API

### replaceProperty(options)

Creates a serializer that replaces specific property values with placeholders.

- `options.property`: The name of the property to replace
- `options.placeholder`: (Optional) Custom placeholder text. Defaults to '[SNAPSHOT_PLACEHOLDER]'

### removeProperty(options)

Creates a serializer that removes specific properties from the snapshot.

- `options.property`: The name of the property to remove

## License

MIT
