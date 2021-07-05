import React, { useEffect } from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { SvgIconFeather } from "../../common";
import { useHistory, useParams } from "react-router-dom";
import { useWorkspaceActions } from "../../hooks";

const BackWrapper = styled.span`
  cursor: pointer;
  position: absolute;
  ${(props) => (props.gift ? "top: 10px;" : "")}
  right: 10px;
`;

const MainBackButton = (props) => {
  const history = useHistory();
  const params = useParams();
  const actions = useWorkspaceActions();
  const { driff: driffSettings, user: userSettings } = useSelector((state) => state.settings);
  const workspaces = useSelector((state) => state.workspaces.workspaces);
  const activeTopic = useSelector((state) => state.workspaces.activeTopic);
  const selectedChannel = useSelector((state) => state.chat.selectedChannel);
  const channels = useSelector((state) =>
    Object.values(state.chat.channels).map((channel) => {
      return { id: channel.id, code: channel.code };
    })
  );

  useEffect(() => {
    if (params.workspaceId && activeTopic) {
      if (parseInt(params.workspaceId) !== activeTopic.id && workspaces[params.workspaceId]) {
        // if url params of workspace id is not equal to active workspace id then set workspace and channel
        actions.selectWorkspace(workspaces[params.workspaceId]);
      }
    }
    if (params.code && selectedChannel) {
      if (selectedChannel.code !== params.code) {
        // if active channel code is not equal to chat url channel code then set channel
        let channel = channels.find((c) => c.code === params.code);
        if (channel) actions.selectChannel({ id: channel.id });
      }
    }
  }, [params, workspaces, activeTopic, selectedChannel]);

  // const { actions, workspaces } = useWorkspace();
  // const channels = useSelector((state) => state.chat.channels);
  // const channelActions = useChannelActions();
  // const handleBackClick = () => {
  //   setTimeout(() => {
  //     let url = history.location.pathname;
  //     let pN = url.split("/").filter(function (el) {
  //       return el != "";
  //     });
  //     if (pN[0] === "workspace" && pN[1] === "chat" && typeof workspaces[pN[4]] !== "undefined") {
  //       const companyWs = workspaces[pN[4]];
  //       const scrollComponent = document.getElementById("component-chat-thread");
  //       if (scrollComponent) {
  //         dispatch(
  //           setChannelHistoricalPosition({
  //             channel_id: companyWs.channel.id,
  //             scrollPosition: scrollComponent.scrollHeight - scrollComponent.scrollTop,
  //           })
  //         );
  //       }
  //       actions.selectChannel(channels[companyWs.channel.id]);
  //       actions.selectWorkspace(companyWs);
  //     } else if (pN[0] === "chat") {
  //       const channel = Object.values(channels).find(function (ch) {
  //         return pN[1] == ch.code;
  //       });
  //       if (typeof channel !== "undefined") {
  //         document.body.classList.add("m-chat-channel-closed");
  //         let scrollComponent = document.getElementById("component-chat-thread");
  //         if (scrollComponent) {
  //           channelActions.saveHistoricalPosition(channel, scrollComponent);
  //         }
  //         channelActions.select({ ...channel, selected: true });
  //       }
  //     }
  //   }, 0);
  //   history.goBack();
  // };

  const handleBackClick = () => {
    history.goBack();
  };

  return (
    <BackWrapper
      gift={
        (driffSettings.READ_RELEASE_UPDATES && userSettings.READ_RELEASE_UPDATES && driffSettings.READ_RELEASE_UPDATES.timestamp > userSettings.READ_RELEASE_UPDATES.timestamp) || userSettings?.READ_RELEASE_UPDATES === null ? true : false
      }
    >
      <SvgIconFeather icon="chevron-left" color="#fff" onClick={handleBackClick} />
    </BackWrapper>
  );
};

export default MainBackButton;
