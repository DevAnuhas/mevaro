import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "My Account",
	description:
		"Manage your Mevaro account, view statistics, and track your learning activity.",
	robots: {
		index: false,
		follow: false,
	},
};

export default function AccountLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <>{children}</>;
}
