import React, { useState } from "react";
import { isAuthenticated, Authenticate, signin } from "../auth/helper";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import { FaEnvelope } from "react-icons/fa";
import { RiLockPasswordFill } from "react-icons/ri";
import { Circle } from "better-react-spinkit";
import logo from "../images/logo.png";

const Signin = () => {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    email: "",
    password: "",
    error: "",
    loading: false,
    didRedirect: "",
  });
  const { email, password, didRedirect } = values;

  const handleChange = (field) => (e) => {
    setValues({ ...values, error: false, [field]: e.target.value });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    setValues({ ...values, error: false, loading: true });
    signin({ email, password })
      .then((data) => {
        if (data.error) {
          setValues({ ...values, error: data.error, loading: false });
          toast("User Account not found!! Please Signup", { type: "warning" });
        } else {
          Authenticate(data, () => {
            setValues({
              ...values,
              email: "",
              password: "",
              error: "",
              loading: false,
              didRedirect: true,
            });
          });
        }
      })
      .catch((err) =>
        toast("SignIn Failed, Please check your Details", { type: "error" })
      );
  };

  const performredirect = () => {
    if (didRedirect) {
      return navigate("/");
    }
    if (isAuthenticated()) {
      console.log("GO GO");
      navigate("/");
    }
  };

  const SigninForm = () => (
    <div className="auth-container">
      <div className="img-div">
        <img src={logo} alt="logo" />
      </div>
      <h2>
        SignIn to{" "}
        <Link to="/" className="title">
          Clarify
        </Link>
      </h2>
      <div className="auth-card">
        <form className="auth-form">
          <div className="auth-helper">
            <label className="auth-labels">Email Address</label>
            <br />
            <input
              value={email}
              onChange={handleChange("email")}
              className="auth-inputs"
              type="email"
              required
            />
            <FaEnvelope className="auth-icons" />
          </div>

          <div className="auth-helper">
            <label className="auth-labels">Password</label>
            <br />
            <input
              value={password}
              onChange={handleChange("password")}
              className="auth-inputs"
              type="password"
              required
            />
            <RiLockPasswordFill className="auth-icons" />
          </div>

          <button onClick={onSubmit} className="auth-button">
            {values.loading ? (
              <div className="loading-div">
                <Circle color="white" size={25} />
              </div>
            ) : (
              <>Signin</>
            )}
          </button>
        </form>
      </div>
      <div className="auth-text">
        New to Clarify?
        <span
          onClick={() => {
            navigate("/signup");
          }}
          className="auth-span"
        >
          <span style={{ opacity: ".05" }}>j</span>Create an account
        </span>
      </div>
    </div>
  );

  return (
    <div className="whole-container auth-section">
      {SigninForm()}
      {performredirect()}
    </div>
  );
};
export default Signin;
