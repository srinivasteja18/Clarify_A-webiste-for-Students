import React from "react";
import { useNavigate } from "react-router-dom";
import Footer from "./Footer";
import Navigation from "./Navigation";

export default function About() {
  const navigate = useNavigate();
  return (
    <div>
      <Navigation />
      <div className="whole-container about-container">
        <div className="about-section">
          <h1>
            Where The Students{" "}
            <span onClick={() => navigate("/")} className="about-span">
              Clarify
            </span>{" "}
            Their Doubts
          </h1>
          <p className="welcome">Welcome!! </p>
          <p className="about-description">
            Iam Srinivas Teja,final year student from NIT Raipur. Clarify
            starts with an idea to help students. Students can post their
            queries, anything that can be related to whether its academic,
            programming, development, or it may be non-academic about collages
            etc. Anyone can answer to the questions that are posted by the
            others, And I believe sharing knowledge is the best thing that we
            can do. My motive is to provide a platform for all these type of
            questions that I think every student felt and needs. There may be
            many sources for answers, but the perspective of our fellow student
            is what makes this different.
          </p>
          <p className="about-description">
            Lets{" "}
            <span onClick={() => navigate("/")} className="about-span">
              Clarify
            </span>{" "}
            Ourselves!!
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
