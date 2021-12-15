import React from "react";
import styled from "styled-components";
import WorkInProgressSidebarFilters from "./WorkInProgressSidebarFilters";
import WorkInProgressSidebarSubjects from "./WorkInProgressSidebarSubjects";
import { useWIPActions } from "../../hooks";

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

const MobileOverlayFilter = styled.div``;

const WorkInProgressSidebar = (props) => {
  const actions = useWIPActions();

  const closeMobileModal = () => {
    document.body.classList.remove("mobile-modal-open");
  };

  const handleShowModal = () => actions.showModal();

  return (
    <Wrapper className="col-md-3 app-sidebar bottom-modal-mobile">
      <MobileOverlayFilter className="mobile-overlay" onClick={closeMobileModal} />
      <div className="bottom-modal-mobile_inner">
        <div className="app-sidebar-menu" tabIndex="2">
          <div className="card-body create-new-post-wrapper">
            <button className="btn btn-primary btn-block" onClick={handleShowModal}>
              Create WIP
            </button>
          </div>
          <WorkInProgressSidebarFilters />
          <WorkInProgressSidebarSubjects />
        </div>
      </div>
    </Wrapper>
  );
};

export default React.memo(WorkInProgressSidebar);
