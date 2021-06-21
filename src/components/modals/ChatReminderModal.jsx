import moment from "moment";
import React, { useState } from "react";
import DateTimePicker from "react-datetime-picker";
import { useDispatch, useSelector } from "react-redux";
import { Button, Modal, ModalBody, ModalFooter } from "reactstrap";
import styled from "styled-components";
import { formatHoursAMPM } from "../../helpers/dateFormatter";
import { postChatReminder } from "../../redux/actions/chatActions";
import { clearModal } from "../../redux/actions/globalActions";
import RadioInput from "../forms/RadioInput";
import { useToaster, useTranslationActions } from "../hooks";
import { ModalHeaderSection } from "./index";

const InputContainer = styled.div`
  display: flex;
  width: 100%;
  flex-flow: column;
  > div {
    margin-bottom: 10px;
  }
`;

const ChatReminderModal = (props) => {
  /**
   * @todo refactor
   */
  const { type, message } = props.data;

  const { _t } = useTranslationActions();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.session.user);
  const toaster = useToaster();
  const [loading, setLoading] = useState(false);

  const [setTimeValue, setSetTimeValue] = useState("20m");
  const [customTimeValue, setCustomTimeValue] = useState(new Date());
  const [showDateTimePicker, setShowDateTimePicker] = useState(null);
  const [modal, setModal] = useState(true);

  const dictionary = {
    chatReminder: _t("REMINDER.CHAT_REMINDER", "Set a reminder"),
    oneHour: _t("REMINDER.ONE_HOUR", "1 hour"),
    threeHours: _t("REMINDER.THREE_HOURS", "3 hours"),
    tomorrow: _t("REMINDER.TOMORROW", "Tomorrow"),
    pickDateTime: _t("REMINDER.PICK_DATE_TIME", "Pick date and time"),
    snooze: _t("REMINDER.SNOOZE", "Snooze"),
    cancel: _t("REMINDER.CANCEL", "Cancel"),
  };

  const toggle = () => {
    setModal(!modal);
    dispatch(clearModal({ type: type }));
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
    if (loading) return;

    setLoading(true);

    let payload = {
      message_id: message.id,
      set_time: setTimeValue === "pick_data" ? moment.utc(new Date(customTimeValue)).format("YYYY-MM-DD HH:mm:ss") : setTimeValue,
    };

    dispatch(
      postChatReminder(payload, () => {
        setLoading(false);
        toggle();
        let messageAuthor = "You";
        let messageTime = "";
        let today = new Date();
        switch (setTimeValue) {
          case "1h":
            today.setHours(today.getHours() + 1);
            messageTime = `in an hour at ${formatHoursAMPM(today)} today`;
            break;
          case "3h":
            today.setHours(today.getHours() + 3);
            messageTime = `in 3 hours at ${formatHoursAMPM(today)} today`;
            break;
          case "tomorrow":
            today.setDate(today.getDate() + 1);
            messageTime = "at 9 AM tomorrow";
            break;
          case "pick_data":
            messageTime = `at ${moment(new Date(customTimeValue)).format("YYYY-MM-DD HH:mm")}`;
            break;
          default:
            messageTime = setTimeValue + " at 9 AM";
            break;
        }

        let div = document.createElement("div");
        div.innerHTML = message.body;
        if (div.innerText.length >= 15) div.innerText = div.innerText.substring(0, 15) + "...";

        if (user.id !== message.user.id) {
          messageAuthor = message.user.name;
        }

        toaster.success(
          <>
            I will remind you about this message ("<b>{div.innerText}</b> from {messageAuthor} in {messageTime}")
          </>
        );
      })
    );
  };

  return (
    <Modal isOpen={modal} toggle={toggle} centered className="chat-forward-modal">
      <ModalHeaderSection toggle={toggle}>{dictionary.chatReminder}</ModalHeaderSection>
      <ModalBody>
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
          <RadioInput readOnly onClick={handleSelectPickDateTime} checked={setTimeValue === "pick_data"} value={"pick_data"} name={"role"}>
            {dictionary.pickDateTime}
          </RadioInput>
          {showDateTimePicker && <DateTimePicker minDate={new Date()} onChange={handlePickDateTime} value={customTimeValue} disableClock={true} />}
        </InputContainer>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={handleSnooze}>
          {loading && <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true" />}
          {dictionary.snooze}
        </Button>{" "}
        <Button outline color="secondary" onClick={toggle}>
          {dictionary.cancel}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default React.memo(ChatReminderModal);
