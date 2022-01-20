import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useTimeFormat, useQuillModules, useWIPFileActions } from "../../hooks";
import { Avatar } from "../../common";
import FileCommentOptions from "./FileCommentOptions";
import { QuillEditor } from "../../forms";
import SidebarSubComments from "./SidebarSubComments";

const Wrapper = styled.div`
  .body-wrapper,
  .file-comment-options {
    flex-flow: row-reverse;
  }
  .avatar-wrapper {
    justify-content: flex-end;
  }
`;

const StyledQuillEditor = styled(QuillEditor)`
  &.chat-input {
    max-height: 180px;
    @media (min-width: 768px) {
      max-height: 370px;
    }
    position: static;
    overflow: auto;
    &::-webkit-scrollbar {
      display: none;
    }
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .ql-container {
    position: static;
  }
  .ql-toolbar {
    display: none;
  }
  .ql-editor {
    padding: 11px 9px;

    &:focus {
      box-shadow: none;
      border-color: rgba(122, 27, 139, 0.8);
    }
  }

  .ql-container {
    border: none;
  }
  .ql-mention-list-container-top,
  .ql-mention-list-container {
    width: 300px !important;
    max-height: 170px;
    background: rgb(255, 255, 255);
    border-radius: 8px;
    box-shadow: rgba(26, 26, 26, 0.4) 0px 2px 3px 0px, rgba(0, 0, 0, 0.1) 0px 1px 3px 0px;
    overflow-x: hidden;
    overflow-y: auto;
    z-index: 1000;

    .dark & {
      background: #25282c;
      color: #c7c7c7;
    }

    .ql-mention-list {
      padding: 0;

      .ql-mention-list-item {
        display: flex;
        align-items: center;
        padding-top: 1rem;
        padding-bottom: 1rem;
        padding-left: 1rem;

        &.selected {
          background: #7a1b8b;
          color: #fff;
          cursor: pointer;
          span.all-pic > img {
            filter: brightness(0) saturate(100%) invert(1);
          }
        }
      }
    }
  }
`;

const SubCommentInputWrapper = styled.div`
  border: 1px solid #ebebeb;
  border-radius: 6px;
  margin-bottom: 1rem;
  position: relative;
  min-height: 80px;
  background: #f1f2f7;
`;

const SidebarSubComment = (props) => {
  const { comment, parentId, isClosed } = props;
  const reactQuillRef = useRef();
  const params = useParams();
  const timeFormat = useTimeFormat();
  const fileActions = useWIPFileActions();
  const workspace = useSelector((state) => state.workspaces.activeTopic);
  const user = useSelector((state) => state.session.user);
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [quillData, setQuillData] = useState({
    text: "",
    textOnly: "",
    quillContents: [],
  });
  const handleQuillChange = (content, delta, source, editor) => {
    if (workspace === null) return;
    setQuillData({
      text: content,
      textOnly: editor.getText(content),
      quillContents: editor.getContents(),
    });
  };
  const toggleCommentInput = () => {
    setShowCommentInput((prevState) => !prevState);
  };
  const handleSubmit = () => {
    let payload = {
      proposal_id: parseInt(params.wipId),
      media_id: parseInt(params.wipFileId),
      file_version_id: parseInt(params.wipFileVersion),
      body: quillData.text,
      mention_ids: [],
      file_ids: [],
      reference_id: require("shortid").generate(),
      parent_id: parentId,
      //   code_data: {
      //     push_title: "John Paul Sargento replied in create required post to john paul - 11",
      //     proposal_id: item.id,
      //     proposal_title: "create required post to john paul - 11",
      //     mention_ids: [],
      //   },
      quote: null,
      annotation: null,
    };
    let timestamp = Math.floor(Date.now() / 1000);
    let commentObj = {
      ...payload,
      author: {
        id: user.id,
        name: user.name,
        profile_image_link: user.profile_image_link,
      },
      id: payload.reference_id,
      created_at: { timestamp: timestamp },
      annotation: null,
      file_id: payload.media_id,
      workspace_id: workspace.id,
    };
    fileActions.addComment(commentObj);
    fileActions.submitComment(payload);

    setQuillData({
      text: "",
      textOnly: "",
      quillContents: [],
    });
    if (reactQuillRef.current) {
      if (reactQuillRef.current.getEditor()) {
        reactQuillRef.current.getEditor().setContents([]);
      }
    }
  };
  const { modules } = useQuillModules({
    mode: "post_comment",
    callback: handleSubmit,
    mentionOrientation: "top",
    quillRef: reactQuillRef,
    members: workspace ? workspace.members : [],
    prioMentionIds: workspace ? workspace.members.map((m) => m.id) : [],
  });
  useEffect(() => {
    if (showCommentInput && reactQuillRef.current) {
      reactQuillRef.current.focus();
    }
  }, [showCommentInput]);

  return (
    <Wrapper className="file-sub-comment mb-2" key={comment.id}>
      <div className="d-flex align-items-center body-wrapper">
        <div className="file-comment-body" dangerouslySetInnerHTML={{ __html: comment.body }} />
      </div>
      {!isClosed && <FileCommentOptions className="file-comment-options" comment={comment} toggleCommentInput={toggleCommentInput} />}
      {showCommentInput && (
        <SubCommentInputWrapper className="sub-comment-input">
          <StyledQuillEditor className={"chat-input"} modules={modules} ref={reactQuillRef} onChange={handleQuillChange} />
        </SubCommentInputWrapper>
      )}
      <div className="d-flex align-items-center avatar-wrapper">
        <Avatar className={"avatar-sm mr-1"} id={comment.author.id} type="USER" imageLink={comment.author.profile_image_thumbnail_link} name={comment.author.name} showSlider={false} />
        <span className="mr-1">{comment.author.first_name}</span>
        <span className="text-muted">{timeFormat.fromNow(comment.created_at.timestamp)}</span>
      </div>
      <SidebarSubComments commentId={comment.id} />
    </Wrapper>
  );
};

export default SidebarSubComment;
