import React, { useState } from "react";
import styled from "styled-components";
import Tooltip from "react-tooltip-lite";
import { useDispatch, useSelector } from "react-redux";
import { SvgIconFeather } from "../../common";
import { setEditChatMessage, clearQuote } from "../../../redux/actions/chatActions";
import { useEffect } from "react";
//import zoomIcon from "../../../assets/icons/zoom.png";

const IconWrapper = styled.div`
  width: 40px;
  display: flex;
  align-items: center;
  padding: 12px 10px;
  align-self: flex-end;
  @media (max-width: 414px) {
    width: 30px;
    padding: 13px 2px;
  }
  .loading {
    width: 1rem;
    height: 1rem;
  }
  &.btn-zoom {
    padding: 10px;
  }
`;
const Wrapper = styled.div`
  //min-width: ${(props) => (props.editMode && !props.clientChat ? "160px" : props.editMode && props.clientChat ? "120px" : !props.editMode && props.clientChat ? "80px" : "120px")};
  min-width: ${(props) => (props.editMode && props.disabledMeet ? "120px" : props.editMode && !props.disabledMeet ? "160px" : !props.editMode && props.disabledMeet ? "80px" : " 120px")};
  display: flex;
  .feather {
    width: 18px;
    height: 18px;
    cursor: pointer;
  }
  .feather-google-meet {
    width: 24px;
    height: 24px;
  }
  .chat-buttons {
    display: none;
  }
  // .btn-meet {
  //   img {
  //     width: 24px;
  //     height: 24px;
  //     vertical-align: top;
  //     margin-bottom: -5px;
  //   }
  // }
  .jitsi {
    padding: 12px;
  }
  @media (max-width: 414px) {
    min-width: ${(props) =>
      props.clientChat && props.showButtons && props.editMode
        ? "120px"
        : props.clientChat && props.showButtons && !props.editMode
        ? "90px"
        : props.showButtons && props.editMode
        ? "150px"
        : props.showButtons
        ? "120px"
        : props.editMode
        ? "60px"
        : "30px"};
    .btn-zoom,
    .btn-smile,
    .btn-paperclip {
      display: ${(props) => (props.showButtons ? "block" : "none")};
    }
    .chat-buttons {
      display: block;
    }
    .btn-zoom {
      padding: 13px 8px;
      width: 35px;
      .jitsi {
        padding: 0;
      }
    }
  }
  .zoom-icon {
    cursor: pointer;
  }
  .feather-google-meet {
    height: 20px;
    width: 21px;
  }
  .feather-zoom {
    width: 24px;
    height: 24px;
  }
`;

const ZoomIcon = styled(SvgIconFeather)`
  circle {
    fill: #cacaca;
  }
  :hover {
    circle {
      fill: #2196f3;
    }
  }
`;

const ChatInputButtons = (props) => {
  const { channel, showEmojiPicker, handleZoomMeet, handleShowEmojiPicker, onShowFileDialog, editChatMessage, quote, dictionary, onStartGoogleMeet, onStartJitsi, activeSend } = props;
  const dispatch = useDispatch();
  const workspaces = useSelector((state) => state.workspaces.workspaces);
  const meet = useSelector((state) => state.settings.driff.meet);
  const [showButtons, setShowButtons] = useState(activeSend);
  const handleEditReplyClose = () => {
    if (quote) dispatch(clearQuote(quote));
    if (editChatMessage !== null) {
      dispatch(setEditChatMessage(null));
    }
  };
  const handleShowButtons = () => {
    setShowButtons((prevState) => !prevState);
  };
  const toggleTooltip = () => {
    let tooltips = document.querySelectorAll("span.react-tooltip-lite");
    tooltips.forEach((tooltip) => {
      tooltip.parentElement.classList.toggle("tooltip-active");
    });
  };

  const isClientChat = channel && workspaces[channel.entity_id] && workspaces[channel.entity_id].is_shared && workspaces[channel.entity_id].channel.id === channel.id;

  useEffect(() => {
    setShowButtons(!activeSend);
  }, [activeSend]);
  return (
    <Wrapper editMode={editChatMessage !== null} showButtons={showButtons} clientChat={isClientChat} disabledMeet={meet === "disable"}>
      {editChatMessage && (
        <IconWrapper>
          <Tooltip arrowSize={5} distance={10} onToggle={toggleTooltip} content={dictionary.closeEdit}>
            <SvgIconFeather className="close-button" icon="x" onClick={handleEditReplyClose} />
          </Tooltip>
        </IconWrapper>
      )}
      <IconWrapper className="btn-smile" style={{ paddingLeft: 10 }}>
        <Tooltip arrowSize={5} distance={10} onToggle={toggleTooltip} content="Emoji">
          <SvgIconFeather className={`${showEmojiPicker ? "active" : ""}`} onClick={handleShowEmojiPicker} icon="smile" />
        </Tooltip>
      </IconWrapper>
      {meet !== "disable" && (
        <IconWrapper className={`btn-zoom ${meet}`}>
          {meet === "google" && (
            <Tooltip arrowSize={5} distance={10} onToggle={toggleTooltip} content="Google meet">
              <SvgIconFeather icon="google-meet" onClick={onStartGoogleMeet} />
            </Tooltip>
          )}
          {meet === "zoom" && (
            <Tooltip arrowSize={5} distance={10} onToggle={toggleTooltip} content="Zoom">
              <ZoomIcon onClick={handleZoomMeet} icon="zoom" viewBox="0 0 48 48" />
            </Tooltip>
          )}
          {meet === "jitsi" && (
            <Tooltip arrowSize={5} distance={10} onToggle={toggleTooltip} content="Driff talk">
              <SvgIconFeather icon="video-driff" onClick={onStartJitsi} />
            </Tooltip>
          )}
        </IconWrapper>
      )}

      <IconWrapper className="btn-paperclip">
        <Tooltip arrowSize={5} distance={10} onToggle={toggleTooltip} content={dictionary.attachFiles}>
          <SvgIconFeather onClick={onShowFileDialog} icon="paperclip" />
        </Tooltip>
      </IconWrapper>

      <IconWrapper className={"chat-buttons"}>
        <SvgIconFeather onClick={handleShowButtons} icon={showButtons ? "x" : "more-vertical"} />
      </IconWrapper>
    </Wrapper>
  );
};

export default React.memo(ChatInputButtons);
