import React from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/cjs/styles/prism";
import remarkGfm from "remark-gfm";

const MarkdownRenderer = ({ content }) => {
  return (
    <div className="text-neutral-700">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ node, ...props }) => (
            <h1 className="mt-4 mb-2 text-xl font-bold" {...props} />
          ),
          h2: ({ node, ...props }) => (
            <h2 className="mt-4 mb-2 text-lg font-bold" {...props} />
          ),
          h3: ({ node, ...props }) => (
            <h3 className="text-md mt-4 mb-2 font-bold" {...props} />
          ),
          h4: ({ node, ...props }) => (
            <h4 className="mt-4 mb-2 text-sm font-bold" {...props} />
          ),
          p: ({ node, ...props }) => (
            <p className="mb-2 leading-relaxed" {...props} />
          ),
          a: ({ node, ...props }) => (
            <a className="text-[#00d492] hover:underline" {...props} />
          ),
          ul: ({ node, ...props }) => (
            <ul className="mb-2 ml-4 list-inside list-disc" {...props} />
          ),
          ol: ({ node, ...props }) => (
            <ol className="mb-2 ml-4 list-inside list-decimal" {...props} />
          ),
          li: ({ node, ...props }) => <li className="mb-1" {...props} />,
          strong: ({ node, ...props }) => (
            <strong className="font-semibold" {...props} />
          ),
          em: ({ node, ...props }) => <em className="italic" {...props} />,
          blockquote: ({ node, ...props }) => (
            <blockquote
              className="my-4 border-l-4 border-neutral-300 pl-4 text-neutral-600 italic"
              {...props}
            />
          ),
          code: ({ node, inline, className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || "");
            return !inline && match ? (
              <SyntaxHighlighter
                style={dracula}
                language={match[1]}
                PreTag="div"
                {...props}
              >
                {String(children).replace(/\n$/, "")}
              </SyntaxHighlighter>
            ) : (
              <code
                className="rounded bg-neutral-100 p-1 font-mono text-sm"
                {...props}
              >
                {children}
              </code>
            );
          },
          pre: ({ node, ...props }) => (
            <pre
              className="my-4 overflow-x-auto rounded-md bg-neutral-800 p-3 font-mono text-sm text-white"
              {...props}
            />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;
