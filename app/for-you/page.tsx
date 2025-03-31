import React from "react";
import Image from "next/image";
import book from "../assets/book-placeholder.png";
import Searchbar from "../components/Searchbar";
import Sidebar from "../components/Sidebar";
import Selected from "../components/Selected";
import Recommended from "../components/Recommended";
import Suggested from "../components/Suggested";

const Page = () => {
  return (
    <>
      <div className="wrapper">
        <Searchbar />
        <div className="sidebar__overlay sidebar__overlay--hidden" />
        <Sidebar />
        <div className="row">
          <div className="container">
            <div className="for-you__wrapper">
              <Selected />
              <Recommended />
              <Suggested />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
