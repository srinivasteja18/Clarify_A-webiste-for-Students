import React, { useState } from "react";
import emailjs from "emailjs-com";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";

import { FaGithub, FaLinkedin, FaMobile, FaEnvelope } from "react-icons/fa";
import Navigation from "./Navigation";
import Footer from "./Footer";
import { useNavigate } from "react-router-dom";
export default function Feedback() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const handleOnClick = (e) => {
    e.preventDefault();
    if (name === "") {
      toast("Enter the required details", { type: "error" });
      return;
    }
    if (message === "") {
      toast("Type the message that you want to send", { type: "warning" });
      return;
    }
    emailjs
      .sendForm(
        "service_2brpslk",
        "template_xs5nn63",
        e.target,
        "user_8F7LBmmcSt2r8rrSGPN5q"
      )
      .then((res) => {
        console.log("success");
        toast("Thankyou for your Feedback", { type: "success" });
        setName("");
        setMessage("");
        navigate("/");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <Navigation />
      <div id="contact" className="main-bar contact-section">
        <h1 className="contact-section-h1"> Contact </h1>
        <div className="contact-card">
          <div className="contact-card-left">
            <div className="feedback-text">
              <h1>Get in Touch</h1>
              <p>
                Thankyou for supporting this website and I hope you all are
                doing great and liked this website. If so Iam really happy if
                you spread a word about this with all your friends.
              </p>
              <p>
                If you are facing any issues with this website or having any
                suggestions, feel free to send a feedback. I would love to hear
                your feedback and all your suggestions which helps me improving
                this website.
              </p>
            </div>
            <div className="contact-section-details">
              <div>
                <p>
                  {" "}
                  <FaMobile className="details-icons" />
                  8019947779
                </p>
              </div>
              <div>
                <p>
                  <FaEnvelope className="details-icons" />
                  srinivasmoparthi17@gmail.com
                </p>
              </div>
            </div>
            <div className="Home_section_icons">
              <a href="https://github.com/srinivasteja18" target="_blank">
                <FaGithub className="Home_section_icon" />
              </a>
              <a
                href="https://www.linkedin.com/in/moparthi-srinivas-teja/"
                target="_blank"
              >
                <FaLinkedin className="Home_section_icon" />
              </a>
            </div>
          </div>
          <form className="contact-form" onSubmit={handleOnClick}>
            <div className="contact-form-div">
              <h1>Contact Form</h1>
              <div className="auth-helper">
                <label className="auth-labels contact-section-label">
                  Name
                </label>
                <br />
                <input
                  type="text"
                  className="contact-section-input"
                  name="user_name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="auth-helper">
                <label className="auth-labels contact-section-label">
                  Feedback
                </label>
                <br />
                <textarea
                  className="contact-section-input"
                  name="user_message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                ></textarea>
                <br />
              </div>
              <button className="ask-button contact-button">Send</button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}
