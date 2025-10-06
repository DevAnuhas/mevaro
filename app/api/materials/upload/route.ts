import { NextRequest, NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getServerSession } from "@/lib/get-session";
import { prisma } from "@/lib/prisma";
import { r2, generateFileKey } from "@/lib/r2";
import { Category } from "@prisma/client";
import { uploadMaterialSchema } from "@/lib/validations/material";
import { ZodError } from "zod";

export async function POST(request: NextRequest) {
    try {
        // Check authentication
        const session = await getServerSession();
        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        // Parse and validate form data
        const formData = await request.formData();
        const rawData = {
            title: formData.get("title"),
            description: formData.get("description"),
            category: formData.get("category"),
            keywords: formData.get("keywords"),
            file: formData.get("file"),
        };

        const validatedData = uploadMaterialSchema.parse(rawData);
        const { title, description, category, keywords, file } = validatedData;

        // Generate unique file key
        const fileKey = generateFileKey(file);

        // Convert file to buffer
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Upload to R2
        await r2.send(
            new PutObjectCommand({
                Bucket: process.env.CLOUDFLARE_R2_BUCKET!,
                Key: fileKey,
                Body: buffer,
                ContentType: file.type,
            })
        );

        // Construct public URL
        const fileUrl = `${process.env.CLOUDFLARE_R2_PUBLIC_URL}/${fileKey}`;

        // Create material record
        const material = await prisma.material.create({
            data: {
                title,
                description,
                fileUrl,
                fileType: file.type,
                fileSize: file.size,
                category: category.toUpperCase() as Category,
                keywords,
                uploaderId: session.user.id,
                status: "PENDING",
            },
        });

        return NextResponse.json({
            success: true,
            material: {
                id: material.id,
                title: material.title,
                status: material.status,
            },
        });

    } catch (error) {
        console.error("Upload error:", error);

        // Handle Zod validation errors
        if (error instanceof ZodError) {
            return NextResponse.json(
                {
                    error: "Validation failed",
                    details: error.issues.map((err) => ({
                        field: err.path.join("."),
                        message: err.message
                    }))
                },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: "Failed to upload material. Please try again." },
            { status: 500 }
        );
    }
}