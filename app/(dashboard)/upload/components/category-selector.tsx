"use client";

import type React from "react";

import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Atom, Cpu, Wrench, Palette, Calculator } from "lucide-react";

type STEAMCategory =
	| "Science"
	| "Technology"
	| "Engineering"
	| "Arts"
	| "Mathematics";

interface CategorySelectorProps {
	value: STEAMCategory | null;
	onChange: (category: STEAMCategory) => void;
}

const categories: {
	name: STEAMCategory;
	icon: React.ReactNode;
	color: string;
}[] = [
	{
		name: "Science",
		icon: <Atom className="h-4 w-4" />,
		color: "bg-green-500",
	},
	{
		name: "Technology",
		icon: <Cpu className="h-4 w-4" />,
		color: "bg-blue-500",
	},
	{
		name: "Engineering",
		icon: <Wrench className="h-4 w-4" />,
		color: "bg-orange-500",
	},
	{
		name: "Arts",
		icon: <Palette className="h-4 w-4" />,
		color: "bg-purple-500",
	},
	{
		name: "Mathematics",
		icon: <Calculator className="h-4 w-4" />,
		color: "bg-red-500",
	},
];

export function CategorySelector({ value, onChange }: CategorySelectorProps) {
	return (
		<div className="space-y-2">
			<Label>STEAM Category</Label>
			<div className="flex flex-wrap gap-2">
				{categories.map((category) => (
					<button
						key={category.name}
						type="button"
						onClick={() => onChange(category.name)}
						className={cn(
							"flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all",
							value === category.name
								? "border-primary bg-primary text-primary-foreground"
								: "border-border hover:border-primary/50"
						)}
					>
						{category.icon}
						<span className="font-medium">{category.name}</span>
					</button>
				))}
			</div>
		</div>
	);
}
