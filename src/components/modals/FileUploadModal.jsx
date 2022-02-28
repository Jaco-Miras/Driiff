import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Modal, ModalBody, ModalFooter } from "reactstrap";
import styled from "styled-components";
import { SvgIcon, SvgIconFeather, CommonPicker } from "../common";
import { postChatMessage, setSidebarSearch } from "../../redux/actions/chatActions";
import { clearModal, saveInputData } from "../../redux/actions/globalActions";
import { useToaster } from "../hooks";
import { uploadBulkDocument } from "../../redux/services/global";
import QuillEditor from "../forms/QuillEditor";
import { useQuillModules, useTranslationActions } from "../hooks";
import { ModalHeaderSection } from "./index";
import { postComment, putComment, setEditComment, setParentIdForUpload, addComment } from "../../redux/actions/postActions";
import { osName } from "react-device-detect";
import { FolderSelect } from "../forms";
import _ from "lodash";
import axios from "axios";
import { DropDocument } from "../dropzone/DropDocument";

const ModalWrapper = styled(Modal)`
  input.form-control:focus {
    border-color: ${({ theme }) => theme.colors.primary};
  }
  .react-select__control,
  .react-select__control:hover,
  .react-select__control:active,
  .react-select__control:focus {
    border-color: ${({ theme }) => theme.colors.primary};
  }
  .react-select__option--is-selected {
    background-color: ${({ theme }) => theme.colors.primary};
  }
  .react-select__option:hover {
    background-color: ${({ theme }) => theme.colors.secondary};
  }
  .btn.btn-primary {
    background-color: ${({ theme }) => theme.colors.primary}!important;
    border-color: ${({ theme }) => theme.colors.primary}!important;
  }
  .btn.btn-outline-secondary {
    color: ${({ theme }) => theme.colors.secondary};
    border-color: ${({ theme }) => theme.colors.secondary};
  }
  .btn.btn-outline-secondary:not(:disabled):not(.disabled):hover,
  .btn.btn-outline-secondary:hover {
    background-color: ${({ theme }) => theme.colors.secondary};
  }
  .btn.btn-outline-secondary:not(:disabled):not(.disabled):hover {
    border-color: ${({ theme }) => theme.colors.secondary};
  }
`;

const DescriptionInputWrapper = styled.div`
  flex: 1 0 0;
  width: 100%;
  border: 1px solid #afb8bd;
  border-radius: 5px;
  min-height: 350px;
  position: relative;
`;

const StyledQuillEditor = styled(QuillEditor)`
  &.description-input {
    // overflow: auto;
    // overflow-x: hidden;
    position: static;
    width: 100%;
  }
  .ql-toolbar {
    position: absolute;
    bottom: 0;
    padding: 0;
    border: none;
    .ql-formats {
      margin-right: 10px;
    }
    .ql-image {
      display: none;
    }
  }
  .ql-container {
    border: none;
  }
  .ql-editor {
    padding: 5px;
  }
  .ql-editor {
    height: 320px;
    max-height: 320px;
  }
  .ql-mention-list-container-top,
  .ql-mention-list-container {
    width: 300px !important;
    max-height: 170px;
    background: rgb(255, 255, 255);
    border-radius: 8px;
    box-shadow: rgba(26, 26, 26, 0.4) 0 2px 3px 0, rgba(0, 0, 0, 0.1) 0 1px 3px 0;
    overflow-x: hidden;
    overflow-y: auto;
    z-index: 2;

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
          background: ${(props) => props.theme.colors.primary};
          color: #fff;
          span.all-pic > img {
            filter: brightness(0) saturate(100%) invert(1);
          }
        }
      }
    }
  }
`;

const FilesPreviewContainer = styled.div`
  width: 100%;
  margin-top: 15px;
  border: 1px solid #afb8bd;
  border-radius: 5px;
  ul {
    margin: 0;
    padding: 10px 0;
    align-items: center;
    justify-content: ${(props) => (props.hasOneFile ? "center" : "flex-start")};
    display: flex;
    overflow-x: auto;
  }
  li {
    list-style: none;
    padding: 0 10px;
    border-radius: 8px;
    position: relative;

    img {
      width: auto;
      height: 160px;
      border: 1px solid #ddd;
      object-fit: cover;
      border-radius: inherit;
    }
    span {
      position: absolute;
      top: -10px;
      right: -6px;
      display: none;
      color: black;
    }
    span:hover {
      color: ${(props) => props.theme.colors.primary};
      cursor: pointer;
    }
    .app-file-list {
      height: 158px;
      width: 158px;
      margin-bottom: 0;
    }
    &:first-of-type {
      padding-left: 15px;
    }
    &:last-of-type {
      padding-right: 15px;
    }
    .remove-upload {
      background: rgba(0, 0, 0, 0.8);
      color: #ffffff;
      border-radius: 50%;
      position: absolute;
      height: 20px;
      width: 20px;
      display: ${(props) => (!props.hasOneFile ? "flex" : "none")};
      justify-content: center;
      align-items: center;
      cursor: pointer;
      border: 2px solid #fff;
      top: -8px;
      right: 2px;
      &:hover {
        background: rgba(0, 0, 0, 1);
      }
      svg {
        width: 12px;
        height: 12px;
      }
    }
  }
  li:hover span {
    display: ${(props) => (props.hasOneFile ? "none" : "block")};
  }
  &:after {
    content: "";
    width: 100px;
  }
`;

const IconButton = styled(SvgIconFeather)`
  position: absolute;
  right: 0;
  cursor: pointer;
  border: 1px solid #afb8bd;
  height: 1.5rem;
  margin: -1px 8px;
  width: 1.5rem;
  padding: 5px;
  border-radius: 8px;
  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  &:hover {
    background: #afb8bd;
    color: #ffffff;
  }
`;

const PickerContainer = styled(CommonPicker)`
  left: unset;
  bottom: 40px;

  .common-picker-btn {
    text-align: right;
  }
  .react-giphy-select__src-components-GiphyList-styles__list___Tdg5X {
    height: 250px;
  }
`;

const DocDiv = styled.div``;

const ExternalLabel = styled.span`
  font-weight: 500;
`;

const StyledModalFooter = styled(ModalFooter)`
  flex-wrap: nowrap;
`;

const SelectFileOptionContainer = styled.div`
  .react-select-container {
    max-width: 320px;
  }
`;

const fileOptions = [
  // {
  //   id: "remove_on_download",
  //   value: "remove_on_download",
  //   label: "Remove file after download",
  //   icon: "eye-off",
  // },
  {
    id: "remove_automatically",
    value: "remove_automatically",
    label: "Remove file automatically in 5 days",
    icon: "file-minus",
  },
];

const enlargeEmoji = (textWithHtml) => {
  const el = document.createElement("div");
  el.innerHTML = textWithHtml;
  const pattern = /((?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff])[\ufe0e\ufe0f]?(?:[\u0300-\u036f\ufe20-\ufe23\u20d0-\u20f0]|\ud83c[\udffb-\udfff])?(?:\u200d(?:[^\ud800-\udfff]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff])[\ufe0e\ufe0f]?(?:[\u0300-\u036f\ufe20-\ufe23\u20d0-\u20f0]|\ud83c[\udffb-\udfff])?)*)/g; // regex for emoji characters
  const bodyWithoutEmoji = el.textContent.trim().replace(pattern, ""); //removes all emoji instance
  const isEmojiWithString = typeof bodyWithoutEmoji === "string" && bodyWithoutEmoji.trim() !== ""; //check if body has text and emoji
  const isMultipleEmojisOnly = el.textContent.trim().match(pattern) && el.textContent.trim().match(pattern).length > 1; //if message is only emoji but multiple
  if (isEmojiWithString || isMultipleEmojisOnly) {
    return el.innerHTML.replace(pattern, '<span class="font-size-24">$1</span>');
  }
  return el.innerHTML;
};

const FileUploadModal = (props) => {
  const { type, mode, droppedFiles, post = null, members = [] } = props.data;

  const progressBar = useRef(0);
  const toaster = useToaster();
  const pickerRef = useRef();
  const { _t } = useTranslationActions();
  const dispatch = useDispatch();
  const reactQuillRef = useRef();
  const [mounted, setMounted] = useState(false);
  const workspaces = useSelector((state) => state.workspaces.workspaces);
  const toasterRef = useRef(null);
  const selectedChannel = useSelector((state) => state.chat.selectedChannel);
  const user = useSelector((state) => state.session.user);
  const savedInput = useSelector((state) => state.global.dataFromInput);
  const { parentId, editPostComment } = useSelector((state) => state.posts);

  const [modal, setModal] = useState(true);
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState(droppedFiles);
  // const [uploadedFiles, setUploadedFiles] = useState([]);
  //const [sending, setSending] = useState(false);
  const [comment, setComment] = useState("");
  const [textOnly, setTextOnly] = useState("");
  const [quillContents, setQuillContents] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [fileOption, setFileOption] = useState(null);
  const [inlineImages, setInlineImages] = useState([]);
  const [imageLoading, setImageLoading] = useState(null);

  const handleShowEmojiPicker = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const onSelectEmoji = (e) => {
    const editor = reactQuillRef.current.getEditor();
    reactQuillRef.current.focus();
    const cursorPosition = editor.getSelection().index;
    editor.insertText(cursorPosition, e.native);
    editor.setSelection(cursorPosition + 2);
  };

  const onSelectGif = (e) => {
    // setSelectedGif(e);
    const editor = reactQuillRef.current.getEditor();
    reactQuillRef.current.focus();
    const cursorPosition = editor.getSelection().index;
    editor.insertEmbed(cursorPosition, "image", e.images.downsized.url);
    editor.setSelection(cursorPosition + 5);
    handleShowEmojiPicker();
  };

  const dictionary = {
    cancel: _t("BUTTON.CANCEL", "Cancel"),
    upload: _t("BUTTON.UPLOAD", "Upload"),
    addFiles: _t("BUTTON.ADD_FILES", "Add Files"),
    fileUpload: _t("FILE_UPLOAD", "File upload"),
    quillPlaceholder: _t("FORM.REACT_QUILL_PLACEHOLDER", "Write great things here..."),
    fileUploadLabel: _t("LABEL.EXTERNAL_WORKSPACE_FILES", "Files added to workspace can be seen by internal and external accounts"),
    uploading: _t("FILE_UPLOADING", "Uploading File"),
    unsuccessful: _t("FILE_UNSUCCESSFULL", "Upload File Unsuccessful"),
  };

  useEffect(() => {
    if (savedInput !== null && reactQuillRef.current && mounted) {
      reactQuillRef.current.getEditor().clipboard.dangerouslyPasteHTML(0, savedInput.text);
      setComment(savedInput.text);
      setTextOnly(savedInput.textOnly);
      setQuillContents(savedInput.quillContents);
      reactQuillRef.current.focus();
    }
  }, [savedInput, mounted]);

  useEffect(() => {
    setMounted(true);
    if (mode === "post" && editPostComment) {
      setFiles([
        ...editPostComment.files.map((f) => {
          return {
            ...f,
            src: f.view_link,
          };
        }),
        ...droppedFiles,
      ]);
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.keyCode === 27) {
        dispatch(clearModal({ type: type }));
      }
      if (osName.includes("Mac")) {
        if (e.metaKey && e.keyCode === 13) {
          handleUpload();
        }
      } else {
        if (e.ctrlKey && e.keyCode === 13) {
          handleUpload();
        }
      }
    };
    document.addEventListener("keydown", handleKeyDown, false);
    return () => {
      document.removeEventListener("keydown", handleKeyDown, false);
    };
  }, [textOnly]);

  const toggle = () => {
    setModal(!modal);
    dispatch(clearModal({ type: type }));
    dispatch(saveInputData({ sent: false }));
  };

  const handleRemoveFile = (file) => {
    setFiles(files.filter((f) => f.id !== file.id));
  };
  const handleAddFile = (file) => {
    setFiles((prev) => [...prev, ...file]);
  };

  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();

  const uploadFiles = () => {
    if (files.filter((f) => typeof f.id === "string").length) {
      // new endpint
      let formData = new FormData();
      let payload = {
        user_id: user.id,
        file_type: "private",
        folder_id: null,
        fileOption: fileOption,
        cancelToken: source.token,
        options: {
          config: {
            onUploadProgress: handleOnUploadProgress,
          },
        },
      };
      files
        .filter((f) => {
          return typeof f.id === "string";
        })
        .map((file, index) => {
          formData.append(`files[${index}]`, file.bodyFormData.get("file"));
        });
      payload["files"] = formData;
      uploadBulkDocument(payload)
        .then((result) => {
          const resFiles = [...files.filter((f) => typeof f.id !== "string"), ...result.data.map((res) => res)];
          handleSubmit(resFiles);
          //setUploadedFiles([...files.filter((f) => typeof f.id !== "string"), ...result.data.map((res) => res)]);
        })
        .catch((error) => {
          handleNetWorkError(error);
        });
    }
  };

  // async function uploadFiles() {
  //   if (files.filter((f) => typeof f.id === "string").length) {
  //     // new endpint
  //     let formData = new FormData();
  //     let payload = {
  //       user_id: user.id,
  //       file_type: "private",
  //       folder_id: null,
  //       fileOption: fileOption,
  //       cancelToken: source.token,
  //       options: {
  //         config: {
  //           onUploadProgress: handleOnUploadProgress,
  //         },
  //       },
  //     };
  //     files
  //       .filter((f) => {
  //         return typeof f.id === "string";
  //       })
  //       .map((file, index) => {
  //         formData.append(`files[${index}]`, file.bodyFormData.get("file"));
  //       });
  //     payload["files"] = formData;
  //     console.log(payload);
  //     await new Promise((resolve, reject) => {
  //       resolve(uploadBulkDocument(payload));
  //     })
  //       .then((result) => {
  //         const resFiles = [...files.filter((f) => typeof f.id !== "string"), ...result.data.map((res) => res)];
  //         handleSubmit(resFiles);
  //         //setUploadedFiles([...files.filter((f) => typeof f.id !== "string"), ...result.data.map((res) => res)]);
  //       })
  //       .catch((error) => {
  //         console.log("error", error);
  //         handleNetWorkError(error);
  //       });
  //   }
  // }

  const handleNetWorkError = () => {
    if (toasterRef.curent !== null) {
      setLoading(false);
      toaster.dismiss(toasterRef.current);
      toaster.error(<div>{dictionary.unsuccessful}.</div>);
      toasterRef.current = null;
    }
  };

  const CloseButton = ({ closeToast }) => (
    <i
      className="material-icons"
      onClick={() => {
        setTimeout(() => {
          source.cancel();
        }, 1000);
        closeToast();
        toasterRef.current = null;
      }}
    >
      cancel
    </i>
  );

  const handleOnUploadProgress = (progressEvent) => {
    const progress = progressEvent.loaded / progressEvent.total;
    if (toasterRef.current === null) {
      toasterRef.current = toaster.info(<div>{dictionary.uploading}.</div>, { progress: progressBar.current, autoClose: true, closeButton: CloseButton });
    } else {
      toaster.update(toasterRef.current, { progress: progress, autoClose: true });
    }
  };

  const handleUpload = () => {
    if (!loading) {
      setLoading(true);
      uploadFiles();
      dispatch(clearModal({ type: type }));
      dispatch(saveInputData({ sent: true }));
    }
  };

  const handleSubmit = (uFiles) => {
    let mention_ids = [];
    let body = enlargeEmoji(comment);
    let haveGif = false;
    if (quillContents.ops && quillContents.ops.length > 0) {
      let mentionIds = quillContents.ops
        .filter((id) => {
          return id.insert.mention ? id : null;
        })
        .map((mid) => Number(mid.insert.mention.id));
      mention_ids = [...new Set(mentionIds)];
      if (mention_ids.includes(NaN)) {
        mention_ids = [...new Set([...mention_ids.filter((id) => !isNaN(id)), ...selectedChannel.members.map((m) => m.id)])];
      } else {
        //remove the nan in mention ids
        mention_ids = mention_ids.filter((id) => !isNaN(id));
      }

      quillContents.ops.forEach((op) => {
        if (op.insert.image) {
          haveGif = true;
        }
      });
    }

    if (textOnly.trim() === "" && mention_ids.length === 0 && !haveGif) {
      body = "<span></span>";
    }
    if (mode === "chat") {
      dispatch(setSidebarSearch({ value: "" }));
      let el = document.createElement("div");
      el.innerHTML = body;
      for (let i = el.childNodes.length - 1; i >= 0; i--) {
        if (_.trim(el.childNodes[i].innerText) === "" && el.childNodes[i].innerHTML === "<br>") {
          el.removeChild(el.childNodes[i]);
        } else {
          el.childNodes[i].innerHTML = _.trim(el.childNodes[i].innerHTML);
          break;
        }
      }
      let msgpayload = {
        channel_id: selectedChannel.id,
        body: el.innerHTML,
        mention_ids: mention_ids,
        file_ids: [],
        quote: null,
        reference_id: require("shortid").generate(),
        reference_title: selectedChannel.type === "DIRECT" ? `${user.first_name} in a direct message` : selectedChannel.title,
      };
      if (textOnly.trim() !== "" || mention_ids.length) dispatch(postChatMessage(msgpayload));
      setTimeout(() => {
        uFiles.forEach((file, k) => {
          let payload = {
            channel_id: selectedChannel.id,
            body: "",
            mention_ids: [],
            file_ids: [file.id],
            quote: null,
            reference_id: require("shortid").generate(),
            reference_title: selectedChannel.type === "DIRECT" ? `${user.first_name} in a direct message` : selectedChannel.title,
          };
          if (k === uFiles.length - 1) {
            setTimeout(() => {
              toaster.dismiss(toasterRef.current);
            }, 300);
          }
          dispatch(postChatMessage(payload));
          // if (k === uFiles.length - 1) {
          //   payload = {
          //     channel_id: selectedChannel.id,
          //     body: el.innerHTML,
          //     mention_ids: mention_ids,
          //     file_ids: [file.id],
          //     quote: null,
          //     reference_id: require("shortid").generate(),
          //     reference_title: selectedChannel.type === "DIRECT" ? `${user.first_name} in a direct message` : selectedChannel.title,
          //   };
          //   setTimeout(() => {
          //     dispatch(postChatMessage(payload));
          //     toaster.dismiss(toasterRef.current);
          //   }, 300);

          //   //setUploadedFiles([]);
          //   dispatch(saveInputData({ sent: true }));
          // } else {
          //   payload = {
          //     channel_id: selectedChannel.id,
          //     body: "",
          //     mention_ids: [],
          //     file_ids: [file.id],
          //     quote: null,
          //     reference_id: require("shortid").generate(),
          //     reference_title: selectedChannel.type === "DIRECT" ? `${user.first_name} in a direct message` : selectedChannel.title,
          //   };
          //   dispatch(postChatMessage(payload));
          // }
        });
      }, 500);
    } else if (mode === "post") {
      let reference_id = require("shortid").generate();
      let payload = {
        post_id: post.id,
        body: body,
        mention_ids: mention_ids,
        file_ids: [...uFiles.map((f) => f.id), ...inlineImages.map((i) => i.id)],
        reference_id: reference_id,
        personalized_for_id: null,
        parent_id: parentId,
        approval_user_ids: savedInput && savedInput.approvers ? savedInput.approvers : [],
      };
      //setUploadedFiles([]);
      dispatch(setParentIdForUpload(null));
      dispatch(saveInputData({ sent: true }));
      if (editPostComment) {
        payload = {
          ...payload,
          id: editPostComment.id,
          file_ids: [...uFiles.map((f) => f.id), ...files.filter((f) => typeof f.id !== "string"), ...inlineImages.map((i) => i.id)],
          parent_id: editPostComment.parent_id,
          reference_id: null,
        };
        dispatch(putComment(payload));
        dispatch(setEditComment(null));
        toaster.dismiss(toasterRef.current);
      } else {
        let timestamp = Math.floor(Date.now() / 1000);
        let commentObj = {
          author: user,
          body: body,
          clap_count: 0,
          code: timestamp,
          created_at: { timestamp: timestamp },
          files: [],
          files_trashed: [],
          id: reference_id,
          is_archive: false,
          is_editable: true,
          is_edited: 0,
          is_favourite: false,
          mention_ids: mention_ids,
          original_body: body,
          parent_id: parentId,
          personalized_for_id: null,
          post_id: post.id,
          quote: null,
          reference_id: reference_id,
          ref_quote: null,
          replies: {},
          todo_reminder: null,
          total_replies: 0,
          total_unread_replies: 0,
          updated_at: { timestamp: timestamp },
          unfurls: [],
          user_clap_count: 0,
          claps: [],
          users_approval: [],
        };

        dispatch(addComment(commentObj));
        dispatch(postComment(payload));
        toaster.dismiss(toasterRef.current);
      }
    }
  };

  // useEffect(() => {
  //   if (uploadedFiles.length) {
  //     if (uploadedFiles.length === files.length) {
  //       let mention_ids = [];
  //       let body = comment;
  //       let haveGif = false;
  //       if (quillContents.ops && quillContents.ops.length > 0) {
  //         let mentionIds = quillContents.ops
  //           .filter((id) => {
  //             return id.insert.mention ? id : null;
  //           })
  //           .map((mid) => Number(mid.insert.mention.id));
  //         mention_ids = [...new Set(mentionIds)];
  //         if (mention_ids.includes(NaN)) {
  //           mention_ids = [...new Set([...mention_ids.filter((id) => !isNaN(id)), ...selectedChannel.members.map((m) => m.id)])];
  //         } else {
  //           //remove the nan in mention ids
  //           mention_ids = mention_ids.filter((id) => !isNaN(id));
  //         }

  //         quillContents.ops.forEach((op) => {
  //           if (op.insert.image) {
  //             haveGif = true;
  //           }
  //         });
  //       }

  //       if (textOnly.trim() === "" && mention_ids.length === 0 && !haveGif) {
  //         body = "<span></span>";
  //       }

  //       if (uploadedFiles.filter((f) => isNaN(f.id)).length) {
  //       } else {
  //         if (!sending) {
  //           handleSubmit(body, mention_ids);
  //           setSending(true);
  //         }
  //         // if (modalData.quote) {
  //         //     modalData.onClearQuote();
  //         // }
  //         // modalData.onClearContent();
  //       }
  //     }
  //   }
  // });

  const handleQuillChange = (content, delta, source, editor) => {
    setComment(content);
    setQuillContents(editor.getContents());
    setTextOnly(editor.getText(content));
  };

  const [init, setInit] = useState(false);

  const refCallback = (e) => {
    reactQuillRef.current = e;
    setInit(true);
  };

  useEffect(() => {
    if (init === true && reactQuillRef.current) {
      setTimeout(() => {
        reactQuillRef.current.focus();
      }, 300);
    }
  }, [init]);

  const handleSelectFileUploadOption = (e) => {
    setFileOption(e);
  };

  let hasExternal = false;

  if (post) {
    hasExternal = post.recipients.some((r) => {
      return (r.type === "TOPIC" || r.type === "WORKSPACE") && r.is_shared;
    });
  }

  const { modules } = useQuillModules({ mode: mode, mentionOrientation: "bottom", quillRef: reactQuillRef, members, setImageLoading, setInlineImages });

  return (
    <ModalWrapper isOpen={modal} toggle={toggle} size={"lg"} centered>
      <ModalHeaderSection toggle={toggle}>{dictionary.fileUpload}</ModalHeaderSection>
      <ModalBody>
        <DescriptionInputWrapper>
          <StyledQuillEditor
            ref={refCallback}
            className={"chat-input description-input"}
            //formats={formats}
            modules={modules}
            placeholder={dictionary.quillPlaceholder}
            readOnly={loading}
            onChange={handleQuillChange}
            height={80}
          />
          <IconButton onClick={handleShowEmojiPicker} icon="smile" />
          {showEmojiPicker === true && <PickerContainer handleShowEmojiPicker={handleShowEmojiPicker} onSelectEmoji={onSelectEmoji} onSelectGif={onSelectGif} orientation={"top"} ref={pickerRef} />}
        </DescriptionInputWrapper>
        <FilesPreview files={files} onRemoveFile={handleRemoveFile} onAddFile={handleAddFile} dictionary={dictionary} />

        <SelectFileOptionContainer className="mt-1">
          <FolderSelect options={fileOptions} value={fileOption} onChange={handleSelectFileUploadOption} isClearable={true} maxMenuHeight={250} menuPlacement="top" placeholder={"File options"} />
        </SelectFileOptionContainer>
      </ModalBody>
      <StyledModalFooter>
        {((selectedChannel &&
          selectedChannel.entity_id &&
          workspaces[selectedChannel.entity_id] &&
          workspaces[selectedChannel.entity_id].is_shared &&
          workspaces[selectedChannel.entity_id].team_channel.id === selectedChannel.id &&
          user.type === "internal") ||
          (hasExternal && user.type === "internal")) && <ExternalLabel>{dictionary.fileUploadLabel}</ExternalLabel>}
        <Button outline color="secondary" onClick={toggle}>
          {dictionary.cancel}
        </Button>
        <Button color="primary" onClick={handleUpload} disabled={imageLoading}>
          {loading && <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true" />}
          {dictionary.upload}
        </Button>
      </StyledModalFooter>
    </ModalWrapper>
  );
};

const FilesPreview = (props) => {
  const { files, onRemoveFile, onAddFile, dictionary } = props;

  const dispatch = useDispatch();

  const refs = {
    dropZoneRef: useRef(null),
  };

  const handleRemoveFile = (file) => {
    onRemoveFile(file);
  };
  const handleAddFile = (acceptedFiles) => {
    let attachedFiles = [];
    acceptedFiles.forEach((file) => {
      var bodyFormData = new FormData();
      bodyFormData.append("file", file);
      let shortFileId = require("shortid").generate();
      if (file.type === "image/jpeg" || file.type === "image/png" || file.type === "image/gif" || file.type === "image/webp") {
        attachedFiles.push({
          ...file,
          type: "IMAGE",
          id: shortFileId,
          status: false,
          src: URL.createObjectURL(file),
          bodyFormData: bodyFormData,
          name: file.name ? file.name : file.path,
        });
      } else if (file.type === "video/mp4") {
        attachedFiles.push({
          ...file,
          type: "VIDEO",
          id: shortFileId,
          status: false,
          src: URL.createObjectURL(file),
          bodyFormData: bodyFormData,
          name: file.name ? file.name : file.path,
        });
      } else {
        attachedFiles.push({
          ...file,
          type: "DOC",
          id: shortFileId,
          status: false,
          src: "#",
          bodyFormData: bodyFormData,
          name: file.name ? file.name : file.path,
        });
      }
    });
    onAddFile(attachedFiles);
  };

  const handleOpenFileDialog = () => {
    if (refs.dropZoneRef.current) {
      refs.dropZoneRef.current.open();
    }
  };

  return (
    <>
      <FilesPreviewContainer hasOneFile={files.length === 1}>
        <DropDocument
          hide
          ref={refs.dropZoneRef}
          onDrop={({ acceptedFiles }) => {
            handleAddFile(acceptedFiles);
          }}
          // onCancel={handleHideDropzone}
        />
        <ul>
          {files.map((file, i) => {
            return (
              <li key={i}>
                <div className="remove-upload" aria-label="close" onClick={() => handleRemoveFile(file)}>
                  <SvgIconFeather icon="x" />
                </div>
                {file.type === "IMAGE" && <img alt="file" src={file.src} />}
                {file.type !== "IMAGE" && (
                  <DocDiv className="card app-file-list">
                    <div className="app-file-icon">
                      <SvgIcon icon={"document"} width="28" height="32" />
                    </div>
                    <div className="p-2 small">{file.name}</div>
                  </DocDiv>
                )}
              </li>
            );
          })}
        </ul>
      </FilesPreviewContainer>
      <button className="btn btn-primary btn-block my-2" onClick={handleOpenFileDialog}>
        <SvgIconFeather icon="plus" />
        <span>{dictionary.addFiles}</span>
      </button>
    </>
  );
};

export default React.memo(FileUploadModal);
