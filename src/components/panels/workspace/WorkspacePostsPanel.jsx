import React, { useEffect, useState, useMemo, useRef } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { SvgIconFeather, Loader } from "../../common";
import { usePosts, useTranslationActions, useFetchWsCount, useToaster } from "../../hooks";
import { PostDetail, PostFilterSearchPanel, PostSidebar, Posts, PostsEmptyState } from "../post";
import { throttle, find } from "lodash";
import { addToWorkspacePosts } from "../../../redux/actions/postActions";
import { updateWorkspacePostFilterSort } from "../../../redux/actions/workspaceActions";
import { useDispatch } from "react-redux";
import { replaceChar } from "../../../helpers/stringFormatter";

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

const PostsBtnWrapper = styled.div`
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

const LoaderContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

const MaintenanceWrapper = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  flex-flow: column;
  > div {
    width: 100%;
  }
`;

const WorkspacePostsPanel = (props) => {
  const { className = "", workspace, isMember } = props;

  const params = useParams();
  const history = useHistory();
  const toaster = useToaster();

  const dispatch = useDispatch();

  useFetchWsCount();

  const { actions, posts, filter, tag, sort, post, user, search, count, postLists, counters, filters, postListTag } = usePosts();
  //const ofNumberOfUsers = post && post.required_users ? post.required_users : [];
  const [loading, setLoading] = useState(false);

  const [loadPosts, setLoadPosts] = useState(false);
  const [activePostListName, setActivePostListName] = useState({});

  const postAccess = useSelector((state) => state.admin.postAccess);
  //const usersLoaded = useSelector((state) => state.users.usersLoaded);

  const componentIsMounted = useRef(true);

  const isExternalUser = user.type === "external";

  const handleGoback = () => {
    if (params.hasOwnProperty("postId")) {
      let pathname = history.location.pathname.split("/post/")[0];
      history.push(pathname);
    }
  };

  useEffect(() => {
    if (params.hasOwnProperty("workspaceId")) {
      actions.getUnreadWsPostsCount({ topic_id: params.workspaceId });
    }
    return () => {
      componentIsMounted.current = null;
    };
  }, []);

  useEffect(() => {
    if (params.hasOwnProperty("workspaceId")) {
      actions.getRecentPosts(params.workspaceId);
    }
  }, [params.workspaceId]);

  const { _t } = useTranslationActions();

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
    // remindMeAboutThis: _t("TODO.REMIND_ME_ABOUT_THIS", "Remind me about this"),
    remindMeAboutThis: _t("TODO.REMIND_ABOUT_THIS", "Remind about this"),
    searchResult: _t("POST.SEARCH_RESULT", "Search Result:"),
    searchResults: _t("POST.SEARCH_RESULTS", "Search Results:"),
    searchNoResult: _t("POST.NO_SEARCH_RESULT", "No result found:"),
    private: _t("POST.PRIVATE", "Private"),
    by: _t("POST.BY", "by"),
    star: _t("POST.STAR", "Mark with star"),
    unStar: _t("POST.UNSTAR", "Unmark star"),
    alreadyReadThis: _t("POST.ALREADY_READ_THIS", "I've read this"),
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
    // ofNumberOfUsers: _t("POST.OF_NUMBER_OF_USERS", "of ::user_count:: user/s", {
    //   user_count: ofNumberOfUsers.length,
    // }),
    allOthers: _t("POST.ALL_OTHERS", "All others"),
    sharedClientBadge: _t("POST.BADGE_SHARED_CLIENT", "The client can see this post"),
    notSharedClientBadge: _t("POST.BADGE_NOT_SHARED_CLIENT", "This post is private to our team"),
    selectAll: _t("BUTTON.SELECT_ALL", "Select all"),
    remove: _t("BUTTON.REMOVE", "Remove"),
    fileAutomaticallyRemoved: _t("FILE.FILE_AUTOMATICALLY_REMOVED_LABEL", "File automatically removed by owner request"),
    filesAutomaticallyRemoved: _t("FILE.FILES_AUTOMATICALLY_REMOVED_LABEL", "Files automatically removed by owner request"),
    errorLoadingPost: _t("TOASTER.ERROR_LOADING_POST", "Error loading post"),
    teamLabel: _t("TEAM", "Team"),
    new: _t("POST.NEW", "New"),
    featureNotAvailable: _t("LABEL.FEATURE_NOT_AVAILABLE", "This feature is not available for your account."),
    contactAdministrator: _t("LABEL.CONTACT_ADMIN", "Contact your system administrator."),
  };

  useEffect(() => {
    if (params.postId && !post) {
      actions.fetchPostDetail({ post_id: parseInt(params.postId) }, (err, res) => {
        if (componentIsMounted.current) {
          if (err) {
            // set to all
            let payload = {
              topic_id: workspace.id,
              filter: "inbox",
              tag: null,
            };
            dispatch(updateWorkspacePostFilterSort(payload));
            if (params.folderId) {
              history.push(`/workspace/posts/${params.folderId}/${replaceChar(params.folderName)}/${params.workspaceId}/${replaceChar(params.workspaceName)}`);
            } else {
              history.push(`/workspace/posts/${params.workspaceId}/${replaceChar(params.workspaceName)}`);
            }
            toaster.error(dictionary.errorLoadingPost);
          }
        }
      });
    }
  }, [params.postId, post]);

  useEffect(() => {
    if (filter === "star") {
      let filterCb = (err, res) => {
        if (err) return;
        let files = res.data.posts.map((p) => p.files);
        if (files.length) {
          files = files.flat();
        }
        dispatch(
          addToWorkspacePosts({
            topic_id: parseInt(params.workspaceId),
            posts: res.data.posts,
            filter: res.data.posts,
            files,
            filters: {
              favourites: {
                active: true,
                skip: res.data.next_skip,
                hasMore: res.data.total_take === 25,
              },
            },
          })
        );
      };

      actions.getPosts(
        {
          filters: ["post", "favourites"],
          topic_id: parseInt(params.workspaceId),
        },
        filterCb
      );
    } else if (filter === "my_posts") {
      let filterCb = (err, res) => {
        if (err) return;
        let files = res.data.posts.map((p) => p.files);
        if (files.length) {
          files = files.flat();
        }
        dispatch(
          addToWorkspacePosts({
            topic_id: parseInt(params.workspaceId),
            posts: res.data.posts,
            filter: res.data.posts,
            files,
            filters: {
              myPosts: {
                active: true,
                skip: res.data.next_skip,
                hasMore: res.data.total_take === 25,
              },
            },
          })
        );
      };

      actions.getPosts(
        {
          filters: ["post", "created_by_me"],
          topic_id: parseInt(params.workspaceId),
        },
        filterCb
      );
    }
  }, [filter]);

  const loadMoreUnreadPosts = () => {
    if (filters && filters.unreadPosts && filters.unreadPosts.hasMore) {
      let payload = {
        filters: ["green_dot"],
        topic_id: workspace.id,
        skip: filters.unreadPosts.skip,
      };
      let cb = (err, res) => {
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
              unreadPosts: {
                skip: res.data.next_skip,
                hasMore: res.data.total_take === 25,
              },
            },
          })
        );
      };
      actions.getPosts(payload, cb);
    }
  };

  const handleLoadMore = () => {
    if (search === "" && !post) {
      setLoading(true);
      loadMoreUnreadPosts();
      let payload = {
        filters: filter === "archive" ? ["post", "archived"] : filter === "star" ? ["post", "favourites"] : filter === "my_posts" ? ["post", "created_by_me"] : [],
        topic_id: workspace.id,
        skip: filter === "archive" ? filters?.archived.skip : filter === "star" ? filters?.favourites.skip : filter === "my_posts" ? filters?.myPosts.skip : filters.all.skip,
      };

      if (filter === "all") {
        if (filters.all && !filters.all.hasMore) return;
      } else if (filter === "archive") {
        if (filters.archived && !filters.archived.hasMore) return;
      } else if (filter === "star") {
        if (filters.favourites && !filters.favourites.hasMore) return;
      } else if (filter === "my_posts") {
        if (filters.myPosts && !filters.myPosts.hasMore) return;
      }

      let cb = (err, res) => {
        if (componentIsMounted.current) {
          setLoading(false);
          setLoadPosts(false);
        }
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
              ...(filter === "star" && {
                favourites: {
                  active: true,
                  skip: res.data.next_skip,
                  hasMore: res.data.total_take === 25,
                },
              }),
              ...(filter === "myPosts" && {
                myPosts: {
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

  const handleEditArchivePostList = () => {
    const payload = {
      topic_id: workspace.id,
      tag: null,
      postListTag: null,
      filter: "all",
    };
    dispatch(updateWorkspacePostFilterSort(payload));
  };

  let disableOptions = false;
  if (workspace && workspace.active === 0) disableOptions = true;
  if (posts === null) return <></>;

  return (
    <Wrapper className={`container-fluid h-100 fadeIn ${className}`} onScroll={handleScroll}>
      {postAccess.post === true && postAccess.loaded && (postAccess.post_user_ids.some((pid) => pid === user.id) || postAccess.post_user_ids.some((pid) => pid === 0)) ? (
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
            {posts.length === 0 && search === "" && !params.hasOwnProperty("postId") ? (
              <PostsEmptyState actions={actions} dictionary={dictionary} disableOptions={disableOptions} isMember={isMember} />
            ) : (
              <>
                {post !== null ? (
                  <div className="card card-body app-content-body mb-4">
                    <PostDetailWrapper className="fadeBottom">
                      <PostDetail
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
                ) : !post && params.hasOwnProperty("postId") ? (
                  <LoaderContainer className={"card initial-load"}>
                    <Loader />
                  </LoaderContainer>
                ) : (
                  <Posts actions={actions} dictionary={dictionary} filter={filter} isExternalUser={isExternalUser} loading={loading} posts={posts} search={search} workspace={workspace} />
                )}
              </>
            )}
            <div className="mt-3 post-btm">&nbsp;</div>
          </div>
        </div>
      ) : postAccess.loaded ? (
        <MaintenanceWrapper>
          <div>
            <h4 className="title">{dictionary.featureNotAvailable}</h4>
          </div>
          <div>
            <h5>{dictionary.contactAdministrator}</h5>
          </div>
        </MaintenanceWrapper>
      ) : null}
    </Wrapper>
  );
};

export default WorkspacePostsPanel;
