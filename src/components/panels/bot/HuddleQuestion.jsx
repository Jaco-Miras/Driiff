import React from "react";
import styled from "styled-components";
import { useTranslation } from "../../hooks";

const Wrapper = styled.div`
  margin: 10px;
  border-radius: 8px;
  background: #f0f0f0;
  padding: 10px;
  display: block;
  .dark & {
    background: #191c20;
  }
`;

const HuddleQuestion = (props) => {
  const { question } = props;
  const { _t } = useTranslation();

  const dictionary = {
    huddleBot: _t("HUDDLE.HUDDLE_BOT", "Huddle bot"),
  };
  return (
    <Wrapper>
      <div>{dictionary.huddleBot}</div>
      <div>{question.question}</div>
    </Wrapper>
  );
};

export default HuddleQuestion;
