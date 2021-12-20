import React from "react";
import styled from "styled-components";
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
  .card {
    padding: 0;
  }
`;

const MobileOverlayFilter = styled.div``;

const GallerySidebarComments = (props) => {
  const actions = useWIPActions();

  const closeMobileModal = () => {
    document.body.classList.remove("mobile-modal-open");
  };

  const handleShowModal = () => actions.showModal();

  return (
    <Wrapper className="col-md-3 app-sidebar bottom-modal-mobile">
      <MobileOverlayFilter className="mobile-overlay" onClick={closeMobileModal} />
      <div className="bottom-modal-mobile_inner h-100">
        <div className="app-sidebar-menu h-100" tabIndex="2">
          <div className="card card-body create-new-post-wrapper h-100">
            <div className="card-header d-flex">Comments</div>
            <div className="card-body d-flex"></div>
            <div className="card-footer d-flex">
              <button className="btn btn-primary btn-block" onClick={handleShowModal}>
                Approve design
              </button>
            </div>
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default React.memo(GallerySidebarComments);
