export type User = {
  id: string;
  name: string;
  password?: string;
  createdAt: string;
};

export type UserList = {
  users: {
    active: User[];
  };
};

export const user: User = {
  id: '123e4567-e89b-12d3-a456-426614174000',
  name: 'John Doe',
  createdAt: '2024-03-20T12:00:00Z',
  password: 'secret123',
};

export const userList: UserList = {
  users: {
    active: [user, user],
  },
};
