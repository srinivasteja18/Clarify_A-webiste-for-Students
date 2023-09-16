import React, { useEffect, useState } from "react";
import { FaUser } from "react-icons/fa";
import { AiFillStar } from "react-icons/ai";
import { RiUserFollowFill } from "react-icons/ri";
import Base from "./Base";
import { getAllUsers, followUser, UnfollowUser } from "./helper/coreApiCalls";
import { isAuthenticated } from "../auth/helper";
import { getUser } from "../user/helper/userApiCalls";
import { toast } from "react-toastify";
import { Circle } from "better-react-spinkit";

export default function Users() {
  const { user, token } = isAuthenticated();
  const [searchUsers, setSearchUsers] = useState([]);
  const [searchFollowers, setSearchFollowers] = useState([]);
  const [curUser, setcurUser] = useState({});
  const [remUsers, setRemUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [curIndex, setCurIndex] = useState(-1);

  const preLoad = () => {
    setLoading(true);
    getAllUsers().then((data) => {
      if (data.error) {
        console.log("Error in fetching questions", data.error);
      } else {
        setcurUser(data);
        setRemUsers(data);
        setSearchUsers(data);
        getUser(user._id, token).then((val) => {
          if (val.error) {
            console.log("user not found!");
          } else {
            if (val.following.length) {
              const temp = [];
              const temp2 = [];
              data.forEach((user) => {
                let flag = 0;
                val.following.forEach((val) => {
                  if (val._id === user._id) {
                    temp.push(user);
                    flag = 1;
                  }
                });
                if (flag === 0) {
                  temp2.push(user);
                }
              });
              setRemUsers(temp2);
              setSearchFollowers(temp);
              setSearchUsers(temp2);
              setLoading(false);
              // console.log(temp, temp2);
            } else {
              setLoading(false);
            }
          }
        });
      }
    });
  };
  // console.log(searchUsers);
  useEffect(() => {
    preLoad();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleOnChange = (e) => {
    const searchText = e.target.value;
    console.log(searchText);
    const result = remUsers.filter((user) =>
      user.name.toLowerCase().includes(searchText)
    );
    const values = curUser.filter((user) =>
      user.name.toLowerCase().includes(searchText)
    );
    setSearchFollowers(values);
    setSearchUsers(result);
  };

  const handleFollow = (e, follower, index) => {
    if (user._id === follower._id) {
      toast("You cannot follow yourself", { type: "warning" });
      return;
    }
    setFollowLoading(true);
    setCurIndex(index);
    followUser(user._id, token, follower._id).then((data) => {
      console.log(data);
      if (data.error) {
        console.log("Follow request failed", data.error);
      } else {
        setFollowLoading(false);
        setCurIndex(-1);
        toast("Follow Request successfull!!", { type: "success" });
        preLoad();
      }
    });
  };
  const handleUnFollow = (e, follower, index) => {
    setFollowLoading(true);
    setCurIndex(index);
    UnfollowUser(user._id, token, follower._id).then((data) => {
      if (data.error) {
        console.log("Follow request failed", data.error);
      } else {
        setCurIndex(-1);
        setFollowLoading(false);
        window.location.reload();
      }
    });
  };

  const contentSection = () => (
    <div className="content-container">
      <div className="content-header">
        <h2>All Users</h2>
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
        ) : (
          <div>
            {!searchFollowers.length ? (
              <div></div>
            ) : (
              searchFollowers.map((user, index) => (
                <div key={index} className="profile-card user-card">
                  <div className="profile-icon-div">
                    <FaUser className="profile-icon" />
                  </div>
                  <div className="profile-info">
                    <h1 className="user-name">{user.name}</h1>
                    <div className="profile-info-div">
                      <p className="profile-collage">
                        Student at {user.collage}
                      </p>
                      <p>
                        Reputation: <AiFillStar /> {user.reputation}
                      </p>
                    </div>
                  </div>
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
                </div>
              ))
            )}
            {!searchUsers.length ? (
              <div></div>
            ) : (
              searchUsers.map((user, index) => (
                <div key={index} className="profile-card user-card">
                  <div className="profile-icon-div">
                    <FaUser className="profile-icon" />
                  </div>
                  <div className="profile-info">
                    <h1 className="user-name">{user.name}</h1>
                    <div className="profile-info-div">
                      <p className="profile-collage">
                        Student at {user.collage}
                      </p>
                      <p>
                        Reputation: <AiFillStar /> {user.reputation}
                      </p>
                    </div>
                  </div>
                  <div className="profile-button-div">
                    <button
                      onClick={(e) => handleFollow(e, user, index)}
                      style={{ marginRight: "10px" }}
                      className="ask-button profile-button"
                    >
                      {followLoading && curIndex === index ? (
                        <div className="loading-div">
                          <Circle color="white" size={25} />
                        </div>
                      ) : (
                        <>
                          <RiUserFollowFill style={{ marginRight: "5px" }} />
                          Follow
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <Base>
      <div className="main-page-container">{contentSection()}</div>
    </Base>
  );
}
