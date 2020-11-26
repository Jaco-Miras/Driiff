import React, { useCallback, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import styled from "styled-components";
import { SvgEmptyState } from "../../common";
import { useCompanyPosts, useTranslation } from "../../hooks";
import {
  CompanyPostDetail,
  CompanyPostFilterSearchPanel,
  CompanyPostItemPanel,
  CompanyPostSidebar
} from "../post/company";
import { throttle } from "lodash";

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
let fetching = false;
const CompanyPostsPanel = (props) => {
  const { className = "" } = props;

  const params = useParams();
  const history = useHistory();
  // const refs = {
  //   posts: useRef(null),
  //   btnLoadMore: useRef(null)
  // };

  const { actions, archived, fetchMore, posts, filter, tag, sort, post, user, search, count, counters, skip } = useCompanyPosts();
  const readByUsers = post ? Object.values(post.user_reads).sort((a, b) => a.name.localeCompare(b.name)) : [];
  const [loading, setLoading] = useState(false);

  const handleShowPostModal = () => {
    actions.showModal("create_company");
  };

  const handleGoback = useCallback(() => {
    if (params.hasOwnProperty("postId")) {
      history.push("/posts");
    }
  }, [params, history]);

  const { _t } = useTranslation();

  const dictionary = {
    createNewPost: _t("POST.CREATE_NEW_POST", "Create new post"),
    all: _t("POST.ALL", "All"),
    inbox: _t("POST.INBOX", "Inbox"),
    newReply: _t("POST.NEW_REPLY", "New reply"),
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
    actionMarkAsDone: _t("POST.ACTION_MARK_AS_DONE", "Mark as done"),
    actionMarkAsUndone: _t("POST.ACTION_MARK_AS_UNDONE", "Mark as not done"),
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
    archiveAll: _t("POST.ARCHIVE_ALL", "Archive all"),
    noComment: _t("POST.NO_COMMENT", "no comment"),
    oneComment: _t("POST.ONE_COMMENT", "1 comment"),
    comments: _t("POST.NUMBER_COMMENTS", "::comment_count:: comments"),
    messageInSecureWs: _t("POST.MESSAGE_IN_SECURE_WORKSPACE", "message in a secure workspace"),
  };

  

  const handleLoadMore = () => {
    if (!fetching && search === "") {
      setLoading(true);
      fetching = true;

      fetchMore((err, res) => {
        setLoading(false);
        fetching = false;
        //callback(err, res);
      });
    }
  }

  const bodyScroll = throttle((e) => {
    // console.log(e.srcElement.scrollHeight,e.srcElement.scrollTop)
    const offset = 500;
    if ((e.srcElement.scrollHeight - e.srcElement.scrollTop) < (1000 + offset)) {
      handleLoadMore()
    }
  }, 200);

  useEffect(() => {
    document.body.addEventListener("scroll", bodyScroll, false);
    return () => document.body.removeEventListener("scroll", bodyScroll, false);
  }, [skip, archived, filter, search])

  useEffect(() => {
    actions.getUnreadPostCommentsCount();
  }, []);

  // useEffect(() => {
  //   let el = refs.posts.current;
  //   if (el && el.dataset.loaded === "0") {
  //     initLoading();

  //     el.dataset.loaded = "1";
  //     refs.posts.current.addEventListener("scroll", handleScroll, false);
  //   }
  // }, [refs.posts.current]);

  const handleMarkAllAsRead = () => {
    actions.readAll();
  };

  const handleArchiveAll = () => {
    actions.archiveAll();
  };

  if (posts === null)
    return <></>;

  return (
    <Wrapper className={`container-fluid h-100 fadeIn ${className}`}>
      {/* <span className="d-none" ref={refs.btnLoadMore} onClick={loadMore}>Load more</span> */}
      <div className="row app-block">
        <CompanyPostSidebar filter={filter} tag={tag}
                            postActions={actions} count={count} counters={counters} onGoBack={handleGoback}
                            dictionary={dictionary}/>
        <div className="col-md-9 app-content">
          <div className="app-content-overlay"/>
          {
            !post &&
            <CompanyPostFilterSearchPanel
              activeSort={sort} search={search}
              dictionary={dictionary} className={"mb-3"}/>
          }
          {posts.length === 0 && search === "" ? (
            <div className="card card-body app-content-body mb-4">
              <EmptyState>
                <SvgEmptyState icon={3} height={252}/>
                <button className="btn btn-outline-primary btn-block" onClick={handleShowPostModal}>
                  {dictionary.createNewPost}
                </button>
              </EmptyState>
            </div>
          ) : (
            <>
              {post ? (
                <div className="card card-body app-content-body mb-4">
                  <PostDetailWrapper className="fadeBottom">
                    <CompanyPostDetail
                      readByUsers={readByUsers}
                      post={post} postActions={actions} user={user} history={history} onGoBack={handleGoback}
                      dictionary={dictionary}
                    />
                  </PostDetailWrapper>
                </div>
              ) : (
                <>
                  {
                    filter === "all" &&
                    <PostsBtnWrapper>
                      <button className="btn all-action-button"
                              onClick={handleArchiveAll}>{dictionary.archiveAll}</button>
                      <button className="btn all-action-button"
                              onClick={handleMarkAllAsRead}>{dictionary.markAll}</button>
                    </PostsBtnWrapper>
                  }
                  <div className="card card-body app-content-body mb-4">
                    <div className="app-lists" tabIndex="1" data-loaded="0" data-loading={loading}>
                      {search !== "" && (
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
                        {posts && posts.map((p) => {
                          return <CompanyPostItemPanel
                            key={p.id} post={p} postActions={actions} dictionary={dictionary}/>;
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

export default CompanyPostsPanel;
