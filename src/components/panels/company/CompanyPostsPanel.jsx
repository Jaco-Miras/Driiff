import React, { useEffect, useState, useMemo, useRef } from "react";
import { useHistory, useParams } from "react-router-dom";
import styled from "styled-components";
import { SvgIconFeather, Loader } from "../../common";
import { useCompanyPosts, useTranslationActions } from "../../hooks";
import { CompanyPostDetail, CompanyPostFilterSearchPanel, CompanyPostSidebar, CompanyPostsEmptyState, CompanyPosts } from "../post/company";
import { throttle, find } from "lodash";

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

const PostListWrapper = styled.span`
  max-width: 500px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  @media all and (max-width: 1200px) {
    max-width: 200px;
  }
`;

const PostDetailWrapper = styled.div`
  min-height: 240px;
  .card-body {
    padding: 1rem 1.5rem;
  }
`;

const PostsBtnWrapper = styled.div`
  //text-align: right;
  margin-bottom: 10px;
  .btn {
    margin-left: 10px;
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

//let fetching = false;
const CompanyPostsPanel = (props) => {
  const { className = "" } = props;

  const params = useParams();
  const history = useHistory();

  const { actions, fetchMore, posts, filter, tag, postListTag, sort, post, user, search, count, postLists, counters } = useCompanyPosts();
  const readByUsers = post ? Object.values(post.user_reads).sort((a, b) => a.name.localeCompare(b.name)) : [];
  const ofNumberOfUsers = post && post.required_users ? post.required_users : [];
  const [loading, setLoading] = useState(false);
  const [loadPosts, setLoadPosts] = useState(false);
  const [activePostListName, setActivePostListName] = useState({});
  const isExternalUser = user.type === "external";

  const componentIsMounted = useRef(true);

  const handleGoback = () => {
    if (params.hasOwnProperty("postId")) {
      history.push("/posts");
    }
  };

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
    actionMarkAsDone: _t("POST.ACTION_MARK_AS_DONE", "Mark as done"),
    actionMarkAsUndone: _t("POST.ACTION_MARK_AS_UNDONE", "Mark as not done"),
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
    selectAll: _t("BUTTON.SELECT_ALL", "Select all"),
    remove: _t("BUTTON.REMOVE", "Remove"),
    fileAutomaticallyRemoved: _t("FILE.FILE_AUTOMATICALLY_REMOVED_LABEL", "File automatically removed by owner request"),
    filesAutomaticallyRemoved: _t("FILE.FILES_AUTOMATICALLY_REMOVED_LABEL", "Files automatically removed by owner request"),
  };

  const handleLoadMore = () => {
    if (search === "" && !post) {
      setLoading(true);

      fetchMore((err, res) => {
        if (componentIsMounted.current) {
          setLoading(false);
          setLoadPosts(false);
        }
      });
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
    if (params.postId) {
      actions.fetchPostDetail({ post_id: parseInt(params.postId) });
    }
    actions.getUnreadNotificationEntries({ add_unread_comment: 1 });
    return () => {
      actions.getUnreadNotificationEntries({ add_unread_comment: 1 });
      componentIsMounted.current = null;
    };
  }, []);

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
          tag: null,
          postListTag: postLists[0].id,
          filter: null,
        };
        actions.setCompanyFilterPosts(payload);
      }
    }
  }, [postListTag, postLists]);

  const handleEditArchivePostList = () => {
    const payload = {
      tag: null,
      filter: "all",
    };
    actions.setCompanyFilterPosts(payload);
  };

  if (posts === null) return <></>;
  return (
    <Wrapper className={`container-fluid h-100 fadeIn ${className}`} onScroll={handleScroll}>
      <div className="row app-block">
        <CompanyPostSidebar filter={filter} tag={tag} postListTag={postListTag} postActions={actions} count={count} postLists={postLists} counters={counters} onGoBack={handleGoback} dictionary={dictionary} />
        <div className="col-md-9 app-content">
          <div className="app-content-overlay" />
          {!post && <CompanyPostFilterSearchPanel activeSort={sort} search={search} dictionary={dictionary} className={"mb-3"} />}
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
            <CompanyPostsEmptyState actions={actions} dictionary={dictionary} />
          ) : (
            <>
              {post && params.hasOwnProperty("postId") ? (
                <div className="card card-body app-content-body">
                  <PostDetailWrapper className="fadeBottom">
                    <CompanyPostDetail
                      readByUsers={readByUsers}
                      post={post}
                      posts={posts}
                      filter={filter}
                      postActions={actions}
                      user={user}
                      history={history}
                      onGoBack={handleGoback}
                      dictionary={dictionary}
                      isExternalUser={isExternalUser}
                    />
                  </PostDetailWrapper>
                </div>
              ) : !post && params.hasOwnProperty("postId") ? (
                <LoaderContainer className={"card initial-load"}>
                  <Loader />
                </LoaderContainer>
              ) : (
                <CompanyPosts actions={actions} dictionary={dictionary} filter={filter} isExternalUser={isExternalUser} loading={loading} posts={posts} search={search} />
              )}
            </>
          )}
          <div className="mt-3 post-btm">&nbsp;</div>
        </div>
      </div>
    </Wrapper>
  );
};

export default CompanyPostsPanel;
