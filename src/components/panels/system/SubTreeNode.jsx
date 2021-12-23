import React from "react";
import styled from "styled-components";
import { TreeNode } from "react-organizational-chart";
import { MemberLists } from "../../list/members";
import { ParentTreeNode } from ".";
import { useTranslationActions } from "../../hooks";

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
    border-color: ${({ theme }) => theme.colors.primary};
  }
  .TEAM {
    .feather {
      height: 1rem;
      width: 1rem;
    }
  }
`;

const SubTreeNode = (props) => {
  const { team, allTeams, onSelectTeam } = props;
  const { _t } = useTranslationActions();
  const dictionary = {
    accounts: _t("CHART.ACCOUNTS", "accounts"),
  };
  const handleSelectTeam = () => {
    onSelectTeam(team);
  };
  const teamAvatar = {
    id: team.id,
    name: team.name,
    members: team.members,
    icon_link: team.icon_link,
  };
  const teamMembersWithIcon = [teamAvatar, ...team.members];
  return (
    <TreeNode
      key={team.id}
      label={
        <StyledNode onClick={handleSelectTeam}>
          <div className="team-name mb-1">{team.name}</div>
          <div className="mb-2">
            {team.members.length} {dictionary.accounts}
          </div>
          <MemberLists members={teamMembersWithIcon} />
        </StyledNode>
      }
    >
      {allTeams.filter((t) => t.parent_team === team.id).length > 0
        ? allTeams
            .filter((t) => t.parent_team === team.id)
            .map((t) => {
              return <ParentTreeNode key={t.id} team={t} allTeams={allTeams} onSelectTeam={onSelectTeam} />;
            })
        : null}
    </TreeNode>
  );
};

export default SubTreeNode;
