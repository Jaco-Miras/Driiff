import React from "react";
import styled from "styled-components";
import { TreeNode } from "react-organizational-chart";
import { MemberLists } from "../../list/members";
import { SubTreeNode } from ".";

const StyledNode = styled.div`
  padding: 8px;
  border-radius: 8px;
  display: inline-flex;
  flex-flow: column;
  align-items: center;
  cursor: pointer;
  border: 2px solid rgba(0, 0, 0, 0.125);
  .avatar {
    width: 2rem !important;
    height: 2rem !important;
  }
  .team-name {
    font-weight: 500;
  }
  :hover {
    border-color: #7a1b8b;
  }
`;

const ParentTreeNode = (props) => {
  const { team, allTeams, onSelectTeam } = props;
  const handleSelectTeam = () => {
    onSelectTeam(team);
  };
  return (
    <TreeNode
      key={team.id}
      label={
        <StyledNode onClick={handleSelectTeam}>
          <div className="team-name mb-1">{team.name}</div>
          <div className="mb-2">{team.members.length} accounts</div>
          <MemberLists members={team.members} />
        </StyledNode>
      }
    >
      {allTeams.filter((t) => t.parent_team === team.id).length > 0
        ? allTeams
            .filter((t) => t.parent_team === team.id)
            .map((t) => {
              return <SubTreeNode key={t.id} team={t} allTeams={allTeams} onSelectTeam={onSelectTeam} />;
            })
        : null}
    </TreeNode>
  );
};

export default ParentTreeNode;
