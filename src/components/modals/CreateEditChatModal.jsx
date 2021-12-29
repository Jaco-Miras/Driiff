import lodash from "lodash";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { InputGroup, Label, Modal, ModalBody } from "reactstrap";
import styled from "styled-components";
import { addToChannels, setSelectedChannel } from "../../redux/actions/chatActions";
import { addToModals, clearModal } from "../../redux/actions/globalActions";
import { FormInput, PeopleSelect } from "../forms";
import QuillEditor from "../forms/QuillEditor";
import { useChannelActions, useFileActions, useQuillModules, useTimeFormat, useToaster, useTranslationActions } from "../hooks";
import { ModalHeaderSection } from "./index";
import { DropDocument } from "../dropzone/DropDocument";
import { Avatar, SvgIconFeather } from "../common";

const WrapperDiv = styled(InputGroup)`
  display: flex;
  align-items: center;
  margin: 20px 0;
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
  .form-group {
    margin-bottom: 0;
  }
  label {
    margin: 0 20px 0 0;
    min-width: 530px;
  }
  button {
    margin-left: auto;
  }
  .react-select__multi-value__label {
    align-self: center;
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
`;

const SelectPeople = styled(PeopleSelect)`
  flex: 1 0 0;
  width: 1%;
  min-width: 550px;
  .react-select__control--menu-is-open {
    box-shadow: none;
  }
  .react-select__option {
    background-color: #ffffff;
  }
  .react-select__menu-list--is-multi > div {
    &:hover {
      //background: #8c3b9b;
      color: #ffffff;
      cursor: pointer;
      .react-select__option {
        //background: #8c3b9b;
        cursor: pointer;
      }
    }
  }
  .react-select__control--is-focused {
    box-shadow: none;
  }
  @media all and (max-width: 480px) {
    width: 100%;
  }
`;

const StyledQuillEditor = styled(QuillEditor)`
  flex: 1 0 0;
  width: 1%;
  &.group-chat-input {
    border: 1px solid #afb8bd;
    border-radius: 5px;
    max-height: 130px;
    overflow: auto;
    overflow-x: hidden;
    position: static;
    width: 100%;
  }
  .ql-toolbar {
    display: none;
  }
  .ql-container {
    border: none;
  }
  .ql-editor {
    padding: 5px;
  }
  @media all and (max-width: 480px) {
    width: 100%;
  }
`;

const CreateEditChatModal = (props) => {
  /**
   * @todo refactor
   */
  const { type, mode } = props.data;

  const inputRef = useRef();
  const reactQuillRef = useRef();
  const dispatch = useDispatch();
  const history = useHistory();
  const { _t } = useTranslationActions();
  const toaster = useToaster();
  const { searchExisting, create: createChannel, update: updateChannel } = useChannelActions();
  const { localizeDate } = useTimeFormat();

  const users = useSelector((state) => state.users.users);
  const channel = useSelector((state) => state.chat.selectedChannel);
  const user = useSelector((state) => state.session.user);
  const recipients = useSelector((state) => state.global.recipients);

  const [modal, setModal] = useState(true);
  const [text, setText] = useState("");
  const [textOnly, setTextOnly] = useState("");
  const [chatExists, setChatExists] = useState(false);
  const [searching, setSearching] = useState(false);
  const [loading, setLoading] = useState(false);
  const [noChanges, setNoChanges] = useState(false);
  const [showIconDropzone, setShowIconDropzone] = useState(false);

  const toggle = () => {
    setModal(!modal);
    dispatch(clearModal({ type: type }));
  };

  const dictionary = {
    chatTitle: _t("MODAL.CHAT_TITLE", "Title"),
    people: _t("MODAL.PEOPLE", "People"),
    firstMessage: _t("MODAL.FIRST_MESSAGE", "First message"),
    newGroupChat: _t("MODAL.NEW_GROUP_CHAT", "New group chat"),
    editChat: _t("MODAL.EDIT_CHAT", "Edit chat"),
    createChat: _t("MODAL.CREATE_CHAT", "Create chat"),
    chatInfo: _t("FOLDER_INFO", "Create a group chat to quickly discuss any subject with multiple people. A group chat can hold an unlimited amount of members."),
    chatInfoEdit: _t("FOLDER_INFO_EDIT", "Edit the chat's title and members. A group chat can hold an unlimited amount of members."),
    feedbackChatTitleIsRequired: _t("FEEDBACK.CHAT_TITLE_IS_REQUIRED", "Chat title is required."),
    feedbackChatTitleIsUnique: _t("FEEDBACK.CHAT_TITLE_IS_UNIQUE", "Chat title is already taken."),
    feedbackChatMemberIsRequired: _t("FEEDBACK.CHAT_MEMBER_IS_REQUIRED", "You must assign atleast a member on this chat."),
  };

  const options = Object.values(users)
    .filter((u) => u.type === "internal")
    .map((u) => {
      return {
        ...u,
        value: u.id,
        label: u.name,
      };
    });

  const defaultUser = options.filter((o) => o.value === user.id);

  const [form, setForm] = useState({
    icon: {
      file: null,
      file_id: null,
      value: mode === "edit" ? channel.icon_link : null,
    },
    title: {
      value: mode === "edit" ? channel.title : "",
    },
    selectedUsers: {
      value:
        mode === "edit"
          ? channel.members.map((m) => {
              const user = users[m.id];
              return {
                ...m,
                value: m.id,
                label: m.name,
                middle_name: user ? user.middle_name : "",
                last_name: user ? user.last_name : "",
              };
            })
          : defaultUser,
    },
  });

  const handleSelect = (e) => {
    if (e === null) {
      setForm((prevState) => ({
        ...prevState,
        selectedUsers: {
          value: defaultUser,
        },
      }));
    } else {
      setForm((prevState) => ({
        ...prevState,
        selectedUsers: {
          value: e,
        },
      }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prevState) => ({
      ...prevState,
      [name]: {
        value: value,
      },
    }));
  };

  const handleConfirm = () => {
    if (form.icon.file && !form.icon.file_id) {
      handleUpdateGroupIcon(form.icon.file);
      return;
    }

    if (loading) return;

    setLoading(true);

    if (mode === "edit") {
      const removed_members = channel.members
        .filter((m) => {
          return !form.selectedUsers.value.some((u) => u.id === m.id);
        })
        .map((m) => m.id);

      const added_members = form.selectedUsers.value
        .filter((u) => {
          return !channel.members.some((m) => m.id === u.id);
        })
        .map((m) => m.id);

      let payload = {
        id: channel.id,
        ...(form.icon.file_id && { file_id: form.icon.file_id }),
        channel_id: channel.id,
        channel_name: form.title.value,
        remove_member_ids: removed_members,
        add_member_ids: added_members,
        message_body: `CHANNEL_UPDATE::${JSON.stringify({
          author: {
            id: user.id,
            name: user.name,
            first_name: user.first_name,
            partial_name: user.partial_name,
            profile_image_link: user.profile_image_thumbnail_link ? user.profile_image_thumbnail_link : user.profile_image_link,
          },
          title: channel.title === form.title.value ? "" : form.title.value,
          added_members: added_members,
          removed_members: removed_members,
        })}`,
      };

      channel.members = form.selectedUsers.value;
      channel.title = form.title.value;

      updateChannel(payload, () => {
        setLoading(false);
      });
    } else {
      let placeholderId = require("shortid").generate();
      let timestamp = Math.round(+new Date() / 1000);

      let message = {
        id: placeholderId,
        body: text,
        code: placeholderId,
        editable: 0,
        unfurls: [],
        quote: null,
        files: [],
        mention_html: null,
        reactions: [],
        is_deleted: false,
        is_completed: true,
        is_transferred: false,
        is_read: true,
        channel_id: placeholderId,
        g_date: localizeDate(timestamp),
        created_at: {
          timestamp: timestamp,
        },
        updated_at: {
          timestamp: timestamp,
        },
        user: user,
      };

      let channel = {
        id: placeholderId,
        entity_id: 0,
        type: "GROUP",
        title: form.title.value,
        code: placeholderId,
        is_archived: false,
        is_pinned: false,
        is_hidden: false,
        is_muted: false,
        total_unread: 0,
        profile: null,
        selected: true,
        inviter: null,
        hasMore: false,
        skip: 0,
        isFetching: false,
        members: [...form.selectedUsers.value, user],
        replies: [message],
        created_at: {
          timestamp: timestamp,
        },
        updated_at: {
          timestamp: timestamp,
        },
        last_reply: {
          id: null,
          body: text,
          user: user,
          created_at: {
            timestamp: timestamp,
          },
        },
        reference_id: placeholderId,
      };

      let recipient_ids = recipients
        .filter((r) => r.type === "USER")
        .filter((r) => {
          let userFound = false;
          form.selectedUsers.value.forEach((u) => {
            if (u.id === r.type_id) {
              userFound = true;
            }
          });
          return userFound;
        })
        .map((r) => r.id);

      let payload = {
        recipient_ids: recipient_ids,
        title: form.title.value,
      };
      if (textOnly.trim().length !== 0) {
        payload = {
          ...payload,
          message_body: text,
        };
      }

      let old_channel = channel;
      const createCallback = (err, res) => {
        setLoading(false);

        if (err) return;
        let payload = {
          ...channel,
          id: res.data.channel.id,
          old_id: old_channel.id,
          ...(form.icon.file_id && { file_id: form.icon.file_id }),
          code: res.data.code,
          members: res.data.channel.members ? res.data.channel.members : channel.members,
          profile: res.data.channel.profile,
          type: "GROUP",
          last_reply: res.data.channel.last_reply,
          replies:
            textOnly.trim().length !== 0
              ? [
                  {
                    ...message,
                    id: res.data.last_reply.id,
                    channel_id: res.data.channel.id,
                    created_at: {
                      timestamp: message.created_at.timestamp,
                    },
                    updated_at: {
                      timestamp: message.created_at.timestamp,
                    },
                  },
                ]
              : [],
          selected: true,
          search: res.data.search,
        };
        dispatch(addToChannels(payload));
        dispatch(setSelectedChannel(payload));
        history.push(`/chat/${res.data.code}`);
      };
      createChannel(payload, createCallback);
    }

    toggle();
  };

  const handleQuillChange = (content, delta, source, editor) => {
    const textOnly = editor.getText(content);

    setText(content);
    setTextOnly(textOnly);
  };

  const handleSearchExistingChat = lodash.debounce(() => {
    let recipient_ids = recipients
      .filter((r) => r.type === "USER")
      .filter((r) => {
        let userFound = false;
        form.selectedUsers.value.forEach((u) => {
          if (u.id === r.type_id) {
            userFound = true;
          }
        });
        return userFound;
      })
      .map((r) => r.id);

    if (mode === "edit") {
      if (form.title.value === channel.title && JSON.stringify(channel.members.map((m) => m.id).sort()) === JSON.stringify(form.selectedUsers.value.map((v) => v.id).sort())) {
        //no changes in title and members
        let newForm = { ...form };
        newForm.selectedUsers.valid = true;
        newForm.selectedUsers.feedback = null;
        setChatExists(false);
        setForm(newForm);
        setNoChanges(true);
      } else {
        if (recipient_ids.length) {
          setSearching(true);
          const callback = (err, res) => {
            setSearching(false);
            if (err) {
              return;
            }
            if (res.data.channel_id) {
              setChatExists(true);
            } else {
              setChatExists(false);
            }
          };
          searchExisting(form.title.value, recipient_ids, callback);
          setNoChanges(false);
        }
      }
    } else {
      if (recipient_ids.length) {
        setSearching(true);
        const callback = (err, res) => {
          setSearching(false);
          if (err) {
            return;
          }
          if (res.data.channel_id) {
            setChatExists(true);
          } else {
            setChatExists(false);
          }
        };
        searchExisting(form.title.value, recipient_ids, callback);
      }
    }
  }, 300);

  const { modules } = useQuillModules({ mode: "group_chat" });

  // useEffect(() => {
  //   if (mode === "edit") {

  //     setForm(prevState => ({
  //       ...prevState,
  //       selectedUsers: {
  //         value: channel.members.map((m) => {
  //           return {
  //             ...m,
  //             value: m.id,
  //             label: m.first_name,
  //           };
  //         })
  //       },
  //       title: {
  //         value: channel.title
  //       }
  //     }))
  //   }

  //   //eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  useEffect(() => {
    if (form.selectedUsers.value.length) {
      handleSearchExistingChat();
    }
  }, [form.title.value, form.selectedUsers.value.length]);

  useEffect(() => {
    if (!searching) {
      let newForm = { ...form };
      if (newForm.title.value === "") {
        newForm.title.valid = false;
        newForm.title.feedback = dictionary.feedbackChatTitleIsRequired;
      } else if (chatExists === true) {
        newForm.title.valid = false;
        newForm.title.feedback = dictionary.feedbackChatTitleIsUnique;
      } else {
        newForm.title.valid = true;
        newForm.title.feedback = null;
      }

      if (newForm.selectedUsers.value.length === 0) {
        newForm.selectedUsers.valid = false;
        newForm.selectedUsers.feedback = dictionary.feedbackChatMemberIsRequired;
      } else {
        newForm.selectedUsers.valid = true;
        newForm.selectedUsers.feedback = null;
      }

      setForm(newForm);
    }
  }, [form.title.value, form.selectedUsers.value, chatExists, searching]);

  const onOpened = () => {
    if (inputRef && inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleHideIconDropzone = () => {
    setShowIconDropzone(false);
  };

  const handleUseGroupIcon = (file, fileUrl) => {
    setForm((prevState) => ({
      ...prevState,
      icon: {
        ...prevState.icon,
        file: file,
        value: fileUrl,
      },
    }));
  };

  const dropIconAction = (uploadedFiles) => {
    if (uploadedFiles.length === 0) {
      toaster.error("File type not allowed. Please use an image file.");
    } else if (uploadedFiles.length > 1) {
      toaster.warning("Multiple files detected. First selected image will be used.");
    }

    let modal = {
      type: "file_crop_upload",
      imageFile: uploadedFiles[0],
      mode: "profile",
      handleSubmit: handleUseGroupIcon,
    };

    dispatch(
      addToModals(modal, () => {
        handleHideIconDropzone();
      })
    );
  };

  const refs = {
    iconDropZone: useRef(null),
  };

  const { uploadCompanyFiles } = useFileActions();

  const handleUpdateGroupIcon = (file) => {
    uploadCompanyFiles(
      {
        file: file,
      },
      (err, res) => {
        setForm((prevState) => ({
          ...prevState,
          icon: {
            ...prevState.icon,
            file_id: res.data.id,
          },
        }));
      }
    );
  };

  const handleGroupIconClick = () => {
    refs.iconDropZone.current.open();
  };

  useEffect(() => {
    if (form.icon.file) {
      setNoChanges(false);
    }
  }, [form.icon.file]);

  useEffect(() => {
    if (form.icon.file_id) {
      handleConfirm();
    }
  }, [form.icon.file_id]);

  return (
    <Modal isOpen={modal} toggle={toggle} size={"lg"} onOpened={onOpened} centered>
      <ModalHeaderSection toggle={toggle}>{mode === "edit" ? dictionary.editChat : dictionary.newGroupChat}</ModalHeaderSection>
      <ModalBody>
        <WrapperDiv>
          <div>
            <Label className={"modal-info mb-3"}>{mode === "edit" ? dictionary.chatInfoEdit : dictionary.chatInfo}</Label>
            <div className="d-flex justify-content-start align-items-center">
              <div className="icon-wrapper" onClick={handleGroupIconClick}>
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
                {<Avatar imageLink={form.icon.value} name={form.title.value} noDefaultClick={true} forceThumbnail={false} />}
                <span className="btn btn-outline-light btn-sm">
                  <SvgIconFeather icon="pencil" />
                </span>
              </div>
              <div className="name-wrapper">
                <Label className={"modal-label"} for="chat">
                  {dictionary.chatTitle}
                </Label>
                <FormInput name="title" style={{ borderRadius: "5px" }} defaultValue={form.title.value} onChange={handleInputChange} innerRef={inputRef} isValid={form.title.valid} feedback={form.title.feedback} />
              </div>
            </div>
          </div>
        </WrapperDiv>
        <WrapperDiv>
          <div>
            <Label className={"modal-label"} for="people">
              {dictionary.people}
            </Label>
            <SelectPeople options={options} value={form.selectedUsers.value} onChange={handleSelect} />
          </div>
        </WrapperDiv>
        {mode === "new" && (
          <WrapperDiv>
            <div>
              <Label className={"modal-label"} for="firstMessage">
                {dictionary.firstMessage}
              </Label>
              <StyledQuillEditor className="group-chat-input" modules={modules} ref={reactQuillRef} onChange={handleQuillChange} />
            </div>
          </WrapperDiv>
        )}
        <WrapperDiv>
          <button
            className="btn btn-primary"
            disabled={
              searching ||
              Object.keys(form)
                .map((k) => form[k].valid)
                .some((v) => v === false) ||
              (mode === "edit" && noChanges)
            }
            onClick={handleConfirm}
          >
            {loading && <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true" />}
            {mode === "edit" ? dictionary.editChat : dictionary.createChat}
          </button>
        </WrapperDiv>
      </ModalBody>
    </Modal>
  );
};

export default CreateEditChatModal;
