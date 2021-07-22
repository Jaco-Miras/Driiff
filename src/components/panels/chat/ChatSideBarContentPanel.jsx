import React from "react";
import styled from "styled-components";
import ChannelsSidebar from "../../list/chat/ChannelsSidebar";
//import ChatContactsList from "../../list/chat/ChatContactsList";
import { SvgIconFeather } from "../../common";
//import { useUserChannels } from "../../hooks";
//import { useSelector } from "react-redux";

const Wrapper = styled.div`
  // overflow: auto !important;
  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;

  position: relative;

  .recent-new-group-wrapper {
    padding-right: 24px;
  }

  .badge-filter {
    justify-content: center;
    align-items: center;
    display: inline-flex;
    margin-left: 0;

    @media (max-width: 991.99px) {
      margin-left: 1.5rem;
    }
    @media (max-width: 480px) {
      margin-left: 1rem;
    }
  }
  // .tab-panel {
  //   overflow-x: hidden;
  // }
  .tab-content,
  .tab-panel {
    display: flex;
    height: 100%;
  }
  .tab-content {
    flex-flow: column;
  }
  .badge-filter {
    width: 130px;
  }
`;

const ChatSidebarContentPanel = (props) => {
  const { className = "", pill = "pills-home", search, dictionary, resetFilter } = props;

  return (
    <Wrapper className={`chat-sidebar-content ${className}`} tabIndex="1">
      <div className="tab-content pt-2" id="pills-tabContent">
        {pill === "pills-workspace" && (
          <div className="badge-filter badge badge badge-info text-white cursor-pointer mb-2" onClick={resetFilter}>
            <SvgIconFeather className="mr-1" icon="x" width={11} height={11} onClick={resetFilter} /> Workspace chats
          </div>
        )}
        {pill === "pills-home" && (
          <div className={`tab-panel fade ${pill === "pills-home" && "show active"}`} id="pills-home" role="tabpanel" aria-labelledby="pills-home-tab">
            <ChannelsSidebar search={search} workspace={null} dictionary={dictionary} />
          </div>
        )}
        {/* <div className={`tab-panel fade ${pill === "pills-contact" && "show active"}`} id="pills-contact" role="tabpanel" aria-labelledby="pills-contact-tab">
          <div className="badge-filter badge badge badge-info text-white cursor-pointer mb-2" onClick={resetFilter}>
            <SvgIconFeather className="mr-1" icon="x" width={11} height={11} onClick={resetFilter} /> Direct chats
          </div>
          <ChatContactsList search={search} channels={channels} userChannels={userChannels} selectedChannel={selectedChannel} dictionary={dictionary} />
        </div> */}
        {pill === "pills-workspace" && (
          <div className={`tab-panel workspace-chat-list fade ${pill === "pills-workspace" && "show active"}`} id="pills-workspace" role="tabpanel" aria-labelledby="pills-workspace-tab">
            <ChannelsSidebar search={search} workspace={true} dictionary={dictionary} />
          </div>
        )}
      </div>
    </Wrapper>
  );
};

export default ChatSidebarContentPanel;
