import React from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { Tree } from "react-organizational-chart";
import { MemberLists } from "../../list/members";
import { SvgIconFeather } from "../../common";
import { ParentTreeNode } from "../system";

const Wrapper = styled.div`
  padding: 2rem;
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

const CompanyStructure = (props) => {
  const { users } = props;
  const teams = useSelector((state) => state.users.teams);
  const companyName = useSelector((state) => state.settings.driff.company_name);
  return (
    <Wrapper>
      <Tree
        lineWidth={"2px"}
        lineColor={"#8c3b9b"}
        lineBorderRadius={"10px"}
        label={
          <StyledNode>
            <div className="team-name mb-2">
              <SvgIconFeather className="mr-2" icon="home" />
              {companyName}
            </div>
            <div className="mb-1">{users.length} accounts</div>
            <MemberLists members={users} />
          </StyledNode>
        }
      >
        {Object.values(teams)
          .filter((t) => t.parent_team === 0)
          .map((team) => {
            return <ParentTreeNode key={team.id} team={team} allTeams={Object.values(teams)} />;
          })}
      </Tree>
    </Wrapper>
  );
};

export default CompanyStructure;
