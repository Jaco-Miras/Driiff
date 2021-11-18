import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { addToWorkspacePosts } from "../../redux/actions/postActions";
import { usePostActions } from "./index";

const usePosts = () => {
  const actions = usePostActions();
  const dispatch = useDispatch();
  const params = useParams();
  const wsPosts = useSelector((state) => state.workspaces.workspacePosts);
  const flipper = useSelector((state) => state.workspaces.flipper);
  const recentPosts = useSelector((state) => state.posts.recentPosts);
  const user = useSelector((state) => state.session.user);
  const postsLists = useSelector((state) => state.posts.postsLists);
  const [fetchingPost, setFetchingPost] = useState(false);
  const activeTopic = useSelector((state) => state.workspaces.activeTopic);

  const componentIsMounted = useRef(true);

  useEffect(() => {
    return () => {
      componentIsMounted.current = null;
    };
  }, []);

  useEffect(() => {
    if (params.workspaceId !== undefined) {
      if (!wsPosts.hasOwnProperty(params.workspaceId) && !fetchingPost) {
        setFetchingPost(true);
        let cb = (err, res) => {
          if (componentIsMounted.current) {
            setFetchingPost(false);
          }

          if (err) return;
          let files = res.data.posts.map((p) => p.files);
          if (files.length) {
            files = files.flat();
          }
          actions.getTagsCount(parseInt(params.workspaceId));
          dispatch(
            addToWorkspacePosts({
              topic_id: parseInt(params.workspaceId),
              posts: res.data.posts,
              files,
              filters: {
                all: {
                  active: true,
                  skip: res.data.next_skip,
                  hasMore: res.data.total_take === res.data.posts.length,
                },
              },
            })
          );
        };

        let payload = {
          topic_id: parseInt(params.workspaceId),
        };
        actions.getPosts(payload, cb);
        actions.fetchPostList();

        // let filterCb = (err, res) => {
        //   if (componentIsMounted.current) {
        //     setFetchingPost(false);
        //   }
        //   if (err) return;
        //   let files = res.data.posts.map((p) => p.files);
        //   if (files.length) {
        //     files = files.flat();
        //   }
        //   dispatch(
        //     addToWorkspacePosts({
        //       topic_id: parseInt(params.workspaceId),
        //       posts: res.data.posts,
        //       filter: res.data.posts,
        //       files,
        //       filters: {
        //         archived: {
        //           active: false,
        //           skip: res.data.next_skip,
        //           hasMore: res.data.total_take === 25,
        //         },
        //       },
        //     })
        //   );
        // };

        // actions.getPosts(
        //   {
        //     filters: ["post", "archived"],
        //     topic_id: parseInt(params.workspaceId),
        //   },
        //   filterCb
        // );

        let unreadCb = (err, res) => {
          if (componentIsMounted.current) {
            setFetchingPost(false);
          }
          if (err) return;
          let files = res.data.posts.map((p) => p.files);
          if (files.length) {
            files = files.flat();
          }
          dispatch(
            addToWorkspacePosts({
              topic_id: parseInt(params.workspaceId),
              posts: res.data.posts,
              filter: res.data.posts,
              files,
              filters: {
                unreadPosts: {
                  active: true,
                  skip: res.data.next_skip,
                  hasMore: res.data.total_take === 25,
                },
              },
            })
          );
        };

        actions.getPosts(
          {
            filters: ["green_dot"],
            topic_id: parseInt(params.workspaceId),
            skip: 0,
            limit: 25,
          },
          unreadCb
        );
      }
    }
  }, [params]);

  let rPosts = null;
  let filteredPosts = [];
  let activeFilter = null;
  let activeTag = null;
  let activePostListTag = null;
  let activeSort = "recent";
  let post = null;
  let activeSearch = "";
  let count = {
    is_must_reply: 0,
    is_must_read: 0,
    is_read_only: 0,
    is_unread: 0,
    is_close: 0,
  };
  let counters = {
    all: 0,
    my_posts: 0,
    starred: 0,
    archived: 0,
    drafts: 0,
    new_reply: 0,
  };
  let activeFilters = null;

  if (Object.keys(recentPosts).length && recentPosts.hasOwnProperty(params.workspaceId)) {
    rPosts = recentPosts[params.workspaceId].posts;
  }

  if (Object.keys(wsPosts).length && wsPosts.hasOwnProperty(params.workspaceId)) {
    let { filter, sort, tag, postListTag, posts, search, searchResults, filters } = wsPosts[params.workspaceId];
    activeSearch = search;
    activeSort = sort;
    activeFilter = filter;
    activeFilters = filters;
    activeTag = tag;
    activePostListTag = postListTag;

    counters = {
      drafts: Object.values(posts).filter((p) => p.type === "draft_post").length,
    };

    if (posts.hasOwnProperty(params.postId)) {
      post = posts[params.postId];
    }

    filteredPosts = Object.values(posts);

    if (searchResults.length > 0 && search) {
      filteredPosts = filteredPosts.filter((p) => {
        return searchResults.some((s) => {
          return p.id === s.id;
        });
      });
    } else if (searchResults.length === 0 && search) {
      filteredPosts = [];
    }

    filteredPosts = filteredPosts
      .filter((p) => {
        if (activeFilter) {
          if (activeFilter === "all") {
            return !p.hasOwnProperty("draft_type");
          } else if (activeFilter === "inbox") {
            if (activeTopic && !activeTopic.is_active) {
              // return only post with action
              const isApprover = p.users_approval.some((ua) => ua.id === user.id);
              const hasMentioned = p.mention_ids && p.mention_ids.some((id) => user.id === id);
              const mustRead = p.must_read_users && p.must_read_users.some((u) => user.id === u.id && !u.must_read);
              const mustReply = p.must_reply_users && p.must_reply_users.some((u) => user.id === u.id && !u.must_reply);
              const showPost = hasMentioned || mustRead || mustReply || isApprover;
              return !p.hasOwnProperty("draft_type") && showPost;
            } else {
              return !p.hasOwnProperty("draft_type");
            }
          } else if (filter === "in_progress") {
            return (
              !p.hasOwnProperty("draft_type") &&
              ((p.is_must_read && p.must_read_users.length > 0 && p.must_read_users.some((u) => u.id === user.id)) ||
                (p.is_must_reply && p.must_reply_users.length > 0 && p.must_reply_users.some((u) => u.id === user.id)) ||
                (p.users_approval.length > 0 && p.users_approval.some((u) => u.id === user.id)) ||
                (p.author.id === user.id && p.is_must_read) ||
                (p.author.id === user.id && p.is_must_reply) ||
                (p.author.id === user.id && p.users_approval.length > 0))
            );
          } else if (activeFilter === "my_posts") {
            if (p.hasOwnProperty("author") && !p.hasOwnProperty("draft_type")) return p.author.id === user.id;
            else return false;
          } else if (activeFilter === "draft") {
            return p.hasOwnProperty("draft_type");
          } else if (activeFilter === "star") {
            return p.is_favourite && !p.hasOwnProperty("draft_type");
          } else if (activeFilter === "archive") {
            return p.is_archived === 1 && !p.hasOwnProperty("draft_type");
          }
        } else if (activeTag) {
          if (activeTag === "is_must_reply") {
            return (p.author.id === user.id && p.is_must_reply) || (p.must_reply_users && p.must_reply_users.some((u) => u.id === user.id && !u.must_reply));
          } else if (activeTag === "is_must_read") {
            return (p.author.id === user.id && p.is_must_read) || (p.must_read_users && p.must_read_users.some((u) => u.id === user.id && !u.must_read));
          } else if (activeTag === "is_read_only") {
            return p.is_read_only && !p.is_archived && !p.hasOwnProperty("draft_type");
          } else if (tag === "is_unread") {
            return !p.hasOwnProperty("draft_type") && p.is_archived !== 1 && p.is_unread === 1;
          } else if (tag === "is_close") {
            return p.is_close && !p.hasOwnProperty("draft_type");
          } else if (!isNaN(parseInt(activeTag))) {
            return p.post_list_connect.length > 0 && p.post_list_connect[0].id === parseInt(tag);
          } else {
            return true;
          }
        } else if (activePostListTag) {
          if (!isNaN(parseInt(activePostListTag))) {
            return p.post_list_connect.length > 0 && p.post_list_connect[0].id === parseInt(activePostListTag);
          } else {
            return true;
          }
        } else {
          return true;
        }
      })
      .sort((a, b) => {
        return b.updated_at.timestamp > a.updated_at.timestamp ? 1 : -1;
      });

    count = {
      is_must_reply: Object.values(posts).filter((p) => {
        return (p.author.id === user.id && p.is_must_reply) || (p.must_reply_users && p.must_reply_users.some((u) => u.id === user.id && !u.must_reply));
      }).length,
      is_must_read: Object.values(posts).filter((p) => {
        return (p.author.id === user.id && p.is_must_read) || (p.must_read_users && p.must_read_users.some((u) => u.id === user.id && !u.must_read));
      }).length,
      is_read_only: Object.values(posts).filter((p) => {
        return p.is_read_only && !p.is_archived && !p.is_unread === 1 && p.hasOwnProperty("draft_type");
      }).length,
      is_close: Object.values(posts).filter((p) => {
        return p.is_close && !p.hasOwnProperty("draft_type");
      }).length,
    };
  }

  return {
    flipper,
    actions,
    posts: filteredPosts,
    filter: activeFilter,
    tag: activeTag,
    postListTag: activePostListTag,
    sort: activeSort,
    post: post,
    search: activeSearch,
    user,
    recentPosts: rPosts,
    count,
    counters: counters,
    filters: activeFilters,
    postLists: postsLists,
  };
};

export default usePosts;
