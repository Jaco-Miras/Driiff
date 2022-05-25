import React, { useState } from "react";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import { SvgIconFeather } from "../../common";
import { useTranslationActions } from "../../hooks";
//import { replaceChar } from "../../../helpers/stringFormatter";
import { createJitsiMeet, createJitsiMeetMobile } from "../../../redux/actions/chatActions";
import { browserName, deviceType } from "react-device-detect";

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
    background-color: ${({ theme }) => theme.colors.primary}!important;
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

const VideoReminderMessage = (props) => {
  const { reply, timeFormat, channelId, channelTitle, type } = props;
  const dispatch = useDispatch();
  const [startingMeet, setStartingMeet] = useState(false);
  const data = JSON.parse(reply.body.replace("DUE_REMINDER::", ""));
  console.log(data);
  const handleJoinMeeting = () => {
    if (startingMeet) return;
    setStartingMeet(true);
    let stripTitle = channelTitle.replace(/[&\/\\#, +()$~%.'":*?<>{}]/g, "_");
    let parseChannel = type === "DIRECT" ? "Meeting_Room" : stripTitle;
    const payload = {
      channel_id: channelId,
      host: false,
      room_name: getSlug() + "~" + parseChannel + "~" + channelId + "~" + data[0].remind_at.timestamp,
    };
    if (deviceType === "mobile" && browserName === "WebKit") {
      dispatch(
        createJitsiMeetMobile(payload, (err, res) => {
          if (err) {
            return;
          }
          window.webkit.messageHandlers.startDriffTalk.postMessage({ token: res.data._token, room: res.data.room_name });
        })
      );
    } else {
      dispatch(createJitsiMeet(payload, () => setStartingMeet(false)));
    }
  };
  const { _t } = useTranslationActions();
  const dictionary = {
    videoReminderMessage: _t("SCHEDULED_DRIFF_TALK_CHAT_MESSAGE", "Grab some coffe, check your hair and join the call. This call is private to the participants in this channel"),
    joinMeeting: _t("JOIN_MEETING", "Join Meeting"),
    meetingEnded: _t("MEETING_ENDED", "Meeting ended"),
    scheduleMeet: _t("DRIFF_TALK_SCHEDULE_MEETING", "Scheduled meeting is starting"),
  };
  return (
    <Wrapper className="google-meeting">
      <SvgIconFeather icon="video" />
      <span>{dictionary.scheduleMeet}</span>
      <button className="btn btn-primary" onClick={handleJoinMeeting}>
        <SvgIconFeather icon="calendar" className={"mr-2"} /> {dictionary.joinMeeting}
      </button>

      <span className="text-muted">{dictionary.videoReminderMessage}</span>
      <span className="reply-date created text-muted">{timeFormat.todayOrYesterdayDate(reply.created_at.timestamp)}</span>
    </Wrapper>
  );
};

export default VideoReminderMessage;
