import {useCallback} from "react";
import {useDispatch} from "react-redux";
import {delRemoveToDo, getToDo, postToDo, putDoneToDo, putToDo} from "../../redux/actions/globalActions";

const useTodoActions = () => {

  const dispatch = useDispatch();

  const fetch = useCallback((payload, callback) => {
    dispatch(
      getToDo(payload, callback)
    )
  }, []);

  const create = useCallback((payload, callback) => {
    dispatch(
      postToDo(payload, callback)
    )
  }, []);

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

  const setDone = useCallback((id, callback) => {
    dispatch(
      putDoneToDo({
        todo_id: id
      }, callback)
    )
  }, []);

  const remove = useCallback((id, callback) => {
    dispatch(
      delRemoveToDo({
        todo_id: id
      }, callback)
    )
  }, []);


  return {
    fetch,
    create,
    createForPost,
    createForPostComment,
    createForChat,
    update,
    setDone,
    remove
  };
};

export default useTodoActions;
