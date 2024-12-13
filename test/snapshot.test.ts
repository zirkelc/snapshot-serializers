import { describe, expect, test } from 'vitest';
import { removeProperty, replaceProperty } from '../src/snapshot.js';

type User = {
  id: string;
  name: string;
  password?: string;
  createdAt: string;
};

type UserList = {
  users: {
    active: User[];
  };
};

expect.addSnapshotSerializer(replaceProperty<UserList>({ property: 'id' }));

expect.addSnapshotSerializer(
  replaceProperty<UserList>({
    property: 'createdAt',
    placeholder: '[TIMESTAMP]',
  }),
);

expect.addSnapshotSerializer(
  removeProperty<User>({
    property: 'password',
  }),
);

describe('replaceProperty', () => {
  const user: User = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    name: 'John Doe',
    createdAt: '2024-03-20T12:00:00Z',
  };

  const userList: UserList = {
    users: {
      active: [user, user],
    },
  };
  test('should replace property with placeholder', () => {
    expect(user).toMatchInlineSnapshot(`
    {
      "createdAt": "[TIMESTAMP]",
      "id": "[SNAPSHOT_PLACEHOLDER]",
      "name": "John Doe",
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
            },
            {
              "createdAt": "[TIMESTAMP]",
              "id": "[SNAPSHOT_PLACEHOLDER]",
              "name": "John Doe",
            },
          ],
        },
      }
    `);
  });
});

describe('removeProperty', () => {
  const user: User = {
    id: '123',
    name: 'John Doe',
    createdAt: '2024-03-20T12:00:00Z',
    password: 'secret123',
  };

  const userList: UserList = {
    users: {
      active: [user, user],
    },
  };

  test('should remove property', () => {
    expect(user).toMatchInlineSnapshot(`
    {
      "createdAt": "[TIMESTAMP]",
      "id": "[SNAPSHOT_PLACEHOLDER]",
      "name": "John Doe",
    }
  `);
  });

  test('should remove deeply nested property', () => {
    expect(userList).toMatchInlineSnapshot(`
      {
        "users": {
          "active": [
            {
              "createdAt": "[TIMESTAMP]",
              "id": "[SNAPSHOT_PLACEHOLDER]",
              "name": "John Doe",
            },
            {
              "createdAt": "[TIMESTAMP]",
              "id": "[SNAPSHOT_PLACEHOLDER]",
              "name": "John Doe",
            },
          ],
        },
      }
    `);
  });
});
