import {useCallback} from "react";
import {useDispatch} from "react-redux";
import { addComment, fetchComments, setEditComment, postComment, putComment,
        addCommentQuote, clearCommentQuote, postCommentClap
} from "../../redux/actions/postActions"

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

    const add = useCallback((payload) => {
        dispatch(
            addComment(payload)
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

    const addQuote = useCallback((comment) => {
        dispatch(
            addCommentQuote(comment)
        )
    }, [dispatch]);

    const clearQuote = useCallback((comment) => {
        dispatch(
            clearCommentQuote(comment)
        )
    }, [dispatch]);

    const clap = useCallback((payload) => {
        dispatch(
            postCommentClap(payload)
        );
    }, [dispatch]);

    return {
        add,
        addQuote,
        clap,
        clearQuote,
        create,
        edit,
        fetchPostComments,
        setToEdit,
    }
};

export default useCommentActions;