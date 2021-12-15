import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { isAuthenticated, signout } from "../auth/helper/index";

export default function Sidebar() {
  const navigate = useNavigate();
  return (
    <div className="side-bar">
      <ul className="side-bar-list">
        <li className="side-bar-item">
          <NavLink
            className={({ isActive }) =>
              isActive ? "side-bar-active" : "side-bar-link"
            }
            to="/"
          >
            Home
          </NavLink>
        </li>
        <li className="side-bar-item">
          <NavLink
            className={({ isActive }) =>
              isActive ? "side-bar-active" : "side-bar-link"
            }
            to="/users"
          >
            Users
          </NavLink>
        </li>
        <li className="side-bar-item">
          <NavLink
            className={({ isActive }) =>
              isActive ? "side-bar-active" : "side-bar-link"
            }
            to="/questions"
          >
            All Questions
          </NavLink>
        </li>
        <li className="side-bar-item">
          <NavLink
            className={({ isActive }) =>
              isActive ? "side-bar-active" : "side-bar-link"
            }
            to="/about"
          >
            About
          </NavLink>
        </li>
        {isAuthenticated() && (
          <>
            <li className="side-bar-item">
              <span
                style={{ cursor: "pointer" }}
                className="side-bar-link"
                onClick={() => {
                  navigate("/feedback");
                }}
              >
                Feedback
              </span>
            </li>
            <li className="side-bar-item">
              <span
                style={{ cursor: "pointer" }}
                className="side-bar-link"
                onClick={() => {
                  signout(() => {
                    toast("Signout Successful!!", { type: "success" });
                    navigate("/");
                  });
                }}
              >
                SignOut
              </span>
            </li>
          </>
        )}
      </ul>
    </div>
  );
}
