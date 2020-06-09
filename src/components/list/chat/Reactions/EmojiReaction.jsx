import {Emoji} from "emoji-mart";
import React from "react";
import {useDispatch} from "react-redux";
import styled from "styled-components";
import {postChatReaction} from "../../../../redux/actions/chatActions";
import {UserListPopUp} from "../../../common";
import useChatMessageActions from "../../../hooks/useChatMessageActions";

const EmojiContainer = styled.div`
    ${"" /* background: #dedede; */}
    background: ${props => props.isAuthor ? "rgba(151, 81, 163, 0.6)" : "rgba(240, 240, 240, 0.8)"};
    padding: 4px;
    display: flex;
    align-items: center;
    border-radius: 8px;
    margin: 0 2px;
    cursor: pointer;
    position: relative;
    :hover {
        .chat-emoji-users-list {
            visibility: visible;
        }
    }
`;

const StyledUserListPopUp = styled(UserListPopUp)`
    position: absolute;
    bottom: 100%;
    max-width: 250px;
    left: ${props => props.isAuthor ? "unset" : "5px"};
    right: ${props => props.isAuthor ? "5px" : "unset"};
    visibility: hidden;
    ul {
        max-height: 250px;
    }
`;

const EmojiReaction = props => {

    const {type, count, reactions, isAuthor, reply} = props;

    const chatMessageAction = useChatMessageActions();

    const handleToggleReact = () => {
        chatMessageAction.react(reply.id, type);
    };

    return (
        <EmojiContainer onClick={handleToggleReact} isAuthor={isAuthor} className="chat-emoji">
            <Emoji emoji={type} size={16}/>
            {count > 1 ? <span>{count}</span> : null}
            <StyledUserListPopUp
                className={"chat-emoji-users-list"}
                isAuthor={isAuthor}
                users={reactions.map(r => {
                    return {
                        id: r.user_id,
                        name: r.user_name,
                        profile_image_link: r.profile_image_link,
                        partial_name: null,
                    };
                })}
            />
        </EmojiContainer>
    );
};

export default EmojiReaction;