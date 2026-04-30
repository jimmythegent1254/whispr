export type User = {
  id: string;
  name: string;
  avatarColor?: string;
  online?: boolean;
  title?: string;
};

export type Workspace = {
  id: string;
  name: string;
};

export type Conversation = {
  id: string;
  workspaceId: string;
  type: "channel" | "dm";
  name: string;
  topic?: string;
};

export type ConversationMember = {
  conversationId: string;
  userId: string;
};

export type Message = {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  createdAt: number;
  updatedAt?: number;
};

export const store = {
  users: [] as User[],
  workspaces: [] as Workspace[],
  conversations: [] as Conversation[],
  conversationMembers: [] as ConversationMember[],
  messages: [] as Message[],
};

export const generateId = () => crypto.randomUUID();
