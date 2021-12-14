import React, { useEffect, useState } from "react";
import Base from "../core/Base";
import { FaUser } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { isAuthenticated } from "../auth/helper/index";
import { getUser, getUserActivity } from "./helper/userApiCalls";
import { useNavigate } from "react-router-dom";
import EditProfile from "./editProfile";
import { Circle } from "better-react-spinkit";

export default function Profile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    name: "",
    collage: "",
    reputation: "",
    followers: [],
    following: [],
    title: "",
  });
  const [editProfile, setEditProfile] = useState(0);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);

  const { user, token } = isAuthenticated();

  const preLoad = () => {
    setLoading(true);
    getUser(user._id, token).then((data) => {
      if (data.error) {
        console.log("Cannot Get User", data.error);
      } else {
        setProfile({
          ...profile,
          name: data.name,
          collage: data.collage,
          reputation: data.reputation,
          followers: data.followers,
          following: data.following,
        });
      }
      getUserActivity(user._id, token).then((data) => {
        if (data.error) {
          console.log("Cannot get activity of this user", data.error);
        } else {
          setActivities(data);
          setLoading(false);
        }
      });
    });
  };
  console.log(activities);
  useEffect(() => {
    preLoad();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleReputation = () => {
    let val = 0;
    if (activities.length) {
      activities.map((activity) => (val += activity.question.upvotes));
    }
    return val;
  };

  const handleQuestions = () => {
    let val = 0;
    if (activities.length) {
      activities.map((activity) => (val += activity.status === "asked"));
    }
    return val;
  };

  const profileSection = () => (
    <div className="profile-container">
      {loading ? (
        <div className="loading-div">
          <Circle color="white" size={100} />
        </div>
      ) : (
        <>
          <div className="profile-card">
            <div className="profile-icon-div">
              <FaUser className="profile-icon" />
            </div>
            <div className="profile-info">
              <h1 className="profile-name">{profile.name}</h1>
              <p className="profile-collage">Student at {profile.collage}</p>
            </div>
            <div className="profile-button-div">
              <button
                onClick={() => setEditProfile(1)}
                className="ask-button profile-button"
              >
                <MdEdit style={{ marginRight: "5px" }} />
                Edit Profile
              </button>
            </div>
          </div>
          {editProfile ? (
            <EditProfile
              edit={editProfile}
              setEdit={setEditProfile}
              load={preLoad}
            />
          ) : (
            <div></div>
          )}
          <div className="profile-summary-container">
            <div className="profile-summary-left">
              <h2 className="summary-text">Summary</h2>
              <div className="profile-stats">
                <h2>Stats</h2>
                <div className="profile-stats-info">
                  <div className="profile-stat">
                    <p className="profile-stat-number">{handleQuestions()}</p>
                    <p style={{ margin: "0" }}>questions</p>
                  </div>
                  <div className="profile-stat">
                    <p className="profile-stat-number">
                      {activities.length - handleQuestions()}
                    </p>
                    <p style={{ margin: "0" }}>answers</p>
                  </div>
                </div>
                <div className="profile-reputation">
                  <div className="profile-stat">
                    <p className="profile-stat-number">{handleReputation()}</p>
                    <p style={{ margin: "0" }}>Reputation</p>
                  </div>
                </div>
              </div>

              <div className="profile-followers">
                <div className="p-followers">
                  <p
                    className="profile-link"
                    onClick={() => {
                      profile.title = "Followers";
                      setProfile(profile);
                      navigate("/user/followers", {
                        state: profile,
                      });
                    }}
                  >
                    Followers
                  </p>
                  <p className="p-followers-number">
                    {profile.followers.length}
                  </p>
                </div>

                <div className="p-followers">
                  <p
                    className="profile-link"
                    onClick={() => {
                      profile.title = "Following";
                      setProfile(profile);
                      navigate("/user/following", {
                        state: profile,
                      });
                    }}
                  >
                    Following{" "}
                  </p>
                  <p className="p-followers-number">
                    {profile.following.length}
                  </p>
                </div>
              </div>
            </div>

            <div className="questions-container profile-summary-right">
              <h2 className="activity-name">Your Activity</h2>
              {activities.length ? (
                activities.map((activity, index) => (
                  <div
                    onClick={() => {
                      navigate("/questions/question", {
                        state: activity.question,
                      });
                    }}
                    key={index}
                    className="question-card activity-card"
                  >
                    <div className="activity-status-div">
                      <div className="activity-status">
                        <p>{activity.status}</p>
                      </div>
                      <div className="question-status">
                        <p className="question-status-number">
                          {activity.question.upvotes}
                        </p>
                        <p>Upvotes</p>
                      </div>
                    </div>
                    <div className="question-summary">
                      <h2>{activity.question.text}</h2>
                    </div>
                  </div>
                ))
              ) : (
                <div>No Activity Found!!</div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );

  return (
    <Base>
      <div className="main-page-container">{profileSection()}</div>
    </Base>
  );
}
