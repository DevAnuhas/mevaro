"use client";

import { useRef, useEffect, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bot, Send, User } from "lucide-react";

interface AIChatbotProps {
	materialId: string;
}

export function AIChatbot({ materialId }: AIChatbotProps) {
	const scrollRef = useRef<HTMLDivElement>(null);
	const [input, setInput] = useState("");

	const { messages, sendMessage, status } = useChat({
		transport: new DefaultChatTransport({
			api: "/api/ai/chat",
			body: { materialId },
		}),
	});

	useEffect(() => {
		if (scrollRef.current) {
			scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
		}
	}, [messages]);

	return (
		<div className="space-y-4">
			<p className="text-sm text-muted-foreground">
				Ask questions about this material and get instant AI-powered answers.
			</p>

			<div className="border rounded-lg">
				<ScrollArea className="h-[400px] p-4" ref={scrollRef}>
					<div className="space-y-4">
						{messages.length === 0 && (
							<div className="flex gap-3">
								<Avatar className="h-8 w-8">
									<AvatarFallback>
										<Bot className="h-4 w-4" />
									</AvatarFallback>
								</Avatar>
								<div className="bg-muted rounded-lg px-4 py-2">
									<p className="text-sm">
										Hello! I&apos;m your AI assistant. Ask me anything about
										this material and I&apos;ll help you understand it better.
									</p>
								</div>
							</div>
						)}
						{messages.map((message) => (
							<div
								key={message.id}
								className={`flex gap-3 ${
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
									className={`rounded-lg px-4 py-2 max-w-[80%] ${
										message.role === "user"
											? "bg-primary text-primary-foreground"
											: "bg-muted"
									}`}
								>
									<p className="text-sm whitespace-pre-wrap">
										{message.parts.map((part, index) =>
											part.type === "text" ? (
												<span key={index}>{part.text}</span>
											) : null
										)}
									</p>
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

				<div className="border-t p-4">
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
						>
							<Send className="h-4 w-4" />
						</Button>
					</form>
				</div>
			</div>
		</div>
	);
}
