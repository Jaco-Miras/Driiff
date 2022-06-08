import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { JaaSMeeting } from "@jitsi/react-sdk";

import styled from "styled-components";
import { isMobile } from "react-device-detect";
import { clearJitsi } from "../../redux/actions/chatActions";
import { JitsiMeeting } from "@jitsi/react-sdk";

import Draggable from "react-draggable";
import { useParams } from "react-router-dom";

const Wrapper = styled.div`
  position: absolute;
  z-index: 9999;
  width: 70%;
  height: 80%;
  top: 50%;
  left: 50%;
  cursor: move;
  padding: 1rem;
  background: #29323f;
  padding-top: 10px;
  .j-container {
    width: calc(100% - 30px);
    height: calc(100% - 30px);
    > div:first-child {
      width: 100%;
      height: 100%;
    }
  }
  .buttons-container {
    display: flex;
    svg {
      width: 1rem;
      height: 1rem;
      color: #fff;
      cursor: pointer;
    }
  }
  &.minimize {
    width: 350px;
    height: 300px;
  }
  .react-draggable-transparent-selection .draggable-iframe-cover {
    display: block;
    z-index: 999999;
  }

  .draggable-iframe-cover {
    position: absolute;
    display: none;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }
`;


const VideoMeeting = (props) => {
  const params = useParams();
  const appId = "vpaas-magic-cookie-c0cc9d62fd3340d58d783df7885be71c";
  const dispatch = useDispatch();
  const apiRef = useRef(null);

  //const [activeDrags, setActiveDrags] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [controlledPosition, setControlledPosition] = useState({
    x: 0,
    y: 0,
  });

  const onStart = () => {
    setIsDragging(true);
  };

  const onStop = () => {
    setIsDragging(false);
  };

  const onControlledDrag = (e, position) => {
    const { x, y } = position;
    setControlledPosition({ x, y });
  };

  const handleClearJitsi = () => {
    dispatch(clearJitsi());
  };

  return (
    <JaaSMeeting
      appId={appId}
      jwt={params?.jwt_token}
      roomName={params?.room_name}
      configOverwrite={{
        startWithAudioMuted: true,
        hiddenPremeetingButtons: ["microphone"],
        enableLobbyChat: false,
        disableInviteFunctions: true,
        disableDeepLinking: isMobile,
        liveStreamingEnabled: false,
        transcribingEnabled: false,
        // Configs for prejoin page.
        prejoinConfig: {
          // When 'true', it shows an intermediate page before joining, where the user can configure their devices.
          // This replaces `prejoinPageEnabled`.
          enabled: false,
          // List of buttons to hide from the extra join options dropdown.
          hideExtraJoinButtons: ["no-audio", "by-phone"],
        },
        toolbarButtons: [
          "camera",
          "desktop",
          "download",
          "embedmeeting",
          "etherpad",
          "feedback",
          "filmstrip",
          "fullscreen",
          "hangup",
          "help",
          "highlight",
          "microphone",
          "mute-everyone",
          "mute-video-everyone",
          "participants-pane",
          "profile",
          "raisehand",
          "recording",
          "security",
          "select-background",
          "settings",
          "sharedvideo",
          "shortcuts",
          "stats",
          "tileview",
          "toggle-camera",
          "__end",
        ],
      }}
      onReadyToClose={handleClearJitsi}
      onApiReady={(externalApi) => {
        console.log(externalApi, "jitsi api");
        apiRef.current = externalApi;
      }}
      getIFrameRef={node => node.style.height = '100vh'}
    />



  );
};

export default VideoMeeting;
