import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { copyTextToClipboard } from "../../helpers/commonFunctions";
import { getBaseUrl } from "../../helpers/slugHelper";
import { replaceChar } from "../../helpers/stringFormatter";
import { addToModals, deleteDraft, getUnreadNotificationCounterEntries } from "../../redux/actions/globalActions";
import {
  addCommentReact,
  addPostReact,
  addUserToPostRecipients,
  archiveAllPosts,
  archiveReducer,
  commentApprove,
  deletePost,
  fetchDetail,
  fetchPosts,
  fetchRecentPosts,
  fetchTagCounter,
  getArchivedCompanyPosts,
  getInProgressCompanyPosts,
  getMyCompanyPosts,
  getStarCompanyPosts,
  getReadCompanyPosts,
  getCompanyPosts,
  getUnreadCompanyPosts,
  getPostClapHover,
  getUnreadPostComments,
  getUnreadPostEntries,
  incomingPostMarkDone,
  incomingReadUnreadReducer,
  markAllPostAsRead,
  postApprove,
  postArchive,
  postClap,
  postCompanyPosts,
  postCreate,
  postFavorite,
  postFollow,
  postMarkDone,
  //postMarkRead,
  postToggleRead,
  postUnfollow,
  postVisit,
  putCompanyPosts,
  putPost,
  removeDraftPost,
  removePost,
  removePostReact,
  setPostToggleFollow,
  starPostReducer,
  updateCompanyPostFilterSort,
  updatePostFiles,
  postComment,
  postClose,
  postSnooze,
  getPostList,
  createPostList,
  updatePostList,
  deletePostList,
  postListConnect,
  postListDisconnected,
  incomingPostListConnect,
  incomingPostListDisconnect,
  postRequired,
  setPostCommentType,
  readNotification,
  refetchUnreadCompanyPosts,
  getPostReadAndClap,
  setShowUnread,
  getSharedCompanyPosts,
  getSharedMyCompanyPosts,
  getSharedReadCompanyPosts,
  getSharedArchivedCompanyPosts,
  getSharedStarCompanyPosts,
  getSharedUnreadCompanyPosts,
} from "../../redux/actions/postActions";
import { getUnreadWorkspacePostEntries, updateWorkspacePostCount, getFavoriteWorkspaceCounters, updateWorkspacePostFilterSort } from "../../redux/actions/workspaceActions";
import { useToaster, useTodoActions } from "./index";
import { useTranslationActions, useGetSlug } from "../hooks";

const usePostActions = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const history = useHistory();
  const params = useParams();
  const toaster = useToaster();
  const todoActions = useTodoActions();
  const { _t } = useTranslationActions();

  const user = useSelector((state) => state.session.user);
  const sharedWs = useSelector((state) => state.workspaces.sharedWorkspaces);
  const workspace = useSelector((state) => state.workspaces.activeTopic);
  const { slug } = useGetSlug();
  let sharedPayload = null;
  if (params.workspaceId && history.location.pathname.startsWith("/shared-hub") && workspace) {
    sharedPayload = { slug: workspace.slug, token: sharedWs[workspace.slug].access_token, is_shared: true };
  }

  const dictionary = {
    headerRemoveDraftHeader: _t("MODAL.REMOVE_DRAFT_HEADER", "Remove post draft?"),
    headerRemovePostHeader: _t("MODAL.REMOVE_POST_HEADER", "Remove post?"),
    headerUnarchivePostHeader: _t("MODAL.UNARCHIVE_POST_HEADER", "Un-archive post?"),
    headerArchivePostHeader: _t("MODAL.ARCHIVE_POST_HEADER", "Archive post?"),
    buttonRemove: _t("BUTTON.REMOVE", "Remove"),
    buttonRemovePost: _t("MODAL.REMOVE_POST", "Remove draft"),
    buttonCancel: _t("BUTTON.CANCEL", "Cancel"),
    removeThisDraft: _t("MODAL.REMOVE_THIS_DRAFT", "Are you sure you want to remove this post draft?"),
    removeThisPost: _t("MODAL.REMOVE_THIS_POST", "Are you sure you want to remove this post?"),
    buttonArchive: _t("BUTTON.ARCHIVE", "Archive"),
    buttonUnarchive: _t("BUTTON.UNARCHIVE", "Un-archive"),
    unarchiveThisPost: _t("MODAL.UNARCHIVE_THIS_POST", "Are you sure you want to un-archive this post?"),
    archiveThisPost: _t("MODAL.ARCHIVE_THIS_POST", "Are you sure you want to archive this post?"),
    notificationStopFollow: _t("NOTIFICATION.STOP_FOLLOW", "You’ve stopped to follow"),
    notificationStartFollow: _t("NOTIFICATION.START_FOLLOW", "You’ve started to follow"),
    notificationError: _t("NOTIFICATION.ERROR", "An error has occurred try again!"),
    notificationYouMarked: _t("NOTIFICATION.YOU_MARKED", "You marked"),
    notificationYouUpdated: _t("NOTIFICATION.YOU_UPDATED", "You have updated"),
    notificationUnread: _t("NOTIFICATION.UNREAD", "as unread"),
    notificationRead: _t("NOTIFICATION.READ", "as read"),
    notificationDone: _t("NOTIFICATION.DONE", "as done"),
    notificationNotDone: _t("NOTIFICATION.NOT_DONE", "as not done"),
    notificationStar: _t("NOTIFICATION.STAR", "as starred"),
    notificationNotStar: _t("NOTIFICATION.NOT_STAR", "as not starred"),
    notificationRemoved: _t("NOTIFICATION.REMOVED", "is removed"),
    notificationActionFailed: _t("NOTIFICATION.ACTION_FAILED", "Action failed"),
    notificationCreatePost: _t("NOTIFICATION.CREATE_POST", "You have successfully created a post"),
    notificationReminderPost: _t("NOTIFICATION.REMINDER_POST", "You will be reminded about this post under"),
    itemPost: _t("ITEM.POST", "post"),
    todoLinks: _t("SIDEBAR.TODO_LINKS", "Reminders"),
    accept: _t("POST.ACCEPT", "Accept"),
    acceptThisPost: _t("POST.ACCEPT_THIS_POST", "Accept this post?"),
    acceptThisPostText: _t("POST.ACCEPT_THIS_POST_TEXT", "Are you sure you want to accept? Please refer to the General condition for more details"),
    acceptCondition: _t(
      "POST.ACCEPT_GENERAL_CONDITION",
      "You accept the final design provided to you. Zuid will now proceed on the next steps. Any additional changes on the design will be subject for re-estimation and additional work which will be considered as a separate project."
    ),
    snoozeThisPost: _t("MODAL.SNOOZE_THIS_POST", "Are you sure you want to snooze this post?"),
    buttonSnooze: _t("BUTTON.SNOOZE", "Snooze"),
    headerSnoozePost: _t("MODAL.SNOOZE_POST", "Snooze post"),
    postArchivedMuted: _t("TOASTER.POST_ARCHIVED_MUTED", "is archived. Comments for this post will be muted for 48 hours."),
    reminderAlreadyExists: _t("TOASTER.REMINDER_EXISTS", "Reminder already exists"),
    toasterGeneraError: _t("TOASTER.GENERAL_ERROR", "An error has occurred try again!"),
    toasterCreateTodo: _t("TOASTER.TODO_CREATE_SUCCESS", "You will be reminded about this comment under <b>Reminders</b>."),
    toasterDeletedPost: _t("TOASTER.DELETED_POST", "Succesfully deleted the post"),
  };

  const fetchPostList = (payload = {}, callback) => {
    dispatch(getPostList(payload, callback));
  };

  const createNewPostList = (payload = {}, callback) => {
    dispatch(createPostList(payload, callback));
  };

  const updatePostsList = (payload = {}, callback) => {
    dispatch(updatePostList(payload, callback));
  };

  const deletePostsList = (payload = {}, callback) => {
    dispatch(deletePostList(payload, callback));
  };

  const connectPostList = (payload, callback) => {
    dispatch(postListConnect(payload, callback));
  };

  const disconnectPostList = (payload, callback) => {
    dispatch(postListDisconnected(payload, callback));
  };

  const updatePostListConnect = (payload, callback) => {
    if (payload.SOCKET_TYPE === "POST_LIST_CONNECTED") {
      dispatch(incomingPostListConnect(payload, callback));
    } else {
      dispatch(incomingPostListDisconnect(payload, callback));
    }
  };

  const starPost = (post, callback = () => {}) => {
    if (post.type === "draft_post") return;
    let payload = {
      type: "post",
      type_id: post.id,
    };
    let topic_id = typeof params.workspaceId !== "undefined" ? parseInt(params.workspaceId) : null;
    if (post.slug && slug !== post.slug && sharedWs[post.slug]) {
      const sharedPayload = { slug: post.slug, token: sharedWs[post.slug].access_token, is_shared: true };
      payload = {
        ...payload,
        sharedPayload: sharedPayload,
      };
      topic_id = params.workspaceId ? `${params.workspaceId}-${post.slug}` : `${post.recipient_ids[0]}-${post.slug}`;
    }
    dispatch(
      postFavorite(payload, (err, res) => {
        callback(err, res);
        //@todo reverse the action/data in the reducer
        if (err) {
          toaster.error(<>{dictionary.notificationActionFailed}</>);
        }

        if (res) {
          toaster.success(
            <>
              {dictionary.notificationYouMarked}
              <b>{post.title}</b> {post.is_favourite ? dictionary.notificationNotStar : dictionary.notificationStar}.
            </>
          );
        }
      })
    );

    dispatch(starPostReducer({ post_id: post.id, topic_id, post_code: post.sharedSlug ? post.code : null }));
  };

  const markPost = (post) => {
    if (post.type === "draft_post") return;

    dispatch(
      postMarkDone({ post_id: post.id }, (err, res) => {
        if (err) {
          toaster.error(<>{dictionary.notificationActionFailed}</>);
        }

        if (res) {
          toaster.success(
            <>
              {dictionary.notificationYouMarked}
              <b>
                {post.name} {post.is_mark_done ? dictionary.notificationNotDone : dictionary.notificationDone}
              </b>
            </>
          );
        }
      })
    );
    dispatch(
      incomingPostMarkDone({
        post_id: post.id,
        is_done: !post.is_mark_done,
      })
    );
  };

  const openPost = (post, path = null) => {
    if (post.type === "draft_post") {
      let payload = {
        type: "post_modal",
        mode: "create",
        item: {
          draft: post,
        },
        params: params,
      };

      dispatch(addToModals(payload));
    } else {
      if (path) {
        if (path === "/posts") {
          history.push(path + `/${post.id}/${replaceChar(post.title)}`);
        } else {
          history.push(path + `/post/${post.id}/${replaceChar(post.title)}`);
        }
      } else {
        history.push(location.pathname + `/post/${post.id}/${replaceChar(post.title)}`);
      }
    }
  };

  const archivePost = (post, callback = () => {}) => {
    if (post.type === "draft_post") {
      dispatch(
        deleteDraft({
          draft_id: post.draft_id,
          type: post.type,
        })
      );
      dispatch(
        removeDraftPost(
          {
            post_id: post.id,
          },
          (err, res) => {
            callback(err, res);
            if (err) {
              toaster.error(<>{dictionary.notificationActionFailed}</>);
              return;
            }

            if (res) {
              toaster.success(
                <>
                  <b>{post.title}</b> {dictionary.notificationRemoved}.
                </>
              );
            }
          }
        )
      );
    } else {
      let payload = {
        post_id: post.id,
        is_archived: post.is_archived === 1 ? 0 : 1,
      };
      if (post.slug && post.sharedSlug && sharedWs[post.slug]) {
        const sharedPayload = { slug: post.slug, token: sharedWs[post.slug].access_token, is_shared: true };
        payload = {
          ...payload,
          sharedPayload: sharedPayload,
        };
      }

      dispatch(
        postArchive(payload, (err, res) => {
          callback(err, res);

          if (err) {
            toaster.error(<>Action failed.</>);
            return;
          }

          if (res) {
            let counterPayload = {};
            if (post.slug && post.sharedSlug && sharedWs[post.slug]) {
              const sharedPayload = { slug: post.slug, token: sharedWs[post.slug].access_token, is_shared: true };
              counterPayload = {
                ...counterPayload,
                sharedPayload: sharedPayload,
              };
            }
            getUnreadNotificationEntries(counterPayload);
            if (!post.is_archived) {
              toaster.success(
                <>
                  <b>{post.title}</b> {dictionary.postArchivedMuted}
                </>
              );
            } else {
              toaster.success(
                <>
                  <b>{post.title}</b> is unarchived.
                </>
              );
            }

            dispatch(
              archiveReducer({
                post_id: post.id,
                post_code: post.sharedSlug ? post.code : null,
                //topic_id: parseInt(params.workspaceId),
                is_archived: post.is_archived === 1 ? 0 : 1,
              })
            );
          }
        })
      );
    }
  };

  const markAsRead = (post, showToaster = false) => {
    let payload = {
      post_id: post.id,
      unread: 0,
      topic_id: parseInt(params.workspaceId),
    };
    if (post.slug && post.sharedSlug && sharedWs[post.slug]) {
      const sharedPayload = { slug: post.slug, token: sharedWs[post.slug].access_token, is_shared: true };
      payload = {
        ...payload,
        sharedPayload: sharedPayload,
      };
    }
    let count = post.unread_count;
    let cb = (err, res) => {
      if (err) {
        toaster.error(<>Action failed.</>);
        return;
      }
      payload = {
        ...payload,
        folderId: params.hasOwnProperty("folderId") ? parseInt(params.folderId) : null,
        count: count === 0 ? 1 : count,
      };
      if (res) {
        let counterPayload = {};
        if (post.slug && post.sharedSlug && sharedWs[post.slug]) {
          const sharedPayload = { slug: post.slug, token: sharedWs[post.slug].access_token, is_shared: true };
          counterPayload = {
            ...counterPayload,
            sharedPayload: sharedPayload,
          };
        }
        getUnreadNotificationEntries(counterPayload);
        if (post.recipients.some((r) => r.type === "TOPIC")) {
          dispatch(getFavoriteWorkspaceCounters({ sharedPayload: payload.sharedPayload }));
        }
        if (showToaster)
          toaster.success(
            <>
              {dictionary.notificationYouMarked} <b>{post.title}</b> {dictionary.notificationRead}.
            </>
          );

        dispatch(
          incomingReadUnreadReducer({
            post_id: post.id,
            unread: 0,
            user_id: user.id,
            post_code: payload.sharedPayload ? post.code : null,
            sharedSlug: post.sharedSlug,
            slug: post.slug,
          })
        );
      }
    };
    dispatch(postToggleRead(payload, cb));
  };

  const markAsUnread = (post, showToaster = false) => {
    let payload = {
      post_id: post.id,
      unread: 1,
      topic_id: params.workspaceId,
    };

    if (post.slug && post.sharedSlug && sharedWs[post.slug]) {
      const sharedPayload = { slug: post.slug, token: sharedWs[post.slug].access_token, is_shared: true };
      payload = {
        ...payload,
        sharedPayload: sharedPayload,
      };
    }

    let cb = (err, res) => {
      if (err) {
        toaster.error(<>Action failed.</>);
        return;
      }
      payload = {
        ...payload,
        folderId: params.hasOwnProperty("folderId") ? params.folderId : null,
      };

      if (res) {
        if (post.recipients.some((r) => r.type === "TOPIC")) {
          dispatch(getFavoriteWorkspaceCounters({ sharedPayload: payload.sharedPayload }));
        }
        if (showToaster)
          toaster.success(
            <>
              {dictionary.notificationYouMarked} <b>{post.title}</b> {dictionary.notificationUnread}.
            </>
          );

        dispatch(
          incomingReadUnreadReducer({
            post_id: post.id,
            unread: 1,
            user_id: user.id,
            post_code: post.sharedSlug ? post.code : null,
            sharedSlug: post.sharedSlug,
            slug: post.slug,
          })
        );
      }
    };

    dispatch(postToggleRead(payload, cb));
  };

  const sharePost = (post) => {
    let link = "";
    if (post.sharedSlug) {
      if (params.workspaceId) {
        if (params.folderId) {
          link = `${getBaseUrl()}/shared-hub/posts/${params.folderId}/${replaceChar(params.folderName)}/${params.workspaceId}/${replaceChar(params.workspaceName)}/post/${post.id}/${replaceChar(post.title)}`;
        } else if (params.workspaceId) {
          link = `${getBaseUrl()}/shared-hub/posts/${params.workspaceId}/${replaceChar(params.workspaceName)}/post/${post.id}/${replaceChar(post.title)}`;
        }
      } else {
        //get the workspace
        link = `${getBaseUrl()}/posts/${post.id}/${replaceChar(post.title)}`;
      }
    } else {
      if (params.folderId) {
        link = `${getBaseUrl()}/hub/posts/${params.folderId}/${replaceChar(params.folderName)}/${params.workspaceId}/${replaceChar(params.workspaceName)}/post/${post.id}/${replaceChar(post.title)}`;
      } else if (params.workspaceId) {
        link = `${getBaseUrl()}/hub/posts/${params.workspaceId}/${replaceChar(params.workspaceName)}/post/${post.id}/${replaceChar(post.title)}`;
      } else {
        link = `${getBaseUrl()}/posts/${post.id}/${replaceChar(post.title)}`;
      }
    }

    copyTextToClipboard(toaster, link);
  };

  const followPost = (post) => {
    let payload = {
      post_id: post.id,
    };
    if (post.slug && post.sharedSlug && sharedWs[post.slug]) {
      const sharedPayload = { slug: post.slug, token: sharedWs[post.slug].access_token, is_shared: true };
      payload = {
        ...payload,
        sharedPayload: sharedPayload,
      };
    }
    if (post.is_followed) {
      //When: The user is following/recipient of the post - and not the creator.
      dispatch(
        postUnfollow(payload, (err, res) => {
          if (err) return;
          let notification = `${dictionary.notificationStopFollow} ${post.title}`;
          toaster.info(notification);
          dispatch(
            setPostToggleFollow({
              post_id: post.id,
              is_followed: false,
              post_code: post.sharedSlug ? post.code : null,
            })
          );
          let counterPayload = {};
          if (post.slug && post.sharedSlug && sharedWs[post.slug]) {
            const sharedPayload = { slug: post.slug, token: sharedWs[post.slug].access_token, is_shared: true };
            counterPayload = {
              ...counterPayload,
              sharedPayload: sharedPayload,
            };
          }
          getUnreadNotificationEntries(counterPayload);
        })
      );
    } else {
      //When: The user not following the post and the post is in an open topic.
      dispatch(
        postFollow(payload, (err, res) => {
          if (err) return;
          let notification = `${dictionary.notificationStartFollow} ${post.title}`;
          toaster.info(notification);
          dispatch(
            setPostToggleFollow({
              post_id: post.id,
              is_followed: true,
              post_code: post.sharedSlug ? post.code : null,
            })
          );
        })
      );
    }
  };

  const trash = (post) => {
    const onConfirm = () => {
      let payload = {
        id: post.id,
      };
      if (post.slug && slug !== post.slug && sharedWs[post.slug]) {
        const sharedPayload = { slug: post.slug, token: sharedWs[post.slug].access_token, is_shared: true };
        payload = {
          ...payload,
          sharedPayload: sharedPayload,
        };
      }
      dispatch(
        deletePost(payload, (err, res) => {
          if (err) return;
          toaster.success(
            <>
              {dictionary.toasterDeletedPost} - {post.title}
            </>
          );
          dispatch(
            removePost({
              post_id: post.id,
              topic_id: parseInt(params.workspaceId),
              recipients: post.recipients,
              id: post.id,
              post_code: post.slug && slug !== post.slug ? post.code : null,
              sharedSlug: post.slug && slug !== post.slug,
            })
          );
        })
      );
      if (params.workspaceId) {
        let payload = {
          topic_id: parseInt(params.workspaceId),
          filter: "inbox",
          tag: null,
          isSharedSlug: post.slug && slug !== post.slug,
        };
        dispatch(updateWorkspacePostFilterSort(payload));
        if (post.slug && slug !== post.slug) {
          if (params.folderId) {
            history.push(`/shared-hub/posts/${params.folderId}/${params.folderName}/${params.workspaceId}/${replaceChar(params.workspaceName)}`);
          } else {
            history.push(`/shared-hub/posts/${params.workspaceId}/${replaceChar(params.workspaceName)}`);
          }
        } else {
          if (params.folderId) {
            history.push(`/hub/posts/${params.folderId}/${params.folderName}/${params.workspaceId}/${replaceChar(params.workspaceName)}`);
          } else {
            history.push(`/hub/posts/${params.workspaceId}/${replaceChar(params.workspaceName)}`);
          }
        }
      } else {
        let payload = {
          filter: "inbox",
          tag: null,
        };
        setCompanyFilterPosts(payload);
        history.push("/posts");
      }
    };

    let payload = {
      type: "confirmation",
      headerText: dictionary.headerRemovePostHeader,
      submitText: dictionary.buttonRemove,
      cancelText: dictionary.buttonCancel,
      bodyText: dictionary.removeThisPost,
      actions: {
        onSubmit: onConfirm,
      },
    };
    dispatch(addToModals(payload));
  };

  const showModal = (mode = "create", post = null, comment = null, rewardRef = null, cb = () => {}) => {
    let payload = {};
    let sharedPayload = null;
    if (post && post.sharedSlug && post.slug && sharedWs[post.slug]) {
      sharedPayload = { slug: post.slug, token: sharedWs[post.slug].access_token, is_shared: true };
    }
    switch (mode) {
      case "create_company": {
        payload = {
          type: "post_modal",
          mode: "create",
          item: {
            post: post,
          },
          action: {
            create: createCompany,
          },
        };
        break;
      }
      case "edit_company": {
        payload = {
          type: "post_modal",
          mode: "edit",
          item: {
            post: post,
          },
          action: {
            update: updateCompany,
          },
        };
        break;
      }
      case "edit": {
        payload = {
          type: "post_modal",
          mode: mode,
          item: {
            post: post,
          },
          action: {
            update: update,
          },
          params: params,
        };
        break;
      }
      case "confirmation": {
        payload = {
          type: "confirmation",
          mode: mode,
          submitText: dictionary.accept,
          cancelText: dictionary.buttonCancel,
          headerText: dictionary.acceptThisPost,
          bodyText: dictionary.acceptThisPostText,
          generalConditionText: dictionary.acceptCondition,
          item: {
            post: post,
          },
          actions: {
            onSubmit: () => {
              let triggerRead = true;
              if (post.is_must_read && post.author.id !== user.id) {
                if (post.must_read_users && post.must_read_users.some((u) => u.id === user.id && !u.must_read)) {
                  triggerRead = null;
                }
              }
              if (post.is_must_reply && post.author.id !== user.id) {
                if (post.must_reply_users && post.must_reply_users.some((u) => u.id === user.id && !u.must_reply)) {
                  triggerRead = null;
                }
              }
              if (triggerRead) markAsRead(post);
              if (rewardRef && rewardRef.current) {
                rewardRef.current.rewardMe();
              }
              if (comment) {
                let cpayload = {
                  post_id: post.id,
                  body: "<div></div>",
                  mention_ids: [],
                  file_ids: [],
                  post_file_ids: [],
                  personalized_for_id: null,
                  parent_id: comment.parent_id ? comment.parent_id : comment.id,
                  approval_user_ids: [],
                  code_data: {
                    push_title: `${user.name} replied in ${post.title}`,
                    post_id: post.id,
                    post_title: post.title,
                  },
                };
                if (comment.users_approval.length === 1) {
                  dispatch(
                    postComment(cpayload, (err, res) => {
                      if (err) return;
                      approveComment({ post_id: post.id, approved: 1, comment_id: comment.id, transfer_comment_id: res.data.id, sharedPayload: sharedPayload }, (err, res) => {
                        if (err) return;
                        dispatch(
                          addCommentReact(
                            {
                              counter: 1,
                              id: comment.id,
                              parent_id: comment.parent_id,
                              post_id: post.id,
                              reaction: "clap",
                              post_code: post.code,
                            },
                            cb
                          )
                        );
                      });
                    })
                  );
                } else {
                  approveComment({ post_id: post.id, approved: 1, comment_id: comment.id, sharedPayload: sharedPayload }, (err, res) => {
                    if (err) return;
                    dispatch(
                      addCommentReact(
                        {
                          counter: 1,
                          id: comment.id,
                          parent_id: comment.parent_id,
                          post_id: post.id,
                          reaction: "clap",
                          post_code: post.code,
                        },
                        cb
                      )
                    );
                    const isLastUserToAnswer = comment.users_approval.filter((u) => u.ip_address === null).length === 1;
                    const allUsersAgreed = comment.users_approval.filter((u) => u.ip_address !== null && u.is_approved).length === comment.users_approval.length - 1;
                    if (isLastUserToAnswer && allUsersAgreed) {
                      generateSystemMessage(
                        post,
                        comment.users_approval.map((ua) => ua.id),
                        []
                      );
                    }
                  });
                }
              } else {
                const isLastUserToAnswer = post.users_approval.filter((u) => u.ip_address === null).length === 1;
                const allUsersAgreed = post.users_approval.filter((u) => u.ip_address !== null && u.is_approved).length === post.users_approval.length - 1;
                setTimeout(() => {
                  approve({ post_id: post.id, approved: 1, sharedPayload: sharedPayload }, (err, res) => {
                    if (err) return;
                    if (isLastUserToAnswer && allUsersAgreed && post.users_approval.length > 1) {
                      generateSystemMessage(
                        post,
                        post.users_approval.map((ua) => ua.id),
                        []
                      );
                    }
                    if (post.users_approval.length === 1) {
                      let cpayload = {
                        post_id: post.id,
                        body: "<div></div>",
                        mention_ids: [],
                        file_ids: [],
                        post_file_ids: [],
                        personalized_for_id: null,
                        parent_id: null,
                        approval_user_ids: [],
                        has_accepted: 1,
                        code_data: {
                          push_title: `${user.name} replied in ${post.title}`,
                          post_id: post.id,
                          post_title: post.title,
                        },
                      };
                      dispatch(postComment(cpayload, cb));
                    }
                  });
                }, 1000);
              }
            },
          },
        };
        break;
      }
      case "create_edit_post_list": {
        payload = {
          type: "post_list",
          mode: "create",
          params: params,
        };
        break;
      }
      case "add_to_list": {
        payload = {
          type: "post_list",
          mode: "add",
          item: {
            post: post,
          },
          params: params,
        };
        break;
      }
      case "edit_post_list": {
        payload = {
          type: "post_list",
          mode: "edit",
          item: {
            post: post,
          },
          params: params,
        };
        break;
      }
      default: {
        payload = {
          type: "post_modal",
          mode: mode,
          item: {
            post: post,
          },
          action: {
            create: create,
          },
          params: params,
        };
      }
    }

    dispatch(addToModals(payload));
  };

  const create = (payload) => {
    dispatch(postCreate(payload));
  };

  const createCompany = (payload, callback = () => {}) => {
    dispatch(
      postCompanyPosts(payload, (err, res) => {
        if (res) {
          toaster.success(<>{dictionary.notificationCreatePost}</>);
        }
        callback(err, res);
      })
    );
  };

  const update = (payload, callback = () => {}) => {
    dispatch(
      putPost(payload, (err, res) => {
        if (res) {
          toaster.success(
            <>
              {dictionary.notificationYouUpdated} {payload.title} {dictionary.itemPost}
            </>
          );
        }
        callback(err, res);
      })
    );
  };

  const updateCompany = (payload, callback = () => {}) => {
    dispatch(
      putCompanyPosts(payload, (err, res) => {
        if (res) {
          toaster.success(
            <>
              {dictionary.notificationYouUpdated} {payload.title} {dictionary.itemPost}
            </>
          );
        }
        callback(err, res);
      })
    );
  };

  const clap = (payload, callback = () => {}) => {
    dispatch(postClap(payload, callback));
  };

  const getRecentPosts = (id, callback = () => {}) => {
    dispatch(fetchRecentPosts({ topic_id: id }, callback));
  };

  const getTagsCount = (id, callback) => {
    dispatch(fetchTagCounter({ topic_id: id }, callback));
  };

  const fetchCompanyPosts = (payload, callback) => {
    dispatch(getCompanyPosts(payload, callback));
  };

  const fetchMyCompanyPosts = (payload, callback) => {
    dispatch(getMyCompanyPosts(payload, callback));
  };

  const fetchArchivedCompanyPosts = (payload, callback) => {
    dispatch(getArchivedCompanyPosts(payload, callback));
  };

  const fetchStarCompanyPosts = (payload, callback) => {
    dispatch(getStarCompanyPosts(payload, callback));
  };

  const fetchReadCompanyPosts = (payload, callback) => {
    dispatch(getReadCompanyPosts(payload, callback));
  };

  const fetchInProgressCompanyPosts = (payload, callback) => {
    dispatch(getInProgressCompanyPosts(payload, callback));
  };

  const fetchUnreadCompanyPosts = (payload, callback) => {
    dispatch(getUnreadCompanyPosts(payload, callback));
  };

  const setCompanyFilterPosts = (payload, callback) => {
    dispatch(updateCompanyPostFilterSort(payload, callback));
  };

  const getPosts = (payload, callback) => {
    dispatch(fetchPosts(payload, callback));
  };

  const visit = (payload) => {
    dispatch(postVisit(payload));
  };

  const markReadRequirement = (post) => {
    let payload = {
      post_id: post.id,
      must_read: 1,
      must_reply: 0,
      is_approved: 0,
    };
    if (sharedPayload) {
      payload = {
        ...payload,
        sharedPayload: sharedPayload,
      };
    }
    if (post.sharedSlug && post.slug && sharedWs[post.slug]) {
      payload = {
        ...payload,
        sharedPayload: { slug: post.slug, token: sharedWs[post.slug].access_token, is_shared: true },
      };
    }

    dispatch(postRequired(payload));
    //markAsRead(post);
  };

  const markReplyRequirement = (post) => {
    let payload = {
      post_id: post.id,
      must_read: 0,
      must_reply: 1,
      is_approved: 0,
    };

    if (sharedPayload) {
      payload = {
        ...payload,
        sharedPayload: sharedPayload,
      };
    }
    dispatch(postRequired(payload));
  };

  const remind = (post, callback = () => {}) => {
    const onConfirm = (payload, modalCallback = () => {}) => {
      todoActions.createForPost(post.id, payload, (err, res) => {
        if (err) {
          if (err.response && err.response.data && err.response.data.errors) {
            if (err.response.data.errors.error_message.length && err.response.data.errors.error_message.find((e) => e === "ALREADY_CREATED_TODO")) {
              toaster.error(dictionary.reminderAlreadyExists);
            } else {
              toaster.error(dictionary.toasterGeneraError);
            }
          } else {
            toaster.error(dictionary.toasterGeneraError);
          }
        }
        if (res) {
          toaster.success(<span dangerouslySetInnerHTML={{ __html: dictionary.toasterCreateTodo }} />);
        }
        modalCallback(err, res);
        callback(err, res);
      });
    };
    let payload = {
      type: "todo_reminder",
      item: post,
      itemType: "POST",
      actions: {
        onSubmit: onConfirm,
      },
      params: params,
      isSharedWs: post.sharedSlug ? true : false,
    };

    dispatch(addToModals(payload));
  };

  const getUnreadPostsCount = () => {
    dispatch(getUnreadPostEntries());
  };

  const fetchPostClapHover = (postId, callback = () => {}) => {
    dispatch(
      getPostClapHover(
        {
          post_id: postId,
        },
        callback
      )
    );
  };

  const archiveAll = (payload = {}, callback) => {
    dispatch(archiveAllPosts(payload));
  };

  const readAll = (payload = {}, callback) => {
    dispatch(markAllPostAsRead(payload));
  };

  const addUserToPost = (payload = {}, callback) => {
    dispatch(addUserToPostRecipients(payload, callback));
  };

  const getUnreadPostCommentsCount = () => {
    dispatch(getUnreadPostComments());
  };

  const getUnreadNotificationEntries = (payload = {}, callback = () => {}) => {
    dispatch(getUnreadNotificationCounterEntries(payload, callback));
  };

  const like = (payload = {}, callback) => {
    dispatch(addPostReact(payload, callback));
  };

  const unlike = (payload = {}, callback) => {
    dispatch(removePostReact(payload, callback));
  };

  const fetchPostDetail = (payload = {}, callback) => {
    dispatch(fetchDetail(payload, callback));
  };

  const updatePostImages = (payload = {}) => {
    dispatch(updatePostFiles(payload));
  };

  const getUnreadWsPostsCount = (payload = {}, callback = () => {}) => {
    dispatch(
      getUnreadWorkspacePostEntries(payload, (err, res) => {
        if (callback) callback(err, res);
        if (err) return;
        dispatch(
          updateWorkspacePostCount({
            topic_id: payload.topic_id,
            count: res.data.result,
          })
        );
      })
    );
  };

  const approve = (payload, callback) => {
    dispatch(postApprove(payload, callback));
  };

  const approveComment = (payload = {}, callback) => {
    if (sharedPayload) {
      payload = {
        ...payload,
        sharedPayload: sharedPayload,
      };
    }
    dispatch(commentApprove(payload, callback));
  };

  const close = (payload, callback) => {
    dispatch(postClose(payload, callback));
  };

  const generateSystemMessage = (post, accepted_ids, rejected_ids) => {
    let payload = {
      post_id: post.id,
      //body: rejected_ids.length ? "<div>Everyone disagreed to this post</div>" : "<div>Everyone agreed to this post</div>",
      body: `COMMENT_APPROVAL::${JSON.stringify({
        message: rejected_ids.length ? "Everyone disagreed to this post" : "Everyone agreed to this post",
      })}`,
      generate_system_message: 1,
      accepted_user_ids: accepted_ids,
      rejected_user_ids: rejected_ids,
    };
    dispatch(postComment(payload));
  };

  const snooze = (post) => {
    const onConfirm = () => {
      dispatch(
        postSnooze(
          {
            post_id: post.id,
            set_time: "tomorrow",
          },
          (err, res) => {
            if (err) return;
            toaster.success("Post successfully snoozed.");
          }
        )
      );
      dispatch(removePost(post));
    };

    let payload = {
      type: "confirmation",
      headerText: dictionary.headerSnoozePost,
      submitText: dictionary.buttonSnooze,
      cancelText: dictionary.buttonCancel,
      bodyText: dictionary.snoozeThisPost,
      actions: {
        onSubmit: onConfirm,
      },
    };

    dispatch(addToModals(payload));
  };

  const setCommentType = (type, callback = () => {}) => {
    dispatch(setPostCommentType(type, callback));
  };

  const readPostNotification = (payload = {}, callback) => {
    dispatch(readNotification(payload, callback));
  };

  const refetchCompanyPosts = (payload = {}, callback) => {
    dispatch(refetchUnreadCompanyPosts(payload, callback));
  };

  const fetchPostReadAndClap = (payload = {}, callback) => {
    dispatch(getPostReadAndClap(payload, callback));
  };

  const setShowUnreadPosts = (value) => {
    dispatch(setShowUnread(value));
  };

  const fetchSharedCompanyPosts = (payload, callback) => {
    dispatch(getSharedCompanyPosts(payload, callback));
  };

  const fetchSharedMyCompanyPosts = (payload, callback) => {
    dispatch(getSharedMyCompanyPosts(payload, callback));
  };

  const fetchSharedArchivedCompanyPosts = (payload, callback) => {
    dispatch(getSharedArchivedCompanyPosts(payload, callback));
  };

  const fetchSharedStarCompanyPosts = (payload, callback) => {
    dispatch(getSharedStarCompanyPosts(payload, callback));
  };

  const fetchSharedReadCompanyPosts = (payload, callback) => {
    dispatch(getSharedReadCompanyPosts(payload, callback));
  };

  const fetchSharedUnreadCompanyPosts = (payload, callback) => {
    dispatch(getSharedUnreadCompanyPosts(payload, callback));
  };

  return {
    approve,
    approveComment,
    addUserToPost,
    starPost,
    markPost,
    openPost,
    archivePost,
    markAsRead,
    markAsUnread,
    sharePost,
    followPost,
    trash,
    showModal,
    update,
    clap,
    getRecentPosts,
    getTagsCount,
    fetchCompanyPosts,
    setCompanyFilterPosts,
    getPosts,
    visit,
    markReadRequirement,
    remind,
    fetchPostClapHover,
    getUnreadPostsCount,
    archiveAll,
    readAll,
    getUnreadPostCommentsCount,
    getUnreadNotificationEntries,
    like,
    unlike,
    fetchPostDetail,
    updatePostImages,
    getUnreadWsPostsCount,
    close,
    generateSystemMessage,
    fetchUnreadCompanyPosts,
    snooze,
    fetchPostList,
    createNewPostList,
    updatePostsList,
    deletePostsList,
    connectPostList,
    disconnectPostList,
    updatePostListConnect,
    markReplyRequirement,
    setCommentType,
    fetchReadCompanyPosts,
    fetchMyCompanyPosts,
    fetchArchivedCompanyPosts,
    fetchStarCompanyPosts,
    fetchInProgressCompanyPosts,
    readPostNotification,
    refetchCompanyPosts,
    fetchPostReadAndClap,
    setShowUnreadPosts,
    fetchSharedCompanyPosts,
    fetchSharedMyCompanyPosts,
    fetchSharedReadCompanyPosts,
    fetchSharedUnreadCompanyPosts,
    fetchSharedArchivedCompanyPosts,
    fetchSharedStarCompanyPosts,
  };
};

export default usePostActions;
