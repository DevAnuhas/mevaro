"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bot, Send, User } from "lucide-react";

interface Message {
	id: number;
	role: "user" | "assistant";
	content: string;
	timestamp: Date;
}

interface AIChatbotProps {
	materialId: string;
}

export function AIChatbot({ materialId }: AIChatbotProps) {
	const [messages, setMessages] = useState<Message[]>([
		{
			id: 1,
			role: "assistant",
			content:
				"Hello! I'm your AI assistant. Ask me anything about this material and I'll help you understand it better.",
			timestamp: new Date(),
		},
	]);
	const [input, setInput] = useState("");
	const [loading, setLoading] = useState(false);
	const scrollRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (scrollRef.current) {
			scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
		}
	}, [messages]);

	const handleSend = async () => {
		if (!input.trim()) return;

		const userMessage: Message = {
			id: messages.length + 1,
			role: "user",
			content: input,
			timestamp: new Date(),
		};

		setMessages((prev) => [...prev, userMessage]);
		setInput("");
		setLoading(true);

		// Mock AI response
		await new Promise((resolve) => setTimeout(resolve, 1500));

		const aiMessage: Message = {
			id: messages.length + 2,
			role: "assistant",
			content:
				"That's a great question! Based on the material, quantum mechanics describes the behavior of matter and energy at the atomic and subatomic levels. The wave-particle duality is one of its fundamental concepts, showing that particles can exhibit both wave-like and particle-like properties depending on how they're observed.",
			timestamp: new Date(),
		};

		setMessages((prev) => [...prev, aiMessage]);
		setLoading(false);
	};

	return (
		<div className="space-y-4">
			<p className="text-sm text-muted-foreground">
				Ask questions about this material and get instant AI-powered answers.
			</p>

			<div className="border rounded-lg">
				<ScrollArea className="h-[400px] p-4" ref={scrollRef}>
					<div className="space-y-4">
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
									<p className="text-sm">{message.content}</p>
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
						{loading && (
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
							handleSend();
						}}
						className="flex gap-2"
					>
						<Input
							value={input}
							onChange={(e) => setInput(e.target.value)}
							placeholder="Ask a question..."
							disabled={loading}
						/>
						<Button
							type="submit"
							size="icon"
							disabled={loading || !input.trim()}
						>
							<Send className="h-4 w-4" />
						</Button>
					</form>
				</div>
			</div>
		</div>
	);
}
