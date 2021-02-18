import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useCommentActions } from "./index";

const useComments = (post) => {

  const commentActions = useCommentActions();
  const postComments = useSelector((state) => state.workspaces.postComments);

  const [fetchingComments, setFetchingComments] = useState(false);
  const [fetchingPostReads, setFetchingPostReads] = useState(false);

  useEffect(() => {    
    if (!fetchingComments && !postComments.hasOwnProperty(post.id)) {
      setFetchingComments(true);
      let url = `/v1/messages?post_id=${post.id}&skip=${0}&limit=${20}`;
      let payload = {
        url,
      };
      commentActions.fetchPostComments(payload, (err, res) => {
        setFetchingComments(false);
      });
    }

    if ( !fetchingPostReads && !post.hasOwnProperty("post_reads")) {
      commentActions.fetchPostRead(parseInt(post.id), (err, res) => {
        setFetchingPostReads(true);
        const payload  = {
          postId: post.id,
          readPosts: [
            ...res.data
          ]
        }
        commentActions.setPostReadComments(payload, () => {
          setFetchingPostReads(false);
        });
      });
    }
  }, [post]);

  return {
    comments: post && postComments[post.id] ? postComments[post.id].comments : {}
  };
};

export default useComments;
