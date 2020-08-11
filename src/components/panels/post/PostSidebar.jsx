import React from "react";
import styled from "styled-components";
import { PostFilterItem, PostFilterTag } from "./index";

const Wrapper = styled.div`
  .app-sidebar-menu {
    overflow: hidden;
    outline: currentcolor none medium;
    @media (max-width: 768px) {
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
  @media (max-width: 768px) {
    margin-bottom: 0px !important;
  }
`;

const MobileOverlayFilter = styled.div``;

const PostSidebar = (props) => {
  const { workspace, isMember, filter, tag, count, counters, postActions, onGoBack, dictionary, disableOptions } = props;

  const handleShowWorkspacePostModal = () => {
    postActions.showModal("create");
  };

  const closeMobileModal = () => {
      document.body.classList.remove("mobile-modal-open");
  };

  return (
    <Wrapper className="col-md-3 app-sidebar bottom-modal-mobile">
      <MobileOverlayFilter className="mobile-overlay" onClick={closeMobileModal} />
      <div className="bottom-modal-mobile_inner">
        <div className="app-sidebar-menu" tabIndex="2">
          {isMember && (
            <div className="card-body create-new-post-wrapper">
              <button className="btn btn-primary btn-block" onClick={handleShowWorkspacePostModal} disabled={disableOptions}>
                {dictionary.createNewPost}
              </button>
            </div>
          )}
          <PostFilterItem workspace={workspace} filter={filter} tag={tag} onGoBack={onGoBack} counters={counters} dictionary={dictionary}/>
          <div className="card-body">
            <h6 className="mb-0">{dictionary.category}</h6>
          </div>
          <PostFilterTag count={count} workspace={workspace} tag={tag} onGoBack={onGoBack} dictionary={dictionary}/>
        </div>
      </div>
    </Wrapper>
  );
};

export default React.memo(PostSidebar);
