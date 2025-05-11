"use server";

import { auth, db } from "@/firebase/admin";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// Session duration (1 week)
const SESSION_DURATION = 60 * 60 * 24 * 7;

// Set session cookie
async function setSessionCookie(idToken: string) {
    const cookieStore = await cookies();
    const sessionCookie = await auth.createSessionCookie(idToken, {
        expiresIn: SESSION_DURATION * 1000,
    });

    cookieStore.set("session", sessionCookie, {
        maxAge: SESSION_DURATION,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        sameSite: "lax",
    });
}

export async function signUp(params: { email: string; password: string; name: string }) {
    try {
        // Create user in Firebase Auth
        const userRecord = await auth.createUser({
            email: params.email,
            password: params.password,
            displayName: params.name,
        });

        // Save additional user data to Firestore
        await db.collection("users").doc(userRecord.uid).set({
            name: params.name,
            email: params.email,
            createdAt: new Date().toISOString(),
        });

        // Get ID token for the new user
        const idToken = await auth.createCustomToken(userRecord.uid);
        await setSessionCookie(idToken);

        return { success: true, message: "Account created successfully!" };
    } catch (error: any) {
        console.error("Sign up error:", error);
        return {
            success: false,
            message: error.message || "Failed to create account",
        };
    }
}

export async function signIn(params: { idToken: string }) {
    try {
        // Verify the ID token first
        const decodedToken = await auth.verifyIdToken(params.idToken);

        // Then create session cookie
        await setSessionCookie(params.idToken);

        return { success: true, message: "Signed in successfully!" };
    } catch (error: any) {
        console.error("Sign in error:", error);
        return {
            success: false,
            message: error.message || "Failed to sign in",
        };
    }
}

export async function signOut() {
    (await cookies()).delete("session");
    redirect("/login");
}

export async function getCurrentUser(): Promise<User | null >{
    const cookieStore = await cookies();
    const sessionCookie =cookieStore.get("session")?.value;
    if (!sessionCookie) return null;

    try {
        const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);
        const userRecord = await db.collection("users").doc(decodedClaims.uid).get();

        if (!userRecord.exists) return null;

        return {
            id: userRecord.id,
            ...userRecord.data(),
        }as User;
    } catch (error) {
        console.error("User verification error:", error);
        return null;
    }
}

export async function isAuthenticated() {
    const user=await getCurrentUser();
    return !!user;
}