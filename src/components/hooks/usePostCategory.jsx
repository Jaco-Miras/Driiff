import { useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getCompanyPostCategoryCounter, getWorkspacePostCategoryCounter, getCompanyPostsByCategory, getWorkspacePostsByCategory, updatePostCategory, addToWorkspacePosts } from "../../redux/actions/postActions";

const usePostCategory = (props) => {
  const dispatch = useDispatch();
  const params = useParams();
  const fetchingWsCategoriesRef = useRef(false);
  const fetchingWsPostsRef = useRef(false);
  const tag = useSelector((state) => state.posts.companyPosts.tag);
  const categoryCountLoaded = useSelector((state) => state.posts.categoryCountLoaded);
  const mustRead = useSelector((state) => state.posts.mustRead);
  const mustReply = useSelector((state) => state.posts.mustReply);
  const noReplies = useSelector((state) => state.posts.noReplies);
  const closedPost = useSelector((state) => state.posts.closedPost);
  const workspacePosts = useSelector((state) => state.workspaces.workspacePosts);
  const workspace = useSelector((state) => state.workspaces.activeTopic);
  const sharedWs = useSelector((state) => state.workspaces.sharedWorkspaces);

  let wsPosts = workspacePosts[params.workspaceId];
  if (workspace && workspace.sharedSlug) {
    wsPosts = workspacePosts[`${workspace.id}-${workspace.slug}`];
  }

  const workspaceRef = useRef(null);
  const sharedWsRef = useRef(null);

  useEffect(() => {
    if (workspace) workspaceRef.current = workspace;
    if (sharedWs) sharedWsRef.current = sharedWs;
  }, [workspace, sharedWs]);

  const loadMoreCompany = (callback = () => {}) => {
    if (tag) {
      if (tag === "is_must_reply" && mustReply.has_more) {
        let payload = {
          skip: mustReply.skip,
          limit: mustReply.limit,
          filters: ["must_reply"],
        };
        dispatch(
          getCompanyPostsByCategory(payload, (err, res) => {
            if (callback) callback();
            if (err) return;
            dispatch(
              updatePostCategory({
                mode: "mustReply",
                has_more: res.data.total_take === mustReply.limit,
                skip: res.data.next_skip,
              })
            );
          })
        );
      } else if (tag === "is_must_read" && mustRead.has_more) {
        let payload = {
          skip: mustRead.skip,
          limit: mustRead.limit,
          filters: ["must_read"],
        };
        dispatch(
          getCompanyPostsByCategory(payload, (err, res) => {
            if (callback) callback();
            if (err) return;
            dispatch(
              updatePostCategory({
                mode: "mustRead",
                has_more: res.data.total_take === mustRead.limit,
                skip: res.data.next_skip,
              })
            );
          })
        );
      } else if (tag === "is_read_only" && noReplies.has_more) {
        let payload = {
          skip: noReplies.skip,
          limit: noReplies.limit,
          filters: ["no_replies"],
        };
        dispatch(
          getCompanyPostsByCategory(payload, (err, res) => {
            if (callback) callback();
            if (err) return;
            dispatch(
              updatePostCategory({
                mode: "noReplies",
                has_more: res.data.total_take === noReplies.limit,
                skip: res.data.next_skip,
              })
            );
          })
        );
      } else if (tag === "is_close" && closedPost.has_more) {
        let payload = {
          skip: closedPost.skip,
          limit: closedPost.limit,
          filters: ["close_post"],
        };
        dispatch(
          getCompanyPostsByCategory(payload, (err, res) => {
            if (callback) callback();
            if (err) return;
            dispatch(
              updatePostCategory({
                mode: "closedPost",
                has_more: res.data.total_take === closedPost.limit,
                skip: res.data.next_skip,
              })
            );
          })
        );
      } else {
        if (callback) callback();
      }
    }
  };

  const loadMoreWorkspaceCategory = (callback = () => {}) => {
    let sharedPayload = null;
    if (workspaceRef.current && workspaceRef.current.sharedSlug && sharedWsRef.current) {
      sharedPayload = { slug: workspaceRef.current.slug, token: sharedWsRef.current[workspaceRef.current.slug].access_token, is_shared: true };
    }
    if (wsPosts && wsPosts.tag && wsPosts.categories) {
      if (wsPosts.tag === "is_must_reply" && wsPosts.categories.mustReply.has_more) {
        fetchingWsPostsRef.current = true;
        let payload = {
          topic_id: params.workspaceId,
          skip: mustReply.skip,
          limit: mustReply.limit,
          filters: ["must_reply"],
          sharedPayload: sharedPayload,
        };
        dispatch(
          getWorkspacePostsByCategory(payload, (err, res) => {
            fetchingWsPostsRef.current = false;
            if (callback) callback();
            if (err) return;
            dispatch(
              addToWorkspacePosts({
                slug: res.slug,
                isSharedSlug: res.isSharedSlug,
                topic_id: parseInt(params.workspaceId),
                posts: res.data.posts,
                category: {
                  mustReply: {
                    has_more: wsPosts.categories.mustReply.limit === res.data.total_take,
                    skip: res.data.next_skip,
                  },
                },
              })
            );
          })
        );
      } else if (wsPosts.tag === "is_must_read" && wsPosts.categories.mustRead.has_more) {
        fetchingWsPostsRef.current = true;
        let payload = {
          topic_id: params.workspaceId,
          skip: mustRead.skip,
          limit: mustRead.limit,
          filters: ["must_read"],
          sharedPayload: sharedPayload,
        };
        dispatch(
          getWorkspacePostsByCategory(payload, (err, res) => {
            fetchingWsPostsRef.current = false;
            if (callback) callback();
            if (err) return;
            dispatch(
              addToWorkspacePosts({
                slug: res.slug,
                isSharedSlug: res.isSharedSlug,
                topic_id: parseInt(params.workspaceId),
                posts: res.data.posts,
                category: {
                  mustRead: {
                    has_more: wsPosts.categories.mustRead.limit === res.data.total_take,
                    skip: res.data.next_skip,
                  },
                },
              })
            );
          })
        );
      } else if (wsPosts.tag === "is_read_only" && wsPosts.categories.noReplies.has_more) {
        fetchingWsPostsRef.current = true;
        let payload = {
          topic_id: params.workspaceId,
          skip: noReplies.skip,
          limit: noReplies.limit,
          filters: ["no_replies"],
          sharedPayload: sharedPayload,
        };
        dispatch(
          getWorkspacePostsByCategory(payload, (err, res) => {
            fetchingWsPostsRef.current = false;
            if (callback) callback();
            if (err) return;
            dispatch(
              addToWorkspacePosts({
                slug: res.slug,
                isSharedSlug: res.isSharedSlug,
                topic_id: parseInt(params.workspaceId),
                posts: res.data.posts,
                category: {
                  noReplies: {
                    has_more: wsPosts.categories.noReplies.limit === res.data.total_take,
                    skip: res.data.next_skip,
                  },
                },
              })
            );
          })
        );
      } else if (wsPosts.tag === "is_close" && wsPosts.categories.closedPost.has_more) {
        fetchingWsPostsRef.current = true;
        let payload = {
          topic_id: params.workspaceId,
          skip: closedPost.skip,
          limit: closedPost.limit,
          filters: ["close_post"],
          sharedPayload: sharedPayload,
        };
        dispatch(
          getWorkspacePostsByCategory(payload, (err, res) => {
            fetchingWsPostsRef.current = false;
            if (callback) callback();
            if (err) return;
            dispatch(
              addToWorkspacePosts({
                slug: res.slug,
                isSharedSlug: res.isSharedSlug,
                topic_id: parseInt(params.workspaceId),
                posts: res.data.posts,
                category: {
                  closedPost: {
                    has_more: wsPosts.categories.closedPost.limit === res.data.total_take,
                    skip: res.data.next_skip,
                  },
                },
              })
            );
          })
        );
      } else {
        if (callback) callback();
      }
    }
  };

  useEffect(() => {
    if (!categoryCountLoaded) {
      dispatch(getCompanyPostCategoryCounter());
    }
  }, []);

  useEffect(() => {
    let sharedPayload = null;
    if (workspaceRef.current && workspaceRef.current.sharedSlug && sharedWsRef.current) {
      sharedPayload = { slug: workspaceRef.current.slug, token: sharedWsRef.current[workspaceRef.current.slug].access_token, is_shared: true };
    }
    if (wsPosts && !wsPosts.categoriesLoaded && fetchingWsCategoriesRef.current === false) {
      fetchingWsCategoriesRef.current = true;
      let payload = {
        topic_id: params.workspaceId,
        sharedPayload: sharedPayload,
      };
      dispatch(
        getWorkspacePostCategoryCounter(payload, (err, res) => {
          fetchingWsCategoriesRef.current = false;
          if (err) return;
          dispatch(
            addToWorkspacePosts({
              slug: res.slug,
              isSharedSlug: res.isSharedSlug,
              topic_id: parseInt(params.workspaceId),
              posts: [],
              categories: {
                mustRead: {
                  count: res.data.must_read,
                  has_more: true,
                  limit: 15,
                  skip: 0,
                },
                mustReply: {
                  count: res.data.must_reply,
                  has_more: true,
                  limit: 15,
                  skip: 0,
                },
                noReplies: {
                  count: res.data.no_replies,
                  has_more: true,
                  limit: 15,
                  skip: 0,
                },
                closedPost: {
                  count: res.data.closed_post,
                  has_more: true,
                  limit: 15,
                  skip: 0,
                },
              },
            })
          );
        })
      );
    }
    if (wsPosts && wsPosts.tag && fetchingWsPostsRef.current === false) {
      loadMoreWorkspaceCategory();
    }
  }, [wsPosts]);

  useEffect(() => {
    if (tag) loadMoreCompany();
  }, [tag]);

  return {
    loadMoreCompany: loadMoreCompany,
    loadMoreWorkspaceCategory: loadMoreWorkspaceCategory,
    count: {
      is_must_read: !params.hasOwnProperty("workspaceId") ? mustRead.count : wsPosts ? wsPosts.categories.mustRead.count : 0,
      is_must_reply: !params.hasOwnProperty("workspaceId") ? mustReply.count : wsPosts ? wsPosts.categories.mustReply.count : 0,
      is_read_only: !params.hasOwnProperty("workspaceId") ? noReplies.count : wsPosts ? wsPosts.categories.noReplies.count : 0,
      is_close: !params.hasOwnProperty("workspaceId") ? closedPost.count : wsPosts ? wsPosts.categories.closedPost.count : 0,
    },
  };
};

export default usePostCategory;
