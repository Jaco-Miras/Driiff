import React from "react";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import { SvgIconFeather } from "../../common";
import { addToModals } from "../../../redux/actions/globalActions";

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
    workspaceMember = workspace.members.some((m) => m.id === user.id);
    // if (workspace.sharedSlug && sharedWs[workspace.slug]) {
    //   workspaceMember = workspace.members.some((m) => m.id === sharedWs[workspace.slug].user_auth.id);
    // }
  }

  return (
    <Wrapper>
      <div className="card-title">
        <h5 className="card-title mb-0">{isWorkspace ? dictionary.aboutThisWorkspace : dictionary.aboutThisCompany}</h5>

        {((!isWorkspace && companyWs && user.role.id <= 2) || workspaceMember) && <SvgIconFeather icon="edit" onClick={handleEditClick} />}
      </div>
      <DashboardDescriptionContainer>
        {!isWorkspace && companyWs && <DashboardDescription className={"dashboard-description"} dangerouslySetInnerHTML={{ __html: companyWs.description }} />}
        {isWorkspace && workspace && <DashboardDescription className={"dashboard-description"} dangerouslySetInnerHTML={{ __html: workspace.description }} />}
      </DashboardDescriptionContainer>
    </Wrapper>
  );
};

export default React.memo(AboutCard);
