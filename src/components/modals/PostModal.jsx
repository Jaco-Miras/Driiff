import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Input, InputGroup, Label, Modal, ModalBody } from "reactstrap";
import styled from "styled-components";
import { clearModal } from "../../redux/actions/globalActions";
import { postCreate, putPost, updateCompanyPostFilterSort } from "../../redux/actions/postActions";
import { updateWorkspacePostFilterSort } from "../../redux/actions/workspaceActions";
import { FileAttachments, PostVisibility } from "../common";
import { DropDocument } from "../dropzone/DropDocument";
import { DescriptionInput, FolderSelect } from "../forms";
import { useToaster, useWindowSize, useWorkspaceAndUserOptions, usePostDraft } from "../hooks";
import { ModalHeaderSection } from "./index";
import { uploadBulkDocument } from "../../redux/services/global";
import { useHistory } from "react-router-dom";
import { replaceChar } from "../../helpers/stringFormatter";
import PostSettings from "./PostSettings";
import usePostModalDictionary from "../dictionary/usePostModalDictionary";

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
  &.modal-input {
    z-index: 2;
  }
  &.more-option {
    //z-index: 0;
    overflow: unset;
    width: 100%;
    @media all and (max-width: 480px) {
      margin-left: 0;
      margin-right: 0;
      margin-bottom: 1rem;
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
  &.file-attachment-wrapper > div {
    display: flex;
    width: 100%;
    align-items: center;
    .react-select-container {
      max-width: 300px;
    }
  }
  .file-attachments {
    position: relative;
    max-width: 100%;
    // margin-left: 3rem;
    // margin-right: 2rem;
    @media all and (max-width: 480px) {
      margin-left: 0;
    }
    ul {
      //margin-right: 128px;
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
    left: 0;
    background-color: #fff;
    border: 1px solid #dee2e6;
    padding: 0;
    border-radius: 6px;
    opacity: 0;
    max-height: 0;
    overflow: auto;
    overflow-x: hidden;
    width: 230px;
    z-index: 2;
    .dark & {
      background: #191c20;
    }

    &.active {
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
    left: 250px;
    background-color: #fff;
    border: 1px solid #dee2e6;
    padding: 0;
    border-radius: 6px;
    opacity: 0;
    max-height: 0;
    overflow: auto;
    width: 230px;
    z-index: 2;

    .dark & {
      background: #191c20;
    }

    &.active {
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
    .post-info {
      font-size: 0.8rem;
      flex-flow: wrap;
      // justify-content: flex-end;
      // @media all and (max-width: 480px) {
      //   justify-content: flex-start;
      // }
    }
  }
  .dark & {
    input {
      color: #ffffff !important;
      &::-webkit-input-placeholder {
        color: #c7ced6;
      }
    }
  }
  &.file-attachment-wrapper .file-label {
    font-size: 0.8rem;
  }
  &.addressed-to-container {
    margin: 20px 0 10px 0;
  }
`;

const MoreOption = styled.div`
  cursor: pointer;
  // margin-bottom: 5px;
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
    // height: ${(props) => (props.height > 80 ? props.height : 80)}px;
    height: calc(100% - 50px);
  }

  label {
    min-width: 100%;
    font-weight: 500;
  }
`;

//onst initTimestamp = Math.floor(Date.now() / 1000);

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

const PostModal = (props) => {
  const { type, mode, item = {}, params = null } = props.data;

  const history = useHistory();
  const winSize = useWindowSize();
  const inputRef = useRef();
  const dispatch = useDispatch();
  const toaster = useToaster();
  const componentIsMounted = useRef(true);

  const user = useSelector((state) => state.session.user);
  const isExternalUser = user.type === "external";
  const recipients = useSelector((state) => state.global.recipients);
  const workspaces = useSelector((state) => state.workspaces.workspaces);
  const activeTopic = useSelector((state) => state.workspaces.activeTopic);

  const [initTimestamp] = useState(Math.floor(Date.now() / 1000));
  const [modal, setModal] = useState(true);
  const [draftId, setDraftId] = useState(null);
  const [showDropzone, setShowDropzone] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  // const [nestedModal, setNestedModal] = useState(false);
  // const [closeAll, setCloseAll] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mentionedUserIds, setMentionedUserIds] = useState([]);
  const [ignoredMentionedUserIds, setIgnoredMentionedUserIds] = useState([]);
  const [inlineImages, setInlineImages] = useState([]);
  const [imageLoading, setImageLoading] = useState(null);
  const [savingDraft, setSavingDraft] = useState(false);
  const [quillContents, setQuillContents] = useState([]);
  const [fileOption, setFileOption] = useState(null);

  const toasterRef = useRef(null);
  const progressBar = useRef(0);
  const formRef = {
    reactQuillRef: useRef(null),
    more_options: useRef(null),
    dropzone: useRef(null),
    arrow: useRef(null),
    visibilityInfo: useRef(null),
  };

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
    mention_ids: [],
    requiredUsers: [],
    shared_with_client: false,
    mustReadUsers: [],
    mustReplyUsers: [],
  });

  const {
    options: addressToOptions,
    getDefaultAddressTo,
    getAddressTo,
    responsible_ids,
    recipient_ids,
    is_personal,
    workspace_ids,
    userOptions,
    addressIds,
    actualUsers,
  } = useWorkspaceAndUserOptions({
    addressTo: form.selectedAddressTo,
  });

  const { draftSaved, handleDeleteDraft } = usePostDraft({
    draftId,
    initTimestamp,
    isExternalUser,
    item,
    form,
    is_personal,
    params,
    responsible_ids,
    user,
    topicId: params ? activeTopic.id : null,
    toaster,
    setDraftId: setDraftId,
    savingDraft: savingDraft,
    setSavingDraft: setSavingDraft,
  });

  const { dictionary } = usePostModalDictionary({
    workspace_ids,
    addressIds,
  });

  const [shareOption, setShareOption] = useState({
    id: "internal",
    value: "internal",
    label: dictionary.internalTeamLabel,
    icon: null,
  });

  const toastId = useRef(null);
  const sendNotify = (text) => (toastId.current = toaster.info(text));
  const dismiss = () => toaster.dismiss(toastId.current);

  const toggleAll = (saveDraft = false, showDeleteToaster = false) => {
    setModal(!modal);
    dispatch(clearModal({ type: type }));
  };

  const toggle = () => {
    toggleAll();
  };

  const handleSelectAddressTo = (e) => {
    if (e === null) {
      setForm({
        ...form,
        selectedAddressTo: [],
        shared_with_client: false,
      });
    } else {
      const hasExternal = e.some((r) => {
        return (r.type === "TOPIC" || r.type === "WORKSPACE") && r.is_shared;
      });
      setForm({
        ...form,
        selectedAddressTo: e,
        shared_with_client: !hasExternal ? false : form.shared_with_client,
      });
    }
  };

  const handleNameChange = (e) => {
    setForm({
      ...form,
      title: e.target.value,
    });
  };

  const handleConfirm = () => {
    if (loading || imageLoading) return;

    setLoading(true);
    const hasExternal = form.selectedAddressTo.some((r) => {
      return (r.type === "TOPIC" || r.type === "WORKSPACE") && r.is_shared;
    });
    const rawMentionIds =
      quillContents.ops && quillContents.ops.length > 0
        ? quillContents.ops
            .filter((id) => {
              return id.insert.mention ? id : null;
            })
            .map((mid) => Number(mid.insert.mention.user_id))
        : [];
    const mentionedIds =
      quillContents.ops && quillContents.ops.length > 0
        ? quillContents.ops
            .filter((m) => {
              if (form.shared_with_client && hasExternal) {
                return m.insert.mention && (m.insert.mention.type === "internal" || m.insert.mention.type === "external");
              } else {
                return m.insert.mention && m.insert.mention.type === "internal";
              }
            })
            .map((i) => parseInt(i.insert.mention.type_id))
        : [];
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
      show_at: form.show_at ? moment(form.show_at, "YYYY-MM-DD").format("YYYY-MM-DD") : form.end_at ? moment(new Date()).add(1, "day").format("YYYY-MM-DD") : null,
      end_at: form.end_at ? moment(form.end_at, "YYYY-MM-DD").format("YYYY-MM-DD") : null,
      tag_ids: [],
      file_ids: inlineImages.map((i) => i.id),
      code_data: {
        base_link: `${process.env.REACT_APP_apiProtocol}${localStorage.getItem("slug")}.${process.env.REACT_APP_localDNSName}`,
        mention_ids: rawMentionIds.includes(NaN) ? addressIds : mentionedIds.filter((id) => addressIds.some((aid) => aid === id)),
      },
      approval_user_ids:
        form.showApprover && form.approvers.find((a) => a.value === "all") ? form.approvers.find((a) => a.value === "all").all_ids : form.showApprover ? form.approvers.map((a) => a.value).filter((id) => user.id !== id) : [],
      required_user_ids: [],
      // required_user_ids:
      //   (form.must_read || form.reply_required) && form.requiredUsers.find((a) => a.value === "all")
      //     ? addressIds.filter((id) => id !== user.id)
      //     : form.must_read || form.reply_required
      //     ? form.requiredUsers.map((a) => a.value).filter((id) => user.id !== id)
      //     : [],
      shared_with_client: (form.shared_with_client && hasExternal) || isExternalUser ? 1 : 0,
      body_mention_ids: rawMentionIds.includes(NaN) ? addressIds : mentionedIds.filter((id) => addressIds.some((aid) => aid === id)),
      must_read_user_ids: form.must_read && form.mustReadUsers.find((a) => a.value === "all") ? addressIds.filter((id) => id !== user.id) : form.must_read ? form.mustReadUsers.map((a) => a.value).filter((id) => user.id !== id) : [],
      must_reply_user_ids:
        form.reply_required && form.mustReplyUsers.find((a) => a.value === "all") ? addressIds.filter((id) => id !== user.id) : form.reply_required ? form.mustReplyUsers.map((a) => a.value).filter((id) => user.id !== id) : [],
    };

    if (mode === "edit") {
      payload = {
        ...payload,
        id: item.post.id,
        file_ids: [...uploadedFiles.map((f) => f.id), ...payload.file_ids],
      };
      if (item.post.users_approval.find((u) => u.ip_address !== null && u.is_approved)) {
        delete payload.approval_user_ids;
      }
      if (attachedFiles.length) {
        uploadFiles(payload, "edit");
      } else {
        if (form.selectedAddressTo.length) {
          sendNotify(dictionary.updatingPost);
          dispatch(
            putPost(payload, (err, res) => {
              dismiss();
              setLoading(false);
              handleDeleteDraft();
            })
          );
        }
      }
    } else {
      if (attachedFiles.length) {
        uploadFiles(payload, "create");
      } else {
        if (form.selectedAddressTo.length) {
          sendNotify(dictionary.sendingPost);
          dispatch(
            postCreate(payload, (err, res) => {
              dismiss();
              setLoading(false);
              if (err) return;
              handleDeleteDraft();
              if (params) {
                let payload = {
                  topic_id: activeTopic.id,
                  filter: "my_posts",
                  tag: null,
                };
                dispatch(updateWorkspacePostFilterSort(payload));
                if (activeTopic.folder_id) {
                  history.push(`/workspace/posts/${activeTopic.folder_id}/${replaceChar(activeTopic.folder_name)}/${activeTopic.id}/${replaceChar(activeTopic.name)}/post/${res.data.id}/${replaceChar(res.data.title)}`);
                } else {
                  history.push(`/workspace/posts/${activeTopic.id}/${replaceChar(activeTopic.name)}/post/${res.data.id}/${replaceChar(res.data.title)}`);
                }
              } else {
                let payload = {
                  filter: "my_posts",
                  tag: null,
                };
                dispatch(updateCompanyPostFilterSort(payload));
                history.push(`/posts/${res.data.id}/${replaceChar(res.data.title)}`);
              }
            })
          );
        }
      }
    }
    toggleAll(false);
  };

  const handleAddMentionedUsers = (users) => {
    //check if users is member of workspace if not add them then add to responsible list
    //if user is already a member of the workspace then add user to responsible list

    const mentionedUsers = addressToOptions.filter((ad) => {
      return users.some((u) => u.id === ad.id);
    });

    setForm({
      ...form,
      selectedAddressTo: [...mentionedUsers, ...form.selectedAddressTo],
    });

    setMentionedUserIds([]);
    setIgnoredMentionedUserIds([...ignoredMentionedUserIds, ...users.map((u) => parseInt(u.id))]);
  };

  const handleIgnoreMentionedUsers = (users) => {
    setIgnoredMentionedUserIds(users.map((u) => u.id));
    setMentionedUserIds(mentionedUserIds.filter((id) => !users.some((u) => u.id === id)));
  };

  const handleMentionUser = (mention_ids) => {
    mention_ids = mention_ids.map((id) => parseInt(id)).filter((id) => !isNaN(id));
    if (mention_ids.length) {
      let addressIds = form.selectedAddressTo
        .map((ad) => {
          if (ad.type === "USER") {
            return ad.type_id;
          } else {
            return ad.participant_ids;
          }
        })
        .flat();
      const userRecipientIds = recipients
        .filter((r) => {
          if (r.type === "USER" && user.id === r.type_id) {
            return true;
          } else if (r.type === "USER" && addressIds.some((id) => id === r.type_id)) {
            return true;
          } else return false;
        })
        .map((r) => r.id);

      const recipientIds = form.selectedAddressTo.map((ad) => ad.id);

      let ignoreIds = [...userRecipientIds, ...recipientIds, ...ignoredMentionedUserIds];
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
    let mentionIds = [];
    if (editor.getContents().ops && editor.getContents().ops.length) {
      mentionIds = editor
        .getContents()
        .ops.filter((m) => m.insert.mention && m.insert.mention.type !== "external")
        .map((i) => i.insert.mention.id);
      handleMentionUser(mentionIds);
    }
    setQuillContents(editor.getContents());
    setForm({
      ...form,
      body: content,
      textOnly: textOnly.trim(),
      mention_ids: mentionIds.map((id) => parseInt(id)).filter((id) => !isNaN(id)),
    });
  };

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
    let formData = new FormData();

    let uploadData = {
      user_id: user.id,
      file_type: "private",
      folder_id: null,
      fileOption: fileOption,
      options: {
        config: {
          onUploadProgress: handleOnUploadProgress,
        },
      },
    };
    attachedFiles.map((file, index) => formData.append(`files[${index}]`, file.bodyFormData.get("file")));
    uploadData["files"] = formData;

    await new Promise((resolve, reject) => resolve(uploadBulkDocument(uploadData)))
      .then((result) => {
        if (type === "edit") {
          payload = {
            ...payload,
            file_ids: [...result.data.map((res) => res.id), ...payload.file_ids],
          };
          dispatch(
            putPost(payload, () => {
              if (toasterRef.current) toaster.dismiss(toasterRef.current);
              setLoading(false);
              handleDeleteDraft();
            })
          );
        } else {
          payload = {
            ...payload,
            file_ids: [...result.data.map((res) => res.id), ...payload.file_ids],
          };
          dispatch(
            postCreate(payload, (err, res) => {
              if (toasterRef.current) toaster.dismiss(toasterRef.current);
              setLoading(false);
              if (err) return;
              handleDeleteDraft();
              if (params) {
                let payload = {
                  topic_id: activeTopic.id,
                  filter: "my_posts",
                  tag: null,
                };
                dispatch(updateWorkspacePostFilterSort(payload));
                if (activeTopic.folder_id) {
                  history.push(`/workspace/posts/${activeTopic.folder_id}/${replaceChar(activeTopic.folder_name)}/${activeTopic.id}/${replaceChar(activeTopic.name)}/post/${res.data.id}/${replaceChar(res.data.title)}`);
                } else {
                  history.push(`/workspace/posts/${activeTopic.id}/${replaceChar(activeTopic.name)}/post/${res.data.id}/${replaceChar(res.data.title)}`);
                }
              } else {
                let payload = {
                  filter: "my_posts",
                  tag: null,
                };
                dispatch(updateCompanyPostFilterSort(payload));
                history.push(`/posts/${res.data.id}/${replaceChar(res.data.title)}`);
              }
            })
          );
        }
      })
      .catch((error) => {
        handleNetWorkError(error);
      });
  }

  const handleNetWorkError = () => {
    if (toasterRef.curent !== null) {
      setLoading(false);
      toaster.dismiss(toasterRef.current);
      toaster.error(<div>{dictionary.unsuccessful}.</div>);
      toasterRef.current = null;
    }
  };

  const handleOnUploadProgress = (progressEvent) => {
    const progress = progressEvent.loaded / progressEvent.total;
    if (toasterRef.current === null) {
      toasterRef.current = toaster.info(<div>{dictionary.uploadingAndSending}.</div>, { progress: progressBar.current, autoClose: true });
    } else {
      toaster.update(toasterRef.current, { progress: progress, autoClose: true });
    }
  };

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
    if (item.hasOwnProperty("draft")) {
      setForm(item.draft.form);
      setDraftId(item.draft.draft_id);
    } else if (params && activeTopic !== null && mode !== "edit") {
      setForm({
        ...form,
        selectedAddressTo: getDefaultAddressTo(),
        requiredUsers: [
          {
            id: "all",
            value: "all",
            label: "All users",
            icon: "users",
            all_ids: addressIds,
          },
        ],
      });
    } else if (mode === "edit" && item.hasOwnProperty("post")) {
      const hasRequestedChange = item.post.users_approval.filter((u) => u.ip_address !== null && !u.is_approved).length;
      let allUserIds = getAddressTo(item.post.recipients)
        .map((ad) => {
          if (ad.type === "USER") {
            return ad.type_id;
          } else {
            return ad.participant_ids;
          }
        })
        .flat();
      allUserIds = [...new Set(allUserIds)].filter((id) => id !== user.id);

      // requiredUserIds = [...new Set(requiredUserIds)].filter((id) => id !== user.id);
      // const isAllSelected = requiredUserIds.length === item.post.required_users.length;

      const isAllSelectedMustRead = allUserIds.length === item.post.must_read_users.length;
      const isAllSelectedMustReply = allUserIds.length === item.post.must_reply_users.length;
      setForm({
        ...form,
        body: item.post.body,
        textOnly: item.post.body,
        title: item.post.title,
        has_folder: item.post.recipients.find((r) => r.type === "TOPIC") ? true : false,
        no_reply: item.post.is_read_only,
        must_read: item.post.is_must_read,
        reply_required: item.post.is_must_reply,
        selectedAddressTo: getAddressTo(item.post.recipients),
        file_ids: item.post.files.map((f) => f.id),
        show_at: item.post.show_at,
        end_at: item.post.end_at,
        showApprover: item.post.users_approval.length > 0,
        shared_with_client: item.post.shared_with_client,
        approvers:
          item.post.users_approval.length > 0
            ? item.post.users_approval.map((u) => {
                return {
                  ...u,
                  icon: "user-avatar",
                  value: u.id,
                  label: u.name,
                  type: "USER",
                  ip_address: hasRequestedChange ? null : u.ip_address,
                  is_approved: hasRequestedChange ? false : u.is_approved,
                };
              })
            : [],
        mustReadUsers:
          item.post.must_read_users.length > 0
            ? isAllSelectedMustRead
              ? [
                  {
                    id: "all",
                    value: "all",
                    label: "All users",
                    icon: "users",
                    all_ids: allUserIds,
                  },
                ]
              : item.post.must_read_users.map((u) => {
                  return {
                    ...u,
                    icon: "user-avatar",
                    value: u.id,
                    label: u.name,
                    type: "USER",
                  };
                })
            : [],
        mustReplyUsers:
          item.post.must_reply_users.length > 0
            ? isAllSelectedMustReply
              ? [
                  {
                    id: "all",
                    value: "all",
                    label: "All users",
                    icon: "users",
                    all_ids: allUserIds,
                  },
                ]
              : item.post.must_reply_users.map((u) => {
                  return {
                    ...u,
                    icon: "user-avatar",
                    value: u.id,
                    label: u.name,
                    type: "USER",
                  };
                })
            : [],
        // requiredUsers:
        //   item.post.required_users.length > 0
        //     ? isAllSelected
        //       ? [
        //           {
        //             id: "all",
        //             value: "all",
        //             label: "All users",
        //             icon: "users",
        //             all_ids: requiredUserIds,
        //           },
        //         ]
        //       : item.post.required_users.map((u) => {
        //           return {
        //             ...u,
        //             icon: "user-avatar",
        //             value: u.id,
        //             label: u.name,
        //             type: "USER",
        //           };
        //         })
        //     : [],
      });
      setUploadedFiles(
        item.post.files.map((f) => {
          return {
            ...f,
            rawFile: f,
          };
        })
      );
    }
    return () => {
      componentIsMounted.current = null;
    };
  }, []);

  const onDragEnter = () => {
    if (!showDropzone) setShowDropzone(true);
  };

  useEffect(() => {
    if (componentIsMounted.current) {
      if (form.shared_with_client) {
        setShareOption({
          id: "external",
          value: "external",
          label: dictionary.internalAndExternalTeamLabel,
          icon: "eye",
        });
      } else {
        setShareOption({
          id: "internal",
          value: "internal",
          label: dictionary.internalTeamLabel,
          icon: "eye-off",
        });
      }
    }
  }, [form.shared_with_client]);

  const handleSelectFileUploadOption = (e) => {
    setFileOption(e);
  };

  const hasExternalWs = form.selectedAddressTo.some((r) => {
    return (r.type === "TOPIC" || r.type === "WORKSPACE") && r.is_shared;
  });

  return (
    <Modal isOpen={modal} toggle={toggle} size={"xl"} onOpened={onOpened} centered className="post-modal">
      <ModalHeaderSection toggle={toggle}>{draftSaved ? "Draft saved" : savingDraft ? "Saving draft..." : mode === "edit" ? dictionary.editPost : dictionary.createNewPost}</ModalHeaderSection>
      <ModalBody onDragOver={onDragEnter}>
        {/* <Modal isOpen={nestedModal} toggle={toggleNested} onClosed={closeAll ? toggle : undefined} centered>
          <ModalHeaderSection toggle={toggleNested}>{dictionary.saveAsDraft}</ModalHeaderSection>
          <ModalBody>{dictionary.draftBody}</ModalBody>
          <ModalFooter>
            <Button className="btn-outline-secondary" onClick={() => toggleAll(false, true)}>
              {dictionary.discard}
            </Button>
            <Button color="primary" onClick={() => toggleAll(true)}>
              {dictionary.save}
            </Button>
          </ModalFooter>
        </Modal> */}
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
            <Label className={"modal-label"} for="post-title">
              {dictionary.postTitle}
            </Label>
            <Input className="w-100" style={{ borderRadius: "5px" }} value={form.title} onChange={handleNameChange} innerRef={inputRef} />
          </div>
        </WrapperDiv>
        <WrapperDiv className={"modal-input addressed-to-container"}>
          <Label className={"modal-label"} for="workspace">
            {dictionary.addressedTo}
          </Label>
          <FolderSelect options={addressToOptions} value={form.selectedAddressTo} onChange={handleSelectAddressTo} isMulti={true} isClearable={true} />
        </WrapperDiv>
        <WrapperDiv className={"m-0"}>
          <PostVisibility dictionary={dictionary} formRef={formRef} selectedAddressTo={form.selectedAddressTo} workspaceIds={workspace_ids} userOptions={userOptions} />
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
          workspaces={workspaces}
          onAddUsers={handleAddMentionedUsers}
          onDoNothing={handleIgnoreMentionedUsers}
          setInlineImages={setInlineImages}
          setImageLoading={setImageLoading}
          disableBodyMention={isExternalUser}
          prioMentionIds={addressIds.filter((id) => id !== user.id)}
          members={Object.values(actualUsers).filter((u) => {
            if (user.type === "external") {
              return addressIds.some((id) => u.id === id);
            } else {
              if (u.id === user.id) {
                return false;
              } else if ((u.type === "external" && addressIds.some((id) => id === u.id)) || (u.type === "internal" && u.role !== null)) {
                return true;
              } else {
                return false;
              }
            }
          })}
        />
        {(attachedFiles.length > 0 || uploadedFiles.length > 0) && (
          <WrapperDiv className="file-attachment-wrapper">
            <div className={"mb-2"}>
              <Label className={"modal-label"} for="workspace">
                {dictionary.fileAttachments}
              </Label>
            </div>
            <div className={"mb-2"}>
              <FolderSelect options={fileOptions} value={fileOption} onChange={handleSelectFileUploadOption} isClearable={true} maxMenuHeight={250} menuPlacement="top" placeholder={"File options"} />
              {hasExternalWs && !isExternalUser && <span className="file-label ml-2">{dictionary.fileUploadLabel}</span>}
            </div>
            <div>
              <FileAttachments attachedFiles={[...attachedFiles, ...uploadedFiles]} handleRemoveFile={handleRemoveFile} />
            </div>
          </WrapperDiv>
        )}
        <WrapperDiv className="modal-label more-option">
          <MoreOption className="mb-1">{dictionary.moreOptions}</MoreOption>
          <PostSettings userOptions={userOptions} dictionary={dictionary} form={form} isExternalUser={isExternalUser} shareOption={shareOption} setShareOption={setShareOption} setForm={setForm} user={user} />
        </WrapperDiv>
        <WrapperDiv className={"mt-0 mb-0"}>
          <button className="btn btn-primary" disabled={form.selectedAddressTo.length === 0 || form.title === "" || imageLoading} onClick={handleConfirm}>
            {loading && <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true" />}
            {mode === "edit" ? dictionary.updatePostButton : dictionary.createPostButton}
          </button>
        </WrapperDiv>
      </ModalBody>
    </Modal>
  );
};

export default React.memo(PostModal);
