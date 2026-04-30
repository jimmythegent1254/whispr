import { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, UserPlus, Check } from "lucide-react";
import type { Conversation, User } from "@/lib/chat-data";
import { CURRENT_USER_ID } from "@/lib/chat-data";
import { useUsers } from "@/lib/user-context";
import { initials } from "@/lib/format";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  conversation: Conversation;
  onAddMember: (userId: string) => void;
};

export function MembersDialog({
  open,
  onOpenChange,
  conversation,
  onAddMember,
}: Props) {
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<"members" | "add">("members");

  const memberSet = useMemo(
    () => new Set(conversation.members),
    [conversation.members],
  );
  const users = useUsers();
  const allUsers = Object.values(users) as User[];

  const filteredMembers = allUsers.filter(
    (u) =>
      memberSet.has(u.id) && u.name.toLowerCase().includes(query.toLowerCase()),
  );
  const addable = allUsers.filter(
    (u) =>
      !memberSet.has(u.id) &&
      u.name.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-0">
        <DialogHeader className="border-b border-border px-5 pt-5 pb-3">
          <DialogTitle>#{conversation.name}</DialogTitle>
          <DialogDescription>
            {conversation.members.length}{" "}
            {conversation.members.length === 1 ? "member" : "members"}
          </DialogDescription>
        </DialogHeader>

        <div className="flex border-b border-border px-5">
          {(["members", "add"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`relative px-3 py-2 text-sm font-medium transition-colors ${
                tab === t
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t === "members" ? "Members" : "Add people"}
              {tab === t && (
                <span className="absolute inset-x-0 -bottom-px h-0.5 bg-primary" />
              )}
            </button>
          ))}
        </div>

        <div className="px-5 pt-3">
          <div className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={
                tab === "members" ? "Find members" : "Search people to add"
              }
              className="pl-8"
            />
          </div>
        </div>

        <ul className="max-h-80 overflow-y-auto px-2 py-2">
          {(tab === "members" ? filteredMembers : addable).map((u) => {
            const isMe = u.id === CURRENT_USER_ID;
            return (
              <li
                key={u.id}
                className="flex items-center gap-3 rounded-md px-3 py-2 hover:bg-accent/50"
              >
                <span className="relative">
                  <span
                    className="flex h-9 w-9 items-center justify-center rounded text-xs font-semibold"
                    style={{
                      background: u.avatarColor,
                      color: "oklch(0.18 0.012 280)",
                    }}
                  >
                    {initials(u.name)}
                  </span>
                  {u.online && (
                    <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-background bg-online" />
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">
                    {u.name}
                    {isMe && (
                      <span className="ml-1 text-xs text-muted-foreground">
                        (you)
                      </span>
                    )}
                  </div>
                  <div className="truncate text-xs text-muted-foreground">
                    {u.title}
                  </div>
                </div>
                {tab === "add" ? (
                  <Button size="sm" onClick={() => onAddMember(u.id)}>
                    <UserPlus className="h-3.5 w-3.5" /> Add
                  </Button>
                ) : (
                  <span className="text-xs text-muted-foreground">
                    {u.online ? "Active" : "Away"}
                  </span>
                )}
              </li>
            );
          })}
          {(tab === "members" ? filteredMembers : addable).length === 0 && (
            <li className="px-3 py-8 text-center text-sm text-muted-foreground">
              {tab === "add" ? (
                <span className="inline-flex items-center gap-2">
                  <Check className="h-4 w-4" /> Everyone is already in this
                  channel
                </span>
              ) : (
                "No matches"
              )}
            </li>
          )}
        </ul>
      </DialogContent>
    </Dialog>
  );
}
