"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { BookOpen, Search } from "lucide-react";
import { UserMenu } from "./user-menu";
import { User as UserType } from "better-auth";
import { cn } from "@/lib/utils";

export default function Navigation({ user }: { user?: UserType }) {
	const pathname = usePathname();
	const isHomePage = pathname === "/";

	const [scrolled, setScrolled] = useState(false);

	useEffect(() => {
		const onScroll = () => {
			setScrolled(window.scrollY > 10);
		};

		onScroll();
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);

	return (
		<nav
			className={cn(
				"fixed top-0 left-0 right-0 z-50 transition-all duration-200",
				isHomePage && !scrolled
					? "border-b-transparent bg-transparent"
					: "border-b bg-background/80 backdrop-blur-lg"
			)}
		>
			<div className="container mx-auto flex items-center justify-between px-6 py-4">
				<Link href="/" className="flex items-center gap-2">
					<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
						<BookOpen className="h-5 w-5 text-primary-foreground" />
					</div>
					<span className="text-xl font-semibold">Mevaro</span>
				</Link>

				<div className="hidden items-center md:flex">
					<Link
						href="/library"
						className="text-sm text-muted-foreground transition-colors hover:text-foreground hover:bg-accent py-2 px-4 rounded-lg"
					>
						Library
					</Link>
					<Link
						href="/about"
						className="text-sm text-muted-foreground transition-colors hover:text-foreground hover:bg-accent py-2 px-4 rounded-lg"
					>
						About
					</Link>
					<Link
						href="/pricing"
						className="text-sm text-muted-foreground transition-colors hover:text-foreground hover:bg-accent py-2 px-4 rounded-lg"
					>
						Pricing
					</Link>
				</div>

				<div className="flex items-center gap-3">
					<Button variant="ghost" size="icon" className="hidden md:flex">
						<Search className="h-4 w-4" />
					</Button>
					{user ? (
						<UserMenu user={user} />
					) : (
						<>
							<Button
								asChild
								className="bg-primary text-primary-foreground hover:bg-primary/90"
							>
								<Link href="/login">Get Started</Link>
							</Button>
						</>
					)}
				</div>
			</div>
		</nav>
	);
}
