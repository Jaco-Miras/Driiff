import React, {useCallback, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import styled from "styled-components";
//import {localizeChatTimestamp} from "../../../helpers/momentFormatJS";
import {joinWorkspace} from "../../../redux/actions/workspaceActions";
import {Avatar, CommonPicker, SvgIconFeather} from "../../common";
import PostInput from "../../forms/PostInput";
import {useIsMember} from "../../hooks";
import {CommentQuote} from "../../list/post/item";

const Wrapper = styled.div`
    position: relative;
    > div > svg:first-child {
        margin-left: 0 !important;
    }
    .chat-footer-buttons svg:last-of-type {
        margin-left: 0 !important;
        margin-right: 0 !important;
    }
    flex: unset;
`;

const ChatInputContainer = styled.div`
    position: relative;
`;

const IconButton = styled(SvgIconFeather)`
    cursor: pointer;
    cursor: hand;
    border: 1px solid #afb8bd;
    height: 37px;
    margin: -1px 8px;
    width: 47px;
    padding: 10px 0;
    border-radius: 8px;
    transition: color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out;
    &:hover {
        background: #afb8bd;
        color: #ffffff;
    }
    &.feather-send {
        border: 1px solid #7a1b8b;
        background-color: #7a1b8b;
        color: #fff;
        &:hover {
            background-color: #8C3B9B;
        }
    }
`;

const Dflex = styled.div`
    // width: 100%;
    &.channel-viewing {
        display: flex;
        flex-wrap: wrap;
        background-color: #f8f8f8;
        text-align: center;
        align-items: center;
        justify-content: center;
        padding: 20px 0;

        > div {
            flex: 0 1 100%;
        }

        .channel-name{
            color: #64625C;
            font-size: 17px;
            font-weight: 600;
        }
        .channel-create {
            letter-spacing: 0;
            margin-bottom: 0;
            color: #B8B8B8;
            font-weight: normal;
            font-size: 19px;
            text-transform: lowercase;
            margin-bottom: 16px;
        }
        .channel-action {
            button {
                background: #7a1b8b;
                color: #fff;
                border: none;
                padding: 8px 15px;
                border-radius: 8px;
                font-size: 16px;
                font-weight: 600;
            }
        }
    }
`;

const NoReply = styled.div`
    width: 100%;

    .alert {
        width: 100%;
        margin-bottom: 0;
        text-align: center;
    }
`;

const PickerContainer = styled(CommonPicker)`
    right: 25px;
    bottom: 70px;
`;

const PostDetailFooter = (props) => {

    const {
        className = "", onShowFileDialog, dropAction, post, parentId = null,
        commentActions, userMention = null, handleClearUserMention = null, commentId = null, innerRef = null,
    } = props;

    const dispatch = useDispatch();
    const ref = {
        picker: useRef(),
    };
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [selectedEmoji, setSelectedEmoji] = useState(null);
    const [selectedGif, setSelectedGif] = useState(null);
    const [sent, setSent] = useState(false);

    const topic = useSelector(state => state.workspaces.activeTopic);
    const user = useSelector(state => state.session.user);

    const handleSend = useCallback(() => {
        setSent(true);
    }, [setSent]);

    const handleClearSent = useCallback(() => {
        setSent(false);
    }, [setSent]);

    const handleShowEmojiPicker = () => {
        setShowEmojiPicker(!showEmojiPicker);
    };

    const onSelectEmoji = (e) => {
        setSelectedEmoji(e);
    };

    const onSelectGif = (e) => {
        setSelectedGif(e);
    };

    const onClearEmoji = () => {
        setSelectedEmoji(null);
    };

    const onClearGif = () => {
        setSelectedGif(null);
        handleSend();
    };

    const handleJoinWorkspace = () => {
        dispatch(
            joinWorkspace({
                group_id: topic.id,
                user_id: user.id,
            }, (err, res) => {

                if (err) return;
                // dispatch(
                //     joinWorkspaceReducer({
                //         channel_id: selectedChannel.id,
                //         topic_id: selectedChannel.entity_id,
                //         user: user,
                //     }),
                // );
            }),
        );
    };

    const isMember = useIsMember(topic && topic.members.length ? topic.members.map(m => m.id) : []);

    return (
        <Wrapper className={`post-detail-footer card-body ${className}`}>
            {
                <Dflex className="d-flex pr-2 pl-2">
                    <CommentQuote commentActions={commentActions} commentId={commentId}/>
                </Dflex>
            }
            {
                isMember &&
                <Dflex className="d-flex align-items-center">
                    {
                        post.is_read_only === 1 ?
                        <NoReply className="d-flex align-items-center">
                            <div class="alert alert-warning">No reply allowed</div>
                        </NoReply>
                                                :
                        <React.Fragment>
                            <div>
                                <Avatar className="mr-2" name={user.name} imageLink={user.profile_image_link}/>
                            </div>
                            <ChatInputContainer ref={innerRef} className="flex-grow-1">
                                <PostInput
                                    handleClearSent={handleClearSent}
                                    sent={sent}
                                    commentId={commentId}
                                    userMention={userMention}
                                    handleClearUserMention={handleClearUserMention}
                                    commentActions={commentActions}
                                    parentId={parentId}
                                    post={post}
                                    selectedGif={selectedGif} onClearGif={onClearGif}
                                    selectedEmoji={selectedEmoji} onClearEmoji={onClearEmoji}
                                    dropAction={dropAction}/>
                            </ChatInputContainer>
                            <div className="chat-footer-buttons d-flex">
                                <IconButton onClick={handleSend} icon="send"/>
                                <IconButton onClick={() => onShowFileDialog(parentId)} icon="paperclip"/>
                                <IconButton onClick={handleShowEmojiPicker} icon="smile"/>
                            </div>
                        </React.Fragment>
                    }
                    {
                        showEmojiPicker === true &&
                        <PickerContainer
                            handleShowEmojiPicker={handleShowEmojiPicker}
                            onSelectEmoji={onSelectEmoji}
                            onSelectGif={onSelectGif}
                            orientation={"top"}
                            ref={ref.picker}
                        />
                    }
                </Dflex>
            }
            {
                isMember === false && topic !== null &&
                <Dflex className="channel-viewing">
                    <div className="channel-name">You are viewing #{topic.name}</div>
                    <div className="channel-action">
                        <button onClick={handleJoinWorkspace}>Join workspace</button>
                    </div>
                </Dflex>
            }
        </Wrapper>
    );
};

export default React.memo(PostDetailFooter);