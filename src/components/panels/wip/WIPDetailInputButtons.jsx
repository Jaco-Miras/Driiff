import React, { useState } from "react";
import styled from "styled-components";
import Tooltip from "react-tooltip-lite";
import { useDispatch, useSelector } from "react-redux";
import { SvgIconFeather } from "../../common";
import { setEditComment } from "../../../redux/actions/wipActions";

const IconWrapper = styled.div`
  width: 40px;
  height: 46px;
  display: flex;
  align-items: center;
  padding: 13px 10px;
  align-self: flex-end;
  .feather {
    cursor: pointer;
  }
  @media (max-width: 414px) {
    width: 30px;
    padding: 13px 2px;
  }
  &.btn-approver {
    padding-top: 16px;
  }
`;
const Wrapper = styled.div`
  min-width: ${(props) => (props.editMode ? "160px" : "120px")};
  display: flex;
  .feather {
    width: 18px;
    height: 18px;
  }
  .chat-buttons {
    display: none;
  }
  @media (max-width: 414px) {
    .btn-approver {
      padding-top: 13px;
    }
    min-width: ${(props) => (props.showButtons && props.editMode ? "180px" : props.showButtons ? "150px" : props.editMode ? "60px" : "30px")};
    .btn-approver,
    .btn-image,
    .btn-smile,
    .btn-paperclip {
      display: ${(props) => (props.showButtons ? "block" : "none")};
    }
    .chat-buttons {
      display: block;
    }
  }
`;

const WIPDetailInputButtons = (props) => {
  const { parentId, showEmojiPicker, handleShowEmojiPicker, onShowFileDialog, handleQuillImage, mainInput } = props;
  const dispatch = useDispatch();
  const editWIPComment = useSelector((state) => state.wip.editWIPComment);
  const [showButtons, setShowButtons] = useState(false);
  const handleEditReplyClose = () => {
    if (editWIPComment !== null) {
      dispatch(setEditComment(null));
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

  return (
    <Wrapper editMode={editWIPComment !== null} showButtons={showButtons}>
      {editWIPComment && mainInput && (
        <IconWrapper>
          <Tooltip arrowSize={5} distance={10} onToggle={toggleTooltip} content="Close edit">
            <SvgIconFeather className="close-button" icon="x" onClick={handleEditReplyClose} />
          </Tooltip>
        </IconWrapper>
      )}

      <IconWrapper className="btn-smile">
        <Tooltip arrowSize={5} distance={10} onToggle={toggleTooltip} content="Emoji">
          <SvgIconFeather className={`${showEmojiPicker ? "active" : ""}`} onClick={handleShowEmojiPicker} icon="smile" />
        </Tooltip>
      </IconWrapper>
      <IconWrapper className="btn-image">
        <Tooltip arrowSize={5} distance={10} onToggle={toggleTooltip} content="Inline image">
          <SvgIconFeather icon="image" onClick={handleQuillImage} />
        </Tooltip>
      </IconWrapper>
      <IconWrapper className="btn-paperclip">
        <Tooltip arrowSize={5} distance={10} onToggle={toggleTooltip} content="Attach file">
          <SvgIconFeather onClick={() => onShowFileDialog(parentId)} icon="paperclip" />
        </Tooltip>
      </IconWrapper>
      <IconWrapper className={"chat-buttons"}>
        <SvgIconFeather onClick={handleShowButtons} icon={showButtons ? "x" : "more-vertical"} />
      </IconWrapper>
    </Wrapper>
  );
};

export default WIPDetailInputButtons;
