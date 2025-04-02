// utils/auth.ts

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
import { AppDispatch } from "../redux/store";
import { login, logout } from "../redux/userSlice";

const provider = new GoogleAuthProvider();

export const googleLogin = () => async (dispatch: AppDispatch) => {
  const result = await signInWithPopup(auth, provider);
  dispatch(login(result.user));
  return result.user;
};

export const googleRegister = () => async (dispatch: AppDispatch) => {
  const result = await signInWithPopup(auth, provider);
  dispatch(login(result.user));
  return result.user;
};

export const summaristRegister = (email: string, password: string) => async (dispatch: AppDispatch) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  dispatch(login(userCredential.user));
  return userCredential.user;
};

export const summaristLogin = (email: string, password: string) => async (dispatch: AppDispatch) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  dispatch(login(userCredential.user));
  return userCredential.user;
};

export const forgotPassword = async (email: string) => {
  await sendPasswordResetEmail(auth, email);
};

export const guestLogin = () => async (dispatch: AppDispatch) => {
  const userCredential = await signInAnonymously(auth);
  dispatch(login(userCredential.user));
  return userCredential.user;
};

export const logoutUser = () => async (dispatch: AppDispatch) => {
  await signOut(auth);
  dispatch(logout());
};