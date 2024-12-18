import { describe, expect, test } from 'vitest';
import { removeProperty } from '../src/snapshot.js';
import { type User, user, userList } from './fixture.js';

expect.addSnapshotSerializer(
  removeProperty<User>({
    property: ['id', 'password'],
  }),
);

describe('removeProperty multiple', () => {
  test('should remove property', ({ expect }) => {
    expect(user).toMatchInlineSnapshot(`
      {
        "createdAt": "2024-03-20T12:00:00Z",
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
              "name": "John Doe",
            },
            {
              "createdAt": "2024-03-20T12:00:00Z",
              "name": "John Doe",
            },
          ],
        },
      }
    `);
  });
});
