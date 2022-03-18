import React, { useState } from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import JitsiIframe from "./JitsiIframe";
import Draggable from "react-draggable";
import { SvgIconFeather } from "../../common";

const Wrapper = styled.div`
  // > div:first-child {
  //   position: fixed;
  //   top: 0;
  //   left: 0;
  //   height: 70%;
  //   width: 70%;
  //   z-index: 9999;
  //   left: 50%;
  //   top: 50%;
  //   transform: translate(-50%, -50%);
  // }

  // > div:first-child {
  //   position: absolute;
  //   cursor: move;
  //   color: black;
  //   width: 70%;
  //   height: 70%;
  //   border-radius: 5px;
  //   padding: 1em;
  //   user-select: none;
  //   z-index: 9999;
  //   top: 0;
  // }
  position: absolute;
  z-index: 9999;
  width: 70%;
  height: 70%;
  top: 0;
  left: 0;
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
`;

const JitsiContainer = () => {
  const jitsi = useSelector((state) => state.chat.jitsi);
  const [size, setSize] = useState("maximize");
  const handleMinimize = () => {
    setSize("minimize");
  };
  const handleMaximize = () => {
    setSize("maximize");
  };
  if (!jitsi) return null;
  return (
    <Draggable>
      <Wrapper className={`jitsi-container ${size}`}>
        {jitsi && (
          <>
            <div className="buttons-container">
              <div className="ml-auto">
                <SvgIconFeather className="mr-2" icon="minimize" onClick={handleMinimize} />
                <SvgIconFeather icon="maximize" onClick={handleMaximize} />
              </div>
            </div>
            <div className="j-container">
              <JitsiIframe channel={jitsi} />
            </div>
          </>
        )}
      </Wrapper>
    </Draggable>
  );
};

export default JitsiContainer;
