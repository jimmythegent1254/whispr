import { store } from "../store";

export function getConversations(workspaceId: string) {
  return store.conversations.filter((c) => c.workspaceId === workspaceId);
}

export function getConversationsWithMessages(workspaceId: string) {
  const conversations = getConversations(workspaceId);
  return conversations.map((conv) => ({
    ...conv,
    messages: store.messages.filter((m) => m.conversationId === conv.id),
    members: store.conversationMembers
      .filter((m) => m.conversationId === conv.id)
      .map((m) => m.userId),
  }));
}
