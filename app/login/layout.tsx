import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Login",
	description:
		"Sign in to Mevaro to access AI-powered educational materials and resources.",
	robots: {
		index: false,
		follow: false,
	},
};

export default function LoginLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <>{children}</>;
}
