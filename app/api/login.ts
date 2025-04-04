import { NextResponse } from "next/server";
import { initAdmin } from "../firebase/firebaseAdmin";

export async function POST(request: Request) {
  const { idToken } = await request.json();

  try {
    const admin = await initAdmin();
    const decodedToken = await admin.auth().verifyIdToken(idToken);

    const response = NextResponse.json({ message: "Login successful" });
    response.cookies.set("authToken", idToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    console.error("Error verifying ID token:", error);
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}