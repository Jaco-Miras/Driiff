import moment from "moment";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Input, InputGroup, Label, Modal, ModalBody, ModalFooter } from "reactstrap";
import styled from "styled-components";
import {
  clearModal,
  deleteDraft,
  deleteDraftReducer,
  saveDraft,
  updateDraft,
} from "../../redux/actions/globalActions";
import { postCreate, putCompanyPosts, putPost, updateCompanyPostFilterSort } from "../../redux/actions/postActions";
import { Avatar, DatePicker, FileAttachments, SvgIconFeather } from "../common";
import { DropDocument } from "../dropzone/DropDocument";
import { CheckBox, DescriptionInput, FolderSelect } from "../forms";
import { useToaster, useTranslation, useWindowSize, useWorkspaceAndUserOptions } from "../hooks";
import { ModalHeaderSection } from "./index";
import { uploadDocument } from "../../redux/services/global";
import { renderToString } from "react-dom/server";
import { debounce } from "lodash";
import { useHistory } from "react-router-dom";
import { replaceChar } from "../../helpers/stringFormatter";

const WrapperDiv = styled(InputGroup)`
  display: flex;
  align-items: center;
  margin: 20px 0;

  label {
    margin: 0 20px 0 0;
    min-width: 109px;
  }
  button {
    margin-left: auto;
  }
  .react-select-container {
    width: 100%;
  }
  .react-select__multi-value__label {
    align-self: center;
  }

  &.more-option {
    width: 100%;
    @media all and (max-width: 480px) {
        margin-left: 0;
        margin-right: 0;
    }
  }
  &.schedule-post {
    width: 100%;
    label {
      margin: 0 20px 0 0;
    }
    .feather {
      color: #c7ced6;
    }
    .react-date-picker__wrapper {
      border: thin solid #c8ced5;
      border-radius: 4px;
      color: #c7ced6;
      .react-date-picker__inputGroup {
        padding: 0 6px;
      }
    }
    #placeholder {
      color: #c7ced6;
    }
    input {
      color: #505050;
      &::-webkit-input-placeholder {
        color: #c7ced6;
      }
    }
    
    .dark & {
      input {
        color: #ffffff;
        &::-webkit-input-placeholder {
          color: #c7ced6;
        }
      }    
    }
  }
  &.file-attachment-wrapper {
    margin-top: 0;
    margin-bottom: 20px;
  }
  .file-attachments {
    position: relative;
    max-width: 100%;
    margin-left: 128px;
    @media all and (max-width: 480px) {
        margin-left: 0;
    }
    ul {
      margin-right: 128px;
      margin-bottom: 0;
      @media all and (max-width: 480px) {
        padding-right: 40px;
      }
      li {
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }
    }
  }  
  .user-popup {
    cursor: pointer;
    margin: 0 0.25rem;  
  }
  .workspace-popup {
    cursor: pointer;
    margin: 0 0.25rem;
  }
  .user-list {
    transition: all 0.5s ease;
    position: absolute;
    bottom: 22px;
    right: 0;
    background-color: #fff;
    border: 1px solid #dee2e6;
    padding: 0;
    border-radius: 6px;
    opacity: 0;
    max-height: 0;
    overflow: auto;
    overflow-x: hidden;
    width: 230px;
    
    .dark & {
      background: #191c20;
    }
    
    &.active,
     &:hover {
     padding: 5px 10px;
      opacity: 1;
      max-height: 255px;    
    }
    
    img {
      min-width: 28px;    
    }
    
    .item-user-name {
      width: 100%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      display: block;    
    }
  }
  .workspace-list {
    position: absolute;
    bottom: 22px;
    right: 0;    
    background-color: #fff;
    border: 1px solid #dee2e6;
    padding: 0;
    border-radius: 6px;
    opacity: 0;
    max-height: 0;
    overflow: auto;
    width: 230px;    
    
    .dark & {
      background: #191c20;
    }
    
    &.active,
     &:hover {
     padding: 5px 10px;
      opacity: 1;
      max-height: 255px;    
    }
    
    .item-workspace-name {
      display: block;
      width: 100%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;    
    }
  }
  .post-visibility-container {
    width: 100%;
  }
  .dark & {
    input {
      color: #ffffff !important;
      &::-webkit-input-placeholder {
        color: #c7ced6;
      }
    }    
  }
`;

// const SelectPostVisibility = styled(PostVisibilitySelect)`
//   flex: 1 0 0;
//   width: 1%;
//   @media all and (max-width: 480px) {
//     width: 100%;
//   }
// `;

// const SelectWorkspace = styled(FolderSelect)`
//   flex: 1 0 0;
//   width: 1%;
//   @media all and (max-width: 480px) {
//     width: 100%;
//   }
// `;

// const SelectPeople = styled(PeopleSelect)`
//   flex: 1 0 0;
//   width: 1%;
//   .react-select__control--menu-is-open {
//     border-color: #7a1b8b !important;
//     box-shadow: none;
//   }
//   .react-select__option {
//     background-color: #ffffff;
//   }
//   .react-select__menu-list--is-multi > div {
//     &:hover {
//       background: #8c3b9b;
//       color: #ffffff;
//       cursor: pointer;
//       .react-select__option {
//         background: #8c3b9b;
//         cursor: pointer;
//       }
//     }
//   }
//   .react-select__control--is-focused {
//     border-color: #7a1b8b !important;
//     box-shadow: none;
//   }
//   @media all and (max-width: 480px) {
//     width: 100%;
//   }
// `;

const CheckBoxGroup = styled.div`
  overflow: hidden;
  transition: all 0.3s ease !important;
  width: 100%;

  &.enter-active {
    max-height: ${(props) => props.maxHeight}px;
    overflow: visible;
  }

  &.leave-active {
    max-height: 0;
  }

  label {
    min-width: auto;
    font-size: 12.6px;

    &:hover {
      color: #972c86;
    }
  }
`;

const MoreOption = styled.div`
  cursor: pointer;
  margin-bottom: 5px;
  &:hover {
    color: #972c86;
  }
  @media all and (max-width: 480px) {
      margin-top: 40px;
  }
  svg {
    transition: all 0.3s;
    width: 15px;
    margin-left: 5px;

    &.ti-plus {
      transform: rotate(-540deg);
    }
    &.rotate-in {
      transform: rotate(0deg);
    }
  }
`;

const StyledDescriptionInput = styled(DescriptionInput)`
  .description-input {
    height: ${props => props.height > 80 ? props.height : 80}px;
  }

  label {
    min-width: 100%;
    font-weight: 500;
  }
`;

const ApproveOptions = styled.div`
  .react-select-container {
    width: 300px;
    @media all and (max-width: 480px) {
      width: 100%;
    }
  }
`;

const SelectApprover = styled(FolderSelect)`
`;

const StyledDatePicker = styled(DatePicker)``;

const initTimestamp = Math.floor(Date.now() / 1000);

const CreateEditCompanyPostModal = (props) => {

  const { type, mode, item = {}, action } = props.data;

  const history = useHistory();
  const winSize = useWindowSize();
  const inputRef = useRef();
  const dispatch = useDispatch();
  const { _t } = useTranslation();
  const toaster = useToaster();

  const user = useSelector((state) => state.session.user);
  const company = useSelector((state) => state.global.recipients).find(r => r.main_department === true);
  const users = useSelector((state) => state.global.recipients).filter(r => r.type === "USER");

  const [init, setInit] = useState(false);
  const [modal, setModal] = useState(true);
  const [showMoreOptions, setShowMoreOptions] = useState(true);
  const [maxHeight, setMaxHeight] = useState(120);
  const [draftId, setDraftId] = useState(null);
  const [showDropzone, setShowDropzone] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [nestedModal, setNestedModal] = useState(false);
  const [closeAll, setCloseAll] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mentionedUserIds, setMentionedUserIds] = useState([]);
  const [ignoredMentionedUserIds, setIgnoredMentionedUserIds] = useState([]);
  const [inlineImages, setInlineImages] = useState([]);
  const [mounted, setMounted] = useState(null);
  //const [savingDraft, setSavingDraft] = useState(false);

  const savingDraft = useRef(null);

  const [form, setForm] = useState({
    must_read: false,
    reply_required: false,
    no_reply: false,
    is_private: false,
    has_folder: false,
    title: "",
    selectedAddressTo: [],
    body: "",
    textOnly: "",
    show_at: null,
    end_at: null,
    approvers: [],
    showApprover: false,
  });

  const {
    options: addressToOptions, getDefaultAddressToAsCompany, getAddressTo,
    user_ids, responsible_ids, recipient_ids, is_personal, workspace_ids,
    userOptions: approverOptions,
  } = useWorkspaceAndUserOptions({
    addressTo: form.selectedAddressTo
  });

  const dictionary = {
    createPost: _t("POST.CREATE_POST", "Create post"),
    createNewPost: _t("POST.CREATE_NEW_POST", "Create new post"),
    editPost: _t("POST.EDIT_POST", "Edit post"),
    postTitle: _t("POST.TITLE", "Title"),
    postInfo: _t("POST_INFO", "A post is a message that can contain text and images. It can be directed at one or more workspaces, and to one or multiple persons."),
    visibility: _t("POST.VISIBILITY", "Visibility"),
    workspace: _t("POST.WORKSPACE", "Workspace"),
    responsible: _t("POST.RESPONSIBLE", "Responsible"),
    addressed: _t("POST.ADDRESSED", "Addressed"),
    addressedTo: _t("POST.ADDRESSED_TO", "Addressed to"),
    addressedPeople: _t("POST.ADDRESSED_PEOPLE", "Addressed people"),
    addressedPeopleOnly: _t("POST.ADDRESSED_PEOPLE_ONLY", "Addressed people only"),
    description: _t("POST.DESCRIPTION", "Description"),
    saveAsDraft: _t("POST.SAVE_AS_DRAFT", "Save as draft"),
    moreOptions: _t("POST.MORE_OPTIONS", "More options"),
    replyRequired: _t("POST.REPLY_REQUIRED", "Reply required"),
    mustRead: _t("POST.MUST_READ", "Must read"),
    noReplies: _t("POST.NO_REPLIES", "No replies"),
    schedulePost: _t("POST.SCHEDULE", "Schedule"),
    updatePostButton: _t("POST.UPDATE_BUTTON", "Update post"),
    createPostButton: _t("POST.CREATE_BUTTON", "Create post"),
    save: _t("POST.SAVE", "Save"),
    discard: _t("POST.DISCARD", "Discard"),
    draftBody: _t("POST.DRAFT_BODY", "Not sure about the content? Save it as a draft."),
    postVisibilityInfo: _t("POST.POST_VISIBILITY_COUNT_INFO",
      `This post will be visible to ::user_count:: in ::workspace_count::`, {
        user_count: renderToString(<span className="user-popup">{user_ids.length === 1 ?
          _t("POST.NUMBER_USER", "1 user") :
          _t("POST.NUMBER_USERS", "::count:: users", {
            count: user_ids.length
          })}</span>),
        workspace_count: renderToString(<span className="workspace-popup">{workspace_ids.length === 1 ?
          _t("POST.NUMBER_WORKSPACE", "1 workspace") :
          _t("POST.NUMBER_WORKSPACES", "::count:: workspaces", {
            count: workspace_ids.length
          })}</span>)
      }),
    approve: _t("POST.APPROVE", "Approve"),
  };

  const formRef = {
    reactQuillRef: useRef(null),
    more_options: useRef(null),
    dropzone: useRef(null),
    arrow: useRef(null),
    visibilityInfo: useRef(null),
  };

  const toggleNested = () => {
    setNestedModal(!nestedModal);
    setCloseAll(false);
  };

  const toggleAll = (saveDraft = false) => {
    setNestedModal(!nestedModal);
    setCloseAll(true);
    if (saveDraft) {
      //handleSaveDraft();
    } else if (draftId) {
      dispatch(
        deleteDraft({
          type: "draft_post",
          draft_id: draftId,
        }, (err, res) => {
          dispatch(
            deleteDraftReducer({
              draft_type: "draft_post",
              draft_id: draftId,
              id: item.hasOwnProperty("draft") ? item.draft.post_id : initTimestamp,
              post_id: item.hasOwnProperty("draft") ? item.draft.post_id : initTimestamp
            }, (err, res) => {
              toaster.success(<>Draft <b>{form.title}</b> successfully removed.</>);
            })
          );
        })
      );
    }
    setModal(!modal);
    dispatch(clearModal({ type: type }));
  };

  const toggle = () => {
    if (mode === "edit") {
      const post = item.post;

      if (form.title !== post.title) {
        toggleNested();
        return;
      }

      if (form.body !== post.body) {
        toggleNested();
        return;
      }

      if (form.end_at !== post.end_at) {
        toggleNested();
        return;
      }

      if (form.is_private !== post.is_personal) {
        toggleNested();
        return;
      }

      if (form.must_read !== post.is_must_read) {
        toggleNested();
        return;
      }

      if (form.no_reply !== post.is_must_reply) {
        toggleNested();
        return;
      }

      if (form.reply_required !== post.is_must_reply) {
        toggleNested();
        return;
      }

      if (form.show_at !== post.show_at) {
        toggleNested();
        return;
      }
    } else {
      if (form.title !== "") {
        toggleNested();
        return;
      }

      if (form.body !== "<div><br></div>") {
        toggleNested();
        return;
      }

      if (form.end_at !== null) {
        toggleNested();
        return;
      }

      if (form.has_folder !== false) {
        toggleNested();
        return;
      }

      if (form.is_private !== false) {
        toggleNested();
        return;
      }

      if (form.must_read !== false) {
        toggleNested();
        return;
      }

      if (form.no_reply !== false) {
        toggleNested();
        return;
      }

      if (form.reply_required !== false) {
        toggleNested();
        return;
      }

      if (form.show_at !== null) {
        toggleNested();
        return;
      }
    }

    toggleAll(false);
  };

  const handleSelectAddressTo = (e) => {
    if (e === null) {
      setForm({
        ...form,
        selectedAddressTo: [],
      });
    } else {
      setForm({
        ...form,
        selectedAddressTo: e,
      });
    }
  };

  const handleNameChange = (e) => {
    setForm({
      ...form,
      title: e.target.value,
    });
  };

  const handleSaveDraft = () => {
    if (!(form.title === "" && form.body === "" && !form.selectedUsers.length)) {
      let timestamp = Math.floor(Date.now() / 1000);
      let payload = {
        type: "draft_post",
        form: {
          ...form,
          must_read: form.must_read ? 1 : 0,
          must_reply: form.reply_required ? 1 : 0,
          read_only: form.no_reply ? 1 : 0,
          personal: is_personal,
          users_responsible: responsible_ids,
        },
        timestamp: timestamp,
        id: timestamp,
        created_at: { timestamp: timestamp },
        updated_at: { timestamp: timestamp },
        title: form.title,
        partial_body: form.body,
        unread_reply_ids: [],
        clap_user_ids: [],
        unread_reply_ids: [],
        author: user,
        user_reads: [],
        is_archived: 0,
        is_must_read: form.must_read,
        is_must_reply: form.reply_required,
        is_read_only: form.no_reply,
        unread_count: 0,
        reply_count: 0,
        recipients: form.selectedAddressTo,
        recipient_ids: form.selectedAddressTo.map((r) => r.id),
        users_approval: []
      };
      if (draftId) {
        payload = {
          ...payload,
          draft_id: draftId,
          id: item.hasOwnProperty("draft") ? item.draft.post_id : initTimestamp,
          post_id: item.hasOwnProperty("draft") ? item.draft.post_id : initTimestamp
        };
        dispatch(updateDraft(payload, (err, res) => {
          if (err) return;
          toaster.success(<>Your post is still available as a draft</>);
        }));
      } else {
        dispatch(saveDraft(payload, (err, res) => {
          if (err) return;
          toaster.success(<>Your post is still available as a draft</>);
        }));
      }
    }
  };
  
  const handleConfirm = () => {
    if (loading)
      return;

    setLoading(true);

    let payload = {
      title: form.title,
      body: form.body,
      responsible_ids: responsible_ids,
      type: "post",
      personal: is_personal,
      recipient_ids: recipient_ids,
      must_read: form.must_read ? 1 : 0,
      must_reply: form.reply_required ? 1 : 0,
      read_only: form.no_reply ? 1 : 0,
      //workspace_ids: workspace_ids,
      show_at: form.show_at ? moment(form.show_at, "YYYY-MM-DD").format("YYYY-MM-DD") : form.end_at ? moment(new Date()).add(1, "day").format("YYYY-MM-DD") : null,
      end_at: form.end_at ? moment(form.end_at, "YYYY-MM-DD").format("YYYY-MM-DD") : null,
      tag_ids: [],
      file_ids: inlineImages.map((i) => i.id),
      code_data: {
        base_link: `${process.env.REACT_APP_apiProtocol}${localStorage.getItem("slug")}.${process.env.REACT_APP_localDNSName}`
      },
      approval_user_ids: form.showApprover ? form.approvers.map((a) => a.value) : []
    };
    if (draftId) {
      dispatch(
        deleteDraft({
          type: "draft_post",
          draft_id: draftId,
        }, () => {
          setLoading(false);
          toggleAll(false);
        })
      );
      dispatch(
        deleteDraft({
          type: "draft_post",
          draft_id: draftId,
        }, () => {
          setLoading(false);
          toggleAll(false);
        })
      );
    }
    if (mode === "edit") {
      payload = {
        ...payload,
        id: item.post.id,
        file_ids: uploadedFiles.map((f) => f.id),
      };
      if (attachedFiles.length) {
        uploadFiles(payload, "edit");
      } else {
        if (form.selectedAddressTo.length > 1) {
          dispatch(putCompanyPosts(payload, () => {
            setLoading(false);
            toggleAll(false);
          }));
        } else {
          action.update(payload, (err, res) => {
            setLoading(false);
            if (res) {
              toggleAll(false);
            }
          });
        }
      }
    } else {
      if (attachedFiles.length) {
        uploadFiles(payload, "create");
        //setLoading(false);
      } else {
        if (form.selectedAddressTo.length) {
          dispatch(postCreate(payload, (err,res) => {
            setLoading(false);
            toggleAll(false);
            if (err) return;
            let payload = {
              filter: "my_posts",
              tag: null,
            };
            dispatch(updateCompanyPostFilterSort(payload));
            history.push(`/posts/${res.data.id}/${replaceChar(res.data.title)}`)
          }));
        }
      }
    }
  };

  const handleAddMentionedUsers = (users) => {
    //check if users is member of workspace if not add them then add to responsible list
    //if user is already a member of the workspace then add user to responsible list

    setForm({
      ...form,
      selectedAddressTo: [...users.map((user) => {
        return {
          id: user.id,
          value: user.id,
          label: user.name,
          name: user.name,
          first_name: user.first_name,
          profile_image_link: user.profile_image_thumbnail_link ? user.profile_image_thumbnail_link : user.profile_image_link,
          type: "USER",
          icon: "user-avatar",
        };
      }), ...form.selectedAddressTo]
    });

    setMentionedUserIds([]);
  };

  const handleIgnoreMentionedUsers = (users) => {
    setIgnoredMentionedUserIds(users.map((u) => u.id));
    setMentionedUserIds(mentionedUserIds.filter((id) => !users.some((u) => u.id === id)));
  };

  const handleMentionUser = (mention_ids) => {
    mention_ids = mention_ids.map((id) => parseInt(id)).filter((id) => !isNaN(id));
    if (mention_ids.length) {
      //check for recipients/type
      let adddressIds = form.selectedAddressTo.map((ad) => {
        if (ad.type === "USER") {
          return ad.id;
        } else {
          return ad.member_ids;
        }
      }).flat();
      let ignoreIds = [user.id, ...adddressIds, ...ignoredMentionedUserIds];
      let userIds = mention_ids.filter((id) => {
        return !ignoreIds.some((iid) => iid === id);
      });
      setMentionedUserIds(userIds.length ? userIds.map((id) => parseInt(id)) : []);
    } else {
      setIgnoredMentionedUserIds([]);
      setMentionedUserIds([]);
    }
  };

  const handleQuillChange = (content, delta, source, editor) => {
    const textOnly = editor.getText(content);
    if (editor.getContents().ops && editor.getContents().ops.length) {
      handleMentionUser(
        editor
          .getContents()
          .ops.filter((m) => m.insert.mention)
          .map((i) => i.insert.mention.id)
      );
    }
    setForm({
      ...form,
      body: content,
      textOnly: textOnly.trim(),
    });
  };

  const toggleCheck = useCallback(
    (e) => {
      const name = e.target.dataset.name;
      switch (name) {
        case "no_reply": {
          setForm((prevState) => ({
            ...prevState,
            [name]: !prevState[name],
            reply_required: !prevState[name] === true ? false : prevState["reply_required"],
          }));
          break;
        }
        case "reply_required": {
          setForm((prevState) => ({
            ...prevState,
            [name]: !prevState[name],
            no_reply: !prevState[name] === true ? false : prevState["no_reply"],
          }));
          break;
        }
        default: {
          setForm((prevState) => ({
            ...prevState,
            [name]: !prevState[name],
          }));
        }
      }
    },
    [setForm]
  );

  const toggleMoreOptions = () => {
    setShowMoreOptions(!showMoreOptions);
  };

  const handlePostVisibilityRef = (e) => {
    const handleUserPopUpMouseEnter = () => {
      if (formRef.visibilityInfo.current) {
        formRef.visibilityInfo.current.querySelector(".user-list").classList.add("active");
      }
    };

    const handleUserPopUpMouseOut = () => {
      if (formRef.visibilityInfo.current) {
        formRef.visibilityInfo.current.querySelector(".user-list").classList.remove("active");
      }
    };

    const handleWorkspacePopUpMouseEnter = () => {
      if (formRef.visibilityInfo.current) {
        formRef.visibilityInfo.current.querySelector(".workspace-list").classList.add("active");
      }
    };

    const handleWorkspacePopUpMouseOut = () => {
      if (formRef.visibilityInfo.current) {
        formRef.visibilityInfo.current.querySelector(".workspace-list").classList.remove("active");
      }
    };

    if (e) {
      formRef.visibilityInfo.current = e;
      let el = e.querySelector(".user-popup:not([data-event='1'])");
      if (el) {
        el.addEventListener("mouseenter", handleUserPopUpMouseEnter);
        el.addEventListener("mouseout", handleUserPopUpMouseOut);
        el.dataset.event = "1";
      }
      el = e.querySelector(".workspace-popup:not([data-event='1'])");
      if (el) {
        el.addEventListener("mouseenter", handleWorkspacePopUpMouseEnter);
        el.addEventListener("mouseout", handleWorkspacePopUpMouseOut);
        el.dataset.event = "1";
      }
    }
  };

  const handleSelectStartDate = useCallback(
    (value) => {
      setForm((f) => ({
        ...f,
        show_at: value,
      }));
    },
    [setForm]
  );

  const handleSelectEndDate = useCallback(
    (value) => {
      setForm((f) => ({
        ...f,
        end_at: value,
      }));
    },
    [setForm]
  );

  const handleOpenFileDialog = () => {
    if (formRef.dropzone.current) {
      formRef.dropzone.current.open();
    }
  };

  const handleHideDropzone = () => {
    setShowDropzone(false);
  };

  const dropAction = (acceptedFiles) => {
    let selectedFiles = [];

    acceptedFiles.forEach((file) => {
      var bodyFormData = new FormData();
      bodyFormData.append("file", file);
      let timestamp = Math.floor(Date.now());
      //let shortFileId = require("shortid").generate();
      if (file.type === "image/jpeg" || file.type === "image/png" || file.type === "image/gif" || file.type === "image/webp") {
        selectedFiles.push({
          rawFile: file,
          bodyFormData: bodyFormData,
          type: "IMAGE",
          id: timestamp,
          status: false,
          src: URL.createObjectURL(file),
          name: file.name ? file.name : file.path,
          uploader: user,
        });
      } else if (file.type === "video/mp4") {
        selectedFiles.push({
          rawFile: file,
          bodyFormData: bodyFormData,
          type: "VIDEO",
          id: timestamp,
          status: false,
          src: URL.createObjectURL(file),
          name: file.name ? file.name : file.path,
          uploader: user,
        });
      } else {
        selectedFiles.push({
          rawFile: file,
          bodyFormData: bodyFormData,
          type: "DOC",
          id: timestamp,
          status: false,
          src: URL.createObjectURL(file),
          name: file.name ? file.name : file.path,
          uploader: user,
        });
      }
    });
    setAttachedFiles((prevState) => [...prevState, ...selectedFiles]);
    handleHideDropzone();
  };

  async function uploadFiles(payload, type = "create") {
    await Promise.all(
      attachedFiles.map((file) =>
        uploadDocument({
          user_id: user.id,
          file: file.bodyFormData,
          file_type: "private",
          folder_id: null,
        })
      )
    ).then((result) => {
      if (type === "edit") {
        payload = {
          ...payload,
          file_ids: [...result.map((res) => res.data.id), ...payload.file_ids],
        };
        dispatch(
          putPost(payload, () => {
            setLoading(false);
            toggleAll(false);
          })
        );
      } else {
        payload = {
          ...payload,
          file_ids: result.map((res) => res.data.id),
        };
        dispatch(
          postCreate(payload, (err,res) => {
            setLoading(false);
            toggleAll(false);
            if (err) return;
            let payload = {
              filter: "my_posts",
              tag: null,
            };
            dispatch(updateCompanyPostFilterSort(payload));
            history.push(`/posts/${res.data.id}/${replaceChar(res.data.title)}`)
          })
        );
      }
    });
  }

  const handleRemoveFile = (fileId) => {
    setUploadedFiles((prevState) => prevState.filter((f) => f.id !== parseInt(fileId)));
    setAttachedFiles((prevState) => prevState.filter((f) => f.id !== parseInt(fileId)));
  };

  const onOpened = () => {
    if (inputRef && inputRef.current) {
      inputRef.current.focus();
    }
  };

  useEffect(() => {
    if (formRef.more_options.current !== null && maxHeight === null && draftId === null) {
      setMaxHeight(formRef.more_options.current.offsetHeight);
      setShowMoreOptions(!!(item.post !== null && (item.post.is_read_only || item.post.is_must_read || item.post.is_must_reply)));
    }
  }, [formRef, setMaxHeight]);

  useEffect(() => {
    if (item.hasOwnProperty("draft")) {
      setForm(item.draft.form);
      setDraftId(item.draft.draft_id);

    } else if (mode === "edit" && item.hasOwnProperty("post")) {
      setForm({
        ...form,
        body: item.post.body,
        textOnly: item.post.body,
        title: item.post.title,
        has_folder: true,
        no_reply: item.post.is_read_only,
        must_read: item.post.is_must_read,
        reply_required: item.post.is_must_reply,
        selectedAddressTo: getAddressTo(item.post.recipients),
        file_ids: item.post.files.map((f) => f.id),
        show_at: item.post.show_at,
        end_at: item.post.end_at
      });
      if ((item.post.end_at !== null || item.post.show_at !== null) || (item.post.is_read_only || item.post.is_must_read || item.post.is_must_reply)) {
        if (formRef.more_options.current !== null) {
          setMaxHeight(formRef.more_options.current.offsetHeight);
        }
        setShowMoreOptions(true);
      }
      setUploadedFiles(
        item.post.files.map((f) => {
          return {
            ...f,
            rawFile: f,
          };
        })
      );
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!init && company && mode !== "edit") {
      // setForm({
      //   ...form,
      //   selectedAddressTo: getDefaultAddressToAsCompany(),
      // });
      setInit(true);
    }
  }, [company]);

  const autoUpdateDraft = useCallback(debounce((form, draftId) => {
    if (!(form.title === "" && form.textOnly === "")) {
      savingDraft.current = true;
      let payload = {
        type: "draft_post",
        form: {
          ...form,
          must_read: form.must_read ? 1 : 0,
          must_reply: form.reply_required ? 1 : 0,
          read_only: form.no_reply ? 1 : 0,
          personal: is_personal,
          users_responsible: responsible_ids,
        },
        timestamp: initTimestamp,
        id: initTimestamp,
        post_id: initTimestamp,
        created_at: { timestamp: initTimestamp },
        updated_at: { timestamp: initTimestamp },
        title: form.title,
        partial_body: form.body,
        unread_reply_ids: [],
        clap_user_ids: [],
        unread_reply_ids: [],
        author: user,
        user_reads: [],
        is_archived: 0,
        is_must_read: form.must_read,
        is_must_reply: form.reply_required,
        is_read_only: form.no_reply,
        unread_count: 0,
        reply_count: 0,
        recipients: form.selectedAddressTo,
        recipient_ids: form.selectedAddressTo.map((r) => r.id)
      };
      if (draftId) {
        payload = {
          ...payload,
          draft_id: draftId,
          id: item.hasOwnProperty("draft") ? item.draft.post_id : initTimestamp,
          post_id: item.hasOwnProperty("draft") ? item.draft.post_id : initTimestamp
        };
        dispatch(updateDraft(payload, (err,res) => {
          savingDraft.current = false;
          if (err) return;
        }));
      } else {
        dispatch(saveDraft(payload, (err,res) => {
          savingDraft.current = false;
          if (err) return;
          setDraftId(res.data.id)
        }));
      }
    }
  }, 500), []);

  useEffect(() => {
    if (mounted && !savingDraft.current) {
      //autoUpdateDraft(form, draftId)
    }
  }, [form, draftId, mounted]);

  const toggleApprover = () => {
    setForm({
      ...form,
      showApprover: !form.showApprover
    })
  }

  const handleSelectApprover = (e) => {
    if (e === null) {
      setForm({
        ...form,
        approvers: [],
      });
    } else {
      setForm({
        ...form,
        approvers: e,
      });
    }
  };

  return (
    <Modal isOpen={modal} toggle={toggle} size={"xl"} onOpened={onOpened} centered className="post-modal">
      <ModalHeaderSection
        toggle={toggle}>{mode === "edit" ? dictionary.editPost : dictionary.createNewPost}</ModalHeaderSection>
      <ModalBody>
        <Modal isOpen={nestedModal} toggle={toggleNested} onClosed={closeAll ? toggle : undefined} centered>
          <ModalHeaderSection toggle={toggleNested}>{dictionary.saveAsDraft}</ModalHeaderSection>
          <ModalBody>{dictionary.draftBody}</ModalBody>
          <ModalFooter>
            <Button className="btn-outline-secondary" onClick={() => toggleAll(false)}>
              {dictionary.discard}
            </Button>
            <Button color="primary" onClick={() => toggleAll(true)}>
              {dictionary.save}
            </Button>
          </ModalFooter>
        </Modal>
        <DropDocument
          hide={!showDropzone}
          ref={formRef.dropzone}
          onDragLeave={handleHideDropzone}
          onDrop={({ acceptedFiles }) => {
            dropAction(acceptedFiles);
          }}
          onCancel={handleHideDropzone}
          attachedFiles={attachedFiles}
        />
        <WrapperDiv className={"modal-input mt-0"}>
          <div className="w-100">
            <Label className={"modal-info pb-3"}>{dictionary.postInfo}</Label>
          </div>
          <div className="w-100">
            <Label className={"modal-label"} for="post-title">{dictionary.postTitle}</Label>
            <Input className="w-100" style={{ borderRadius: "5px" }} value={form.title}
                   onChange={handleNameChange} innerRef={inputRef}/>
          </div>
        </WrapperDiv>
        <WrapperDiv className={"modal-input"}>
          <Label className={"modal-label"} for="workspace">{dictionary.addressedTo}</Label>
          <FolderSelect options={addressToOptions} value={form.selectedAddressTo}
                        onChange={handleSelectAddressTo} isMulti={true} isClearable={true}/>
        </WrapperDiv>
        <StyledDescriptionInput
          className="modal-description"
          height={winSize.height - 660}
          showFileButton={true}
          onChange={handleQuillChange}
          onOpenFileDialog={handleOpenFileDialog}
          defaultValue={item.hasOwnProperty("draft") ? form.body : mode === "edit" ? item.post.body : ""}
          mode={mode}
          required
          mentionedUserIds={mentionedUserIds}
          onAddUsers={handleAddMentionedUsers}
          onDoNothing={handleIgnoreMentionedUsers}
          setInlineImages={setInlineImages}
          /*valid={valid.description}
                     feedback={feedback.description}*/
        />
        {(attachedFiles.length > 0 || uploadedFiles.length > 0) && (
          <WrapperDiv className="file-attachment-wrapper">
            <FileAttachments attachedFiles={[...attachedFiles, ...uploadedFiles]}
                             handleRemoveFile={handleRemoveFile}/>
          </WrapperDiv>
        )}
        <WrapperDiv className="modal-label more-option">
          <MoreOption onClick={toggleMoreOptions}>
            {dictionary.moreOptions}
            <SvgIconFeather icon="chevron-down"
                            className={`sub-menu-arrow ti-angle-up ${showMoreOptions ? "ti-minus rotate-in" : " ti-plus"}`}/>
          </MoreOption>

          <CheckBoxGroup ref={formRef.more_options} maxHeight={maxHeight}
                         className={showMoreOptions === null ? "" : showMoreOptions ? "enter-active" : "leave-active"}>
            <div className="d-flex">
              <CheckBox name="must_read" checked={form.must_read} onClick={toggleCheck} type="danger">
                {dictionary.mustRead}
              </CheckBox>
              <CheckBox name="reply_required" checked={form.reply_required} onClick={toggleCheck}
                        type="warning">
                {dictionary.replyRequired}
              </CheckBox>
              <CheckBox name="no_reply" checked={form.no_reply} onClick={toggleCheck} type="info">
                {dictionary.noReplies}
              </CheckBox>
            </div>
            <ApproveOptions className="d-flex align-items-center">
              <CheckBox name="must_read" checked={form.showApprover} onClick={toggleApprover}>
                {dictionary.approve}
              </CheckBox>
              {
                form.showApprover && 
                <SelectApprover options={approverOptions.filter((ao) => ao.value !== user.id)} value={form.approvers}
                        onChange={handleSelectApprover} isMulti={true} isClearable={true} menuPlacement="top"/>
              }
            </ApproveOptions>
            <WrapperDiv className="schedule-post">
              <Label>{dictionary.schedulePost}</Label>
              <SvgIconFeather className="mr-2" width={18} icon="calendar"/>
              <StyledDatePicker
                className="react-datetime-picker mr-2 start-date" onChange={handleSelectStartDate}
                value={form.show_at}
                minDate={new Date(new Date().setDate(new Date().getDate() + 1))}/>
              <StyledDatePicker
                className="react-datetime-picker end-date" onChange={handleSelectEndDate} value={form.end_at}
                minDate={new Date(new Date().setDate(new Date().getDate() + 1))}/>
            </WrapperDiv>
          </CheckBoxGroup>
        </WrapperDiv>
        <WrapperDiv>
          <div className="post-visibility-container" ref={handlePostVisibilityRef}>
            <span className="user-list">
              {
                users.filter(u => user_ids.includes(u.type_id)).map(u => {
                  return <span key={u.id}>
                    <span
                      title={u.email}
                      className="user-list-item d-flex justify-content-start align-items-center pt-2 pb-2">
                      <Avatar
                        className="mr-2"
                        key={u.id}
                        name={u.name}
                        imageLink={u.profile_image_thumbnail_link ? u.profile_image_thumbnail_link : u.profile_image_link}
                        id={u.id}/><span className="item-user-name">{u.name}</span></span>
                  </span>;
                })
              }
            </span>
            <span className="workspace-list">
              {
                form.selectedAddressTo.filter(w => workspace_ids.includes(w.type_id)).map(w => {
                  return <span className="d-flex justify-content-start align-items-center pt-2 pb-2" key={w.id}>
                    <span className="item-workspace-name">{w.name}</span>
                  </span>;
                })
              }
            </span>
            <span className="d-flex justify-content-end align-items-center"
                  dangerouslySetInnerHTML={{ __html: dictionary.postVisibilityInfo }}/>
          </div>
        </WrapperDiv>
        <WrapperDiv>
          <button className="btn btn-primary"
                  disabled={form.selectedAddressTo.length === 0 || form.title === ""}
                  onClick={handleConfirm}>
            {loading && <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"/>}
            {mode === "edit" ? dictionary.updatePostButton : dictionary.createPostButton}
          </button>
        </WrapperDiv>
      </ModalBody>
    </Modal>
  );
};

export default React.memo(CreateEditCompanyPostModal);
