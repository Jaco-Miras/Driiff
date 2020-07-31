import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useUserChannels } from "../../hooks";
import { ChatContentPanel, ChatSidebarPanel } from "../chat";

const Wrapper = styled.div`
  ${'' /* @media all and (max-width: 1200px) {
    padding: 1.875rem 15px 15px 15px
  } */}

  @media all and (max-width: 1450px) and (min-width: 992px)  {
    .chat-sidebar-panel {
      width: 340px;
      flex: none;
      min-width: 340px;
    }
    .chat-content {
      flex: 0 0 calc(100% - 340px);
      max-width: calc(100% - 340px);
    }
  }
`;

const CompanyChatPanel = (props) => {
  const { className = "" } = props;

  const { lastVisitedChannel, channels, userChannels, selectedChannel, actions: channelActions } = useUserChannels();
  const [useLastVisitedChannel, setUseLastVisitedChannel] = useState(null);

  useEffect(() => {
    if (typeof props.match.params.code === "undefined") {
      setUseLastVisitedChannel(true);
    } else {
      setUseLastVisitedChannel(false);
    }

    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setLastVisitedChannel = () => {
    if (lastVisitedChannel) {
      channelActions.select(lastVisitedChannel, () => {
        //setActiveTabPill(lastVisitedChannel.type === "DIRECT" ? "contact" : "home");
        props.history.push(`/chat/${lastVisitedChannel.code}`);
      });
    } else {
      channelActions.fetchLastVisited((err, res) => {
        channelActions.select(res.data, () => {
          //setActiveTabPill(res.data.type === "DIRECT" ? "contact" : "home");
          props.history.push(`/chat/${res.data.code}`);
        });
      });
    }
  };

  const setVisitedChannel = () => {
    channelActions.fetchByCode(props.match.params.code, (err, res) => {
      if (res) {
        channelActions.select(res.data);
        //setActiveTabPill(res.data.type === "DIRECT" ? "contact" : "home");
      }
    });
  };

  useEffect(() => {
    if (useLastVisitedChannel !== null) {
      if (useLastVisitedChannel) {
        setLastVisitedChannel();
      } else {
        setVisitedChannel();
      }
    }
  }, [useLastVisitedChannel]);

  return (
    <Wrapper className={`company-chat container-fluid ${className}`}>
      <div className="row no-gutters chat-block">
        <ChatSidebarPanel className={"col-lg-4 chat-sidebar-panel border-right"} channels={channels} userChannels={userChannels} selectedChannel={selectedChannel} />
        <ChatContentPanel className={"col-lg-8 chat-content-panel"} selectedChannel={selectedChannel} />
      </div>
    </Wrapper>
  );
};

export default React.memo(CompanyChatPanel);
