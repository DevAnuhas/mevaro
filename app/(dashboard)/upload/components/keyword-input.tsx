"use client";

import type React from "react";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, X } from "lucide-react";

interface KeywordInputProps {
	value: string[];
	onChange: (keywords: string[]) => void;
}

export function KeywordInput({ value, onChange }: KeywordInputProps) {
	const [inputValue, setInputValue] = useState("");

	const handleAdd = () => {
		if (inputValue.trim() && !value.includes(inputValue.trim())) {
			onChange([...value, inputValue.trim()]);
			setInputValue("");
		}
	};

	const handleRemove = (keyword: string) => {
		onChange(value.filter((s) => s !== keyword));
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter") {
			e.preventDefault();
			handleAdd();
		}
	};

	return (
		<div className="space-y-2">
			<Label htmlFor="keywords">Keywords (Max 5)</Label>
			<div className="flex gap-2">
				<Input
					id="keywords"
					placeholder="e.g., Quantum Mechanics, Physics"
					value={inputValue}
					onChange={(e) => setInputValue(e.target.value)}
					onKeyDown={handleKeyDown}
				/>
				<Button type="button" onClick={handleAdd} size="icon" variant="outline">
					<Plus className="h-4 w-4" />
				</Button>
			</div>
			{value.length > 0 && (
				<div className="flex flex-wrap gap-2 pt-2">
					{value.map((keyword) => (
						<Badge key={keyword} variant="secondary" className="gap-1">
							{keyword}
							<button
								type="button"
								onClick={() => handleRemove(keyword)}
								className="ml-1 hover:text-destructive"
							>
								<X className="h-3 w-3" />
							</button>
						</Badge>
					))}
				</div>
			)}
		</div>
	);
}
