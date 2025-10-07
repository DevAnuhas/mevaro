import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
	ArrowRight,
	Sparkles,
	BookOpen,
	Users,
	Brain,
	Shield,
	Zap,
	TrendingUp,
	Atom,
	Cpu,
	Wrench,
	Palette,
	Calculator,
} from "lucide-react";
import { Spotlight } from "@/components/ui/spotlight-new";

export default function HomePage() {
	return (
		<div className="min-h-screen pt-16">
			{/* Hero Section */}
			<section className="container mx-auto px-6 pt-32 pb-20">
				<Spotlight />
				<div className="mx-auto max-w-4xl text-center">
					<div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm text-primary">
						<Sparkles className="h-4 w-4" />
						<span>Powered by AI</span>
					</div>

					<h1 className="mb-6 text-5xl font-bold leading-tight tracking-tight text-balance md:text-7xl">
						The intelligent platform for STEAM education
					</h1>

					<p className="mb-10 text-lg text-muted-foreground text-pretty md:text-xl">
						Share, discover, and learn with AI-powered educational resources.
						Empowering educators and learners through collaborative knowledge
						sharing.
					</p>

					<div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
						<Button
							size="lg"
							asChild
							className="bg-primary text-primary-foreground hover:bg-primary/90"
						>
							<Link href="/login">
								Start Learning
								<ArrowRight className="ml-2 h-4 w-4" />
							</Link>
						</Button>
						<Button size="lg" variant="outline" asChild>
							<Link href="/library">Explore Library</Link>
						</Button>
					</div>
				</div>
			</section>

			{/* Stats Section */}
			<section className="container mx-auto px-6 py-20">
				<div className="grid gap-6 md:grid-cols-4">
					{[
						{ label: "Learning Materials", value: "10,000+" },
						{ label: "Active Learners", value: "50,000+" },
						{ label: "AI Interactions", value: "1M+" },
						{ label: "Success Rate", value: "98%" },
					].map((stat) => (
						<Card
							key={stat.label}
							className="border-border bg-card p-6 text-center backdrop-blur"
						>
							<div className="mb-2 text-3xl font-bold text-primary">
								{stat.value}
							</div>
							<div className="text-sm text-muted-foreground">{stat.label}</div>
						</Card>
					))}
				</div>
			</section>

			{/* Features Section */}
			<section className="container mx-auto px-6 py-20">
				<div className="mb-16 text-center">
					<h2 className="mb-4 text-3xl font-bold md:text-5xl">
						Everything you need to learn smarter
					</h2>
					<p className="text-lg text-muted-foreground">
						AI-powered tools designed for modern education
					</p>
				</div>

				<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
					{[
						{
							icon: Brain,
							title: "AI-Powered Search",
							description:
								"Find exactly what you need with intelligent RAG-based search across all materials.",
						},
						{
							icon: Sparkles,
							title: "Smart Summarization",
							description:
								"Get instant summaries of complex materials to understand key concepts quickly.",
						},
						{
							icon: Zap,
							title: "Quiz Generation",
							description:
								"Automatically generate quizzes from any material to test your knowledge.",
						},
						{
							icon: Users,
							title: "Collaborative Learning",
							description:
								"Share your knowledge and learn from educators and students worldwide.",
						},
						{
							icon: BookOpen,
							title: "STEAM Categories",
							description:
								"Organized content across Science, Technology, Engineering, Arts, and Mathematics.",
						},
						{
							icon: Shield,
							title: "Quality Assured",
							description:
								"All materials are reviewed and approved to maintain high educational standards.",
						},
					].map((feature) => (
						<Card
							key={feature.title}
							className="border-border bg-card p-6 backdrop-blur transition-colors hover:border-primary"
						>
							<div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
								<feature.icon className="h-6 w-6 text-primary" />
							</div>
							<h3 className="mb-2 text-xl font-semibold">{feature.title}</h3>
							<p className="text-sm text-muted-foreground leading-relaxed">
								{feature.description}
							</p>
						</Card>
					))}
				</div>
			</section>

			{/* STEAM Categories Section */}
			<section className="container mx-auto px-6 py-20">
				<div className="mb-16 text-center">
					<h2 className="mb-4 text-3xl font-bold md:text-5xl">
						Explore STEAM disciplines
					</h2>
					<p className="text-lg text-muted-foreground">
						Comprehensive resources across all major educational categories
					</p>
				</div>

				<div className="grid gap-4 md:grid-cols-5">
					{[
						{
							name: "Science",
							color: "oklch(0.55 0.20 150)",
							count: "2,500+",
							icon: Atom,
						},
						{
							name: "Technology",
							color: "oklch(0.60 0.18 220)",
							count: "3,200+",
							icon: Cpu,
						},
						{
							name: "Engineering",
							color: "oklch(0.65 0.15 30)",
							count: "1,800+",
							icon: Wrench,
						},
						{
							name: "Arts",
							color: "oklch(0.50 0.22 280)",
							count: "1,500+",
							icon: Palette,
						},
						{
							name: "Mathematics",
							color: "oklch(0.70 0.18 60)",
							count: "2,000+",
							icon: Calculator,
						},
					].map((category) => (
						<Card
							key={category.name}
							className="group cursor-pointer border-border bg-card p-6 text-center backdrop-blur transition-all hover:scale-105 hover:border-primary"
						>
							<div
								className="mx-auto mb-4 h-16 w-16 rounded-full transition-transform group-hover:scale-110 flex items-center justify-center"
								style={{ backgroundColor: category.color }}
							>
								<category.icon className="h-8 w-8 text-white" />
							</div>
							<h3 className="mb-2 text-lg font-semibold">{category.name}</h3>
							<p className="text-sm text-muted-foreground">
								{category.count} materials
							</p>
						</Card>
					))}
				</div>
			</section>

			{/* CTA Section */}
			<section className="container mx-auto px-6 py-20">
				<Card className="border-primary/20 bg-gradient-to-br from-primary/10 to-secondary/10 p-12 text-center backdrop-blur">
					<div className="mx-auto max-w-2xl">
						<TrendingUp className="mx-auto mb-6 h-12 w-12 text-primary" />
						<h2 className="mb-4 text-3xl font-bold md:text-4xl">
							Ready to transform your learning?
						</h2>
						<p className="mb-8 text-lg text-muted-foreground">
							Join thousands of educators and students already using Mevaro to
							enhance their educational journey.
						</p>
						<div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
							<Button
								size="lg"
								asChild
								className="bg-primary text-primary-foreground hover:bg-primary/90"
							>
								<Link href="/login">
									Get Started Free
									<ArrowRight className="ml-2 h-4 w-4" />
								</Link>
							</Button>
							<Button size="lg" variant="outline" asChild>
								<Link href="/library">Browse Library</Link>
							</Button>
						</div>
					</div>
				</Card>
			</section>
		</div>
	);
}
