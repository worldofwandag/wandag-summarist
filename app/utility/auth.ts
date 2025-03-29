// auth.ts
import { auth } from "../firebase/config";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  signInAnonymously,
  signOut,
} from "firebase/auth";
import { useRouter } from "next/navigation";

const provider = new GoogleAuthProvider();

export const googleLogin = async () => {
  const result = await signInWithPopup(auth, provider);
  return result.user;
};

export const googleRegister = async () => {
  const result = await signInWithPopup(auth, provider);
  return result.user;
};

export const summaristRegister = async (email: string, password: string) => {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );
  return userCredential.user;
};

export const summaristLogin = async (email: string, password: string) => {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );
  return userCredential.user;
};

export const forgotPassword = async (email: string) => {
  await sendPasswordResetEmail(auth, email);
};

export const guestLogin = async () => {
  const userCredential = await signInAnonymously(auth);
  return userCredential.user;
};

export const logout = async () => {
  await signOut(auth); // This will log the user out
};
