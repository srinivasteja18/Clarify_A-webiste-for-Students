import React, { useState } from "react";
import Base from "../core/Base";
import { useNavigate, useLocation } from "react-router-dom";
import { Editor } from "react-draft-wysiwyg";
import { convertToHTML } from "draft-convert";
import DOMPurify from "dompurify";
import { EditorState } from "draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { isAuthenticated } from "../auth/helper/index";
import { toast } from "react-toastify";
import { updateQuestion } from "../core/helper/coreApiCalls";

export default function UpdateQuestion() {
  const location = useLocation();
  console.log(location);
  const { user, token } = isAuthenticated();
  const navigate = useNavigate();
  const [state, setState] = useState(EditorState.createEmpty());
  const [question, setQuestion] = useState({
    _id: location.state._id,
    text: location.state.text,
    description: location.state.description,
    user: location.state.user,
    replies: location.state.replies,
    upvotes: location.state.upvotes,
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
    updateQuestion(user._id, token, question).then((data) => {
      if (data.error) {
        console.log("Failed to edit your question", data.error);
      } else {
        toast("Question Updated succesfully!!", { type: "success" });
        navigate("/questions/question");
      }
    });
  };
  console.log(question);
  const contentSection = () => (
    <div className="questions-container editor-helper">
      <h1>Edit Your Question</h1>
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
            Update Question
          </button>
        </div>
      </div>
    </div>
  );
  return <Base>{contentSection()}</Base>;
}
