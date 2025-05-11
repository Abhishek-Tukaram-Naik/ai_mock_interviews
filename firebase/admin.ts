import { initializeApp, getApps, cert, App } from "firebase-admin/app";
import { getAuth, Auth } from "firebase-admin/auth";
import { getFirestore, Firestore } from "firebase-admin/firestore";

// Type for Firebase Admin services
interface FirebaseAdmin {
    auth: Auth;
    db: Firestore;
}

// Initialize Firebase Admin SDK
function initializeFirebaseAdmin(): FirebaseAdmin {
    // Verify required environment variables
    if (!process.env.FIREBASE_PROJECT_ID ||
        !process.env.FIREBASE_CLIENT_EMAIL ||
        !process.env.FIREBASE_PRIVATE_KEY) {
        throw new Error(
            "Missing Firebase Admin environment variables. " +
            "Check FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY"
        );
    }

    // Reuse existing app if already initialized
    if (getApps().length > 0) {
        const app = getApps()[0];
        return {
            auth: getAuth(app),
            db: getFirestore(app),
        };
    }

    // Initialize new app
    const app = initializeApp({
        credential: cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
        }),
    });

    return {
        auth: getAuth(app),
        db: getFirestore(app),
    };
}

// Export initialized services
export const { auth, db } = initializeFirebaseAdmin();