import type React from "react";
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import Navigation from "@/app/components/navigation";
import { getServerSession } from "@/lib/get-session";

export const metadata: Metadata = {
	title: "Mevaro - AI-Powered Digital Knowledge Platform",
	description:
		"Empower learners and educators with AI-driven STEAM learning materials. Share, discover, and learn with intelligent educational resources.",
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const session = await getServerSession();
	const user = session?.user;

	return (
		<html lang="en" className="dark">
			<body
				className={`${GeistSans.className} ${GeistMono.variable} antialiased`}
			>
				<Navigation user={user} />
				{children}
			</body>
		</html>
	);
}
