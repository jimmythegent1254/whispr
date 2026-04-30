import { useState } from "react";
import {
  Hash,
  Plus,
  ChevronDown,
  ChevronRight,
  Lock,
  Settings,
  Edit3,
} from "lucide-react";
import type { Conversation, User } from "@/lib/chat-data";
import { CURRENT_USER_ID } from "@/lib/chat-data";
import { useUsers } from "@/lib/user-context";
import { cn, initials } from "@/lib/format";

type Props = {
  conversations: Conversation[];
  activeId: string;
  onSelect: (id: string) => void;
  onCreateChannel: (name: string) => void;
  onOpenSettings: () => void;
  onOpenNewChat: () => void;
  currentUser: User;
  currentAvatarUrl?: string;
};

export function Sidebar({
  conversations,
  activeId,
  onSelect,
  onCreateChannel,
  onOpenSettings,
  onOpenNewChat,
  currentUser,
  currentAvatarUrl,
}: Props) {
  const [chOpen, setChOpen] = useState(true);
  const [dmOpen, setDmOpen] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const users = useUsers();

  const channels = conversations.filter((c) => c.type === "channel");
  const dms = conversations.filter((c) => c.type === "dm");

  const submitNew = (e: React.FormEvent) => {
    e.preventDefault();
    const n = newName.trim();
    if (!n) return;
    onCreateChannel(n);
    setNewName("");
    setCreating(false);
  };

  return (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      {/* Workspace header */}
      <div className="flex items-center justify-between border-b border-sidebar-border px-4 py-3">
        <div>
          <h1 className="text-base font-bold tracking-tight">Whispr</h1>
          <div className="mt-0.5 flex items-center gap-1.5 text-xs text-sidebar-foreground/60">
            <span className="h-1.5 w-1.5 rounded-full bg-online" />
            <span>{currentUser.name}</span>
          </div>
        </div>
        <button
          onClick={onOpenSettings}
          className="h-8 w-8 overflow-hidden rounded-md ring-2 ring-transparent transition-all hover:ring-sidebar-border"
          style={
            !currentAvatarUrl
              ? { background: currentUser.avatarColor }
              : undefined
          }
          aria-label="Open settings"
        >
          {currentAvatarUrl ? (
            <img
              src={currentAvatarUrl}
              alt=""
              className="h-full w-full object-cover"
            />
          ) : (
            <span
              className="flex h-full w-full items-center justify-center text-xs font-semibold"
              style={{ color: "oklch(0.18 0.012 280)" }}
            >
              {initials(currentUser.name)}
            </span>
          )}
        </button>
      </div>

      {/* Quick actions */}
      <div className="flex items-center gap-1 border-b border-sidebar-border px-2 py-2">
        <button
          onClick={onOpenNewChat}
          className="flex flex-1 items-center gap-2 rounded-md px-2 py-1.5 text-sm text-sidebar-foreground/85 hover:bg-sidebar-border/50"
        >
          <Edit3 className="h-3.5 w-3.5" />
          New message
        </button>
        <button
          onClick={onOpenSettings}
          className="rounded-md p-2 text-sidebar-foreground/70 hover:bg-sidebar-border/50 hover:text-sidebar-foreground"
          aria-label="Settings"
        >
          <Settings className="h-4 w-4" />
        </button>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto px-2 py-3">
        {/* Channels */}
        <section>
          <button
            onClick={() => setChOpen((v) => !v)}
            className="group flex w-full items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/60 hover:text-sidebar-foreground"
          >
            {chOpen ? (
              <ChevronDown className="h-3 w-3" />
            ) : (
              <ChevronRight className="h-3 w-3" />
            )}
            <span>Channels</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setCreating(true);
                setChOpen(true);
              }}
              className="ml-auto rounded p-0.5 opacity-0 group-hover:opacity-100 hover:bg-sidebar-border"
              aria-label="Create channel"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </button>

          {chOpen && (
            <ul className="mt-1 space-y-0.5">
              {channels.map((c) => (
                <li key={c.id}>
                  <button
                    onClick={() => onSelect(c.id)}
                    className={cn(
                      "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors",
                      activeId === c.id
                        ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                        : "text-sidebar-foreground/85 hover:bg-sidebar-border/50",
                    )}
                  >
                    <Hash className="h-4 w-4 opacity-70" />
                    <span className="truncate">{c.name}</span>
                  </button>
                </li>
              ))}
              {creating && (
                <li>
                  <form onSubmit={submitNew} className="px-2 py-1">
                    <input
                      autoFocus
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      onBlur={() => {
                        if (!newName.trim()) setCreating(false);
                      }}
                      placeholder="new-channel"
                      className="w-full rounded-md border border-sidebar-border bg-background/40 px-2 py-1 text-sm outline-none focus:border-ring"
                    />
                  </form>
                </li>
              )}
              <li>
                <button
                  onClick={() => setCreating(true)}
                  className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-sidebar-foreground/60 hover:bg-sidebar-border/50 hover:text-sidebar-foreground"
                >
                  <span className="flex h-4 w-4 items-center justify-center rounded bg-sidebar-border/60">
                    <Plus className="h-3 w-3" />
                  </span>
                  Add channel
                </button>
              </li>
            </ul>
          )}
        </section>

        {/* DMs */}
        <section>
          <button
            onClick={() => setDmOpen((v) => !v)}
            className="flex w-full items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/60 hover:text-sidebar-foreground"
          >
            {dmOpen ? (
              <ChevronDown className="h-3 w-3" />
            ) : (
              <ChevronRight className="h-3 w-3" />
            )}
            <span>Direct messages</span>
          </button>

          {dmOpen && (
            <ul className="mt-1 space-y-0.5">
              {dms.map((c) => {
                const other = c.members.find((id) => id !== CURRENT_USER_ID);
                const u = other ? users[other] : null;
                return (
                  <li key={c.id}>
                    <button
                      onClick={() => onSelect(c.id)}
                      className={cn(
                        "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors",
                        activeId === c.id
                          ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                          : "text-sidebar-foreground/85 hover:bg-sidebar-border/50",
                      )}
                    >
                      <span className="relative">
                        <span
                          className="flex h-5 w-5 items-center justify-center rounded text-[10px] font-semibold"
                          style={{
                            background: u?.avatarColor,
                            color: "oklch(0.18 0.012 280)",
                          }}
                        >
                          {u ? initials(u.name) : "?"}
                        </span>
                        {u?.online && (
                          <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full border border-sidebar bg-online" />
                        )}
                      </span>
                      <span className="truncate">{u?.name ?? c.name}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>

      <div className="border-t border-sidebar-border px-3 py-2 text-xs text-sidebar-foreground/50">
        <div className="flex items-center gap-1.5">
          <Lock className="h-3 w-3" />
          UI prototype · in-memory only
        </div>
      </div>
    </div>
  );
}
