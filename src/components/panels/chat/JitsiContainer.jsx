import React, { useState } from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import JitsiIframe from "./JitsiIframe";
import Draggable from "react-draggable";
import { SvgIconFeather } from "../../common";

const Wrapper = styled.div`
  position: absolute;
  z-index: 9999;
  width: 70%;
  height: 70%;
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

const JitsiContainer = () => {
  const jitsi = useSelector((state) => state.chat.jitsi);
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

  if (!jitsi) return null;
  return (
    <>
      <Draggable positionOffset={{ x: "-50%", y: "-50%" }} onDrag={onControlledDrag} position={controlledPosition} onStart={onStart} onStop={onStop}>
        <Wrapper className={`jitsi-container ${size}`}>
          {jitsi && (
            <>
              <div className="buttons-container">
                <div className="ml-auto">
                  <SvgIconFeather className="mr-2" icon="minimize" onClick={handleMinimize} />
                  <SvgIconFeather icon="maximize" onClick={handleMaximize} />
                </div>
              </div>
              <div className="j-container" style={{ position: "relative" }}>
                <JitsiIframe channel={jitsi} />
                {isDragging && <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, top: 0, zIndex: 9999 }}></div>}
              </div>
            </>
          )}
        </Wrapper>
      </Draggable>
    </>
  );
};

export default JitsiContainer;
