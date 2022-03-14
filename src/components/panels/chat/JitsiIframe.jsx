import React, { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { JitsiMeeting, JaaSMeeting } from "@jitsi/react-sdk";
import { clearJitsi } from "../../../redux/actions/chatActions";

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

const VideoConference = (props) => {
  //const { jitsi } = props;
  const dispatch = useDispatch();
  const apiRef = useRef(null);
  const jitsi = useSelector((state) => state.chat.jitsi);
  const appId = "vpaas-magic-cookie-c0cc9d62fd3340d58d783df7885be71c";
  const handleClearJitsi = () => {
    dispatch(clearJitsi());
  };
  //   const jitsiContainerId = "jitsi-container-id";
  //   const [jitsiInstance, setJitsiInstance] = React.useState({});

  //   const loadJitsiScript = () => {
  //     let resolveLoadJitsiScriptPromise = null;

  //     const loadJitsiScriptPromise = new Promise((resolve) => {
  //       resolveLoadJitsiScriptPromise = resolve;
  //     });

  //     const script = document.createElement("script");
  //     script.src = "https://8x8.vc/external_api.js";
  //     script.async = true;
  //     script.onload = () => resolveLoadJitsiScriptPromise(true);
  //     document.body.appendChild(script);

  //     return loadJitsiScriptPromise;
  //   };

  //   const initialiseJitsi = async () => {
  //     if (!window.JitsiMeetExternalAPI) {
  //       await loadJitsiScript();
  //     }

  //     const _jitsi = new window.JitsiMeetExternalAPI("8x8.vc", {
  //       parentNode: document.getElementById(jitsiContainerId),
  //       jwt:
  //         jitsi._token,
  //       roomName: jitsi.roomName,
  //     });

  //     setJitsiInstance(_jitsi);
  //   };

  //   React.useEffect(() => {
  //     initialiseJitsi();

  //     return () => jitsi?.dispose?.();
  //   }, []);

  // return <div id={jitsiContainerId} />;
  return (
    <JaaSMeeting
      appId={appId}
      jwt={jitsi._token}
      roomName={getSlug() + "-" + jitsi.channel_id + "-" + jitsi.room_name}
      configOverwrite={{
        startWithAudioMuted: true,
        hiddenPremeetingButtons: ["microphone"],
        enableLobbyChat: false,
        toolbarButtons: [
          "camera",
          "closedcaptions",
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
          "invite",
          "livestreaming",
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
          "shareaudio",
          "sharedvideo",
          "shortcuts",
          "stats",
          "tileview",
          "toggle-camera",
          "videoquality",
          "__end",
        ],
      }}
      onReadyToClose={handleClearJitsi}
      onApiReady={(externalApi) => {
        console.log(externalApi, "jitsi api");
        apiRef.current = externalApi;
      }}
    />
  );
};

export default VideoConference;
