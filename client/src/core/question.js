import React, { useState, useEffect } from "react";
import Base from "./Base";
import { useNavigate, useLocation } from "react-router-dom";
import { FaEdit, FaUser } from "react-icons/fa";
import { AiFillDelete } from "react-icons/ai";
import { AiFillStar, AiFillLike, AiFillDislike } from "react-icons/ai";
import { isAuthenticated } from "../auth/helper";
import { Circle } from "better-react-spinkit";

import {
  getQuestion,
  updateAnswerDownvotes,
  updateQuestionDownvotes,
  updateQuestionUpvotes,
  updateAnswerUpvotes,
  deleteAnswer,
  deleteQuestion,
} from "./helper/coreApiCalls";
import { toast } from "react-toastify";
import PostAnswer from "./postAnswer";

export default function Question() {
  const location = useLocation();
  const navigate = useNavigate();
  const [state, setState] = useState(0);
  const [loading, setLoading] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);
  const [voteLoading, setVoteLoading] = useState(false);
  const [curIndex, setCurIndex] = useState(-1);
  const [value, setValue] = useState(0);
  const { user, token } = isAuthenticated();
  const [question, setQuestion] = useState({
    text: "",
    description: "",
    upvotes: 0,
    replies: [],
  });
  const [likeBg, setLikeBg] = useState(0);
  const [unLikeBg, setUnLikeBg] = useState(0);

  const preLoad = () => {
    setLoading(true);
    getQuestion(location.state._id).then((data) => {
      if (data.error) {
        console.log("Question Not Found", data.error);
      } else {
        setQuestion(data);
        setLoading(false);
      }
    });
  };
  useEffect(() => {
    preLoad();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLike = (e) => {
    if (user._id === question.user._id) {
      toast("You cannot upvote your own Post", { type: "warning" });
      return;
    }
    setLikeLoading(true);
    if (likeBg === 0) {
      updateQuestionUpvotes(user._id, token, question).then((data) => {
        if (data.error) {
          toast(data.error, { type: "warning" });
          console.log("Like not updated", data.error);
        } else {
          setQuestion(data);
          if (likeBg === 0) {
            setLikeBg(1);
            setUnLikeBg(0);
          } else setLikeBg(0);
        }
        setLikeLoading(false);
      });
    } else {
      updateQuestionDownvotes(user._id, token, question).then((data) => {
        if (data.error) {
          console.log("Like not updated", data.error);
          toast(data.error, { type: "warning" });
        } else {
          setQuestion(data);
          if (likeBg === 0) {
            setLikeBg(1);
            setUnLikeBg(0);
          } else setLikeBg(0);
        }
        setLikeLoading(false);
      });
    }
  };
  const handleUnLike = (e) => {
    if (user._id === question.user._id) {
      toast("You cannot downvote your own Post", { type: "warning" });
      return;
    }
    setLikeLoading(true);
    if (unLikeBg === 0) {
      updateQuestionDownvotes(user._id, token, question).then((data) => {
        if (data.error) {
          toast(data.error, { type: "warning" });

          console.log("Like not updated", data.error);
        } else {
          setQuestion(data);
          if (unLikeBg === 0) {
            setUnLikeBg(1);
            setLikeBg(0);
          } else setUnLikeBg(0);
        }
        setLikeLoading(false);
      });
    } else {
      updateQuestionUpvotes(user._id, token, question).then((data) => {
        if (data.error) {
          toast(data.error, { type: "warning" });

          console.log("Like not updated", data.error);
        } else {
          setQuestion(data);
          if (unLikeBg === 0) {
            setUnLikeBg(1);
            setLikeBg(0);
          } else setUnLikeBg(0);
        }
        setLikeLoading(false);
      });
    }
  };

  const handleUpVote = (e, answer, index) => {
    if (user._id === answer.user._id) {
      toast("You cannot downvote your own Post", { type: "warning" });
      return;
    }
    setVoteLoading(true);
    setCurIndex(index);
    console.log(e.currentTarget.style);
    if (e.currentTarget.style.color === "rgb(31, 111, 235)") {
      e.currentTarget.style.color = "white";
      updateAnswerDownvotes(user._id, token, answer).then((data) => {
        if (data.error) {
          toast(data.error, { type: "warning" });

          console.log("Answer upvote not updated", data.error);
        } else {
          console.log("sucess");
          if (value === 0) {
            setValue(1);
          } else {
            setValue(0);
          }
          preLoad();
        }
        setVoteLoading(false);
        setCurIndex(-1);
      });
    } else {
      e.currentTarget.style.color = "rgb(31, 111, 235)";
      updateAnswerUpvotes(user._id, token, answer).then((data) => {
        if (data.error) {
          toast(data.error, { type: "warning" });
          console.log("Answer upvote not updated", data.error);
        } else {
          console.log("sucess");
          if (value === 0) {
            setValue(1);
          } else {
            setValue(0);
          }
          preLoad();
        }
        setVoteLoading(false);
        setCurIndex(-1);
      });
    }
  };

  const handleDownVote = (e, answer, index) => {
    if (user._id === answer.user._id) {
      toast("You cannot downvote your own Post", { type: "warning" });
      return;
    }
    setVoteLoading(true);
    setCurIndex(index);
    console.log(e.currentTarget.style);
    if (e.currentTarget.style.color === "rgb(31, 111, 235)") {
      e.currentTarget.style.color = "white";
      updateAnswerUpvotes(user._id, token, answer).then((data) => {
        if (data.error) {
          toast(data.error, { type: "warning" });

          console.log("Answer upvote not updated", data.error);
        } else {
          console.log("sucess");
          if (value === 0) {
            setValue(1);
          } else {
            setValue(0);
          }
          preLoad();
        }
        setVoteLoading(false);
        setCurIndex(-1);
      });
    } else {
      e.currentTarget.style.color = "rgb(31, 111, 235)";
      updateAnswerDownvotes(user._id, token, answer).then((data) => {
        if (data.error) {
          toast(data.error, { type: "warning" });

          console.log("Answer upvote not updated", data.error);
        } else {
          console.log("sucess");
          if (value === 0) {
            setValue(1);
          } else {
            setValue(0);
          }
          preLoad();
        }
        setVoteLoading(false);
        setCurIndex(-1);
      });
    }
  };

  const handleDelete = () => {
    deleteQuestion(user._id, token, question._id).then((data) => {
      if (data.error) {
        toast(data.error, { type: "warning" });
        console.log(data.error);
      } else {
        navigate("/");
      }
    });
  };

  const contentSection = () => (
    <div className="q-card">
      <div className="q-title">
        <div className="q-wrapper">
          <div className="q-status">
            <AiFillLike
              style={{ color: likeBg === 0 ? "white" : "#1f6feb" }}
              onClick={handleLike}
              className="q-like"
            />
            {likeLoading ? (
              <div className="loading-div">
                <Circle color="white" size={30} />
              </div>
            ) : (
              <h2>{question.upvotes}</h2>
            )}
            <AiFillDislike
              style={{ color: unLikeBg === 0 ? "white" : "#1f6feb" }}
              onClick={handleUnLike}
              className="q-like"
            />
          </div>
          <div className="q-text">
            <h1>{question.text}</h1>
          </div>
        </div>
        <div className="q-asked">
          <p className="q-asked-title">Asked by</p>
          <div className="q-asked-user">
            <FaUser className="q-asked-icon" />
            <p>{question.user && question.user.name}</p>
          </div>
          <p>
            <AiFillStar className="q-asked-icon" />{" "}
            {question.user && question.user.reputation}
          </p>
          <div className="q-icons-div">
            <FaEdit
              className="q-icon"
              onClick={() => {
                if (user._id !== question.user._id) {
                  toast("You cannot edit this question", { type: "warning" });
                  return;
                }
                navigate("/question/update", { state: question });
              }}
            />
            <AiFillDelete className="q-icon" onClick={handleDelete} />
          </div>
        </div>
      </div>
      <div className="q-description">
        <div
          dangerouslySetInnerHTML={
            question.description
              ? JSON.parse(question.description)
              : { __html: "<p></p>" }
          }
        ></div>
      </div>
    </div>
  );

  const handleAnswerDelete = (answer) => {
    deleteAnswer(user._id, token, answer._id).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        toast("Answer Deleted Successfully", { type: "successs" });
        navigate("/");
      }
    });
  };

  const contentReplies = () => (
    <div>
      {question.replies &&
        question.replies.length > 0 &&
        question.replies.map((answer, index) => (
          <div key={index} className="q-card">
            <div className="q-title">
              <div className="q-status">
                <AiFillLike
                  style={{ color: value === 0 ? "white" : "white" }}
                  onClick={(e) => handleUpVote(e, answer, index)}
                  className="q-like"
                />
                {voteLoading && curIndex === index ? (
                  <div className="loading-div">
                    <Circle color="white" size={30} />
                  </div>
                ) : (
                  <h2>{answer.upvotes}</h2>
                )}
                <AiFillDislike
                  style={{ color: value === 0 ? "white" : "white" }}
                  onClick={(e) => handleDownVote(e, answer, index)}
                  className="q-like"
                />
              </div>
              <div className="a-text">
                <div dangerouslySetInnerHTML={JSON.parse(answer.text)}></div>
              </div>
              <div className="a-asked">
                <p className="q-asked-title">Answered by</p>
                <div className="a-asked-user">
                  <FaUser className="q-asked-icon" />
                  <p>{answer.user && answer.user.name}</p>
                </div>
                <p>
                  <AiFillStar className="q-asked-icon" />{" "}
                  {answer.user && answer.user.reputation}
                </p>
                <div className="q-icons-div">
                  <FaEdit
                    onClick={() => {
                      if (user._id !== answer.user._id) {
                        toast("You cannot Edit this answer", {
                          type: "warning",
                        });
                        return;
                      }
                      navigate("/answer/update", { state: answer });
                    }}
                    className="q-icon"
                  />
                  <AiFillDelete
                    onClick={() => handleAnswerDelete(answer)}
                    className="q-icon"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
    </div>
  );

  return (
    <Base>
      {loading ? (
        <div style={{ textAlign: "center" }} className="loading-div">
          <Circle color="white" size={100} />
        </div>
      ) : (
        <>
          <div className="questions-container">{contentSection()}</div>
          <div className="middle-helper">
            <h2>
              {question.replies && question.replies.length} Answer
              <span
                style={{
                  display:
                    question.replies && question.replies.length === 1
                      ? "none"
                      : "visible",
                }}
              >
                s
              </span>
            </h2>
            <div>
              <button onClick={() => setState(1)} className="ask-button">
                Answer
              </button>
            </div>
          </div>
          {state ? (
            <div style={{ width: "100%" }}>
              <PostAnswer question={question} />
              <button
                style={{ marginLeft: "2rem" }}
                onClick={() => setState(0)}
                className="cancel-button"
              >
                Cancel
              </button>
            </div>
          ) : (
            <></>
          )}
          <div className="questions-container">{contentReplies()}</div>
        </>
      )}
    </Base>
  );
}
