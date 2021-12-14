import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import { AiFillStar } from "react-icons/ai";
import { RiUserFollowFill } from "react-icons/ri";
import Base from "../core/Base";
import { isAuthenticated } from "../auth/helper";
import { getUser } from "./helper/userApiCalls";
import { getFollower } from "./helper/userApiCalls";
import { UnfollowUser } from "../core/helper/coreApiCalls";
import { Circle } from "better-react-spinkit";

export default function Followers() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, token } = isAuthenticated();
  const [followers, setFollowers] = useState([]);
  const [searchFollowers, setSearchFollowers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [curIndex, setCurIndex] = useState(-1);

  const preLoad = () => {
    setLoading(true);
    getUser(user._id, token, location.state._id).then((data) => {
      if (data.error) {
        console.log("getting user failed!!", data.error);
      } else {
        console.log(data);
        let array;
        if (location.state.title === "Followers") {
          array = data.followers;
        } else {
          array = data.following;
        }
        console.log(array);
        let temp = [];
        if (array.length) {
          array.map((obj, index) =>
            getFollower(user._id, token, obj._id).then((data) => {
              if (data.error) {
                console.log(data.error);
              } else {
                console.log(data);
                temp.push(data);
                if (index === array.length - 1) {
                  setFollowers(temp);
                  setSearchFollowers(temp);
                  setLoading(false);
                }
              }
              // console.log(followers, temp);
            })
          );
        } else {
          setLoading(false);
        }
      }
    });
  };
  useEffect(() => {
    preLoad();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // console.log(searchFollowers);
  const handleOnChange = (e) => {
    const searchText = e.target.value;
    const values = followers.filter((user) =>
      user.name.toLowerCase().includes(searchText)
    );
    setSearchFollowers(values);
  };

  const handleUnFollow = (e, follower, index) => {
    setFollowLoading(true);
    setCurIndex(index);
    UnfollowUser(user._id, token, follower._id).then((data) => {
      if (data.error) {
        console.log("Follow request failed", data.error);
      } else {
        setFollowLoading(false);
        setCurIndex(-1);
        window.location.reload();
      }
    });
  };

  const contentSection = () => (
    <div className="follower-container content-container">
      <div className="content-header">
        <h2>{location.state.title}</h2>
        <div className="search-div">
          <form className="search-form">
            <label className="search-label">
              <input
                placeholder="Search User"
                onChange={handleOnChange}
                className="search-input"
                type="text"
              />
            </label>
          </form>
        </div>
      </div>
      <div className="questions-container">
        {loading ? (
          <div className="loading-div">
            <Circle color="white" size={100} />
          </div>
        ) : !searchFollowers.length ? (
          <div>No Followers Found</div>
        ) : (
          searchFollowers.map((user, index) => (
            <div key={index} className="profile-card user-card">
              <div className="profile-icon-div">
                <FaUser className="profile-icon" />
              </div>
              <div className="profile-info">
                <h1 style={{ textAlign: "left" }} className="user-name">
                  {user.name}
                </h1>
                <div className="profile-info-div">
                  <p className="profile-collage">Student at {user.collage}</p>
                  <p>
                    Reputation: <AiFillStar /> {user.reputation}
                  </p>
                </div>
              </div>
              {location.state.title === "Following" ? (
                <div className="profile-button-div">
                  <button
                    onClick={(e) => handleUnFollow(e, user, index)}
                    style={{ marginRight: "10px" }}
                    className="unfollow-button"
                  >
                    {followLoading && curIndex === index ? (
                      <div className="loading-div">
                        <Circle color="white" size={25} />
                      </div>
                    ) : (
                      <>
                        <RiUserFollowFill style={{ marginRight: "5px" }} />
                        Unfollow
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <div></div>
              )}
            </div>
          ))
        )}
      </div>
      <button
        style={{ alignSelf: "center" }}
        className="ask-button"
        onClick={() => {
          navigate("/user/profile");
        }}
      >
        Go to Profile
      </button>
    </div>
  );

  return (
    <Base>
      <div className="main-page-container">{contentSection()}</div>
    </Base>
  );
}
