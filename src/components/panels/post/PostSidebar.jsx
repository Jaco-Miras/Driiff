import React from "react";
import styled from "styled-components";
import { PostFilterItem, PostFilterTag, PostList } from "./index";

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

const PostSidebar = (props) => {
  const { workspace, isMember, filter, filters, tag, count, postLists, counters, postActions, onGoBack, dictionary, disableOptions, postListTag } = props;

  const handleShowWorkspacePostModal = () => {
    postActions.showModal("create");
  };

  const closeMobileModal = () => {
    document.body.classList.remove("mobile-modal-open");
  };
  const handleShowNewPostListModal = ()=> {
    postActions.showModal("create_edit_post_list");
  }

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
          <PostFilterItem workspace={workspace} filter={filter} filters={filters} tag={tag} onGoBack={onGoBack} counters={counters} dictionary={dictionary} />
          <div className="card-body">
            <h6 className="mb-0">{dictionary.category}</h6>
          </div>
          <PostFilterTag count={count} workspace={workspace} tag={tag} onGoBack={onGoBack} dictionary={dictionary} />
        </div>
      </div>
      <div className="bottom-modal-mobile_inner">
        <div className="app-sidebar-menu mt-3" tabIndex="2">
          <div className="card-body create-new-post-wrapper">
            <button className="btn btn-primary btn-block" onClick={handleShowNewPostListModal} disabled={disableOptions}>
              {dictionary.createNewList}
            </button>
          </div>
          <PostList workspace={workspace} postLists={postLists} tag={tag} postListTag={postListTag} onGoBack={onGoBack}
                                dictionary={dictionary}/>
        </div>
      </div>
    </Wrapper>
  );
};

export default React.memo(PostSidebar);
