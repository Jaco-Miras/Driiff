import React, { useState } from "react";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import { SvgIconFeather } from "../../common";
import { useTranslationActions } from "../../hooks";
import { replaceChar } from "../../../helpers/stringFormatter";
import { createJitsiMeet } from "../../../redux/actions/chatActions";

const Wrapper = styled.div`
  display: flex;
  flex-flow: column;
  align-items: center;
  .feather-google-meet {
    width: 2rem;
    height: 2rem;
    margin-bottom: 0.25rem;
  }
  > span,
  button {
    margin-bottom: 0.25rem;
  }
  .btn.btn-primary {
    background-color: ${({ theme }) => theme.colors.fourth}!important;
  }
  .text-muted {
    font-size: 0.7rem;
  }
  .feather-copy {
    width: 0.8rem;
    height: 0.8rem;
    margin-left: 0.25rem;
    cursor: pointer;
  }
`;

const getSlug = () => {
  let driff = localStorage.getItem("slug");
  if (driff) {
    return driff;
  } else {
    const host = window.location.host.split(".");
    if (host.length === 3) {
      localStorage.setItem("slug", host[0]);
      return host[0];
    } else {
      return null;
    }
  }
};

const DriffTalkMessage = (props) => {
  const { reply, timeFormat, channelId, channelTitle, type } = props;
  const dispatch = useDispatch();
  const [startingMeet, setStartingMeet] = useState(false);
  const data = JSON.parse(reply.body.replace("DRIFF_TALK::", ""));
  const handleJoinMeeting = () => {
    if (startingMeet) return;
    setStartingMeet(true);
    let parseChannel = type === "DIRECT" ? "Meeting_Room" : replaceChar(channelTitle, "_");
    setStartingMeet(true);
    const payload = {
      channel_id: channelId,
      host: true,
      room_name: getSlug() + "-" + parseChannel + "-" + channelId,
    };
    dispatch(createJitsiMeet(payload, () => setStartingMeet(true)));
  };
  const { _t } = useTranslationActions();
  const dictionary = {
    driffTalkMessage: _t("DRIFF_TALK_CHAT_MESSAGE", "This meeting is private to the participants in this channel"),
    userStartMeet: _t("DRIFF_TALK_USER_START", "::name:: started a video meeting", { name: data.author.name }),
    joinMeeting: _t("JOIN_MEETING", "Join Meeting"),
  };
  return (
    <Wrapper className="google-meeting">
      <SvgIconFeather icon="video" />
      <span>{dictionary.userStartMeet}</span>
      <button className="btn btn-primary" onClick={handleJoinMeeting}>
        <SvgIconFeather icon="user-plus" className={"mr-2"} /> {dictionary.joinMeeting}
      </button>
      <span className="text-muted">{dictionary.driffTalkMessage}</span>
      <span className="reply-date created text-muted">{timeFormat.todayOrYesterdayDate(reply.created_at.timestamp)}</span>
    </Wrapper>
  );
};

export default DriffTalkMessage;
