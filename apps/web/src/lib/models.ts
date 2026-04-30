import type {
  Conversation as BackendConversation,
  Message as BackendMessage,
  User as BackendUser,
} from "@whispr/api";

export type User = BackendUser;

export type Reaction = {
  emoji: string;
  users: string[];
};

export const REACTION_EMOJIS = ["👍", "❤️", "😂", "🔥", "🎉"] as const;
export const CURRENT_USER_ID = "u_me";
export const WORKSPACE_ID = "ws_1";

export type Message = Omit<BackendMessage, "senderId" | "createdAt"> & {
  userId: string;
  timestamp: number;
  reactions: Reaction[];
  edited?: boolean;
  pinned?: boolean;
};

export type Conversation = BackendConversation & {
  members: string[];
  messages: Message[];
};
