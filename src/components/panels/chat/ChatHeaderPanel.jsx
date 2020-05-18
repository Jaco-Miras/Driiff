import React from "react";
import {useSelector} from "react-redux";
import styled from "styled-components";
import {Avatar, SvgIconFeather} from "../../common";

const Wrapper = styled.div`
`;

const Typing = styled.div`
    opacity: ${props => props.isTyping ? "1" : 0};
`;

const IconButton = styled(SvgIconFeather)`
    border: 1px solid #afb8bd;
    border-radius: 8px;
    padding: 0px 12px;
    height: 30px;
    width: 40px;
`;

const ChatHeaderPanel = (props) => {

    const {className = ""} = props;

    const chatChannel = useSelector(state => state.chat.selectedChannel);

    if (chatChannel === null)
        return <></>;

    return (
        <Wrapper className={`chat-header border-bottom ${className}`}>
            <div className="d-flex align-items-center">
                <div className="pr-3">
                    {
                        chatChannel.members.map(m => {
                            return <Avatar name={m.name} imageLink={m.profile_image_link}/>;
                        })
                    }
                </div>
                <div>
                    <h6 className="mb-1">{chatChannel.title}</h6>
                    <Typing isTyping={chatChannel.typing} className="m-0 small text-success">typing...</Typing>
                </div>
                <div className="ml-auto">
                    <ul className="nav align-items-center">
                        <li className="mr-4 d-sm-inline d-none">
                            <IconButton icon={`edit-3`}/>
                        </li>
                        <li className="mr-4 d-sm-inline d-none">
                            <IconButton icon={`trash`}/>
                        </li>
                        <li className="ml-4 mobile-chat-close-btn">
                            <IconButton icon={`x`}/>
                        </li>
                    </ul>
                </div>
            </div>
        </Wrapper>
    );
};

export default React.memo(ChatHeaderPanel);