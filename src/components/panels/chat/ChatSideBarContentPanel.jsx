import React from "react";
import {useSelector} from "react-redux";
import {withRouter} from "react-router-dom";
import styled from "styled-components";
import {useLoadLastVisitedChannel} from "../../hooks";
//import ChatRecentList from "../../list/chat/ChatRecentList";
import ChannelsSidebar from "../../list/chat/ChannelsSidebar";
import ChatContactsList from "../../list/chat/ChatContactsList";

const Wrapper = styled.div`
    overflow: hidden; 
    // outline: currentcolor none medium;
`;

const ChatSidebarContentPanel = (props) => {

    const {pill = "pills-home", search} = props;
    const isLoaded = useSelector(state => state.settings.isLoaded);
    useLoadLastVisitedChannel(props);

    return (
        <Wrapper className={`chat-sidebar-content ${props.className}`} tabIndex="1">

            <div className="tab-content pt-3" id="pills-tabContent">
                <div className={`tab-pane fade ${pill === "pills-home" && "show active"}`} id="pills-home"
                     role="tabpanel"
                     aria-labelledby="pills-home-tab">
                    <p className="small mb-0">Recent chats</p>
                    {
                        isLoaded &&
                        <ChannelsSidebar search={search}/>
                    }
                    {/* <div className="chat-lists">
                     <div className="list-group list-group-flush">
                     <ChatRecentList/>
                     </div>
                     </div> */}
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