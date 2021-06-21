import React from "react";
import styled from "styled-components";
import { useTranslationActions, useHuddleChatbot } from "../../hooks";

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
  const { question, huddle, isFirstQuestion, selectedChannel, user } = props;

  const { _t } = useTranslationActions();
  const actions = useHuddleChatbot();

  const dictionary = {
    skip: _t("SKIP", "skip"),
  };
  const handleSkip = () => {
    //const currentDate = new Date();
    actions.skipHuddle({
      channel_id: selectedChannel.id,
      huddle_id: huddle.id,
      body: `HUDDLE_SKIP::${JSON.stringify({
        huddle_id: huddle.id,
        author: {
          name: user.name,
          first_name: user.first_name,
          id: user.id,
          profile_image_link: user.profile_image_link,
        },
        user_bot: huddle.user_bot,
      })}`,
    });
    // const huddleAnswered = localStorage.getItem("huddle");
    // if (huddleAnswered) {
    //   const { channels, day } = JSON.parse(huddleAnswered);
    //   localStorage.setItem("huddle", JSON.stringify({ channels: [...channels, huddle.channel.id], day: day }));
    // } else {
    //   localStorage.setItem("huddle", JSON.stringify({ channels: [huddle.channel.id], day: currentDate.getDay() }));
    // }
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
