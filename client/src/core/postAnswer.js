import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Editor } from "react-draft-wysiwyg";
import { convertToHTML } from "draft-convert";
import DOMPurify from "dompurify";
import { EditorState } from "draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { isAuthenticated } from "../auth/helper/index";
import { toast } from "react-toastify";
import { postAnswer } from "../user/helper/userApiCalls";

export default function PostAnswer({ question }) {
  const { user, token } = isAuthenticated();
  const navigate = useNavigate();
  const [state, setState] = useState(EditorState.createEmpty());
  const [answer, setAnswer] = useState("");

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
    postAnswer(user._id, token, { text: data }, question._id).then((data) => {
      if (data.error) {
        console.log("Posting your answer failed", data.error);
      } else {
        toast("Answer posted succesfully!!", { type: "success" });
        navigate("/");
      }
    });
  };

  const contentSection = () => (
    <div className="questions-container editor-helper">
      <div className="editor-body">
        <div className="editor-wrapper">
          <Editor
            editorState={state}
            toolbarClassName="toolbarClassName"
            wrapperClassName="wrapperClassName"
            editorClassName="editorClassName"
            onEditorStateChange={onEditorStateChange}
          />
        </div>
        <button
          style={{ marginTop: "1rem", float: "right" }}
          onClick={submitAnswer}
          className="ask-button"
        >
          Post Answer
        </button>
      </div>
    </div>
  );
  return <div>{contentSection()}</div>;
}
