import { useState, useMemo, useEffect } from "react";
import {
  type Conversation,
  type Message,
  CURRENT_USER_ID,
  WORKSPACE_ID,
  type User,
} from "@/lib/models";
import { Sidebar } from "@/components/custom/sidebar";
import { ChatArea } from "@/components/custom/chat-area";
import { DetailsPanel } from "@/components/custom/details-panel";
import { MembersDialog } from "@/components/custom/members-dialog";
import { SettingsDialog } from "@/components/custom/settings-dialog";
import { NewChatDialog } from "@/components/custom/new-chat-dialog";
import { Menu, PanelRight } from "lucide-react";
import { orpc, queryClient, client as orpcClient } from "@/utils/orpc";
import { useQuery } from "@tanstack/react-query";
import { UsersProvider } from "@/lib/user-context";

export function Home() {
  const usersQuery = useQuery(orpc.getUsers.queryOptions());
  const conversationsQuery = useQuery(
    orpc.getConversationsWithMessages.queryOptions({
      input: { workspaceId: WORKSPACE_ID },
    }),
  );

  const users = useMemo(() => {
    if (!usersQuery.data) return {};
    return usersQuery.data.reduce(
      (acc, user) => {
        acc[user.id] = user;
        return acc;
      },
      {} as Record<string, User>,
    );
  }, [usersQuery.data]);

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(true);
  const [typingUserId, setTypingUserId] = useState<string | null>(null);
  const [membersOpen, setMembersOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [newChatOpen, setNewChatOpen] = useState(false);
  const [profile, setProfile] = useState({
    name: "",
    title: "",
    avatarUrl: undefined as string | undefined,
  });

  useEffect(() => {
    if (users[CURRENT_USER_ID] && !profile.name && !profile.title) {
      setProfile({
        name: users[CURRENT_USER_ID].name,
        title: users[CURRENT_USER_ID].title ?? "",
        avatarUrl: undefined,
      });
    }
  }, [users, profile.name, profile.title]);

  useEffect(() => {
    if (!conversationsQuery.data) return;
    const backendConversations = conversationsQuery.data.map((conv) => ({
      ...conv,
      messages: conv.messages.map((msg) => ({
        id: msg.id,
        conversationId: conv.id,
        userId: msg.senderId,
        content: msg.content,
        timestamp: msg.createdAt,
        reactions: [],
      })),
    }));
    setConversations(backendConversations);
  }, [conversationsQuery.data]);

  useEffect(() => {
    if (conversations.length > 0 && !activeId) {
      setActiveId(conversations[0].id);
    }
  }, [conversations, activeId]);

  const currentUser = useMemo(
    () => ({
      ...(users[CURRENT_USER_ID] ?? {}),
      name: profile.name || users[CURRENT_USER_ID]?.name || "",
      title: profile.title || users[CURRENT_USER_ID]?.title || "",
    }),
    [users, profile.name, profile.title],
  );

  const active = useMemo(
    () => conversations.find((c) => c.id === activeId) ?? conversations[0]!,
    [conversations, activeId],
  );

  if (usersQuery.isLoading || conversationsQuery.isLoading) {
    return <div className="p-8">Loading chat data...</div>;
  }

  if (usersQuery.error || conversationsQuery.error) {
    return (
      <div className="p-8 text-red-500">
        Unable to load chat data. Please refresh the page.
      </div>
    );
  }

  if (!conversations.length) {
    return <div className="p-8">No conversations found.</div>;
  }

  const updateConversation = (
    id: string,
    updater: (c: Conversation) => Conversation,
  ) => {
    setConversations((prev) => prev.map((c) => (c.id === id ? updater(c) : c)));
  };

  const sendMessage = async (content: string) => {
    const backendMessage = await orpcClient.sendChannelMessage({
      conversationId: active.id,
      content,
    });

    const msg: Message = {
      id: backendMessage.id,
      conversationId: backendMessage.conversationId,
      userId: backendMessage.senderId,
      content: backendMessage.content,
      timestamp: backendMessage.createdAt,
      reactions: [],
    };

    updateConversation(active.id, (c) => ({
      ...c,
      messages: [...c.messages, msg],
    }));
    queryClient.invalidateQueries({
      predicate: (query) =>
        Array.isArray(query.queryKey) &&
        query.queryKey[0] === "getConversationsWithMessages",
    });
  };

  const toggleReaction = (messageId: string, emoji: string) => {
    updateConversation(active.id, (c) => ({
      ...c,
      messages: c.messages.map((m) => {
        if (m.id !== messageId) return m;
        const existing = m.reactions.find((r) => r.emoji === emoji);
        let reactions = m.reactions;
        if (existing) {
          const has = existing.users.includes(CURRENT_USER_ID);
          const updatedUsers = has
            ? existing.users.filter((u) => u !== CURRENT_USER_ID)
            : [...existing.users, CURRENT_USER_ID];
          reactions =
            updatedUsers.length === 0
              ? m.reactions.filter((r) => r.emoji !== emoji)
              : m.reactions.map((r) =>
                  r.emoji === emoji ? { ...r, users: updatedUsers } : r,
                );
        } else {
          reactions = [...m.reactions, { emoji, users: [CURRENT_USER_ID] }];
        }
        return { ...m, reactions };
      }),
    }));
  };

  const editMessage = (messageId: string, content: string) => {
    updateConversation(active.id, (c) => ({
      ...c,
      messages: c.messages.map((m) =>
        m.id === messageId ? { ...m, content, edited: true } : m,
      ),
    }));
  };

  const deleteMessage = (messageId: string) => {
    updateConversation(active.id, (c) => ({
      ...c,
      messages: c.messages.filter((m) => m.id !== messageId),
    }));
  };

  const togglePin = (messageId: string) => {
    updateConversation(active.id, (c) => ({
      ...c,
      messages: c.messages.map((m) =>
        m.id === messageId ? { ...m, pinned: !m.pinned } : m,
      ),
    }));
  };

  const createChannel = async (name: string) => {
    const channel = await orpcClient.createChannel({
      workspaceId: WORKSPACE_ID,
      name: name.toLowerCase().replace(/\s+/g, "-"),
    });

    setConversations((prev) => [
      ...prev,
      {
        ...channel,
        members: [CURRENT_USER_ID],
        messages: [],
      },
    ]);
    setActiveId(channel.id);
    queryClient.invalidateQueries({
      predicate: (query) =>
        Array.isArray(query.queryKey) &&
        query.queryKey[0] === "getConversationsWithMessages",
    });
  };

  const addMember = async (userId: string) => {
    await orpcClient.addChannelMember({
      conversationId: active.id,
      userId,
    });

    setConversations((prev) =>
      prev.map((c) =>
        c.id === active.id && !c.members.includes(userId)
          ? { ...c, members: [...c.members, userId] }
          : c,
      ),
    );

    queryClient.invalidateQueries({
      predicate: (query) =>
        Array.isArray(query.queryKey) &&
        query.queryKey[0] === "getConversationsWithMessages",
    });
  };

  const startDM = (userId: string) => {
    const existing = conversations.find(
      (c) =>
        c.type === "dm" && c.members.length === 2 && c.members.includes(userId),
    );
    if (existing) {
      setActiveId(existing.id);
      setSidebarOpen(false);
      return;
    }
    const u = users[userId];
    const id = `dm_${userId}_${Date.now()}`;
    const dm: Conversation = {
      id,
      type: "dm",
      workspaceId: WORKSPACE_ID,
      name: u?.name ?? "Direct message",
      members: [CURRENT_USER_ID, userId],
      messages: [],
    };
    setConversations((prev) => [...prev, dm]);
    setActiveId(id);
    setSidebarOpen(false);
  };

  return (
    <UsersProvider users={users}>
      <div className="dark flex h-screen w-full overflow-hidden bg-background text-foreground">
        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/50 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <aside
          className={`fixed inset-y-0 left-0 z-40 w-64 shrink-0 transform transition-transform md:static md:translate-x-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <Sidebar
            conversations={conversations}
            activeId={active.id}
            onSelect={(id) => {
              setActiveId(id);
              setSidebarOpen(false);
            }}
            onCreateChannel={createChannel}
            onOpenSettings={() => setSettingsOpen(true)}
            onOpenNewChat={() => setNewChatOpen(true)}
            currentUser={currentUser}
            currentAvatarUrl={profile.avatarUrl}
          />
        </aside>

        <main className="flex min-w-0 flex-1 flex-col">
          <div className="flex items-center gap-2 border-b border-border bg-card/40 px-2 py-1.5 md:hidden">
            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded-md p-2 hover:bg-accent"
              aria-label="Open sidebar"
            >
              <Menu className="h-5 w-5" />
            </button>
            <span className="font-semibold">Whispr</span>
          </div>

          <ChatArea
            conversation={active}
            typingUserId={typingUserId}
            onSend={sendMessage}
            onReact={toggleReaction}
            onEdit={editMessage}
            onDelete={deleteMessage}
            onPin={togglePin}
            onOpenMembers={() => setMembersOpen(true)}
            rightAction={
              <button
                onClick={() => setDetailsOpen((v) => !v)}
                className="rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-foreground"
                aria-label="Toggle details"
              >
                <PanelRight className="h-4 w-4" />
              </button>
            }
          />
        </main>

        {detailsOpen && (
          <aside className="hidden w-72 shrink-0 border-l border-border bg-card/40 lg:block">
            <DetailsPanel conversation={active} />
          </aside>
        )}

        {active.type === "channel" && (
          <MembersDialog
            open={membersOpen}
            onOpenChange={setMembersOpen}
            conversation={active}
            onAddMember={addMember}
          />
        )}

        <SettingsDialog
          open={settingsOpen}
          onOpenChange={setSettingsOpen}
          user={currentUser}
          onSave={(updates) =>
            setProfile((p) => ({
              name: updates.name,
              title: updates.title || p.title,
              avatarUrl: updates.avatarUrl ?? p.avatarUrl,
            }))
          }
        />

        <NewChatDialog
          open={newChatOpen}
          onOpenChange={setNewChatOpen}
          onStartChat={startDM}
        />
      </div>
    </UsersProvider>
  );
}
