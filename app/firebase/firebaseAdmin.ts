import "server-only";
import * as admin from "firebase-admin";

let adminApp: admin.app.App | undefined;

// Helper function to format the private key
function formatPrivateKey(key: string): string {
  return key.replace(/\\n/g, "\n");
}

// Function to initialize Firebase Admin
export async function initAdmin(): Promise<admin.app.App> {
  if (!adminApp) {
    try {
      if (admin.apps.length === 0) {
        console.log("Initializing Firebase Admin...");
        adminApp = admin.initializeApp({
          credential: admin.credential.cert({
            projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: formatPrivateKey(process.env.FIREBASE_PRIVATE_KEY as string),
          }),
          storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        });
        console.log("Firebase Admin initialized successfully");
      } else {
        adminApp = admin.app();
      }
    } catch (error) {
      console.error("Error initializing Firebase Admin:", error);
      throw new Error("Failed to initialize Firebase Admin");
    }
  }
  return adminApp;
}

// Export the admin object for direct use
export { admin };