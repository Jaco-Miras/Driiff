import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { Input, InputGroup, Label, Modal, ModalBody } from "reactstrap";
import styled from "styled-components";
import { EmailRegex, replaceChar } from "../../helpers/stringFormatter";
import { deleteWorkspaceFiles, setPendingUploadFilesToWorkspace } from "../../redux/actions/fileActions";
import { addToModals, clearModal } from "../../redux/actions/globalActions";
import { createWorkspace, leaveWorkspace, setActiveTopic, updateWorkspace } from "../../redux/actions/workspaceActions";
import { Avatar, FileAttachments, SvgIconFeather, ToolTip } from "../common";
import { DropDocument } from "../dropzone/DropDocument";
import { CheckBox, DescriptionInput, FolderSelect, InputFeedback, PeopleSelect } from "../forms";
import { useFileActions, useToaster, useTranslationActions } from "../hooks";
import { ModalHeaderSection } from "./index";
import { putChannel } from "../../redux/actions/chatActions";
import { getExternalUsers } from "../../redux/actions/userAction";
import { debounce } from "lodash";

const WrapperDiv = styled(InputGroup)`
  display: flex;
  align-items: center;
  margin-bottom: 20px;

  .icon-wrapper {
    width: 60px;
    position: relative;
    justify-content: center;
    align-items: center;
    display: grid;

    .btn {
      background: #fff;
      position: absolute;
      right: 5px;
      bottom: -5px;
      padding: 3px;

      &:hover {
        background: #fff !important;
      }
    }
  }

  .name-wrapper {
    width: calc(100% - 40px);
  }

  > .form-control:not(:first-child) {
    border-radius: 5px;
  }

  .input-feedback {
    margin-left: 130px;
    @media all and (max-width: 480px) {
      margin-left: 0;
    }
  }

  label {
    margin: 0 20px 0 0;
    min-width: 530px;
  }
  button {
    margin-left: auto;
  }
  .react-select-container {
    width: 100%;
    // z-index: 2;
  }
  .react-select__multi-value__label {
    align-self: center;
  }
  .files {
    width: 320px;
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
  &.file-attachment-wrapper {
    margin-top: 30px;
    margin-bottom: -20px;
  }
  &.action-wrapper {
    z-index: 0;
    margin-top: 40px;

    .action-archive-wrapper {
      display: flex;
      width: 100%;

      .btn-archive {
        display: flex;
        margin-left: auto;
        text-decoration: underline;
        color: #a7abc3;
      }
    }
  }
  &.checkboxes {
    flex-flow: row !important;
    label {
      min-width: 0;
    }
  }
  &.external-select {
    .invalid-feedback {
      display: block;
    }
    .react-select__control {
      border-color: ${(props) => (props.valid === false ? "red" : "#cccccc")}!important;
    }
  }
`;

const SelectFolder = styled(FolderSelect)`
  flex: 1 0 0;
  width: 1%;
  @media all and (max-width: 480px) {
    width: 100%;
  }
`;

const SelectPeople = styled(PeopleSelect)`
  flex: 1 0 0;
  width: 1%;
  .react-select__control--menu-is-open {
    border-color: #7a1b8b !important;
    box-shadow: none;
  }
  .react-select__option {
    background-color: #ffffff;
  }
  .react-select__menu-list--is-multi > div {
    &:hover {
      background: #8c3b9b;
      color: #ffffff;
      cursor: pointer;
      .react-select__option {
        background: #8c3b9b;
        cursor: pointer;
      }
    }
  }
  .react-select__control--is-focused {
    border-color: #7a1b8b !important;
    box-shadow: none;
  }
  @media all and (max-width: 480px) {
    width: 100%;
  }
`;

const StyledDescriptionInput = styled(DescriptionInput)`
  .description-input {
    height: ${(props) => props.height}px;
    max-height: 300px;
  }

  label {
    min-width: 100%;
    font-weight: 500;
  }

  .ql-toolbar {
    bottom: 30px;
    left: 40px;
  }

  .invalid-feedback {
    position: absolute;
    bottom: 0;
    top: auto;
  }
`;

const LockIcon = styled(SvgIconFeather)`
  width: 1rem;
  height: 1rem;
`;

const CreateEditWorkspaceModal = (props) => {
  const { type, mode, item = null } = props.data;

  const { uploadFiles } = useFileActions();
  const { _t } = useTranslationActions();
  const history = useHistory();
  const dispatch = useDispatch();
  const toaster = useToaster();
  const [modal, setModal] = useState(true);
  const user = useSelector((state) => state.session.user);
  const users = useSelector((state) => state.users.users);
  const externalUsers = useSelector((state) => state.users.externalUsers);
  const inactiveUsers = useSelector((state) => state.users.archivedUsers);
  const workspaces = useSelector((state) => state.workspaces.workspaces);
  const folders = useSelector((state) => state.workspaces.folders);
  const [userOptions, setUserOptions] = useState([]);
  const [externalUserOptions, setExternalUserOptions] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [invitedEmails, setInvitedEmails] = useState([]);
  const [externalInput, setExternalInput] = useState("");
  const [form, setForm] = useState({
    is_private: false,
    has_folder: item !== null && item.type === "WORKSPACE" && item.folder_id !== null,
    icon: null,
    icon_link: item && item.channel ? item.channel.icon_link : null,
    name: "",
    selectedUsers: [],
    selectedFolder:
      item === null
        ? null
        : item.type === "FOLDER"
        ? {
            value: item.id,
            label: item.name,
          }
        : item.folder_id
        ? {
            value: item.folder_id,
            label: item.folder_name,
          }
        : null,
    description: "",
    textOnly: "",
    has_externals: false,
    selectedExternals: [],
  });

  const [showDropzone, setShowDropzone] = useState(false);
  const [showIconDropzone, setShowIconDropzone] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [inlineImages, setInlineImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [valid, setValid] = useState({
    name: null,
    description: null,
    has_folder: null,
    team: null,
    external: true,
  });
  const [feedback, setFeedback] = useState({
    name: "",
    description: "",
    folder: "",
    team: "",
    external: "",
  });
  const refs = {
    container: useRef(null),
    workspace_name: useRef(null),
    dropZone: useRef(null),
    iconDropZone: useRef(null),
  };
  const [mentionedUserIds, setMentionedUserIds] = useState([]);
  const [ignoredMentionedUserIds, setIgnoredMentionedUserIds] = useState([]);

  const allUsers = [...Object.values(users), ...inactiveUsers];

  const dictionary = {
    createWorkspace: _t("WORKSPACE.CREATE_WORKSPACE", "Create workspace"),
    create: _t("BUTTON.CREATE", "Create"),
    updateWorkspace: _t("WORKSPACE.UPDATE_WORKSPACE", "Update workspace"),
    update: _t("BUTTON.UPDATE", "Update"),
    workspaceName: _t("WORKSPACE.WORKSPACE_NAME", "Name"),
    workspaceInfo: _t("WORKSPACE.WORKSPACE_INFO", "A workspace centers the team communication about a subject. A workspace can only be connected to one folder."),
    lockWorkspace: _t("WORKSPACE.WORKSPACE_LOCK", "Make workspace private"),
    lockWorkspaceText: _t("WORKSPACE.WORKSPACE_LOCK.DESCRIPTION", "When a workspace is private it is only visible to the members of the workspace."),
    archiveThisWorkspace: _t("WORKSPACE.WORKSPACE_ARCHIVE", "Archive this workspace"),
    unArchiveThisWorkspace: _t("WORKSPACE.WORKSPACE_UNARCHIVE", "Un-archive this workspace"),
    description: _t("LABEL.DESCRIPTION", "Description"),
    addToFolder: _t("CHECKBOX.ADD_TO_FOLDER", "Add to folder"),
    folder: _t("LABEL.FOLDER", "Folder"),
    team: _t("LABEL.TEAM", "Team"),
    archiveWorkspace: _t("HEADER.ARCHIVE_WORKSPACE", "Archive workspace"),
    archive: _t("BUTTON.ARCHIVE", "Archive"),
    unArchiveWorkspace: _t("HEADER.UNARCHIVE_WORKSPACE", "Un-archive workspace"),
    cancel: _t("BUTTON.CANCEL", "Cancel"),
    archiveBodyText: _t("TEXT.ARCHIVE_CONFIRMATION", "Are you sure you want to archive this workspace?"),
    unArchiveBodyText: _t("TEXT.UNARCHIVE_CONFIRMATION", "Are you sure you want to un-archive this workspace?"),
    confirm: _t("WORKSPACE.CONFIRM", "Confirm"),
    lockedWorkspace: _t("WORKSPACE.LOCKED_WORKSPACE", "Private workspace"),
    lockedWorkspaceText: _t("WORKSPACE.LOCKED_WORKSPACE_TEXT", "Only members can view and search this workspace."),
    feedbackWorkspaceNameIsRequired: _t("FEEDBACK.WORKSPACE_NAME_IS_REQUIRED", "Workspace name is required."),
    feedbackWorkspaceNameAlreadyExists: _t("FEEDBACK.WORKSPACE_NAME_ALREADY_EXISTS", "Workspace name already exists."),
    feedbackWorkspaceDescriptionIsRequired: _t("FEEDBACK.WORKSPACE_DESCRIPTION_IS_REQUIRED", "Description is required."),
    toasterWorkspaceIsCreated: _t("TOASTER.WORKSPACE_IS_CREATED", "::workspace_name:: workspace is created.", {
      workspace_name: `<b>${form.name}</b>`,
    }),
    externalWorkspace: _t("WORKSPACE.EXTERNAL_WORKSPACE", "External workspace"),
    externalUserConfirmation: _t("CONFIRMATION_EXTERNAL_USER", "Are you sure you want to give an external user access to this Workspace?"),
    workspaceWithExternals: _t("WORKSPACE.WORKSPACE_WITH_EXTERNALS", "Workspace with externals"),
    externalGuest: _t("WORKSPACE.EXTERNAL_GUEST", "External guest"),
    peopleExternal: _t("PEOPLE.EXTERNAL", "External"),
    peopleInvited: _t("PEOPLE.INVITED", "Invited"),
    workspaceWithExternalsInfo1: _t("WORKSPACE.WORKSPACE_WITH_EXTERNALS_INFO1", "This function will allow users outside your company be invited on this workspace."),
    workspaceWithExternalsInfo2: _t("WORKSPACE.WORKSPACE_WITH_EXTERNALS_INFO2", "This may be your customer or supplier."),
    emailExists: _t("WORKSPACE.EMAIL_EXISTS", "Email already used"),
    invalidEmail: _t("WORKSPACE.INVALID_EMAIL", "Invalid email"),
  };

  const _validateName = useCallback(() => {
    if (form.name === "") {
      setFeedback((prevState) => ({
        ...prevState,
        name: dictionary.feedbackWorkspaceNameIsRequired,
      }));
      setValid((prevState) => ({
        ...prevState,
        name: false,
      }));
      return false;
    }

    if (
      Object.values(workspaces).some((w) => {
        if (mode === "edit") {
          return w.id === item.id ? false : w.name.toLowerCase() === form.name.toLowerCase();
        } else {
          return w.name.toLowerCase() === form.name.toLowerCase();
        }
      })
    ) {
      setFeedback((prevState) => {
        return { ...prevState, name: dictionary.feedbackWorkspaceNameAlreadyExists };
      });
      setValid((prevState) => {
        return { ...prevState, name: true };
      });
      return true;
    }

    setFeedback((prevState) => {
      return { ...prevState, name: "" };
    });

    setValid((prevState) => {
      return { ...prevState, name: true };
    });
  }, [form.name, form.has_folder, form.selectedFolder, workspaces, setValid, setFeedback]);

  const toggle = () => {
    setModal(!modal);
    dispatch(clearModal({ type: type }));
  };

  const toggleCheck = (e) => {
    const name = e.target.dataset.name;
    const checked = !form[name];
    setForm((prevState) => {
      return { ...prevState, [name]: checked };
    });
  };

  const folderOptions = Object.values(folders)
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((ws) => {
      return {
        ...ws,
        icon: "folder",
        value: ws.id,
        label: ws.name,
      };
    });

  const handleSelectUser = (e) => {
    if (e === null) {
      setForm((prevState) => ({
        ...prevState,
        selectedUsers: [],
      }));
      setValid((prevState) => ({
        ...prevState,
        team: mode === "edit",
      }));
    } else {
      setForm((prevState) => ({
        ...prevState,
        selectedUsers: e,
      }));
      setValid((prevState) => ({
        ...prevState,
        team: true,
      }));
    }
  };

  const handleSelectExternalUser = (e) => {
    if (e === null) {
      setForm((prevState) => ({
        ...prevState,
        selectedExternals: [],
      }));
      setInvitedEmails([]);
    } else {
      const externals = e.map((e) => {
        if (e.id) {
          return e;
        } else {
          return {
            ...e,
            id: require("shortid").generate(),
            label: e.value,
            value: e.value,
            name: e.value,
            first_name: e.value,
            email: e.value,
            has_accepted: false,
          };
        }
      });
      setForm((prevState) => ({
        ...prevState,
        selectedExternals: externals,
      }));
      setInvitedEmails(externals.filter((e) => typeof e.id === "string").map((e) => e.email));
    }
  };

  const formatCreateLabel = (inputValue) => {
    return `Add ${inputValue}`;
  };

  const handleCreateOption = (inputValue) => {
    setInvitedEmails((prevState) => [...prevState, inputValue]);
    setForm((prevState) => ({
      ...prevState,
      selectedExternals: [
        ...prevState.selectedExternals,
        {
          id: require("shortid").generate(),
          label: inputValue,
          value: inputValue,
          name: inputValue,
          first_name: inputValue,
          email: inputValue,
          has_accepted: false,
        },
      ],
    }));
  };

  const validateExternalEmail = useCallback(
    debounce((valid, invalidEmail) => {
      if (valid) {
        setFeedback((prevState) => {
          return { ...prevState, external: "" };
        });
        setValid((prevState) => {
          return { ...prevState, external: null };
        });
      } else if (valid === false && invalidEmail === false) {
        setFeedback((prevState) => {
          return { ...prevState, external: dictionary.emailExists };
        });
        setValid((prevState) => {
          return { ...prevState, external: false };
        });
      } else if (valid === false && invalidEmail === true) {
        setFeedback((prevState) => {
          return { ...prevState, external: dictionary.invalidEmail };
        });
        setValid((prevState) => {
          return { ...prevState, external: false };
        });
      } else {
        setFeedback((prevState) => {
          return { ...prevState, external: "" };
        });
        setValid((prevState) => {
          return { ...prevState, external: true };
        });
      }
    }, 300),
    []
  );

  const handleMenuClose = () => {
    setValid((prevState) => {
      return { ...prevState, external: true };
    });
  };

  const handleExternalValidation = (inputValue, selectValue, selectOptions) => {
    const isExistingOption = selectOptions.some((o) => o.email === inputValue);
    const isSelectedOption = selectValue.some((o) => o.email === inputValue);
    if (!isExistingOption && !isSelectedOption && inputValue !== "") {
      if (EmailRegex.test(inputValue)) {
        const userExists = allUsers.some((uo) => uo.email === inputValue);
        if (!userExists) {
          // validateExternalEmail(true);
          return true;
        } else {
          //validateExternalEmail(false, false);
          return false;
        }
      } else {
        //invalid email
        //validateExternalEmail(false, true);
        return false;
      }
    } else {
      //reset to default
      //validateExternalEmail(null);
      return false;
    }
  };

  const handleSelectFolder = (e) => {
    setForm((prevState) => ({
      ...prevState,
      selectedFolder: e,
    }));
  };

  const handleNameChange = (e) => {
    e.persist();
    setForm((prevState) => ({
      ...prevState,
      name: e.target.value.trim(),
    }));
  };

  const handleNameFocus = () => {
    setFeedback((prevState) => ({
      ...prevState,
      name: "",
    }));
    setValid((prevState) => ({
      ...prevState,
      name: null,
    }));
  };

  const handleNameBlur = () => {
    _validateName();
  };

  const handleDeleteFileAttachements = () => {
    let removed_file_ids = [];
    if (item.primary_files && item.primary_files.length) {
      removed_file_ids = item.primary_files.filter((pf) => {
        return !uploadedFiles.some((f) => f.id === pf.id);
      });
    }
    if (removed_file_ids.length) {
      let payload = {
        topic_id: item.id,
        is_primary: 1,
        file_ids: removed_file_ids.map((f) => f.id),
      };
      dispatch(deleteWorkspaceFiles(payload));
    }
  };

  const handleUpdateWorkspaceIcon = (payload, file) => {
    let formData = new FormData();
    formData.append("files[0]", file);
    uploadFiles(
      {
        is_primary: 0,
        topic_id: payload.topic_id ? payload.topic_id : payload.id,
        files: formData,
      },
      (err, res) => {
        dispatch(
          updateWorkspace({
            ...payload,
            topic_id: payload.topic_id ? payload.topic_id : payload.id,
            file_id: res.data.files[0].id,
            workspace_id: payload.folder_id ? payload.folder_id : payload.workspace_id,
          })
        );
      }
    );
  };

  // const confirmExternalUsers = () => {
  //   const externalEmails = [...invitedEmails, ...form.selectedExternals.filter((u) => !u.has_accepted).map((u) => u.email)];
  //   if (externalEmails.length) {
  //     var answer = window.confirm(dictionary.externalUserConfirmation);
  //     if (answer) {
  //       handleConfirm();
  //     }
  //   } else {
  //     handleConfirm();
  //   }
  // };

  const handleConfirm = () => {
    if (loading) return;
    //if (Object.values(valid).filter((v) => !v).length) return;

    const selectedMembers = [...form.selectedUsers.filter((u) => typeof u.id === "number"), ...form.selectedExternals.filter((u) => typeof u.id === "number")];
    const member_ids = selectedMembers.map((u) => u.id);

    let payload = {
      name: form.name,
      description: form.description,
      is_external: 0,
      member_ids: member_ids,
      is_lock: form.is_private ? 1 : 0,
      workspace_id: form.selectedFolder && typeof form.selectedFolder.value === "number" && form.has_folder ? form.selectedFolder.value : 0,
      file_ids: inlineImages.map((i) => i.id),
    };

    //const externalEmails = [...invitedEmails, ...form.selectedExternals.filter((u) => !u.has_accepted).map((u) => u.email)];
    if (invitedEmails.length && form.has_externals) {
      if (mode === "edit") {
        payload = {
          ...payload,
          new_external_emails: invitedEmails,
          is_external: 1,
        };
      } else {
        payload = {
          ...payload,
          external_emails: invitedEmails,
          is_external: 1,
        };
      }
    }

    if (mode === "edit") {
      const activeMembers = item.members.filter((m) => m.active === 1);

      const removed_members = item.members.filter((m) => !member_ids.some((id) => m.id === id));

      const added_members = member_ids.filter((id) => !activeMembers.some((m) => m.id === id));

      const invitedIds = selectedMembers.filter((m) => !m.has_accepted).map((m) => m.id);

      payload = {
        ...payload,
        workspace_id: form.selectedFolder && form.has_folder ? form.selectedFolder.value : 0,
        topic_id: item.id,
        remove_member_ids: removed_members.map((m) => m.id),
        new_member_ids: added_members,
      };
      if (removed_members.filter((rm) => rm.has_accepted).length || payload.new_member_ids.filter((r) => !invitedIds.some((id) => id === r)).length || item.name !== form.name) {
        payload.system_message = `CHANNEL_UPDATE::${JSON.stringify({
          author: {
            id: user.id,
            name: user.name,
            first_name: user.first_name,
            partial_name: user.partial_name,
            profile_image_link: user.profile_image_thumbnail_link ? user.profile_image_thumbnail_link : user.profile_image_link,
          },
          title: form.name === item.name ? "" : form.name,
          added_members: added_members.filter((r) => !invitedIds.some((id) => id === r)),
          removed_members: removed_members.filter((rm) => rm.has_accepted).map((m) => m.id),
        })}`;
      }

      const handleSubmit = () => {
        setLoading(true);

        const cb = (err, res) => {
          toggle();
          if (err) return;

          if (form.icon) {
            handleUpdateWorkspaceIcon(payload, form.icon);
          }

          handleDeleteFileAttachements();

          if (attachedFiles.length) {
            let formData = new FormData();
            for (const i in attachedFiles) {
              formData.append("files[" + i + "]", attachedFiles[i].rawFile);
            }

            dispatch(
              setPendingUploadFilesToWorkspace({
                is_primary: 1,
                topic_id: res.data.id,
                files: formData,
              })
            );
          }
          if (form.selectedFolder && typeof form.selectedFolder.value === "number") {
            history.push(`/workspace/dashboard/${form.selectedFolder.value}/${replaceChar(form.selectedFolder.label)}/${res.data.id}/${replaceChar(form.name)}`);
          } else {
            history.push(`/workspace/dashboard/${res.data.id}/${replaceChar(form.name)}`);
          }
        };

        if (item.members.length === 1 && form.selectedUsers.length === 0 && item.is_lock === 1) {
          let archivePayload = {
            id: item.channel.id,
            is_archived: true,
            is_muted: false,
            is_pinned: false,
            is_shared: item.is_external,
          };
          dispatch(putChannel(archivePayload));
          toggle();
        } else {
          if (removed_members.some((id) => id === user.id)) {
            dispatch(leaveWorkspace({ workspace_id: item.id, channel_id: item.channel.id }));
          }
          dispatch(updateWorkspace(payload, cb));
        }
      };

      if ((item.is_lock !== payload.is_lock && payload.is_lock === 1) || form.has_externals) {
        const handleShowConfirmation = () => {
          let confirmModal = {
            type: "confirmation",
            headerText: form.has_externals && payload.is_lock === 1 ? `${dictionary.lockedWorkspace} / ${dictionary.externalWorkspace}` : form.has_externals ? dictionary.externalWorkspace : dictionary.lockedWorkspace,
            submitText: dictionary.confirm,
            cancelText: dictionary.cancel,
            bodyText: form.has_externals && payload.is_lock === 1 ? `${dictionary.externalUserConfirmation}<br/>${dictionary.lockedWorkspaceText}` : form.has_externals ? dictionary.externalUserConfirmation : dictionary.lockedWorkspaceText,
            actions: {
              onSubmit: handleSubmit,
            },
          };

          dispatch(addToModals(confirmModal));
        };
        handleShowConfirmation();
      } else {
        handleSubmit();
      }
    } else {
      const handleSubmit = () => {
        setLoading(true);
        dispatch(
          createWorkspace(payload, (err, res) => {
            toggle();
            if (err) {
              setLoading(false);
              toaster.warning(
                <span>
                  Workspace creation failed.
                  <br />
                  Please try again.
                </span>
              );
            }

            if (res) {
              //redirect url
              if (form.selectedFolder && typeof form.selectedFolder.value === "number") {
                history.push(`/workspace/dashboard/${form.selectedFolder.value}/${replaceChar(res.data.workspace.name)}/${res.data.id}/${replaceChar(res.data.topic.name)}`, {
                  folder_id: form.selectedFolder.value,
                  workspace_id: res.data.id,
                });
              } else {
                history.push(`/workspace/dashboard/${res.data.id}/${replaceChar(res.data.topic.name)}`, {
                  folder_id: null,
                  workspace_id: res.data.id,
                });
              }
              if (attachedFiles.length) {
                let formData = new FormData();
                for (const i in attachedFiles) {
                  formData.append("files[" + i + "]", attachedFiles[i].rawFile);
                }

                dispatch(
                  setPendingUploadFilesToWorkspace({
                    is_primary: 1,
                    topic_id: res.data.id,
                    files: formData,
                  })
                );
              }
              let newWorkspace = {
                id: res.data.id,
                name: res.data.topic.name,
                is_external: res.data.is_external,
                is_lock: res.data.is_lock,
                description: res.data.topic.description,
                unread_count: 0,
                type: "WORKSPACE",
                key_id: res.data.key_id,
                active: 1,
                unread_chats: 0,
                unread_posts: 0,
                folder_id: res.data.workspace ? res.data.workspace.id : null,
                folder_name: res.data.workspace ? res.data.workspace.name : null,
                member_ids: res.data.member_ids,
                members: res.data.members,
                channel: {
                  code: res.data.channel.code,
                  id: res.data.channel.id,
                  loaded: false,
                },
                team_channel: {
                  code: res.data.team_channel.code,
                  id: res.data.team_channel.id,
                  icon_link: res.data.team_channel.icon_link,
                },
                created_at: res.data.topic.created_at,
                updated_at: res.data.topic.created_at,
                is_shared: form.has_externals,
              };

              dispatch(setActiveTopic(newWorkspace));
              if (form.icon) {
                handleUpdateWorkspaceIcon(newWorkspace, form.icon);
              }

              if (form.selectedFolder !== null) {
                toaster.success(<span dangerouslySetInnerHTML={{ __html: dictionary.toasterWorkspaceIsCreated }} />);
              } else {
                toaster.success(
                  <span
                    dangerouslySetInnerHTML={{
                      __html: _t("TOASTER.WORKSPACE_UNDER_FOLDER_IS_CREATED", "::workspace_name:: workspace is created under ::folder_name:: directory", {
                        workspace_name: `<b>${form.name}</b>`,
                        folder_name: `<b>${form.selectedFolder.label}</b>`,
                      }),
                    }}
                  />
                );
              }
            }
          })
        );
      };

      if (payload.is_lock === 1 || form.has_externals) {
        const handleShowConfirmation = () => {
          let confirmModal = {
            type: "confirmation",
            headerText: form.has_externals && payload.is_lock === 1 ? `${dictionary.lockedWorkspace} / ${dictionary.externalWorkspace}` : form.has_externals ? dictionary.externalWorkspace : dictionary.lockedWorkspace,
            submitText: dictionary.confirm,
            cancelText: dictionary.cancel,
            bodyText: form.has_externals && payload.is_lock === 1 ? `${dictionary.externalUserConfirmation}<br/>${dictionary.lockedWorkspaceText}` : form.has_externals ? dictionary.externalUserConfirmation : dictionary.lockedWorkspaceText,
            actions: {
              onSubmit: handleSubmit,
            },
          };

          dispatch(addToModals(confirmModal));
        };
        handleShowConfirmation();
      } else {
        handleSubmit();
      }
    }
  };

  const handleAddMentionedUsers = (users) => {
    setForm({
      ...form,
      selectedUsers: [
        ...users.map((user) => {
          return {
            id: user.id,
            value: user.id,
            label: user.name,
            name: user.name,
            first_name: user.first_name,
            profile_image_link: user.profile_image_thumbnail_link ? user.profile_image_thumbnail_link : user.profile_image_link,
          };
        }),
        ...form.selectedUsers,
      ],
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
      let ignoreIds = [user.id, ...form.selectedUsers.map((u) => u.id), ...ignoredMentionedUserIds];
      let userIds = mention_ids.filter((id) => {
        return !ignoreIds.some((iid) => iid === id);
      });
      setMentionedUserIds(userIds.length ? userIds.map((id) => parseInt(id)) : []);
    } else {
      setIgnoredMentionedUserIds([]);
      setMentionedUserIds([]);
    }
  };

  const handleQuillChange = useCallback(
    (content, delta, source, editor) => {
      const textOnly = editor.getText(content);
      if (editor.getContents().ops && editor.getContents().ops.length) {
        handleMentionUser(
          editor
            .getContents()
            .ops.filter((m) => m.insert.mention)
            .map((i) => i.insert.mention.id)
        );
      }
      setForm((prevState) => ({
        ...prevState,
        description: content,
        textOnly: textOnly,
      }));

      if (textOnly.trim() === "") {
        setFeedback((prevState) => ({
          ...prevState,
          description: dictionary.feedbackWorkspaceDescriptionIsRequired,
        }));
        setValid((prevState) => ({
          ...prevState,
          description: false,
        }));
      } else {
        setValid((prevState) => ({
          ...prevState,
          description: true,
        }));
      }
    },
    [setForm, setFeedback, setValid, form.selectedUsers, mentionedUserIds, ignoredMentionedUserIds]
  );

  const handleOpenFileDialog = () => {
    if (refs.dropZone.current) {
      refs.dropZone.current.open();
    }
  };

  const handleHideDropzone = () => {
    setShowDropzone(false);
  };

  const handleShowDropzone = () => {
    setShowDropzone(true);
  };

  const handleHideIconDropzone = () => {
    setShowIconDropzone(false);
  };

  const handleShowIconDropzone = () => {
    setShowIconDropzone(true);
  };

  const dropAction = (acceptedFiles) => {
    let selectedFiles = [];
    acceptedFiles.forEach((file) => {
      let timestamp = Math.floor(Date.now());
      //let shortFileId = require("shortid").generate();
      if (file.type === "image/jpeg" || file.type === "image/png" || file.type === "image/gif" || file.type === "image/webp") {
        selectedFiles.push({
          rawFile: file,
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

  const handleUseWorkspaceIcon = useCallback((file, fileUrl) => {
    setForm((prevState) => ({
      ...prevState,
      icon: file,
      icon_link: fileUrl,
    }));
  }, []);

  const dropIconAction = useCallback(
    (uploadedFiles) => {
      if (uploadedFiles.length === 0) {
        toaster.error("File type not allowed. Please use an image file.");
      } else if (uploadedFiles.length > 1) {
        toaster.warning("Multiple files detected. First selected image will be used.");
      }

      let modal = {
        type: "file_crop_upload",
        imageFile: uploadedFiles[0],
        mode: "profile",
        handleSubmit: handleUseWorkspaceIcon,
      };

      dispatch(
        addToModals(modal, () => {
          handleHideIconDropzone();
        })
      );
    },
    [handleUseWorkspaceIcon, handleHideIconDropzone]
  );

  const handleRemoveFile = (fileId) => {
    setUploadedFiles((prevState) => prevState.filter((f) => f.id !== parseInt(fileId)));
    setAttachedFiles((prevState) => prevState.filter((f) => f.id !== parseInt(fileId)));
  };

  const handleShowArchiveConfirmation = () => {
    let payload = {
      type: "confirmation",
      headerText: dictionary.archiveWorkspace,
      submitText: dictionary.archive,
      cancelText: dictionary.cancel,
      bodyText: dictionary.archiveBodyText,
      actions: {
        onSubmit: handleArchive,
      },
    };

    if (item.active === 0) {
      payload = {
        ...payload,
        headerText: dictionary.unArchiveWorkspace,
        submitText: dictionary.unArchiveWorkspace,
        bodyText: dictionary.unArchiveBodyText,
      };
    }

    dispatch(addToModals(payload));
  };

  const handleArchive = useCallback(() => {
    let payload = {
      id: item.channel.id,
      is_archived: item.active === 1,
      is_muted: false,
      is_pinned: false,
      is_shared: item.is_external,
    };

    if (!payload.is_archived) {
      payload.push_unarchived = 1;
    }

    dispatch(putChannel(payload));
    toaster.success(
      <span>
        <b>{item.name}</b> workspace is
        {item.active === 1 ? <> unarchived</> : <> archived</>}
        {form.selectedFolder !== null && (
          <>
            {" "}
            <b>{form.selectedFolder.label}</b> under directory
          </>
        )}
        .
      </span>
    );
    toggle();
  }, []);

  useEffect(() => {
    let currentUser = null;
    if (Object.values(users).length) {
      currentUser = {
        ...users[user.id],
        value: user.id,
        label: user.name,
      };
    }
    if (mode === "edit") {
      let members = [];
      let externalMembers = [];
      let is_private = item.type !== undefined && item.type === "WORKSPACE" ? item.is_lock === 1 : item.private === 1;
      if (item.members.length) {
        members = item.members
          .filter((m) => m.active === 1 && m.type === "internal")
          .map((m) => {
            return {
              value: m.id,
              label: m.name,
              name: m.name,
              id: m.id,
              first_name: m.first_name === "" ? m.email : m.first_name,
              profile_image_link: m.profile_image_link,
              profile_image_thumbnail_link: m.profile_image_thumbnail_link ? m.profile_image_thumbnail_link : m.profile_image_link,
              has_accepted: m.has_accepted,
              email: m.email,
            };
          });
        externalMembers = item.members
          .filter((m) => m.type === "external")
          .map((m) => {
            return {
              value: m.id,
              label: m.name,
              name: m.name,
              id: m.id,
              first_name: m.first_name === "" ? m.email : m.first_name,
              profile_image_link: m.profile_image_link,
              profile_image_thumbnail_link: m.profile_image_thumbnail_link ? m.profile_image_thumbnail_link : m.profile_image_link,
              email: m.email,
              has_accepted: m.has_accepted,
            };
          });
      }
      setForm({
        ...form,
        has_folder: item !== null && item.type === "WORKSPACE" && item.folder_id !== null,
        selectedUsers: members,
        selectedFolder: item.folder_id
          ? {
              value: item.folder_id,
              label: item.folder_name,
            }
          : null,
        description: item.description,
        textOnly: item.description,
        name: item.name,
        is_private: is_private,
        has_externals: externalMembers.length > 0,
        selectedExternals: externalMembers,
      });
      setValid({
        name: true,
        folder: true,
        team: true,
      });
      if (item.hasOwnProperty("primary_files")) {
        setUploadedFiles(item.primary_files);
      }
    } else {
      setForm((prevState) => ({
        ...prevState,
        selectedUsers: currentUser ? [currentUser] : [],
        selectedFolder:
          item === null
            ? null
            : {
                value: item.id,
                label: item.name,
              },
        has_folder: item === null ? false : item.type === "FOLDER",
      }));

      setValid((prevState) => ({
        ...prevState,
        team: currentUser ? true : null,
        name: null,
      }));
    }
    return () => dispatch(getExternalUsers());
  }, []);

  useEffect(() => {
    let folderValid = true;
    if (form.has_folder && form.selectedFolder === null) {
      folderValid = false;
    }
    setValid((prevState) => ({
      ...prevState,
      has_folder: folderValid,
    }));

    _validateName();
  }, [form.has_folder, form.selectedFolder]);

  useEffect(() => {
    const internalUsers = Object.values(users).filter((u) => {
      return u.type === "internal" && u.active === 1;
    });
    const userOptions = internalUsers.map((u) => {
      return {
        ...u,
        value: u.id,
        label: u.name,
      };
    });
    setUserOptions(userOptions);
  }, [Object.values(users).length]);

  useEffect(() => {
    if (externalUsers.length) {
      const externalUserOptions = externalUsers.map((u) => {
        return {
          ...u,
          value: u.id,
          label: u.has_accepted ? `${u.email} | ${u.first_name} ${u.last_name} - ${u.external_company_name}` : `${u.email} `,
          dictionary: {
            peopleExternal: _t("PEOPLE.EXTERNAL", "External"),
            peopleInvited: _t("PEOPLE.INVITED", "Invited"),
          },
        };
      });
      setExternalUserOptions(externalUserOptions);
    }
  }, [externalUsers.length]);

  const onOpened = () => {
    if (refs.workspace_name && refs.workspace_name.current) {
      refs.workspace_name.current.focus();
    }
  };

  const handleInputChange = (e) => {
    setInputValue(e);
  };

  const handleExternalInputChange = (e) => {
    setExternalInput(e);
    const isExistingOption = externalUserOptions.some((o) => o.email === e);
    const isSelectedOption = form.selectedExternals.some((o) => o.email === e);
    if (!isExistingOption && !isSelectedOption && e !== "") {
      if (EmailRegex.test(e)) {
        const userExists = allUsers.some((uo) => uo.email === e);
        if (!userExists) {
          validateExternalEmail(true);
        } else {
          validateExternalEmail(false, false);
        }
      } else {
        //invalid email
        validateExternalEmail(false, true);
      }
    } else {
      //reset to default
      validateExternalEmail(null);
    }
  };

  const filterOptions = (candidate, input) => {
    if (input) {
      return candidate.label.toLowerCase().search(input.toLowerCase()) !== -1 || (candidate.data.email && candidate.data.email.toLowerCase().search(input.toLowerCase()) !== -1);
    }
    return true;
  };

  const handleWorkspaceIconClick = () => {
    refs.iconDropZone.current.open();
  };

  return (
    <Modal innerRef={refs.container} isOpen={modal} toggle={toggle} centered size="lg" onOpened={onOpened}>
      <ModalHeaderSection toggle={toggle}>{mode === "edit" ? dictionary.updateWorkspace : dictionary.createWorkspace}</ModalHeaderSection>
      <ModalBody onDragOver={handleShowDropzone}>
        <DropDocument
          hide={!showDropzone}
          ref={refs.dropZone}
          onDragLeave={handleHideDropzone}
          onDrop={({ acceptedFiles }) => {
            dropAction(acceptedFiles);
          }}
          onCancel={handleHideDropzone}
          attachedFiles={attachedFiles}
        />
        <WrapperDiv className={"modal-input mt-0"}>
          <div>
            <Label className={"modal-info pb-3 pt-3"}>{dictionary.workspaceInfo}</Label>
            <div className="d-flex justify-content-start align-items-center">
              <div className="icon-wrapper" onClick={handleWorkspaceIconClick}>
                <DropDocument
                  acceptType="imageOnly"
                  hide={!showIconDropzone}
                  ref={refs.iconDropZone}
                  onDragLeave={handleHideIconDropzone}
                  onDrop={({ acceptedFiles }) => {
                    dropIconAction(acceptedFiles);
                  }}
                  onCancel={handleHideIconDropzone}
                />
                {<Avatar imageLink={form.icon_link} name={form.name} noDefaultClick={true} forceThumbnail={false} />}
                <span className="btn btn-outline-light btn-sm">
                  <SvgIconFeather icon="pencil" />
                </span>
              </div>
              <div className="name-wrapper">
                <Label className={"modal-label"} for="chat">
                  {dictionary.workspaceName}
                </Label>
                <Input
                  name="name"
                  defaultValue={mode === "edit" ? item.name : ""}
                  onFocus={handleNameFocus}
                  onChange={handleNameChange}
                  onBlur={handleNameBlur}
                  valid={valid.name}
                  invalid={valid.name !== null && !valid.name}
                  innerRef={refs.workspace_name}
                />
                <InputFeedback valid={valid.name}>{feedback.name}</InputFeedback>
              </div>
            </div>
          </div>
        </WrapperDiv>
        <WrapperDiv className={"modal-input checkboxes"}>
          <div>
            <CheckBox type="success" name="has_folder" checked={form.has_folder} onClick={toggleCheck}>
              {dictionary.addToFolder}
            </CheckBox>
          </div>
          <div>
            <CheckBox type="success" name="has_externals" checked={form.has_externals} onClick={toggleCheck}>
              {dictionary.workspaceWithExternals}
            </CheckBox>
          </div>
          <div style={{ position: "relative" }}>
            <ToolTip
              content={
                <div>
                  {dictionary.workspaceWithExternalsInfo1}
                  <br />
                  {dictionary.workspaceWithExternalsInfo2}
                </div>
              }
            >
              <SvgIconFeather icon="alert-circle" width="16" height="16" />
            </ToolTip>
          </div>
        </WrapperDiv>
        {form.has_folder === true && (
          <WrapperDiv className={"modal-input"}>
            <Label for="people">{dictionary.folder}</Label>
            <SelectFolder options={folderOptions} value={form.selectedFolder} onChange={handleSelectFolder} isMulti={false} isClearable={true} />
            <InputFeedback valid={valid.has_folder}>{feedback.has_folder}</InputFeedback>
          </WrapperDiv>
        )}
        <WrapperDiv className={"modal-input"}>
          <Label for="people">{dictionary.team}</Label>
          <SelectPeople valid={valid.team} options={userOptions} value={form.selectedUsers} inputValue={inputValue} onChange={handleSelectUser} onInputChange={handleInputChange} filterOption={filterOptions} isSearchable />
          <InputFeedback valid={valid.user}>{feedback.user}</InputFeedback>
        </WrapperDiv>
        {form.has_externals === true && (
          <WrapperDiv className={"modal-input external-select"} valid={valid.external}>
            <Label for="people">{dictionary.externalGuest}</Label>
            <InputFeedback valid={valid.external}>{feedback.external}</InputFeedback>
            <SelectPeople
              creatable={true}
              //valid={valid.team}
              options={externalUserOptions}
              value={form.selectedExternals}
              inputValue={externalInput}
              isValidNewOption={handleExternalValidation}
              onCreateOption={handleCreateOption}
              onChange={handleSelectExternalUser}
              onInputChange={handleExternalInputChange}
              filterOption={filterOptions}
              formatCreateLabel={formatCreateLabel}
              isSearchable
              classNamePrefix="react-select"
              onMenuClose={handleMenuClose}
            />
          </WrapperDiv>
        )}
        <StyledDescriptionInput
          className="modal-description"
          height={window.innerHeight - 660}
          required
          showFileButton={true}
          onChange={handleQuillChange}
          onOpenFileDialog={handleOpenFileDialog}
          defaultValue={mode === "edit" && item ? item.description : ""}
          mode={mode}
          valid={valid.description}
          feedback={feedback.description}
          //disableMention={mode !== "edit"}
          disableBodyMention={true}
          modal={"workspace"}
          mentionedUserIds={mentionedUserIds}
          onAddUsers={handleAddMentionedUsers}
          onDoNothing={handleIgnoreMentionedUsers}
          setInlineImages={setInlineImages}
        />
        {(attachedFiles.length > 0 || uploadedFiles.length > 0) && (
          <WrapperDiv className="file-attachment-wrapper">
            <FileAttachments attachedFiles={[...attachedFiles, ...uploadedFiles]} handleRemoveFile={handleRemoveFile} />
          </WrapperDiv>
        )}
        <WrapperDiv className="action-wrapper">
          <Label />
          <CheckBox name="is_private" checked={form.is_private} onClick={toggleCheck}>
            {dictionary.lockWorkspace}
          </CheckBox>
          <div className={"lock-workspace-text-container pb-3"}>
            <Label className={"lock-workspace-text"}>{dictionary.lockWorkspaceText}</Label>
          </div>
          <button className="btn btn-primary" onClick={handleConfirm} disabled={form.name.trim() === "" || form.textOnly.trim() === "" || form.selectedUsers.length === 0}>
            {loading && <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true" />}
            {mode === "edit" ? dictionary.updateWorkspace : dictionary.createWorkspace}
          </button>
          {mode === "edit" && (
            <div className="action-archive-wrapper">
              {item.active === 1 ? (
                <span onClick={handleShowArchiveConfirmation} className="btn-archive text-link mt-2 cursor-pointer">
                  {dictionary.archiveThisWorkspace}
                </span>
              ) : (
                <span onClick={handleShowArchiveConfirmation} className="btn-archive text-link mt-2 cursor-pointer">
                  {dictionary.unArchiveThisWorkspace}
                </span>
              )}
            </div>
          )}
        </WrapperDiv>
      </ModalBody>
    </Modal>
  );
};

export default React.memo(CreateEditWorkspaceModal);
