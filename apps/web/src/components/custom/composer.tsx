import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  Send,
  Paperclip,
  Smile,
  AtSign,
  Bold,
  Italic,
  Code,
} from "lucide-react";

type Props = {
  placeholder: string;
  onSend: (content: string) => void;
  onHeightChange?: (h: number) => void;
};

export function Composer({ placeholder, onSend, onHeightChange }: Props) {
  const [value, setValue] = useState("");
  const taRef = useRef<HTMLTextAreaElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  const submit = () => {
    const t = value.trim();
    if (!t) return;
    onSend(t);
    setValue("");
  };

  useLayoutEffect(() => {
    const ta = taRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 200) + "px";
  }, [value]);

  useEffect(() => {
    if (!wrapRef.current || !onHeightChange) return;
    const ro = new ResizeObserver(([entry]) => {
      onHeightChange(entry.contentRect.height);
    });
    ro.observe(wrapRef.current);
    return () => ro.disconnect();
  }, [onHeightChange]);

  return (
    <div ref={wrapRef} className="shrink-0 px-3 pb-3 sm:px-6 sm:pb-4">
      <div className="mx-auto max-w-4xl">
        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/30">
          <div className="flex items-center gap-1 border-b border-border/60 px-2 py-1 text-muted-foreground">
            {[Bold, Italic, Code].map((Icon, i) => (
              <button
                key={i}
                className="rounded p-1 hover:bg-accent hover:text-foreground"
                aria-label="format"
              >
                <Icon className="h-3.5 w-3.5" />
              </button>
            ))}
          </div>
          <textarea
            ref={taRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                submit();
              }
            }}
            placeholder={placeholder}
            rows={1}
            className="block max-h-50 w-full resize-none bg-transparent px-3 py-2.5 text-[15px] outline-none placeholder:text-muted-foreground"
          />
          <div className="flex items-center justify-between px-2 py-1.5">
            <div className="flex items-center gap-0.5 text-muted-foreground">
              <button
                className="rounded p-1.5 hover:bg-accent hover:text-foreground"
                aria-label="Attach"
              >
                <Paperclip className="h-4 w-4" />
              </button>
              <button
                className="rounded p-1.5 hover:bg-accent hover:text-foreground"
                aria-label="Mention"
              >
                <AtSign className="h-4 w-4" />
              </button>
              <button
                className="rounded p-1.5 hover:bg-accent hover:text-foreground"
                aria-label="Emoji"
              >
                <Smile className="h-4 w-4" />
              </button>
            </div>
            <button
              onClick={submit}
              disabled={!value.trim()}
              className="flex items-center gap-1.5 rounded-md bg-primary px-2.5 py-1.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Send className="h-3.5 w-3.5" />
              Send
            </button>
          </div>
        </div>
        <p className="mt-1.5 px-1 text-[11px] text-muted-foreground">
          <kbd className="rounded border border-border bg-card px-1">Enter</kbd>{" "}
          to send ·{" "}
          <kbd className="rounded border border-border bg-card px-1">
            Shift+Enter
          </kbd>{" "}
          for new line
        </p>
      </div>
    </div>
  );
}
