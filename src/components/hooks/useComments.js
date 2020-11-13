import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useCommentActions } from "./index";

const useComments = (post, workspace) => {

  const commentActions = useCommentActions();
  const { postComments } = useSelector((state) => state.workspaces);

  const [fetchingComments, setFetchingComments] = useState(false);

  useEffect(() => {
    if (post && !fetchingComments) {
      setFetchingComments(true);
      let url = `/v1/messages?post_id=${post.id}&skip=${0}&limit=${20}`;
      let payload = {
        url,
      };

      commentActions.fetchPostComments(payload, (err, res) => {
        setFetchingComments(false);
      });
    }
  }, [post]);

  return {
    comments: post && postComments[post.id] ? postComments[post.id].comments : {}
  };
};

export default useComments;
