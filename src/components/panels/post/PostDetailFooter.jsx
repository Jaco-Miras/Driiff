import React, { useCallback, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import Tooltip from "react-tooltip-lite";
import { joinWorkspace } from "../../../redux/actions/workspaceActions";
import { CommonPicker, SvgIconFeather } from "../../common";
import PostInput from "../../forms/PostInput";
import { CommentQuote } from "../../list/post/item";

const Wrapper = styled.div`
  position: relative;
  > div > svg:first-child {
    margin-left: 0 !important;
  }
  flex: unset;
`;

const ChatInputContainer = styled.div`
  position: relative;
  max-width: calc(100% - 165px);
  @media all and (max-width: 620px) {
    max-width: calc(100% - 110px);
  }
`;

const IconButton = styled(SvgIconFeather)`
  cursor: pointer;
  cursor: hand;
  border: 1px solid #afb8bd;
  height: 37px;
  margin: -1px 8px;
  width: 47px;
  min-width: 47px;
  padding: 10px 0;
  border-radius: 8px;
  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  &:hover {
    background: #afb8bd;
    color: #ffffff;
  }
  &.feather-send {
    border: 1px solid #7a1b8b;
    background-color: #7a1b8b;
    color: #fff;
    &:hover {
      background-color: #8c3b9b;
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

    .channel-name {
      color: #64625c;
      font-size: 17px;
      font-weight: 600;
    }
    .channel-create {
      letter-spacing: 0;
      margin-bottom: 0;
      color: #b8b8b8;
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
  svg.feather-send {
    margin-left: 8px;
  }
  svg.feather-paperclip {
    margin-left: 0;
    margin-right: 0;
  }
  @media all and (max-width: 620px) {
    .emojiButton {
      display: none;
    }
    div:nth-child(4) {
      order: 1;
      margin-right: 8px;
    }
    div:nth-child(2) { order: 3; }
    svg:nth-child(3) { order: 3; }
    svg.feather-send { {
      margin-right: 0;
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

const FileNames = styled.div`
  padding: 5px 45px;
`;

const PostDetailFooter = (props) => {
  const { className = "", onShowFileDialog, dropAction, post, parentId = null, commentActions,
          userMention = null, handleClearUserMention = null, commentId = null, innerRef = null,
          workspace, isMember
  } = props;

  const dispatch = useDispatch();
  const ref = {
    picker: useRef(),
  };
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState(null);
  const [selectedGif, setSelectedGif] = useState(null);
  const [sent, setSent] = useState(false);

  //const topic = useSelector((state) => state.workspaces.activeTopic);
  const user = useSelector((state) => state.session.user);
  const editPostComment = useSelector((state) => state.posts.editPostComment);

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
      joinWorkspace(
        {
          channel_id: workspace.channel.id,
          recipient_ids: [user.id]
        },
        (err, res) => {
          if (err) return;

        }
      )
    );
  };

  const toggleTooltip = () => {
    let tooltips = document.querySelectorAll("span.react-tooltip-lite");
    tooltips.forEach((tooltip) => {
      tooltip.parentElement.classList.toggle("tooltip-active");
    });
  };
  //const isMember = useIsMember(topic && topic.members.length ? topic.members.map((m) => m.id) : []);

  return (
    <Wrapper className={`post-detail-footer card-body ${className}`}>
      {
        <Dflex className="d-flex pr-2 pl-2">
          <CommentQuote commentActions={commentActions} commentId={commentId} />
        </Dflex>
      }
      {isMember && (
        <>
          <Dflex className="d-flex align-items-center">
            {post.is_read_only === 1 ? (
              <NoReply className="d-flex align-items-center">
                <div class="alert alert-warning">No reply allowed</div>
              </NoReply>
            ) : (
              <React.Fragment>
              <Tooltip arrowSize={5} distance={10} onToggle={toggleTooltip} content="Emoji" className="emojiButton">
                <IconButton onClick={handleShowEmojiPicker} icon="smile" />
              </Tooltip>
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
                    selectedGif={selectedGif}
                    onClearGif={onClearGif}
                    selectedEmoji={selectedEmoji}
                    onClearEmoji={onClearEmoji}
                    dropAction={dropAction}
                    members={workspace ? workspace.members : []}
                  />
                </ChatInputContainer>
                <IconButton onClick={handleSend} icon="send" />
                <Tooltip arrowSize={5} distance={10} onToggle={toggleTooltip} content="Attach files">
                  <IconButton onClick={onShowFileDialog} icon="paperclip" />
                </Tooltip>
              </React.Fragment>
            )}
            {showEmojiPicker === true && <PickerContainer handleShowEmojiPicker={handleShowEmojiPicker} onSelectEmoji={onSelectEmoji} onSelectGif={onSelectGif} orientation={"top"} ref={ref.picker} />}
          </Dflex>
          {editPostComment && editPostComment.files.length > 0 && <FileNames>{editPostComment.files.map((f) => f.name).join(", ")}</FileNames>}
          <Dflex></Dflex>
        </>
      )}
      {isMember === false && workspace !== null && (
        <Dflex className="channel-viewing">
          <div className="channel-name">You are viewing #{workspace.name}</div>
          <div className="channel-action">
            <button onClick={handleJoinWorkspace}>Join workspace</button>
          </div>
        </Dflex>
      )}
    </Wrapper>
  );
};

export default React.memo(PostDetailFooter);
