import React from "react";
import styled from "styled-components";
import ChatContactsList from "../../list/chat/ChatContactsList";
//import ChatRecentList from "../../list/chat/ChatRecentList";
import ChannelsSidebar from '../../list/chat/ChannelsSidebar';

const Wrapper = styled.div`
    overflow: hidden; outline: currentcolor none medium;
`;

const ChatSidebarContentPanel = (props) => {

    const {pill = 'pills-home'} = props;

    return (
        <Wrapper className={`chat-sidebar-content ${props.className}`} tabIndex="1">

            <div className="tab-content pt-3" id="pills-tabContent">
                <div className={`tab-pane fade ${pill === 'pills-home' && 'show active'}`} id="pills-home" role="tabpanel"
                     aria-labelledby="pills-home-tab">
                    <p className="small mb-0">Recent chats</p>
                    <ChannelsSidebar/>
                    {/* <div className="chat-lists">
                        <div className="list-group list-group-flush">
                            <ChatRecentList/>
                        </div>
                    </div> */}
                </div>
                <div className={`tab-pane fade ${pill === 'pills-contact' && 'show active'}`} id="pills-contact" role="tabpanel"
                     aria-labelledby="pills-contact-tab">
                    <p className="small mb-0">142 Contacts</p>
                    <div>
                        <ul className="list-group list-group-flush">
                            <li className="list-group-item d-flex align-items-center pl-0 pr-0 pb-3 pt-3">
                                <ChatContactsList name={`Test`} country={`Netherlands`}/>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </Wrapper>
    );
};

export default React.memo(ChatSidebarContentPanel);