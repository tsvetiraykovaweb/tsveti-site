"use client";

import { useState } from "react";

type Props = {
  path: string;
};

export function CopyPathButton({ path }: Props) {
  const [copied, setCopied] = useState(false);

  async function onCopy() {
    try {
      await navigator.clipboard.writeText(path);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button
      type="button"
      onClick={onCopy}
      className="text-sm text-accent underline-offset-4 hover:underline"
    >
      {copied ? "Копирано" : "Копирай пътя"}
    </button>
  );
}
