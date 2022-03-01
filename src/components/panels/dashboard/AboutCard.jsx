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

  return (
    <Wrapper>
      <div className="card-title">
        <h5 className="card-title mb-0">{isWorkspace ? dictionary.aboutThisWorkspace : dictionary.aboutThisCompany}</h5>

        {companyWs && user.role.id <= 2 && <SvgIconFeather icon="edit" onClick={handleEditClick} />}
      </div>
      <DashboardDescriptionContainer>
        {!isWorkspace && companyWs && <DashboardDescription className={"dashboard-description"} dangerouslySetInnerHTML={{ __html: companyWs.description }} />}
        {isWorkspace && workspace && <DashboardDescription className={"dashboard-description"} dangerouslySetInnerHTML={{ __html: workspace.description }} />}
      </DashboardDescriptionContainer>
    </Wrapper>
  );
};

export default React.memo(AboutCard);
