import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { useAdminActions, useTranslationActions } from "../../hooks";
import { Route, Switch, useHistory } from "react-router-dom";
import AdminBotBody from "./AdminBotBody";
import GrippBotBody from "./GrippBotBody";
import BitrixBody from "./BitrixBody";
import { SvgIcon, SvgIconFeather } from "../../common";
import BitrixIcon from "../../../assets/img/bitrix.png";

const Wrapper = styled.div`
  padding: 1rem;
  > div {
    margin-bottom: 1rem;
  }
  .card-body {
    height: 125px;
    cursor: pointer;
    .icon-gripp-logo,
    .bitrix-icon {
      width: 100%;
      height: 100%;
    }
    .feather-admin-bot {
      width: 48px;
      height: 48px;
      margin-right: 5px;
    }
  }
  .card-body.admin-bot {
    display: flex;
    align-items: center;
    justify-content: center;
    h4 {
      margin: 0;
    }
  }
`;

const AutomationBody = () => {
  const { _t } = useTranslationActions();
  const history = useHistory();
  const { setAdminFilter } = useAdminActions();
  const componentIsMounted = useRef(true);

  const dictionary = {
    automationLabel: _t("ADMIN.AUTOMATION_LABEL", "Automation"),
  };

  const filters = useSelector((state) => state.admin.filters);

  useEffect(() => {
    setAdminFilter({ filters: { ...filters, automation: true } });
    return () => {
      componentIsMounted.current = false;
    };
  }, []);

  const handleRedirect = (name) => {
    history.push(`/admin-settings/automation/${name}`);
  };

  return (
    <Wrapper>
      <h4 className="mb-3">{dictionary.automationLabel}</h4>
      <div className="row">
        <div className="col-12 col-md-4">
          <div className="card border" onClick={() => handleRedirect("gripp")}>
            <div className="card-body">
              <SvgIcon icon="gripp-logo" />
            </div>
          </div>
        </div>
        <div className="col-12 col-md-4">
          <div className="card border" onClick={() => handleRedirect("admin-bot")}>
            <div className="card-body admin-bot">
              <SvgIconFeather icon="admin-bot" viewBox="0 0 54 54" />
              <h4>Admin bot</h4>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-4">
          <div className="card border" onClick={() => handleRedirect("bitrix")}>
            <div className="card-body">
              <img className="bitrix-icon" src={BitrixIcon} alt="bitrix" />
            </div>
          </div>
        </div>
      </div>
      <Switch>
        <Route component={AdminBotBody} path={["/admin-settings/automation/admin-bot"]} />
        <Route component={GrippBotBody} path={["/admin-settings/automation/gripp"]} />
        <Route component={BitrixBody} path={["/admin-settings/automation/bitrix"]} />
      </Switch>
    </Wrapper>
  );
};

export default AutomationBody;
