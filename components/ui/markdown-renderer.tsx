import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

interface MarkdownRendererProps {
	content: string;
	className?: string;
}

export function MarkdownRenderer({
	content,
	className = "",
}: MarkdownRendererProps) {
	return (
		<div className={className}>
			<ReactMarkdown
				remarkPlugins={[remarkGfm]}
				components={{
					h1: ({ children }) => (
						<h1 className="text-2xl font-bold mt-6 mb-4 first:mt-0">
							{children}
						</h1>
					),
					h2: ({ children }) => (
						<h2 className="text-xl font-bold mt-5 mb-3 first:mt-0">
							{children}
						</h2>
					),
					h3: ({ children }) => (
						<h3 className="text-lg font-semibold mt-4 mb-2 first:mt-0">
							{children}
						</h3>
					),
					h4: ({ children }) => (
						<h4 className="text-base font-semibold mt-3 mb-2 first:mt-0">
							{children}
						</h4>
					),
					h5: ({ children }) => (
						<h5 className="text-sm font-semibold mt-3 mb-2 first:mt-0">
							{children}
						</h5>
					),
					h6: ({ children }) => (
						<h6 className="text-xs font-semibold mt-3 mb-2 first:mt-0">
							{children}
						</h6>
					),
					p: ({ children }) => (
						<p className="mb-4 leading-7 last:mb-0">{children}</p>
					),
					strong: ({ children }) => (
						<strong className="font-semibold">{children}</strong>
					),
					em: ({ children }) => <em className="italic">{children}</em>,
					ul: ({ children }) => (
						<ul className="list-disc pl-6 mb-4 space-y-2 last:mb-0">
							{children}
						</ul>
					),
					ol: ({ children }) => (
						<ol className="list-decimal pl-6 mb-4 space-y-2 last:mb-0">
							{children}
						</ol>
					),
					li: ({ children }) => <li className="leading-7">{children}</li>,
					code({ className, children }) {
						const match = /language-(\w+)/.exec(className || "");
						return match ? (
							<SyntaxHighlighter
								style={vscDarkPlus as { [key: string]: React.CSSProperties }}
								language={match[1]}
								PreTag="div"
								className="text-sm rounded"
							>
								{String(children).replace(/\n$/, "")}
							</SyntaxHighlighter>
						) : (
							<code className="bg-secondary border-[1px] px-1 py-0.5 mx-0.5 rounded-md font-mono text-sm">
								{children}
							</code>
						);
					},
					pre: ({ children }) => <>{children}</>,
					blockquote: ({ children }) => (
						<blockquote className="border-l-4 border-primary pl-4 my-4 italic text-muted-foreground">
							{children}
						</blockquote>
					),
					hr: () => <hr className="my-6 border-border" />,
					a: ({ children, href }) => (
						<a
							href={href}
							className="text-primary underline underline-offset-4 hover:text-primary/80 transition-colors"
							target="_blank"
							rel="noopener noreferrer"
						>
							{children}
						</a>
					),
				}}
			>
				{content}
			</ReactMarkdown>
		</div>
	);
}
