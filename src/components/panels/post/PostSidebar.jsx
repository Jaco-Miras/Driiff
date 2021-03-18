import React from "react";
import styled from "styled-components";
import { SvgIconFeather } from "../../common";
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

const PostsBtnWrapper = styled.div`
  //text-align: right;
  margin-bottom: 10px;
  .btn {
    margin-left: 10px;
  }
`;

const PostListWrapper = styled.span`
  max-width: 500px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: block;
  @media all and (max-width: 1200px) {
    max-width: 200px;
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
          <div className="post-filter-item list-group list-group-flush">
            <span className={`list-group-item d-flex align-items-center pr-3`} data-value="inbox">
              {dictionary.category}
              <span className="ml-auto" onClick={handleShowNewPostListModal} disabled={disableOptions}>
                <StyledIcon className="mr-0" icon="plus" />
              </span>
            </span>
          </div>
          <PostFilterTag count={count} workspace={workspace} tag={tag} onGoBack={onGoBack} dictionary={dictionary} />
          <PostList workspace={workspace} postLists={postLists} tag={tag} postListTag={postListTag} onGoBack={onGoBack}
                                dictionary={dictionary} postActions={postActions}/>
        </div>
      </div>
    </Wrapper>
  );
};

export default React.memo(PostSidebar);
