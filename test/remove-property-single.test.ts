import { describe, expect, test } from 'vitest';
import { removeProperty } from '../src/snapshot.js';
import { type User, user, userList } from './fixture.js';

expect.addSnapshotSerializer(
  removeProperty<User>({
    property: 'password',
  }),
);

describe('removeProperty single', () => {
  test('should remove property', ({ expect }) => {
    expect(user).toMatchInlineSnapshot(`
      {
        "createdAt": "2024-03-20T12:00:00Z",
        "id": "123e4567-e89b-12d3-a456-426614174000",
        "name": "John Doe",
      }
    `);
  });

  test('should remove deeply nested property', ({ expect }) => {
    expect(userList).toMatchInlineSnapshot(`
      {
        "users": {
          "active": [
            {
              "createdAt": "2024-03-20T12:00:00Z",
              "id": "123e4567-e89b-12d3-a456-426614174000",
              "name": "John Doe",
            },
            {
              "createdAt": "2024-03-20T12:00:00Z",
              "id": "123e4567-e89b-12d3-a456-426614174000",
              "name": "John Doe",
            },
          ],
        },
      }
    `);
  });
});
