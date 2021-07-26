import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { SvgIconFeather } from "../../../common";
import { CompanyPostItemPanel } from "./index";

const PostsBtnWrapper = styled.div`
  margin-bottom: 10px;
  .btn {
    margin-left: 10px;
  }
`;

const UnreadPostsContainer = styled.div`
  li {
    border-radius: 0 !important;
  }
`;

const ReadPostsContainer = styled.div`
  li {
    border-radius: 0 !important;
    background-color: #fafafa !important;
    .dark & {
      background-color: hsla(0, 0%, 100%, 0.0784313725490196) !important;
    }
  }
`;

const UnreadPostsHeader = styled.li`
  border-radius: 6px 6px 0 0 !important;
  border-bottom: 1px solid #ebebeb;
  // border-bottom: ${(props) => (props.showPosts ? "0" : "1px solid #ebebeb")};
  .badge-light {
    background: rgb(175, 184, 189, 0.2);
    .dark & {
      color: #fff;
    }
  }
`;

const ReadPostsHeader = styled.li`
  border-radius: ${(props) => (props.showPosts ? "0" : "0 0 6px 6px !important")};
  border-bottom: ${(props) => (props.showPosts ? "0" : "1px solid #ebebeb")};
  .badge-light {
    background: rgb(175, 184, 189, 0.2);
    .dark & {
      color: #fff;
    }
  }
`;

const CompanyPosts = (props) => {
  const { actions, dictionary, filter, isExternalUser, loading, posts, search } = props;

  const readPosts = posts.filter((p) => p.is_unread === 0);
  const unreadPosts = posts.filter((p) => p.is_unread === 1);

  console.log(posts, readPosts, unreadPosts);

  //const [showPosts, setShowPosts] = useState({ showUnread: unreadPosts.length > 0, showRead: unreadPosts.length === 0 });
  const [showPosts, setShowPosts] = useState({ showUnread: true, showRead: true });
  const [checkedPosts, setCheckedPosts] = useState([]);

  const handleToggleCheckbox = (postId) => {
    let checked = !checkedPosts.some((id) => id === postId);
    const postIds = checked ? [...checkedPosts, postId] : checkedPosts.filter((id) => id !== postId);
    setCheckedPosts(postIds);
  };

  const handleMarkAllAsRead = () => {
    actions.readAll({
      selected_post_ids: checkedPosts,
    });
    setCheckedPosts([]);
    actions.getUnreadNotificationEntries({ add_unread_comment: 1 });
  };

  const handleArchiveAll = () => {
    actions.archiveAll({
      selected_post_ids: checkedPosts,
    });
    setCheckedPosts([]);
  };

  const handleShowUnread = () => {
    setShowPosts((prevState) => {
      return {
        ...prevState,
        showUnread: !showPosts.showUnread,
      };
    });
  };

  const handleShowRead = () => {
    setShowPosts((prevState) => {
      return {
        ...prevState,
        showRead: !showPosts.showRead,
      };
    });
  };

  const handleSelectAllDraft = () => {
    setCheckedPosts(posts.map((p) => p.id));
  };

  const handleRemoveDraft = () => {
    if (checkedPosts.length) {
      checkedPosts.forEach((id) => {
        let post = posts.find((p) => p.id === id);
        if (post) actions.archivePost(post);
      });
    }
  };

  useEffect(() => {
    setCheckedPosts([]);
  }, [filter]);

  return (
    <>
      {(filter === "all" || filter === "inbox") && checkedPosts.length > 0 && (
        <PostsBtnWrapper>
          <button className="btn all-action-button" onClick={handleArchiveAll}>
            {dictionary.archive}
          </button>
          <button className="btn all-action-button" onClick={handleMarkAllAsRead}>
            {dictionary.markAsRead}
          </button>
        </PostsBtnWrapper>
      )}
      {filter === "draft" && (
        <PostsBtnWrapper>
          <button className="btn all-action-button" onClick={handleSelectAllDraft}>
            {dictionary.selectAll}
          </button>
          <button className="btn all-action-button" onClick={handleRemoveDraft}>
            {dictionary.remove}
          </button>
        </PostsBtnWrapper>
      )}
      <div className="card card-body app-content-body mb-4 unset-flex">
        <div className="app-lists" tabIndex="1" data-loaded="0" data-loading={loading}>
          {search !== "" && (
            <>
              {posts.length === 0 ? (
                <h6 className="search-title card-title font-size-11 text-uppercase mb-4">
                  {dictionary.searchNoResult} {search}
                </h6>
              ) : posts.length === 1 ? (
                <h6 className="search-title card-title font-size-11 text-uppercase mb-4">
                  {dictionary.searchResult} {search}
                </h6>
              ) : (
                <h6 className="search-title card-title font-size-11 text-uppercase mb-4">
                  {dictionary.searchResults} {search}
                </h6>
              )}
            </>
          )}
          {filter !== "all" && (
            <ul className="list-group list-group-flush ui-sortable fadeIn">
              <div>
                {posts.map((p) => {
                  return <CompanyPostItemPanel key={p.id} post={p} postActions={actions} dictionary={dictionary} toggleCheckbox={handleToggleCheckbox} checked={checkedPosts.some((id) => id === p.id)} isExternalUser={isExternalUser} />;
                })}
              </div>
            </ul>
          )}
          {filter === "all" && search === "" && (
            <ul className="list-group list-group-flush ui-sortable fadeIn">
              <div>
                <UnreadPostsHeader className={"list-group-item post-item-panel pl-3 unread-posts-header"} onClick={handleShowUnread} showPosts={showPosts.showUnread}>
                  <span className="badge badge-light">
                    <SvgIconFeather icon={showPosts.showUnread ? "arrow-up" : "arrow-down"} width={16} height={16} className="mr-1" />
                    {dictionary.unread}
                  </span>
                </UnreadPostsHeader>
              </div>

              {unreadPosts.length > 0 && (
                <UnreadPostsContainer className={`unread-posts-container collapse ${showPosts.showUnread ? "show" : ""} fadeIn`} id={"unread-posts-container"} showPosts={showPosts.showUnread}>
                  {unreadPosts.map((p) => {
                    return <CompanyPostItemPanel key={p.id} post={p} postActions={actions} dictionary={dictionary} toggleCheckbox={handleToggleCheckbox} checked={checkedPosts.some((id) => id === p.id)} isExternalUser={isExternalUser} />;
                  })}
                </UnreadPostsContainer>
              )}
              <div>
                <ReadPostsHeader className={"list-group-item post-item-panel pl-3 other-posts-header"} onClick={handleShowRead} showPosts={showPosts.showRead}>
                  <span className="badge badge-light">
                    <SvgIconFeather icon={showPosts.showRead ? "arrow-up" : "arrow-down"} width={16} height={16} className="mr-1" />
                    {dictionary.allOthers}
                  </span>
                </ReadPostsHeader>
              </div>
              {readPosts.length > 0 && (
                <ReadPostsContainer className={`read-posts-container collapse ${showPosts.showRead ? "show" : ""} fadeIn`} showPosts={showPosts.showRead}>
                  {readPosts.map((p) => {
                    return <CompanyPostItemPanel key={p.id} post={p} postActions={actions} dictionary={dictionary} toggleCheckbox={handleToggleCheckbox} checked={checkedPosts.some((id) => id === p.id)} isExternalUser={isExternalUser} />;
                  })}
                </ReadPostsContainer>
              )}
            </ul>
          )}
        </div>
      </div>
    </>
  );
};

export default CompanyPosts;
