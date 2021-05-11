import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { addToModals, delRemoveToDo, getToDo, getToDoDetail, postToDo, putDoneToDo, putToDo } from "../../redux/actions/globalActions";
import { getWorkspaceReminders, getWorkspaceRemindersCallback, getWorkspaceRemindersCount, updateWorkspaceRemindersCount } from "../../redux/actions/workspaceActions";
import { useToaster, useTranslation } from "./index";

const useTodoActions = () => {
  const dispatch = useDispatch();
  const toaster = useToaster();
  const { _t } = useTranslation();
  const params = useParams();

  const dictionary = {
    toasterGeneraError: _t("TOASTER.GENERAL_ERROR", "An error has occurred try again!"),
    toasterCreateTodo: _t("TOASTER.TODO_CREATE_SUCCESS", "You will be reminded about this comment under <b>Reminders</b>."),
    toasterUpdateTodo: _t("TOASTER.TODO_UPDATE_SUCCESS", "You will be reminded about this comment under <b>Reminders</b>."),
    toasterDoneTodo: _t("TOASTER.TODO_DONE_SUCCESS", "You have mark ::todo_title:: as done."),
    toasterUnDoneTodo: _t("TOASTER.TODO_UNDONE_SUCCESS", "You have mark ::todo_title:: as undone."),
    toasterDeleteTodo: _t("TOASTER.TODO_DELETE_SUCCESS", "You have successfully deleted ::todo_title::."),
    modalConfirmationTodoRemoveHeader: _t("MODAL_CONFIRMATION.TODO_REMOVE_HEADER", "Remove reminder item?"),
    modalConfirmationTodoRemoveBody: _t("MODAL_CONFIRMATION.TODO_REMOVE_BODY", "Are you sure you want to remove this item?"),
    modalConfirmationTodoRemoveSubmit: _t("MODAL_CONFIRMATION.TODO_REMOVE_SUBMIT", "Remove"),
    modalConfirmationTodoRemoveCancel: _t("MODAL_CONFIRMATION.TODO_REMOVE_CANCEL", "Cancel"),
  };

  const fetch = useCallback((payload, callback) => {
    dispatch(getToDo(payload, callback));
  }, []);

  const fetchWs = (payload, callback) => {
    dispatch(
      getWorkspaceReminders(payload, (err, res) => {
        if (callback) callback();
        if (err) return;
        dispatch(
          getWorkspaceRemindersCallback({
            ...res.data,
            topic_id: payload.topic_id,
          })
        );
      })
    );
  };

  const fetchWsCount = useCallback((payload, callback) => {
    dispatch(
      getWorkspaceRemindersCount(payload, (err, res) => {
        if (err) return;
        dispatch(updateWorkspaceRemindersCount({ count: res.data, id: payload.topic_id }));
      })
    );
  }, []);

  const fetchDetail = useCallback((payload, callback) => {
    dispatch(getToDoDetail(payload, callback));
  }, []);

  const create = useCallback((payload, callback) => {
    dispatch(postToDo(payload, callback));
  }, []);

  const createFromModal = (callback = () => {}) => {
    const onConfirm = (payload, modalCallback = () => {}) => {
      create(payload, (err, res) => {
        if (err) {
          toaster.error(dictionary.toasterGeneraError);
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
      actions: {
        onSubmit: onConfirm,
      },
      params: params,
    };

    dispatch(addToModals(payload));
  };

  const createForPost = useCallback((id, payload, callback) => {
    dispatch(
      postToDo(
        {
          ...payload,
          link_id: id,
          link_type: "POST",
        },
        callback
      )
    );
  }, []);

  const createForPostComment = useCallback((id, payload, callback) => {
    dispatch(
      postToDo(
        {
          ...payload,
          link_id: id,
          link_type: "POST_COMMENT",
        },
        callback
      )
    );
  }, []);

  const createForChat = useCallback((id, payload, callback) => {
    dispatch(
      postToDo(
        {
          ...payload,
          link_id: id,
          link_type: "CHAT",
        },
        callback
      )
    );
  }, []);

  const update = useCallback((payload, callback) => {
    dispatch(putToDo(payload, callback));
  }, []);

  const updateFromModal = useCallback(
    (todo, callback = () => {}) => {
      const onConfirm = (payload, modalCallback = () => {}) => {
        update(
          {
            ...payload,
            id: todo.id,
          },
          (err, res) => {
            if (err) {
              toaster.error(dictionary.toasterGeneraError);
            }
            if (res) {
              toaster.success(<span dangerouslySetInnerHTML={{ __html: dictionary.toasterUpdateTodo }} />);
            }
            modalCallback(err, res);
            callback(err, res);
          }
        );
      };

      let payload = {
        type: "todo_reminder",
        mode: "edit",
        item: {
          ...todo,
          body: todo.description,
          ...(typeof todo.user === "undefined" && {
            user: todo.author,
          }),
        },
        parentItem: todo,
        itemType: todo.link_type,
        actions: {
          onSubmit: onConfirm,
        },
      };

      dispatch(addToModals(payload));
    },
    [dispatch]
  );

  const markDone = useCallback((payload, callback = () => {}) => {
    dispatch(
      putDoneToDo(
        {
          todo_id: payload.id,
        },
        (err, res) => {
          if (res) {
            toaster.success(<span dangerouslySetInnerHTML={{ __html: dictionary.toasterDoneTodo.replace("::todo_title::", `<b>${payload.title}</b>`) }} />);
          }
          callback(err, res);
        }
      )
    );
  }, []);

  const markUnDone = useCallback((payload, callback = () => {}) => {
    dispatch(
      putDoneToDo(
        {
          todo_id: payload.id,
          ...(payload.status === "DONE" && { undo: 1 }),
        },
        (err, res) => {
          if (res) {
            toaster.success(<span dangerouslySetInnerHTML={{ __html: dictionary.toasterUnDoneTodo.replace("::todo_title::", `<b>${payload.title}</b>`) }} />);
          }
          callback(err, res);
        }
      )
    );
  }, []);

  const toggleDone = useCallback((payload, callback = () => {}) => {
    dispatch(
      putDoneToDo(
        {
          todo_id: payload.id,
          ...(payload.status === "DONE" && { undo: 1 }),
        },
        (err, res) => {
          if (res) {
            if (res.data.status === "DONE") {
              toaster.success(<span dangerouslySetInnerHTML={{ __html: dictionary.toasterDoneTodo.replace("::todo_title::", `<b>${payload.title}</b>`) }} />);
            } else {
              toaster.success(<span dangerouslySetInnerHTML={{ __html: dictionary.toasterUnDoneTodo.replace("::todo_title::", `<b>${payload.title}</b>`) }} />);
            }
          }
          callback(err, res);
        }
      )
    );
  }, []);

  const remove = useCallback((payload, callback) => {
    dispatch(
      delRemoveToDo(
        {
          todo_id: payload.id,
        },
        (err, res) => {
          if (res) {
            toaster.success(<span dangerouslySetInnerHTML={{ __html: dictionary.toasterDeleteTodo.replace("::todo_title::", `<b>${payload.title}</b>`) }} />);
          }
          callback(err, res);
        }
      )
    );
  }, []);

  const removeConfirmation = useCallback(
    (payload, callback) => {
      const onConfirm = () => {
        remove(payload, callback);
      };

      dispatch(
        addToModals({
          type: "confirmation",
          headerText: dictionary.modalConfirmationTodoRemoveHeader,
          submitText: dictionary.modalConfirmationTodoRemoveSubmit,
          cancelText: dictionary.modalConfirmationTodoRemoveCancel,
          bodyText: dictionary.modalConfirmationTodoRemoveBody,
          actions: {
            onSubmit: onConfirm,
          },
        })
      );
    },
    [dispatch]
  );

  return {
    fetch,
    fetchDetail,
    fetchWs,
    fetchWsCount,
    create,
    createFromModal,
    createForPost,
    createForPostComment,
    createForChat,
    update,
    updateFromModal,
    markDone,
    markUnDone,
    toggleDone,
    remove,
    removeConfirmation,
  };
};

export default useTodoActions;
