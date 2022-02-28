import React from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  .card-header {
    height: 70px;
  }
  .card-footer {
    border: none;
    flex-flow: column;
    .custom-checkbox {
      margin-bottom: 0.75rem;
    }
    .file-input-wrapper {
      border: 1px solid #ebebeb;
      border-radius: 6px;
      margin-bottom: 2rem;
      position: relative;
      min-height: 125px;
      background: #f1f2f7;
    }
  }
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
  .card {
    padding: 0;
  }
`;

const MobileOverlayFilter = styled.div``;

const WIPSidebarPlaceholder = (props) => {
  const closeMobileModal = () => {
    document.body.classList.remove("mobile-modal-open");
  };

  return (
    <Wrapper className="col-md-3 app-sidebar bottom-modal-mobile">
      <MobileOverlayFilter className="mobile-overlay" onClick={closeMobileModal} />
      <div className="bottom-modal-mobile_inner h-100">
        <div className="app-sidebar-menu h-100" tabIndex="2">
          <div className="card card-body create-new-post-wrapper h-100">
            <div className="card-body d-flex"></div>
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default React.memo(WIPSidebarPlaceholder);
