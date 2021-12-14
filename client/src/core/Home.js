import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Circle } from "better-react-spinkit";
import Base from "./Base";
import { getAllQuestions } from "./helper/coreApiCalls";

export default function Home() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [searchQuestions, setSearchQuestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const preLoad = () => {
    setLoading(true);
    getAllQuestions().then((data) => {
      if (data.error) {
        console.log("Error in fetching questions", data.error);
      } else {
        setQuestions(data);
        setSearchQuestions(data);
        setLoading(false);
      }
    });
  };

  useEffect(() => {
    preLoad();
  }, []);

  const handleOnChange = (e) => {
    const searchText = e.target.value;
    console.log(searchText);
    const result = questions.filter((question) =>
      question.text.toLowerCase().includes(searchText)
    );
    setSearchQuestions(result);
  };
  const contentSection = () => (
    <div className="content-container">
      <div className="content-header">
        <h2>Top Questions</h2>
        <Link className="ask-button" to="/user/askQuestion">
          Ask Question
        </Link>
      </div>
      <div className="search-div">
        <form className="search-form">
          <label className="search-label">
            <input
              placeholder="Search Question"
              onChange={handleOnChange}
              className="search-input"
              type="text"
            />
          </label>
        </form>
      </div>
      <div className="questions-container">
        {loading ? (
          <div className="loading-div">
            <Circle color="white" size={100} />
          </div>
        ) : searchQuestions.length ? (
          searchQuestions.map((question, index) => (
            <div
              onClick={() => {
                navigate("/questions/question", { state: question });
              }}
              key={index}
              className="question-card"
            >
              <div className="question-status-div">
                <div className="question-status">
                  <p className="question-status-number">{question.upvotes}</p>
                  <p>Upvotes</p>
                </div>
                <div className="question-status">
                  <p className="question-status-number">
                    {question.replies.length}
                  </p>
                  <p>Answers</p>
                </div>
              </div>
              <div className="question-summary">
                <h2>{question.text}</h2>
                <p className="question-asked">asked by {question.user.name}</p>
              </div>
            </div>
          ))
        ) : (
          <div>No Questions Found!!</div>
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
