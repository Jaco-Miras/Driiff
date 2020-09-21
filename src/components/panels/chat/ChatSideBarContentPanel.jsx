import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import ChannelsSidebar from "../../list/chat/ChannelsSidebar";
import ChatContactsList from "../../list/chat/ChatContactsList";
import { getChannelDrafts } from "../../../redux/actions/chatActions";
import { SvgIconFeather } from "../../common";

const Wrapper = styled.div`
  ${'' /* padding-left: 1.5rem; */}
  overflow: auto !important;
  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;

  position: relative;
  &:after {
    content: "";
    width: 1px;
    height: calc(100% - 24px);
    display: block;
    background: #dee2e6;
    position: absolute;
    top: 0;
    right: 0;
    z-index: 6;
  }

  .recent-new-group-wrapper {
    padding-right: 24px;
  }

  .badge-filter {
    justify-content: center;
    align-items: center;
    display: inline-flex;
  }
`;

const ChatSidebarContentPanel = (props) => {
  const { className = "", pill = "pills-home", search, channels, userChannels, selectedChannel, dictionary, resetFilter } = props;

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getChannelDrafts());
  }, []);

  return (
    <Wrapper className={`chat-sidebar-content testttt ${className}`} tabIndex="1">
      <div className="tab-content pt-3" id="pills-tabContent">
        <div className={`tab-panel fade ${pill === "pills-home" && "show active"}`} id="pills-home" role="tabpanel" aria-labelledby="pills-home-tab">
          <ChannelsSidebar search={search} workspace={null} channels={channels} selectedChannel={selectedChannel} dictionary={dictionary} />
        </div>
        <div className={`tab-panel fade ${pill === "pills-contact" && "show active"}`} id="pills-contact" role="tabpanel" aria-labelledby="pills-contact-tab">
          <div className="badge-filter badge badge badge-info text-white cursor-pointer mb-2" onClick={resetFilter}>
            <SvgIconFeather className="mr-1" icon="x" width={11} height={11} onClick={resetFilter} /> Direct chats
          </div>
          <ChatContactsList search={search} channels={channels} userChannels={userChannels} selectedChannel={selectedChannel} dictionary={dictionary} />
        </div>
        <div className={`tab-panel workspace-chat-list fade ${pill === "pills-workspace" && "show active"}`} id="pills-workspace" role="tabpanel" aria-labelledby="pills-workspace-tab">
          <div className="badge-filter badge badge badge-info text-white cursor-pointer mb-2" onClick={resetFilter}>
            <SvgIconFeather className="mr-1" icon="x" width={11} height={11} onClick={resetFilter} /> Workspace chats
          </div>
          <ChannelsSidebar search={search} workspace={true} channels={channels} selectedChannel={selectedChannel} dictionary={dictionary} />
        </div>
      </div>
    </Wrapper>
  );
};

export default React.memo(ChatSidebarContentPanel);
