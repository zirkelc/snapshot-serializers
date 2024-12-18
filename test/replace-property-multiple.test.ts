import { describe, expect, test } from 'vitest';
import { replaceProperty } from '../src/snapshot.js';
import { type User, type UserList, user, userList } from './fixture.js';

expect.addSnapshotSerializer(
  replaceProperty<UserList>({
    property: ['id', 'createdAt'],
  }),
);

describe('replaceProperty multiple', () => {
  test('should replace property with placeholder', () => {
    expect(user).toMatchInlineSnapshot(`
      {
        "createdAt": "[SNAPSHOT_PLACEHOLDER]",
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
              "createdAt": "[SNAPSHOT_PLACEHOLDER]",
              "id": "[SNAPSHOT_PLACEHOLDER]",
              "name": "John Doe",
              "password": "secret123",
            },
            {
              "createdAt": "[SNAPSHOT_PLACEHOLDER]",
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
