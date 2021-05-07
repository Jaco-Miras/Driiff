import React from "react";
import styled from "styled-components";
import { Avatar, SvgIconFeather } from "../common";

const Wrapper = styled.div`
  position: relative;
`;
const StarIcon = styled(SvgIconFeather)`
  position: absolute;
  z-index: 2;
  width: 1rem;
  height: 1rem;
  top: 0;
  right: 0;
  color: rgb(255, 193, 7);
  fill: rgb(255, 193, 7);
`;

const WorkspaceIcon = (props) => {
  const { avatarClassName = "", onSelectWorkspace = null, workspace } = props;
  return (
    <Wrapper className="workspace-icon mr-3">
      <StarIcon icon="star" />
      <Avatar
        className={avatarClassName}
        forceThumbnail={false}
        type={"TOPIC"}
        imageLink={workspace.icon_link}
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
