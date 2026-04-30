import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Search, MessageCircle } from "lucide-react";
import type { User } from "@/lib/chat-data";
import { CURRENT_USER_ID } from "@/lib/chat-data";
import { useUsers } from "@/lib/user-context";
import { initials } from "@/lib/format";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onStartChat: (userId: string) => void;
};

export function NewChatDialog({ open, onOpenChange, onStartChat }: Props) {
  const [query, setQuery] = useState("");
  const users = Object.values(useUsers()) as User[];
  const filteredUsers = users.filter(
    (u) =>
      u.id !== CURRENT_USER_ID &&
      u.name.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-0">
        <DialogHeader className="border-b border-border px-5 pt-5 pb-3">
          <DialogTitle>New message</DialogTitle>
          <DialogDescription>
            Find a teammate to start a direct message.
          </DialogDescription>
        </DialogHeader>

        <div className="px-5 pt-3">
          <div className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search people in your workspace"
              className="pl-8"
            />
          </div>
        </div>

        <ul className="max-h-80 overflow-y-auto px-2 py-2">
          {filteredUsers.map((u) => (
            <li key={u.id}>
              <button
                onClick={() => {
                  onStartChat(u.id);
                  onOpenChange(false);
                  setQuery("");
                }}
                className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left hover:bg-accent/50"
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
                  <div className="truncate text-sm font-medium">{u.name}</div>
                  <div className="truncate text-xs text-muted-foreground">
                    {u.title}
                  </div>
                </div>
                <MessageCircle className="h-4 w-4 text-muted-foreground" />
              </button>
            </li>
          ))}
          {filteredUsers.length === 0 && (
            <li className="px-3 py-8 text-center text-sm text-muted-foreground">
              No people match “{query}”.
            </li>
          )}
        </ul>
      </DialogContent>
    </Dialog>
  );
}
