

import React, { useState } from "react";


export default async function Selected() {
  const data = await fetch(
    `https://us-central1-summaristt.cloudfunctions.net/getBooks?status=selected`
  );
  const selectedPosts = await data.json();

  return (
    <>
      <div className="for-you__title">Selected just for you
      </div>
      {selectedPosts.map((selectedPost: any) => (
        <div key={selectedPost.id}>
          <audio src={selectedPost.audioLink} />
          <a className="selected__book" href="/book/f9gy1gpai8">
            <div className="selected__book--sub-title">
              {selectedPost.subTitle}
            </div>
          
          <div className="selected__book--line"></div>
          <div className="selected__book--content">
            <figure className="book__image--wrapper">
              <img src={selectedPost.imageLink}
              width={140}
              height={140}/>
            </figure>
            <div className="selected__book--text">
              <div className="selected__book--title">{selectedPost.title}</div>
              <div className="selected__book--author">{selectedPost.author}</div>
              <div className="selected__book--duration-wrapper">
                <div className="selected__book--icon">
                  <svg
                    stroke="currentColor"
                    fill="currentColor"
                    strokeWidth="0"
                    viewBox="0 0 16 16"
                    height="1em"
                    width="1em"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"></path>
                  </svg>
                </div>
                <div className="selected__book--duration">3 mins 23 secs</div>
              </div>
            </div>
          </div>
          </a>
        </div>
      ))}
    </>
  );
}
