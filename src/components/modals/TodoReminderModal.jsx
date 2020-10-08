import React, {useRef, useState} from "react";
import DateTimePicker from "react-datetime-picker";
import {useDispatch} from "react-redux";
import {Button, InputGroup, Modal, ModalBody, ModalFooter} from "reactstrap";
import styled from "styled-components";
import {clearModal} from "../../redux/actions/globalActions";
import RadioInput from "../forms/RadioInput";
import {useSettings, useTranslation} from "../hooks";
import {ModalHeaderSection} from "./index";
import quillHelper from "../../helpers/quillHelper";
import {FormInput, InputFeedback, QuillEditor} from "../forms";
import moment from "moment";

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

const TodoReminderModal = (props) => {
  /**
   * @todo refactor
   */
  const {type, item, parentItem = null, itemType = null, actions} = props.data;

  const {
    generalSettings: {date_picker_format: date_format, time_picker_format: time_format, language},
  } = useSettings();

  const {_t} = useTranslation();
  const dispatch = useDispatch();

  const [componentUpdate, setComponentUpdate] = useState(0);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: {
      value: itemType === "POST" ? item.title : parentItem ? parentItem.title : ""
    },
    description: {
      value: item && item.body ? item.body.substring(0, 50).split(" ").splice(-1, 1).join(" ") : "",
    },
    set_time: {
      value: "1h"
    }
  })

  const minDate = item && item.remind_at && Math.round(+new Date() / 1000) > item.remind_at.timestamp ? moment.unix(item.remind_at.timestamp).toDate() : moment().add(1, 'm').toDate();
  const [timeValue, setTimeValue] = useState(item && item.remind_at ? "pick_data" : "");
  const [customTimeValue, setCustomTimeValue] = useState(item && item.remind_at ? moment.unix(item.remind_at.timestamp).toDate() : moment().add(20, 'm').toDate());
  const [showDateTimePicker, setShowDateTimePicker] = useState(item && item.remind_at ? true : null);
  const [modal, setModal] = useState(true);
  const [initFocused, setInitFocused] = useState(false);

  const refs = {
    title: useRef(null)
  }

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
    snooze: _t("REMINDER.SNOOZE", "Remind me"),
    cancel: _t("REMINDER.CANCEL", "Cancel"),
    feedbackReminderDateFuture: _t("FEEDBACK.REMINDER_DATE_MUST_BE_FUTURE", "Reminder date must be in the future."),
    feedbackReminderDateOverdue: _t("FEEDBACK.REMINDER_DATE_OVERDUE", "Note: Reminder date is overdue."),
    reminderInfo: _t("REMINDER.INFO", "Reminders help to organize your thoughts and guide you through your day.")
  };

  if (itemType === null) {
    dictionary.chatReminder = _t("REMINDER.SET_A_REMINDER", "New reminder");
  } else {
    dictionary.chatReminder = _t("REMINDER.SET_A_REMINDER_FOR_THIS_TYPE", "Set a reminder for this ::type::", {
      type: itemType.toLowerCase().replace("_", " ")
    });
  }

  const toggle = () => {
    setModal(!modal);
    dispatch(clearModal({type: type}));
  };

  const handleInputChange = (e) => {
    const {name, value} = e.currentTarget;
    setForm(prevState => ({
      ...prevState,
      [name]: {
        ...prevState[name],
        value: value
      }
    }));
  }

  const handleQuillChange = (content, delta, source, editor) => {
    const textOnly = editor.getText(content);
    if (textOnly.trim() !== "") {
      setForm(prevState => ({
        ...prevState,
        description: {
          ...prevState.description,
          value: content
        }
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
    let newForm = form;

    if (form.title.value.trim() === "") {
      newForm.title.valid = false;
      newForm.title.feedback = `Title is required.`;
    } else {
      newForm.title.value = form.title.value.trim();
      newForm.title.valid = true;
      newForm.title.feedback = null;
    }

    if (form.description.value)

      if (timeValue === "pick_data") {
        const currentDate = new Date();
        const reminderDate = new Date(customTimeValue);

        if (reminderDate > currentDate) {
          newForm.set_time.value = moment.utc(reminderDate).format("YYYY-MM-DD HH:mm:ss");
          newForm.set_time.valid = true;
          newForm.set_time.feedback = null;
        } else if (customTimeValue.getTime() === reminderDate.getTime()) {
          newForm.set_time.value = moment.utc(reminderDate).format("YYYY-MM-DD HH:mm:ss");
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
    setComponentUpdate(prevState => prevState ? 0 : 1);
    return !Object.keys(newForm).map(k => newForm[k].valid).some(f => f === false);
  }

  const handleSnooze = () => {
    if (loading || !isFormValid())
      return;

    setLoading(true);

    let payload = {};
    Object.keys(form).forEach(k => {
      if (k === "set_time") {
        if (form[k].value !== "")
          payload[k] = form[k].value;
      } else {
        payload[k] = form[k].value;
      }
    })

    actions.onSubmit(payload, (err, res) => {
      if (res) {
        toggle();
      }
      setLoading(false);
    });
  };

  const handleTitleRef = (e) => {
    if (e && !initFocused) {
      refs.title.current = e;
      setTimeout(() => {
        refs.title.current.focus();
        setInitFocused(true);
      }, 500)
    }
  }

  return (
    <Wrapper isOpen={modal} toggle={toggle} size={"lg"} className="todo-reminder-modal" centered>
      <ModalHeaderSection toggle={toggle}>{dictionary.chatReminder}</ModalHeaderSection>
      <ModalBody data-set-update={componentUpdate}>
        {
          itemType === null &&
          <>
            <div className="column">
              <div className="col-12 modal-info">{dictionary.reminderInfo}</div>
              <div className="col-12 modal-label">{dictionary.title}</div>
              <div className="col-12">
                <FormInput
                  innerRef={handleTitleRef}
                  name="title"
                  defaultValue={form.title.value}
                  placeholder={dictionary.title}
                  onChange={handleInputChange}
                  isValid={form.title.valid}
                  feedback={form.title.feedback}
                  autoFocus/>
              </div>
              <div className="col-12 modal-label">{dictionary.description}</div>
              <div className="col-12">
                <StyledQuillEditor
                  defaultValue={form.description.value}
                  onChange={handleQuillChange}
                  name="description"/>
              </div>
            </div>
          </>
        }
        {
          itemType === "POST" &&
          <>
            <div className="column">
              <div className="col-12 modal-info">{dictionary.reminderInfo}</div>
              <div className="col-12 modal-label">{dictionary.author}</div>
              <div className="col-12 mb-3">{item.author.name}</div>
              <div className="col-12 modal-label">{dictionary.title}</div>
              <div className="col-12 mb-3">{form.title.value}</div>
              <div className="col-12 modal-label">{dictionary.description}</div>
              <div className="col-12"
                   dangerouslySetInnerHTML={{__html: quillHelper.parseEmoji(form.description.value)}}/>
            </div>
          </>
        }
        {
          itemType === "CHAT" &&
          <>
            <div className="column">
              <div className="col-12 modal-info">{dictionary.reminderInfo}</div>
              <div className="col-12 modal-label">{dictionary.author}</div>
              <div className="col-12 mb-3">{item.user ? item.user.name : "System"}</div>
              <div className="col-12 modal-label">{dictionary.title}</div>
              <div className="col-12 mb-3">{form.title.value}</div>
              <div className="col-12 modal-label">{dictionary.message}</div>
              <div className="col-12 mb-3"
                   dangerouslySetInnerHTML={{__html: quillHelper.parseEmoji(form.description.value)}}/>
            </div>
          </>
        }
        {
          itemType === "POST_COMMENT" &&
          <>
            <div className="column">
              <div className="col-12 modal-info">{dictionary.reminderInfo}</div>
              <div className="col-12 modal-label">{dictionary.author}</div>
              <div className="col-12 mb-3">{item.author.name}</div>
              <div className="col-12 modal-label">{dictionary.title}</div>
              <div className="col-12 mb-3">{form.title.value}</div>
              <div className="col-12 modal-label">{dictionary.message}</div>
              <div className="col-12 mb-3"
                   dangerouslySetInnerHTML={{__html: quillHelper.parseEmoji(form.description.value)}}/>
            </div>
          </>
        }
        <div className="column mt-3">
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
              <RadioInput readOnly onClick={handleSelectPickDateTime} checked={timeValue === "pick_data"}
                          value={"pick_data"} name={"role"}>
                {dictionary.pickDateTime}
              </RadioInput>
              {showDateTimePicker &&
              <InputGroup>
                <DateTimePicker
                  minDate={minDate} onChange={handlePickDateTime} value={customTimeValue} locale={language}
                  format={`${date_format} ${time_format}`}
                  disableClock={true}/>
                <StyleInputFeedback valid={form.set_time.valid}>{form.set_time.feedback}</StyleInputFeedback>
              </InputGroup>}
            </InputContainer>
          </div>
        </div>
      </ModalBody>
      <ModalFooter>
      <Button outline color="secondary" onClick={toggle}>
          {dictionary.cancel}
        </Button>
        <Button color="primary" onClick={handleSnooze}>
          {loading && <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"/>}
          {dictionary.snooze}
        </Button>{" "}
      </ModalFooter>
    </Wrapper>
  );
};

export default React.memo(TodoReminderModal);
