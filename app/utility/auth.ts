import { createAsyncThunk } from "@reduxjs/toolkit";
import { auth } from "../firebase/config";
import { User, UserCredential } from "firebase/auth";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  signInAnonymously,
  signOut,
} from "firebase/auth";
import { AppDispatch } from "../redux/store";
import {
  setUser,
  signOutUser,
  googleUser,
  guestUser,
} from "../redux/userSlice";
import { SerializableUser } from "../types/SerializableUser";

const provider = new GoogleAuthProvider();

// Action to perform Google login

export const googleLogin = createAsyncThunk<
  SerializableUser, // Return only serializable data to Redux
  void,
  { dispatch: AppDispatch }
>("auth/googleLogin", async (_, { dispatch }) => {
  const result: UserCredential = await signInWithPopup(auth, provider);
  // Extract serializable user data
  const user: SerializableUser = {
    uid: result.user.uid,
    email: result.user.email,
    displayName: result.user.displayName,
    photoURL: result.user.photoURL,
    subscription: null, // Default subscription value for Google login
  };

  dispatch(googleUser(user)); // Dispatch only serializable data
  console.log("**TESTING IF GOOGLE AUTH WORKS**");

  return user; // Return serializable user data
});

// Action to perform Google registration
export const googleRegister = createAsyncThunk<
  SerializableUser, // Return only serializable data to Redux
  void,
  { dispatch: AppDispatch }
>("auth/googleRegister", async (_, { dispatch }) => {
  const result: UserCredential = await signInWithPopup(auth, provider);

  // Extract serializable user data
  const user: SerializableUser = {
    uid: result.user.uid,
    email: result.user.email,
    displayName: result.user.displayName,
    photoURL: result.user.photoURL,
    subscription: null, // Default subscription value for Google registration
  };

  dispatch(googleUser(user)); // Dispatch only serializable data
  return user; // Return serializable user data
});

// Action to perform summarist registration
export const summaristRegister = createAsyncThunk<
  SerializableUser, // Return only serializable data to Redux
  { email: string; password: string },
  { dispatch: AppDispatch }
>("auth/summaristRegister", async ({ email, password }, { dispatch }) => {
  const userCredential: UserCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );

  // Extract serializable user data
  const user: SerializableUser = {
    uid: userCredential.user.uid,
    email: userCredential.user.email,
    displayName: userCredential.user.displayName,
    photoURL: userCredential.user.photoURL,
    subscription: "basic", // Default subscription value for new registrations
  };

  dispatch(setUser(user)); // Dispatch only serializable data
  return user; // Return serializable user data
});

// Action to perform summarist login
export const summaristLogin = createAsyncThunk<
  SerializableUser, // Return only serializable data to Redux
  { email: string; password: string },
  { dispatch: AppDispatch }
>("auth/summaristLogin", async ({ email, password }, { dispatch }) => {
  const userCredential: UserCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );

  // Extract serializable user data
  const user: SerializableUser = {
    uid: userCredential.user.uid,
    email: userCredential.user.email,
    displayName: userCredential.user.displayName,
    photoURL: userCredential.user.photoURL,
    subscription: "basic", // Default subscription value for login
  };

  dispatch(setUser(user)); // Dispatch only serializable data
  return user; // Return serializable user data
});

// Action for password reset
export const forgotPassword = createAsyncThunk<void, string>(
  "auth/forgotPassword",
  async (email) => {
    await sendPasswordResetEmail(auth, email);
  }
);

// Action for guest login
export const guestLogin = createAsyncThunk<
  SerializableUser, // Return only serializable data to Redux
  void,
  { dispatch: AppDispatch }
>("auth/guestLogin", async (_, { dispatch }) => {
  const userCredential: UserCredential = await signInAnonymously(auth);

  // Extract serializable user data
  const user: SerializableUser = {
    uid: userCredential.user.uid,
    email: null, // Guest users may not have an email
    displayName: "Guest",
    photoURL: null,
    subscription: "guest", // Default subscription value for guest login
  };

  dispatch(guestUser(user)); // Dispatch only serializable data
  return user; // Return serializable user data
});

// Action for user logout
export const logoutUser = createAsyncThunk<
  void,
  void,
  { dispatch: AppDispatch }
>("auth/logoutUser", async (_, { dispatch }) => {
  await signOut(auth);
  dispatch(signOutUser());
  console.log("YOU DID IT!");
});
