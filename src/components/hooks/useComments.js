import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useCommentActions, useGetSlug } from "./index";

const useComments = (post) => {
  const commentActions = useCommentActions();
  const { slug } = useGetSlug();
  const postComments = useSelector((state) => state.workspaces.postComments);
  const sharedWs = useSelector((state) => state.workspaces.sharedWorkspaces);
  const workspace = useSelector((state) => state.workspaces.activeTopic);
  //const user = useSelector((state) => state.session.user);

  const [fetchingComments, setFetchingComments] = useState(false);
  //const [fetchingPostReads, setFetchingPostReads] = useState(false);

  const componentIsMounted = useRef(true);
  const workspaceRef = useRef(null);
  const sharedWsRef = useRef(null);

  useEffect(() => {
    if (postComments.hasOwnProperty(post.id)) {
      commentActions.fetchPostAndComments(post);
    }

    return () => {
      componentIsMounted.current = null;
    };
  }, []);

  useEffect(() => {
    if (workspace) workspaceRef.current = workspace;
    if (sharedWs) sharedWsRef.current = sharedWs;
  }, [workspace, sharedWs]);

  useEffect(() => {
    if (!fetchingComments && !postComments.hasOwnProperty(post.id)) {
      setFetchingComments(true);
      let url = `/v1/messages?post_id=${post.id}&skip=${0}&limit=${20}`;
      let payload = {
        url,
      };
      if (post.slug !== slug && workspaceRef.current && workspaceRef.current.sharedSlug && sharedWsRef.current) {
        payload = {
          ...payload,
          sharedPayload: { slug: workspaceRef.current.slug, token: sharedWsRef.current[workspaceRef.current.slug].access_token, is_shared: true },
        };
      }
      commentActions.fetchPostComments(payload, (err, res) => {
        if (componentIsMounted.current) setFetchingComments(false);
      });
    }
  }, [post]);

  return {
    comments: post && postComments[post.id] ? postComments[post.id].comments : {},
  };
};

export default useComments;
