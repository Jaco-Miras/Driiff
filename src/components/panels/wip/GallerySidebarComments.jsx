import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { SvgIconFeather } from "../../common";
import { CheckBox } from "../../forms";
import { useWIPActions, useQuillModules, useWIPFileActions } from "../../hooks";
import { QuillEditor } from "../../forms";
import SidebarComments from "./SidebarComments";
import { setEditFileComment } from "../../../redux/actions/wipActions";
import { addToModals } from "../../../redux/actions/globalActions";

const Wrapper = styled.div`
  position relative;
  display: flex;
  flex-flow: column;
  .bottom-modal-mobile_inner {
   flex: 1 1;
   max-height: calc(100% - 40px);
  }
  .app-sidebar-menu {
    height: 100%;
    
  }
  .card-header {
    height: 70px;
  }
  .card-footer {
    border: none;
    flex-flow: column;
    .close-submit {
      justify-content: space-between;
    }
    .file-input-wrapper {
      border: 1px solid #ebebeb;
      border-radius: 6px;
      margin-bottom: 1rem;
      position: relative;
      min-height: 125px;
      background: #f1f2f7;
    }
  }
  .app-sidebar-menu {
    overflow: hidden;
    outline: currentcolor none medium;
    @media (max-width: 991.99px) {
      border-bottom-left-radius: 0 !important;
      border-bottom-right-radius: 0 !important;
      display: flex;
      flex-direction: column;
      .card-body {
        display: none;
      }
      .create-new-post-wrapper {
        border-top: 1px solid #ebebeb;
        display: block;
        order: 9;
      }
      .list-group-flush {
        border-top: 1px solid #ebebeb;
      }
    }
  }
  @media (max-width: 991.99px) {
    margin-bottom: 0 !important;
  }
  .card {
    padding: 0;
  }
`;

const MobileOverlayFilter = styled.div``;

const StyledQuillEditor = styled(QuillEditor)`
  &.chat-input {
    // border: 1px solid #afb8bd;
    // border-radius: 5px;
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

const ApprovedByDiv = styled.div`
  padding: 0.5rem;
  font-size: 0.7rem;
`;

const SubmitBtn = styled.button`
  padding: 10px;
  width: auto !important;
`;

const AnnotationNumber = styled.div`
  border-radius: 50%;
  box-sizing: border-box;
  height: 1.2rem;
  position: absolute;
  transform: translate3d(-50%, -50%, 0);
  width: 1.2rem;
  background: purple;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
`;

const EditFileCommentPreview = styled.div`
  padding: 10px 0px;
  display: inline-flex;
  width: 100%;
  overflow: hidden;
  .edit-body {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    > div {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
`;

const GallerySidebarComments = (props) => {
  const { item } = props;
  const dispatch = useDispatch();
  const actions = useWIPActions();
  const fileActions = useWIPFileActions();

  const params = useParams();
  const mainFile = item.files.find((f) => f.id === parseInt(params.wipFileId));
  const file = mainFile.file_versions.length ? mainFile.file_versions[mainFile.file_versions.length - 1] : mainFile.link_versions[mainFile.link_versions.length - 1];

  const reactQuillRef = useRef();
  const user = useSelector((state) => state.session.user);
  const workspace = useSelector((state) => state.workspaces.activeTopic);
  const annotation = useSelector((state) => state.wip.annotation);
  const editFileComment = useSelector((state) => state.wip.editFileComment);
  const [quillData, setQuillData] = useState({
    text: "",
    textOnly: "",
    quillContents: [],
  });
  const [mentionData, setMentionData] = useState({
    mentionedUserIds: [],
    ignoredMentionedUserIds: [],
  });
  const [closeCommments, setCloseComments] = useState(false);

  const [finalVersion, setFinalVersion] = useState(false);

  const toggleCheck = () => {
    setFinalVersion(!finalVersion);
  };

  const toggleClose = () => {
    const handleCloseComments = () => {
      fileActions.closeComments({ file_version_id: file.file_version_id, is_close: !file.is_close });
    };
    let payload = {
      type: "confirmation",
      headerText: file.is_close ? "Open comments" : "Close comments",
      submitText: "Ok",
      cancelText: "Cancel",
      bodyText: file.is_close ? "Are you sure you want to open the comments for this file?" : "Are you sure you want to close the comments for this file?",
      actions: {
        onSubmit: handleCloseComments,
      },
    };

    dispatch(addToModals(payload));
    // setCloseComments(!closeCommments);
    // fileActions.closeComments({ file_version_id: file.file_version_id, is_close: !closeCommments });
  };

  const closeMobileModal = () => {
    document.body.classList.remove("mobile-modal-open");
  };

  const handleUploadNewVersion = () => {
    fileActions.openDialog({ open: true });
  };

  const handleQuillChange = (content, delta, source, editor) => {
    if (workspace === null) return;
    setQuillData({
      text: content,
      textOnly: editor.getText(content),
      quillContents: editor.getContents(),
    });

    // if (editor.getContents().ops && editor.getContents().ops.length) {
    //   handleMentionUser(
    //     editor
    //       .getContents()
    //       .ops.filter((m) => m.insert.mention)
    //       .map((i) => i.insert.mention.type_id)
    //   );
    // }
  };

  const handleEditComment = () => {
    dispatch(setEditFileComment(null));
  };

  const handleSubmit = () => {
    let payload = {
      proposal_id: item.id,
      media_id: mainFile.id,
      file_version_id: file.id,
      body: quillData.text,
      mention_ids: [],
      file_ids: [],
      reference_id: require("shortid").generate(),
      parent_id: null,
      // code_data: {
      //   push_title: "John Paul Sargento replied in create required post to john paul - 11",
      //   proposal_id: item.id,
      //   proposal_title: "create required post to john paul - 11",
      //   mention_ids: [],
      // },
      quote: null,
      annotation: annotation.hasOwnProperty("selection") ? JSON.stringify({ ...annotation, data: annotation.selection.data }) : null,
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
      annotation: annotation.hasOwnProperty("selection") ? { ...annotation, data: annotation.selection.data } : null,
      file_id: payload.media_id,
      workspace_id: workspace.id,
    };
    if (editFileComment) {
      payload = {
        ...payload,
        id: editFileComment.id,
        annotation: null,
        parent_id: editFileComment.parent_id,
      };
      fileActions.updateComment(payload);
      handleEditComment();
    } else {
      fileActions.addComment(commentObj, () => actions.annotate({}));
      fileActions.submitComment(payload);
    }

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

  useEffect(() => {
    if (editFileComment) {
      reactQuillRef.current.getEditor().clipboard.dangerouslyPasteHTML(0, editFileComment.body);
      setQuillData({
        text: editFileComment.body,
        textOnly: editFileComment.body,
        quillContents: [],
      });
    }
  }, [editFileComment]);

  const { modules } = useQuillModules({
    mode: "post_comment",
    callback: handleSubmit,
    mentionOrientation: "top",
    quillRef: reactQuillRef,
    members: workspace ? workspace.members : [],
    prioMentionIds: workspace ? workspace.members.map((m) => m.id) : [],
  });

  const isAuthor = item.author.id === user.id;
  const isApprover = item.approver_ids.some((id) => id === user.id);

  const handleApproveFile = () => {
    const handleApprove = () => {
      const payload = {
        file_version_id: file.file_version_id,
        approved: true,
      };
      fileActions.approve(payload);
    };
    let payload = {
      type: "confirmation",
      headerText: "Approve file",
      submitText: "Ok",
      cancelText: "Cancel",
      bodyText: "Are you sure you want to approve this file?",
      actions: {
        onSubmit: handleApprove,
      },
    };

    dispatch(addToModals(payload));
  };

  return (
    <Wrapper className="col-md-3 app-sidebar bottom-modal-mobile">
      <MobileOverlayFilter className="mobile-overlay" onClick={closeMobileModal} />
      <div className="bottom-modal-mobile_inner">
        <div className="app-sidebar-menu" tabIndex="2">
          <div className="card card-body create-new-post-wrapper h-100">
            <div className="card-header d-flex align-items-center">
              <span>
                <SvgIconFeather icon="message-square" className="mr-2" /> Comments
              </span>
            </div>
            <SidebarComments annotations={file.annotations} isClosed={file.is_close === 1} />
            <div className="card-footer d-flex">
              <div className="file-input-wrapper">
                {annotation.hasOwnProperty("geometry") && <AnnotationNumber>{annotation.selection.data.id}</AnnotationNumber>}
                {editFileComment && (
                  <EditFileCommentPreview>
                    <div className="mr-2">
                      <SvgIconFeather icon="x" width={16} height={16} onClick={handleEditComment} />
                    </div>
                    <div className="overflow-hidden">
                      <span>Edit comment</span>
                      <span className="text-muted edit-body" dangerouslySetInnerHTML={{ __html: editFileComment.body }} />
                    </div>
                  </EditFileCommentPreview>
                )}
                <StyledQuillEditor
                  className={"chat-input"}
                  modules={modules}
                  ref={reactQuillRef}
                  onChange={handleQuillChange}
                  readOnly={file.is_close === 1}
                  placeholder={file.is_close ? "Comments for this file is closed" : "Your comment..."}
                />
              </div>
              <div className="d-flex align-items-center mb-2 close-submit">
                <CheckBox name="close" checked={file.is_close === 1} onClick={toggleClose} disabled={file.is_close === 1}>
                  Close comments
                </CheckBox>
                <SubmitBtn className="btn btn-primary btn-block" onClick={handleSubmit}>
                  Submit
                </SubmitBtn>
              </div>
              {isAuthor && file.status !== "done" && (
                <>
                  <CheckBox name="final" checked={finalVersion} onClick={toggleCheck} disabled={file.is_close === 0}>
                    This is the final version
                  </CheckBox>
                  <button className="btn btn-primary btn-block" onClick={handleUploadNewVersion} disabled={file.is_close === 0}>
                    Upload new version
                  </button>
                </>
              )}
              {isApprover && file.status !== "done" && (
                <>
                  <button className="btn btn-primary btn-block" onClick={handleApproveFile}>
                    Approve design
                  </button>
                </>
              )}
              {file.status === "done" && (
                <>
                  <button className="btn btn-success btn-block">Approved</button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <ApprovedByDiv>Only to be approved by: {item.approver_users[0].name}</ApprovedByDiv>
    </Wrapper>
  );
};

export default React.memo(GallerySidebarComments);
