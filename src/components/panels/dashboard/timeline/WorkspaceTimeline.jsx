import React from "react";
import styled from "styled-components";
import { Avatar } from "../../../common";
import { useTimeFormat } from "../../../hooks";

const Wrapper = styled.div``;

const WorkspaceTimeline = (props) => {
  const { className = "", workspace } = props;
  const { fromNow } = useTimeFormat();

  return (
    <Wrapper className={`timeline-item ${className}`}>
      <div>
        <Avatar name={workspace.user.name} imageLink={workspace.user.profile_image_link} />
      </div>
      <div>
        <h6 className="d-flex justify-content-between mb-4">
          <span>
            {workspace.user.name} <a href="#">shared a post</a>
          </span>
          <span className="text-muted font-weight-normal">{fromNow(workspace.created_at.timestamp)}</span>
        </h6>
        <a href="#">
          <div className="mb-3 border p-3 border-radius-1">{workspace.body}</div>
        </a>
      </div>
    </Wrapper>
  );
};

export default React.memo(WorkspaceTimeline);
