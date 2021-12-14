import React from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../images/logo.png";
import { FaGithub, FaLinkedin } from "react-icons/fa";

export default function Footer() {
  const navigate = useNavigate();
  return (
    <div className="footer">
      <div className="footer-section">
        <div style={{ display: "flex", alignItems: "center" }}>
          <div style={{ width: "50px" }}>
            <img src={logo} alt="logo" />
          </div>
          <h3
            style={{
              marginLeft: "10px",
              marginTop: "0px",
              marginBottom: "0px",
            }}
            onClick={() => navigate("/")}
          >
            Clarify
          </h3>
        </div>
        <ul className="nav-list">
          <li className="nav-item">
            <Link className="nav-link-footer" to="/">
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link-footer" to="/about">
              About
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link-footer" to="/questions">
              Questions
            </Link>
          </li>
        </ul>
        <div className="follow-links">
          <p>Follow me on</p>
          <div className="quick-link">
            <a
              rel="noreferrer"
              href="https://github.com/srinivasteja18"
              target="_blank"
              style={{ color: "white" }}
            >
              <FaGithub className="footer-link" />
            </a>

            <a
              rel="noreferrer"
              href="https://www.linkedin.com/in/moparthi-srinivas-teja/"
              target="_blank"
              style={{ color: "white" }}
            >
              <FaLinkedin className="footer-link" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
