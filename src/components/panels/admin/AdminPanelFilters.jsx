import React from "react";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { useAdminActions, useTranslationActions } from "../../hooks";

const Wrapper = styled.ul`
  .list-group-item:last-child {
    border-bottom-width: thin !important;
  }
  li {
    cursor: pointer;
  }
  &.list-group .list-group-item.active {
    border-color: #eeebee;
    background-color: #fafafa !important;
    .dark & {
      background-color: #111417 !important;
    }
  }
`;

const AdminPanelFilters = (props) => {
  const { _t } = useTranslationActions();
  const dictionary = {
    automation: _t("ADMIN.FILTER_AUTOMATION", "Automation"),
    quickLinks: _t("ADMIN.FILTER_QUICKLINKS", "Quick links"),
    settings: _t("ADMIN.FILTER_SETTINGS", "Login"),
    huddleBots: _t("ADMIN.FILTER_HUDDLE", "Huddle bots"),
    subscription: _t("ADMIN.FILTER_SUBSCRIPTION", "Subscription"),
    contact: _t("ADMIN.FILTER_CONTACT", "Contact"),
    support: _t("ADMIN.FILTER_SUPPORT", "Support desk"),
    company: _t("ADMIN.FILTER_COMPANYSETTINGS", "Company"),
    securitySettings: _t("ADMIN.SECURITY_SETTINGS", "Security"),
    allWorkspaces: _t("ADMIN.ALL_WORKSPACES", "All workspaces"),
    driff: _t("ADMIN.DRIFF", "Driff"),
  };
  const { setAdminFilter } = useAdminActions();
  const history = useHistory();
  const filters = useSelector((state) => state.admin.filters);

  const handleClickFilter = (e) => {
    e.persist();
    setAdminFilter({ filter: e.target.dataset.value === "quick-links" ? "quick_links" : e.target.dataset.value });
    history.push(`/admin-settings/${e.target.dataset.value}`);
    document.body.classList.remove("mobile-modal-open");
  };

  const handleRedirectToSupport = (e) => {
    e.preventDefault();
    window.open("https://support.getdriff.com", "_blank");
  };

  return (
    <Wrapper className={"list-group list-group-flush"}>
      <li className={`list-group-item d-flex align-items-center ${filters["workspaces"] ? "active" : ""}`} data-value="workspaces" onClick={handleClickFilter}>
        {dictionary.allWorkspaces}
      </li>
      <li className={`list-group-item d-flex align-items-center ${filters["automation"] ? "active" : ""}`} data-value="automation" onClick={handleClickFilter}>
        {dictionary.automation}
      </li>
      <li className={`list-group-item d-flex align-items-center ${filters["company-settings"] ? "active" : ""}`} data-value="company-settings" onClick={handleClickFilter}>
        {dictionary.company}
      </li>
      <li className={`list-group-item d-flex align-items-center ${filters["driff"] ? "active" : ""}`} data-value="driff" onClick={handleClickFilter}>
        {dictionary.driff}
      </li>
      <li className={`list-group-item d-flex align-items-center ${filters["bots"] ? "active" : ""}`} data-value="bots" onClick={handleClickFilter}>
        {dictionary.huddleBots}
      </li>
      <li className={`list-group-item d-flex align-items-center ${filters["settings"] ? "active" : ""}`} data-value="settings" onClick={handleClickFilter}>
        {dictionary.settings}
      </li>
      <li className={`list-group-item d-flex align-items-center ${filters["quick_links"] ? "active" : ""}`} data-value="quick-links" onClick={handleClickFilter}>
        {dictionary.quickLinks}
      </li>
      <li className={`list-group-item d-flex align-items-center ${filters["security-settings"] ? "active" : ""}`} data-value="security-settings" onClick={handleClickFilter}>
        {dictionary.securitySettings}
      </li>
      <li className={`list-group-item d-flex align-items-center ${filters["subscription"] ? "active" : ""}`} data-value="subscription" onClick={handleClickFilter}>
        {dictionary.subscription}
      </li>
      <li className={`list-group-item d-flex align-items-center ${filters["support"] ? "active" : ""}`} data-value="support" onClick={handleRedirectToSupport}>
        {dictionary.support}
      </li>
    </Wrapper>
  );
};

export default AdminPanelFilters;
