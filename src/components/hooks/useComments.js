import {useState} from "react";
import {useDispatch, useSelector} from "react-redux";

const useComments = (post, commentActions) => {

    const dispatch = useDispatch();
    const postComments = useSelector(state => state.workspaces.postComments);

    const [fetchingComments, setFetchingComments] = useState(false);

    if (post) {
        if (postComments.hasOwnProperty(post.id)) {
            let comments = {...postComments[post.id]};
            return comments.comments
        } else {
            if (!fetchingComments) {
                setFetchingComments(true);
                let url = `/v1/messages?post_id=${post.id}&skip=${0}&limit=${20}`;
                let payload = {
                    url
                }
                commentActions.fetchPostComments(payload, () => { setFetchingComments(false)});
                return null
            } else return null
        }
    } else {
        return null
    }
};

export default useComments;