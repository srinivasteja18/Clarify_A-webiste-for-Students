import React, { useState } from "react";
import { isAuthenticated } from "../auth/helper/index";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaEnvelope, FaGraduationCap } from "react-icons/fa";
import { BsFillPersonFill } from "react-icons/bs";
import { RiLockPasswordFill } from "react-icons/ri";
import { updateProfile } from "./helper/userApiCalls";

export default function EditProfile({ edit, setEdit, load }) {
  const { user, token } = isAuthenticated();
  const navigate = useNavigate();
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    collage: "",
    error: "",
    success: false,
  });
  const { name, email, password, collage } = values;

  const handleChanges = (field) => (e) => {
    setValues({ ...values, error: false, [field]: e.target.value });
  };
  const onSubmit = (e) => {
    e.preventDefault();
    setValues({ ...values, error: false });
    updateProfile(user._id, token, { name, email, password, collage })
      .then((data) => {
        if (data.error) {
          setValues({ ...values, error: data.error, success: false });
          toast(data.error, { type: "error" });
        } else {
          toast("Profile Updated successfullly!!", { type: "success" });
          setEdit(0);
          load();
          navigate("/user/profile");
        }
      })
      .catch((err) => console.log("Error in updation", err));
  };
  return (
    <div className="edit-profile-container">
      <div className="auth-card">
        <h1>Edit Profile</h1>
        <form className="auth-form">
          <div className="auth-wrapper">
            <div className="auth-helper">
              <label className="auth-labels">Username</label>
              <br />
              <input
                onChange={handleChanges("name")}
                className="auth-inputs prfl"
                type="text"
                required
                value={name}
              />
              <BsFillPersonFill className="auth-icons" />
            </div>
            <div className="auth-helper">
              <label className="auth-labels">Collage</label>
              <br />
              <input
                onChange={handleChanges("collage")}
                className="auth-inputs"
                type="text"
                required
                value={collage}
              />
              <FaGraduationCap className="auth-icons" />
            </div>
          </div>
          <div className="auth-wrapper">
            <div className="auth-helper">
              <label className="auth-labels">Email Address</label>
              <br />
              <input
                onChange={handleChanges("email")}
                className="auth-inputs"
                type="email"
                required
                value={email}
              />
              <FaEnvelope className="auth-icons" />
            </div>
            <div className="auth-helper">
              <label className="auth-labels">Password</label>
              <br />
              <input
                onChange={handleChanges("password")}
                className="auth-inputs"
                type="password"
                required
                value={password}
              />
              <RiLockPasswordFill className="auth-icons" />
            </div>
          </div>
          <div className="edit-profile-buttons">
            <button onClick={() => setEdit(0)} className="cancel-auth-button">
              Cancel
            </button>
            <button onClick={onSubmit} className="auth-button">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
