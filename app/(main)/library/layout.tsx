import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Library",
	description:
		"Browse and discover AI-powered STEAM educational materials. Access thousands of learning resources across Science, Technology, Engineering, Arts, and Mathematics.",
};

export default function LibraryLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <>{children}</>;
}
