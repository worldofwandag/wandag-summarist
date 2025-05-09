import React from "react";
import Link from "next/link";
import { cookies } from "next/headers"; // For accessing cookies in server components
import { initAdmin } from "../firebase/firebaseAdmin"; // Firebase Admin initialization
import { admin } from "../firebase/firebaseAdmin"; // Import the admin object
import { Books } from "../utility/book";


interface RecommendedProps {
  books: Books[];
  isLoggedIn: boolean;
  fetchError?: string;
}

// Server-side function to fetch books and verify authentication
async function fetchRecommendedBooks(): Promise<RecommendedProps> {
  const cookieStore = await cookies();
  const token = cookieStore.get("authToken")?.value;

  let isLoggedIn = false;
  let books: Books[] = [];
  let fetchError = undefined;
  console.log("isLoggedIn:", isLoggedIn);

  try {
    console.log("authToken:", token);

    // Verify Firebase Auth Token
    if (token) {
      try {
        const decodedToken = await admin.auth().verifyIdToken(token); // Use admin.auth() directly
        isLoggedIn = !!decodedToken;
      } catch (error) {
        console.error("Error verifying ID token:", error);
      }
    }


    // Fetch books
    try {
      const response = await fetch(
        `https://us-central1-summaristt.cloudfunctions.net/getBooks?status=recommended`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch books: ${response.statusText}`);
      }

      const data = await response.json();
      if (Array.isArray(data)) {
        books = data;
      } else if (data?.books && Array.isArray(data.books)) {
        books = data.books; // Handle { books: [...] } structure
      } else {
        throw new Error("Unexpected API response format");
      }
    } catch (error) {
      console.error("Error fetching books:", error);
      fetchError = (error as Error).message;
    }
  } catch (error) {
    console.error("Error initializing Firebase Admin:", error);
    fetchError = "Failed to initialize Firebase Admin";
  }

  return { books, isLoggedIn, fetchError };
}

// Recommended Component
export default async function Recommended() {
  const { books, isLoggedIn, fetchError } = await fetchRecommendedBooks();

  return (
    <div>
      <div className="for-you__title">Recommended For You</div>
      <div className="for-you__sub--title">We think you’ll like these</div>
      {fetchError && (
        <div
          className="error-message"
          style={{ color: "red", marginBottom: "1rem" }}
        >
          Error fetching books: {fetchError}
        </div>
      )}
      <div className="for-you__recommended--books">
        {books && books.length > 0 ? (
          books.map((book: Books) => (
            <Link href={`/book/${book.id}`} key={book.id}>
              <div className="for-you__recommended--books-link">
                {book.subscriptionRequired && !isLoggedIn && (
                  <div className="book__pill book__pill--subscription-required">
                    Premium
                  </div>
                )}
                {book.audioLink && <audio src={book.audioLink}></audio>}
                <figure className="book__image--wrapper">
                  {book.imageLink && (
                    <img src={book.imageLink} alt={book.title || "Book"} />
                  )}
                </figure>
                <div className="recommended__book--title">
                  {book.title || "Unknown Title"}
                </div>
                <div className="recommended__book--author">
                  {book.author || "Unknown Author"}
                </div>
                <div className="recommended__book--sub-title">
                  {book.subTitle || ""}
                </div>
                <div className="recommended__book--details-wrapper">
                  <div className="recommended__book--details">
                    <div className="recommended__book--details-icon">
                      <svg
                        stroke="currentColor"
                        fill="currentColor"
                        strokeWidth="0"
                        viewBox="0 0 24 24"
                        height="1em"
                        width="1em"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z"></path>
                        <path d="M13 7h-2v6h6v-2h-4z"></path>
                      </svg>
                    </div>
                    <div className="recommended__book--details-text">03:24</div>
                  </div>
                  <div className="recommended__book--details">
                    <div className="recommended__book--details-icon">
                      <svg
                        stroke="currentColor"
                        fill="currentColor"
                        strokeWidth="0"
                        viewBox="0 0 1024 1024"
                        height="1em"
                        width="1em"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M908.1 353.1l-253.9-36.9L540.7 86.1c-3.1-6.3-8.2-11.4-14.5-14.5-15.8-7.8-35-1.3-42.9 14.5L369.8 316.2l-253.9 36.9c-7 1-13.4 4.3-18.3 9.3a32.05 32.05 0 0 0 .6 45.3l183.7 179.1-43.4 252.9a31.95 31.95 0 0 0 46.4 33.7L512 754l227.1 119.4c6.2 3.3 13.4 4.4 20.3 3.2 17.4-3 29.1-19.5 26.1-36.9l-43.4-252.9 183.7-179.1c5-4.9 8.3-11.3 9.3-18.3 2.7-17.5-9.5-33.7-27-36.3zM664.8 561.6l36.1 210.3L512 672.7 323.1 772l36.1-210.3-152.8-149L417.6 382 512 190.7 606.4 382l211.2 30.7-152.8 148.9z"></path>
                      </svg>
                    </div>
                    <div className="recommended__book--details-text">
                      {book.averageRating || "-"}
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="no-books-message">
            <b>
              {fetchError
                ? "Error loading books"
                : "No recommended books available"}
            </b>
          </div>
        )}
      </div>
    </div>
  );
}