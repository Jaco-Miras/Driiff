import React from "react";
import styled from "styled-components";
import { PostFilterItem, PostFilterTag } from "./index";

const Wrapper = styled.div`
  .app-sidebar-menu {
    overflow: hidden;
    outline: currentcolor none medium;
  }
`;

const PostSidebar = (props) => {
  const { workspace, isMember, filter, tag, count, counters, postActions, onGoBack, dictionary } = props;

  const handleShowWorkspacePostModal = () => {
    postActions.showModal("create");
  };

  return (
    <Wrapper className="col-md-3 app-sidebar">
      <div className="">
        <div className="app-sidebar-menu" tabIndex="2">
          {isMember && (
            <div className="card-body">
              <button className="btn btn-primary btn-block" onClick={handleShowWorkspacePostModal}>
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
