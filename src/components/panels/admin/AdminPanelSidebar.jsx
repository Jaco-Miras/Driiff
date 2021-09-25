import React from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import AdminPanelFilters from "./AdminPanelFilters";

const Wrapper = styled.div`
  .app-sidebar-menu {
    overflow: hidden;
    outline: currentcolor none medium;
    @media (max-width: 991.99px) {
      border-bottom-left-radius: 0 !important;
      border-bottom-right-radius: 0 !important;
      display: flex;
      flex-direction: column;
      .card-body {
        display: none;
      }
      .create-new-post-wrapper {
        border-top: 1px solid #ebebeb;
        display: block;
        order: 9;
      }
      .list-group-flush {
        border-top: 1px solid #ebebeb;
      }
    }
  }
  @media (max-width: 991.99px) {
    margin-bottom: 0 !important;
  }
`;

const AdminPanelSidebar = (props) => {
  const closeMobileModal = () => {
    document.body.classList.remove("mobile-modal-open");
  };

  return (
    <Wrapper className="col-md-3 app-sidebar bottom-modal-mobile">
      <div className="mobile-overlay" onClick={closeMobileModal} />
      <div className="bottom-modal-mobile_inner">
        <div className="app-sidebar-menu" tabIndex="2">
          <div className="post-filter-item list-group list-group-flush">
            <span className={"list-group-item d-flex align-items-center pr-3"} data-value="inbox">
              <h4>Admin menu</h4>
            </span>
          </div>
          <AdminPanelFilters />
        </div>
      </div>
    </Wrapper>
  );
};

export default AdminPanelSidebar;
