import { useState } from "react";
import {
  Smile,
  Pencil,
  Trash2,
  Pin,
  MoreHorizontal,
  Check,
  X,
} from "lucide-react";
import type { Message } from "@/lib/chat-data";
import { USERS, CURRENT_USER_ID, REACTION_EMOJIS } from "@/lib/chat-data";
import { cn, formatTime, initials } from "@/lib/format";

type Props = {
  message: Message;
  showHeader: boolean;
  onReact: (emoji: string) => void;
  onEdit: (content: string) => void;
  onDelete: () => void;
  onPin: () => void;
};

export function MessageItem({
  message,
  showHeader,
  onReact,
  onEdit,
  onDelete,
  onPin,
}: Props) {
  const user = USERS[message.userId];
  const isMe = message.userId === CURRENT_USER_ID;
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(message.content);
  const [pickerOpen, setPickerOpen] = useState(false);

  const submitEdit = () => {
    const t = draft.trim();
    if (t && t !== message.content) onEdit(t);
    setEditing(false);
  };

  return (
    <div
      className={cn(
        "group relative flex gap-3 rounded-md px-2 py-1 transition-colors hover:bg-accent/30",
        message.pinned && "border-l-2 border-mention bg-mention/5",
      )}
    >
      {/* Avatar / time gutter */}
      <div className="w-10 shrink-0 pt-0.5">
        {showHeader ? (
          <div
            className="flex h-9 w-9 items-center justify-center rounded-md text-sm font-semibold"
            style={{
              background: user.avatarColor,
              color: "oklch(0.18 0.012 280)",
            }}
          >
            {initials(user.name)}
          </div>
        ) : (
          <div className="flex h-5 items-center justify-center text-[10px] text-muted-foreground opacity-0 group-hover:opacity-100">
            {formatTime(message.timestamp)}
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        {showHeader && (
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-bold">{user.name}</span>
            <span className="text-xs text-muted-foreground">
              {formatTime(message.timestamp)}
            </span>
            {message.pinned && (
              <span className="flex items-center gap-0.5 text-[10px] font-medium uppercase text-mention">
                <Pin className="h-2.5 w-2.5" /> Pinned
              </span>
            )}
          </div>
        )}

        {editing ? (
          <div className="mt-1 rounded-md border border-border bg-card p-2">
            <textarea
              autoFocus
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  submitEdit();
                }
                if (e.key === "Escape") setEditing(false);
              }}
              className="w-full resize-none bg-transparent text-sm outline-none"
              rows={2}
            />
            <div className="mt-1 flex justify-end gap-1">
              <button
                onClick={() => setEditing(false)}
                className="flex items-center gap-1 rounded px-2 py-1 text-xs text-muted-foreground hover:bg-accent"
              >
                <X className="h-3 w-3" /> Cancel
              </button>
              <button
                onClick={submitEdit}
                className="flex items-center gap-1 rounded bg-primary px-2 py-1 text-xs font-medium text-primary-foreground hover:opacity-90"
              >
                <Check className="h-3 w-3" /> Save
              </button>
            </div>
          </div>
        ) : (
          <p className="wrap-break-word text-[15px] leading-relaxed text-foreground/95">
            {message.content}
            {message.edited && (
              <span className="ml-1 text-[11px] text-muted-foreground">
                (edited)
              </span>
            )}
          </p>
        )}

        {/* Reactions */}
        {message.reactions.length > 0 && (
          <div className="mt-1.5 flex flex-wrap gap-1">
            {message.reactions.map((r) => {
              const mine = r.users.includes(CURRENT_USER_ID);
              return (
                <button
                  key={r.emoji}
                  onClick={() => onReact(r.emoji)}
                  title={r.users.map((u) => USERS[u]?.name ?? u).join(", ")}
                  className={cn(
                    "flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs transition-colors",
                    mine
                      ? "border-primary/60 bg-primary/15 text-foreground"
                      : "border-border bg-card hover:border-primary/40",
                  )}
                >
                  <span>{r.emoji}</span>
                  <span className="font-medium">{r.users.length}</span>
                </button>
              );
            })}
            <button
              onClick={() => setPickerOpen((v) => !v)}
              className="flex items-center gap-1 rounded-full border border-border bg-card px-2 py-0.5 text-xs text-muted-foreground opacity-0 transition-opacity hover:text-foreground group-hover:opacity-100"
            >
              <Smile className="h-3 w-3" /> +
            </button>
          </div>
        )}
      </div>

      {/* Hover action bar */}
      <div className="absolute -top-3 right-3 z-10 hidden rounded-md border border-border bg-popover shadow-md group-hover:flex">
        <div className="relative flex items-center">
          {REACTION_EMOJIS.slice(0, 3).map((e) => (
            <button
              key={e}
              onClick={() => onReact(e)}
              className="px-1.5 py-1 text-base hover:bg-accent"
              aria-label={`React ${e}`}
            >
              {e}
            </button>
          ))}
          <button
            onClick={() => setPickerOpen((v) => !v)}
            className="border-l border-border p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"
            aria-label="More reactions"
          >
            <Smile className="h-4 w-4" />
          </button>
          <button
            onClick={onPin}
            className="border-l border-border p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"
            aria-label="Pin"
          >
            <Pin
              className={cn(
                "h-4 w-4",
                message.pinned && "fill-current text-mention",
              )}
            />
          </button>
          {isMe && (
            <>
              <button
                onClick={() => {
                  setDraft(message.content);
                  setEditing(true);
                }}
                className="border-l border-border p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"
                aria-label="Edit"
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                onClick={onDelete}
                className="border-l border-border p-1.5 text-muted-foreground hover:bg-accent hover:text-destructive"
                aria-label="Delete"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </>
          )}
          <button
            className="border-l border-border p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"
            aria-label="More"
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>

          {pickerOpen && (
            <div className="absolute -top-12 right-0 flex gap-1 rounded-lg border border-border bg-popover p-1.5 shadow-lg">
              {REACTION_EMOJIS.map((e) => (
                <button
                  key={e}
                  onClick={() => {
                    onReact(e);
                    setPickerOpen(false);
                  }}
                  className="rounded px-1.5 py-1 text-lg hover:bg-accent"
                >
                  {e}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
