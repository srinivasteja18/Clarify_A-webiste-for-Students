import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "./App.css";

//components
import Home from "./core/Home";
import Signin from "./auth/signin";
import Signup from "./auth/signup";
import Users from "./core/users";
import Questions from "./core/questions";
import Profile from "./user/profile";
import PrivateRoute from "./auth/helper/PrivateRoutes";
import AskQuestion from "./user/askQuestion";
import Question from "./core/question";
import Followers from "./user/followers";
import EditProfile from "./user/editProfile";
import UpdateQuestion from "./user/updateQuestion";
import UpdateAnswer from "./user/updateAnswer";
import About from "./core/About";
import Feedback from "./core/feedback";

export default function Rootes() {
  return (
    <Router>
      <ToastContainer theme="dark" />
      <Routes>
        <Route exact path="/" element={<Home />}></Route>
        <Route exact path="/signup" element={<Signup />}></Route>
        <Route exact path="/signin" element={<Signin />}></Route>
        <Route exact path="/questions" element={<Questions />}></Route>
        <Route exact path="/about" element={<About />}></Route>
        <Route
          exact
          path="/users"
          element={
            <PrivateRoute>
              <Users />
            </PrivateRoute>
          }
        />
        <Route
          path="/user/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route
          path="/user/askQuestion"
          element={
            <PrivateRoute>
              <AskQuestion />
            </PrivateRoute>
          }
        />
        <Route
          path="/questions/question"
          element={
            <PrivateRoute>
              <Question />
            </PrivateRoute>
          }
        />
        <Route
          path="/user/followers"
          element={
            <PrivateRoute>
              <Followers />
            </PrivateRoute>
          }
        />
        <Route
          path="/user/following"
          element={
            <PrivateRoute>
              <Followers />
            </PrivateRoute>
          }
        />
        <Route
          path="/user/editprofile"
          element={
            <PrivateRoute>
              <EditProfile />
            </PrivateRoute>
          }
        />
        <Route
          path="/question/update"
          element={
            <PrivateRoute>
              <UpdateQuestion />
            </PrivateRoute>
          }
        />
        <Route
          path="/answer/update"
          element={
            <PrivateRoute>
              <UpdateAnswer />
            </PrivateRoute>
          }
        />
        <Route
          path="/feedback"
          element={
            <PrivateRoute>
              <Feedback />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}
