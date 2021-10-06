import React, { useEffect } from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { Tree } from "react-organizational-chart";
import { MemberLists } from "../../list/members";
import { SvgIconFeather } from "../../common";
import { ParentTreeNode } from ".";
import { TeamItem } from "../../list/people/item";

const Wrapper = styled.div`
  padding: 2rem;
  width: 100%;
`;

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

const AllUsersStructure = (props) => {
  const { users, onSelectTeam, setShowTeams, loggedUser, dictionary, _t, showOptions } = props;
  const internalUsers = users.filter((u) => u.type === "internal");
  const externalUsers = users.filter((u) => u.type === "external");

  const teams = useSelector((state) => state.users.teams);
  const teamsLoaded = useSelector((state) => state.users.teamsLoaded);
  const usersLoaded = useSelector((state) => state.users.usersLoaded);
  const companyName = useSelector((state) => state.settings.driff.company_name);

  const internalAndExternalTeam = [
    {
      id: "internal",
      name: "Accounts",
      members: internalUsers,
      member_ids: internalUsers.map((m) => m.id),
      parent_team: 0,
    },
    {
      id: "external",
      name: "Guest accounts",
      members: externalUsers,
      member_ids: externalUsers.map((m) => m.id),
      parent_team: 0,
    },
  ];

  const allTeams = [...internalAndExternalTeam, ...Object.values(teams)];

  useEffect(() => {
    setShowTeams(true);
  }, []);

  return (
    <Wrapper>
      {usersLoaded && teamsLoaded && (
        <Tree
          lineWidth={"2px"}
          lineColor={"#8c3b9b"}
          lineBorderRadius={"10px"}
          label={
            <StyledNode>
              <div className="team-name mb-1">
                <SvgIconFeather className="mr-2" icon="home" />
                {companyName}
              </div>
              <div className="mb-2">{users.length} accounts</div>
              <MemberLists members={users} />
            </StyledNode>
          }
        >
          {allTeams
            .filter((t) => t.parent_team === 0)
            .map((team) => {
              return <ParentTreeNode key={team.id} team={team} allTeams={allTeams} onSelectTeam={onSelectTeam} />;
            })}
        </Tree>
      )}

      {Object.values(teams).length > 0 && (
        <div className="row mt-2">
          {Object.values(teams).map((team) => {
            return <TeamItem key={team.id} team={team} loggedUser={loggedUser} dictionary={dictionary} _t={_t} showOptions={showOptions} />;
          })}
        </div>
      )}
    </Wrapper>
  );
};

export default AllUsersStructure;
