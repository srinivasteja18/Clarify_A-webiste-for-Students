import React from "react";
import { Fragment } from "react";
import { NavLink, useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { HiOutlineUserCircle } from "react-icons/hi";
import { isAuthenticated, signout } from "../auth/helper";
import "react-toastify/dist/ReactToastify.min.css";
import logo from "../images/logohome.png";

const Navigation = () => {
  const navigate = useNavigate();
  return (
    <div className="header">
      <div className="nav-helper">
        <div className="nav-container">
          <div
            onClick={() => navigate("/")}
            style={{ cursor: "pointer" }}
            className="nav-wrapper"
          >
            <div className="imghome-div">
              <img alt="logo" src={logo} />
            </div>
            <h1>Clarify</h1>
          </div>

          <ul className="nav-list">
            {isAuthenticated() ? (
              <Fragment>
                <li className="nav-item">
                  <Link className="nav-link" to="/user/profile">
                    <HiOutlineUserCircle className="nav-icon" />
                  </Link>
                </li>
                <li className="nav-item">
                  <span
                    style={{ cursor: "pointer" }}
                    className="nav-link"
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
              </Fragment>
            ) : (
              <Fragment>
                <li className="nav-item">
                  <NavLink
                    className="nav-link"
                    style={({ isActive }) => {
                      if (isActive) return { color: "gray" };
                      else return { color: "white" };
                    }}
                    to="/"
                  >
                    Home
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    className="nav-link"
                    style={({ isActive }) => {
                      if (isActive) return { color: "gray" };
                      else return { color: "white" };
                    }}
                    to="/signup"
                  >
                    SignUp
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    className="nav-link"
                    style={({ isActive }) => {
                      if (isActive) return { color: "gray" };
                      else return { color: "white" };
                    }}
                    to="/signin"
                  >
                    Login
                  </NavLink>
                </li>
              </Fragment>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};
export default Navigation;
