import React, { useEffect, useRef, useState } from "react";
//import DateTimePicker from "react-datetime-picker";
import { useDispatch, useSelector } from "react-redux";
import { Button, Modal, ModalBody, ModalFooter } from "reactstrap";
import styled from "styled-components";
import Select from "react-select";
import { clearModal } from "../../redux/actions/globalActions";
import RadioInput from "../forms/RadioInput";
import { useSettings, useTranslationActions, useToaster, useWindowSize } from "../hooks";
import { ModalHeaderSection } from "./index";
import { FormInput, InputFeedback, FolderSelect, PeopleSelect, DescriptionInput, CheckBox, ChannelSelect } from "../forms";
import moment from "moment";
import { FileAttachments } from "../common";
import { DropDocument } from "../dropzone/DropDocument";
import { uploadBulkDocument } from "../../redux/services/global";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { postCreateChannel, renameChannelKey } from "../../redux/actions/chatActions";
import { darkTheme, lightTheme } from "../../helpers/selectTheme";
import { uniqBy } from "lodash";
import { getChannels } from "../../redux/services";

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
  .react-datepicker-popper[data-placement^="top"] .react-datepicker__triangle::before,
  .react-datepicker-popper[data-placement^="bottom"] .react-datepicker__triangle::before,
  .react-datepicker-popper[data-placement^="top"] .react-datepicker__triangle::after,
  .react-datepicker-popper[data-placement^="bottom"] .react-datepicker__triangle::after {
    left: -47px;
  }
  .modal-footer {
    justify-content: space-between;
    align-items: center;
    padding: 10px 30px;
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

const NestedModalWrapper = styled.div`
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

const VideoMeetingModal = (props) => {
  /**
   * @todo refactor
   */
  const { type, item, parentItem = null, itemType = null, actions, params, mode = "create", channel = null } = props.data;

  const {
    generalSettings: { dark_mode },
  } = useSettings();

  const { _t } = useTranslationActions();
  const dispatch = useDispatch();
  const toaster = useToaster();
  const winSize = useWindowSize();

  const user = useSelector((state) => state.session.user);
  const users = useSelector((state) => state.users.users);
  const activeTopic = useSelector((state) => state.workspaces.activeTopic);
  const workspaces = useSelector((state) => state.workspaces.workspaces);
  const workspacesLoaded = useSelector((state) => state.workspaces.workspacesLoaded);
  const channels = useSelector((state) => state.chat.channels);
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
    save: _t("MODAL.SAVE", "Save"),
    videoMeeting: _t("MODAL.VIDEO_MEETING_HEADER", "Video meeting"),
    videoMeetingInfo: _t("MODAL.VIDEO_MEETING_INFO", "Video meeting information"),
    setMeetingButton: _t("BUTTON.SET_MEETING", "Set meeting"),
    setMeetingHeader: _t("CONFRIMATION.SET_MEETING", "Set meeting"),
    createConfirmMeetingBody: _t("CONFRIMATION.BODY.SET_MEETING", "Are you sure you want to set this meeting?"),
    updateConfirmMeetingBody: _t("CONFRIMATION.BODY.UPDATE_MEETING", "Are you sure you want to update this meeting?"),
    endDate: _t("LABEL.END_DATE", "End date"),
    recurring: _t("LABEL.RECURRING", "Recurring"),
    weekly: _t("LABEL.WEEKLY", "Weekly"),
    monthly: _t("LABEL.MONTHLY", "Monthly"),
    yearly: _t("LABEL.YEARLY", "Yearly"),
    makeThisMeetingRecurring: _t("LABEL.MAKE_THIS_MEETING_RECURRING", "Make this meeting recurring"),
  };

  const recurringOptions = [
    { value: "daily", label: "Daily" },
    { value: "weekly", label: dictionary.weekly },
    { value: "monthly", label: dictionary.monthly },
    { value: "yearly", label: dictionary.yearly },
  ];

  const meetingTypeOptions = [
    { value: "workspace", label: "Workspace" },
    { value: "user", label: "Chat channel" },
    { value: "group", label: "Group chat" },
  ];

  const minEndDate = item && item.remind_at && Math.round(+new Date() / 1000) > item.remind_at.timestamp ? moment.unix(item.remind_at.timestamp).toDate() : moment().add(7, "days").toDate();
  const minDate = item && item.remind_at && Math.round(+new Date() / 1000) > item.remind_at.timestamp ? moment.unix(item.remind_at.timestamp).toDate() : moment().add(1, "m").toDate();
  const [timeValue, setTimeValue] = useState(item && item.remind_at ? "pick_data" : "3h");
  const [customTimeValue, setCustomTimeValue] = useState(item && item.remind_at ? moment.unix(item.remind_at.timestamp).toDate() : moment().add(20, "m").toDate());
  const [customEndDateValue, setCustomEndDateValue] = useState(item && item.end_date && item.end_date.timestamp ? moment.unix(item.end_date.timestamp).toDate() : null);
  const [showDateTimePicker, setShowDateTimePicker] = useState(item && item.remind_at ? true : null);
  const [modal, setModal] = useState(true);
  const [initFocused, setInitFocused] = useState(false);

  const [workspaceOptions, setWorkspaceOptions] = useState([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState(null);
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
  const [showNestedModal, setShowNestedModal] = useState(false);
  const [showRecurringOptions, setShowRecurringOptions] = useState(item && item.recurring !== null);
  const [meetingType, setMeetingType] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [channelInputValue, setChannelInputValue] = useState("");

  const toasterRef = useRef(null);
  const progressBar = useRef(0);

  const setAllUsersOptions = () => {
    const botCodes = ["gripp_bot_account", "gripp_bot_invoice", "gripp_bot_offerte", "gripp_bot_project", "gripp_bot_account", "driff_webhook_bot", "huddle_bot"];
    const allUsers = Object.values(users).filter((u) => {
      if (u.email && botCodes.includes(u.email)) {
        return false;
      } else {
        return true;
      }
    });
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
      if (!itemType && params && workspaces[params.workspaceId]) {
        const workspace = { ...workspaces[params.workspaceId] };
        // set default selected workspace and set the user options using the workspace members
        if (workspace.is_shared) {
          //   const isGuestChannel = workspace.channel && workspace.channel.id === channel.id;
          //   setSelectedWorkspace({
          //     ...workspace,
          //     icon: "compass",
          //     value: workspace.id,
          //     label: workspace.name,
          //     isGuestChannel: isGuestChannel,
          //     isTeamChannel: !isGuestChannel,
          //   });
        } else {
          setSelectedWorkspace({
            ...workspace,
            icon: "compass",
            value: workspace.id,
            label: workspace.name,
            isTeamChannel: true,
          });
        }
        setForm({
          ...form,
          topic_id: { value: workspace.id },
        });
        setUserOptions(
          workspace.members.map((u) => {
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

      const externalWorkspacesWithTeamChannel = Object.values(workspaces)
        .filter((ws) => {
          if (ws.is_shared && ws.channel && ws.channel.id) return true;
          else return false;
        })
        .map((ws) => {
          return { ...ws, icon: "compass", value: ws.channel.id, label: ws.name, isGuestChannel: true };
        });
      setWorkspaceOptions(
        [
          ...Object.values(workspaces).map((ws) => {
            return {
              ...ws,
              icon: "compass",
              value: ws.team_channel.id,
              label: ws.name,
              isTeamChannel: true,
            };
          }),
          ...externalWorkspacesWithTeamChannel,
        ]
          .filter((ws) => ws.members.some((m) => m.id === user.id))
          .sort((a, b) => b.id - a.id)
      );
    }
  }, [mounted, workspacesLoaded, params]);

  useEffect(() => {
    setAllUsersOptions();
    if (mode === "edit" && item && item.workspace && workspaces[item.workspace.id]) {
      setMeetingType(meetingTypeOptions.find((o) => o.value === "workspace"));
      const ws = { ...workspaces[item.workspace.id] };
      setSelectedWorkspace({
        ...ws,
        icon: "compass",
        value: ws.id,
        label: ws.name,
      });
      // setUserOptions(
      //   ws.members.map((u) => {
      //     return {
      //       ...u,
      //       icon: "user-avatar",
      //       value: u.id,
      //       label: u.name && u.name.trim() !== "" ? u.name : u.email,
      //       type: "USER",
      //       useLabel: true,
      //     };
      //   })
      // );
      setForm({
        ...form,
        topic_id: { value: ws.id },
        assigned_to: { value: item.assigned_to ? item.assigned_to.id : null },
      });
      // if (item.assigned_to) {
      //   setSelectedUser({
      //     ...item.assigned_to,
      //     icon: "user-avatar",
      //     value: item.assigned_to.id,
      //     label: item.assigned_to.name ? item.assigned_to.name : item.assigned_to.email,
      //     type: "USER",
      //     useLabel: true,
      //   });
      // }
    } else if (mode === "edit" && item && !item.workspace && item.assigned_to) {
      setMeetingType(meetingTypeOptions.find((o) => o.value === "user"));
      setForm({
        ...form,
        topic_id: { value: null },
        assigned_to: { value: item.assigned_to.id },
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
    } else if (mode === "edit" && item && !item.workspace && !item.assigned_to) {
      setMeetingType(meetingTypeOptions.find((o) => o.value === "channel"));
    }

    if (channel) {
      if (channel.type === "TOPIC") {
        setMeetingType(meetingTypeOptions.find((o) => o.value === "workspace"));
        //get the workspace
        let workspace = workspaces[channel.entity_id];
        if (workspace) {
          setForm({
            ...form,
            topic_id: { value: channel.entity_id },
          });
          if (workspace.is_shared) {
            const isGuestChannel = workspace.channel && workspace.channel.id === channel.id;
            setSelectedWorkspace({
              ...workspace,
              icon: "compass",
              value: channel.id,
              label: workspace.name,
              isGuestChannel: isGuestChannel,
              isTeamChannel: !isGuestChannel,
            });
          } else {
            setSelectedWorkspace({
              ...workspace,
              icon: "compass",
              value: channel.id,
              label: workspace.name,
              isTeamChannel: true,
            });
          }
        } else {
          setForm({
            ...form,
            topic_id: { value: channel.entity_id },
          });
          setSelectedWorkspace({
            id: channel.entity_id,
            icon: "compass",
            value: channel.id,
            label: channel.title,
            isGuestChannel: channel.is_shared,
            isTeamChannel: !channel.is_shared,
          });
        }
      } else if (channel.type === "DIRECT") {
        setMeetingType(meetingTypeOptions.find((o) => o.value === "user"));
        setSelectedUser({
          ...channel.profile,
          value: channel.profile.id,
          icon: "user-avatar",
          label: channel.profile.name,
          type: "USER",
          useLabel: true,
        });
        setForm({
          ...form,
          assigned_to: { value: channel.profile.id },
        });
      } else if (channel.type === "GROUP") {
        // for group chat
        setMeetingType(meetingTypeOptions.find((o) => o.value === "group"));
        setSelectedGroup({
          value: channel.id,
          label: channel.title,
          useLabel: true,
        });
      }
    }
    if (params && params.workspaceId) {
      setMeetingType(meetingTypeOptions.find((o) => o.value === "workspace"));
      setForm({
        ...form,
        topic_id: { value: parseInt(params.workspaceId) },
      });
      if (activeTopic) {
        setSelectedWorkspace({
          id: activeTopic.id,
          icon: "compass",
          value: activeTopic.team_channel.id,
          label: activeTopic.name,
          isTeamChannel: true,
        });
      }
    }
    setMounted(true);
  }, []);

  const refs = {
    title: useRef(null),
    dropzone: useRef(null),
  };

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

    if (showRecurringOptions) {
      if (recurring) {
        payload = { ...payload, recurring: recurring.value };
      }
      if (customEndDateValue) {
        let convertedDate = moment.utc(customEndDateValue).format("YYYY-MM-DD HH:mm:ss");
        payload = { ...payload, end_date: convertedDate.slice(0, -2) + "00" };
      }
    }

    payload = { ...payload, send_invite: true, link_type: "DRIFF_TALK" };
    if (selectedWorkspace) {
      if (selectedWorkspace.isGuestChannel) {
        payload = {
          ...payload,
          link_id: selectedWorkspace.channel.id,
        };
      } else {
        payload = {
          ...payload,
          link_id: selectedWorkspace.team_channel.id,
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
    } else if (selectedUser) {
      //get the direct channel of user
      if (channels[`USER-${selectedUser.id}`]) {
        //create channel
        dispatch(
          postCreateChannel(
            {
              title: "",
              type: "person",
              recipient_ids: channels[`USER-${selectedUser.id}`].recipient_ids,
            },
            (err, res) => {
              if (err) {
                toaster.error(dictionary.toasterGeneralError);
                toggle();
              }
              if (res) {
                let timestamp = Math.round(+new Date() / 1000);
                let newchannel = {
                  ...res.data.channel,
                  old_id: channels[`USER-${selectedUser.id}`].id,
                  code: res.data.code,
                  selected: false,
                  hasMore: false,
                  isFetching: false,
                  skip: 0,
                  replies: [],
                  created_at: {
                    timestamp: timestamp,
                  },
                  last_reply: null,
                  title: res.data.channel.profile.name,
                };
                payload = {
                  ...payload,
                  link_type: "DRIFF_TALK",
                  link_id: newchannel.id,
                };

                if (attachedFiles.length > 0) {
                  uploadFiles(payload);
                  toggle();
                } else {
                  actions.onSubmit(payload);
                  setLoading(false);
                  toggle();
                }
                dispatch(renameChannelKey(newchannel));
              }
            }
          )
        );
      } else {
        //find the channel between the user and selected user
        let channel = Object.values(channels).find((c) => c.type === "DIRECT" && c.profile && c.profile.id === selectedUser.id);
        if (channel) {
          payload = {
            ...payload,
            link_id: channel.id,
          };
          if (attachedFiles.length > 0) {
            uploadFiles(payload);
            toggle();
          } else {
            actions.onSubmit(payload);
            setLoading(false);
            toggle();
          }
        } else {
          //fetch the direct channel
          dispatch(
            getChannels({ search: selectedUser.name, skip: 0, limit: 15 }, (err, res) => {
              if (err) return;
              let channel = res.data.results.find((r) => r.type === "DIRECT" && r.profile && r.profile.id === selectedUser.id);
              if (channel) {
                payload = {
                  ...payload,
                  link_id: channel.id,
                };
                if (attachedFiles.length > 0) {
                  uploadFiles(payload);
                  toggle();
                } else {
                  actions.onSubmit(payload);
                  setLoading(false);
                  toggle();
                }
              }
            })
          );
        }
      }
    }
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
  const hasAssignedUserOrWs = form.assigned_to.value || form.topic_id.value;
  const userOnly = user.type === "external" && selectedWorkspace === null;
  const sortedUserOptions = userOptions.sort((a, b) => {
    if (a.name === user.name) return -1;
    else return 0;
  });

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

  const handlePickEndDate = (date) => {
    setCustomEndDateValue(date);
  };

  const handleSelectRecurring = (e) => {
    setRecurring(e);
  };

  const toggleNested = () => {
    setShowNestedModal((prevState) => !prevState);
  };

  const handleConfirm = () => {
    handleRemind();
  };

  const handleShowRecurringOptions = () => {
    setShowRecurringOptions((prevState) => !prevState);
  };

  const handleSelectMeetingType = (e) => {
    setMeetingType(e);
  };

  const channelOptions = Object.values(channels)
    .filter((channel) => channel.type === "GROUP")
    .map((channel) => {
      return { ...channel, label: channel.title, value: channel.id };
    });

  const handleSelectGroupChannel = (value) => {
    setSelectedGroup(value);
  };

  const handleChannelInputChange = (e) => {
    setChannelInputValue(e);
  };

  const promiseOptions = (value) =>
    new Promise((resolve) => {
      resolve(getChannels({ search: channelInputValue, skip: 0, limit: 15 }));
    })
      .then((result) => {
        if (result.data) {
          const options = uniqBy(
            [...channelOptions, ...result.data.results].map((o) => {
              return { ...o, label: o.title, value: o.id };
            }),
            "id"
          ).filter((c) => c.title.toLowerCase().includes(channelInputValue.toLowerCase()));
          return options;
        } else {
          return uniqBy(channelOptions, "id").filter((c) => c.title.toLowerCase().includes(channelInputValue.toLowerCase()));
        }
      })
      .catch((error) => {
        //error
      });

  return (
    <Wrapper isOpen={modal} toggle={toggle} size={"lg"} className="todo-reminder-modal" centered>
      <ModalHeaderSection toggle={toggle}>{dictionary.videoMeeting}</ModalHeaderSection>
      <ModalBody data-set-update={componentUpdate} onDragOver={onDragEnter}>
        <Modal isOpen={showNestedModal} toggle={toggleNested} centered>
          <ModalHeaderSection toggle={toggleNested}>{dictionary.setMeetingHeader}</ModalHeaderSection>
          <ModalBody>
            {mode === "create" && <div>{dictionary.createConfirmMeetingBody}</div>}
            {mode === "edit" && <div>{dictionary.updateConfirmMeetingBody}</div>}
          </ModalBody>
          <ModalFooter>
            <NestedModalWrapper>
              <Button className="btn-outline-secondary mr-2" onClick={toggleNested}>
                {dictionary.cancel}
              </Button>
              <Button color="primary" onClick={handleConfirm}>
                {dictionary.save}
              </Button>
            </NestedModalWrapper>
          </ModalFooter>
        </Modal>
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

        <div className="column">
          <div className="col-12 modal-info">{dictionary.videoMeetingInfo}</div>
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
          {/* <div className="col-lg-6 float-left">
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
          </div> */}
          <div className="col-lg-6 float-left">
            <div className="modal-label">Plan meeting with</div>
            <WorkspacesContainer className="mb-2">
              <Select
                className={"react-select-container"}
                classNamePrefix="react-select"
                styles={dark_mode === "0" ? lightTheme : darkTheme}
                options={meetingTypeOptions}
                onChange={handleSelectMeetingType}
                menuPlacement={"bottom"}
                isClearable={true}
                value={meetingType}
              />
            </WorkspacesContainer>
          </div>
          <div className="col-lg-6 float-left">
            <div className="modal-label">
              {meetingType && meetingType.value === "workspace" ? "Select workspace" : meetingType && meetingType.value === "user" ? "Select chat channel" : meetingType && meetingType.value === "group" ? "Select group chat" : null}
            </div>
            <SelectedUserContainer className="mb-2">
              {meetingType && meetingType.value === "workspace" && (
                <FolderSelect options={workspaceOptions} value={selectedWorkspace} onChange={handleSelectWorkspace} isMulti={false} isClearable={true} isDisabled={user.type === "external"} />
              )}
              {meetingType && meetingType.value === "user" && (
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
              )}
              {meetingType && meetingType.value === "group" && (
                <ChannelSelect
                  defaultOptions={channelOptions}
                  // options={channelOptions}
                  value={selectedGroup}
                  inputValue={channelInputValue}
                  onChange={handleSelectGroupChannel}
                  onInputChange={handleChannelInputChange}
                  isMulti={false}
                  isClearable={true}
                  isSearchable
                  loadOptions={promiseOptions}
                  searchable={true}
                />
              )}
            </SelectedUserContainer>
          </div>
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
                        filterDate={filterPassedDate}
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
                            filterDate={filterPassedDate}
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
        <div className="ml-auto">
          <Button className="mr-2" outline color="secondary" onClick={toggle}>
            {dictionary.cancel}
          </Button>
          <Button color="primary" onClick={toggleNested} disabled={imageLoading || form.title.value === "" || timeValue === "" || !hasAssignedUserOrWs}>
            {loading && <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true" />}
            {dictionary.setMeetingButton}
          </Button>{" "}
        </div>
      </ModalFooter>
    </Wrapper>
  );
};

export default React.memo(VideoMeetingModal);
