import { useState, useMemo } from "react";
import {
  INITIAL_CONVERSATIONS,
  USERS,
  CURRENT_USER_ID,
  type Conversation,
  type Message,
} from "@/lib/chat-data";
import { Sidebar } from "@/components/custom/sidebar";
import { ChatArea } from "@/components/custom/chat-area";
import { DetailsPanel } from "@/components/custom/details-panel";
import { MembersDialog } from "@/components/custom/members-dialog";
import { SettingsDialog } from "@/components/custom/settings-dialog";
import { NewChatDialog } from "@/components/custom/new-chat-dialog";
import { Menu, PanelRight } from "lucide-react";
import { orpc } from "@/utils/orpc";
import { useQuery } from "@tanstack/react-query";

export function Home() {
  const privateData = useQuery(
    orpc.getChannels.queryOptions({ input: { workspaceId: "ws-1" } }),
  );

  console.log(privateData);

  const [conversations, setConversations] = useState<Conversation[]>(
    INITIAL_CONVERSATIONS,
  );
  const [activeId, setActiveId] = useState<string>(INITIAL_CONVERSATIONS[0].id);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(true);
  const [typingUserId, setTypingUserId] = useState<string | null>(null);
  const [membersOpen, setMembersOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [newChatOpen, setNewChatOpen] = useState(false);
  const [profile, setProfile] = useState({
    name: USERS[CURRENT_USER_ID].name,
    title: USERS[CURRENT_USER_ID].title,
    avatarUrl: undefined as string | undefined,
  });

  const currentUser = useMemo(
    () => ({
      ...USERS[CURRENT_USER_ID],
      name: profile.name,
      title: profile.title,
    }),
    [profile.name, profile.title],
  );

  const active = useMemo(
    () => conversations.find((c) => c.id === activeId) ?? conversations[0],
    [conversations, activeId],
  );

  const updateConversation = (
    id: string,
    updater: (c: Conversation) => Conversation,
  ) => {
    setConversations((prev) => prev.map((c) => (c.id === id ? updater(c) : c)));
  };

  const sendMessage = (content: string) => {
    const msg: Message = {
      id: `m_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      userId: CURRENT_USER_ID,
      content,
      timestamp: Date.now(),
      reactions: [],
    };
    updateConversation(active.id, (c) => ({
      ...c,
      messages: [...c.messages, msg],
    }));

    // Simulate someone else typing then replying
    const others = active.members.filter(
      (m) => m !== CURRENT_USER_ID && USERS[m]?.online,
    );
    if (others.length && Math.random() > 0.35) {
      const responder = others[Math.floor(Math.random() * others.length)];
      setTimeout(() => setTypingUserId(responder), 600);
      setTimeout(() => {
        setTypingUserId(null);
        const replies = [
          "Got it 👍",
          "Makes sense to me.",
          "Let's sync on this later.",
          "Nice — thanks for the update!",
          "Will take a look shortly.",
          "🔥",
        ];
        const reply: Message = {
          id: `m_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
          userId: responder,
          content: replies[Math.floor(Math.random() * replies.length)],
          timestamp: Date.now(),
          reactions: [],
        };
        updateConversation(active.id, (c) => ({
          ...c,
          messages: [...c.messages, reply],
        }));
      }, 2400);
    }
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

  const createChannel = (name: string) => {
    const id = `c_${Date.now()}`;
    const channel: Conversation = {
      id,
      type: "channel",
      name: name.toLowerCase().replace(/\s+/g, "-"),
      topic: "",
      members: [CURRENT_USER_ID],
      messages: [],
    };
    setConversations((prev) => [...prev, channel]);
    setActiveId(id);
  };

  const addMember = (userId: string) => {
    updateConversation(active.id, (c) =>
      c.members.includes(userId)
        ? c
        : { ...c, members: [...c.members, userId] },
    );
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
    const u = USERS[userId];
    const id = `dm_${userId}_${Date.now()}`;
    const dm: Conversation = {
      id,
      type: "dm",
      name: u?.name ?? "Direct message",
      members: [CURRENT_USER_ID, userId],
      messages: [],
    };
    setConversations((prev) => [...prev, dm]);
    setActiveId(id);
    setSidebarOpen(false);
  };

  return (
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
  );
}
