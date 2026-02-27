"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Components } from "react-markdown";

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function chapterId(text: string) {
  const match = text.match(/^Chapter\s+(\d+)/i);
  return match ? `chapter-${match[1]}` : slugify(text);
}

const components: Components = {
  h1: ({ children }) => {
    const text = String(children);
    return (
      <h1
        id={chapterId(text)}
        className="text-2xl sm:text-3xl font-bold mt-20 mb-6 pt-8 border-t border-surface-border first:border-0 first:mt-0 first:pt-0 scroll-mt-20"
      >
        <span className="text-accent">{text}</span>
      </h1>
    );
  },
  h2: ({ children }) => {
    const text = String(children);
    return (
      <h2
        id={slugify(text)}
        className="text-xl sm:text-2xl font-semibold mt-12 mb-4 text-white/90 scroll-mt-20"
      >
        {children}
      </h2>
    );
  },
  h3: ({ children }) => (
    <h3 className="text-lg font-semibold mt-8 mb-3 text-white/80">
      {children}
    </h3>
  ),
  p: ({ children }) => (
    <p className="text-white/70 leading-relaxed mb-4">{children}</p>
  ),
  strong: ({ children }) => (
    <strong className="text-white font-semibold">{children}</strong>
  ),
  em: ({ children }) => (
    <em className="text-white/80 italic">{children}</em>
  ),
  a: ({ href, children }) => (
    <a
      href={href}
      className="text-accent hover:text-accent/80 underline underline-offset-2 transition-colors"
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  ),
  ul: ({ children }) => (
    <ul className="list-disc list-outside ml-6 mb-4 space-y-2 text-white/70">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal list-outside ml-6 mb-4 space-y-2 text-white/70">
      {children}
    </ol>
  ),
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  blockquote: ({ children }) => (
    <blockquote className="border-l-2 border-accent/40 pl-4 my-4 text-white/50 italic">
      {children}
    </blockquote>
  ),
  code: ({ className, children }) => {
    const isBlock = className?.includes("language-");
    if (isBlock) {
      return (
        <code className="text-sm">{children}</code>
      );
    }
    return (
      <code className="bg-surface-light text-accent/90 px-1.5 py-0.5 rounded text-sm font-mono">
        {children}
      </code>
    );
  },
  pre: ({ children }) => (
    <pre className="bg-surface-light border border-surface-border rounded-lg p-4 my-4 overflow-x-auto font-mono text-sm text-white/80">
      {children}
    </pre>
  ),
  hr: () => <hr className="border-surface-border my-8" />,
  table: ({ children }) => (
    <div className="overflow-x-auto my-4">
      <table className="w-full text-sm text-white/70 border-collapse">
        {children}
      </table>
    </div>
  ),
  thead: ({ children }) => (
    <thead className="border-b border-surface-border text-white/90 font-semibold">
      {children}
    </thead>
  ),
  th: ({ children }) => (
    <th className="text-left px-3 py-2">{children}</th>
  ),
  td: ({ children }) => (
    <td className="px-3 py-2 border-b border-surface-border/50">{children}</td>
  ),
};

export default function GuideContent({ markdown }: { markdown: string }) {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
      {markdown}
    </ReactMarkdown>
  );
}
