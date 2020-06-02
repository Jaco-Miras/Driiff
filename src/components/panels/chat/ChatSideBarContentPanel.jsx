import React from "react";
import {useSelector} from "react-redux";
import {withRouter} from "react-router-dom";
import styled from "styled-components";
import {useDispatch} from "react-redux";
import {useLoadLastVisitedChannel} from "../../hooks";
//import ChatRecentList from "../../list/chat/ChatRecentList";
import ChannelsSidebar from "../../list/chat/ChannelsSidebar";
import ChatContactsList from "../../list/chat/ChatContactsList";
import {addToModals} from "../../../redux/actions/globalActions";
import {SvgIconFeather} from "../../common";

const Wrapper = styled.div`
    overflow: auto !important;
    &::-webkit-scrollbar {
        display: none;
    }
    -ms-overflow-style: none;
    scrollbar-width: none;
`;

const NewGroupButton = styled.div`
    cursor: pointer;
    cursor: hand;

    span {
        position: relative;
        top: 1px;
    }
`;


const ChatSidebarContentPanel = (props) => {

    const {className = "", pill = "pills-home", search} = props;
    const isLoaded = useSelector(state => state.settings.user.isLoaded);
    useLoadLastVisitedChannel(props);

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
                    <p className="small mb-0">Recent chats</p>

                    <NewGroupButton className="small mb-0 text-right ml-auto" onClick={handleOpenGropupChatModal}>
                        <SvgIconFeather width={18} height={18} icon="plus"/>
                        <span>New group chat</span>
                    </NewGroupButton>

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