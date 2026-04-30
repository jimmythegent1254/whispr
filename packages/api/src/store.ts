export type User = {
  id: string;
  name: string;
};

export type Workspace = {
  id: string;
  name: string;
};

export type Channel = {
  id: string;
  workspaceId: string;
  name: string;
};

export type ChannelMember = {
  channelId: string;
  userId: string;
};

export type Message = {
  id: string;
  channelId: string;
  senderId: string;
  content: string;
  createdAt: Date;
};

export const store = {
  users: [] as User[],
  workspaces: [] as Workspace[],
  channels: [] as Channel[],
  channelMembers: [] as ChannelMember[],
  messages: [] as Message[],
};

export const generateId = () => crypto.randomUUID();
