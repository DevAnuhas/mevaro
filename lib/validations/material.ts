import { z } from "zod";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_FILE_TYPES = ["application/pdf", "image/png", "image/jpeg"];

const baseSchema = {
    title: z
        .string()
        .min(1, "Title is required")
        .min(3, "Title must be at least 3 characters")
        .max(100, "Title must be less than 100 characters"),
    description: z
        .string()
        .min(1, "Description is required")
        .min(10, "Description must be at least 10 characters")
        .max(500, "Description must be less than 500 characters"),
    category: z.enum(["Science", "Technology", "Engineering", "Arts", "Mathematics"]),
};

const fileSchema = z
    .instanceof(File)
    .refine(
        (file) => file.size <= MAX_FILE_SIZE,
        "File size must be less than 10MB"
    )
    .refine(
        (file) => ACCEPTED_FILE_TYPES.includes(file.type),
        "File must be PDF, PNG, or JPEG"
    );

const keywordsArraySchema = z
    .array(z.string().min(1))
    .min(1, "At least one keyword is required")
    .max(5, "Maximum 5 keywords allowed");

// Client-side validation schema (for React Hook Form)
export const uploadFormSchema = z.object({
    ...baseSchema,
    keywords: keywordsArraySchema,
    file: fileSchema
        .optional()
        .refine((file) => file !== undefined, "File is required"),
});

// Server-side validation schema (for FormData parsing)
export const uploadMaterialSchema = z.object({
    ...baseSchema,
    keywords: z
        .string()
        .transform((str) => JSON.parse(str))
        .pipe(keywordsArraySchema),
    file: fileSchema,
});

export type UploadFormData = z.infer<typeof uploadFormSchema>;
export type UploadMaterialData = z.infer<typeof uploadMaterialSchema>;
