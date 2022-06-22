import React, { useRef, } from "react";
import { useDispatch, } from "react-redux";
import { JaaSMeeting } from "@jitsi/react-sdk";
import { isMobile } from "react-device-detect";
import { clearJitsi } from "../../redux/actions/chatActions";
import { useParams } from "react-router-dom";

const VideoMeeting = (props) => {
  const params = useParams();
  const appId = "vpaas-magic-cookie-c0cc9d62fd3340d58d783df7885be71c";
  const dispatch = useDispatch();
  const apiRef = useRef(null);


  const handleClearJitsi = () => {
    dispatch(clearJitsi());
  };

  return (
    <JaaSMeeting
      appId={appId}
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
