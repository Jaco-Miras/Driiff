import React, { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button, Modal, ModalBody, ModalFooter } from "reactstrap";
import styled from "styled-components";
import Select from "react-select";
import { clearModal } from "../../redux/actions/globalActions";
import RadioInput from "../forms/RadioInput";
import { useSettings, useTranslationActions, useToaster, useWindowSize } from "../hooks";
import { ModalHeaderSection } from "./index";
import { FormInput, InputFeedback, FolderSelect, PeopleSelect, DescriptionInput, CheckBox } from "../forms";
import moment from "moment";
import { FileAttachments } from "../common";
import { DropDocument } from "../dropzone/DropDocument";
import { uploadBulkDocument } from "../../redux/services/global";
import { stripHtml } from "../../helpers/stringFormatter";
//import ChannelSelect from "../forms/ChannelSelect";
//import { CheckBox } from "../forms";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
// import { getChannels } from "../../redux/services";
//import { uniqBy } from "lodash";
//import { postCreateChannel, renameChannelKey, getChannelDetail, getChannels, getChannel } from "../../redux/actions/chatActions";
import { darkTheme, lightTheme } from "../../helpers/selectTheme";

const Wrapper = styled(Modal)`
  .invalid-feedback {
    display: block;
  }
  .modal-body {
    padding-bottom: 0 !important;
  }
  .file-attachments-container {
    display: inline-flex;
  }
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
  .react-datepicker-wrapper {
    min-width: 180px;
    max-width: 200px;
    input {
      width: 200px;
    }
  }
  .modal-footer {
    justify-content: space-between;
    align-items: center;
    padding: 10px 30px;
  }
  .react-datepicker-popper[data-placement^="top"] .react-datepicker__triangle::before,
  .react-datepicker-popper[data-placement^="bottom"] .react-datepicker__triangle::before,
  .react-datepicker-popper[data-placement^="top"] .react-datepicker__triangle::after,
  .react-datepicker-popper[data-placement^="bottom"] .react-datepicker__triangle::after {
    left: -47px;
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

const StyledDescriptionInput = styled(DescriptionInput)`
  .description-input {
    // height: ${(props) => (props.height > 80 ? props.height : 80)}px;
    // max-height: 400px;
    height: calc(100% - 50px);
  }

  label {
    min-width: 100%;
    font-weight: 500;
  }
`;

const RadioInputWrapper = styled.div`
  .component-radio-input {
    display: inline-flex;
  }
  input {
    width: auto;
  }
`;

const TimePickerContainer = styled.div`
  display: flex;
  // align-items: center;
  flex-flow: column;
  .react-select-container {
    width: 200px;
  }
  .react-datepicker-wrapper input {
    padding: 6px;
  }
  .flex-flow-column {
    flex-flow: column;
  }
`;

const TodoReminderModal = (props) => {
  /**
   * @todo refactor
   */
  const { type, item, parentItem = null, itemType = null, actions, params, mode = "create", videoMeeting = false, channel = null, isSharedWs = false } = props.data;

  const history = useHistory();
  const {
    generalSettings: { dark_mode },
  } = useSettings();

  const { _t } = useTranslationActions();

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
    workspaceLabel: _t("LABEL.WORKSPACE", "Workspace"),
    assignedToLabel: _t("LABEL.ASSIGN_TO", "Assign to"),
    fileAttachments: _t("POST.FILE_ATTACHMENTS", "File attachments"),
    uploadingAndSending: _t("TOASTER.CREATING_TODO_WITH_FILE", "Uploading file and creating reminder"),
    unsuccessful: _t("FILE_UNSUCCESSFULL", "Upload File Unsuccessful"),
    toasterGeneralError: _t("TOASTER.GENERAL_ERROR", "An error has occurred try again!"),
    endDate: _t("LABEL.END_DATE", "End date"),
    recurring: _t("LABEL.RECURRING", "Recurring"),
    weekly: _t("LABEL.WEEKLY", "Weekly"),
    monthly: _t("LABEL.MONTHLY", "Monthly"),
    yearly: _t("LABEL.YEARLY", "Yearly"),
    makeThisMeetingRecurring: _t("LABEL.MAKE_THIS_MEETING_RECURRING", "Make this meeting recurring"),
  };

  const recurringOptions = [
    { value: "weekly", label: dictionary.weekly },
    { value: "monthly", label: dictionary.monthly },
    { value: "yearly", label: dictionary.yearly },
  ];

  const dispatch = useDispatch();
  const toaster = useToaster();
  const winSize = useWindowSize();

  const user = useSelector((state) => state.session.user);
  const users = useSelector((state) => state.users.users);
  const workspaces = useSelector((state) => state.workspaces.workspaces);
  const workspacesLoaded = useSelector((state) => state.workspaces.workspacesLoaded);
  //const channels = useSelector((state) => state.chat.channels);
  const activeTopic = useSelector((state) => state.workspaces.activeTopic);
  const sharedWs = useSelector((state) => state.workspaces.sharedWorkspaces);
  const isSharedWorkspace = (params && params.workspaceId && activeTopic && activeTopic.sharedSlug) || isSharedWs;
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
      value: mode === "create" ? user.id : null,
    },
  });
  //const [videoChecked, setVideoChecked] = useState(videoMeeting);
  // const [calendarInvite, setCalendarInvite] = useState(false);
  // const [selectedChannel, setSelectedChannel] = useState(channel ? { ...channel, label: channel.title, value: channel.id } : null);
  // const [channelInputValue, setChannelInputValue] = useState("");

  const minEndDate = item && item.remind_at && Math.round(+new Date() / 1000) > item.remind_at.timestamp ? moment.unix(item.remind_at.timestamp).toDate() : moment().add(7, "days").toDate();
  const minDate = item && item.remind_at && Math.round(+new Date() / 1000) > item.remind_at.timestamp ? moment.unix(item.remind_at.timestamp).toDate() : moment().add(1, "m").toDate();
  const [timeValue, setTimeValue] = useState(item && item.remind_at ? "pick_data" : "");
  const [customTimeValue, setCustomTimeValue] = useState(item && item.remind_at ? moment.unix(item.remind_at.timestamp).toDate() : moment().add(20, "m").toDate());
  const [customEndDateValue, setCustomEndDateValue] = useState(item && item.end_date && item.end_date.timestamp ? moment.unix(item.end_date.timestamp).toDate() : null);
  const [showDateTimePicker, setShowDateTimePicker] = useState(item && item.remind_at ? true : null);
  const [modal, setModal] = useState(true);
  const [initFocused, setInitFocused] = useState(false);

  const [workspaceOptions, setWorkspaceOptions] = useState([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState(params && workspaces[params.workspaceId] ? { ...workspaces[params.workspaceId], label: workspaces[params.workspaceId].name, value: workspaces[params.workspaceId].id } : null);
  const [userOptions, setUserOptions] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userInputValue, setUserInputValue] = useState("");
  const [mounted, setMounted] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [removedFiles, setRemovedFiles] = useState([]);
  const [showDropzone, setShowDropzone] = useState(false);
  const [inlineImages, setInlineImages] = useState([]);
  const [imageLoading, setImageLoading] = useState(null);
  const [recurring, setRecurring] = useState(item && item.recurring ? recurringOptions.find((o) => o.value === item.recurring) : null);
  const [showRecurringOptions, setShowRecurringOptions] = useState(item && item.recurring !== null);

  const toasterRef = useRef(null);
  const progressBar = useRef(0);

  const botCodes = ["gripp_bot_account", "gripp_bot_invoice", "gripp_bot_offerte", "gripp_bot_project", "gripp_bot_account", "driff_webhook_bot", "huddle_bot"];
  const allUsers = Object.values(users).filter((u) => {
    if (u.email && botCodes.includes(u.email)) {
      return false;
    } else {
      return true;
    }
  });

  const setAllUsersOptions = () => {
    setUserOptions(
      allUsers.map((u) => {
        return {
          ...u,
          icon: "user-avatar",
          value: u.id,
          label: u.name && u.name.trim() !== "" ? u.name : u.email,
          type: "USER",
          useLabel: true,
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
      if (!itemType && params) {
        let wsKey = params ? params.workspaceId : null;
        if (isSharedWorkspace) {
          wsKey = activeTopic.key;
        }
        const ws = workspaces[wsKey];
        // set default selected workspace and set the user options using the workspace members
        if (ws) {
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
                label: u.name && u.name.trim() !== "" ? u.name : u.email,
                type: "USER",
                useLabel: true,
              };
            })
          );
        }
      }

      if (itemType && parentItem && itemType === "CHAT" && parentItem.type === "TOPIC") {
        let wsKey = parentItem.entity_id;
        if (isSharedWorkspace) {
          wsKey = `${parentItem.entity_id}-${parentItem.slug}`;
        }
        const ws = workspaces[wsKey];
        if (ws) {
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
                label: u.name && u.name.trim() !== "" ? u.name : u.email,
                type: "USER",
                useLabel: true,
              };
            })
          );
        }
      }
      if (!itemType && params && params.hasOwnProperty("workspaceId") && activeTopic && mode === "create") {
        setSelectedWorkspace({
          ...activeTopic,
          icon: "compass",
          value: activeTopic.id,
          label: activeTopic.name,
        });
        setForm({
          ...form,
          topic_id: { value: activeTopic.id },
        });
      }
      if (itemType && itemType === "POST" && mode === "create") {
        const workspaceRecipient = item.recipients.find((r) => r.type === "TOPIC");
        if (workspaceRecipient) {
          const ws = { ...workspaces[workspaceRecipient.key] };
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
                label: u.name && u.name.trim() !== "" ? u.name : u.email,
                type: "USER",
                useLabel: true,
              };
            })
          );
        }
      }

      if (itemType && itemType === "POST_COMMENT" && parentItem && mode === "create") {
        const workspaceRecipient = parentItem.recipients.find((r) => r.type === "TOPIC");
        if (workspaceRecipient) {
          const ws = { ...workspaces[workspaceRecipient.key] };
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
                label: u.name && u.name.trim() !== "" ? u.name : u.email,
                type: "USER",
                useLabel: true,
              };
            })
          );
        }
      }

      setWorkspaceOptions(
        [
          ...Object.values(workspaces).map((ws) => {
            return {
              ...ws,
              icon: "compass",
              value: ws.id,
              label: ws.name,
            };
          }),
        ]
          .filter((ws) => ws.members.some((m) => m.id === user.id))
          .sort((a, b) => b.id - a.id)
      );
    }
  }, [mounted, workspacesLoaded, params, isSharedWorkspace]);

  useEffect(() => {
    //mount use effect
    if (mode === "edit" && item && item.workspace) {
      if (Object.values(workspaces).some((ws) => ws.id === item.workspace.id)) {
        let ws;
        if (history.location.pathname.startsWith("/shared-hub")) {
          if (activeTopic) {
            ws = { ...workspaces[activeTopic.key] };
          }
        } else {
          ws = { ...workspaces[item.workspace.id] };
        }
        if (ws) {
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
                label: u.name && u.name.trim() !== "" ? u.name : u.email,
                type: "USER",
                useLabel: true,
              };
            })
          );
          setForm({
            ...form,
            topic_id: { value: ws.id },
            assigned_to: { value: item.assigned_to ? item.assigned_to.id : null },
          });
          if (item.assigned_to) {
            setSelectedUser({
              ...item.assigned_to,
              icon: "user-avatar",
              value: item.assigned_to.id,
              label: item.assigned_to.name ? item.assigned_to.name : item.assigned_to.email,
              type: "USER",
              useLabel: true,
            });
          }
        }
      }
    } else if (mode === "edit" && item && !item.workspace) {
      setForm({
        ...form,
        topic_id: { value: null },
        assigned_to: { value: item.assigned_to ? item.assigned_to.id : null },
      });
      if (item.assigned_to) {
        setSelectedUser({
          ...item.assigned_to,
          icon: "user-avatar",
          value: item.assigned_to.id,
          label: item.assigned_to.name ? item.assigned_to.name : item.assigned_to.email,
          type: "USER",
          useLabel: true,
        });
      }
      setAllUsersOptions();
    } else {
      setAllUsersOptions();
    }
    if (mode === "edit" && item && item.files.length) {
      setUploadedFiles(
        item.files.map((f) => {
          return { ...f, id: f.file_id };
        })
      );
    }

    // set form for chat reminders on mount
    if (mode === "create" && itemType && parentItem && itemType === "CHAT") {
      if (parentItem.type === "TOPIC") {
        setSelectedWorkspace({
          icon: "compass",
          value: parentItem.entity_id,
          label: parentItem.title,
        });

        setUserOptions(
          parentItem.members.map((u) => {
            return {
              ...u,
              icon: "user-avatar",
              value: u.id,
              label: u.name && u.name.trim() !== "" ? u.name : u.email,
              type: "USER",
              useLabel: true,
            };
          })
        );
      }

      let chatBody = "";

      if (item.user === null) {
        const message = document.getElementById(`bot-${item.id}`);
        if (message) {
          chatBody = stripHtml(message.innerHTML);
        }
      } else {
        chatBody = stripHtml(item.body);
      }

      setForm({
        ...form,
        topic_id: { value: parentItem.type === "TOPIC" ? parentItem.entity_id : null },
        title: { value: `${item.user ? item.user.name : ""} | ${parentItem.title} | Chat Message` },
        description: { value: chatBody },
      });
    }
    // set form for post reminders on mount
    if (mode === "create" && itemType && itemType === "POST") {
      const workspaceRecipient = item.recipients.find((r) => r.type === "TOPIC");
      const companyRecipient = item.recipients.find((r) => r.type === "DEPARTMENT");
      if (workspaceRecipient && workspaces[workspaceRecipient.id]) {
        const ws = { ...workspaces[workspaceRecipient.id] };
        if (ws) {
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
                label: u.name && u.name.trim() !== "" ? u.name : u.email,
                type: "USER",
                useLabel: true,
              };
            })
          );
        }
      }
      if (companyRecipient) {
        setSelectedWorkspace({
          icon: "compass",
          value: companyRecipient.id,
          label: companyRecipient.name,
        });
        setForm({
          ...form,
          topic_id: { value: companyRecipient.id },
        });
        setUserOptions(
          allUsers
            .filter((u) => u.type === "internal")
            .map((u) => {
              return {
                ...u,
                icon: "user-avatar",
                value: u.id,
                label: u.name && u.name.trim() !== "" ? u.name : u.email,
                type: "USER",
                useLabel: true,
              };
            })
        );
      }
      let title = "";
      if (item.author && item.author.name) {
        title += `${item.author.name}`;
      }
      if (workspaceRecipient || companyRecipient) {
        if (workspaceRecipient) {
          title += ` | ${workspaceRecipient.name}`;
        } else {
          title += ` | ${companyRecipient.name}`;
        }
      }
      title += " | Post";

      setForm((prevState) => ({
        ...prevState,
        title: { value: title },
        //title: { value: `${item.author ? item.author.name : ""} | ${workspaceRecipient ? workspaceRecipient.name : companyRecipient ? companyRecipient.name : ""} | Post` },
        description: { value: item.title },
        topic_id: { value: isSharedWorkspace ? item.recipient_ids : companyRecipient.id },
      }));
    }

    if (mode === "create" && parentItem && itemType && itemType === "POST_COMMENT") {
      const workspaceRecipient = parentItem.recipients.find((r) => r.type === "TOPIC");
      const companyRecipient = parentItem.recipients.find((r) => r.type === "DEPARTMENT");
      if (workspaceRecipient && workspaces[workspaceRecipient.id]) {
        const ws = { ...workspaces[workspaceRecipient.id] };
        if (ws) {
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
                label: u.name && u.name.trim() !== "" ? u.name : u.email,
                type: "USER",
                useLabel: true,
              };
            })
          );
        }
      }
      if (companyRecipient) {
        setSelectedWorkspace({
          icon: "compass",
          value: companyRecipient.id,
          label: companyRecipient.name,
        });
        setForm({
          ...form,
          topic_id: { value: companyRecipient.id },
        });
        setUserOptions(
          allUsers
            .filter((u) => u.type === "internal")
            .map((u) => {
              return {
                ...u,
                icon: "user-avatar",
                value: u.id,
                label: u.name && u.name.trim() !== "" ? u.name : u.email,
                type: "USER",
                useLabel: true,
              };
            })
        );
      }
      let title = "";
      if (item.author && item.author.name) {
        title += `${item.author.name}`;
      }
      if (workspaceRecipient || companyRecipient) {
        if (workspaceRecipient) {
          title += ` | ${workspaceRecipient.name}`;
        } else {
          title += ` | ${companyRecipient.name}`;
        }
      }
      title += " | Post comment";

      setForm((prevState) => ({
        ...prevState,
        title: { value: title },
        //title: { value: `${item.author ? item.author.name : ""} | ${workspaceRecipient ? workspaceRecipient.name : null} | Post comment` },
        description: { value: item.body },
      }));
    }

    if (mode === "create") {
      let selectedUser = user;
      if (isSharedWorkspace && parentItem && itemType === "CHAT" && parentItem.slug && sharedWs[parentItem.slug]) {
        selectedUser = sharedWs[parentItem.slug].user_auth;
      } else if (isSharedWorkspace && parentItem && itemType && itemType === "POST_COMMENT" && sharedWs[parentItem.slug]) {
        selectedUser = sharedWs[parentItem.slug].user_auth;
      } else if (isSharedWorkspace && item && itemType && itemType === "POST" && sharedWs[item.slug]) {
        selectedUser = sharedWs[item.slug].user_auth;
      } else if (isSharedWorkspace && activeTopic && sharedWs[activeTopic.slug]) {
        selectedUser = sharedWs[activeTopic.slug].user_auth;
      }
      setSelectedUser({
        ...selectedUser,
        icon: "user-avatar",
        value: selectedUser.id,
        label: selectedUser.name,
        type: "USER",
        useLabel: true,
      });
      setForm((prevState) => ({
        ...prevState,
        assigned_to: { value: selectedUser.id },
      }));
    }
    setMounted(true);
  }, []);

  // useEffect(() => {
  //   if (selectedChannel && selectedWorkspace) {
  //     let selectedWorkspaceChannels = [];
  //     const teamChannel = selectedWorkspace.team_channel ? selectedWorkspace.team_channel.id : 0;
  //     const guestChannel = selectedWorkspace.channel ? selectedWorkspace.channel.id : 0;
  //     if (selectedWorkspace.is_shared) {
  //       selectedWorkspaceChannels = [guestChannel, teamChannel];
  //     } else {
  //       selectedWorkspaceChannels = [teamChannel];
  //     }
  //     //check if selected channel is part of the selected workspace
  //     if (!selectedWorkspaceChannels.some((id) => id === selectedChannel.id)) {
  //       setSelectedChannel(null);
  //     }
  //   }
  // }, [selectedChannel, selectedWorkspace]);

  const refs = {
    title: useRef(null),
    dropzone: useRef(null),
  };

  if (mode === "edit") {
    dictionary.chatReminder = _t("TODO.EDIT", "Edit todo");
  } else {
    dictionary.chatReminder = _t("TODO.NEW", "New todo");
    // dictionary.chatReminder = _t("REMINDER.SET_A_REMINDER_FOR_THIS_TYPE", "Set a reminder for this ::type::", {
    //   type: itemType.toLowerCase().replace("_", " "),
    // });
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
    if (textOnly.trim() !== "" || inlineImages.length > 0) {
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

  // const handlePickDateTime = (e) => {
  //   setCustomTimeValue(e);
  // };

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
      // need to recheck validation
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
      // newForm.set_time.valid = false;
      // newForm.set_time.feedback = dictionary.feedbackReminderDateFuture;
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

  const handleRemind = () => {
    if (loading || !isFormValid() || imageLoading) return;

    setLoading(true);

    let payload = {};
    Object.keys(form).forEach((k) => {
      if (k === "set_time") {
        if (form[k].value !== "") payload[k] = form[k].value;
      } else if (form[k].value) {
        payload[k] = form[k].value;
      }
    });
    payload = {
      ...payload,
      file_ids: [...inlineImages.map((i) => i.id), ...uploadedFiles.map((f) => f.id)],
      remove_file_ids: removedFiles.map((f) => f.id),
    };
    // if (videoChecked) {
    //   if (selectedWorkspace) {
    //     const channel_id = selectedWorkspace.channel && selectedWorkspace.channel.id ? selectedWorkspace.channel.id : selectedWorkspace.team_channel ? selectedWorkspace.team_channel.id : 0;
    //     payload = {
    //       ...payload,
    //       link_type: "DRIFF_TALK",
    //       link_id: channel_id,
    //     };
    //   } else if (!selectedWorkspace && selectedUser) {
    //     //find the direct channel between logged user and selected user
    //   }
    //   if (calendarInvite) {
    //     payload = { ...payload, send_invite: true };
    //   }
    // }
    if (showRecurringOptions) {
      if (recurring) {
        payload = { ...payload, recurring: recurring.value };
      }
      if (customEndDateValue) {
        let convertedDate = moment.utc(customEndDateValue).format("YYYY-MM-DD HH:mm:ss");
        payload = { ...payload, end_date: convertedDate.slice(0, -2) + "00" };
      }
    }

    if (isSharedWs) {
      if (parentItem && parentItem.slug && sharedWs[parentItem.slug]) {
        const sharedPayload = { slug: parentItem.slug, token: sharedWs[parentItem.slug].access_token, is_shared: true };
        payload = {
          ...payload,
          sharedPayload: sharedPayload,
        };
      } else if (item && item.slug && sharedWs[item.slug]) {
        const sharedPayload = { slug: item.slug, token: sharedWs[item.slug].access_token, is_shared: true };
        payload = {
          ...payload,
          sharedPayload: sharedPayload,
        };
      }
    } else if (isSharedWorkspace) {
      const sharedPayload = { slug: activeTopic.slug, token: sharedWs[activeTopic.slug].access_token, is_shared: true };
      payload = {
        ...payload,
        sharedPayload: sharedPayload,
      };
    }
    if (attachedFiles.length > 0) {
      uploadFiles(payload);
      toggle();
    } else {
      actions.onSubmit(payload);
      setLoading(false);
      toggle();
    }
    //selected channel implementation
    // if (videoChecked && selectedChannel) {
    //   if (calendarInvite) {
    //     payload = { ...payload, send_invite: true };
    //   }
    //   if (isNaN(selectedChannel.id)) {
    //     //create channel first
    //     dispatch(
    //       postCreateChannel(
    //         {
    //           title: "",
    //           type: "person",
    //           recipient_ids: selectedChannel.recipient_ids,
    //         },
    //         (err, res) => {
    //           if (err) {
    //             toaster.error(dictionary.toasterGeneralError);
    //             toggle();
    //           }
    //           if (res) {
    //             let timestamp = Math.round(+new Date() / 1000);
    //             let newchannel = {
    //               ...res.data.channel,
    //               old_id: selectedChannel.id,
    //               code: res.data.code,
    //               selected: true,
    //               hasMore: false,
    //               isFetching: false,
    //               skip: 0,
    //               replies: [],
    //               created_at: {
    //                 timestamp: timestamp,
    //               },
    //               last_reply: null,
    //               title: res.data.channel.profile.name,
    //             };
    //             dispatch(renameChannelKey(newchannel));
    //             payload = {
    //               ...payload,
    //               link_type: "DRIFF_TALK",
    //               link_id: newchannel.id,
    //             };

    //             if (attachedFiles.length > 0) {
    //               uploadFiles(payload);
    //               toggle();
    //             } else {
    //               actions.onSubmit(payload);
    //               setLoading(false);
    //               toggle();
    //             }
    //           }
    //         }
    //       )
    //     );
    //   } else {
    //     payload = {
    //       ...payload,
    //       link_type: "DRIFF_TALK",
    //       link_id: selectedChannel.id,
    //     };
    //     if (attachedFiles.length > 0) {
    //       uploadFiles(payload);
    //       toggle();
    //     } else {
    //       actions.onSubmit(payload);
    //       setLoading(false);
    //       toggle();
    //     }
    //   }
    // } else {
    //   if (attachedFiles.length > 0) {
    //     uploadFiles(payload);
    //     toggle();
    //   } else {
    //     actions.onSubmit(payload, (err, res) => {
    //       // if (res) {
    //       //   toggle();
    //       // }
    //       // setLoading(false);
    //     });
    //     /**
    //      * @todo need to recheck the submit callback
    //      * **/
    //     setLoading(false);
    //     toggle();
    //   }
    // }
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

  const handleOpenFileDialog = () => {
    if (refs.dropzone.current) {
      refs.dropzone.current.open();
    }
  };

  const handleHideDropzone = () => {
    setShowDropzone(false);
  };

  const onDragEnter = () => {
    if (!showDropzone) setShowDropzone(true);
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

  const handleRemoveFile = (fileId) => {
    if (uploadedFiles.some((f) => f.id === parseInt(fileId))) setRemovedFiles([...uploadedFiles.filter((f) => f.id === parseInt(fileId)), ...removedFiles]);
    setUploadedFiles((prevState) => prevState.filter((f) => f.id !== parseInt(fileId)));
    setAttachedFiles((prevState) => prevState.filter((f) => f.id !== parseInt(fileId)));
  };

  const handleOnUploadProgress = (progressEvent) => {
    const progress = progressEvent.loaded / progressEvent.total;
    if (toasterRef.current === null) {
      toasterRef.current = toaster.info(<div>{dictionary.uploadingAndSending}.</div>, { progress: progressBar.current, autoClose: true });
    } else {
      toaster.update(toasterRef.current, { progress: progress, autoClose: true });
    }
  };

  const dismissToaster = () => {
    setTimeout(() => {
      if (toasterRef.curent) toaster.dismiss(toasterRef.current);
    }, 500);
  };

  const handleNetWorkError = () => {
    if (toasterRef.curent !== null) {
      setLoading(false);
      dismissToaster();
      toaster.error(<div>{dictionary.unsuccessful}.</div>);
      toasterRef.current = null;
    }
  };

  async function uploadFiles(payload, type = "create") {
    let formData = new FormData();

    let uploadData = {
      user_id: user.id,
      file_type: "private",
      folder_id: null,
      fileOption: null,
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
        payload = {
          ...payload,
          file_ids: [...result.data.map((res) => res.id), ...payload.file_ids],
        };
        actions.onSubmit(payload, dismissToaster);
        //setLoading(false);
        //toggle();
      })
      .catch((error) => {
        handleNetWorkError(error);
      });
  }
  //const hasSelectedChannel = videoChecked && selectedChannel !== null;
  const hasAssignedUserOrWs = form.assigned_to.value || form.topic_id.value;
  const userOnly = user.type === "external" && selectedWorkspace === null;
  const sortedUserOptions = userOptions.sort((a, b) => {
    if (a.name === user.name) return -1;
    else return 0;
  });

  // const toggleCheck = () => {
  //   setVideoChecked((prevState) => !prevState);
  // };

  const filterPassedTime = (time) => {
    const currentDate = new Date();
    const selectedDate = new Date(time);
    return currentDate.getTime() < selectedDate.getTime();
  };

  const filterPassedDate = (date) => {
    const currentDate = new Date();
    const selectedDate = new Date(date);
    return currentDate.getDate() <= selectedDate.getDate() && currentDate.getMonth() <= selectedDate.getMonth() && currentDate.getFullYear() <= selectedDate.getFullYear();
  };

  const handlePickDate = (date) => {
    setCustomTimeValue(date);
  };

  // const toggleCalendarInvite = () => {
  //   setCalendarInvite((prevState) => !prevState);
  // };

  // const handleSelectChannel = (value) => {
  //   setSelectedChannel(value);
  // };

  // const handleChannelInputChange = (e) => {
  //   setChannelInputValue(e);
  // };

  const handlePickEndDate = (date) => {
    setCustomEndDateValue(date);
  };

  const handleSelectRecurring = (e) => {
    setRecurring(e);
  };

  // let selectedWorkspaceChannels = [];
  // if (selectedWorkspace) {
  //   const teamChannel =
  //     selectedWorkspace.team_channel && selectedWorkspace.team_channel.id
  //       ? {
  //           ...selectedWorkspace.team_channel,
  //           team: true,
  //           title: selectedWorkspace.name,
  //           id: selectedWorkspace.team_channel.id,
  //           label: selectedWorkspace.name,
  //           value: selectedWorkspace.team_channel.id,
  //           entity_id: selectedWorkspace.id,
  //           type: "TOPIC",
  //         }
  //       : null;
  //   const guestChannel =
  //     selectedWorkspace.channel && selectedWorkspace.channel.id
  //       ? {
  //           ...selectedWorkspace.channel,
  //           team: false,
  //           title: selectedWorkspace.name,
  //           id: selectedWorkspace.channel.id,
  //           label: selectedWorkspace.name,
  //           value: selectedWorkspace.channel.id,
  //           entity_id: selectedWorkspace.id,
  //           type: "TOPIC",
  //         }
  //       : null;
  //   if (selectedWorkspace.is_shared) {
  //     selectedWorkspaceChannels = [guestChannel, teamChannel].filter((c) => c);
  //   } else {
  //     selectedWorkspaceChannels = [teamChannel].filter((c) => c);
  //   }
  // }
  // const channelOptions = selectedWorkspace
  //   ? selectedWorkspaceChannels
  //   : Object.values(channels).map((channel) => {
  //       return { ...channel, label: channel.title, value: channel.id };
  //     });

  // const promiseOptions = (value) =>
  //   new Promise((resolve) => {
  //     resolve(getChannels({ search: channelInputValue, skip: 0, limit: 15 }));
  //   })
  //     .then((result) => {
  //       if (result.data) {
  //         const options = uniqBy(
  //           [...channelOptions, ...result.data.results].map((o) => {
  //             return { ...o, label: o.title, value: o.id };
  //           }),
  //           "id"
  //         ).filter((c) => c.title.toLowerCase().includes(channelInputValue.toLowerCase()));
  //         return options;
  //       } else {
  //         return uniqBy(channelOptions, "id").filter((c) => c.title.toLowerCase().includes(channelInputValue.toLowerCase()));
  //       }
  //     })
  //     .catch((error) => {
  //       //error
  //     });

  const handleShowRecurringOptions = () => {
    setShowRecurringOptions((prevState) => !prevState);
  };

  return (
    <Wrapper isOpen={modal} toggle={toggle} size={"lg"} className="todo-reminder-modal" centered>
      <ModalHeaderSection toggle={toggle}>{dictionary.chatReminder}</ModalHeaderSection>
      <ModalBody data-set-update={componentUpdate} onDragOver={onDragEnter}>
        <DropDocument
          hide={!showDropzone}
          ref={refs.dropzone}
          onDragLeave={handleHideDropzone}
          onDrop={({ acceptedFiles }) => {
            dropAction(acceptedFiles);
          }}
          onCancel={handleHideDropzone}
          attachedFiles={attachedFiles}
        />
        {itemType === null && (
          <>
            <div className="column">
              <div className="col-12 modal-info">{dictionary.reminderInfo}</div>
              <div className="col-12 modal-label">{dictionary.title}</div>
              <div className="col-12">
                <FormInput innerRef={handleTitleRef} name="title" defaultValue={form.title.value} placeholder={dictionary.title} onChange={handleInputChange} isValid={form.title.valid} feedback={form.title.feedback} autoFocus />
              </div>
              <div className="col-12">
                <StyledDescriptionInput
                  className="modal-description"
                  height={winSize.height - 660}
                  defaultValue={form.description.value}
                  showFileButton={true}
                  onChange={handleQuillChange}
                  onOpenFileDialog={handleOpenFileDialog}
                  disableBodyMention={true}
                  modal={"reminders"}
                  mentionedUserIds={[]}
                  setInlineImages={setInlineImages}
                  setImageLoading={setImageLoading}
                />
              </div>
              {(attachedFiles.length > 0 || uploadedFiles.length > 0) && (
                <div className="col-12">
                  <div>
                    <label className={"modal-label"} for="workspace">
                      {dictionary.fileAttachments}
                    </label>
                  </div>
                  <div className="file-attachments-container">
                    <FileAttachments attachedFiles={[...attachedFiles, ...uploadedFiles]} handleRemoveFile={handleRemoveFile} />
                  </div>
                </div>
              )}
            </div>
            <div className="column clearfix">
              <div className="col-lg-6 float-left">
                <div className="modal-label">{dictionary.workspaceLabel}</div>
                <WorkspacesContainer className="mb-2">
                  <FolderSelect options={workspaceOptions} value={selectedWorkspace} onChange={handleSelectWorkspace} isMulti={false} isClearable={true} isDisabled={user.type === "external"} />
                </WorkspacesContainer>
              </div>
              <div className="col-lg-6 float-left">
                <div className="modal-label">{dictionary.assignedToLabel}</div>
                <SelectedUserContainer className="mb-2">
                  <PeopleSelect
                    options={sortedUserOptions.filter((o) => (userOnly ? o.value === user.id : true))}
                    value={selectedUser}
                    inputValue={userInputValue}
                    onChange={handleSelectUser}
                    onInputChange={handleUserInputChange}
                    isMulti={false}
                    isClearable={true}
                    isSearchable
                  />
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
              <div className="col-12">
                <FormInput innerRef={handleTitleRef} name="title" defaultValue={form.title.value} placeholder={dictionary.title} onChange={handleInputChange} isValid={form.title.valid} feedback={form.title.feedback} autoFocus />
              </div>
              <div className="col-12">
                <StyledDescriptionInput
                  className="modal-description"
                  height={winSize.height - 660}
                  defaultValue={form.description.value}
                  showFileButton={true}
                  onChange={handleQuillChange}
                  onOpenFileDialog={handleOpenFileDialog}
                  disableBodyMention={true}
                  modal={"reminders"}
                  mentionedUserIds={[]}
                  setInlineImages={setInlineImages}
                  setImageLoading={setImageLoading}
                />
              </div>
              {(attachedFiles.length > 0 || uploadedFiles.length > 0) && (
                <div className="col-12">
                  <div>
                    <label className={"modal-label"} for="workspace">
                      {dictionary.fileAttachments}
                    </label>
                  </div>
                  <div className="file-attachments-container">
                    <FileAttachments attachedFiles={[...attachedFiles, ...uploadedFiles]} handleRemoveFile={handleRemoveFile} />
                  </div>
                </div>
              )}
              <div className="column clearfix">
                <div className="col-6 float-left">
                  <div className="modal-label">{dictionary.workspaceLabel}</div>
                  <WorkspacesContainer className=" mb-2">
                    <FolderSelect options={workspaceOptions} value={selectedWorkspace} onChange={handleSelectWorkspace} isMulti={false} isClearable={true} isDisabled={user.type === "external"} />
                  </WorkspacesContainer>
                </div>

                <div className="col-6 float-left">
                  <div className="modal-label">{dictionary.assignedToLabel}</div>
                  <SelectedUserContainer className="mb-2">
                    <PeopleSelect
                      options={sortedUserOptions.filter((o) => (userOnly ? o.value === user.id : true))}
                      value={selectedUser}
                      inputValue={userInputValue}
                      onChange={handleSelectUser}
                      onInputChange={handleUserInputChange}
                      isMulti={false}
                      isClearable={true}
                      isSearchable
                    />
                  </SelectedUserContainer>
                </div>
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
              <div className="col-12">
                <FormInput innerRef={handleTitleRef} name="title" defaultValue={form.title.value} placeholder={dictionary.title} onChange={handleInputChange} isValid={form.title.valid} feedback={form.title.feedback} autoFocus />
              </div>
              <div className="col-12">
                <StyledDescriptionInput
                  className="modal-description"
                  height={winSize.height - 660}
                  defaultValue={form.description.value}
                  showFileButton={true}
                  onChange={handleQuillChange}
                  onOpenFileDialog={handleOpenFileDialog}
                  disableBodyMention={true}
                  modal={"reminders"}
                  mentionedUserIds={[]}
                  setInlineImages={setInlineImages}
                  setImageLoading={setImageLoading}
                />
              </div>
              {(attachedFiles.length > 0 || uploadedFiles.length > 0) && (
                <div className="col-12">
                  <div>
                    <label className={"modal-label"} for="workspace">
                      {dictionary.fileAttachments}
                    </label>
                  </div>
                  <div className="file-attachments-container">
                    <FileAttachments attachedFiles={[...attachedFiles, ...uploadedFiles]} handleRemoveFile={handleRemoveFile} />
                  </div>
                </div>
              )}
            </div>
            <div className="column clearfix">
              <div className="col-6 float-left">
                <div className="modal-label">{dictionary.workspaceLabel}</div>
                <WorkspacesContainer className="mb-2">
                  <FolderSelect options={workspaceOptions} value={selectedWorkspace} onChange={handleSelectWorkspace} isMulti={false} isClearable={true} isDisabled={user.type === "external"} />
                </WorkspacesContainer>
              </div>

              <div className="col-6 float-left">
                <div className="modal-label">{dictionary.assignedToLabel}</div>
                <SelectedUserContainer className="mb-2">
                  <PeopleSelect
                    options={sortedUserOptions.filter((o) => (userOnly ? o.value === user.id : true))}
                    value={selectedUser}
                    inputValue={userInputValue}
                    onChange={handleSelectUser}
                    onInputChange={handleUserInputChange}
                    isMulti={false}
                    isClearable={true}
                    isSearchable
                  />
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
              <div className="col-12">
                <FormInput innerRef={handleTitleRef} name="title" defaultValue={form.title.value} placeholder={dictionary.title} onChange={handleInputChange} isValid={form.title.valid} feedback={form.title.feedback} autoFocus />
              </div>
              <div className="col-12">
                <StyledDescriptionInput
                  className="modal-description"
                  height={winSize.height - 660}
                  defaultValue={form.description.value}
                  showFileButton={true}
                  onChange={handleQuillChange}
                  onOpenFileDialog={handleOpenFileDialog}
                  disableBodyMention={true}
                  modal={"reminders"}
                  mentionedUserIds={[]}
                  setInlineImages={setInlineImages}
                  setImageLoading={setImageLoading}
                />
              </div>
              {(attachedFiles.length > 0 || uploadedFiles.length > 0) && (
                <div className="col-12">
                  <div>
                    <label className={"modal-label"} for="workspace">
                      {dictionary.fileAttachments}
                    </label>
                  </div>
                  <div className="file-attachments-container">
                    <FileAttachments attachedFiles={[...attachedFiles, ...uploadedFiles]} handleRemoveFile={handleRemoveFile} />
                  </div>
                </div>
              )}
            </div>
            <div className="column clearfix">
              <div className="col-6 float-left">
                <div className="modal-label">{dictionary.workspaceLabel}</div>
                <WorkspacesContainer className="mb-2">
                  <FolderSelect options={workspaceOptions} value={selectedWorkspace} onChange={handleSelectWorkspace} isMulti={false} isClearable={true} isDisabled={user.type === "external"} />
                </WorkspacesContainer>
              </div>

              <div className="col-6 float-left">
                <div className="modal-label">{dictionary.assignedToLabel}</div>
                <SelectedUserContainer className="mb-2">
                  <PeopleSelect
                    options={sortedUserOptions.filter((o) => (userOnly ? o.value === user.id : true))}
                    value={selectedUser}
                    inputValue={userInputValue}
                    onChange={handleSelectUser}
                    onInputChange={handleUserInputChange}
                    isMulti={false}
                    isClearable={true}
                    isSearchable
                  />
                </SelectedUserContainer>
              </div>
            </div>
          </>
        )}
        <div className="column mb-2 mt-2 clearfix">
          <div className="col-6 float-left">
            {/* <CheckBox name="must_read" checked={videoChecked} onClick={toggleCheck} type="danger">
              Video Meeting
            </CheckBox> */}
            {/* {videoChecked && (
              <>
                <div className="modal-label">Channel</div>
                <SelectedUserContainer className="mb-2">
                  <ChannelSelect
                    defaultOptions={channelOptions}
                    // options={channelOptions}
                    value={selectedChannel}
                    inputValue={channelInputValue}
                    onChange={handleSelectChannel}
                    onInputChange={handleChannelInputChange}
                    isMulti={false}
                    isClearable={true}
                    isSearchable
                    loadOptions={promiseOptions}
                    searchable={true}
                  />
                </SelectedUserContainer>
              </>
            )} */}
          </div>
          <div className="col-6 float-left"></div>
        </div>

        <RadioInputContainer className="column mt-2">
          <div className="col-12 col-lg-4 modal-label mb-1">{dictionary.remindMeOn}</div>
          <div className="col-12 mb-3">
            <InputContainer>
              <RadioInputWrapper>
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
              </RadioInputWrapper>
              <RadioInputWrapper>
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
              </RadioInputWrapper>
              {/* <RadioInputWrapper>
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
              </RadioInputWrapper> */}
              <RadioInputWrapper>
                <RadioInput readOnly onClick={handleSelectPickDateTime} checked={timeValue === "pick_data"} value={"pick_data"} name={"role"}>
                  {dictionary.pickDateTime}
                </RadioInput>
              </RadioInputWrapper>
              {showDateTimePicker && (
                <TimePickerContainer>
                  <div className="d-flex align-items-center mr-2 mb-2">
                    <div className="d-flex flex-flow-column mr-2">
                      <div className="mr-2">Date</div>
                      <DatePicker
                        showMonthDropdown
                        showYearDropdown
                        dropdownMode="select"
                        minDate={minDate}
                        //filterTime={filterPassedTime}
                        //filterDate={filterPassedDate}
                        //showTimeSelect
                        //timeIntervals={15}
                        dateFormat="EEEE, MMMM d, yyyy"
                        selected={customTimeValue}
                        onChange={handlePickDate}
                      />
                    </div>
                    <div className="d-flex flex-flow-column">
                      <div className="ml-2 mr-2">Time</div>
                      <DatePicker minDate={minDate} filterTime={filterPassedTime} selected={customTimeValue} onChange={handlePickDate} showTimeSelect showTimeSelectOnly timeIntervals={15} timeCaption="Time" dateFormat="h:mm aa" />
                    </div>
                    {form.set_time.valid === false && <StyleInputFeedback valid={form.set_time.valid}>{form.set_time.feedback}</StyleInputFeedback>}
                  </div>
                  <CheckBox name="recurring" checked={showRecurringOptions} onClick={handleShowRecurringOptions} type="danger">
                    {dictionary.makeThisMeetingRecurring}
                  </CheckBox>
                  {showRecurringOptions && (
                    <>
                      <div className="d-flex align-items-center mr-2 mb-2">
                        <div className="d-flex flex-flow-column mr-2">
                          <div className="mr-2">{dictionary.recurring}</div>
                          <Select
                            className={"react-select-container"}
                            classNamePrefix="react-select"
                            styles={dark_mode === "0" ? lightTheme : darkTheme}
                            options={recurringOptions}
                            onChange={handleSelectRecurring}
                            menuPlacement={"top"}
                            isClearable={true}
                            value={recurring}
                          />
                        </div>
                      </div>
                      <div className="d-flex align-items-center mr-2">
                        <div className="d-flex flex-flow-column mr-2">
                          <div className="mr-2">{dictionary.endDate}</div>
                          <DatePicker
                            placeholderText="Click to select a date"
                            showMonthDropdown
                            showYearDropdown
                            dropdownMode="select"
                            minDate={minEndDate}
                            //filterTime={filterPassedTime}
                            //filterDate={filterPassedDate}
                            //showTimeSelect
                            //timeIntervals={15}
                            dateFormat="EEEE, MMMM d, yyyy"
                            selected={customEndDateValue}
                            onChange={handlePickEndDate}
                          />
                        </div>
                        <div className="d-flex flex-flow-column mr-2">
                          <div className="ml-2 mr-2">Time</div>
                          <DatePicker
                            filterTime={filterPassedTime}
                            filterDate={filterPassedDate}
                            minDate={minEndDate}
                            selected={customEndDateValue}
                            onChange={handlePickEndDate}
                            showTimeSelect
                            showTimeSelectOnly
                            timeIntervals={15}
                            timeCaption="Time"
                            dateFormat="h:mm aa"
                          />
                        </div>
                      </div>
                    </>
                  )}
                </TimePickerContainer>
              )}
            </InputContainer>
          </div>
        </RadioInputContainer>
      </ModalBody>
      <ModalFooter>
        <div></div>
        <div>
          <Button className="mr-2" outline color="secondary" onClick={toggle}>
            {dictionary.cancel}
          </Button>
          <Button color="primary" onClick={handleRemind} disabled={imageLoading || form.title.value === "" || timeValue === "" || !hasAssignedUserOrWs}>
            {loading && <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true" />}
            {dictionary.snooze}
          </Button>{" "}
        </div>
      </ModalFooter>
    </Wrapper>
  );
};

export default React.memo(TodoReminderModal);
