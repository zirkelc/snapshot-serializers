import { describe, expect, test } from 'vitest';
import { removeProperty, replaceProperty } from '../src/snapshot.js';

expect.addSnapshotSerializer(replaceProperty({ property: 'id' }));
expect.addSnapshotSerializer(
  replaceProperty({ property: 'createdAt', placeholder: '[TIMESTAMP]' }),
);
expect.addSnapshotSerializer(removeProperty({ property: 'password' }));

test('should replace id with default placeholder', () => {
  expect({
    id: '123e4567-e89b-12d3-a456-426614174000',
    name: 'John Doe',
  }).toMatchInlineSnapshot(`
    {
      "id": "[SNAPSHOT_PLACEHOLDER]",
      "name": "John Doe",
    }
  `);
});

test('should replace timestamp with custom placeholder', () => {
  expect({
    id: '123e4567-e89b-12d3-a456-426614174000',
    name: 'John Doe',
    createdAt: '2024-03-20T12:00:00Z',
  }).toMatchInlineSnapshot(`
    {
      "createdAt": "[TIMESTAMP]",
      "id": "[SNAPSHOT_PLACEHOLDER]",
      "name": "John Doe",
    }
  `);
});

test('should replace deeply nested properties', () => {
  expect({
    users: {
      active: {
        primary: {
          id: '123e4567-e89b-12d3-a456-426614174000',
          name: 'John Doe',
          createdAt: '2024-03-20T12:00:00Z',
        },
      },
    },
  }).toMatchInlineSnapshot(`
    {
      "users": {
        "active": {
          "primary": {
            "createdAt": "[TIMESTAMP]",
            "id": "[SNAPSHOT_PLACEHOLDER]",
            "name": "John Doe",
          },
        },
      },
    }
  `);

  expect([
    {
      users: [
        {
          active: [
            {
              id: '123e4567-e89b-12d3-a456-426614174000',
              name: 'John Doe',
              createdAt: '2024-03-20T12:00:00Z',
            },
          ],
        },
      ],
    },
  ]).toMatchInlineSnapshot(`
    [
      {
        "users": [
          {
            "active": [
              {
                "createdAt": "[TIMESTAMP]",
                "id": "[SNAPSHOT_PLACEHOLDER]",
                "name": "John Doe",
              },
            ],
          },
        ],
      },
    ]
  `);
});

test('should remove sensitive properties', () => {
  expect({
    id: '123',
    email: 'john@example.com',
    password: 'secret123',
  }).toMatchInlineSnapshot(`
    {
      "email": "john@example.com",
      "id": "[SNAPSHOT_PLACEHOLDER]",
    }
  `);
});
