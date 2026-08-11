"use client";

import { useRef, useState, useCallback } from "react";
import { MarkdownContent } from "@/components/public/markdown-content";

type Props = {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  rows?: number;
  mediaOptions?: { path: string; label: string }[];
};

type ToolbarAction = {
  label: string;
  title: string;
  action: (textarea: HTMLTextAreaElement, value: string) => { value: string; selStart: number; selEnd: number };
};

function wrapSelection(
  textarea: HTMLTextAreaElement,
  value: string,
  before: string,
  after: string,
  placeholder: string,
): { value: string; selStart: number; selEnd: number } {
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const selected = value.slice(start, end) || placeholder;
  const newValue = value.slice(0, start) + before + selected + after + value.slice(end);
  return {
    value: newValue,
    selStart: start + before.length,
    selEnd: start + before.length + selected.length,
  };
}

function insertAtCursor(
  textarea: HTMLTextAreaElement,
  value: string,
  text: string,
): { value: string; selStart: number; selEnd: number } {
  const pos = textarea.selectionStart;
  const prefix = pos > 0 && value[pos - 1] !== "\n" ? "\n" : "";
  const insert = prefix + text;
  const newValue = value.slice(0, pos) + insert + value.slice(pos);
  return {
    value: newValue,
    selStart: pos + insert.length,
    selEnd: pos + insert.length,
  };
}

const TOOLBAR_ACTIONS: ToolbarAction[] = [
  {
    label: "B",
    title: "Удебелен текст",
    action: (ta, v) => wrapSelection(ta, v, "**", "**", "удебелен текст"),
  },
  {
    label: "I",
    title: "Курсивен текст",
    action: (ta, v) => wrapSelection(ta, v, "*", "*", "курсивен текст"),
  },
  {
    label: "H2",
    title: "Заглавие 2",
    action: (ta, v) => insertAtCursor(ta, v, "## Заглавие"),
  },
  {
    label: "H3",
    title: "Заглавие 3",
    action: (ta, v) => insertAtCursor(ta, v, "### Подзаглавие"),
  },
  {
    label: "•",
    title: "Списък",
    action: (ta, v) => insertAtCursor(ta, v, "- Елемент"),
  },
  {
    label: "🔗",
    title: "Линк",
    action: (ta, v) => wrapSelection(ta, v, "[", "](https://)", "текст на линка"),
  },
  {
    label: "🖼",
    title: "Снимка (markdown)",
    action: (ta, v) => insertAtCursor(ta, v, "![описание](image_path_or_url)"),
  },
  {
    label: "❝",
    title: "Цитат",
    action: (ta, v) => insertAtCursor(ta, v, "> Цитат"),
  },
];

export function MarkdownEditor({
  id,
  value,
  onChange,
  disabled = false,
  rows = 16,
  mediaOptions = [],
}: Props) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [tab, setTab] = useState<"edit" | "preview">("edit");

  const applyAction = useCallback(
    (action: ToolbarAction["action"]) => {
      const ta = textareaRef.current;
      if (!ta) return;
      const result = action(ta, value);
      onChange(result.value);
      requestAnimationFrame(() => {
        ta.focus();
        ta.setSelectionRange(result.selStart, result.selEnd);
      });
    },
    [value, onChange],
  );

  const insertMedia = useCallback(
    (path: string) => {
      const ta = textareaRef.current;
      if (!ta) return;
      const result = insertAtCursor(ta, value, `![изображение](${path})`);
      onChange(result.value);
    },
    [value, onChange],
  );

  const fieldClass =
    "w-full rounded-lg border border-border bg-bg px-3 py-2 text-text outline-none focus:border-primary disabled:opacity-60 font-mono text-sm";

  return (
    <div>
      {/* Tabs */}
      <div className="mb-2 flex items-center gap-1 rounded-lg border border-border bg-bg-secondary p-1">
        <button
          type="button"
          onClick={() => setTab("edit")}
          className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
            tab === "edit"
              ? "bg-bg text-primary shadow-sm"
              : "text-text-muted hover:text-text"
          }`}
        >
          Редакция
        </button>
        <button
          type="button"
          onClick={() => setTab("preview")}
          className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
            tab === "preview"
              ? "bg-bg text-primary shadow-sm"
              : "text-text-muted hover:text-text"
          }`}
        >
          Преглед
        </button>
      </div>

      {tab === "edit" ? (
        <>
          {/* Toolbar */}
          <div className="mb-1 flex flex-wrap items-center gap-1 rounded-t-lg border border-b-0 border-border bg-bg-secondary px-2 py-1.5">
            {TOOLBAR_ACTIONS.map((action) => (
              <button
                key={action.label}
                type="button"
                title={action.title}
                disabled={disabled}
                onClick={() => applyAction(action.action)}
                className="rounded px-2.5 py-1 text-sm font-medium text-text-muted transition-colors hover:bg-bg hover:text-primary disabled:opacity-40"
              >
                {action.label}
              </button>
            ))}
            {mediaOptions.length > 0 ? (
              <>
                <span className="mx-1 h-5 w-px bg-border" />
                <select
                  disabled={disabled}
                  onChange={(e) => {
                    if (e.target.value) insertMedia(e.target.value);
                    e.target.value = "";
                  }}
                  className="rounded border border-border bg-bg px-2 py-1 text-xs text-text-muted outline-none"
                  defaultValue=""
                >
                  <option value="">+ Снимка от медия</option>
                  {mediaOptions.map((opt) => (
                    <option key={opt.path} value={opt.path}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </>
            ) : null}
          </div>

          {/* Textarea */}
          <textarea
            ref={textareaRef}
            id={id}
            rows={rows}
            required
            disabled={disabled}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={`${fieldClass} rounded-t-none`}
          />
        </>
      ) : (
        <div className="min-h-[12rem] rounded-lg border border-border bg-bg p-4">
          {value.trim() ? (
            <MarkdownContent content={value} />
          ) : (
            <p className="text-sm text-text-muted italic">Няма съдържание за преглед.</p>
          )}
        </div>
      )}
    </div>
  );
}
