import React from "react";
import {useDispatch} from "react-redux";
import styled from "styled-components";
import {addToModals} from "../../../redux/actions/globalActions";
import {SvgIconFeather} from "../../common";
import ChannelsSidebar from "../../list/chat/ChannelsSidebar";
import ChatContactsList from "../../list/chat/ChatContactsList";

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

const NewGroupButton = styled.div`
    cursor: pointer;
    color: #BEBEBE;
    transition: color 0.3s;
    span {
        position: relative;
        top: 1px;
        color: #BEBEBE;
        transition: color 0.3s;
    }
    svg {
        margin-right: 8px;
    }
    &:hover {
        color: #7A1B8B;
        span {
            color: #7A1B8B
        }
    }
`;


const ChatSidebarContentPanel = (props) => {

    const {className = "", pill = "pills-home", search, channels, userChannels, selectedChannel} = props;

    const dispatch = useDispatch();

    const handleOpenGropupChatModal = () => {
        let payload = {
            type: "chat_create_edit",
            mode: "new",
        };

        dispatch(
            addToModals(payload),
        );
    };

    return (
        <Wrapper className={`chat-sidebar-content ${className}`} tabIndex="1">

            <div className="tab-content pt-3" id="pills-tabContent">
                <div className={`tab-pane fade ${pill === "pills-home" && "show active"}`} id="pills-home"
                     role="tabpanel"
                     aria-labelledby="pills-home-tab">
                    <div className="d-flex align-items-center recent-new-group-wrapper">
                        <p className="small mb-0">Recent chats</p>

                        <NewGroupButton className="small mb-0 text-right ml-auto" onClick={handleOpenGropupChatModal}>
                            <SvgIconFeather width={14} height={14} icon="plus"/>
                            <span>New group chat</span>
                        </NewGroupButton>
                    </div>
                    <ChannelsSidebar search={search}
                                     channels={channels} selectedChannel={selectedChannel}/>
                </div>
                <div className={`tab-pane fade ${pill === "pills-contact" && "show active"}`} id="pills-contact"
                     role="tabpanel"
                     aria-labelledby="pills-contact-tab">
                    <ChatContactsList search={search}
                                      channels={channels}
                                      userChannels={userChannels}
                                      selectedChannel={selectedChannel}/>
                </div>
            </div>
        </Wrapper>
    );
};

export default React.memo(ChatSidebarContentPanel);