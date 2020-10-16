import React, { useCallback, useRef, useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import Tooltip from "react-tooltip-lite";
import { CommonPicker, SvgIconFeather } from "../../../common";
import { CommentQuote } from "../../../list/post/item";
import { CompanyPostInput } from "../../../forms";
import { useTranslation } from "../../../hooks";

const Wrapper = styled.div`
  position: relative;
  > div > svg:first-child {
    margin-left: 0 !important;
  }
  flex: unset;

  .feather-paperclip {
    border: 1px solid #e1e1e1;
    height: 100%;
    cursor: pointer;
    width: 46px;
    border-radius: 8px;
    transition: background-color 0.15s ease-in-out;
    padding: 12px;
    &:hover {
      background-color: #e1e1e1;
    }
  }
`;

const ChatInputContainer = styled.div`
  position: relative;
  border: 1px solid #e1e1e1;
  box-shadow: 0 3px 10px #7a1b8b12;
  border-radius: 8px;
  padding-right: 80px;
  margin-right: 8px;
  min-height: 48px;
  .feather-send,
  .feather-smile {
    position: absolute;
    bottom: 0;
    right: 0;
    margin: 4px;
    height: calc(100% - 8px);
    max-height: 38px;
    border-radius: 4px;
    min-width: 40px;
    width: 40px;
    padding: 10px;
    cursor: pointer;
    transition: background-color 0.15s ease-in-out, color 0.15s ease-in-out;
  }
  .feather-smile {
    right: 44px;
    margin: 4px 0;
    background: transparent;
    border-color: transparent;
    transition: color 0.15s ease-in-out;
    color: #cacaca;
    &.active {
      color: #7a1b8b;
    }
    &:hover {
      color: #7a1b8b;
    }
  }
  .feather-send {
  background: ${props => props.backgroundSend};
  fill: ${props => props.fillSend};
  &:hover {
    cursor: ${props => props.cursor};
   }
  }
`;

const IconButton = styled(SvgIconFeather)`
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
    svg.feather-send {
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
  right: 130px;
  bottom: 75px;

  .common-picker-btn {
    text-align: right;
  }
`;

const FileNames = styled.div`
  padding: 5px 45px;
`;

const CompanyPostDetailFooter = (props) => {
  const {
    className = "", onShowFileDialog, dropAction, post, parentId = null, commentActions,
    userMention = null, handleClearUserMention = null, commentId = null, innerRef = null,
    isMember,
  } = props;

  const ref = {
    picker: useRef(),
  };
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState(null);
  const [selectedGif, setSelectedGif] = useState(null);
  const [sent, setSent] = useState(false);
  const [active, setActive] = useState(false);
  const [cursor, setCursor] = useState('default');
  const [backgroundSend, setBackgroundSend] = useState(null);
  const [fillSend, setFillSend] = useState('#cacaca');

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
    //handleSend();
  };

  const onActive = (active) => {
    setActive(active);
    let sendButtonValues;
    active ? sendButtonValues = ['#7a1b8b', 'pointer', '#fff']  : sendButtonValues = ["", 'default', '#cacaca'];
    setBackgroundSend(sendButtonValues[0]);
    setCursor(sendButtonValues[1]);
    setFillSend(sendButtonValues[2]);
  }

  const toggleTooltip = () => {
    let tooltips = document.querySelectorAll("span.react-tooltip-lite");
    tooltips.forEach((tooltip) => {
      tooltip.parentElement.classList.toggle("tooltip-active");
    });
  };

  const { _t } = useTranslation();

  const dictionary = {
    noReplyAllowed:  _t("FOOTER.NO_REPLY_ALLOWED", "No reply allowed"),
    attachFiles: _t("TOOLTIP.ATTACH_FILES", "Attach files"),
  };

  return (
    <Wrapper className={`company-post-detail-footer card-body ${className}`}>
      {
        <Dflex className="d-flex pr-2 pl-2">
          <CommentQuote commentActions={commentActions} commentId={commentId}/>
        </Dflex>
      }
      {isMember && (
        <>
          <Dflex className="d-flex align-items-end">
            {post.is_read_only ? (
              <NoReply className="d-flex align-items-center">
                <div className="alert alert-warning">{dictionary.noReplyAllowed}</div>
              </NoReply>
            ) : (
              <React.Fragment>
                  <ChatInputContainer ref={innerRef} className="flex-grow-1 chat-input-footer" backgroundSend={backgroundSend} cursor={cursor} fillSend={fillSend}>
                  <CompanyPostInput
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
                      members={post.members}
                      onActive={onActive}
                  />
                  <IconButton className={`${showEmojiPicker ? "active" : ""}`} onClick={handleShowEmojiPicker}
                              icon="smile"/>
                  <IconButton onClick={handleSend} icon="send"/>
                </ChatInputContainer>
                <Tooltip arrowSize={5} distance={10} onToggle={toggleTooltip} content={dictionary.attachFiles}>
                  <IconButton onClick={() => onShowFileDialog(parentId)} icon="paperclip"/>
                </Tooltip>
              </React.Fragment>
            )}
            {showEmojiPicker === true &&
            <PickerContainer
              handleShowEmojiPicker={handleShowEmojiPicker} onSelectEmoji={onSelectEmoji}
              onSelectGif={onSelectGif} orientation={"top"} ref={ref.picker}/>}
          </Dflex>
          {editPostComment && editPostComment.files.length > 0 &&
          <FileNames>{editPostComment.files.map((f) => f.name).join(", ")}</FileNames>}
          <Dflex/>
        </>
      )}
    </Wrapper>
  );
};

export default React.memo(CompanyPostDetailFooter);
