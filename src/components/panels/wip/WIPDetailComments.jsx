import React from "react";
import styled from "styled-components";
import WIPComment from "./WIPComment";
import { useTranslationActions } from "../../hooks";

const Wrapper = styled.div`
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    margin-left: auto;
  }
  > ul {
    width: 100%;
  }
`;

const WIPDetailComments = (props) => {
  const { className = "", item, comments, onShowFileDialog, dropAction, isMember, disableOptions } = props;

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

  return (
    <Wrapper className={`post-comments card-body ${className}`}>
      {comments && (
        <ul>
          {Object.values(comments).map((c) => {
            return <WIPComment key={c.id} comment={c} wip={item} dictionary={dictionary} parentId={null} onShowFileDialog={onShowFileDialog} />;
          })}
        </ul>
      )}
    </Wrapper>
  );
};

export default React.memo(WIPDetailComments);
