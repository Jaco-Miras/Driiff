import {useCallback} from "react";
import {useDispatch} from "react-redux";
import { fetchComments, setEditComment, postComment, putComment } from "../../redux/actions/postActions"

const useCommentActions = props => {

    const dispatch = useDispatch();

    const fetchPostComments = useCallback((payload, callback) => {
        dispatch(
            fetchComments(payload, callback)
        )
    }, [dispatch]);

    const setToEdit = useCallback((comment) => {
        dispatch(
            setEditComment(comment)
        )
    }, [dispatch]);

    const create = useCallback((payload) => {
        dispatch(
            postComment(payload)
        )
    }, [dispatch]);

    const edit = useCallback((payload) => {
        dispatch(
            putComment(payload)
        )
    }, [dispatch]);

    return {
        create,
        fetchPostComments,
        setToEdit,
        edit
    }
};

export default useCommentActions;