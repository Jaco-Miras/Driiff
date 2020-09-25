import moment from "moment";
import React, {useState} from "react";
import DateTimePicker from "react-datetime-picker";
import {useDispatch} from "react-redux";
import {Button, Modal, ModalBody, ModalFooter} from "reactstrap";
import styled from "styled-components";
import {clearModal} from "../../redux/actions/globalActions";
import RadioInput from "../forms/RadioInput";
import {useTranslation} from "../hooks";
import {ModalHeaderSection} from "./index";
import quillHelper from "../../helpers/quillHelper";

const InputContainer = styled.div`
  display: flex;
  width: 100%;
  flex-flow: column;
  > div {
    margin-bottom: 10px;
  }
`;

const TodoReminderModal = (props) => {
  /**
   * @todo refactor
   */
  const {type, item, itemType, actions} = props.data;

  const {_t} = useTranslation();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const description = item.body.substring(0, 50).split(" ").splice(-1, 1).join(" ");

  const [setTimeValue, setSetTimeValue] = useState("20m");
  const [customTimeValue, setCustomTimeValue] = useState(new Date());
  const [showDateTimePicker, setShowDateTimePicker] = useState(null);
  const [modal, setModal] = useState(true);

  const dictionary = {
    chatReminder: _t("REMINDER.CHAT_REMINDER_TYPE", "Set a reminder for this ::type::", {
      type: itemType.toLowerCase().replace("_", " ")
    }),
    author: _t("REMINDER.AUTHOR", "Author"),
    title: _t("REMINDER.TITLE", "Title"),
    description: _t("REMINDER.DESCRIPTION", "Description"),
    message: _t("REMINDER.MESSAGE", "Message"),
    oneHour: _t("REMINDER.ONE_HOUR", "1 hour"),
    threeHours: _t("REMINDER.THREE_HOURS", "3 hours"),
    tomorrow: _t("REMINDER.TOMORROW", "Tomorrow"),
    pickDateTime: _t("REMINDER.PICK_DATE_TIME", "Pick date and time"),
    snooze: _t("REMINDER.SNOOZE", "Snooze"),
    cancel: _t("REMINDER.CANCEL", "Cancel"),
  };

  const toggle = () => {
    setModal(!modal);
    dispatch(clearModal({type: type}));
  };

  const handleSetReminder = (e, setTime) => {
    setShowDateTimePicker(false);
    setSetTimeValue(setTime);
  };

  const handlePickDateTime = (e) => {
    setCustomTimeValue(e);
    //setSetTimeValue(formatDateISO8601(e));
  };

  const handleSelectPickDateTime = () => {
    setSetTimeValue("pick_data");
    setShowDateTimePicker(true);
  };

  const handleSnooze = () => {
    if (loading)
      return;

    setLoading(true);

    let payload = {
      title: itemType === "POST" ? item.title : `${itemType}-${item.id}`,
      description: description,
      set_time: setTimeValue === "pick_data" ? moment.utc(new Date(customTimeValue)).format("YYYY-MM-DD HH:mm:ss") : setTimeValue,
    };

    actions.onSubmit(payload, (err, res) => {
      if (res) {
        toggle();
      }
      setLoading(false);
    });
  };

  console.log(item);

  return (
    <Modal isOpen={modal} toggle={toggle} centered className="todo-reminder-modal">
      <ModalHeaderSection toggle={toggle}>{dictionary.chatReminder}</ModalHeaderSection>
      <ModalBody>
        {
          itemType === "POST" &&
          <>
            <div className="row">
              <div className="col-12 col-lg-4">{dictionary.author}</div>
              <div className="col-12 col-lg-8">{item.author.name}</div>
              <div className="col-12 col-lg-4">{dictionary.title}</div>
              <div className="col-12 col-lg-8">{item.title}</div>
              <div className="col-12 col-lg-4">{dictionary.description}</div>
              <div className="col-12 col-lg-8"
                   dangerouslySetInnerHTML={{__html: quillHelper.parseEmoji(description)}}/>
            </div>
          </>
        }
        {
          itemType === "CHAT" &&
          <>
            <div className="row">
              <div className="col-12 col-lg-4">{dictionary.author}</div>
              <div className="col-12 col-lg-8">{item.user ? item.user.name : "System"}</div>
              <div className="col-12 col-lg-4">{dictionary.message}</div>
              <div className="col-12 col-lg-8"
                   dangerouslySetInnerHTML={{__html: quillHelper.parseEmoji(description)}}/>
            </div>
          </>
        }
        {
          itemType === "POST_COMMENT" &&
          <>
            <div className="row">
              <div className="col-12 col-lg-4">{dictionary.author}</div>
              <div className="col-12 col-lg-8">{item.author.name}</div>
              <div className="col-12 col-lg-4">{dictionary.message}</div>
              <div className="col-12 col-lg-8"
                   dangerouslySetInnerHTML={{__html: quillHelper.parseEmoji(description)}}/>
            </div>
          </>
        }
        <InputContainer>
          <RadioInput
            readOnly
            onClick={(e) => {
              handleSetReminder(e, "1h");
            }}
            checked={setTimeValue === "1h"}
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
            checked={setTimeValue === "3h"}
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
            checked={setTimeValue === "tomorrow"}
            value={"tomorrow"}
            name={"role"}
          >
            {dictionary.tomorrow}
          </RadioInput>
          <RadioInput readOnly onClick={handleSelectPickDateTime} checked={setTimeValue === "pick_data"}
                      value={"pick_data"} name={"role"}>
            {dictionary.pickDateTime}
          </RadioInput>
          {showDateTimePicker &&
          <DateTimePicker minDate={new Date()} onChange={handlePickDateTime} value={customTimeValue}
                          disableClock={true}/>}
        </InputContainer>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={handleSnooze}>
          {loading && <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"/>}
          {dictionary.snooze}
        </Button>{" "}
        <Button outline color="secondary" onClick={toggle}>
          {dictionary.cancel}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default React.memo(TodoReminderModal);
