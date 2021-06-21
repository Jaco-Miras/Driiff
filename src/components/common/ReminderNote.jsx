import React from "react";
import styled from "styled-components";
import { useTimeFormat, useTranslationActions } from "../hooks";
import { SvgIconFeather } from "./SvgIcon";

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid #ebebeb;
`;

const ReminderNote = (props) => {
  const { className = "", type, todoReminder, ...otherProps } = props;

  const { localizeDate } = useTimeFormat();
  const { _t } = useTranslationActions();

  const getTypeText = () => {
    switch (type) {
      case "POST":
        return _t("REMINDER.TYPE_POST", "post");
      case "POST_COMMENT":
        return _t("REMINDER.TYPE_POST_COMMENT", "comment");
      case "CHAT_MESSAGE":
        return _t("REMINDER.TYPE_CHAT_MESSAGE", "chat message");
    }
  };

  const dictionary = {
    reminderText: _t("REMINDER.REMINDER_TEXT", "A reminder is set for this ::type:: on ::date::", {
      type: getTypeText(),
      date: todoReminder.remind_at ? localizeDate(todoReminder.remind_at.timestamp) : todoReminder.reminder_at ? localizeDate(todoReminder.reminder_at.timestamp) : "",
    }),
  };

  return (
    <Wrapper className={`${className}`} {...otherProps}>
      <SvgIconFeather className="mr-2" height="16" width="16" icon="clock" /> {dictionary.reminderText}
    </Wrapper>
  );
};

export default React.memo(ReminderNote);
