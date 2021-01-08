import React from "react";
import styled from "styled-components";
import { useTranslation } from "../../hooks";

const Wrapper = styled.div`
  margin: 10px;
  border-radius: 8px;
  background: #f0f0f0;
  padding: 10px;
  display: block;
  position: relative;
  .dark & {
    background: #191c20;
  }
  span {
    position: absolute;
    right: 10px;
    top: 10px;
    cursor: pointer;
  }
`;

const HuddleQuestion = (props) => {
  const { question, huddle, isFirstQuestion } = props;

  const { _t } = useTranslation();

  const dictionary = {
    huddleBot: _t("HUDDLE.HUDDLE_BOT", "Huddle bot"),
  };
  const handleSkip = () => {
    const currentDate = new Date();
    localStorage.setItem("huddle", JSON.stringify({ channels: [huddle.channel.id], day: currentDate.getDay() }));
  };
  return (
    <Wrapper>
      <div>{dictionary.huddleBot}</div>
      {isFirstQuestion && huddle.introduction_message && <div>{huddle.introduction_message}</div>}
      <div>{question.question}</div>
      <span onClick={handleSkip}>
        <i>skip</i>
      </span>
    </Wrapper>
  );
};

export default HuddleQuestion;
