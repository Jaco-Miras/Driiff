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
  const showUnread = useSelector((state) => state.posts.showUnread);

  const componentIsMounted = useRef(true);

  useEffect(() => {
    if (params.hasOwnProperty("workspaceId")) {
      actions.getUnreadWsPostsCount({ topic_id: params.workspaceId });
    }
    return () => {
      actions.setShowUnreadPosts(true);
      componentIsMounted.current = null;
    };
  }, []);

  useEffect(() => {
    if (params.hasOwnProperty("workspaceId")) {
      actions.getRecentPosts(params.workspaceId);
    }
  }, [params.workspaceId]);

  useEffect(() => {
    if (params.workspaceId !== undefined) {
      if (!wsPosts.hasOwnProperty(params.workspaceId) && !fetchingPost && !isNaN(parseInt(params.workspaceId))) {
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
          //actions.getTagsCount(parseInt(params.workspaceId));
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
                  skip: res.data.next_skip,
                  hasMore: res.data.total_take === 15,
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
            limit: 15,
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
            return !p.hasOwnProperty("draft_type") && !p.is_close;
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
            return !p.is_close && p.must_reply_users && p.must_reply_users.some((u) => u.id === user.id && !u.must_reply);
            // return (p.author.id === user.id && p.is_must_reply) || (p.must_reply_users && p.must_reply_users.some((u) => u.id === user.id && !u.must_reply));
          } else if (activeTag === "is_must_read") {
            return !p.is_close && p.must_read_users && p.must_read_users.some((u) => u.id === user.id && !u.must_read);
            // return (p.author.id === user.id && p.is_must_read) || (p.must_read_users && p.must_read_users.some((u) => u.id === user.id && !u.must_read));
          } else if (activeTag === "is_read_only") {
            return p.is_read_only && !p.hasOwnProperty("draft_type");
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
      })
      .sort((x, y) => {
        return x.is_favourite === y.is_favourite ? 0 : x.is_favourite ? -1 : 1;
      });

    // count = {
    //   is_must_reply: wsPosts.categories.mustReply.count,
    //   is_must_read: wsPosts.categories.mustRead.count,
    //   is_read_only: wsPosts.categories.noReplies.count,
    //   is_close: wsPosts.categories.closedPost.count,
    // };
  }

  return {
    flipper,
    actions,
    posts: filteredPosts.filter((p) => {
      const hasCompanyAsRecipient = p.recipients.find((r) => r.main_department === true);
      if (hasCompanyAsRecipient) {
        return true;
      } else {
        const allParticipantIds = p.recipients
          .map((r) => {
            if (r.type === "USER") {
              return [r.type_id];
            } else return r.participant_ids;
          })
          .flat();
        return allParticipantIds.some((id) => id === user.id) || p.author.id === user.id;
      }
    }),
    filter: activeFilter,
    tag: activeTag,
    postListTag: activePostListTag,
    sort: activeSort,
    post: post,
    search: activeSearch,
    user,
    recentPosts: rPosts,
    //count,
    counters: counters,
    filters: activeFilters,
    postLists: postsLists,
    showLoader: !wsPosts.hasOwnProperty(params.workspaceId),
    showUnread: showUnread,
  };
};

export default usePosts;
