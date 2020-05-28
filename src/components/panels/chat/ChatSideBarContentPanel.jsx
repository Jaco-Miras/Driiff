import React from "react";
import {useSelector} from "react-redux";
import {withRouter} from "react-router-dom";
import styled from "styled-components";
import {useLoadLastVisitedChannel} from "../../hooks";
//import ChatRecentList from "../../list/chat/ChatRecentList";
import ChannelsSidebar from "../../list/chat/ChannelsSidebar";
import ChatContactsList from "../../list/chat/ChatContactsList";

const Wrapper = styled.div`
    overflow: auto !important;
    &::-webkit-scrollbar {
        display: none;
    }
    -ms-overflow-style: none;
    scrollbar-width: none;    
`;

const ChatSidebarContentPanel = (props) => {

    const {className = "", pill = "pills-home", search} = props;
    const isLoaded = useSelector(state => state.settings.isLoaded);
    useLoadLastVisitedChannel(props);

    return (
        <Wrapper className={`chat-sidebar-content ${className}`} tabIndex="1">

            <div className="tab-content pt-3" id="pills-tabContent">
                <div className={`tab-pane fade ${pill === "pills-home" && "show active"}`} id="pills-home"
                     role="tabpanel"
                     aria-labelledby="pills-home-tab">
                    <p className="small mb-0">Recent chats</p>
                    {
                        isLoaded &&
                        <ChannelsSidebar search={search}/>
                    }
                </div>
                <div className={`tab-pane fade ${pill === "pills-contact" && "show active"}`} id="pills-contact"
                     role="tabpanel"
                     aria-labelledby="pills-contact-tab">
                    <ChatContactsList search={search}/>
                </div>
            </div>
        </Wrapper>
    );
};

export default withRouter(React.memo(ChatSidebarContentPanel));