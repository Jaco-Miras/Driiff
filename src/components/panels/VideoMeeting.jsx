import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { JaaSMeeting } from "@jitsi/react-sdk";

import styled from "styled-components";
import { isMobile } from "react-device-detect";
import { clearJitsi } from "../../redux/actions/chatActions";
import { JitsiMeeting } from "@jitsi/react-sdk";

import Draggable from "react-draggable";

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
  const domain = "meet.jit.si";
  const jitsi = useSelector((state) => state.chat.jitsi);
  const [jwt, setJwt] = useState("");
  const [username, setUsername] = useState("");
  const [size, setSize] = useState("maximize");
  //const [activeDrags, setActiveDrags] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [controlledPosition, setControlledPosition] = useState({
    x: 0,
    y: 0,
  });
  const handleMinimize = () => {
    const x = window.innerWidth / 2 - 175;
    setControlledPosition({ x: x, y: -275 });
    if (size === "minimize") return;
    setSize("minimize");
  };
  const handleMaximize = () => {
    setControlledPosition({ x: 0, y: 0 });
    if (size === "maximize") return;
    setSize("maximize");
  };

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

  const handleJwt = (e) => {
    setJwt(e.target.value);
  };
  const handleUserName = (e) => {
    setUsername(e.target.value);
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
      <input placeholder="Enter room name" onChange={handleUserName} style={{ display: "flex", alignSelf: "center", border: "3px solid red" }} />
      <input placeholder="Enter JWT" onChange={handleJwt} style={{ display: "flex", alignSelf: "center", border: "3px solid red" }} />
      {jwt && (
        <Draggable positionOffset={{ x: "-50%", y: "-50%" }} onDrag={onControlledDrag} position={controlledPosition} onStart={onStart} onStop={onStop}>
          <Wrapper className={`jitsi-container ${size}`}>
            <div className="j-container" style={{ position: "relative" }}>
              <JitsiMeeting
                domain={domain}
                roomName="PleaseUseAGoodRoomName"
                configOverwrite={{
                  startWithAudioMuted: true,
                  disableModeratorIndicator: true,
                  startScreenSharing: true,
                  enableEmailInStats: false,
                }}
                interfaceConfigOverwrite={{
                  DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
                }}
                userInfo={{
                  displayName: username,
                }}
                onApiReady={(externalApi) => {
                  // here you can attach custom event listeners to the Jitsi Meet External API
                  // you can also store it locally to execute commands
                }}
                jwt={jwt}
              />
              {isDragging && <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, top: 0, zIndex: 9999 }}></div>}
            </div>
          </Wrapper>
        </Draggable>
      )}
    </div>
  );
};

export default VideoMeeting;
