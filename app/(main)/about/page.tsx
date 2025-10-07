import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
	BookOpen,
	Users,
	Brain,
	Shield,
	Target,
	Heart,
	Zap,
	TrendingUp,
	CheckCircle2,
	Atom,
	Cpu,
	Calculator,
	Palette,
	Wrench,
} from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "About",
	description:
		"Learn about Mevaro's mission to empower education through AI and collaboration. Making quality educational resources accessible to everyone.",
};

export default function AboutPage() {
	return (
		<div className="min-h-screen">
			{/* Hero Section */}
			<section className="container mx-auto px-6 pt-48 pb-20">
				<div className="mx-auto max-w-4xl text-center">
					<h1 className="mb-6 text-5xl font-bold leading-tight tracking-tight text-balance md:text-7xl">
						Empowering education through AI and collaboration
					</h1>
					<p className="mb-10 text-lg text-muted-foreground text-pretty md:text-xl">
						Mevaro is an AI-powered digital knowledge platform designed to make
						quality educational resources accessible to everyone, everywhere.
					</p>
				</div>
			</section>

			{/* Mission Section */}
			<section className="container mx-auto px-6 py-20">
				<div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
					<div>
						<div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary bg-primary px-4 py-1.5 text-sm text-primary-foreground">
							<Target className="h-4 w-4" />
							<span>Our Mission</span>
						</div>
						<h2 className="mb-6 text-3xl font-bold md:text-4xl">
							Making knowledge accessible and interactive for all learners
						</h2>
						<p className="mb-4 text-muted-foreground leading-relaxed">
							At Mevaro, we believe that quality education should be accessible
							to everyone. Our platform bridges the gap between educators and
							learners by creating a unified space where knowledge can be
							shared, discovered, and enhanced through artificial intelligence.
						</p>
						<p className="text-muted-foreground leading-relaxed">
							By combining collaborative content sharing with cutting-edge AI
							technology, we&apos;re transforming how people learn and teach
							across Science, Technology, Engineering, Arts, and Mathematics.
						</p>
					</div>

					<div className="grid gap-4">
						{[
							{
								icon: Users,
								title: "Community-Driven",
								description:
									"Built by educators and learners, for educators and learners worldwide.",
							},
							{
								icon: Brain,
								title: "AI-Enhanced",
								description:
									"Intelligent tools that adapt to your learning style and needs.",
							},
							{
								icon: Shield,
								title: "Quality First",
								description:
									"Every resource is reviewed to ensure educational excellence.",
							},
							{
								icon: Heart,
								title: "Open Access",
								description:
									"Democratizing education by making resources freely available.",
							},
						].map((value) => (
							<Card
								key={value.title}
								className="border-border bg-card p-6 backdrop-blur"
							>
								<div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
									<value.icon className="h-5 w-5 text-primary-foreground" />
								</div>
								<h3 className="mb-2 text-lg font-semibold">{value.title}</h3>
								<p className="text-sm text-muted-foreground leading-relaxed">
									{value.description}
								</p>
							</Card>
						))}
					</div>
				</div>
			</section>

			{/* How It Works Section */}
			<section className="container mx-auto px-6 py-20">
				<div className="mb-16 text-center">
					<h2 className="mb-4 text-3xl font-bold md:text-5xl">
						How Mevaro works
					</h2>
					<p className="text-lg text-muted-foreground">
						A simple process that transforms how you learn and teach
					</p>
				</div>

				<div className="grid gap-8 md:grid-cols-3">
					{[
						{
							step: "01",
							title: "Share Your Knowledge",
							description:
								"Upload educational materials including PDFs and images. Organize them under STEAM categories with custom subcategories for precise classification.",
						},
						{
							step: "02",
							title: "AI Enhancement",
							description:
								"Our AI automatically analyzes materials to generate summaries, extract concepts, create quizzes, and enable intelligent search across the entire library.",
						},
						{
							step: "03",
							title: "Learn & Collaborate",
							description:
								"Discover resources through AI-powered search, interact with materials using our chatbot, and contribute to a growing community of learners.",
						},
					].map((step) => (
						<Card
							key={step.step}
							className="border-border bg-card p-8 backdrop-blur"
						>
							<div className="mb-4 text-4xl font-bold text-primary">
								{step.step}
							</div>
							<h3 className="mb-3 text-xl font-semibold">{step.title}</h3>
							<p className="text-sm text-muted-foreground leading-relaxed">
								{step.description}
							</p>
						</Card>
					))}
				</div>
			</section>

			{/* Features Deep Dive */}
			<section className="container mx-auto px-6 py-20">
				<div className="mb-16 text-center">
					<h2 className="mb-4 text-3xl font-bold md:text-5xl">
						Powerful AI features at your fingertips
					</h2>
					<p className="text-lg text-muted-foreground">
						Every tool designed to enhance your learning experience
					</p>
				</div>

				<div className="grid gap-6 lg:grid-cols-2">
					{[
						{
							title: "RAG-Powered Search",
							description:
								"Our Retrieval-Augmented Generation search understands context and meaning, not just keywords. Find exactly what you need across thousands of materials instantly.",
							features: [
								"Semantic understanding",
								"Context-aware results",
								"Multi-language support",
							],
						},
						{
							title: "Smart Summarization",
							description:
								"Get concise, accurate summaries of complex materials in seconds. Perfect for quick reviews or understanding new topics before diving deep.",
							features: [
								"Key concept extraction",
								"Adjustable length",
								"Maintains accuracy",
							],
						},
						{
							title: "Quiz Generation",
							description:
								"Automatically generate custom quizzes from any material to test comprehension and reinforce learning. Multiple question types supported.",
							features: [
								"Multiple choice & open-ended",
								"Difficulty adjustment",
								"Instant feedback",
							],
						},
						{
							title: "Contextual Q&A Chatbot",
							description:
								"Ask questions about any material and get accurate, context-aware answers. Like having a personal tutor available 24/7.",
							features: [
								"Material-specific responses",
								"Follow-up questions",
								"Citation support",
							],
						},
						{
							title: "Concept Extraction",
							description:
								"Automatically identify and extract key concepts, keywords, and topics from materials for better organization and discovery.",
							features: [
								"Automatic tagging",
								"Relationship mapping",
								"Topic clustering",
							],
						},
						{
							title: "Lesson Plan Builder",
							description:
								"Generate structured study notes, mind maps, and lesson outlines from any material. Perfect for educators and self-learners.",
							features: [
								"Customizable templates",
								"Export options",
								"Collaborative editing",
							],
						},
					].map((feature) => (
						<Card
							key={feature.title}
							className="border-border bg-card p-8 backdrop-blur"
						>
							<h3 className="mb-3 text-2xl font-semibold">{feature.title}</h3>
							<p className="mb-6 text-muted-foreground leading-relaxed">
								{feature.description}
							</p>
							<ul className="space-y-2">
								{feature.features.map((item) => (
									<li key={item} className="flex items-center gap-2 text-sm">
										<CheckCircle2 className="h-4 w-4 text-primary" />
										<span>{item}</span>
									</li>
								))}
							</ul>
						</Card>
					))}
				</div>
			</section>

			{/* STEAM Categories Explanation */}
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

			{/* Stats Section */}
			<section className="container mx-auto px-6 py-20">
				<Card className="border-primary bg-primary p-12 backdrop-blur">
					<div className="mb-12 text-center">
						<h2 className="mb-4 text-3xl font-bold text-primary-foreground md:text-4xl">
							Growing community of learners
						</h2>
						<p className="text-lg text-primary-foreground">
							Join thousands already transforming their education
						</p>
					</div>

					<div className="grid gap-8 md:grid-cols-4">
						{[
							{ label: "Learning Materials", value: "10,000+", icon: BookOpen },
							{ label: "Active Users", value: "50,000+", icon: Users },
							{ label: "AI Interactions", value: "1M+", icon: Zap },
							{ label: "Countries Reached", value: "120+", icon: TrendingUp },
						].map((stat) => (
							<div key={stat.label} className="text-center">
								<stat.icon className="mx-auto mb-3 h-8 w-8 text-primary-foreground" />
								<div className="mb-2 text-4xl font-bold text-primary-foreground">
									{stat.value}
								</div>
								<div className="text-sm text-primary-foreground">
									{stat.label}
								</div>
							</div>
						))}
					</div>
				</Card>
			</section>

			{/* CTA Section */}
			<section className="container mx-auto px-6 py-20">
				<div className="mx-auto max-w-3xl text-center">
					<h2 className="mb-6 text-3xl font-bold md:text-5xl">
						Ready to join the community?
					</h2>
					<p className="mb-8 text-lg text-muted-foreground">
						Start sharing and discovering quality educational resources today.
					</p>
					<div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
						<Button
							size="lg"
							asChild
							className="bg-primary text-primary-foreground hover:bg-primary"
						>
							<Link href="/login">Get Started Free</Link>
						</Button>
						<Button size="lg" variant="outline" asChild>
							<Link href="/library">Explore Library</Link>
						</Button>
					</div>
				</div>
			</section>
		</div>
	);
}
