import React from "react";
import styled from "styled-components";
import WIPComment from "./WIPComment";

const Wrapper = styled.ul`
  width: 95%;
`;

const WIPSubComments = (props) => {
  const { className = "", comments, wip, parentId, user, onShowFileDialog, dropAction, parentShowInput, workspace, isMember, dictionary, disableOptions } = props;
  return (
    Object.values(comments).length > 0 && (
      <Wrapper className={`sub-comments ${className}`}>
        {Object.values(comments).map((c) => {
          return <WIPComment key={c.id} type="sub" comment={c} wip={wip} dictionary={dictionary} parentId={parentId} />;
        })}
      </Wrapper>
    )
  );
};

export default React.memo(WIPSubComments);
