import React from "react";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import { SvgIconFeather } from "../../common";
import { addToModals } from "../../../redux/actions/globalActions";

const Wrapper = styled.div`
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

const DashboardDescriptionContainer = styled.div``;

const DashboardDescription = styled.div`
  img {
    max-width: 100%;
    max-height: 250px;
  }
`;

const AboutCard = (props) => {
  const { dictionary } = props;
  const dispatch = useDispatch();

  const user = useSelector((state) => state.session.user);
  const workspaces = useSelector((state) => state.workspaces.workspaces);
  const recipients = useSelector((state) => state.global.recipients);
  const companyRecipient = recipients.find((r) => r.type === "DEPARTMENT");
  const companyWs = Object.values(workspaces).find((ws) => companyRecipient && companyRecipient.id === ws.id);

  const handleEditClick = () => {
    let payload = {
      type: "company-workspace",
    };

    dispatch(addToModals(payload));
  };

  return (
    <Wrapper>
      <div className="card-title">
        <span>
          <strong>{dictionary.aboutThisCompany}</strong>
        </span>{" "}
        {companyWs && user.role.id <= 2 && <SvgIconFeather icon="edit" onClick={handleEditClick} />}
      </div>
      <DashboardDescriptionContainer>{companyWs && <DashboardDescription className={"dashboard-description"} dangerouslySetInnerHTML={{ __html: companyWs.description }} />}</DashboardDescriptionContainer>
    </Wrapper>
  );
};

export default React.memo(AboutCard);
