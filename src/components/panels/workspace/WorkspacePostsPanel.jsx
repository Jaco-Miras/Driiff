import React, { useCallback, useEffect, useState, useMemo } from "react";
import { useHistory, useParams } from "react-router-dom";
import styled from "styled-components";
import { SvgEmptyState, SvgIconFeather } from "../../common";
import { usePosts, useTranslation } from "../../hooks";
import { PostDetail, PostFilterSearchPanel, PostItemPanel, PostSidebar } from "../post";
import { throttle, find } from "lodash";
import { addToWorkspacePosts } from "../../../redux/actions/postActions";
import { updateWorkspacePostFilterSort } from "../../../redux/actions/workspaceActions";
import { useDispatch } from "react-redux";

const Wrapper = styled.div`
  overflow-y: auto;
  overflow-x: hidden;
  text-align: left;

  .app-lists {
    overflow: visible !important;
  }

  .app-block {
    overflow: inherit;
  }

  .search-title {
    margin: 1.5rem 1.5rem 0;
  }

  .app-content-body {
    position: relative;
    overflow: visible !important;
    height: auto !important;
    min-height: auto;

    .app-lists {
      overflow: auto;
      &::-webkit-scrollbar {
        display: none;
      }
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
  }

  .all-action-button {
    background: none;
    color: #828282;
    padding: 10px 5px 5px 5px;
    font-weight: 500;
    .dark & {
      color: rgba(255, 255, 255, 0.5);
    }
  }
  .unset-flex {
    flex: unset !important;
  }
  .other-posts-header {
    background-color: #fafafa !important;
    .dark & {
      background-color: hsla(0, 0%, 100%, 0.0784313725490196) !important;
    }
  }
`;

const PostDetailWrapper = styled.div`
  min-height: 240px;
  .card-body {
    padding: 1rem 1.5rem;
  }
`;

const EmptyState = styled.div`
  padding: 8rem 0;
  max-width: 375px;
  margin: auto;
  text-align: center;

  svg {
    display: block;
  }
  button {
    width: auto !important;
    margin: 2rem auto;
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
  @media all and (max-width: 1200px) {
    max-width: 200px;
  }
`;

const StyledIcon = styled(SvgIconFeather)`
  width: 1em;
  &:hover {
    color: #000000;
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

let fetching = false;
const WorkspacePostsPanel = (props) => {
  const { className = "", workspace, isMember } = props;

  const params = useParams();
  const history = useHistory();

  const dispatch = useDispatch();

  const { actions, posts, filter, tag, sort, post, user, search, count, postLists, counters, filters, postListTag } = usePosts();
  const readByUsers = post ? Object.values(post.user_reads).sort((a, b) => a.name.localeCompare(b.name)) : [];
  const ofNumberOfUsers = post && post.required_users ? post.required_users : [];
  const [loading, setLoading] = useState(false);
  const [checkedPosts, setCheckedPosts] = useState([]);
  const [loadPosts, setLoadPosts] = useState(false);
  const [activePostListName, setActivePostListName] = useState({});
  const [showPosts, setShowPosts] = useState({ showUnread: true, showRead: false });
  const readPosts = posts.filter((p) => p.is_unread === 0 && p.unread_count === 0);
  const unreadPosts = posts.filter((p) => p.is_unread === 1 || p.unread_count > 0);
  const isExternalUser = user.type === "external";

  const handleToggleCheckbox = (postId) => {
    let checked = !checkedPosts.some((id) => id === postId);
    const postIds = checked ? [...checkedPosts, postId] : checkedPosts.filter((id) => id !== postId);
    setCheckedPosts(postIds);
  };

  const handleShowWorkspacePostModal = () => {
    actions.showModal("create");
  };

  const handleGoback = useCallback(() => {
    if (params.hasOwnProperty("postId")) {
      let pathname = history.location.pathname.split("/post/")[0];
      history.push(pathname);
    }
  }, [params, history]);

  useEffect(() => {
    if (params.hasOwnProperty("workspaceId")) {
      actions.getUnreadWsPostsCount({ topic_id: params.workspaceId });
    }
    if (filter && (filter === "inbox" || filter === "all") && unreadPosts.length === 0 && readPosts.length > 0) {
      setShowPosts({
        ...showPosts,
        showRead: true,
      });
    }
  }, []);

  useEffect(() => {
    if (params.hasOwnProperty("workspaceId")) {
      actions.getRecentPosts(params.workspaceId);
    }
  }, [params.workspaceId]);

  const { _t } = useTranslation();

  const dictionary = {
    createNewPost: _t("POST.CREATE_NEW_POST", "Create new post"),
    all: _t("POST.ALL", "All"),
    inbox: _t("POST.INBOX", "Inbox"),
    newReply: _t("POST.NEW_REPLY", "New reply"),
    myPosts: _t("POST.MY_POSTS", "My sent posts"),
    starred: _t("POST.STARRED", "Starred"),
    archived: _t("POST.ARCHIVED", "Archived"),
    draft: _t("POST.DRAFT", "Draft"),
    drafts: _t("POST.DRAFTS", "Drafts"),
    category: _t("POST.CATEGORY", "Category"),
    replyRequired: _t("POST.REPLY_REQUIRED", "Reply required"),
    mustRead: _t("POST.MUST_READ", "Must read"),
    noReplies: _t("POST.NO_REPLIES", "No replies"),
    sortBy: _t("POST.SORT_BY", "Sort by"),
    starredFavorite: _t("POST.STARRED_FAVORITE", "Starred / Favorite"),
    recent: _t("POST.RECENT", "Recent"),
    unread: _t("POST.UNREAD", "Unread"),
    searchPost: _t("POST.SEARCH_POST", "Search by post title, content, or comment"),
    markAsRead: _t("POST.MARK_AS_READ", "Mark as read"),
    markAsUnread: _t("POST.MARK_AS_UNREAD", "Mark as unread"),
    share: _t("POST.SHARE", "Share"),
    snooze: _t("POST.SNOOZE", "Snooze"),
    follow: _t("POST.FOLLOW", "Follow"),
    unFollow: _t("POST.UNFOLLOW", "Unfollow"),
    files: _t("POST.FILES", "Files"),
    comment: _t("POST.COMMENT", "Comment"),
    editPost: _t("POST.EDIT_POST", "Edit post"),
    editReply: _t("POST.EDIT_REPLY", "Edit reply"),
    removeReply: _t("POST.REMOVE_REPLY", "Remove reply"),
    quote: _t("POST.QUOTE", "Quote"),
    mentionUser: _t("POST.MENTION_USER", "Mention user"),
    remindMeAboutThis: _t("TODO.REMIND_ME_ABOUT_THIS", "Remind me about this"),
    searchResult: _t("POST.SEARCH_RESULT", "Search Result:"),
    searchResults: _t("POST.SEARCH_RESULTS", "Search Results:"),
    searchNoResult: _t("POST.NO_SEARCH_RESULT", "No result found:"),
    private: _t("POST.PRIVATE", "Private"),
    by: _t("POST.BY", "by"),
    star: _t("POST.STAR", "Mark with star"),
    unStar: _t("POST.UNSTAR", "Unmark star"),
    alreadyReadThis: _t("POST.ALREADY_READ_THIS", "I've read this"),
    readByNumberofUsers:
      readByUsers === 1
        ? _t("POST.READY_BY_NUMBER_OF_USERS", "Read by ::user_name::", {
            user_name: readByUsers[0].first_name,
          })
        : _t("POST.READY_BY_NUMBER_OF_USERS", "Read by ::user_count:: users", {
            user_count: readByUsers.length,
          }),
    me: _t("POST.LOGGED_USER_RESPONSIBLE", "me"),
    quotedCommentFrom: _t("POST.QUOTED_COMMENT_FROM", "Quoted comment from"),
    showMore: _t("SHOW_MORE", "Show more"),
    showLess: _t("SHOW_LESS", "Show less"),
    markAll: _t("POST.MARK_ALL_AS_READ", "Mark all as read"),
    archiveAll: _t("POST.ARCHIVE_ALL", "Archive all"),
    noComment: _t("POST.NO_COMMENT", "no comment"),
    oneComment: _t("POST.ONE_COMMENT", "1 comment"),
    comments: _t("POST.NUMBER_COMMENTS", "::comment_count:: comments"),
    messageInSecureWs: _t("POST.MESSAGE_IN_SECURE_WORKSPACE", "message in a secure workspace"),
    markImportant: _t("CHAT.MARK_IMPORTANT", "Mark as important"),
    unMarkImportant: _t("CHAT.UNMARK_IMPORTANT", "Unmark as important"),
    archive: _t("POST.ARCHIVE", "Archive"),
    requestChange: _t("POST.REQUEST_CHANGE", "Request for change"),
    accept: _t("POST.ACCEPT", "Accept"),
    hasAcceptedProposal: _t("POST.HAS_ACCEPTED_PROPOSAL", "has accepted the proposal."),
    hasRequestedChange: _t("POST.HAS_REQUESTED_CHANGE", "has requested a change."),
    actionNeeded: _t("POST.ACTION_NEEDED", "Action needed"),
    changeRequested: _t("POST.CHANGE_REQUESTED", "Change requested"),
    accepted: _t("POST.ACCEPTED", "Accepted"),
    requestForApproval: _t("POST.REQUEST_FOR_APPROVAL", "Request for approval"),
    closeThisPost: _t("POST.CLOSE_THIS_POST", "Close this post"),
    repliesClosed: _t("POST.REPLIES_CLOSED", "Replies closed"),
    openThisPost: _t("POST.OPEN_THIS_POST", "Open this post"),
    creatorClosedPost: _t("POST.CREATOR_CLOSED_POST", "The creator/internal closed this post for commenting"),
    reopen: _t("POST.REOPEN", "Reopen"),
    closed: _t("POST.CLOSED", "Closed"),
    createNewList: _t("POST.CREATE_NEW_LIST", "New List"),
    addToList: _t("POST.ADD_TO_LIST", "Add to list"),
    removeToList: _t("POST.REMOVE_TO_LIST", "Remove to list"),
    ofNumberOfUsers: _t("POST.OF_NUMBER_OF_USERS", "of ::user_count:: user/s", {
      user_count: ofNumberOfUsers.length,
    }),
    allOthers: _t("POST.ALL_OTHERS", "All others"),
    sharedClientBadge: _t("POST.BADGE_SHARED_CLIENT", "The client can see this post"),
    notSharedClientBadge: _t("POST.BADGE_NOT_SHARED_CLIENT", "This post is private to our team"),
  };

  const handleLoadMore = () => {
    if (!fetching && search === "" && !post) {
      fetching = true;
      setLoading(true);
      let payload = {
        filters: filter === "archive" ? ["post", "archived"] : [],
        topic_id: workspace.id,
        skip: filter === "archive" ? filters?.archived.skip : filters.all.skip,
      };

      if (filter === "all") {
        if (filters.all && !filters.all.hasMore) return;
      } else if (filter === "archive") {
        if (filters.archived && !filters.archived.hasMore) return;
      }

      let cb = (err, res) => {
        setLoading(false);
        fetching = false;
        setLoadPosts(false);
        if (err) return;
        let files = res.data.posts.map((p) => p.files);
        if (files.length) {
          files = files.flat();
        }
        dispatch(
          addToWorkspacePosts({
            topic_id: workspace.id,
            posts: res.data.posts,
            files,
            filters: {
              ...(filter === "all" && {
                all: {
                  active: true,
                  skip: res.data.next_skip,
                  hasMore: res.data.total_take === 25,
                },
              }),
              ...(filter === "archive" && {
                archived: {
                  active: true,
                  skip: res.data.next_skip,
                  hasMore: res.data.total_take === 25,
                },
              }),
            },
          })
        );
      };
      actions.getPosts(payload, cb);
    }
  };

  // const bodyScroll = throttle((e) => {
  //   // console.log(e.srcElement.scrollHeight,e.srcElement.scrollTop)
  //   const offset = 500;
  //   if (e.srcElement.scrollHeight - e.srcElement.scrollTop < 1000 + offset) {
  //     handleLoadMore();
  //   }
  // }, 200);

  // useEffect(() => {
  //   document.body.addEventListener("scroll", bodyScroll, false);
  //   return () => document.body.removeEventListener("scroll", bodyScroll, false);
  // }, [filters, workspace, filter, search]);

  const handleScroll = useMemo(() => {
    const throttled = throttle((e) => {
      if (e.target.scrollHeight - e.target.scrollTop < 1500) {
        setLoadPosts(true);
      }
    }, 300);
    return (e) => {
      e.persist();
      return throttled(e);
    };
  }, []);

  useEffect(() => {
    if (loadPosts) {
      handleLoadMore();
    }
  }, [loadPosts]);

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

  useEffect(() => {
    if (postListTag) {
      const activePost = find(postLists, (p) => parseInt(p.id) === parseInt(postListTag));
      postLists.map((pl) => {
        if (activePost && parseInt(postListTag) === pl.id) {
          setActivePostListName(pl);
        }
      });

      if (!activePost) {
        setActivePostListName(postLists[0]);
        let payload = {
          topic_id: workspace.id,
          tag: null,
          postListTag: postLists[0].id,
          filter: null,
        };
        dispatch(updateWorkspacePostFilterSort(payload));
      }
    }
  }, [postListTag, postLists]);

  const handleEditArchivePostList = useCallback(() => {
    const payload = {
      topic_id: workspace.id,
      tag: null,
      postListTag: null,
      filter: "all",
    };
    dispatch(updateWorkspacePostFilterSort(payload));
  }, [activePostListName]);

  const handleShowPosts = (type) => {
    setShowPosts({
      ...showPosts,
      [type]: !showPosts[type],
    });
  };

  useEffect(() => {
    if (filter && filter === "archive") {
      setShowPosts({
        ...showPosts,
        showRead: true,
      });
    }
    if (filter && unreadPosts.length === 0 && readPosts.length > 0) {
      setShowPosts({
        ...showPosts,
        showRead: true,
      });
    }
  }, [filter, params]);

  let disableOptions = false;
  if (workspace && workspace.active === 0) disableOptions = true;
  if (posts === null) return <></>;

  return (
    <Wrapper className={`container-fluid h-100 fadeIn ${className}`} onScroll={handleScroll}>
      <div className="row app-block">
        <PostSidebar
          disableOptions={disableOptions}
          isMember={isMember}
          workspace={workspace}
          filter={filter}
          filters={filters}
          tag={tag}
          postListTag={postListTag}
          postActions={actions}
          count={count}
          postLists={postLists}
          counters={counters}
          onGoBack={handleGoback}
          dictionary={dictionary}
        />
        <div className="col-md-9 app-content">
          <div className="app-content-overlay" />
          {!post && <PostFilterSearchPanel activeSort={sort} workspace={workspace} search={search} dictionary={dictionary} className={"mb-3"} />}
          {!!postListTag && (
            <PostsBtnWrapper>
              <span>Filter:</span>
              <PostListWrapper className="ml-2 recipients">
                <span className="receiver">
                  <span onClick={handleEditArchivePostList}>
                    <StyledIcon icon="x" className="mr-1" />
                  </span>
                  {activePostListName.name}
                </span>
              </PostListWrapper>
            </PostsBtnWrapper>
          )}
          {posts.length === 0 && search === "" ? (
            <div className="card card-body app-content-body mb-4">
              <EmptyState>
                <SvgEmptyState icon={3} height={252} />
                {isMember && (
                  <button className="btn btn-outline-primary btn-block" onClick={handleShowWorkspacePostModal} disabled={disableOptions}>
                    {dictionary.createNewPost}
                  </button>
                )}
              </EmptyState>
            </div>
          ) : (
            <>
              {post !== null ? (
                <div className="card card-body app-content-body mb-4">
                  <PostDetailWrapper className="fadeBottom">
                    <PostDetail
                      readByUsers={readByUsers}
                      post={post}
                      posts={posts}
                      filter={filter}
                      postActions={actions}
                      user={user}
                      history={history}
                      onGoBack={handleGoback}
                      dictionary={dictionary}
                      workspace={workspace}
                      isMember={isMember}
                      disableOptions={disableOptions}
                      isExternalUser={isExternalUser}
                    />
                  </PostDetailWrapper>
                </div>
              ) : (
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
                      <ul className="list-group list-group-flush ui-sortable fadeIn">
                        <div>
                          <UnreadPostsHeader
                            className={"list-group-item post-item-panel pl-3 unread-posts-header"}
                            onClick={() => {
                              handleShowPosts("showUnread");
                            }}
                            showPosts={showPosts.showUnread}
                          >
                            <span className="badge badge-light">
                              <SvgIconFeather icon={showPosts.showUnread ? "arrow-up" : "arrow-down"} width={16} height={16} className="mr-1" />
                              {dictionary.unread}
                            </span>
                          </UnreadPostsHeader>
                        </div>
                        {unreadPosts.length > 0 && (
                          <UnreadPostsContainer className={`unread-posts-container collapse ${showPosts.showUnread ? "show" : ""}`} id={"unread-posts-container"} showPosts={showPosts.showUnread}>
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
                        <div>
                          <ReadPostsHeader className={"list-group-item post-item-panel pl-3 other-posts-header"} onClick={() => handleShowPosts("showRead")} showPosts={showPosts.showRead}>
                            <span className="badge badge-light">
                              <SvgIconFeather icon={showPosts.showRead ? "arrow-up" : "arrow-down"} width={16} height={16} className="mr-1" />
                              {dictionary.allOthers}
                            </span>
                          </ReadPostsHeader>
                        </div>
                        {readPosts.length > 0 && (
                          <ReadPostsContainer className={`read-posts-container collapse ${showPosts.showRead ? "show" : ""}`} showPosts={showPosts.showRead}>
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
                    </div>
                  </div>
                </>
              )}
            </>
          )}
          <div className="mt-3 post-btm">&nbsp;</div>
        </div>
      </div>
    </Wrapper>
  );
};

export default WorkspacePostsPanel;
