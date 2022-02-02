import React from "react";
import styled from "styled-components";
import { SvgEmptyState } from "../../common";
import { useTranslationActions } from "../../hooks";

const MaintenanceWrapper = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  flex-flow: column;
  > div {
    width: 100%;
  }
`;

const EmptyState = styled.div`
  padding: 8rem 0;
  max-width: 375px;
  margin: auto;
  text-align: center;

  svg {
    display: block;
  }
  button {
    width: auto !important;
    margin: 2rem auto;
  }
`;

const MaintenancePanel = (props) => {
  const { _t } = useTranslationActions();
  const dictionary = {
    rebuildingDashboard: _t("REBUILDING_DASHBOARD", "We're rebuilding the dashboard."),
    dashboardComingSoon: _t("DASHBOARD_COMING_SOON", "The new dashboard is coming soon."),
  };
  return (
    <MaintenanceWrapper>
      <EmptyState>
        <SvgEmptyState icon={1} height={252} />
        <div>
          <h4 className="title">{dictionary.rebuildingDashboard}</h4>
        </div>
        <div>
          <h5>{dictionary.dashboardComingSoon}</h5>
        </div>
      </EmptyState>
    </MaintenanceWrapper>
  );
};

export default MaintenancePanel;
