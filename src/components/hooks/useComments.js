import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useCommentActions } from "./index";

const useComments = (post) => {
  const commentActions = useCommentActions();
  const postComments = useSelector((state) => state.workspaces.postComments);
  //const user = useSelector((state) => state.session.user);

  const [fetchingComments, setFetchingComments] = useState(false);
  //const [fetchingPostReads, setFetchingPostReads] = useState(false);

  const componentIsMounted = useRef(true);

  useEffect(() => {
    if (postComments.hasOwnProperty(post.id)) {
      commentActions.fetchPostAndComments(post);
    }

    return () => {
      componentIsMounted.current = null;
    };
  }, []);

  useEffect(() => {
    if (!fetchingComments && !postComments.hasOwnProperty(post.id)) {
      setFetchingComments(true);
      let url = `/v1/messages?post_id=${post.id}&skip=${0}&limit=${20}`;
      let payload = {
        url,
      };
      commentActions.fetchPostComments(payload, (err, res) => {
        if (componentIsMounted.current) setFetchingComments(false);
      });
    }

    // const hasPendingApproval = post.users_approval.length > 0 && post.users_approval.some((u) => u.ip_address === null && u.id === user.id);
    // if (!fetchingPostReads && !post.hasOwnProperty("post_reads")) {
    //   if (hasPendingApproval) return;
    //   if (post.must_reply_users && post.must_reply_users.some((u) => u.id === user.id && !u.must_reply)) return;
    //   if (post.must_read_users && post.must_read_users.some((u) => u.id === user.id && !u.must_read)) return;
    //   commentActions.fetchPostRead(parseInt(post.id), (err, res) => {
    //     console.log(res);
    //     setFetchingPostReads(true);
    //     const payload = {
    //       postId: post.id,
    //       readPosts: [...res.data],
    //     };
    //     commentActions.setPostReadComments(payload, () => {
    //       if (componentIsMounted.current) setFetchingPostReads(false);
    //     });
    //   });
    // }
  }, [post]);

  return {
    comments: post && postComments[post.id] ? postComments[post.id].comments : {},
  };
};

export default useComments;
