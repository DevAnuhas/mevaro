import type React from "react";
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { Navigation } from "./components/navigation";

export const metadata: Metadata = {
	title: "Mevaro - AI-Powered Digital Knowledge Platform",
	description:
		"Empower learners and educators with AI-driven STEAM learning materials. Share, discover, and learn with intelligent educational resources.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" className="dark">
			<body
				className={`${GeistSans.className} ${GeistMono.variable} antialiased`}
			>
				<Navigation />
				{children}
			</body>
		</html>
	);
}
