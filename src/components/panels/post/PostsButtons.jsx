import React, { useState, useRef } from "react";
import styled from "styled-components";
import { TodoCheckBox } from "../../forms";
import { SvgIconFeather } from "../../common";
import { useOutsideClick } from "../../hooks";

const PostsBtnWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  padding: 0 15px;
  .custom-checkbox {
    padding: 0;
    label {
      margin: 0;
    }
  }
  .feather {
    margin-left: 15px;
    cursor: pointer;
  }
  .feather-chevron-down {
    margin-left: 0;
  }
  z-index: 3;
`;

const CheckBox = styled(TodoCheckBox)`
  &.custom-checkbox {
    padding: 0;
  }
  label {
    margin: 0;
  }
  width: 1.6rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  :hover {
    background: rgb(175, 184, 189, 0.2);
    cursor: pointer;
    .dark & {
      background: #25282c;
    }
  }
`;

const CheckBoxWrapper = styled.div`
  display: flex;
  align-items: center;
  background: ${(props) => (props.checked ? "rgb(175, 184, 189, 0.2)" : "inherit")};
  border-radius: 4px;
  position: relative;
`;

const IconWrapper = styled.div`
  height: 2rem;
  display: flex;
  align-items: center;
  border-radius: 4px;
  :hover {
    background: rgb(175, 184, 189, 0.2);
    cursor: pointer;
    .dark & {
      background: #25282c;
    }
  }
`;

const CheckboxDropdown = styled.div`
  display: ${(props) => (props.show ? "block" : "none")};
  position: absolute;
  top: 100%;
  background: #fff;
  border-radius: 6px;
  ul {
    margin: 0;
    list-style: none;
    box-shadow: 0 0 3px 0 rgba(26, 26, 26, 0.4), 0 1px 3px 0 rgba(0, 0, 0, 0.1);
    z-index: 5;
    overflow: auto;
    padding: 8px 8px;
    cursor: pointer;
    box-shadow: 0 5px 10px -1px rgba(0, 0, 0, 0.15);
    max-height: 260px;
    border-radius: inherit;
  }

  li {
    white-space: nowrap;
    margin-bottom: 10px;
    display: inline-flex;
    align-items: center;
    width: 100%;
    cursor: pointer;
    padding-bottom: 5px;

    span {
      font-weight: 400;
    }

    &:hover {
      span {
        color: #972c86;
      }
    }
    &:last-child {
      border: none;
      padding: 0;
      margin: 0;
    }
  }
`;

const PostsButtons = (props) => {
  const { onToggleCheckbox, onArchiveAll, onMarkAll, checked, showButtons } = props;

  const popupRef = useRef(null);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleToggleMainCheckbox = () => {
    onToggleCheckbox();
  };

  const handleArchiveAll = () => {
    onArchiveAll();
  };

  const handleMarkAllAsRead = () => {
    onMarkAll();
  };

  const handleShowDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  useOutsideClick(popupRef, handleShowDropdown, showDropdown);

  return (
    <PostsBtnWrapper>
      <CheckBoxWrapper checked={checked}>
        <CheckBox name="test" checked={checked} onClick={handleToggleMainCheckbox} />
        <IconWrapper>
          <SvgIconFeather icon="chevron-down" width="14" height="14" onClick={handleShowDropdown} />
        </IconWrapper>
        <CheckboxDropdown show={showDropdown} ref={popupRef}>
          <ul>
            <li>
              <span>sample option 1</span>
            </li>
            <li>
              <span>sample option 2</span>
            </li>
            <li>
              <span>sample option 3</span>
            </li>
          </ul>
        </CheckboxDropdown>
      </CheckBoxWrapper>
      {showButtons && (
        <>
          <SvgIconFeather icon="archive" width="20" height="20" onClick={handleArchiveAll} />
          <SvgIconFeather icon="mail" width="20" height="20" onClick={handleMarkAllAsRead} />
          <SvgIconFeather icon="check-circle" width="20" height="20" />
        </>
      )}
    </PostsBtnWrapper>
  );
};

export default PostsButtons;
