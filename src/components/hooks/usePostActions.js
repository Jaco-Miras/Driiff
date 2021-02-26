import React, { useCallback } from "react";
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
  //archiveAllCallback,
  archiveAllPosts,
  archiveReducer,
  commentApprove,
  deletePost,
  fetchDetail,
  fetchPosts,
  fetchRecentPosts,
  fetchTagCounter,
  getCompanyPosts,
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
  postMarkRead,
  postToggleRead,
  postUnfollow,
  postVisit,
  putCompanyPosts,
  putPost,
  //readAllCallback,
  removePost,
  removePostReact,
  setPostToggleFollow,
  starPostReducer,
  updateCompanyPostFilterSort,
  updatePostFiles,
  postComment,
  postClose,
} from "../../redux/actions/postActions";
import { getUnreadWorkspacePostEntries, updateWorkspacePostCount } from "../../redux/actions/workspaceActions";
import { useToaster, useTodoActions } from "./index";
import { useTranslation } from "../hooks";

const usePostActions = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const history = useHistory();
  const params = useParams();
  const toaster = useToaster();
  const todoActions = useTodoActions();
  const { _t } = useTranslation();

  const user = useSelector((state) => state.session.user);

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
  };

  const starPost = useCallback(
    (post) => {
      if (post.type === "draft_post") return;
      let topic_id = typeof params.workspaceId !== "undefined" ? parseInt(params.workspaceId) : null;
      dispatch(
        postFavorite({ type: "post", type_id: post.id }, (err, res) => {
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
      dispatch(
        starPostReducer({
          post_id: post.id,
          topic_id,
        })
      );
    },
    [dispatch, params]
  );

  const markPost = useCallback(
    (post) => {
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
    },
    [dispatch, params]
  );

  const openPost = useCallback(
    (post, path = null) => {
      if (post.type === "draft_post") {
        let payload = {
          type: "workspace_post_create_edit",
          mode: "create",
          item: {
            draft: post,
          },
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
    },
    [dispatch, history, location]
  );

  const archivePost = useCallback(
    (post, callback = () => {}) => {
      if (post.type === "draft_post") {
        const onConfirm = () => {
          dispatch(
            deleteDraft({
              draft_id: post.draft_id,
              type: post.type,
            })
          );
          dispatch(
            removePost(
              {
                post_id: post.id,
                topic_id: parseInt(params.workspaceId),
              },
              (err, res) => {
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
                callback(err, res);
              }
            )
          );
        };

        // let payload = {
        //   type: "confirmation",
        //   headerText: dictionary.headerRemoveDraftHeader,
        //   submitText: dictionary.buttonRemove,
        //   cancelText: dictionary.buttonCancel,
        //   bodyText: dictionary.removeThisDraft,
        //   actions: {
        //     onSubmit: onConfirm,
        //   },
        // };

        // dispatch(addToModals(payload));
        onConfirm();
      } else {
        const onConfirm = () => {
          dispatch(
            postArchive(
              {
                post_id: post.id,
                is_archived: post.is_archived === 1 ? 0 : 1,
              },
              (err, res) => {
                if (err) {
                  toaster.success(<>Action failed.</>);
                  return;
                }

                if (res) {
                  if (!post.is_archived) {
                    toaster.success(
                      <>
                        <b>{post.title}</b> is archived.
                      </>
                    );
                  } else {
                    toaster.success(
                      <>
                        <b>{post.title}</b> is restored.
                      </>
                    );
                  }

                  dispatch(
                    archiveReducer({
                      post_id: post.id,
                      topic_id: parseInt(params.workspaceId),
                      is_archived: post.is_archived === 1 ? 0 : 1,
                    })
                  );
                  // if (params.hasOwnProperty("postId")) {
                  //   history.goBack();
                  // }
                }
                callback(err, res);
              }
            )
          );
        };

        // let payload = {
        //   type: "confirmation",
        //   headerText: post.is_archived === 1 ? dictionary.headerUnarchivePostHeader : dictionary.headerArchivePostHeader,
        //   submitText: post.is_archived === 1 ? dictionary.buttonUnarchive : dictionary.buttonArchive,
        //   cancelText: dictionary.buttonCancel,
        //   bodyText: post.is_archived === 1 ? dictionary.unarchiveThisPost : dictionary.archiveThisPost,
        //   actions: {
        //     onSubmit: onConfirm,
        //   },
        // };

        // dispatch(addToModals(payload));
        onConfirm();
      }
    },
    [dispatch, params, history]
  );

  const markAsRead = useCallback(
    (post, showToaster = false) => {
      let payload = {
        post_id: post.id,
        unread: 0,
        topic_id: parseInt(params.workspaceId),
      };
      let count = post.unread_count;
      let cb = (err, res) => {
        if (err) {
          toaster.success(<>Action failed.</>);
          return;
        }
        payload = {
          ...payload,
          folderId: params.hasOwnProperty("folderId") ? parseInt(params.folderId) : null,
          count: count === 0 ? 1 : count,
        };
        if (res) {
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
            })
          );
        }
      };
      dispatch(postToggleRead(payload, cb));
    },
    [dispatch, params]
  );

  const markAsUnread = useCallback(
    (post, showToaster = false) => {
      let payload = {
        post_id: post.id,
        unread: 1,
        topic_id: params.workspaceId,
      };
      let cb = (err, res) => {
        if (err) {
          toaster.success(<>Action failed.</>);
          return;
        }
        payload = {
          ...payload,
          folderId: params.hasOwnProperty("folderId") ? params.folderId : null,
        };

        if (res) {
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
            })
          );
        }
      };
      dispatch(postToggleRead(payload, cb));
    },
    [dispatch, params]
  );

  const sharePost = useCallback(
    (post) => {
      let link = `${getBaseUrl()}${location.pathname}/post/${post.id}/${replaceChar(post.title)}`;
      copyTextToClipboard(toaster, link);
    },
    [dispatch, location, getBaseUrl]
  );

  const snoozePost = useCallback(
    (post) => {
      let payload = {
        type: "snooze_post",
        post: post,
        topic_id: params.workspaceId,
      };

      dispatch(addToModals(payload));
    },
    [dispatch, params]
  );

  const followPost = useCallback(
    (post) => {
      if (post.is_followed) {
        //When: The user is following/recipient of the post - and not the creator.
        dispatch(
          postUnfollow({ post_id: post.id }, (err, res) => {
            if (err) return;
            let notification = `${dictionary.notificationStopFollow} ${post.title}`;
            toaster.info(notification);
            dispatch(
              setPostToggleFollow({
                post_id: post.id,
                is_followed: false,
              })
            );
          })
        );
      } else {
        //When: The user not following the post and the post is in an open topic.
        dispatch(
          postFollow({ post_id: post.id }, (err, res) => {
            if (err) return;
            let notification = `${dictionary.notificationStartFollow} ${post.title}`;
            toaster.info(notification);
            dispatch(
              setPostToggleFollow({
                post_id: post.id,
                is_followed: true,
              })
            );
          })
        );
      }
    },
    [dispatch]
  );

  const trash = useCallback(
    (post) => {
      const onConfirm = () => {
        dispatch(
          deletePost(
            {
              id: post.id,
            },
            (err, res) => {
              if (err) return;
              dispatch(
                removePost({
                  post_id: post.id,
                  topic_id: parseInt(params.workspaceId),
                })
              );
              if (params.hasOwnProperty("postId")) {
                history.goBack();
              }
            }
          )
        );
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
    },
    [dispatch, params]
  );

  const showModal = useCallback(
    (mode = "create", post = null, comment = null) => {
      let payload = {};

      switch (mode) {
        case "create_company": {
          payload = {
            type: "company_post_create_edit",
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
            type: "company_post_create_edit",
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
            type: "workspace_post_create_edit",
            mode: mode,
            item: {
              post: post,
            },
            action: {
              update: update,
            },
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
                        approveComment({ post_id: post.id, approved: 1, comment_id: comment.id, transfer_comment_id: res.data.id }, (err, res) => {
                          if (err) return;
                          dispatch(
                            addCommentReact({
                              counter: 1,
                              id: comment.id,
                              parent_id: comment.parent_id,
                              post_id: post.id,
                              reaction: "clap",
                            })
                          );
                        });
                      })
                    );
                  } else {
                    approveComment({ post_id: post.id, approved: 1, comment_id: comment.id }, (err, res) => {
                      if (err) return;
                      dispatch(
                        addCommentReact({
                          counter: 1,
                          id: comment.id,
                          parent_id: comment.parent_id,
                          post_id: post.id,
                          reaction: "clap",
                        })
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
                  approve({ post_id: post.id, approved: 1 }, (err, res) => {
                    if (err) return;
                    console.log(isLastUserToAnswer, allUsersAgreed, post);
                    if (isLastUserToAnswer && allUsersAgreed) {
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
                      dispatch(postComment(cpayload));
                    }
                  });
                }
              },
            },
          };
          break;
        }
        default: {
          payload = {
            type: "workspace_post_create_edit",
            mode: mode,
            item: {
              post: post,
            },
            action: {
              create: create,
            },
          };
        }
      }

      dispatch(addToModals(payload));
    },
    [dispatch]
  );

  const create = useCallback(
    (payload) => {
      dispatch(postCreate(payload));
    },
    [dispatch]
  );

  const createCompany = useCallback(
    (payload, callback = () => {}) => {
      dispatch(
        postCompanyPosts(payload, (err, res) => {
          if (res) {
            toaster.success(<>{dictionary.notificationCreatePost}</>);
          }
          callback(err, res);
        })
      );
    },
    [dispatch]
  );

  const update = useCallback(
    (payload, callback = () => {}) => {
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
    },
    [dispatch]
  );

  const updateCompany = useCallback(
    (payload, callback = () => {}) => {
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
    },
    [dispatch]
  );

  const clap = useCallback(
    (payload, callback = () => {}) => {
      dispatch(postClap(payload, callback));
    },
    [dispatch]
  );

  const getRecentPosts = useCallback(
    (id, callback = () => {}) => {
      dispatch(fetchRecentPosts({ topic_id: id }, callback));
    },
    [dispatch]
  );

  const getTagsCount = useCallback(
    (id, callback) => {
      dispatch(fetchTagCounter({ topic_id: id }, callback));
    },
    [dispatch]
  );

  const fetchCompanyPosts = useCallback(
    (payload, callback) => {
      dispatch(getCompanyPosts(payload, callback));
    },
    [dispatch]
  );

  const setCompanyFilterPosts = useCallback(
    (payload, callback) => {
      dispatch(updateCompanyPostFilterSort(payload, callback));
    },
    [dispatch]
  );

  const getPosts = useCallback(
    (payload, callback) => {
      dispatch(fetchPosts(payload, callback));
    },
    [dispatch]
  );

  const visit = useCallback(
    (payload) => {
      dispatch(postVisit(payload));
    },
    [dispatch]
  );

  const markReadRequirement = useCallback(
    (post) => {
      let payload = {
        post_id: post.id,
        personalized_for_id: null,
        mark_as_read: 1,
      };
      let cb = (err, res) => {
        if (err) return;
      };
      dispatch(postMarkRead(payload, cb));
    },
    [dispatch, params]
  );

  const remind = useCallback(
    (post, callback = () => {}) => {
      const onConfirm = (payload, modalCallback = () => {}) => {
        todoActions.createForPost(post.id, payload, (err, res) => {
          if (err) {
            toaster.error(`${dictionary.notificationError}`);
          }
          if (res) {
            toaster.success(
              <>
                {dictionary.notificationReminderPost} <b>{dictionary.todoLinks}</b>.
              </>
            );
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
      };

      dispatch(addToModals(payload));
    },
    [dispatch, params]
  );

  const getUnreadPostsCount = useCallback(() => {
    dispatch(getUnreadPostEntries());
  }, []);

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

  const archiveAll = useCallback(
    (payload = {}, callback) => {
      dispatch(
        archiveAllPosts(payload, (err, res) => {
          if (err) return;

          // if (callback) callback();
          // dispatch(archiveAllCallback(payload))
        })
      );
    },
    [dispatch]
  );

  const readAll = useCallback(
    (payload = {}, callback) => {
      dispatch(
        markAllPostAsRead(payload, (err, res) => {
          if (err) return;

          // if (callback) callback();
          // dispatch(readAllCallback(payload))
        })
      );
    },
    [dispatch]
  );

  const addUserToPost = useCallback(
    (payload = {}, callback) => {
      dispatch(addUserToPostRecipients(payload, callback));
    },
    [dispatch]
  );

  const getUnreadPostCommentsCount = useCallback(() => {
    dispatch(getUnreadPostComments());
  }, [dispatch]);

  const getUnreadNotificationEntries = useCallback(
    (payload = {}) => {
      dispatch(getUnreadNotificationCounterEntries(payload));
    },
    [dispatch]
  );

  const like = useCallback(
    (payload = {}, callback) => {
      dispatch(addPostReact(payload, callback));
    },
    [dispatch]
  );

  const unlike = useCallback(
    (payload = {}, callback) => {
      dispatch(removePostReact(payload, callback));
    },
    [dispatch]
  );

  const fetchPostDetail = useCallback(
    (payload = {}) => {
      dispatch(fetchDetail(payload));
    },
    [dispatch]
  );

  const updatePostImages = useCallback(
    (payload = {}) => {
      dispatch(updatePostFiles(payload));
    },
    [dispatch]
  );

  const getUnreadWsPostsCount = useCallback(
    (payload = {}, callback = () => {}) => {
      dispatch(
        getUnreadWorkspacePostEntries(payload, (err, res) => {
          if (err) return;
          dispatch(
            updateWorkspacePostCount({
              topic_id: payload.topic_id,
              count: res.data.result,
            })
          );
        })
      );
    },
    [dispatch]
  );

  const approve = useCallback(
    (payload, callback) => {
      dispatch(postApprove(payload, callback));
    },
    [dispatch]
  );

  const approveComment = useCallback(
    (payload = {}, callback) => {
      dispatch(commentApprove(payload, callback));
    },
    [dispatch]
  );

  const close = useCallback(
    (post, callback) => {
      dispatch(postClose({ post_id: post.id, is_close: post.is_close ? 0 : 1 }, callback));
    },
    [dispatch]
  );

  const generateSystemMessage = useCallback(
    (post, accepted_ids, rejected_ids) => {
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
    },
    [dispatch]
  );

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
    snoozePost,
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
  };
};

export default usePostActions;
