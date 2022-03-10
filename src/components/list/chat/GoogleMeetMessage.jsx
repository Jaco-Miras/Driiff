import React from "react";
import styled from "styled-components";
import { SvgIconFeather } from "../../common";
// import { copyTextToClipboard } from "../../../helpers/commonFunctions";
// import { useToaster } from "../../hooks";

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

const GoogleMeetMessage = (props) => {
  const { reply, timeFormat } = props;
  const data = JSON.parse(reply.body.replace("GOOGLE_MEETING::", ""));
  const handleJoinMeeting = () => {
    window.open(data.google_meet_event.hangoutLink, "_blank");
  };
  // const toaster = useToaster();
  // const handleCopyLink = () => {
  //   copyTextToClipboard(toaster, data.google_meet_event.hangoutLink);
  // };
  return (
    <Wrapper className="google-meeting">
      <SvgIconFeather icon="google-meet" />
      <span>{data.author.name} started a video meeting</span>
      <button className="btn btn-primary" onClick={handleJoinMeeting}>
        <SvgIconFeather icon="user-plus" className={"mr-2"} /> Join Meeting
      </button>
      <span className="text-muted">
        This meeting is private to the participants in this channel
        {/* {data.google_meet_event?.hangoutLink} <SvgIconFeather icon="copy" onClick={handleCopyLink} /> */}
      </span>
      <span className="reply-date created text-muted">{timeFormat.todayOrYesterdayDate(reply.created_at.timestamp)}</span>
    </Wrapper>
  );
};

export default GoogleMeetMessage;
