import { UploadForm } from "./components/upload-form";

export default function UploadPage() {
	return (
		<div className="container max-w-4xl mx-auto px-6 pt-24 pb-12">
			<div className="mb-8">
				<h1 className="text-4xl font-bold mb-2">Upload Material</h1>
				<p className="text-muted-foreground">
					Share your educational resources with the Mevaro community. All
					uploads are reviewed before being published.
				</p>
			</div>
			<UploadForm />
		</div>
	);
}
