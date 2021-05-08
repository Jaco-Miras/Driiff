import React from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import AllWorkspaceFilters from "./AllWorkspaceFilters";
import { SvgIconFeather } from "../../common";

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

const NewWsButton = styled.button`
  display: inline-flex;
  align-items: center;
`;

const Icon = styled(SvgIconFeather)`
  margin-right: 4px;
`;

const MobileOverlayFilter = styled.div``;

const AllWorkspaceSidebar = (props) => {
  const { actions, counters, dictionary, filterBy } = props;

  const user = useSelector((state) => state.session.user);

  const closeMobileModal = () => {
    document.body.classList.remove("mobile-modal-open");
  };

  return (
    <Wrapper className="col-md-3 app-sidebar bottom-modal-mobile">
      <MobileOverlayFilter className="mobile-overlay" onClick={closeMobileModal} />
      <div className="bottom-modal-mobile_inner">
        <div className="app-sidebar-menu" tabIndex="2">
          {user.type === "internal" && (
            <div className="card-body create-new-post-wrapper">
              <NewWsButton className="btn btn-primary btn-block" onClick={actions.showWorkspaceModal}>
                <Icon icon="circle-plus" />
                {dictionary.addNewWorkspace}
              </NewWsButton>
            </div>
          )}
          <div className="post-filter-item list-group list-group-flush">
            <span className={"list-group-item d-flex align-items-center pr-3"} data-value="inbox">
              {dictionary.filters}
            </span>
          </div>
          <AllWorkspaceFilters actions={actions} counters={counters} dictionary={dictionary} filterBy={filterBy} />
        </div>
      </div>
    </Wrapper>
  );
};

export default AllWorkspaceSidebar;
