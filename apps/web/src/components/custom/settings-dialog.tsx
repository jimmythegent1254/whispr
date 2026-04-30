import { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Camera, Bell, Moon, Globe, KeyRound } from "lucide-react";
import type { User } from "@/lib/chat-data";
import { initials } from "@/lib/format";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  user: User;
  onSave: (updates: {
    name: string;
    title?: string;
    avatarUrl?: string;
  }) => void;
};

export function SettingsDialog({ open, onOpenChange, user, onSave }: Props) {
  const [name, setName] = useState(user.name);
  const [title, setTitle] = useState(user.title ?? "");
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);
  const [tab, setTab] = useState<"profile" | "preferences">("profile");
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const url = URL.createObjectURL(f);
    setAvatarUrl(url);
  };

  const handleSave = () => {
    onSave({ name: name.trim() || user.name, title, avatarUrl });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg p-0">
        <DialogHeader className="border-b border-border px-5 pt-5 pb-3">
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Manage your profile and preferences.
          </DialogDescription>
        </DialogHeader>

        <div className="flex border-b border-border px-5">
          {(["profile", "preferences"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`relative px-3 py-2 text-sm font-medium capitalize transition-colors ${
                tab === t
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t}
              {tab === t && (
                <span className="absolute inset-x-0 -bottom-px h-0.5 bg-primary" />
              )}
            </button>
          ))}
        </div>

        {tab === "profile" ? (
          <div className="space-y-5 px-5 py-5">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="group relative h-20 w-20 overflow-hidden rounded-lg"
                style={
                  !avatarUrl ? { background: user.avatarColor } : undefined
                }
                aria-label="Upload avatar"
              >
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="Avatar preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span
                    className="flex h-full w-full items-center justify-center text-xl font-semibold"
                    style={{ color: "oklch(0.18 0.012 280)" }}
                  >
                    {initials(name || user.name)}
                  </span>
                )}
                <span className="absolute inset-0 flex items-center justify-center bg-black/50 text-white opacity-0 transition-opacity group-hover:opacity-100">
                  <Camera className="h-5 w-5" />
                </span>
              </button>
              <div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fileRef.current?.click()}
                >
                  <Camera className="h-3.5 w-3.5" /> Upload photo
                </Button>
                <p className="mt-2 text-xs text-muted-foreground">
                  PNG or JPG, up to 2MB.
                </p>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFile}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Display name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="title">What I do</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Product Designer"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                defaultValue="you@whispr.app"
                disabled
              />
            </div>
          </div>
        ) : (
          <ul className="divide-y divide-border px-2 py-2">
            {[
              {
                icon: Bell,
                title: "Notifications",
                desc: "Direct messages, mentions & keywords",
              },
              { icon: Moon, title: "Theme", desc: "Dark · matches system" },
              {
                icon: Globe,
                title: "Language & region",
                desc: "English (United States)",
              },
              {
                icon: KeyRound,
                title: "Account & security",
                desc: "Password, two-factor auth",
              },
            ].map(({ icon: Icon, title, desc }) => (
              <li key={title}>
                <button className="flex w-full items-center gap-3 rounded-md px-3 py-3 text-left hover:bg-accent/50">
                  <span className="flex h-9 w-9 items-center justify-center rounded-md bg-accent/60 text-foreground">
                    <Icon className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium">{title}</div>
                    <div className="truncate text-xs text-muted-foreground">
                      {desc}
                    </div>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}

        <DialogFooter className="border-t border-border px-5 py-3">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
