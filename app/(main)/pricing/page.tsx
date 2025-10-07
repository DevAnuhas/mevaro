import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, Sparkles, Zap, Crown, Info } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Pricing",
	description:
		"Choose the perfect plan for your learning journey. From free to enterprise, get access to AI-powered educational resources and features.",
};

export default function PricingPage() {
	const plans = [
		{
			name: "Free",
			price: "0",
			credits: "50",
			description: "Perfect for casual learners exploring the platform",
			icon: Sparkles,
			features: [
				"50 credits per month",
				"Access to full library",
				"Basic AI features",
				"5 uploads per month",
				"Community support",
				"Standard search",
			],
			cta: "Get Started",
			popular: false,
		},
		{
			name: "Pro",
			price: "12",
			credits: "500",
			description: "Ideal for active learners and educators",
			icon: Zap,
			features: [
				"500 credits per month",
				"Unlimited library access",
				"All AI features unlocked",
				"50 uploads per month",
				"Priority support",
				"Advanced AI search",
				"Quiz generation",
				"Lesson plan builder",
			],
			cta: "Start Pro Trial",
			popular: true,
		},
		{
			name: "Enterprise",
			price: "49",
			credits: "2500",
			description: "For institutions and power users requiring full control",
			icon: Crown,
			features: [
				"2,500 credits per month",
				"Unlimited everything",
				"All AI features + API access",
				"Unlimited uploads",
				"Dedicated support",
				"Custom integrations",
				"Team collaboration",
				"Analytics dashboard",
				"White-label options",
			],
			cta: "Contact Sales",
			popular: false,
		},
	];

	const creditUsage = [
		{ action: "Upload material (PDF/Image)", cost: "Free" },
		{ action: "Download material", cost: "Free" },
		{ action: "AI Summarization", cost: "3 credits" },
		{ action: "Quiz Generation", cost: "5 credits" },
		{ action: "Q&A Chatbot (per question)", cost: "2 credits" },
		{ action: "Concept Extraction", cost: "3 credits" },
		{ action: "Lesson Plan Builder", cost: "8 credits" },
	];

	return (
		<div className="min-h-screen">
			{/* Hero Section */}
			<section className="container mx-auto px-6 pt-48 pb-20">
				<div className="mx-auto max-w-4xl text-center">
					<h1 className="mb-6 text-5xl font-bold leading-tight tracking-tight text-balance md:text-7xl">
						Simple, credit-based pricing
					</h1>
					<p className="mb-10 text-lg text-muted-foreground text-pretty md:text-xl">
						Pay only for what you use. All plans include access to our full
						library and AI-powered features.
					</p>
				</div>
			</section>

			{/* Pricing Cards */}
			<section className="container mx-auto px-6 py-20">
				<div className="grid gap-8 lg:grid-cols-3">
					{plans.map((plan) => (
						<Card
							key={plan.name}
							className={`relative border-border bg-card p-8 backdrop-blur transition-all hover:scale-105 ${
								plan.popular ? "border-primary ring-2 ring-primary" : ""
							}`}
						>
							{plan.popular && (
								<div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full border border-primary bg-primary px-4 py-1 text-sm text-primary-foreground">
									Most Popular
								</div>
							)}

							<div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
								<plan.icon className="h-6 w-6 text-primary-foreground" />
							</div>

							<h3 className="mb-2 text-2xl font-bold">{plan.name}</h3>
							<p className="mb-6 text-sm text-muted-foreground leading-relaxed">
								{plan.description}
							</p>

							<div className="mb-6">
								<div className="flex items-baseline gap-2">
									<span className="text-5xl font-bold">${plan.price}</span>
									<span className="text-muted-foreground">/month</span>
								</div>
								<div className="mt-2 text-sm text-primary font-medium">
									{plan.credits} credits included
								</div>
							</div>

							<Button
								asChild
								className={`mb-8 w-full ${
									plan.popular
										? "bg-primary text-primary-foreground hover:bg-primary"
										: ""
								}`}
								variant={plan.popular ? "default" : "outline"}
							>
								<Link href="/login">{plan.cta}</Link>
							</Button>

							<ul className="space-y-3">
								{plan.features.map((feature) => (
									<li key={feature} className="flex items-start gap-3 text-sm">
										<Check className="h-5 w-5 shrink-0 text-primary" />
										<span>{feature}</span>
									</li>
								))}
							</ul>
						</Card>
					))}
				</div>
			</section>

			{/* Credit Usage Table */}
			<section className="container mx-auto px-6 py-20">
				<div className="mx-auto max-w-4xl">
					<div className="mb-12 text-center">
						<h2 className="mb-4 text-3xl font-bold md:text-5xl">
							How credits work
						</h2>
						<p className="text-lg text-muted-foreground">
							Transparent pricing for every action on the platform
						</p>
					</div>

					<Card className="border-border bg-card backdrop-blur">
						<div className="p-8">
							<div className="mb-6 flex items-start gap-3 rounded-lg border border-primary bg-primary p-4">
								<Info className="h-5 w-5 shrink-0 text-primary-foreground" />
								<p className="text-sm text-primary-foreground leading-relaxed">
									Credits are consumed only when you perform actions. Browsing
									the library and viewing materials is always free. Unused
									credits roll over to the next month.
								</p>
							</div>

							<div className="space-y-4">
								{creditUsage.map((item, index) => (
									<div
										key={item.action}
										className={`flex items-center justify-between py-4 ${
											index !== creditUsage.length - 1
												? "border-b border-border"
												: ""
										}`}
									>
										<span className="text-sm font-medium">{item.action}</span>
										<span className="text-sm text-primary font-semibold">
											{item.cost}
										</span>
									</div>
								))}
							</div>
						</div>
					</Card>
				</div>
			</section>

			{/* FAQ Section */}
			<section className="container mx-auto px-6 py-20">
				<div className="mx-auto max-w-3xl">
					<div className="mb-12 text-center">
						<h2 className="mb-4 text-3xl font-bold md:text-5xl">
							Frequently asked questions
						</h2>
					</div>

					<div className="space-y-6">
						{[
							{
								question: "What happens if I run out of credits?",
								answer:
									"You can upgrade your plan anytime or purchase additional credit packs. Your account remains active and you can still browse the library.",
							},
							{
								question: "Do unused credits expire?",
								answer:
									"No! Unused credits roll over to the next month as long as your subscription is active. They never expire.",
							},
							{
								question: "Can I change plans anytime?",
								answer:
									"Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately and we'll prorate the difference.",
							},
							{
								question: "Is there a free trial for Pro?",
								answer:
									"Yes! All new users get a 14-day free trial of the Pro plan with full access to all features and 500 credits.",
							},
							{
								question: "What payment methods do you accept?",
								answer:
									"We accept all major credit cards, PayPal, and bank transfers for Enterprise plans. All payments are secure and encrypted.",
							},
						].map((faq) => (
							<Card
								key={faq.question}
								className="border-border bg-card p-6 backdrop-blur"
							>
								<h3 className="mb-3 text-lg font-semibold">{faq.question}</h3>
								<p className="text-sm text-muted-foreground leading-relaxed">
									{faq.answer}
								</p>
							</Card>
						))}
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section className="container mx-auto px-6 py-20">
				<Card className="border-primary bg-primary p-12 text-center backdrop-blur">
					<div className="mx-auto max-w-2xl">
						<h2 className="mb-4 text-3xl font-bold text-primary-foreground md:text-4xl">
							Ready to start learning smarter?
						</h2>
						<p className="mb-8 text-lg text-primary-foreground">
							Join thousands of educators and students already using Mevaro.
							Start with our free plan today.
						</p>
						<div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
							<Button size="lg" variant="outline" asChild>
								<Link href="/login">Start Free Trial</Link>
							</Button>
							<Button size="lg" variant="outline" asChild>
								<Link href="/library">Explore Library</Link>
							</Button>
						</div>
					</div>
				</Card>
			</section>
		</div>
	);
}
