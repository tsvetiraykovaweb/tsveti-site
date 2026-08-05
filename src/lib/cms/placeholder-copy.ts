/**
 * Detect unfinished CMS template copy that should not show publicly.
 */
export function isCmsPlaceholderText(
  text: string | null | undefined,
): boolean {
  if (!text?.trim()) return true;
  return /\[Добавете|\[Добави|TODO:|FIXME:/i.test(text);
}

/** Drop list lines that are still editor placeholders. */
export function filterRealCmsLines(lines: string[]): string[] {
  return lines.filter((line) => !isCmsPlaceholderText(line));
}
