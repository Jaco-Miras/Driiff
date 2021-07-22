import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { SvgIconFeather } from "../../common";
import { PostItemPanel } from "./index";

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

const Posts = (props) => {
  const { actions, dictionary, filter, isExternalUser, loading, posts, search, workspace } = props;

  const componentIsMounted = useRef(true);

  const readPosts = posts.filter((p) => p.is_unread === 0);
  const unreadPosts = posts.filter((p) => p.is_unread === 1);

  const [showPosts, setShowPosts] = useState({ showUnread: unreadPosts.length > 0, showRead: unreadPosts.length === 0 });
  const [checkedPosts, setCheckedPosts] = useState([]);

  const handleToggleCheckbox = (postId) => {
    let checked = !checkedPosts.some((id) => id === postId);
    const postIds = checked ? [...checkedPosts, postId] : checkedPosts.filter((id) => id !== postId);
    setCheckedPosts(postIds);
  };

  const handleMarkAllAsRead = () => {
    actions.readAll({
      selected_post_ids: checkedPosts,
      topic_id: workspace.id,
    });
    setCheckedPosts([]);
    actions.getUnreadNotificationEntries({ add_unread_comment: 1 });
  };

  const handleArchiveAll = () => {
    actions.archiveAll({
      selected_post_ids: checkedPosts,
      topic_id: workspace.id,
    });
    setCheckedPosts([]);
  };

  // const handleShowPosts = (type) => {
  //   setShowPosts({
  //     ...showPosts,
  //     [type]: !showPosts[type],
  //   });
  // };

  const handleShowUnread = () => {
    if (showPosts.showUnread) {
      // to false
      setShowPosts({
        showUnread: readPosts.length > 0 ? false : true,
        showRead: readPosts.length > 0 ? true : false,
      });
    } else {
      // to true
      setShowPosts({
        showUnread: true,
        showRead: showPosts.showRead,
      });
    }
  };

  const handleShowRead = () => {
    if (showPosts.showRead) {
      // to false
      setShowPosts({
        showUnread: unreadPosts.length > 0 ? true : false,
        showRead: unreadPosts.length > 0 ? false : true,
      });
    } else {
      // to true
      setShowPosts({
        showUnread: unreadPosts.length > 0 ? true : false,
        showRead: readPosts.length > 0 ? true : false,
      });
    }
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
    return () => {
      componentIsMounted.current = null;
    };
  }, []);

  useEffect(() => {
    if (componentIsMounted.current) setCheckedPosts([]);
  }, [filter]);

  useEffect(() => {
    // if bot category is set to false then show the category with posts
    if (componentIsMounted.current) {
      if (!showPosts.showUnread && !showPosts.showRead) {
        if (unreadPosts.length) {
          setShowPosts((prevState) => {
            return {
              ...prevState,
              showUnread: true,
            };
          });
        } else if (readPosts.length) {
          setShowPosts((prevState) => {
            return {
              ...prevState,
              showRead: true,
            };
          });
        }
      }
    }
  }, [showPosts, readPosts, unreadPosts]);

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
          {filter === "draft" && (
            <ul className="list-group list-group-flush ui-sortable fadeIn">
              <div>
                {posts.map((p) => {
                  return (
                    <PostItemPanel key={p.id} post={p} postActions={actions} dictionary={dictionary} toggleCheckbox={handleToggleCheckbox} checked={checkedPosts.some((id) => id === p.id)} hasUnread={true} isExternalUser={isExternalUser} />
                  );
                })}
              </div>
            </ul>
          )}
          {filter !== "draft" && (
            <ul className="list-group list-group-flush ui-sortable fadeIn">
              {search === "" && (
                <div>
                  <UnreadPostsHeader className={"list-group-item post-item-panel pl-3 unread-posts-header"} onClick={handleShowUnread} showPosts={showPosts.showUnread}>
                    <span className="badge badge-light">
                      <SvgIconFeather icon={showPosts.showUnread ? "arrow-up" : "arrow-down"} width={16} height={16} className="mr-1" />
                      {dictionary.unread}
                    </span>
                  </UnreadPostsHeader>
                </div>
              )}
              {unreadPosts.length > 0 && (
                <UnreadPostsContainer className={`unread-posts-container collapse ${showPosts.showUnread || search !== "" ? "show" : ""}`} id={"unread-posts-container"} showPosts={showPosts.showUnread}>
                  {unreadPosts.map((p, k) => {
                    return (
                      <PostItemPanel
                        key={p.id}
                        firstPost={k === 0}
                        post={p}
                        postActions={actions}
                        dictionary={dictionary}
                        toggleCheckbox={handleToggleCheckbox}
                        checked={checkedPosts.some((id) => id === p.id)}
                        hasUnread={true}
                        isExternalUser={isExternalUser}
                      />
                    );
                  })}
                </UnreadPostsContainer>
              )}
              {search === "" && (
                <div>
                  <ReadPostsHeader className={"list-group-item post-item-panel pl-3 other-posts-header"} onClick={handleShowRead} showPosts={showPosts.showRead}>
                    <span className="badge badge-light">
                      <SvgIconFeather icon={showPosts.showRead ? "arrow-up" : "arrow-down"} width={16} height={16} className="mr-1" />
                      {dictionary.allOthers}
                    </span>
                  </ReadPostsHeader>
                </div>
              )}
              {readPosts.length > 0 && (
                <ReadPostsContainer className={`read-posts-container collapse ${showPosts.showRead || search !== "" ? "show" : ""}`} showPosts={showPosts.showRead}>
                  {readPosts.map((p, k) => {
                    return (
                      <PostItemPanel
                        key={p.id}
                        firstPost={k === 0}
                        post={p}
                        postActions={actions}
                        dictionary={dictionary}
                        toggleCheckbox={handleToggleCheckbox}
                        checked={checkedPosts.some((id) => id === p.id)}
                        hasUnread={false}
                        isExternalUser={isExternalUser}
                      />
                    );
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

export default Posts;
