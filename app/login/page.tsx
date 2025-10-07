"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { signIn } from "@/lib/auth-client";
import Image from "next/image";
import { Spinner } from "@/components/ui/spinner";

export default function LoginPage() {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");

	const handleClick = async () => {
		setIsLoading(true);
		setError("");

		try {
			await signIn();
		} catch (error) {
			if (error instanceof Error) {
				setError(error.message || "An unexpected error occurred");
			}
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="flex min-h-screen items-center justify-center px-6 py-12">
			<div className="w-full max-w-sm">
				<Card>
					<CardHeader>
						<CardTitle>Welcome to Mevaro</CardTitle>
						<CardDescription>
							Sign in to access your learning materials
						</CardDescription>
					</CardHeader>
					<CardContent>
						<Button
							onClick={handleClick}
							className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
							disabled={isLoading}
							size="lg"
						>
							{isLoading ? (
								<>
									<Spinner />
									Signing in...
								</>
							) : (
								<>
									<Image
										src="/google-logo.svg"
										alt="Google Logo"
										width={18}
										height={18}
										className="mr-2"
									/>
									Continue with Google
								</>
							)}
						</Button>
						{error && (
							<div className="mt-4 flex items-center text-sm text-destructive">
								<AlertCircle className="mr-2 h-4 w-4" />
								<span>{error}</span>
							</div>
						)}
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
