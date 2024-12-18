import { describe, expect, test } from 'vitest';
import { replaceProperty } from '../src/snapshot.js';
import { type User, type UserList, user, userList } from './fixture.js';

expect.addSnapshotSerializer(
  replaceProperty<User>({
    property: /^id/,
  }),
);

describe('replaceProperty regex', () => {
  test('should replace property with placeholder', () => {
    expect(user).toMatchInlineSnapshot(`
      {
        "createdAt": "2024-03-20T12:00:00Z",
        "id": "[SNAPSHOT_PLACEHOLDER]",
        "name": "John Doe",
        "password": "secret123",
      }
    `);
  });

  test('should replace deeply nested properties', () => {
    expect(userList).toMatchInlineSnapshot(`
      {
        "users": {
          "active": [
            {
              "createdAt": "2024-03-20T12:00:00Z",
              "id": "[SNAPSHOT_PLACEHOLDER]",
              "name": "John Doe",
              "password": "secret123",
            },
            {
              "createdAt": "2024-03-20T12:00:00Z",
              "id": "[SNAPSHOT_PLACEHOLDER]",
              "name": "John Doe",
              "password": "secret123",
            },
          ],
        },
      }
    `);
  });
});
