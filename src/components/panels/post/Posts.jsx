import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { SvgIconFeather } from "../../common";
import { PostItemPanel } from "./index";
import { useTranslationActions } from "../../hooks";
import { useDispatch } from "react-redux";
import { setPostIsSelected } from "../../../redux/actions/workspaceActions";

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

const EmptyState = styled.div`
  margin: 0;
  width: 100%;
  text-align: center;
  margin: auto;
  text-align: center;
  padding: 2rem;
  border: 1px solid #ebebeb;
  border-top: none;

  svg {
    display: block;
    margin: 0 auto;
  }

  h3 {
    font-size: 16px;
  }
  h5 {
    margin-bottom: 0;
    font-size: 14px;
  }

  button {
    width: auto !important;
    margin: 2rem auto;
  }
`;

const Posts = (props) => {
  const { actions, dictionary, filter, isExternalUser, loading, posts, search, workspace } = props;

  const componentIsMounted = useRef(true);

  const { _t } = useTranslationActions();
  const dispatch = useDispatch();

  let emptyStatesHeader = [_t("POSTS.NO_ITEMS_FOUND_HEADER_1", "WOO!"), _t("POSTS.NO_ITEMS_FOUND_HEADER_2", "Queue’s empty, time to dance!")];

  let emptyStatesText = [_t("POSTS.NO_ITEMS_FOUND_TEXT_1", "Nothing here but me… 👻"), _t("POSTS.NO_ITEMS_FOUND_TEXT_2", "Job well done!💃🕺")];

  const [inDexer, setInDexer] = useState(Math.floor(Math.random() * emptyStatesHeader.length));

  const readPosts = posts.filter((p) => p.is_unread === 0);
  const unreadPosts = posts.filter((p) => p.is_archived !== 1 && p.is_unread === 1 && p.is_followed);

  const [showPosts, setShowPosts] = useState({ showUnread: unreadPosts.length > 0, showRead: unreadPosts.length === 0 });
  //const [showPosts, setShowPosts] = useState({ showUnread: true, showRead: true });
  const [checkedPosts, setCheckedPosts] = useState([]);

  const handleToggleCheckbox = (post) => {
    let postIds = !post.is_selected ? [...checkedPosts, post.id] : checkedPosts.filter((id) => id !== post.id);

    setCheckedPosts(postIds);
    dispatch(setPostIsSelected({ workspaceId: workspace.id, postId: post.id, isSelected: !post.is_selected }));
  };

  const handleMarkAllAsRead = () => {
    actions.readAll({
      selected_post_ids: checkedPosts,
      topic_id: workspace.id,
    });
    clearCheckedPost();
    actions.getUnreadNotificationEntries({ add_unread_comment: 1 });
  };

  const handleArchiveAll = () => {
    actions.archiveAll({
      selected_post_ids: checkedPosts,
      topic_id: workspace.id,
    });
    clearCheckedPost();
  };

  // const handleShowPosts = (type) => {
  //   setShowPosts({
  //     ...showPosts,
  //     [type]: !showPosts[type],
  //   });
  // };

  const handleShowUnread = () => {
    setShowPosts((prevState) => {
      return {
        ...prevState,
        showRead: !showPosts.showRead,
        showUnread: !showPosts.showUnread,
      };
    });
  };

  const handleShowRead = () => {
    setShowPosts((prevState) => {
      return {
        ...prevState,
        showRead: !showPosts.showRead,
        showUnread: !showPosts.showUnread,
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
    const _checkedPosts = posts.filter((p) => p.is_selected).map((_p) => _p.id);
    setCheckedPosts(_checkedPosts);
    return () => {
      componentIsMounted.current = null;
    };
  }, []);

  const prevFilter = useRef(filter).current;

  useEffect(() => {
    if (prevFilter === filter) {
      const _checkedPosts = posts.filter((p) => p.is_selected).map((_p) => _p.id);
      setCheckedPosts(_checkedPosts);
    } else {
      clearCheckedPost();
    }
  }, [filter]);

  useEffect(() => {
    setInDexer(Math.floor(Math.random() * emptyStatesHeader.length));
  }, [showPosts]);

  const clearCheckedPost = () => {
    setCheckedPosts([]);
    posts.map((post) => {
      dispatch(setPostIsSelected({ workspaceId: workspace.id, postId: post.id, isSelected: false }));
    });
  };

  return (
    <>
      {(filter === "all" || filter === "inbox") && (checkedPosts.length > 0 || posts.some((item) => item.is_selected)) && (
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
          {filter !== "inbox" && (
            <ul className="list-group list-group-flush ui-sortable fadeIn">
              <div>
                {posts.map((p) => {
                  return <PostItemPanel key={p.id} post={p} postActions={actions} dictionary={dictionary} toggleCheckbox={handleToggleCheckbox} checked={!!p.is_selected} isExternalUser={isExternalUser} />;
                })}
              </div>
            </ul>
          )}
          {filter === "inbox" && search === "" && (
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
                <UnreadPostsContainer className={`unread-posts-container collapse ${showPosts.showUnread ? "show" : ""}`} id={"unread-posts-container"} showPosts={showPosts.showUnread}>
                  {unreadPosts.map((p, k) => {
                    return <PostItemPanel key={p.id} firstPost={k === 0} post={p} postActions={actions} dictionary={dictionary} toggleCheckbox={handleToggleCheckbox} checked={p.is_selected} isExternalUser={isExternalUser} />;
                  })}
                </UnreadPostsContainer>
              )}
              {showPosts.showUnread && unreadPosts.length === 0 && (
                <EmptyState>
                  <h3>{emptyStatesHeader[inDexer]}</h3>
                  <h5>{emptyStatesText[inDexer]} </h5>
                </EmptyState>
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
                <ReadPostsContainer className={`read-posts-container collapse ${showPosts.showRead ? "show" : ""}`} showPosts={showPosts.showRead}>
                  {readPosts.map((p, k) => {
                    return <PostItemPanel key={p.id} firstPost={k === 0} post={p} postActions={actions} dictionary={dictionary} toggleCheckbox={handleToggleCheckbox} checked={p.is_selected} isExternalUser={isExternalUser} />;
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
