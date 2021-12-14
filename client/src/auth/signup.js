import React, { useState } from "react";
import { signup } from "../auth/helper/index";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { FaEnvelope, FaGraduationCap } from "react-icons/fa";
import { BsFillPersonFill } from "react-icons/bs";
import { RiLockPasswordFill } from "react-icons/ri";
import { Circle } from "better-react-spinkit";
import logo from "../images/logo.png";

const Signup = () => {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    collage: "",
    error: "",
    success: false,
    loading: false,
  });

  const { name, email, password, collage } = values;

  const handleChanges = (field) => (e) => {
    setValues({ ...values, error: false, [field]: e.target.value });
  };
  const onSubmit = (e) => {
    e.preventDefault();
    setValues({ ...values, error: false, loading: true });
    signup({ name, email, password, collage })
      .then((data) => {
        if (data.error) {
          setValues({ ...values, error: data.error, success: false });
          toast(data.error, { type: "error" });
        } else {
          setValues({
            name: "",
            email: "",
            password: "",
            error: "",
            success: true,
            loading: false,
          });
          toast("Signup Successful!! Please Signin", { type: "success" });
          navigate("/signin");
        }
      })
      .catch((err) => console.log("Error in SignUp", err));
  };
  const signupForm = () => (
    <div className="auth-container">
      <div className="img-div">
        <img src={logo} alt="logo" />
      </div>
      <h2>
        SignUp to{" "}
        <Link to="/" className="title">
          Clarify
        </Link>
      </h2>
      <div className="auth-card">
        <form className="auth-form">
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
          <button onClick={onSubmit} className="auth-button">
            {values.loading ? (
              <div className="loading-div">
                <Circle color="white" size={25} />
              </div>
            ) : (
              <>SignUp</>
            )}
          </button>
        </form>
      </div>
      <div className="auth-text">
        Already an User?
        <span
          onClick={() => {
            navigate("/signin");
          }}
          className="auth-span"
        >
          <span style={{ opacity: ".05" }}>j</span>Signin Here
        </span>
      </div>
    </div>
  );

  return <div className="whole-container auth-section">{signupForm()}</div>;
};
export default Signup;
