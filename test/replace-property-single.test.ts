import { describe, expect, test } from 'vitest';
import { replaceProperty } from '../src/snapshot.js';
import { type User, type UserList, user, userList } from './fixture.js';

expect.addSnapshotSerializer(
  replaceProperty<User>({
    property: 'id',
  }),
);

expect.addSnapshotSerializer(
  replaceProperty<UserList>({
    property: 'createdAt',
    placeholder: '[TIMESTAMP]',
  }),
);

describe('replaceProperty single', () => {
  test('should replace property with placeholder', () => {
    expect(user).toMatchInlineSnapshot(`
      {
        "createdAt": "[TIMESTAMP]",
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
              "createdAt": "[TIMESTAMP]",
              "id": "[SNAPSHOT_PLACEHOLDER]",
              "name": "John Doe",
              "password": "secret123",
            },
            {
              "createdAt": "[TIMESTAMP]",
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
