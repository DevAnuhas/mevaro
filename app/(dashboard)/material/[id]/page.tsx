import { notFound } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
	Download,
	Eye,
	Calendar,
	FileText,
	ImageIcon,
	Sparkles,
} from "lucide-react";
import { MaterialViewer } from "./components/material-viewer";
import { AISummarization } from "./components/ai-summarization";
import { AIQuizGenerator } from "./components/ai-quiz-generator";
import { AIChatbot } from "./components/ai-chatbot";
import { AIConceptExtraction } from "./components/ai-concept-extraction";
import { AILessonPlan } from "./components/ai-lesson-plan";

// Mock data - in production, this would come from database
const getMaterial = (id: string) => {
	const materials = [
		{
			id: "1",
			title: "Introduction to Quantum Mechanics",
			description:
				"A comprehensive guide to the fundamental principles of quantum mechanics, covering wave-particle duality, uncertainty principle, and quantum states.",
			category: "Science",
			subcategories: ["Physics", "Quantum Theory"],
			fileUrl: "/placeholder.svg?height=800&width=600",
			fileType: "pdf",
			uploaderId: "1",
			uploaderName: "Dr. Sarah Chen",
			uploaderAvatar: "/placeholder.svg?height=40&width=40",
			status: "approved",
			createdAt: "2024-01-15",
			downloadCount: 1247,
			viewCount: 3891,
		},
	];

	return materials.find((m) => m.id === id);
};

const categoryColors = {
	Science: "bg-green-500",
	Technology: "bg-blue-500",
	Engineering: "bg-orange-500",
	Arts: "bg-purple-500",
	Mathematics: "bg-red-500",
};

export default function MaterialPage({ params }: { params: { id: string } }) {
	const material = getMaterial(params.id);

	if (!material) {
		notFound();
	}

	return (
		<div className="min-h-screen bg-background">
			<div className="container mx-auto px-6 pt-24 pb-12">
				{/* Header */}
				<div className="mb-8">
					<div className="flex items-start justify-between gap-4 mb-4">
						<div className="flex-1">
							<h1 className="text-4xl font-bold mb-2">{material.title}</h1>
							<p className="text-lg text-muted-foreground">
								{material.description}
							</p>
						</div>
						<Button size="lg" className="gap-2">
							<Download className="h-5 w-5" />
							Download
						</Button>
					</div>

					{/* Metadata */}
					<div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
						<div className="flex items-center gap-2">
							<Avatar className="h-8 w-8">
								<AvatarImage
									src={material.uploaderAvatar || "/placeholder.svg"}
								/>
								<AvatarFallback>
									{material.uploaderName.charAt(0)}
								</AvatarFallback>
							</Avatar>
							<span>{material.uploaderName}</span>
						</div>
						<Separator orientation="vertical" className="h-4" />
						<div className="flex items-center gap-1">
							<Calendar className="h-4 w-4" />
							{new Date(material.createdAt).toLocaleDateString()}
						</div>
						<Separator orientation="vertical" className="h-4" />
						<div className="flex items-center gap-1">
							<Eye className="h-4 w-4" />
							{material.viewCount.toLocaleString()} views
						</div>
						<Separator orientation="vertical" className="h-4" />
						<div className="flex items-center gap-1">
							<Download className="h-4 w-4" />
							{material.downloadCount.toLocaleString()} downloads
						</div>
					</div>

					{/* Categories */}
					<div className="flex flex-wrap gap-2 mt-4">
						<Badge
							className={`${
								categoryColors[material.category as keyof typeof categoryColors]
							} text-white`}
						>
							{material.category}
						</Badge>
						{material.subcategories.map((sub) => (
							<Badge key={sub} variant="secondary">
								{sub}
							</Badge>
						))}
						<Badge variant="outline" className="gap-1">
							{material.fileType === "pdf" ? (
								<FileText className="h-3 w-3" />
							) : (
								<ImageIcon className="h-3 w-3" />
							)}
							{material.fileType.toUpperCase()}
						</Badge>
					</div>
				</div>

				{/* Main Content Grid */}
				<div className="grid lg:grid-cols-2 gap-8">
					{/* Material Viewer */}
					<div>
						<Card className="p-6">
							<h2 className="text-xl font-semibold mb-4">Material Preview</h2>
							<MaterialViewer
								fileUrl={material.fileUrl}
								fileType={material.fileType}
								title={material.title}
							/>
						</Card>
					</div>

					{/* AI Features Panel */}
					<div>
						<Card className="p-6">
							<div className="flex items-center gap-2 mb-4">
								<Sparkles className="h-5 w-5 text-primary" />
								<h2 className="text-xl font-semibold">AI-Powered Features</h2>
							</div>

							<Tabs defaultValue="summarize" className="w-full">
								<TabsList className="grid w-full grid-cols-3 lg:grid-cols-5">
									<TabsTrigger value="summarize">Summary</TabsTrigger>
									<TabsTrigger value="quiz">Quiz</TabsTrigger>
									<TabsTrigger value="chat">Chat</TabsTrigger>
									<TabsTrigger value="concepts">Concepts</TabsTrigger>
									<TabsTrigger value="lesson">Lesson</TabsTrigger>
								</TabsList>

								<TabsContent value="summarize" className="mt-4">
									<AISummarization materialId={material.id} />
								</TabsContent>

								<TabsContent value="quiz" className="mt-4">
									<AIQuizGenerator materialId={material.id} />
								</TabsContent>

								<TabsContent value="chat" className="mt-4">
									<AIChatbot materialId={material.id} />
								</TabsContent>

								<TabsContent value="concepts" className="mt-4">
									<AIConceptExtraction materialId={material.id} />
								</TabsContent>

								<TabsContent value="lesson" className="mt-4">
									<AILessonPlan materialId={material.id} />
								</TabsContent>
							</Tabs>
						</Card>
					</div>
				</div>
			</div>
		</div>
	);
}
