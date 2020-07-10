import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useUserChannels } from "../../hooks";
import { ChatContentPanel, ChatSidebarPanel } from "../chat";

const Wrapper = styled.div``;

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
    <Wrapper className={`company-chat-panel container-fluid h-100 ${className}`}>
      <div className="row no-gutters chat-block">
        <ChatSidebarPanel className={"col-lg-4 border-right"} channels={channels} userChannels={userChannels} selectedChannel={selectedChannel} />
        <ChatContentPanel className={"col-lg-8"} selectedChannel={selectedChannel} />
      </div>
    </Wrapper>
  );
};

export default React.memo(CompanyChatPanel);
