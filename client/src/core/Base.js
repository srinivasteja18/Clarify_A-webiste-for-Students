import React from "react";
import Navigation from "./Navigation";
import Footer from "./Footer";
import SideBar from "./SideBar";
export default function Base({ title = "Homepage", children }) {
  return (
    <div className="whole-container">
      <Navigation />
      <div className="middle-section">
        <SideBar />
        <div className="main-bar">{children}</div>
      </div>
      <Footer />
    </div>
  );
}
