import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Editor } from "react-draft-wysiwyg";
import { convertToHTML } from "draft-convert";
import DOMPurify from "dompurify";
import { EditorState, convertFromHTML, ContentState } from "draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { isAuthenticated } from "../auth/helper/index";
import { toast } from "react-toastify";
import { updateAnswer } from "../core/helper/coreApiCalls";
import Base from "../core/Base";

export default function UpdateAnswer() {
  const { user, token } = isAuthenticated();
  const navigate = useNavigate();
  const location = useLocation();
  console.log(location);
  const [state, setState] = useState(null);
  const [answer, setAnswer] = useState({
    _id: location.state._id,
    text: location.state.text,
  });

  useEffect(() => {
    const blocksFromHTML = convertFromHTML(
      JSON.parse(location.state.text).__html
    );
    const data = ContentState.createFromBlockArray(
      blocksFromHTML.contentBlocks,
      blocksFromHTML.entityMap
    );
    setState(EditorState.createWithContent(data));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  console.log(state && convertToHTML(state.getCurrentContent()));
  const [convertedContent, setConvertedContent] = useState(null);

  const onEditorStateChange = (state) => {
    setState(state);
    convertContent();
  };
  const convertContent = () => {
    let currentContentAsHTML = convertToHTML(state.getCurrentContent());
    setConvertedContent(currentContentAsHTML);
  };

  const createMarkup = (html) => {
    return {
      __html: DOMPurify.sanitize(html),
    };
  };

  const submitAnswer = () => {
    const data = JSON.stringify(createMarkup(convertedContent));
    setAnswer(data);
    console.log(answer);
    updateAnswer(user._id, token, { text: data }, location.state._id).then(
      (data) => {
        if (data.error) {
          console.log("Updating your answer failed", data.error);
        } else {
          toast("Answer updated succesfully!!", { type: "success" });
          navigate("/");
        }
      }
    );
  };

  const contentSection = () => (
    <div className="update-answer-container">
      <h1>Edit Your Answer</h1>
      <div className="questions-container editor-helper">
        <div className="editor-body">
          <div className="editor-wrapper">
            <Editor
              initialContentState={state}
              editorState={state}
              toolbarClassName="toolbarClassName"
              wrapperClassName="wrapperClassName"
              editorClassName="editorClassName"
              onEditorStateChange={onEditorStateChange}
            />
          </div>
          <div>
            <button
              onClick={() => navigate("/questions")}
              style={{ marginTop: "1rem" }}
              className="cancel-button"
            >
              Back
            </button>
            <button
              style={{ marginTop: "1rem", float: "right" }}
              onClick={submitAnswer}
              className="ask-button"
            >
              Update Answer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
  return <Base>{contentSection()}</Base>;
}
