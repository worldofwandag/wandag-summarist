import React, { useRef, useState } from "react";
import Image from "next/image";
import googleLogo from "../assets/google.png";
import { useRouter } from "next/navigation";
import { auth } from "../firebase/config";
import {
  googleLogin,
  googleRegister,
  summaristRegister,
  summaristLogin,
  forgotPassword,
  guestLogin,
} from "../utility/auth"; // Importing authentication functions
import { useDispatch } from "react-redux";
import { AppDispatch } from "../redux/store";
import { routeReplacer } from "../utility/routeReplacer";

interface ModalProps {
  exitModal: () => void; // Function type for exiting modal
}

export default function Modal({ exitModal }: ModalProps) {
  const modalContentRef = useRef<HTMLDivElement | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [message, setMessage] = useState("");
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordLength, setPasswordLength] = useState("");

  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>(); // Set up dispatch

  const handleGoogleLogin = async () => {
    try {
      // Dispatch the googleLogin action to update Redux state with serializable data
      const user = await dispatch(googleLogin()).unwrap();
      // Retrieve the idToken directly from Firebase Authentication
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error("No current user found after Google login");
      }
      const idToken = await currentUser.getIdToken();
      // Call the API to set the authToken cookie
      await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ idToken }),
      });
      exitModal(); // Close the modal
      // Determine the current path and navigate accordingly
      routeReplacer(router);
    } catch (error) {
      console.error("Google Login Error:", error);
    }
  };

  const handleGoogleRegister = async () => {
    try {
      // Dispatch the googleRegister action to update Redux state with serializable data
      const user = await dispatch(googleRegister()).unwrap();
      // Retrieve the idToken directly from Firebase Authentication
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error("No current user found after Google registration");
      }
      const idToken = await currentUser.getIdToken();
      // Call the API to set the authToken cookie
      await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ idToken }),
      });
      exitModal(); // Close the modal
      // Determine the current path and navigate accordingly
      routeReplacer(router);
    } catch (error) {
      console.error("Google Register Error:", error);
    }
  };

  const handleSummaristRegister = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    try {
      // Dispatch the summaristRegister action to update Redux state with serializable data
      const user = await dispatch(
        summaristRegister({ email, password })
      ).unwrap();
      // Retrieve the idToken directly from Firebase Authentication
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error("No current user found after Summarist registration");
      }
      const idToken = await currentUser.getIdToken();
      // Call the API to set the authToken cookie
      await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ idToken }),
      });
      exitModal(); // Close the modal
      // Determine the current path and navigate accordingly
      routeReplacer(router);
    } catch (error) {
      setPasswordLength("Password should be at least 6 characters long");
      console.error("Summarist Register Error:", error);
    }
  };

  const handleSummaristLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      // Dispatch the summaristLogin action to update Redux state with serializable data
      const user = await dispatch(summaristLogin({ email, password })).unwrap();
      // Retrieve the idToken directly from Firebase Authentication
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error("No current user found after Summarist login");
      }
      const idToken = await currentUser.getIdToken();
      // Call the API to set the authToken cookie
      await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ idToken }),
      });
      exitModal(); // Close the modal
      // Determine the current path and navigate accordingly
      routeReplacer(router);
    } catch (error) {
      setPasswordError("Error: password is invalid or user is not registered");
      console.error("Summarist Login Error:", error);
    }
  };

  const handleForgotPassword = async () => {
    if (showPasswordReset) {
      try {
        await dispatch(forgotPassword(forgotPasswordEmail)).unwrap();
        console.log("reset pw");
        setMessage("Password reset email sent! Check your inbox.");
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "An unknown error occurred";
        setMessage("Error: " + errorMessage);
        console.error(error);
      }
    } else {
      setShowPasswordReset(true);
    }
  };
  const handleGuestLogin = async () => {
    try {
      // Dispatch the guestLogin action to update Redux state with serializable data
      const user = await dispatch(guestLogin()).unwrap();
      // Retrieve the idToken directly from Firebase Authentication
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error("No current user found after Guest login");
      }
      const idToken = await currentUser.getIdToken();
      // Call the API to set the authToken cookie
      await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ idToken }),
      });
      exitModal(); // Close the modal
      // Determine the current path and navigate accordingly
      routeReplacer(router);
    } catch (error) {
      console.error("Guest Login Error:", error);
    }
  };

  const handleClickOutside = (event: React.MouseEvent) => {
    if (
      modalContentRef.current &&
      !modalContentRef.current.contains(event.target as Node)
    ) {
      exitModal();
    }
  };

  return (
    <div className="auth__wrapper" onClick={handleClickOutside}>
      <div className="auth" ref={modalContentRef}>
        <div className="auth__content">
          <div className="auth__title">
            {isRegistering ? "Sign up to Summarist" : "Log in to Summarist"}
          </div>
          {!isRegistering && (
            <>
              <button
                className="btn guest__btn--wrapper"
                onClick={handleGuestLogin}
              >
                <figure className="guest__icon--mask">
                  <svg
                    stroke="currentColor"
                    fill="currentColor"
                    strokeWidth="0"
                    viewBox="0 0 448 512"
                    height="1em"
                    width="1em"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm89.6 32h-16.7c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16h-16.7C60.2 288 0 348.2 0 422.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-41.6c0-74.2-60.2-134.4-134.4-134.4z"></path>
                  </svg>
                </figure>
                <div>Login as a Guest</div>
              </button>
              <div className="auth__separator">
                <span className="auth__separator--text">or</span>
              </div>
            </>
          )}
          {isRegistering ? (
            <button
              className="btn google__btn--wrapper"
              onClick={handleGoogleRegister}
            >
              <figure className="google__icon--mask">
                <Image
                  src={googleLogo}
                  width={24}
                  height={24}
                  alt="googlelogo"
                />
              </figure>
              <div>Sign up with Google</div>
            </button>
          ) : (
            <button
              className="btn google__btn--wrapper"
              onClick={handleGoogleLogin}
            >
              <figure className="google__icon--mask">
                <Image
                  src={googleLogo}
                  width={24}
                  height={24}
                  alt="googlelogo"
                />
              </figure>
              <div>Login with Google</div>
            </button>
          )}
          <div className="auth__separator">
            <span className="auth__separator--text">or</span>
          </div>
          {isRegistering ? (
            <form
              className="auth__main--form"
              onSubmit={handleSummaristRegister}
            >
              <input
                className="auth__main--input"
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                className="auth__main--input"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {passwordLength && (
                <div className="login__error">{passwordLength}</div>
              )}
              <button className="btn auth_modal--button" type="submit">
                <span>Sign Up</span>
              </button>
            </form>
          ) : (
            <form className="auth__main--form" onSubmit={handleSummaristLogin}>
              <input
                className="auth__main--input"
                type="text"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                className="auth__main--input"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {passwordError && (
                <div className="login__error">{passwordError}</div>
              )}
              <button className="btn auth_modal--button" type="submit">
                <span>Login</span>
              </button>
            </form>
          )}
          {!isRegistering && (
            <>
              {showPasswordReset && (
                <div className="auth__forgot--password-container">
                  <input
                    className="auth__main--input auth__password--reset-input"
                    type="email"
                    placeholder="Enter your email for password reset"
                    value={forgotPasswordEmail}
                    onChange={(e) => setForgotPasswordEmail(e.target.value)}
                  />
                  <button
                    className="auth__forgot--password-submit"
                    onClick={handleForgotPassword}
                  >
                    Please reset my password
                  </button>
                </div>
              )}
              <div
                className="auth__forgot--password"
                onClick={handleForgotPassword}
              >
                Forgot your password?
              </div>
              {message && <div className="auth__message">{message}</div>}
            </>
          )}
          <button
            className="auth__switch--btn"
            onClick={() => setIsRegistering(!isRegistering)}
          >
            {isRegistering
              ? "Already have an account?"
              : "Don't have an account?"}
          </button>
          <div className="auth__close--btn" onClick={exitModal}>
            <svg
              stroke="currentColor"
              fill="none"
              strokeWidth="0"
              viewBox="0 0 24 24"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6.2253 4.81108C5.83477 4.42056 5.20161 4.42056 4.81108 4.81108C4.42056 5.20161 4.42056 5.83477 4.81108 6.2253L10.5858 12L4.81114 17.7747C4.42062 18.1652 4.42062 18.7984 4.81114 19.1889C5.20167 19.5794 5.83483 19.5794 6.22535 19.1889L12 13.4142L17.7747 19.1889C18.1652 19.5794 18.7984 19.5794 19.1889 19.1889C19.5794 18.7984 19.5794 18.1652 19.1889 17.7747L13.4142 12L19.189 6.2253C19.5795 5.83477 19.5795 5.20161 19.189 4.81108C18.7985 4.42056 18.1653 4.42056 17.7748 4.81108L12 10.5858L6.2253 4.81108Z"
                fill="currentColor"
              ></path>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
