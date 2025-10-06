"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Spinner } from "@/components/ui/spinner";
import { User, Settings, LogOut, Shield, BarChart } from "lucide-react";
import Link from "next/link";
import { signOut } from "@/lib/auth-client";

export function UserMenu({ user }: { user: { name: string; email: string } }) {
	const [isSigningOut, setIsSigningOut] = useState(false);
	const router = useRouter();

	const initials = user.name
		.split(" ")
		.map((n) => n[0])
		.join("")
		.toUpperCase()
		.slice(0, 2);

	const handleSignOut = async (e: React.MouseEvent) => {
		e.preventDefault();
		try {
			setIsSigningOut(true);
			await signOut();
			router.refresh();
		} catch (error) {
			console.error("Error signing out:", error);
		} finally {
			setIsSigningOut(false);
		}
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" className="relative h-9 w-9 rounded-full">
					<Avatar className="h-9 w-9">
						<AvatarFallback className="bg-accent text-accent-foreground">
							{initials}
						</AvatarFallback>
					</Avatar>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-56" align="end">
				<DropdownMenuLabel>
					<div className="flex flex-col space-y-1">
						<p className="text-sm font-medium leading-none">{user.name}</p>
						<p className="text-xs leading-none text-muted-foreground">
							{user.email}
						</p>
					</div>
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuItem asChild>
					<Link href="/account" className="cursor-pointer">
						<User className="mr-2 h-4 w-4" />
						<span>My Account</span>
					</Link>
				</DropdownMenuItem>
				<DropdownMenuItem asChild>
					<Link href="/account" className="cursor-pointer">
						<BarChart className="mr-2 h-4 w-4" />
						<span>My Stats</span>
					</Link>
				</DropdownMenuItem>
				{/* {user.role === "admin" && (
					<DropdownMenuItem asChild>
						<Link href="/admin" className="cursor-pointer">
							<Shield className="mr-2 h-4 w-4" />
							<span>Admin Dashboard</span>
						</Link>
					</DropdownMenuItem>
				)} */}
				<DropdownMenuItem asChild>
					<Link href="/settings" className="cursor-pointer">
						<Settings className="mr-2 h-4 w-4" />
						<span>Settings</span>
					</Link>
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem
					onClick={handleSignOut}
					className="cursor-pointer text-destructive"
				>
					{isSigningOut ? (
						<>
							<Spinner />
							Signing out...
						</>
					) : (
						<>
							<LogOut className="mr-2 h-4 w-4" />
							Log out
						</>
					)}
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
