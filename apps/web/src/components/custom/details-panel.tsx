import { useState } from "react";
import {
  Bell,
  Pin,
  Star,
  Hash,
  Settings,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import type { Conversation } from "@/lib/chat-data";
import { CURRENT_USER_ID } from "@/lib/chat-data";
import { useUsers } from "@/lib/user-context";
import { initials } from "@/lib/format";

type Section = "about" | "members" | "settings";

export function DetailsPanel({ conversation }: { conversation: Conversation }) {
  const [open, setOpen] = useState<Record<Section, boolean>>({
    about: true,
    members: true,
    settings: false,
  });
  const users = useUsers();
  const isDM = conversation.type === "dm";
  const other = isDM
    ? users[conversation.members.find((m) => m !== CURRENT_USER_ID) ?? ""]
    : null;
  const pinned = conversation.messages.filter((m) => m.pinned);

  const toggle = (k: Section) => setOpen((o) => ({ ...o, [k]: !o[k] }));

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-border px-4 py-3">
        <h3 className="font-semibold">Details</h3>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Hero */}
        <div className="border-b border-border p-4">
          {isDM ? (
            <div className="flex items-center gap-3">
              <div className="relative">
                <span
                  className="flex h-12 w-12 items-center justify-center rounded-lg text-base font-semibold"
                  style={{
                    background: other?.avatarColor,
                    color: "oklch(0.18 0.012 280)",
                  }}
                >
                  {other ? initials(other.name) : "?"}
                </span>
                {other?.online && (
                  <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-card bg-online" />
                )}
              </div>
              <div className="min-w-0">
                <div className="truncate font-semibold">{other?.name}</div>
                <div className="truncate text-xs text-muted-foreground">
                  {other?.title}
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-2 text-base font-semibold">
                <Hash className="h-4 w-4 text-muted-foreground" />{" "}
                {conversation.name}
              </div>
              {conversation.topic && (
                <p className="mt-1 text-xs text-muted-foreground">
                  {conversation.topic}
                </p>
              )}
            </div>
          )}

          <div className="mt-3 grid grid-cols-3 gap-2">
            {[
              { icon: Bell, label: "Notify" },
              { icon: Star, label: "Star" },
              { icon: Pin, label: `Pins · ${pinned.length}` },
            ].map(({ icon: Icon, label }) => (
              <button
                key={label}
                className="flex flex-col items-center gap-1 rounded-md border border-border bg-card px-2 py-2 text-[11px] text-muted-foreground hover:border-primary/40 hover:text-foreground"
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* About */}
        <Section
          title="About"
          open={open.about}
          onToggle={() => toggle("about")}
        >
          <dl className="space-y-2 text-sm">
            <Row label="Topic" value={conversation.topic || "—"} />
            <Row
              label="Type"
              value={isDM ? "Direct Message" : "Public channel"}
            />
            <Row label="Created" value="Apr 2026" />
          </dl>
        </Section>

        {/* Members */}
        <Section
          title={`Members · ${conversation.members.length}`}
          open={open.members}
          onToggle={() => toggle("members")}
        >
          <ul className="space-y-1">
            {conversation.members.map((id) => {
              const u = users[id];
              if (!u) return null;
              return (
                <li
                  key={id}
                  className="flex items-center gap-2.5 rounded-md px-2 py-1.5 hover:bg-accent/50"
                >
                  <span className="relative">
                    <span
                      className="flex h-7 w-7 items-center justify-center rounded text-[11px] font-semibold"
                      style={{
                        background: u.avatarColor,
                        color: "oklch(0.18 0.012 280)",
                      }}
                    >
                      {initials(u.name)}
                    </span>
                    {u.online && (
                      <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full border border-card bg-online" />
                    )}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium">
                      {u.name}
                      {id === CURRENT_USER_ID && (
                        <span className="ml-1 text-xs text-muted-foreground">
                          (you)
                        </span>
                      )}
                    </div>
                    <div className="truncate text-[11px] text-muted-foreground">
                      {u.title}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </Section>

        {/* Settings */}
        <Section
          title="Settings"
          open={open.settings}
          onToggle={() => toggle("settings")}
        >
          <ul className="space-y-1 text-sm">
            {[
              "Notifications",
              "Mute channel",
              "Hide from sidebar",
              "Leave channel",
            ].map((s) => (
              <li key={s}>
                <button className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-muted-foreground hover:bg-accent/50 hover:text-foreground">
                  <Settings className="h-3.5 w-3.5" />
                  {s}
                </button>
              </li>
            ))}
          </ul>
        </Section>
      </div>
    </div>
  );
}

function Section({
  title,
  open,
  onToggle,
  children,
}: {
  title: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-border">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between px-4 py-2.5 text-sm font-semibold hover:bg-accent/30"
      >
        {title}
        {open ? (
          <ChevronDown className="h-4 w-4" />
        ) : (
          <ChevronRight className="h-4 w-4" />
        )}
      </button>
      {open && <div className="px-4 pb-3">{children}</div>}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <dt className="text-xs uppercase tracking-wider text-muted-foreground">
        {label}
      </dt>
      <dd className="max-w-[60%] text-right text-sm">{value}</dd>
    </div>
  );
}
