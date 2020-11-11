import React, { useCallback, useEffect } from "react";
//import { useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import styled from "styled-components";
import { SvgEmptyState } from "../../common";
import { usePosts, useTranslation } from "../../hooks";
import { PostDetail, PostFilterSearchPanel, PostItemPanel, PostSidebar } from "../post";

const Wrapper = styled.div`
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
  text-align: right;
  margin-bottom: 10px;
  .btn {
    margin-left: 10px;
  }
`;

const WorkspacePostsPanel = (props) => {
  const { className = "", workspace, isMember } = props;

  const params = useParams();
  const history = useHistory();

  // const workspace = useSelector((state) => state.workspaces.activeTopic);

  // const isMember = useIsMember(workspace && workspace.member_ids.length ? workspace.member_ids : []);

  const { actions, posts, filter, tag, sort, post, user, search, count, counters } = usePosts();
  const readByUsers = post ? Object.values(post.user_reads).sort((a, b) => a.name.localeCompare(b.name)) : [];

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
      actions.getRecentPosts(params.workspaceId);
    }
  }, [params.workspaceId]);

  const { _t } = useTranslation();

  const dictionary = {
    createNewPost: _t("POST.CREATE_NEW_POST", "Create new post"),
    all: _t("POST.ALL", "All"),
    inbox: _t("POST.INBOX", "Inbox"),
    myPosts: _t("POST.MY_POSTS", "My posts"),
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
    readByNumberofUsers: (readByUsers === 1) ?
      _t("POST.READY_BY_NUMBER_OF_USERS", "Read by ::user_name::", {
        user_name: readByUsers[0].first_name,
      }) : _t("POST.READY_BY_NUMBER_OF_USERS", "Read by ::user_count:: users", {
        user_count: readByUsers.length,
      }),
    me: _t("POST.LOGGED_USER_RESPONSIBLE", "me"),
    quotedCommentFrom: _t("POST.QUOTED_COMMENT_FROM", "Quoted comment from"),
    showMore: _t("SHOW_MORE", "Show more"),
    showLess: _t("SHOW_LESS", "Show less"),
    markAll: _t("POST.MARK_ALL_AS_READ", "Mark all as read"),
    archiveAll: _t("POST.ARCHIVE_ALL", "Archive all")
  };

  const handleMarkAllAsRead = () => {
    actions.readAll({topic_id: workspace.id});
  };

  const handleArchiveAll = () => {
    actions.archiveAll({topic_id: workspace.id});
  };

  let disableOptions = false;
  if (workspace && workspace.active === 0) disableOptions = true;
  if (posts === null) return <></>;

  return (
    <Wrapper className={`container-fluid h-100 fadeIn ${className}`}>
      <div className="row app-block">
        <PostSidebar disableOptions={disableOptions} isMember={isMember} workspace={workspace} filter={filter} tag={tag}
                     postActions={actions} count={count} counters={counters} onGoBack={handleGoback}
                     dictionary={dictionary}/>
        <div className="col-md-9 app-content">
          <div className="app-content-overlay"/>
          {!post &&
          <PostFilterSearchPanel activeSort={sort} workspace={workspace} search={search} dictionary={dictionary} className={"mb-3"}/>}
          {posts.length === 0 && search === null ? (
            <div className="card card-body app-content-body mb-4">
              <EmptyState>
                <SvgEmptyState icon={3} height={252}/>
                {isMember && (
                  <button className="btn btn-outline-primary btn-block" onClick={handleShowWorkspacePostModal}
                          disabled={disableOptions}>
                    {dictionary.createNewPost}
                  </button>
                )}
              </EmptyState>
            </div>
          ) : (
            <>
              {post ? (
                <div className="card card-body app-content-body mb-4">
                  <PostDetailWrapper className="fadeBottom">
                    <PostDetail
                      readByUsers={readByUsers}
                      post={post} postActions={actions} user={user} history={history} onGoBack={handleGoback}
                      workspace={workspace} isMember={isMember} dictionary={dictionary}
                      disableOptions={disableOptions}/>
                  </PostDetailWrapper>
                </div>
              ) : (
                <>
                {
                  filter === "all" &&
                  <PostsBtnWrapper>
                    <button className="btn all-action-button" onClick={handleArchiveAll}>{dictionary.archiveAll}</button>
                    <button className="btn all-action-button" onClick={handleMarkAllAsRead}>{dictionary.markAll}</button>
                  </PostsBtnWrapper>
                }
                <div className="card card-body app-content-body mb-4">
                  <div className="app-lists" tabIndex="1">
                    {search !== null && (
                      <>
                        {posts.length === 0 ? (
                          <h6
                            className="search-title card-title font-size-11 text-uppercase mb-4">{dictionary.searchNoResult} {search}</h6>
                        ) : posts.length === 1 ? (
                          <h6
                            className="search-title card-title font-size-11 text-uppercase mb-4">{dictionary.searchResult} {search}</h6>
                        ) : (
                          <h6
                            className="search-title card-title font-size-11 text-uppercase mb-4">{dictionary.searchResults} {search}</h6>
                        )}
                      </>
                    )}
                    <ul className="list-group list-group-flush ui-sortable fadeIn">
                      {posts &&
                      posts.map((p) => {
                        return <PostItemPanel
                          key={p.id} post={p} postActions={actions} dictionary={dictionary}
                          disableOptions={disableOptions}/>;
                      })}
                    </ul>
                  </div>
                </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </Wrapper>
  );
};

export default WorkspacePostsPanel;
