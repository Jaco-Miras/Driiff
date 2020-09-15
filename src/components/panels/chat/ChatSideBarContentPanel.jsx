import React, {useEffect} from "react";
import {useDispatch} from "react-redux";
import styled from "styled-components";
import ChannelsSidebar from "../../list/chat/ChannelsSidebar";
import ChatContactsList from "../../list/chat/ChatContactsList";
import {getChannelDrafts} from "../../../redux/actions/chatActions";

const Wrapper = styled.div`
  overflow: auto !important;
  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
  .recent-new-group-wrapper {
    padding-right: 24px;
  }
`;

const ChatSidebarContentPanel = (props) => {

  const {className = "", pill = "pills-home", search, channels, userChannels, selectedChannel, dictionary} = props;

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getChannelDrafts());
  }, []);

  return (
    <Wrapper className={`chat-sidebar-content ${className}`} tabIndex="1">
      <div className="tab-content pt-3" id="pills-tabContent">
        <div className={`tab-panel fade ${pill === "pills-home" && "show active"}`} id="pills-home" role="tabpanel"
             aria-labelledby="pills-home-tab">
          <ChannelsSidebar
            search={search} workspace={null} channels={channels} selectedChannel={selectedChannel}
            dictionary={dictionary}/>
        </div>
        <div className={`tab-panel fade ${pill === "pills-contact" && "show active"}`} id="pills-contact"
             role="tabpanel" aria-labelledby="pills-contact-tab">
          <ChatContactsList
            search={search} channels={channels} userChannels={userChannels}
            selectedChannel={selectedChannel} dictionary={dictionary}/>
        </div>
        <div className={`tab-panel workspace-chat-list fade ${pill === "pills-workspace" && "show active"}`}
             id="pills-workspace" role="tabpanel" aria-labelledby="pills-workspace-tab">
          <ChannelsSidebar
            search={search} workspace={true} channels={channels} selectedChannel={selectedChannel}
            dictionary={dictionary}/>
        </div>
      </div>
    </Wrapper>
  );
};

export default React.memo(ChatSidebarContentPanel);
