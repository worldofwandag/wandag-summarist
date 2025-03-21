import React, { useRef, useState } from "react";
import Image from "next/image";
import googleLogo from "../assets/google.png";
import { auth } from "../firebase/config";
import { useRouter } from "next/navigation";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  signInAnonymously,
} from "firebase/auth";
const provider = new GoogleAuthProvider(); // Initialize Google provider

export default function Modal({ exitModal }) {
  const modalContentRef = useRef(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState(""); // State for forgot password
  const [message, setMessage] = useState(""); // State for feedback message
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordLength, setPasswordLength] = useState("");

  const router = useRouter();

  function googleLogin() {
    signInWithPopup(auth, provider)
      .then((result) => {
        // User successfully logged in
        const user = result.user;
        console.log("User logged in: ", user);
        // Redirect to "/foryou" page
        router.push("/foryou");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error(errorCode, errorMessage);
      });
  }

  function googleRegister() {
    signInWithPopup(auth, provider)
      .then((result) => {
        // User successfully registered
        const user = result.user;
        console.log("User registered: ", user);
        // Redirect to "/foryou" page
        router.push("/foryou");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error(errorCode, errorMessage);
      });
  }

  function summaristRegister(e) {
    e.preventDefault(); // Prevent the default form submission
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        // Redirect to "/foryou" page
        router.push("/foryou");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        setPasswordLength("Password should be at least 6 characters long")
        console.error(errorCode, errorMessage); // Handle error appropriately
      });
  }

  function summaristLogin(e) {
    e.preventDefault(); // Prevent the default form submission
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        // Redirect to "/foryou" page
        router.push("/foryou");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        setPasswordError("Error: password is invalid or user is not registered");
        console.error(errorCode, errorMessage); // Handle error appropriately
      });
  }

  function forgotPassword() {
    if (showPasswordReset) {
      sendPasswordResetEmail(auth, forgotPasswordEmail)
        .then(() => {
          // Email sent
          setMessage("Password reset email sent! Check your inbox.");
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.error(errorCode, errorMessage);
          setMessage("Error: " + errorMessage);
        });
    } else {
      setShowPasswordReset(true);
    }
  }

  function guestLogin() {
    signInAnonymously(auth)
    .then((userCredential) => {
        // User signed in anonymously
        const user = userCredential.user;
        console.log("Guest logged in:", user);
        // Navigate to the /foryou page
        router.push("/foryou");
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error("Error during guest login:", errorCode, errorMessage);
    });
  }

  const handleClickOutside = (event) => {
    if (
      modalContentRef.current &&
      !modalContentRef.current.contains(event.target)
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
          {/* guest login */}
          {!isRegistering && (
            <>
              <button className="btn guest__btn--wrapper" onClick={guestLogin}>
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
          {/* google register or login */}
          {isRegistering ? (
            <button
              className="btn google__btn--wrapper"
              onClick={googleRegister}
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
            <button className="btn google__btn--wrapper" onClick={googleLogin}>
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

          {/* summarist register or login */}
          {isRegistering ? (
            <form className="auth__main--form" onSubmit={summaristRegister}>
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
              {passwordLength && <div className="login__error">{passwordLength}</div>}
              <button className="btn auth_modal--button" type="submit">
                <span>Sign Up</span>
              </button>
            </form>
          ) : (
            <form className="auth__main--form" onSubmit={summaristLogin}>
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
              {passwordError && <div className="login__error">{passwordError}</div>}
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
                    onClick={forgotPassword}
                  >
                    Please reset my password
                  </button>
                </div>
              )}
              <div className="auth__forgot--password" onClick={forgotPassword}>
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
