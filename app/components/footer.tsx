import Link from "next/link";
import { BookOpen } from "lucide-react";

export default function Footer() {
	return (
		<footer className="border-t border-border/40 bg-card/30 backdrop-blur">
			<div className="container mx-auto px-6 py-12">
				<div className="grid gap-8 md:grid-cols-4">
					<div>
						<div className="mb-4 flex items-center gap-2">
							<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
								<BookOpen className="h-5 w-5 text-primary-foreground" />
							</div>
							<span className="text-lg font-semibold">Mevaro</span>
						</div>
						<p className="text-sm text-muted-foreground">
							AI-powered platform for collaborative STEAM education.
						</p>
					</div>

					<div>
						<h4 className="mb-4 font-semibold">Product</h4>
						<ul className="space-y-2 text-sm text-muted-foreground">
							<li>
								<Link href="/library" className="hover:text-foreground">
									Library
								</Link>
							</li>
							<li>
								<Link href="/features" className="hover:text-foreground">
									Features
								</Link>
							</li>
							<li>
								<Link href="/pricing" className="hover:text-foreground">
									Pricing
								</Link>
							</li>
						</ul>
					</div>

					<div>
						<h4 className="mb-4 font-semibold">Resources</h4>
						<ul className="space-y-2 text-sm text-muted-foreground">
							<li>
								<Link href="/docs" className="hover:text-foreground">
									Documentation
								</Link>
							</li>
							<li>
								<Link href="/guides" className="hover:text-foreground">
									Guides
								</Link>
							</li>
							<li>
								<Link href="/support" className="hover:text-foreground">
									Support
								</Link>
							</li>
						</ul>
					</div>

					<div>
						<h4 className="mb-4 font-semibold">Company</h4>
						<ul className="space-y-2 text-sm text-muted-foreground">
							<li>
								<Link href="/about" className="hover:text-foreground">
									About
								</Link>
							</li>
							<li>
								<Link href="/blog" className="hover:text-foreground">
									Blog
								</Link>
							</li>
							<li>
								<Link href="/contact" className="hover:text-foreground">
									Contact
								</Link>
							</li>
						</ul>
					</div>
				</div>

				<div className="mt-12 border-t border-border/40 pt-8 text-center text-sm text-muted-foreground">
					<p>&copy; 2025 Mevaro. All rights reserved.</p>
				</div>
			</div>
		</footer>
	);
}
