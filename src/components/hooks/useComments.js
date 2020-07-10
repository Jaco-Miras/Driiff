import { useState } from "react";
import { useSelector } from "react-redux";

const useComments = (post, commentActions, workspace) => {
  //const dispatch = useDispatch();
  const postComments = useSelector((state) => state.workspaces.postComments);

  const [fetchingComments, setFetchingComments] = useState(false);

  if (post) {
    if (postComments.hasOwnProperty(post.id)) {
      let comments = { ...postComments[post.id] };
      return comments.comments;
    } else {
      if (!fetchingComments) {
        setFetchingComments(true);
        let url = `/v1/messages?post_id=${post.id}&skip=${0}&limit=${20}`;
        let payload = {
          url,
        };
        let cb = (err, res) => {
          setFetchingComments(false);
          if (err) return;
          let files = res.data.messages.map((m) => {
            if (m.replies.length) {
              return m.replies.map((r) => r.files);
            } else {
              return m.files;
            }
          });
          if (files.length) {
            files = files.flat(2);
          }
        };
        commentActions.fetchPostComments(payload, cb);
        return null;
      } else return null;
    }
  } else {
    return null;
  }
};

export default useComments;
