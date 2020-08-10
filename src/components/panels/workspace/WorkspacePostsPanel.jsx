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

const WorkspacePostsPanel = (props) => {
  const { className = "", workspace, isMember } = props;

  const params = useParams();
  const history = useHistory();
  
  // const workspace = useSelector((state) => state.workspaces.activeTopic);

  // const isMember = useIsMember(workspace && workspace.member_ids.length ? workspace.member_ids : []);

  const { actions, posts, filter, tag, sort, post, user, search, count, counters } = usePosts();

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

  const {_t} = useTranslation();

  const dictionary = {
    createNewPost: _t("POST.CREATE_NEW_POST", "Create new post"),
    all: _t("POST.ALL", "All"),
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
    searchPost: _t("POST.SEARCH_POST", "Search post"),
    markAsRead: _t("POST.MARK_AS_READ", "Mark as read"),
    markAsUnread: _t("POST.MARK_AS_UNREAD", "Mark as unread"),
    share: _t("POST.SHARE", "Share"),
    snooze: _t("POST.SNOOZE", "Snooze"),
    follow: _t("POST.FOLLOW", "Follow"),
    unFollow: _t("POST.UNFOLLOW", "Unfollow"),
    files: _t("POST.FILES", "Files"),
    comment: _t("POST.COMMENT", "Comment"),
    editReply: _t("POST.EDIT_REPLY", "Edit reply"),
    removeReply: _t("POST.REMOVE_REPLY", "Remove reply"),
    quote: _t("POST.QUOTE", "Quote"),
    mentionUser: _t("POST.MENTION_USER", "Mention user")
  };

  if (posts === null) return <></>;

  return (
    <Wrapper className={`container-fluid h-100 fadeIn ${className}`}>
      <div className="row app-block">
        <PostSidebar isMember={isMember} workspace={workspace} filter={filter} tag={tag} postActions={actions} count={count} counters={counters} onGoBack={handleGoback} dictionary={dictionary}/>
        <div className="col-md-9 app-content">
          <div className="app-content-overlay" />
          <PostFilterSearchPanel activeSort={sort} workspace={workspace} search={search} dictionary={dictionary}/>
          {/* <div className="card card-body app-content-body mb-4"> */}
          {posts.length === 0 && search === null ? (
            <div className="card card-body app-content-body mb-4">
              <EmptyState>
                <SvgEmptyState icon={3} height={252} />
                {isMember && (
                  <button className="btn btn-outline-primary btn-block" onClick={handleShowWorkspacePostModal}>
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
                    <PostDetail post={post} postActions={actions} user={user} history={history} onGoBack={handleGoback} workspace={workspace} isMember={isMember} dictionary={dictionary}/>
                  </PostDetailWrapper>
                </div>
              ) : (
                <div className="card card-body app-content-body mb-4">
                  <div className="app-lists" tabIndex="1">
                    {search !== null && (
                      <>
                        {posts.length === 0 ? (
                          <h6 className="search-title card-title font-size-11 text-uppercase mb-4">No result found: {search}</h6>
                        ) : posts.length === 1 ? (
                          <h6 className="search-title card-title font-size-11 text-uppercase mb-4">Search Result: {search}</h6>
                        ) : (
                          <h6 className="search-title card-title font-size-11 text-uppercase mb-4">Search Results: {search}</h6>
                        )}
                      </>
                    )}
                    <ul className="list-group list-group-flush ui-sortable fadeIn">
                      {posts &&
                        posts.map((p) => {
                          return <PostItemPanel key={p.id} post={p} postActions={actions} dictionary={dictionary}/>;
                        })}
                    </ul>
                  </div>
                </div>
              )}
            </>
          )}
          {/* </div> */}
        </div>
      </div>
    </Wrapper>
  );
};

export default React.memo(WorkspacePostsPanel);
