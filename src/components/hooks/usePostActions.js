import React, {useCallback} from "react";
import {useDispatch} from "react-redux";
import {useHistory, useLocation, useParams} from "react-router-dom";
import {copyTextToClipboard} from "../../helpers/commonFunctions";
import {getBaseUrl} from "../../helpers/slugHelper";
import {replaceChar} from "../../helpers/stringFormatter";
import {addToModals, deleteDraft} from "../../redux/actions/globalActions";
import {
  archiveReducer,
  deletePost,
  fetchPosts,
  fetchRecentPosts,
  fetchTagCounter,
  getCompanyPosts,
  markPostReducer,
  markReadUnreadReducer,
  mustReadReducer,
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
  removePost,
  starPostReducer,
  updateCompanyPostFilterSort,
} from "../../redux/actions/postActions";
import {useToaster, useTodoActions} from "./index";

const usePostActions = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const history = useHistory();
  const params = useParams();
  const toaster = useToaster();
  const todoActions = useTodoActions();

  const starPost = useCallback(
    (post) => {
      if (post.type === "draft_post") return;
      let topic_id = typeof params.workspaceId !== "undefined" ? parseInt(params.workspaceId) : null;
      dispatch(
        postFavorite({type: "post", type_id: post.id}, (err, res) => {
          //@todo reverse the action/data in the reducer
          if (err) {
            toaster.error(<>Action failed!</>);
          }

          if (res) {
            toaster.success(
              <>
                You mark <b>{post.title}</b> as starred
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
      let topic_id = parseInt(params.workspaceId);
      dispatch(
        postMarkDone({post_id: post.id}, (err, res) => {
          //@todo reverse the action/data in the reducer
          if (err) {
            toaster.error(<>Action failed!</>);
          }

          if (res) {
            toaster.success(
              <>
                You marked <b>{post.name} as done</b>
              </>
            );
          }
        })
      );
      dispatch(
        markPostReducer({
          post_id: post.id,
          topic_id,
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
    (post) => {
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
                  toaster.success(<>Action failed.</>);
                  return;
                }

                if (res) {
                  toaster.success(
                    <>
                      <b>{post.title}</b> is removed.
                    </>
                  );
                }
              }
            )
          );
        };

        let payload = {
          type: "confirmation",
          headerText: "Remove post draft?",
          submitText: "Remove",
          cancelText: "Cancel",
          bodyText: "Are you sure you want to remove this post draft?",
          actions: {
            onSubmit: onConfirm,
          },
        };

        dispatch(addToModals(payload));
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
                  if (params.hasOwnProperty("postId")) {
                    history.goBack();
                  }
                }
              }
            )
          );
        };

        let payload = {
          type: "confirmation",
          headerText: post.is_archived === 1 ? "Un-archive post?" : "Archive post?",
          submitText: post.is_archived === 1 ? "Un-archive" : "Archive",
          cancelText: "Cancel",
          bodyText: post.is_archived === 1 ? "Are you sure you want to un-archive this post?" : "Are you sure you want to archive this post?",
          actions: {
            onSubmit: onConfirm,
          },
        };

        dispatch(addToModals(payload));
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
                You marked <b>{post.title}</b> as read.
              </>
            );

          dispatch(markReadUnreadReducer(payload));
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
                You marked <b>{post.title}</b> as unread.
              </>
            );

          dispatch(markReadUnreadReducer(payload));
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
          postUnfollow({post_id: post.id}, (err, res) => {
            if (err) return;
            let notification = `You’ve stopped to follow ${post.title}`;
            toaster.info(notification);
          })
        );
      } else {
        //When: The user not following the post and the post is in an open topic.
        dispatch(
          postFollow({post_id: post.id}, (err, res) => {
            if (err) return;
            let notification = `You’ve started to follow ${post.title}`;
            toaster.info(notification);
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
        headerText: "Remove post?",
        submitText: "Remove",
        cancelText: "Cancel",
        bodyText: "Are you sure you want to remove this post?",
        actions: {
          onSubmit: onConfirm,
        },
      };

      dispatch(addToModals(payload));
    },
    [dispatch, params]
  );

  const showModal = useCallback(
    (mode = "create", post = null) => {
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
    (payload, callback = () => {
    }) => {
      dispatch(postCompanyPosts(payload, (err, res) => {
        if (res) {
          toaster.success(<>You have successfully created a post.</>);
        }
        callback(err, res);
      }));
    },
    [dispatch]
  );

  const update = useCallback(
    (payload, callback = () => {
    }) => {
      dispatch(putPost(payload, (err, res) => {
        if (res) {
          toaster.success(<>You have updated {payload.title} post.</>);
        }
        callback(err, res);
      }));
    },
    [dispatch]
  );

  const updateCompany = useCallback(
    (payload, callback = () => {
    }) => {
      dispatch(putCompanyPosts(payload, (err, res) => {
        if (res) {
          toaster.success(<>You have updated {payload.title} post.</>);
        }
        callback(err, res);
      }));
    },
    [dispatch]
  );

  const clap = useCallback(
    (payload, callback = () => {
    }) => {
      dispatch(postClap(payload, callback));
    },
    [dispatch]
  );

  const getRecentPosts = useCallback(
    (id, callback = () => {
    }) => {
      dispatch(fetchRecentPosts({topic_id: id}, callback));
    },
    [dispatch]
  );

  const getTagsCount = useCallback(
    (id, callback) => {
      dispatch(fetchTagCounter({topic_id: id}));
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
        dispatch(
          mustReadReducer({
            post_id: post.id,
            topic_id: params.workspaceId,
          })
        );
      };
      dispatch(postMarkRead(payload, cb));
    },
    [dispatch, params]
  );

  const remind = useCallback(
    (post, callback) => {
      const onConfirm = (payload, callback) => {
        todoActions.createForPost(post.id, payload, (err, res) => {
          if (err) {
            toaster.error(`An error has occured try again!`);
          }
          if (res) {
            toaster.success(`You will be reminded on this post.`);
          }
          callback(err, res);
        })
      }
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

  return {
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
    remind
  };
};

export default usePostActions;
