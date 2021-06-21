import React from "react";
import styled from "styled-components";
import { useTranslationActions } from "../../hooks";

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

  const { _t } = useTranslationActions();

  const dictionary = {
    skip: _t("SKIP", "skip"),
  };
  const handleSkip = () => {
    const currentDate = new Date();
    localStorage.setItem("huddle", JSON.stringify({ channels: [huddle.channel.id], day: currentDate.getDay() }));
  };
  return (
    <Wrapper>
      {isFirstQuestion && huddle.introduction_message && <div>{huddle.introduction_message}</div>}
      <div>{question.question}</div>
      {isFirstQuestion && (
        <span onClick={handleSkip}>
          <i>{dictionary.skip}</i>
        </span>
      )}
    </Wrapper>
  );
};

export default HuddleQuestion;
