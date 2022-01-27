import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { SvgIconFeather } from "../../common";
import { useTranslationActions } from "../../hooks";
import WIPItem from "./WIPItem";

const Wrapper = styled.div`
  background: none;
  box-shadow: none;
  overflow: visible !important;
  height: auto !important;
  flex: unset !important;
  min-height: auto !important;
  .app-lists {
    overflow: visible !important;
  }
`;

const PostsBtnWrapper = styled.div`
  margin-bottom: 10px;
  .btn {
    margin-left: 10px;
  }
`;

const PendingWIPContainer = styled.div`
  li {
    border-radius: 0 !important;
  }
`;

const WIPContainer = styled.div`
  li {
    border-radius: 0 !important;
    background-color: #fafafa !important;
    .dark & {
      background-color: hsla(0, 0%, 100%, 0.0784313725490196) !important;
    }
  }
`;

const PendingWIPHeader = styled.li`
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

const WIPList = (props) => {
  const { actions, filter = "all", loading, wips } = props;

  const componentIsMounted = useRef(true);

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
  };

  let emptyStatesHeader = [_t("POSTS.NO_ITEMS_FOUND_HEADER_1", "WOO!"), _t("POSTS.NO_ITEMS_FOUND_HEADER_2", "Queue’s empty, time to dance!")];

  let emptyStatesText = [_t("POSTS.NO_ITEMS_FOUND_TEXT_1", "Nothing here but me… 👻"), _t("POSTS.NO_ITEMS_FOUND_TEXT_2", "Job well done!💃🕺")];

  const [inDexer, setInDexer] = useState(Math.floor(Math.random() * emptyStatesHeader.length));

  const workspace = null;
  const archivedWIPs = [];
  const pendingWIPs = Object.values(wips);
  const search = "";
  const [showWIPs, setShowWIPs] = useState({ showPending: true, showArchived: true });
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
  //   setShowWIPs({
  //     ...showPosts,
  //     [type]: !showPosts[type],
  //   });
  // };

  const handleshowPending = () => {
    setShowWIPs((prevState) => {
      return {
        ...prevState,
        showArchived: !showWIPs.showArchived,
        showPending: !showWIPs.showPending,
      };
    });
  };

  const handleShowArchived = () => {
    setShowWIPs((prevState) => {
      return {
        ...prevState,
        showArchived: !showWIPs.showArchived,
        showPending: !showWIPs.showPending,
      };
    });
  };

  //   const handleSelectAllDraft = () => {
  //     setCheckedPosts(posts.map((p) => p.id));
  //   };

  //   const handleRemoveDraft = () => {
  //     if (checkedPosts.length) {
  //       checkedPosts.forEach((id) => {
  //         let post = posts.find((p) => p.id === id);
  //         if (post) actions.archivePost(post);
  //       });
  //     }
  //   };

  useEffect(() => {
    return () => {
      componentIsMounted.current = null;
    };
  }, []);

  useEffect(() => {
    if (componentIsMounted.current) setCheckedPosts([]);
  }, [filter]);

  useEffect(() => {
    setInDexer(Math.floor(Math.random() * emptyStatesHeader.length));
  }, [showWIPs]);

  return (
    <>
      {(filter === "all" || filter === "inbox") && checkedPosts.length > 0 && (
        <PostsBtnWrapper>
          <button className="btn all-action-button" onClick={handleArchiveAll}>
            archive
          </button>
          <button className="btn all-action-button" onClick={handleMarkAllAsRead}>
            read
          </button>
        </PostsBtnWrapper>
      )}
      <div className="card card-body app-content-body mb-4 unset-flex">
        <div className="app-lists" tabIndex="1" data-loaded="0" data-loading={loading}>
          {search !== "" && (
            <>
              {wips.length === 0 ? (
                <h6 className="search-title card-title font-size-11 text-uppercase mb-4">
                  {dictionary.searchNoResult} {search}
                </h6>
              ) : wips.length === 1 ? (
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
                {Object.values(wips).map((p) => {
                  return <WIPItem key={p.id} item={p} toggleCheckbox={handleToggleCheckbox} checked={checkedPosts.some((id) => id === p.id)} dictionary={dictionary} />;
                })}
              </div>
            </ul>
          )}
          {filter === "all" && search === "" && (
            <ul className="list-group list-group-flush ui-sortable fadeIn">
              <div>
                <PendingWIPHeader className={"list-group-item post-item-panel pl-3 unread-posts-header"} onClick={handleshowPending} showPosts={showWIPs.showPending}>
                  <span className="badge badge-light">
                    <SvgIconFeather icon={showWIPs.showPending ? "arrow-up" : "arrow-down"} width={16} height={16} className="mr-1" />
                    Pending
                  </span>
                </PendingWIPHeader>
              </div>
              {pendingWIPs.length > 0 && (
                <PendingWIPContainer className={`unread-posts-container collapse ${showWIPs.showPending ? "show" : ""}`} id={"unread-posts-container"} showPosts={showWIPs.showPending}>
                  {pendingWIPs.length > 0 && (
                    <WIPContainer className={`read-posts-container collapse ${showWIPs.showArchived ? "show" : ""}`} showPosts={showWIPs.showArchived}>
                      {pendingWIPs.map((p, k) => {
                        return <WIPItem key={p.id} item={p} toggleCheckbox={handleToggleCheckbox} checked={checkedPosts.some((id) => id === p.id)} dictionary={dictionary} />;
                      })}
                    </WIPContainer>
                  )}
                </PendingWIPContainer>
              )}
              {showWIPs.showPending && pendingWIPs.length === 0 && (
                <EmptyState>
                  <h3>{emptyStatesHeader[inDexer]}</h3>
                  <h5>{emptyStatesText[inDexer]} </h5>
                </EmptyState>
              )}
              <div>
                <ReadPostsHeader className={"list-group-item post-item-panel pl-3 other-posts-header"} onClick={handleShowArchived} showPosts={showWIPs.showArchived}>
                  <span className="badge badge-light">
                    <SvgIconFeather icon={showWIPs.showArchived ? "arrow-up" : "arrow-down"} width={16} height={16} className="mr-1" />
                    Archived
                  </span>
                </ReadPostsHeader>
              </div>
              {archivedWIPs.length > 0 && (
                <WIPContainer className={`read-posts-container collapse ${showWIPs.showArchived ? "show" : ""}`} showPosts={showWIPs.showArchived}>
                  {archivedWIPs.map((p, k) => {
                    return <WIPItem key={p.id} item={p} toggleCheckbox={handleToggleCheckbox} checked={checkedPosts.some((id) => id === p.id)} dictionary={dictionary} />;
                  })}
                </WIPContainer>
              )}
            </ul>
          )}
        </div>
      </div>
      <div className="mt-3 post-btm">&nbsp;</div>
    </>
  );
};

export default WIPList;
