import { useEffect } from "react";
import { usePostActions } from "./index";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

const useCompanyPosts = () => {
  const params = useParams();
  const actions = usePostActions();
  const user = useSelector((state) => state.session.user);
  const { flipper, next_skip, posts, filter, tag, postListTag, count, sort, search, searchResults } = useSelector((state) => state.posts.companyPosts);
  const postsLists = useSelector((state) => state.posts.postsLists);
  const unreadCounter = useSelector((state) => state.global.unreadCounter);

  const archived = useSelector((state) => state.posts.archived);
  const favourites = useSelector((state) => state.posts.favourites);
  const myPosts = useSelector((state) => state.posts.myPosts);
  const unreadPosts = useSelector((state) => state.posts.unreadPosts);
  const readPosts = useSelector((state) => state.posts.readPosts);
  const inProgress = useSelector((state) => state.posts.inProgress);
  const fetchMore = (callback) => {
    if (unreadPosts.has_more) {
      actions.fetchUnreadCompanyPosts({
        skip: unreadPosts.skip,
        limit: 25,
        filters: ["green_dot"],
      });
    }
    if (readPosts.has_more) {
      actions.fetchReadCompanyPosts({
        skip: readPosts.skip,
        limit: 25,
        filters: ["read_post"],
      });
    }
    if (filter === "in_progress") {
      let payload = {
        skip: inProgress.skip,
        limit: inProgress.limit,
        filters: ["in_progress"],
      };
      if (inProgress.has_more) {
        actions.fetchInProgressCompanyPosts(payload, callback);
      }
    } else if (filter === "archive") {
      let payload = {
        skip: archived.skip,
        limit: archived.limit,
        filters: ["post", "archived"],
      };
      if (archived.has_more) {
        actions.fetchCompanyPosts(payload, callback);
      }
    } else if (filter === "my_posts") {
      let payload = {
        skip: myPosts.skip,
        limit: myPosts.limit,
        filters: ["post", "created_by_me"],
      };
      if (myPosts.has_more) {
        actions.fetchCompanyPosts(payload, callback);
      }
    }
  };

  useEffect(() => {
    fetchMore();
    actions.fetchPostList();
    if (unreadCounter.general_post > 0) {
      actions.refetchCompanyPosts({ skip: 0, limit: unreadCounter.general_post });
    }
  }, []);

  useEffect(() => {
    if (archived.skip === 0 && archived.has_more && filter === "all") {
      actions.fetchArchivedCompanyPosts({
        skip: 0,
        limit: 25,
        filters: ["post", "archived"],
      });
    }
  }, [filter, archived]);

  useEffect(() => {
    if (favourites.skip === 0 && favourites.has_more && filter === "star") {
      actions.fetchStarCompanyPosts({
        skip: 0,
        limit: 25,
        filters: ["post", "favourites"],
      });
    }
  }, [filter, favourites]);

  useEffect(() => {
    if (myPosts.skip === 0 && myPosts.has_more && filter === "my_posts") {
      actions.fetchMyCompanyPosts({
        skip: 0,
        limit: 25,
        filters: ["post", "created_by_me"],
      });
    }
  }, [filter, myPosts]);

  useEffect(() => {
    if (inProgress.skip === 0 && inProgress.has_more && filter === "in_progress") {
      actions.fetchInProgressCompanyPosts({
        skip: 0,
        limit: 25,
        filters: ["in_progress"],
      });
    }
  }, [filter, inProgress]);

  let filteredPosts = Object.values(posts);

  if (searchResults.length > 0 && search !== "") {
    filteredPosts = filteredPosts.filter((p) => {
      return searchResults.some((s) => {
        return p.id === s.id;
      });
    });
  } else if (searchResults.length === 0 && search !== "") {
    filteredPosts = [];
  }

  filteredPosts = filteredPosts
    .filter((p) => {
      if (filter) {
        if (filter === "all") {
          return !p.hasOwnProperty("draft_type");
        } else if (filter === "inbox") {
          return !p.hasOwnProperty("draft_type") && !p.is_close;
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
        } else if (filter === "my_posts") {
          if (p.hasOwnProperty("author") && !p.hasOwnProperty("draft_type")) return p.author.id === user.id;
          else return false;
        } else if (filter === "draft") {
          return p.hasOwnProperty("draft_type");
        } else if (filter === "star") {
          return p.is_favourite && !p.hasOwnProperty("draft_type");
        } else if (filter === "archive") {
          return p.is_archived === 1 && !p.hasOwnProperty("draft_type");
        }
      } else if (tag) {
        if (tag === "is_must_reply") {
          return (p.author.id === user.id && p.is_must_reply) || (p.must_reply_users && p.must_reply_users.some((u) => u.id === user.id && !u.must_reply));
        } else if (tag === "is_must_read") {
          return (p.author.id === user.id && p.is_must_read) || (p.must_read_users && p.must_read_users.some((u) => u.id === user.id && !u.must_read));
        } else if (tag === "is_read_only") {
          return p.is_read_only && !p.is_archived && !p.hasOwnProperty("draft_type");
        } else if (tag === "is_unread") {
          return !p.hasOwnProperty("draft_type") && p.is_archived !== 1 && p.is_unread === 1;
        } else if (tag === "is_close") {
          return p.is_close && !p.hasOwnProperty("draft_type");
        } else if (!isNaN(parseInt(tag))) {
          return p.post_list_connect.length > 0 && p.post_list_connect[0].id === parseInt(tag);
        } else {
          return true;
        }
      } else if (postListTag) {
        if (!isNaN(parseInt(postListTag))) {
          return p.post_list_connect.length > 0 && parseInt(p.post_list_connect[0].id) === parseInt(postListTag);
        } else {
          return true;
        }
      } else {
        return !p.hasOwnProperty("author") || p.author.id !== user.id;
      }
    })
    .sort((a, b) => {
      return b.updated_at.timestamp > a.updated_at.timestamp ? 1 : -1;
    });

  count.is_must_reply = Object.values(posts).filter((p) => {
    return (p.author.id === user.id && p.is_must_reply) || (p.must_reply_users && p.must_reply_users.some((u) => u.id === user.id && !u.must_reply));
  }).length;
  count.is_must_read = Object.values(posts).filter((p) => {
    return (p.author.id === user.id && p.is_must_read) || (p.must_read_users && p.must_read_users.some((u) => u.id === user.id && !u.must_read));
  }).length;
  count.is_read_only = Object.values(posts).filter((p) => {
    return p.is_read_only === 1 && !p.is_archived && p.is_unread === 1 && !p.hasOwnProperty("draft_type");
  }).length;
  count.is_close = Object.values(posts).filter((p) => {
    return p.is_close && !p.hasOwnProperty("draft_type");
  }).length;

  const counters = {
    drafts: Object.values(posts).filter((p) => p.type === "draft_post").length,
  };

  return {
    archived,
    flipper,
    actions,
    fetchMore,
    posts: filteredPosts,
    filter: filter,
    tag: tag,
    postListTag: postListTag,
    sort: sort,
    post: Object.values(posts).filter((p) => p.id === parseInt(params.postId))[0],
    search: search,
    user,
    count: count,
    counters: counters,
    skip: next_skip,
    postLists: postsLists,
  };
};

export default useCompanyPosts;
