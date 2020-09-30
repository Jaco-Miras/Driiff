import React, {useCallback} from "react";
import {useDispatch} from "react-redux";
import {
  addToModals,
  delRemoveToDo,
  getToDo,
  getToDoDetail,
  postToDo,
  putDoneToDo,
  putToDo
} from "../../redux/actions/globalActions";
import {useToaster} from "./index";

const useTodoActions = () => {

  const dispatch = useDispatch();
  const toaster = useToaster();

  const fetch = useCallback((payload, callback) => {
    dispatch(
      getToDo(payload, callback)
    )
  }, []);

  const fetchDetail = useCallback((payload, callback) => {
    dispatch(
      getToDoDetail(payload, callback)
    )
  }, []);

  const create = useCallback((payload, callback) => {
    dispatch(
      postToDo(payload, callback)
    )
  }, []);

  const createFromModal = useCallback(
    (callback) => {
      const onConfirm = (payload, callback) => {
        create(payload, (err, res) => {
          if (err) {
            toaster.error(`An error has occurred try again!`);
          }
          if (res) {
            toaster.success(`You will be reminded on this comment.`);
          }
          callback(err, res);
        });
      }

      let payload = {
        type: "todo_reminder",
        actions: {
          onSubmit: onConfirm,
        },
      };

      dispatch(addToModals(payload));
    },
    [dispatch]
  );

  const createForPost = useCallback((id, payload, callback) => {
    dispatch(
      postToDo({
        ...payload,
        link_id: id,
        link_type: "POST"
      }, callback)
    )
  }, []);

  const createForPostComment = useCallback((id, payload, callback) => {
    dispatch(
      postToDo({
        ...payload,
        link_id: id,
        link_type: "POST_COMMENT"
      }, callback)
    )
  }, []);

  const createForChat = useCallback((id, payload, callback) => {
    dispatch(
      postToDo({
        ...payload,
        link_id: id,
        link_type: "CHAT"
      }, callback)
    )
  }, []);

  const update = useCallback((payload, callback) => {
    dispatch(
      putToDo(payload, callback)
    )
  }, []);

  const updateFromModal = useCallback(
    (todo, callback) => {
      const onConfirm = (payload, callback) => {
        update({
          ...payload,
          id: todo.id,
        }, (err, res) => {
          if (err) {
            toaster.error(`An error has occurred try again!`);
          }
          if (res) {
            toaster.success(`You will be reminded on this comment.`);
          }
          callback(err, res);
        });
      }

      let payload = {
        type: "todo_reminder",
        mode: "edit",
        item: {
          ...todo,
          body: todo.description,
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

  const markDone = useCallback((payload, callback) => {
    dispatch(
      putDoneToDo({
        todo_id: payload.id
      }, (err, res) => {
        if (res) {
          toaster.success(`You have mark ${payload.title} as done`);
        }
        callback(err, res);
      })
    )
  }, []);

  const toggleDone = useCallback((payload, callback) => {
    dispatch(
      putDoneToDo({
        todo_id: payload.id,
        ...(payload.status === "DONE" && {undo: 1}),
      }, (err, res) => {
        if (res) {
          toaster.success(`You have mark ${payload.title} as done`);
        }
        callback(err, res);
      })
    )
  }, []);

  const remove = useCallback((payload, callback) => {
    dispatch(
      delRemoveToDo({
        todo_id: payload.id
      }, (err, res) => {
        if (res) {
          toaster.success(<>You have succesfully deleted <b>{payload.title}</b></>);
        }
        callback(err, res);
      })
    )
  }, []);

  const removeConfirmation = useCallback(
    (payload, callback) => {

      const onConfirm = () => {
        remove(payload, callback);
      };

      dispatch(addToModals({
        type: "confirmation",
        headerText: "Remove to-do item?",
        submitText: "Remove",
        cancelText: "Cancel",
        bodyText: "Are you sure you want to remove this item?",
        actions: {
          onSubmit: onConfirm,
        },
      }));
    },
    [dispatch]
  );


  return {
    fetch,
    fetchDetail,
    create,
    createFromModal,
    createForPost,
    createForPostComment,
    createForChat,
    update,
    updateFromModal,
    markDone,
    toggleDone,
    remove,
    removeConfirmation
  };
};

export default useTodoActions;
