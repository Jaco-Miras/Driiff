import React, { useState } from "react";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { useAdminActions } from "../../hooks";

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
  const { setAdminFilter } = useAdminActions();
  const history = useHistory();
  const filters = useSelector((state) => state.admin.filters);

  const handleClickFilter = (e) => {
    e.persist();
    setAdminFilter({ filter: e.target.dataset.value === "quick-links" ? "quick_links" : e.target.dataset.value });
    history.push(`/admin-settings/${e.target.dataset.value}`);
    document.body.classList.remove("mobile-modal-open");
  };

  return (
    <Wrapper className={"list-group list-group-flush"}>
      <li className={`list-group-item d-flex align-items-center ${filters["automation"] ? "active" : ""}`} data-value="automation" onClick={handleClickFilter}>
        Automation
      </li>
      <li className={`list-group-item d-flex align-items-center ${filters["quick_links"] ? "active" : ""}`} data-value="quick-links" onClick={handleClickFilter}>
        Quick link menu
      </li>
      <li className={`list-group-item d-flex align-items-center ${filters["settings"] ? "active" : ""}`} data-value="settings" onClick={handleClickFilter}>
        Settings
      </li>
      <li className={`list-group-item d-flex align-items-center ${filters["bots"] ? "active" : ""}`} data-value="bots" onClick={handleClickFilter}>
        Bots
      </li>
      <li className={`list-group-item d-flex align-items-center ${filters["subscription"] ? "active" : ""}`} data-value="subscription" onClick={handleClickFilter}>
        Subscription
      </li>
      <li className={`list-group-item d-flex align-items-center ${filters["contact"] ? "active" : ""}`} data-value="contact" onClick={handleClickFilter}>
        Contact
      </li>
      <li className={`list-group-item d-flex align-items-center ${filters["support"] ? "active" : ""}`} data-value="support" onClick={handleClickFilter}>
        Support desk
      </li>
    </Wrapper>
  );
};

export default AdminPanelFilters;
