import { store, generateId } from "../store";

export function getChannels(workspaceId: string) {
  return store.conversations.filter(
    (c) => c.workspaceId === workspaceId && c.type === "channel",
  );
}

export function createChannel(
  workspaceId: string,
  name: string,
  creatorId: string,
) {
  const channel = {
    id: generateId(),
    workspaceId,
    type: "channel" as const,
    name,
  };

  store.conversations.push(channel);
  store.conversationMembers.push({
    conversationId: channel.id,
    userId: creatorId,
  });

  return channel;
}

export function getChannelMessages(conversationId: string) {
  return store.messages.filter((m) => m.conversationId === conversationId);
}

export function addChannelMember(
  conversationId: string,
  userId: string,
  requesterId: string,
) {
  const isMember = store.conversationMembers.some(
    (m) => m.conversationId === conversationId && m.userId === requesterId,
  );

  if (!isMember) {
    throw new Error("Unauthorized");
  }

  const alreadyAdded = store.conversationMembers.some(
    (m) => m.conversationId === conversationId && m.userId === userId,
  );
  if (alreadyAdded) {
    return { conversationId, userId };
  }

  store.conversationMembers.push({
    conversationId,
    userId,
  });

  return { conversationId, userId };
}

export function sendChannelMessage({
  conversationId,
  senderId,
  content,
}: {
  conversationId: string;
  senderId: string;
  content: string;
}) {
  // permission check (membership)
  const isMember = store.conversationMembers.some(
    (m) => m.conversationId === conversationId && m.userId === senderId,
  );

  if (!isMember) {
    throw new Error("Unauthorized");
  }

  const message = {
    id: generateId(),
    conversationId,
    senderId,
    content,
    createdAt: Date.now(),
  };

  store.messages.push(message);
  return message;
}
