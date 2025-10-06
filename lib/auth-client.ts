import { createAuthClient } from "better-auth/react";
import { adminClient } from "better-auth/client/plugins"
import { ac, admin, user } from "@/lib/permissions"

export const authClient = createAuthClient({
    baseURL: process.env.NEXT_PUBLIC_APP_URL,
    plugins: [adminClient({
        ac,
        roles: { admin, user }
    })],
})

export const signIn = async () => {
    await authClient.signIn.social({
        provider: "google",
        callbackURL: "/account",
    });
};

export const { signOut, useSession } = authClient;