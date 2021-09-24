import React from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import AllWorkspaceFilters from "./AllWorkspaceFilters";
import { SvgIconFeather } from "../../common";
import { AllWorkspaceFolders } from ".";
import Tooltip from "react-tooltip-lite";
import { addToModals } from "../../../redux/actions/globalActions";

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

const StyledIcon = styled(SvgIconFeather)`
  width: 1em;
  vertical-align: bottom;
  margin-right: 40px;
  cursor: pointer;

  &:hover {
    color: #000000;
  }
`;

const MobileOverlayFilter = styled.div``;

const AllWorkspaceSidebar = (props) => {
  const { actions, counters, dictionary, filterBy } = props;

  const dispatch = useDispatch();

  const user = useSelector((state) => state.session.user);

  const closeMobileModal = () => {
    document.body.classList.remove("mobile-modal-open");
  };

  const handleShowFolderModal = () => {
    let payload = {
      type: "workspace_folder",
      mode: "create",
    };
    dispatch(addToModals(payload));
  };

  const toggleTooltip = () => {
    let tooltips = document.querySelectorAll("span.react-tooltip-lite");
    tooltips.forEach((tooltip) => {
      tooltip.parentElement.classList.toggle("tooltip-active");
    });
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
          <div className="post-filter-item list-group list-group-flush">
            <span className={"list-group-item d-flex align-items-center pr-3"} data-value="inbox">
              {dictionary.folders}
              <span className="ml-auto">
                <Tooltip onToggle={toggleTooltip} content={dictionary.newFolder}>
                  <StyledIcon className="mr-0" icon="plus" onClick={handleShowFolderModal} />
                </Tooltip>
              </span>
            </span>
          </div>
          <AllWorkspaceFolders />
        </div>
      </div>
    </Wrapper>
  );
};

export default AllWorkspaceSidebar;
