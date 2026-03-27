// /app/pos/lib/userService.ts

import type { User } from "../types/user";

export const userService = {
  async find(value: string): Promise<User | null> {
    // placeholder for MongoDB later
    const stored = localStorage.getItem("users");
    const users: User[] = stored ? JSON.parse(stored) : [];
    return users.find(u => u.phone === value || u.email === value) || null;
  },

  async create(data: {
    name?: string;
    phone?: string;
    email?: string;
  }): Promise<User> {
    const stored = localStorage.getItem("users");
    const users: User[] = stored ? JSON.parse(stored) : [];

    const newUser: User = {
      id: crypto.randomUUID(),
      name: data.name,
      phone: data.phone,
      email: data.email,
      password: null,
      loyaltyPoints: 0,
    };

    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    return newUser;
  },

  async all(): Promise<User[]> {
    const stored = localStorage.getItem("users");
    return stored ? JSON.parse(stored) : [];
  }
};
