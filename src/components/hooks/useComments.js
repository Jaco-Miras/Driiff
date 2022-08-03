import { useParams, useHistory } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useCommentActions } from "./index";

const useComments = (post) => {
  const commentActions = useCommentActions();
  const params = useParams();
  const history = useHistory();
  const postComments = useSelector((state) => state.workspaces.postComments);
  const sharedWs = useSelector((state) => state.workspaces.sharedWorkspaces);
  const workspace = useSelector((state) => state.workspaces.activeTopic);
  //const user = useSelector((state) => state.session.user);

  const [fetchingComments, setFetchingComments] = useState(false);
  //const [fetchingPostReads, setFetchingPostReads] = useState(false);

  const componentIsMounted = useRef(true);
  const workspaceRef = useRef(null);
  const sharedWsRef = useRef(null);
  let onSharedWs = (params.workspaceId && history.location.pathname.startsWith("/shared-hub")) || (post.sharedSlug && post.slug);
  let postKey = post.id;
  if (onSharedWs) {
    postKey = post.code;
  }

  useEffect(() => {
    if (postComments.hasOwnProperty(postKey)) {
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
    if (!fetchingComments && !postComments.hasOwnProperty(postKey)) {
      setFetchingComments(true);
      let url = `/v1/messages?post_id=${post.id}&skip=${0}&limit=${20}`;
      let payload = {
        url,
      };
      if (post.slug && post.sharedSlug && sharedWsRef.current[post.slug]) {
        payload = {
          ...payload,
          sharedPayload: { slug: post.slug, token: sharedWsRef.current[post.slug].access_token, is_shared: true },
        };
      }
      commentActions.fetchPostComments(payload, (err, res) => {
        if (componentIsMounted.current) setFetchingComments(false);
      });
    }
  }, [post]);

  return {
    comments: post && postComments[postKey] ? postComments[postKey].comments : {},
  };
};

export default useComments;
