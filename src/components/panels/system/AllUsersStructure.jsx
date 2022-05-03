import React from "react";
import styled, { useTheme } from "styled-components";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { Tree } from "react-organizational-chart";
import { MemberLists } from "../../list/members";
import { SvgIconFeather } from "../../common";
import { ParentTreeNode } from ".";
//import { TeamItem } from "../../list/people/item";

const Wrapper = styled.div`
  padding: 1rem;
  width: 100%;
  // overflow: auto;
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
    border-color: ${({ theme }) => theme.colors.primary};
  }
  .TEAM {
    .feather {
      height: 1rem;
      width: 1rem;
    }
  }
`;

const AllUsersStructure = (props) => {
  const { dictionary } = props;
  const theme = useTheme();
  const users = useSelector((state) => state.users.users);
  const botCodes = ["gripp_bot_account", "gripp_bot_invoice", "gripp_bot_offerte", "gripp_bot_project", "gripp_bot_account", "driff_webhook_bot", "huddle_bot", "driff_channel_bot"];
  const internalUsers = Object.values(users).filter((u) => u.type === "internal" && !botCodes.includes(u.email));
  const externalUsers = Object.values(users).filter((u) => u.type === "external" && !botCodes.includes(u.email));

  const teams = useSelector((state) => state.users.teams);
  const teamsLoaded = useSelector((state) => state.users.teamsLoaded);
  const usersLoaded = useSelector((state) => state.users.usersLoaded);
  const companyName = useSelector((state) => state.settings.driff.company_name);

  const internalAndExternalTeam = [
    {
      id: "internal",
      name: dictionary.internalAccounts,
      members: internalUsers,
      member_ids: internalUsers.map((m) => m.id),
      parent_team: 0,
    },
    {
      id: "external",
      name: dictionary.guestAccounts,
      members: externalUsers.map((m) => {
        if (m.name && m.name.trim() === "") {
          return { ...m, name: m.email };
        } else {
          return m;
        }
      }),
      member_ids: externalUsers.map((m) => m.id),
      parent_team: 0,
    },
  ];
  const allUsers = Object.values(users).filter((u) => u.active === 1 && !botCodes.includes(u.email));
  const allTeams = [...internalAndExternalTeam, ...Object.values(teams)];

  const history = useHistory();

  const handleSelectTeam = (team) => {
    history.push(`/system/people/teams/${team.id}/${team.name}`);
  };

  const companyAvatar = {
    id: null,
    name: companyName,
    members: allUsers,
    icon_link: null,
    icon: "home",
  };
  const AllUsersWithCompany = [companyAvatar, ...allUsers];

  return (
    <Wrapper>
      {usersLoaded && teamsLoaded && (
        <Tree
          lineWidth={"2px"}
          lineColor={theme.colors.primary}
          lineBorderRadius={"10px"}
          label={
            <StyledNode>
              <div className="team-name mb-1">
                <SvgIconFeather className="mr-2" icon="home" />
                {companyName}
              </div>
              <div className="mb-2">{allUsers.length} accounts</div>
              <MemberLists members={AllUsersWithCompany} />
            </StyledNode>
          }
        >
          {allTeams
            .filter((t) => t.parent_team === 0)
            .map((team) => {
              return <ParentTreeNode key={team.id} team={team} allTeams={allTeams} onSelectTeam={handleSelectTeam} />;
            })}
        </Tree>
      )}

      {/* {Object.values(teams).length > 0 && (
        <div className="row mt-2">
          {Object.values(teams).map((team) => {
            return <TeamItem key={team.id} team={team} loggedUser={loggedUser} dictionary={dictionary} _t={_t} showOptions={showOptions} onSelectTeam={onSelectTeam} />;
          })}
        </div>
      )} */}
    </Wrapper>
  );
};

export default AllUsersStructure;
