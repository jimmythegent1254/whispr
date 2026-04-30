import { createContext, useContext, type ReactNode } from "react";
import { USERS, type User } from "@/lib/chat-data";

const UserContext = createContext<Record<string, User> | null>(null);

export function UsersProvider({
  users,
  children,
}: {
  users: Record<string, User>;
  children: ReactNode;
}) {
  return <UserContext.Provider value={users}>{children}</UserContext.Provider>;
}

export function useUsers() {
  const value = useContext(UserContext);
  return value ?? USERS;
}

export function useUser(id: string) {
  const users = useUsers();
  return users[id];
}
