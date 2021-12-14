import React, { useState } from "react";
import Base from "../core/Base";
import { useNavigate } from "react-router-dom";
import { Editor } from "react-draft-wysiwyg";
import { convertToHTML } from "draft-convert";
import DOMPurify from "dompurify";
import { EditorState } from "draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { isAuthenticated } from "../auth/helper/index";
import { toast } from "react-toastify";
import { postQuestion } from "./helper/userApiCalls";

export default function AskQuestion() {
  const { user, token } = isAuthenticated();
  const navigate = useNavigate();
  const [state, setState] = useState(EditorState.createEmpty());
  const [question, setQuestion] = useState({
    text: "",
    description: "",
  });

  const [convertedContent, setConvertedContent] = useState(null);

  const onEditorStateChange = (state) => {
    setState(state);
    convertContent();
  };
  const convertContent = () => {
    let currentContentAsHTML = convertToHTML(state.getCurrentContent());
    setConvertedContent(currentContentAsHTML);
  };
  const handleOnChange = (e) => {
    setQuestion({ ...question, text: e.target.value });
  };

  const createMarkup = (html) => {
    return {
      __html: DOMPurify.sanitize(html),
    };
  };
  const submitQuestion = () => {
    const data = JSON.stringify(createMarkup(convertedContent));
    question.description = data;
    setQuestion(question);
    console.log(question);
    postQuestion(user._id, token, question).then((data) => {
      if (data.error) {
        console.log("Posting your question failed", data.error);
      } else {
        toast("Question posted succesfully!!", { type: "success" });
        navigate("/");
      }
    });
  };

  const contentSection = () => (
    <div className="questions-container editor-helper">
      <h1>Ask Your Question</h1>
      <div className="editor-container">
        <div className="editor-title">
          <h2>Title</h2>
          <p>Be specific with your question and not more than 20 words</p>
          <input
            value={question.text}
            onChange={handleOnChange}
            className="search-input editor-title-input"
            type="text"
          />
        </div>
        <div className="editor-body">
          <h2>Description</h2>
          <p className="editor-body-p">
            Add more details to your question, feel free to left it blank if you
            don't have any.
          </p>
          <p className="editor-body-p">
            Description may contain explanation of your question, sample code,
            error messages if any and any information about the question if you
            want to share
          </p>
          <div className="editor-wrapper">
            <Editor
              editorState={state}
              toolbarClassName="toolbarClassName"
              wrapperClassName="wrapperClassName"
              editorClassName="editorClassName"
              onEditorStateChange={onEditorStateChange}
            />
          </div>
          <p>We would recommend to review your question before posting</p>
          <button onClick={submitQuestion} className="ask-button">
            Post Question
          </button>
        </div>
      </div>
    </div>
  );
  return <Base>{contentSection()}</Base>;
}
