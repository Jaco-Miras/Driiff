import {Emoji} from "emoji-mart";
import React from "react";
import {useDispatch} from "react-redux";
import styled from "styled-components";
import {chatReaction} from "../../../../redux/actions/chatActions";
import UserListPopUp from "../../../common/UserListPopUp";

const EmojiContainer = styled.div`
    background: #dedede;
    padding: 4px;
    display: flex;
    align-items: center;
    border-radius: 10px;
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

    const dispatch = useDispatch();

    const handleToggleReact = () => {
        let payload = {
            message_id: reply.id,
            react_type: type,
        };
        dispatch(chatReaction(payload));
    };

    return (
        <EmojiContainer onClick={handleToggleReact}>
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