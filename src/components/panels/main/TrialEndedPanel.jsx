import React from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { SvgEmptyState } from "../../common";

const TrialWrapper = styled.div`
  position: relative;
  overflow: auto;

  .spinner-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 45vw;

    .spinner-border {
      color: #5b1a67;
    }
  }
  .card-body {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-flow: column;
  }
  svg {
    height: 50%;
    width: 50%;
  }
`;

const TrialEndedPanel = (props) => {
  const history = useHistory();
  const user = useSelector((state) => state.session.user);
  const handleRedirect = () => {
    history.push("/admin-settings/subscription/subscribe");
  };
  return (
    <TrialWrapper className="main-content">
      <div className="trial-end">
        <div className="card h-100">
          <div className="card-body">
            <SvgEmptyState icon={2} />
            <h3>Your trial subscription has ended</h3>
            {user && user.role && user.role.id <= 2 && (
              <button className="btn btn-primary" onClick={handleRedirect}>
                Go to subscription page
              </button>
            )}
          </div>
        </div>
      </div>
    </TrialWrapper>
  );
};

export default TrialEndedPanel;
