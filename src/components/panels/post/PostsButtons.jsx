import React from "react";
import styled from "styled-components";
import { TodoCheckBox } from "../../forms";
import { SvgIconFeather } from "../../common";

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
`;

const PostsButtons = (props) => {
  const { onToggleCheckbox, onArchiveAll, onMarkAll, checked, showButtons } = props;

  const handleToggleMainCheckbox = () => {
    onToggleCheckbox();
  };

  const handleArchiveAll = () => {
    onArchiveAll();
  };

  const handleMarkAllAsRead = () => {
    onMarkAll();
  };

  return (
    <PostsBtnWrapper>
      <TodoCheckBox name="test" checked={checked} onClick={handleToggleMainCheckbox} />
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
