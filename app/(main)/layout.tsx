import type React from "react";
import Footer from "@/app/components/footer";

export default async function MainLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<>
			{children}
			<Footer />
		</>
	);
}
