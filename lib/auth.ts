import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@/lib/prisma";

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    trustedOrigins: [`${process.env.NEXT_PUBLIC_APP_URL}`],
    allowedDevOrigins: [`${process.env.NEXT_PUBLIC_APP_URL}`],
    cookieCache: {
        enabled: true,
        maxAge: 5 * 60, // Cache duration in seconds
    },
    socialProviders: {
        google: {
            prompt: "select_account",
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        },
    },
});