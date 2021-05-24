import React, { useEffect, useRef, useState } from "react";
import DateTimePicker from "react-datetime-picker";
import { useDispatch, useSelector } from "react-redux";
import { Button, InputGroup, Modal, ModalBody, ModalFooter } from "reactstrap";
import styled from "styled-components";
import { clearModal } from "../../redux/actions/globalActions";
import RadioInput from "../forms/RadioInput";
import { useSettings, useTranslation } from "../hooks";
import { ModalHeaderSection } from "./index";
import quillHelper from "../../helpers/quillHelper";
import { FormInput, InputFeedback, QuillEditor, FolderSelect, PeopleSelect } from "../forms";
import moment from "moment";
import MessageFiles from "../list/chat/Files/MessageFiles";
import { FileAttachments } from "../common";

const Wrapper = styled(Modal)`
  .invalid-feedback {
    display: block;
  }
`;

const InputContainer = styled.div`
  display: flex;
  width: 100%;
  flex-flow: column;
  > div {
    margin-bottom: 10px;
  }
`;

const StyledQuillEditor = styled(QuillEditor)`
  width: 100%;
  height: 150px;
  border-radius: 6px;
  border: 1px solid #e1e1e1;
  margin-bottom: 1rem;

  &.description-input {
    overflow: auto;
    overflow-x: hidden;
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
  }
  .ql-container {
    border: none;
  }
  .ql-editor {
    padding: 5px;
  }
`;

const StyleInputFeedback = styled(InputFeedback)`
  display: block;
`;

const WorkspacesContainer = styled.div`
  z-index: 3;
`;

const SelectedUserContainer = styled.div`
  z-index: 2;
`;

const RadioInputContainer = styled.div`
  z-index: 1;
`;

const TodoReminderModal = (props) => {
  /**
   * @todo refactor
   */
  const { type, item, parentItem = null, itemType = null, actions, params, mode = "create" } = props.data;

  const {
    generalSettings: { date_picker_format: date_format, time_picker_format: time_format, language },
  } = useSettings();

  const { _t } = useTranslation();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.session.user);
  const users = useSelector((state) => state.users.users);
  const workspaces = useSelector((state) => state.workspaces.workspaces);
  const workspacesLoaded = useSelector((state) => state.workspaces.workspacesLoaded);
  const [componentUpdate, setComponentUpdate] = useState(0);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: {
      value: itemType === "POST" ? item.title : parentItem ? parentItem.title : "",
    },
    description: {
      value: item && item.body ? item.body : "",
    },
    set_time: {
      value: "1h",
    },
    topic_id: {
      value: null,
    },
    assigned_to: {
      value: null,
    },
  });

  const minDate = item && item.remind_at && Math.round(+new Date() / 1000) > item.remind_at.timestamp ? moment.unix(item.remind_at.timestamp).toDate() : moment().add(1, "m").toDate();
  const [timeValue, setTimeValue] = useState(item && item.remind_at ? "pick_data" : "");
  const [customTimeValue, setCustomTimeValue] = useState(item && item.remind_at ? moment.unix(item.remind_at.timestamp).toDate() : moment().add(20, "m").toDate());
  const [showDateTimePicker, setShowDateTimePicker] = useState(item && item.remind_at ? true : null);
  const [modal, setModal] = useState(true);
  const [initFocused, setInitFocused] = useState(false);

  const [workspaceOptions, setWorkspaceOptions] = useState([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState(null);
  const [userOptions, setUserOptions] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userInputValue, setUserInputValue] = useState("");
  const [mounted, setMounted] = useState(false);

  const setAllUsersOptions = () => {
    setUserOptions(
      Object.values(users).map((u) => {
        return {
          ...u,
          icon: "user-avatar",
          value: u.id,
          label: u.name ? u.name : u.email,
          type: "USER",
        };
      })
    );
  };

  useEffect(() => {
    if (workspacesLoaded && mounted) {
      /**
       * params sent to reminder modal, if params is existing then the modal is triggered in workspace
       * if params is undefined, reminder modal is triggered in the main sidebar or on the main reminder page
       * **/
      if (!itemType && params && workspaces[params.workspaceId]) {
        const ws = { ...workspaces[params.workspaceId] };
        console.log("set default workspace");
        // set default selected workspace and set the user options using the workspace members
        setSelectedWorkspace({
          ...ws,
          icon: "compass",
          value: ws.id,
          label: ws.name,
        });
        setForm({
          ...form,
          topic_id: { value: ws.id },
        });
        setUserOptions(
          ws.members.map((u) => {
            return {
              ...u,
              icon: "user-avatar",
              value: u.id,
              label: u.name ? u.name : u.email,
              type: "USER",
            };
          })
        );
      }
      if (itemType && parentItem && itemType === "CHAT" && parentItem.type === "TOPIC" && workspaces[parentItem.entity_id]) {
        const ws = { ...workspaces[parentItem.entity_id] };
        setSelectedWorkspace({
          ...ws,
          icon: "compass",
          value: ws.id,
          label: ws.name,
        });
        setForm({
          ...form,
          topic_id: { value: ws.id },
        });
        setUserOptions(
          ws.members.map((u) => {
            return {
              ...u,
              icon: "user-avatar",
              value: u.id,
              label: u.name ? u.name : u.email,
              type: "USER",
            };
          })
        );
      }

      if (itemType && itemType === "POST") {
        const workspaceRecipient = item.recipients.find((r) => r.type === "TOPIC");
        if (workspaceRecipient) {
          const ws = { ...workspaces[workspaceRecipient.id] };
          setSelectedWorkspace({
            ...ws,
            icon: "compass",
            value: ws.id,
            label: ws.name,
          });
          setForm({
            ...form,
            topic_id: { value: ws.id },
          });
          setUserOptions(
            ws.members.map((u) => {
              return {
                ...u,
                icon: "user-avatar",
                value: u.id,
                label: u.name ? u.name : u.email,
                type: "USER",
              };
            })
          );
        }
      }

      if (itemType && itemType === "POST_COMMENT" && parentItem) {
        const workspaceRecipient = parentItem.recipients.find((r) => r.type === "TOPIC");
        if (workspaceRecipient) {
          const ws = { ...workspaces[workspaceRecipient.id] };
          setSelectedWorkspace({
            ...ws,
            icon: "compass",
            value: ws.id,
            label: ws.name,
          });
          setForm({
            ...form,
            topic_id: { value: ws.id },
          });
          setUserOptions(
            ws.members.map((u) => {
              return {
                ...u,
                icon: "user-avatar",
                value: u.id,
                label: u.name ? u.name : u.email,
                type: "USER",
              };
            })
          );
        }
      }

      setWorkspaceOptions(
        Object.values(workspaces).map((ws) => {
          return {
            ...ws,
            icon: "compass",
            value: ws.id,
            label: ws.name,
          };
        })
      );
    }
  }, [mounted, workspacesLoaded, params]);

  useEffect(() => {
    if (mode === "edit" && item && item.workspace && workspaces[item.workspace.id]) {
      const ws = { ...workspaces[item.workspace.id] };
      setSelectedWorkspace({
        ...ws,
        icon: "compass",
        value: ws.id,
        label: ws.name,
      });
      setUserOptions(
        ws.members.map((u) => {
          return {
            ...u,
            icon: "user-avatar",
            value: u.id,
            label: u.name ? u.name : u.email,
            type: "USER",
          };
        })
      );
      setForm({
        ...form,
        topic_id: { value: ws.id },
        assigned_to: { value: item.assigned_to.id },
      });
      setSelectedUser({
        ...item.assigned_to,
        icon: "user-avatar",
        value: item.assigned_to.id,
        label: item.assigned_to.name ? item.assigned_to.name : item.assigned_to.email,
        type: "USER",
      });
    } else {
      setAllUsersOptions();
    }
    setMounted(true);
  }, []);

  const refs = {
    title: useRef(null),
  };

  let dictionary = {
    author: _t("REMINDER.AUTHOR", "Author"),
    title: _t("REMINDER.TITLE", "Title"),
    description: _t("REMINDER.DESCRIPTION", "Description"),
    remindMeOn: _t("REMINDER.REMIND_ME_ON", "Remind me in"),
    message: _t("REMINDER.MESSAGE", "Message"),
    oneHour: _t("REMINDER.ONE_HOUR", "1 hour"),
    threeHours: _t("REMINDER.THREE_HOURS", "3 hours"),
    tomorrow: _t("REMINDER.TOMORROW", "Tomorrow"),
    pickDateTime: _t("REMINDER.PICK_DATE_TIME", "Pick date and time"),
    //snooze: _t("REMINDER.SNOOZE", "Remind me"),
    cancel: _t("REMINDER.CANCEL", "Cancel"),
    feedbackReminderDateFuture: _t("FEEDBACK.REMINDER_DATE_MUST_BE_FUTURE", "Reminder date must be in the future."),
    feedbackReminderDateOverdue: _t("FEEDBACK.REMINDER_DATE_OVERDUE", "Note: Reminder date is overdue."),
    reminderInfo: _t("REMINDER.INFO", "Reminders help to organize your thoughts and guide you through your day."),
    snooze: _t("REMINDER.REMIND", "Remind"),
  };

  if (itemType === null) {
    dictionary.chatReminder = _t("REMINDER.SET_A_REMINDER", "New reminder");
  } else {
    dictionary.chatReminder = _t("REMINDER.SET_A_REMINDER_FOR_THIS_TYPE", "Set a reminder for this ::type::", {
      type: itemType.toLowerCase().replace("_", " "),
    });
  }

  const toggle = () => {
    setModal(!modal);
    dispatch(clearModal({ type: type }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.currentTarget;
    setForm((prevState) => ({
      ...prevState,
      [name]: {
        ...prevState[name],
        value: value,
      },
    }));
  };

  const handleQuillChange = (content, delta, source, editor) => {
    const textOnly = editor.getText(content);
    if (textOnly.trim() !== "") {
      setForm((prevState) => ({
        ...prevState,
        description: {
          ...prevState.description,
          value: content,
        },
      }));
    }
  };

  const handleSetReminder = (e, setTime) => {
    setShowDateTimePicker(false);
    if (timeValue === setTime) {
      setTimeValue("");
    } else {
      setTimeValue(setTime);
    }
  };

  const handlePickDateTime = (e) => {
    setCustomTimeValue(e);
  };

  const handleSelectPickDateTime = () => {
    setTimeValue("pick_data");
    setShowDateTimePicker(true);
  };

  const isFormValid = () => {
    let newForm = { ...form };

    if (form.title.value.trim() === "") {
      newForm.title.valid = false;
      newForm.title.feedback = "Title is required.";
    } else {
      newForm.title.value = form.title.value.trim();
      newForm.title.valid = true;
      newForm.title.feedback = null;
    }

    if (timeValue === "pick_data") {
      const currentDate = new Date();
      const reminderDate = new Date(customTimeValue);
      if (reminderDate > currentDate) {
        let convertedTime = moment.utc(reminderDate).format("YYYY-MM-DD HH:mm:ss");
        newForm.set_time.value = convertedTime.slice(0, -2) + "00";
        newForm.set_time.valid = true;
        newForm.set_time.feedback = null;
      } else if (customTimeValue.getTime() === reminderDate.getTime()) {
        let convertedTime = moment.utc(reminderDate).format("YYYY-MM-DD HH:mm:ss");
        newForm.set_time.value = convertedTime.slice(0, -2) + "00";
        newForm.set_time.valid = true;
        newForm.set_time.feedback = dictionary.feedbackReminderDateOverdue;
      } else {
        newForm.set_time.valid = false;
        newForm.set_time.feedback = dictionary.feedbackReminderDateFuture;
      }
    } else {
      newForm.set_time.value = timeValue;
      newForm.set_time.valid = true;
    }

    setForm(newForm);
    setComponentUpdate((prevState) => (prevState ? 0 : 1));
    return !Object.keys(newForm)
      .map((k) => newForm[k].valid)
      .some((f) => f === false);
  };

  const handleSnooze = () => {
    if (loading || !isFormValid()) return;

    setLoading(true);

    let payload = {};
    Object.keys(form).forEach((k) => {
      if (k === "set_time") {
        if (form[k].value !== "") payload[k] = form[k].value;
      } else if (form[k].value) {
        payload[k] = form[k].value;
      }
    });
    console.log(payload);
    actions.onSubmit(payload, (err, res) => {
      // if (res) {
      //   toggle();
      // }
      // setLoading(false);
    });
    /**
     * @todo need to recheck the submit callback
     * **/
    setLoading(false);
    toggle();
  };

  const handleTitleRef = (e) => {
    if (e && !initFocused) {
      refs.title.current = e;
      setTimeout(() => {
        refs.title.current.focus();
        setInitFocused(true);
      }, 500);
    }
  };

  const handleSelectWorkspace = (value) => {
    setSelectedWorkspace(value);
    if (value) {
      setForm({
        ...form,
        topic_id: { value: value.id },
        assigned_to: { value: selectedUser && value.member_ids.some((id) => selectedUser.id !== id) ? null : form.assigned_to.value },
      });
      setUserOptions(
        value.members.map((u) => {
          return {
            ...u,
            icon: "user-avatar",
            value: u.id,
            label: u.name ? u.name : u.email,
            type: "USER",
          };
        })
      );
      // if there is a selected user but the user is not a member of the selected workspace then reset selected user to null
      if (selectedUser && value.member_ids.some((id) => selectedUser.id !== id)) {
        setSelectedUser(null);
      }
    } else {
      setForm({
        ...form,
        topic_id: { value: null },
        assigned_to: { value: null },
      });
      setAllUsersOptions();
      setSelectedUser(null);
    }
  };

  const handleSelectUser = (value) => {
    setSelectedUser(value);
    if (value) {
      setForm({
        ...form,
        assigned_to: { value: value.id },
      });
    } else {
      setForm({
        ...form,
        assigned_to: { value: null },
      });
    }
  };

  const handleUserInputChange = (e) => {
    setUserInputValue(e);
  };

  return (
    <Wrapper isOpen={modal} toggle={toggle} size={"lg"} className="todo-reminder-modal" centered>
      <ModalHeaderSection toggle={toggle}>{dictionary.chatReminder}</ModalHeaderSection>
      <ModalBody data-set-update={componentUpdate}>
        {itemType === null && (
          <>
            <div className="column">
              <div className="col-12 modal-info">{dictionary.reminderInfo}</div>
              <div className="col-12 modal-label">{dictionary.title}</div>
              <div className="col-12">
                <FormInput innerRef={handleTitleRef} name="title" defaultValue={form.title.value} placeholder={dictionary.title} onChange={handleInputChange} isValid={form.title.valid} feedback={form.title.feedback} autoFocus />
              </div>
              <div className="col-12 modal-label">{dictionary.description}</div>
              <div className="col-12">
                <StyledQuillEditor defaultValue={form.description.value} onChange={handleQuillChange} name="description" />
              </div>
            </div>
            <div className="column clearfix">
              <div className="col-lg-6 float-left">
                <div className="modal-label">Workspace</div>
                <WorkspacesContainer className="mb-2">
                  <FolderSelect options={workspaceOptions} value={selectedWorkspace} onChange={handleSelectWorkspace} isMulti={false} isClearable={true} />
                </WorkspacesContainer>
              </div>
              <div className="col-lg-6 float-left">
                <div className="modal-label">Assign to</div>
                <SelectedUserContainer className="mb-2">
                  <PeopleSelect options={userOptions} value={selectedUser} inputValue={userInputValue} onChange={handleSelectUser} onInputChange={handleUserInputChange} isMulti={false} isClearable={true} isSearchable />
                </SelectedUserContainer>
              </div>
            </div>
          </>
        )}
        {itemType === "POST" && (
          <>
            <div className="column">
              <div className="col-12 modal-info">{dictionary.reminderInfo}</div>
              <div className="col-12 modal-label">{dictionary.author}</div>
              <div className="col-12 mb-3">{item.author.name}</div>
              <div className="col-12 modal-label">{dictionary.title}</div>
              <div className="col-12 mb-3">{form.title.value}</div>
              <div className="col-12 modal-label">{dictionary.description}</div>
              <div className="col-12 mb-3">
                <span dangerouslySetInnerHTML={{ __html: quillHelper.parseEmoji(form.description.value) }} />
                <FileAttachments attachedFiles={item.files} showDelete={false} />
              </div>
              <div className="col-6">
                <div className="modal-label">Workspace</div>
                <WorkspacesContainer className=" mb-2">
                  <FolderSelect options={workspaceOptions} value={selectedWorkspace} onChange={handleSelectWorkspace} isMulti={false} isClearable={true} isDisabled={true} />
                </WorkspacesContainer>
              </div>
              <div className="col-6">
                <div className="modal-label">Assign to</div>
                <SelectedUserContainer className="mb-2">
                  <PeopleSelect options={userOptions} value={selectedUser} inputValue={userInputValue} onChange={handleSelectUser} onInputChange={handleUserInputChange} isMulti={false} isClearable={true} isSearchable />
                </SelectedUserContainer>
              </div>
            </div>
          </>
        )}
        {itemType === "CHAT" && (
          <>
            <div className="column">
              <div className="col-12 modal-info">{dictionary.reminderInfo}</div>
              <div className="col-12 modal-label">{dictionary.author}</div>
              <div className="col-12 mb-3">{item.user ? item.user.name : "System"}</div>
              <div className="col-12 modal-label">{dictionary.title}</div>
              <div className="col-12 mb-3">{form.title.value}</div>
              <div className="col-12 modal-label">{dictionary.message}</div>
              <div className="col-12 mb-3">
                <MessageFiles isAuthor={item.user.id === user.id} files={item.files} reply={item} type="chat" />
                <span dangerouslySetInnerHTML={{ __html: quillHelper.parseEmoji(form.description.value) }} />
              </div>
            </div>
            <div className="column clearfix">
              <div className="col-6">
                <div className="modal-label">Workspace</div>
                <WorkspacesContainer className="mb-2">
                  <FolderSelect options={workspaceOptions} value={selectedWorkspace} onChange={handleSelectWorkspace} isMulti={false} isClearable={true} isDisabled={true} />
                </WorkspacesContainer>
              </div>
              <div className="col-6">
                <div className="modal-label">Assign to</div>
                <SelectedUserContainer className="mb-2">
                  <PeopleSelect options={userOptions} value={selectedUser} inputValue={userInputValue} onChange={handleSelectUser} onInputChange={handleUserInputChange} isMulti={false} isClearable={true} isSearchable />
                </SelectedUserContainer>
              </div>
            </div>
          </>
        )}
        {itemType === "POST_COMMENT" && (
          <>
            <div className="column">
              <div className="col-12 modal-info">{dictionary.reminderInfo}</div>
              <div className="col-12 modal-label">{dictionary.author}</div>
              <div className="col-12 mb-3">{item.author.name}</div>
              <div className="col-12 modal-label">{dictionary.title}</div>
              <div className="col-12 mb-3">{form.title.value}</div>
              <div className="col-12 modal-label">{dictionary.message}</div>
              <div className="col-12 mb-3">
                <span dangerouslySetInnerHTML={{ __html: quillHelper.parseEmoji(form.description.value) }} />
                <FileAttachments attachedFiles={item.files} showDelete={false} />
              </div>
            </div>
            <div className="column clearfix">
              <div className="col-6">
                <div className="modal-label">Workspace</div>
                <WorkspacesContainer className="mb-2">
                  <FolderSelect options={workspaceOptions} value={selectedWorkspace} onChange={handleSelectWorkspace} isMulti={false} isClearable={true} isDisabled={true} />
                </WorkspacesContainer>
              </div>
              <div className="col-6">
                <div className="modal-label">Assign to</div>
                <SelectedUserContainer className="mb-2">
                  <PeopleSelect options={userOptions} value={selectedUser} inputValue={userInputValue} onChange={handleSelectUser} onInputChange={handleUserInputChange} isMulti={false} isClearable={true} isSearchable />
                </SelectedUserContainer>
              </div>
            </div>
          </>
        )}
        <RadioInputContainer className="column mt-2">
          <div className="col-12 col-lg-4 modal-label mb-1">{dictionary.remindMeOn}</div>
          <div className="col-12 mb-3">
            <InputContainer>
              <RadioInput
                readOnly
                onClick={(e) => {
                  handleSetReminder(e, "1h");
                }}
                checked={timeValue === "1h"}
                value={"1h"}
                name={"role"}
              >
                {dictionary.oneHour}
              </RadioInput>
              <RadioInput
                readOnly
                onClick={(e) => {
                  handleSetReminder(e, "3h");
                }}
                checked={timeValue === "3h"}
                value={"3h"}
                name={"role"}
              >
                {dictionary.threeHours}
              </RadioInput>
              <RadioInput
                readOnly
                onClick={(e) => {
                  handleSetReminder(e, "tomorrow");
                }}
                checked={timeValue === "tomorrow"}
                value={"tomorrow"}
                name={"role"}
              >
                {dictionary.tomorrow}
              </RadioInput>
              <RadioInput readOnly onClick={handleSelectPickDateTime} checked={timeValue === "pick_data"} value={"pick_data"} name={"role"}>
                {dictionary.pickDateTime}
              </RadioInput>
              {showDateTimePicker && (
                <InputGroup>
                  <DateTimePicker minDate={minDate} onChange={handlePickDateTime} value={customTimeValue} locale={language} format={`${date_format} ${time_format}`} disableClock={true} />
                  <StyleInputFeedback valid={form.set_time.valid}>{form.set_time.feedback}</StyleInputFeedback>
                </InputGroup>
              )}
            </InputContainer>
          </div>
        </RadioInputContainer>
      </ModalBody>
      <ModalFooter>
        <Button outline color="secondary" onClick={toggle}>
          {dictionary.cancel}
        </Button>
        <Button color="primary" onClick={handleSnooze}>
          {loading && <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true" />}
          {dictionary.snooze}
        </Button>{" "}
      </ModalFooter>
    </Wrapper>
  );
};

export default React.memo(TodoReminderModal);
