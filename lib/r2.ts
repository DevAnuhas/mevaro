import { S3Client } from "@aws-sdk/client-s3";
import { createHash } from "crypto";

export const r2 = new S3Client({
    region: "auto",
    endpoint: process.env.CLOUDFLARE_R2_ENDPOINT!,
    credentials: {
        accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID!,
        secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY!,
    },
});

export function generateFileKey(file: File | Blob): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(7);
    const hash = createHash("sha256")
        .update(`${timestamp}${random}`)
        .digest("hex");

    const extension =
        file instanceof File ? `.${file.name.split(".").pop()}` : ".jpg";

    return `${hash}${extension}`;
}