import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "header" | "footer" | "main";
  id?: string;
};

export function PublicContainer({
  children,
  className = "",
  as: Tag = "div",
  id,
}: Props) {
  return (
    <Tag id={id} className={`mx-auto w-full max-w-7xl px-6 ${className}`}>
      {children}
    </Tag>
  );
}
