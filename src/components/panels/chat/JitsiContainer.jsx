import React from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import JitsiIframe from "./JitsiIframe";

const Wrapper = styled.div`
  > div:first-child {
    position: fixed;
    top: 0;
    left: 0;
    height: 70%;
    width: 70%;
    z-index: 99;
    left: 50%;
    transform: translate(-50%, 0);
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
`;

const JitsiContainer = () => {
  const jitsi = useSelector((state) => state.chat.jitsi);
  return <Wrapper>{jitsi && <JitsiIframe channel={jitsi} />}</Wrapper>;
};

export default JitsiContainer;
