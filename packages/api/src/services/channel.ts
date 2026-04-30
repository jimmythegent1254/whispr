import { store, generateId } from "../store";

export function getChannels(workspaceId: string) {
  return store.channels.filter((c) => c.workspaceId === workspaceId);
}

export function createChannel(workspaceId: string, name: string) {
  const channel = {
    id: generateId(),
    workspaceId,
    name,
  };

  store.channels.push(channel);
  return channel;
}

export function getChannelMessages(channelId: string) {
  return store.messages.filter((m) => m.channelId === channelId);
}

export function sendChannelMessage({
  channelId,
  senderId,
  content,
}: {
  channelId: string;
  senderId: string;
  content: string;
}) {
  // permission check
  const isMember = store.channelMembers.some(
    (m) => m.channelId === channelId && m.userId === senderId,
  );

  if (!isMember) {
    throw new Error("Unauthorized");
  }

  const message = {
    id: generateId(),
    channelId,
    senderId,
    content,
    createdAt: new Date(),
  };

  store.messages.push(message);
  return message;
}
