import React from "react";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import { SvgIconFeather } from "../../common";
import { addToModals } from "../../../redux/actions/globalActions";
import { useGetSlug } from "../../hooks";

const Wrapper = styled.div`
  height: 100%;
  .card-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    svg {
      width: 1rem;
      height: 1rem;
      cursor: pointer;
    }
  }
`;

const DashboardDescriptionContainer = styled.div`
  min-height: 175px;
  max-height: calc(100% - 30px);
  overflow: auto;
  ::-webkit-scrollbar {
    -webkit-appearance: none;
    width: 7px;
  }

  ::-webkit-scrollbar-thumb {
    border-radius: 4px;
    background-color: rgba(0, 0, 0, 0.5);
    -webkit-box-shadow: 0 0 1px rgba(255, 255, 255, 0.5);
  }
`;

const DashboardDescription = styled.div`
  img {
    max-width: 100%;
    max-height: 250px;
  }
`;

const AboutCard = (props) => {
  const { dictionary, isWorkspace = false, workspace } = props;
  const dispatch = useDispatch();

  const user = useSelector((state) => state.session.user);
  const workspaces = useSelector((state) => state.workspaces.workspaces);
  //const sharedWs = useSelector((state) => state.workspaces.sharedWorkspaces);
  const recipients = useSelector((state) => state.global.recipients);
  const companyRecipient = recipients.find((r) => r.type === "DEPARTMENT");
  const companyWs = Object.values(workspaces).find((ws) => companyRecipient && companyRecipient.id === ws.id);
  const sharedWs = useSelector((state) => state.workspaces.sharedWorkspaces);
  const { slug } = useGetSlug();

  const handleEditClick = () => {
    if (isWorkspace) {
      let payload = {
        mode: "edit",
        item: workspace,
        type: "workspace_create_edit",
      };

      dispatch(addToModals(payload));
    } else {
      let payload = {
        type: "company-workspace",
      };

      dispatch(addToModals(payload));
    }
  };

  let workspaceMember = false;
  if (isWorkspace && workspace) {
    const workspaceMembers = workspace
      ? workspace.members
          .map((m) => {
            if (m.member_ids) {
              return m.member_ids;
            } else return m.id;
          })
          .flat()
      : [];
    const isSameDriff = (workspace && workspace.sharedSlug && workspace.slug && slug === workspace.slug.slice(0, -7)) || (workspace && !workspace.sharedSlug);
    const isCreator = workspace && workspace.slug && workspace.sharedSlug && sharedWs[workspace.slug] && workspace.members.find((mem) => mem.is_creator).id === user.id && isSameDriff;
    const isTeamMember = workspace && !workspace.sharedSlug && workspaceMembers.some((id) => id === user.id) && isSameDriff;
    workspaceMember = (isCreator || isTeamMember) && user.type !== "external";
  }

  return (
    <Wrapper>
      <div className="card-title">
        <h5 className="card-title mb-0">{isWorkspace ? dictionary.aboutThisWorkspace : dictionary.aboutThisCompany}</h5>

        {((!isWorkspace && companyWs && user && user.role && user.role.id <= 2) || workspaceMember) && <SvgIconFeather icon="edit" onClick={handleEditClick} />}
      </div>
      <DashboardDescriptionContainer>
        {!isWorkspace && companyWs && <DashboardDescription className={"dashboard-description"} dangerouslySetInnerHTML={{ __html: companyWs.description }} />}
        {isWorkspace && workspace && <DashboardDescription className={"dashboard-description"} dangerouslySetInnerHTML={{ __html: workspace.description }} />}
      </DashboardDescriptionContainer>
    </Wrapper>
  );
};

export default React.memo(AboutCard);
