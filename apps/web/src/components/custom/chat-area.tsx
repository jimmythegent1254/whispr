import { useEffect, useRef, useState, type ReactNode } from "react";
import { Hash, Users, Star, Pin } from "lucide-react";
import type { Conversation } from "@/lib/chat-data";
import { USERS, CURRENT_USER_ID } from "@/lib/chat-data";
import { MessageItem } from "./message-item";
import { Composer } from "./composer";
import { formatDay } from "@/lib/format";

type Props = {
  conversation: Conversation;
  typingUserId: string | null;
  onSend: (content: string) => void;
  onReact: (messageId: string, emoji: string) => void;
  onEdit: (messageId: string, content: string) => void;
  onDelete: (messageId: string) => void;
  onPin: (messageId: string) => void;
  rightAction?: ReactNode;
};

export function ChatArea({
  conversation,
  typingUserId,
  onSend,
  onReact,
  onEdit,
  onDelete,
  onPin,
  rightAction,
}: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [composerHeight, setComposerHeight] = useState(0);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [conversation.messages.length, conversation.id, typingUserId]);

  const isDM = conversation.type === "dm";
  const otherUser = isDM
    ? USERS[conversation.members.find((m) => m !== CURRENT_USER_ID) ?? ""]
    : null;

  // Group consecutive messages by same user within 5 mins
  const grouped: {
    day: string;
    items: {
      msg: (typeof conversation.messages)[number];
      showHeader: boolean;
    }[];
  }[] = [];
  let lastDay = "";
  let lastUserId = "";
  let lastTs = 0;
  for (const msg of conversation.messages) {
    const day = formatDay(msg.timestamp);
    if (day !== lastDay) {
      grouped.push({ day, items: [] });
      lastDay = day;
      lastUserId = "";
    }
    const showHeader =
      msg.userId !== lastUserId || msg.timestamp - lastTs > 5 * 60_000;
    grouped[grouped.length - 1].items.push({ msg, showHeader });
    lastUserId = msg.userId;
    lastTs = msg.timestamp;
  }

  const pinnedCount = conversation.messages.filter((m) => m.pinned).length;
  const typingUser = typingUserId ? USERS[typingUserId] : null;

  return (
    <div className="relative flex h-full min-h-0 flex-1 flex-col bg-background">
      {/* Header */}
      <header className="flex shrink-0 items-center justify-between border-b border-border bg-card/40 px-4 py-2.5 backdrop-blur">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex items-center gap-2">
            {isDM ? (
              <span className="relative">
                <span
                  className="flex h-7 w-7 items-center justify-center rounded text-xs font-semibold"
                  style={{
                    background: otherUser?.avatarColor,
                    color: "oklch(0.18 0.012 280)",
                  }}
                >
                  {otherUser?.name
                    .split(" ")
                    .map((p) => p[0])
                    .slice(0, 2)
                    .join("")}
                </span>
                {otherUser?.online && (
                  <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-card bg-online" />
                )}
              </span>
            ) : (
              <Hash className="h-5 w-5 text-muted-foreground" />
            )}
            <h2 className="truncate text-base font-semibold">
              {isDM ? otherUser?.name : conversation.name}
            </h2>
          </div>
          <button className="hidden rounded p-1 text-muted-foreground hover:bg-accent hover:text-foreground sm:block">
            <Star className="h-4 w-4" />
          </button>
          {conversation.topic && (
            <>
              <span className="hidden h-4 w-px bg-border sm:block" />
              <p className="hidden truncate text-sm text-muted-foreground sm:block">
                {conversation.topic}
              </p>
            </>
          )}
        </div>
        <div className="flex items-center gap-1">
          {pinnedCount > 0 && (
            <span className="hidden items-center gap-1 rounded-md px-2 py-1 text-xs text-muted-foreground hover:bg-accent sm:flex">
              <Pin className="h-3.5 w-3.5" /> {pinnedCount}
            </span>
          )}
          <span className="hidden items-center gap-1 rounded-md px-2 py-1 text-xs text-muted-foreground hover:bg-accent sm:flex">
            <Users className="h-3.5 w-3.5" /> {conversation.members.length}
          </span>
          {rightAction}
        </div>
      </header>

      {/* Messages */}
      <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto max-w-4xl px-2 py-6 sm:px-4">
          {/* Channel intro */}
          <div className="mb-6 px-2">
            {isDM ? (
              <div className="flex flex-col items-start gap-2">
                <span
                  className="flex h-12 w-12 items-center justify-center rounded-lg text-lg font-semibold"
                  style={{
                    background: otherUser?.avatarColor,
                    color: "oklch(0.18 0.012 280)",
                  }}
                >
                  {otherUser?.name
                    .split(" ")
                    .map((p) => p[0])
                    .slice(0, 2)
                    .join("")}
                </span>
                <h3 className="text-2xl font-bold">{otherUser?.name}</h3>
                <p className="text-sm text-muted-foreground">
                  This is the very beginning of your direct message history with{" "}
                  <span className="font-medium text-foreground">
                    {otherUser?.name}
                  </span>
                  .
                </p>
              </div>
            ) : (
              <>
                <h3 className="text-2xl font-bold"># {conversation.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  This is the start of the{" "}
                  <span className="font-medium text-foreground">
                    #{conversation.name}
                  </span>{" "}
                  channel.
                  {conversation.topic ? ` ${conversation.topic}.` : ""}
                </p>
              </>
            )}
          </div>

          {grouped.map((g, gi) => (
            <div key={gi}>
              <div className="my-4 flex items-center gap-3 px-2">
                <span className="h-px flex-1 bg-border" />
                <span className="rounded-full border border-border bg-card px-3 py-0.5 text-xs font-semibold text-muted-foreground">
                  {g.day}
                </span>
                <span className="h-px flex-1 bg-border" />
              </div>
              {g.items.map(({ msg, showHeader }) => (
                <MessageItem
                  key={msg.id}
                  message={msg}
                  showHeader={showHeader}
                  onReact={(emoji) => onReact(msg.id, emoji)}
                  onEdit={(content) => onEdit(msg.id, content)}
                  onDelete={() => onDelete(msg.id)}
                  onPin={() => onPin(msg.id)}
                />
              ))}
            </div>
          ))}

          <div className="h-2" style={{ marginBottom: composerHeight }} />
        </div>
      </div>

      {/* Typing indicator */}
      <div className="pointer-events-none px-6 pb-1 text-xs text-muted-foreground">
        {typingUser ? (
          <span className="inline-flex items-center gap-2">
            <span className="inline-flex gap-0.5">
              <span className="typing-dot inline-block h-1.5 w-1.5 rounded-full bg-muted-foreground" />
              <span className="typing-dot inline-block h-1.5 w-1.5 rounded-full bg-muted-foreground" />
              <span className="typing-dot inline-block h-1.5 w-1.5 rounded-full bg-muted-foreground" />
            </span>
            <span>
              <span className="font-medium text-foreground">
                {typingUser.name}
              </span>{" "}
              is typing…
            </span>
          </span>
        ) : (
          <span className="opacity-0">placeholder</span>
        )}
      </div>

      <Composer
        placeholder={
          isDM ? `Message ${otherUser?.name}` : `Message #${conversation.name}`
        }
        onSend={onSend}
        onHeightChange={setComposerHeight}
      />
    </div>
  );
}
