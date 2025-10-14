"use client";

import { useRef, useEffect, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bot, Send, User } from "lucide-react";
import { MarkdownRenderer } from "@/components/ui/markdown-renderer";
import { ScrollArea } from "@/components/ui/scroll-area";

interface AIChatbotProps {
	materialId: string;
}

export function AIChatbot({ materialId }: AIChatbotProps) {
	const scrollAreaRef = useRef<HTMLDivElement>(null);
	const viewportRef = useRef<HTMLDivElement | null>(null);
	const [input, setInput] = useState("");

	const { messages, sendMessage, status } = useChat({
		transport: new DefaultChatTransport({
			api: "/api/ai/chat",
			body: { materialId },
		}),
	});

	messages[0] = {
		id: messages[0]?.id || "system",
		role: "assistant",
		parts: [
			{
				type: "text",
				text: "Hello! I'm your AI assistant. Ask me anything about this material and I'll help you understand it better.",
			},
		],
	};

	// Get the viewport element from ScrollArea
	useEffect(() => {
		if (scrollAreaRef.current && !viewportRef.current) {
			viewportRef.current = scrollAreaRef.current.querySelector(
				"[data-radix-scroll-area-viewport]"
			);
		}
	}, []);

	const scrollToBottom = () => {
		if (viewportRef.current) {
			viewportRef.current.scrollTop = viewportRef.current.scrollHeight;
		}
	};

	useEffect(() => {
		scrollToBottom(); // Call scrollToBottom whenever messages change
	}, [messages]); // Dependency array includes 'messages' to trigger on updates

	return (
		<div className="space-y-4 relative">
			<ScrollArea
				ref={scrollAreaRef}
				className="h-[600px] rounded-md border relative p-4 pb-24"
			>
				<div className="space-y-4">
					<p className="text-sm text-center text-muted-foreground">
						Ask questions about this material and get <br /> instant AI-powered
						answers.
					</p>
					{messages.length === 0 && (
						<div className="flex gap-3">
							<Avatar className="h-8 w-8">
								<AvatarFallback>
									<Bot className="h-4 w-4" />
								</AvatarFallback>
							</Avatar>
						</div>
					)}
					{messages.map((message) => (
						<div
							key={message.id}
							className={`flex gap-3  text-sm ${
								message.role === "user" ? "justify-end" : "justify-start"
							}`}
						>
							{message.role === "assistant" && (
								<Avatar className="h-8 w-8">
									<AvatarFallback>
										<Bot className="h-4 w-4" />
									</AvatarFallback>
								</Avatar>
							)}
							<div
								className={`rounded-lg px-4 py-2 w-full ${
									message.role === "user"
										? "bg-primary/10 text-primary-foreground"
										: "bg-muted"
								}`}
							>
								<MarkdownRenderer
									content={message.parts
										.map((part) => (part.type === "text" ? part.text : ""))
										.join("")}
								/>
							</div>
							{message.role === "user" && (
								<Avatar className="h-8 w-8 bg-muted">
									<AvatarFallback>
										<User className="h-4 w-4" />
									</AvatarFallback>
								</Avatar>
							)}
						</div>
					))}
					{status === "streaming" && (
						<div className="flex gap-3">
							<Avatar className="h-8 w-8">
								<AvatarFallback>
									<Bot className="h-4 w-4 animate-pulse" />
								</AvatarFallback>
							</Avatar>
							<div className="bg-muted rounded-lg px-4 py-2">
								<p className="text-sm text-muted-foreground">Thinking...</p>
							</div>
						</div>
					)}
				</div>
			</ScrollArea>

			<div className="border p-4 absolute bottom-0 left-0 right-0 bg-background">
				<form
					onSubmit={(e) => {
						e.preventDefault();
						if (input.trim()) {
							sendMessage({ text: input });
							setInput("");
						}
					}}
					className="flex gap-2"
				>
					<Input
						value={input}
						onChange={(e) => setInput(e.target.value)}
						placeholder="Ask a question..."
						disabled={status !== "ready"}
					/>
					<Button
						type="submit"
						size="icon"
						disabled={status !== "ready" || !input.trim()}
						className="pr-2 pl-1"
					>
						<Send className="h-4 w-4 rotate-45" />
					</Button>
				</form>
			</div>
		</div>
	);
}
