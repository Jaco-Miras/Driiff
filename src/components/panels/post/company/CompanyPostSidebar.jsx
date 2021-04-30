import React from "react";
import styled from "styled-components";
import { SvgIconFeather } from "../../../common";
import { CompanyPostFilterItem, CompanyPostFilterTag, CompanyPostList } from "./index";

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

const StyledIcon = styled(SvgIconFeather)`
  width: 1em;
  vertical-align: bottom;
  margin-right: 40px;

  &:hover {
    color: #000000;
  }
`;

const MobileOverlayFilter = styled.div``;

const CompanyPostSidebar = (props) => {
  const { workspace, filter, tag, postListTag, count, postLists, counters, postActions, onGoBack, dictionary, disableOptions } = props;
  const handleShowPostModal = () => {
    postActions.showModal("create_company");
  };

  const closeMobileModal = () => {
    document.body.classList.remove("mobile-modal-open");
  };

  const handleShowNewPostListModal = () => {
    postActions.showModal("create_edit_post_list");
  };

  return (
    <Wrapper className="col-md-3 app-sidebar bottom-modal-mobile">
      <MobileOverlayFilter className="mobile-overlay" onClick={closeMobileModal} />
      <div className="bottom-modal-mobile_inner">
        <div className="app-sidebar-menu" tabIndex="2">
          <div className="card-body create-new-post-wrapper">
            <button className="btn btn-primary btn-block" onClick={handleShowPostModal} disabled={disableOptions}>
              {dictionary.createNewPost}
            </button>
          </div>
          <CompanyPostFilterItem filter={filter} tag={tag} onGoBack={onGoBack} counters={counters} dictionary={dictionary} />
          <div className="post-filter-item list-group list-group-flush">
            <span className={"list-group-item d-flex align-items-center pr-3"} data-value="inbox">
              {dictionary.category}
              <span className="ml-auto" onClick={handleShowNewPostListModal} disabled={disableOptions}>
                <StyledIcon className="mr-0" icon="plus" />
              </span>
            </span>
          </div>
          <CompanyPostFilterTag count={count} workspace={workspace} tag={tag} onGoBack={onGoBack} dictionary={dictionary} />
          <CompanyPostList postLists={postLists} tag={tag} postListTag={postListTag} onGoBack={onGoBack} dictionary={dictionary} postActions={postActions} />
        </div>
      </div>
    </Wrapper>
  );
};

export default React.memo(CompanyPostSidebar);
