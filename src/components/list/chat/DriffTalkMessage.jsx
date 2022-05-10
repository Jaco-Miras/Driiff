import React, { useState } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
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

const DriffTalkMessage = (props) => {
  const { reply, timeFormat, channelId, channelTitle, type, selectedChannel } = props;
  const dispatch = useDispatch();
  const [startingMeet, setStartingMeet] = useState(false);
  const sharedWs = useSelector((state) => state.workspaces.sharedWorkspaces);
  let author;
  const isCreateMessage = reply.body.startsWith("DRIFF_TALK::");
  let slug = selectedChannel.slug ? selectedChannel.slug : getSlug();
  if (isCreateMessage) {
    const data = JSON.parse(reply.body.replace("DRIFF_TALK::", ""));
    author = data.author;
  } else {
    const data = JSON.parse(reply.body.replace("MEETING_ENDED::", ""));
    author = data.host;
  }

  const handleJoinMeeting = () => {
    if (startingMeet || !isCreateMessage) return;
    setStartingMeet(true);
    let stripTitle = channelTitle.replace(/[&\/\\#, +()$~%.'":*?<>{}]/g, "_");
    let parseChannel = type === "DIRECT" ? "Meeting_Room" : stripTitle;
    let payload = {
      channel_id: channelId,
      host: false,
      room_name: slug + "::" + parseChannel + "::" + channelId,
    };
    if (selectedChannel.slug && sharedWs[slug]) {
      const sharedPayload = { slug: slug, token: sharedWs[slug].access_token, is_shared: true };
      payload = {
        ...payload,
        sharedPayload: sharedPayload,
      };
    }
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
    driffTalkMessage: _t("DRIFF_TALK_CHAT_MESSAGE", "This call is private to the participants in this channel"),
    userStartMeet: _t("DRIFF_TALK_USER_START", "::name:: started a video meeting", { name: author.name }),
    joinMeeting: _t("JOIN_MEETING", "Join Meeting"),
    meetingEnded: _t("MEETING_ENDED", "Meeting ended"),
  };
  return (
    <Wrapper className="google-meeting">
      <SvgIconFeather icon="video" />
      <span>{dictionary.userStartMeet}</span>
      {isCreateMessage ? (
        <button className="btn btn-primary" onClick={handleJoinMeeting}>
          <SvgIconFeather icon="user-plus" className={"mr-2"} /> {dictionary.joinMeeting}
        </button>
      ) : (
        <button className="btn btn-secondary" disabled={true}>
          {dictionary.meetingEnded}
        </button>
      )}

      <span className="text-muted">{dictionary.driffTalkMessage}</span>
      <span className="reply-date created text-muted">{timeFormat.todayOrYesterdayDate(reply.created_at.timestamp)}</span>
    </Wrapper>
  );
};

export default DriffTalkMessage;
