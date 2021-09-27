import React from "react";
import styled from "styled-components";
import { Avatar } from "../common";
import { Badge } from "reactstrap";

const Wrapper = styled.div`
  position: relative;
`;
// const StarIcon = styled(SvgIconFeather)`
//   position: absolute;
//   z-index: 2;
//   width: 1rem;
//   height: 1rem;
//   top: 0;
//   right: 0;
//   color: rgb(255, 193, 7);
//   fill: rgb(255, 193, 7);
// `;

const StyledBadge = styled(Badge)`
  position: absolute;
  right: -7px;
  top: -4px;
  z-index: 1;
  padding: 4px 8px;
  font-size: 10px;
  &.badge.badge-primary {
    background: #3f034a;
  }
`;

const WorkspaceIcon = (props) => {
  const { avatarClassName = "", onSelectWorkspace = null, workspace } = props;
  return (
    <Wrapper className="workspace-icon mr-3">
      {/* <StarIcon icon="star" /> */}
      {workspace.hasOwnProperty("workspace_counter_entries") && workspace.workspace_counter_entries > 0 && (
        <StyledBadge className={"badge badge-primary badge-pill ml-1"}>{workspace.workspace_counter_entries > 99 ? "99+" : workspace.workspace_counter_entries}</StyledBadge>
      )}
      <Avatar
        className={avatarClassName}
        forceThumbnail={false}
        type={"TOPIC"}
        imageLink={workspace.team_channel ? workspace.team_channel.icon_link : null}
        id={workspace.id}
        name={workspace.name}
        onClick={onSelectWorkspace}
        noDefaultClick={onSelectWorkspace ? false : true}
        showSlider={false}
      />
    </Wrapper>
  );
};

export default WorkspaceIcon;
