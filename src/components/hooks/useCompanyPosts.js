import { useEffect } from "react";
import { usePostActions } from "./index";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

let init = false;

const useCompanyPosts = () => {
  const params = useParams();
  const actions = usePostActions();
  const user = useSelector((state) => state.session.user);
  const { flipper, limit, next_skip, has_more, posts, filter, tag, count, sort, search, searchResults } = useSelector((state) => state.posts.companyPosts);
  const archived = useSelector((state) => state.posts.archived);
  const fetchMore = (callback) => {
    if (filter === "archive") {
      let payload = {
        skip: archived.skip,
        limit: archived.limit,
        filters: ["post", "archived"],
      };
      if (archived.has_more) {
        actions.fetchCompanyPosts(payload, callback);
      }
    } else {
      let payload = {
        skip: next_skip,
        limit: limit,
      };
      if (has_more) {
        actions.fetchCompanyPosts(payload, callback);
      }
    }
  };

  useEffect(() => {
    if (!init) {
      init = true;
      if (params.postId) {
        actions.fetchPostDetail({ post_id: parseInt(params.postId) });
      }
      fetchMore();

      // actions.fetchCompanyPosts({
      //   skip: 0,
      //   limit: 25,
      //   filters: ["post", "archived"],
      // });
      actions.fetchUnreadCompanyPosts({
        skip: 0,
        limit: 100,
        filters: ["green_dot"],
      });
    }
  }, []);

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
          return true;
        } else if (filter === "inbox") {
          if (search !== "") {
            return true;
          } else {
            return !(p.hasOwnProperty("draft_type") || p.is_archived === 1 || p.author.id === user.id) || (p.author.id === user.id && p.reply_count > 0 && p.is_archived !== 1);
          }
        } else if (filter === "my_posts") {
          if (p.hasOwnProperty("author")) return p.author.id === user.id;
          else return false;
        } else if (filter === "draft") {
          return p.hasOwnProperty("draft_type");
        } else if (filter === "star") {
          return p.is_favourite;
        } else if (filter === "archive") {
          return p.is_archived === 1;
        }
      } else if (tag) {
        if (tag === "is_must_reply") {
          return p.is_must_reply && !p.is_archived && !p.hasOwnProperty("draft_type");
        } else if (tag === "is_must_read") {
          return p.is_must_read && !p.is_archived && !p.hasOwnProperty("draft_type");
        } else if (tag === "is_read_only") {
          return p.is_read_only && !p.is_archived && !p.hasOwnProperty("draft_type");
        } else if (tag === "is_unread") {
          return (p.is_unread && !p.hasOwnProperty("draft_type")) || (p.unread_count > 0 && !p.hasOwnProperty("draft_type"));
        } else if (tag === "is_close") {
          return p.is_close && !p.hasOwnProperty("draft_type");
        } else {
          return true;
        }
      } else {
        return !p.hasOwnProperty("author") || p.author.id !== user.id;
      }
    })
    .sort((a, b) => {
      if (sort === "favorite") {
        return a.is_favourite === b.is_favourite ? 0 : a.is_favourite ? -1 : 1;
      } else if (sort === "unread") {
        if (a.unread_count > 0) {
          return -1;
        } else {
          return a.is_unread === b.is_unread ? 0 : a.post_unread === 1 ? 1 : -1;
        }
      } else {
        return b.updated_at.timestamp > a.updated_at.timestamp ? 1 : -1;
      }
    });
  //if (count) {
  // count.is_must_reply = Object.values(posts).filter((p) => {
  //   return p.is_must_reply && p.is_must_reply && !p.is_archived && !p.hasOwnProperty("draft_type");
  // }).length;
  // count.is_must_read = Object.values(posts).filter((p) => {
  //   return p.is_must_read && p.is_must_read && !p.is_archived && !p.hasOwnProperty("draft_type");
  // }).length;
  // count.is_read_only = Object.values(posts).filter((p) => {
  //   return p.is_read_only && !p.is_archived && !p.hasOwnProperty("draft_type");
  // }).length;
  // count.is_unread = Object.values(posts).filter((p) => {
  //   return (p.is_unread && !p.hasOwnProperty("draft_type")) || (p.unread_count > 0 && !p.hasOwnProperty("draft_type"));
  // }).length;
  //}

  count.is_must_reply = Object.values(posts).filter((p) => {
    return p.is_must_reply && p.is_must_reply && !p.is_archived && !p.hasOwnProperty("draft_type");
  }).length;
  count.is_must_read = Object.values(posts).filter((p) => {
    return p.is_must_read && p.is_must_read && !p.is_archived && !p.hasOwnProperty("draft_type");
  }).length;
  count.is_read_only = Object.values(posts).filter((p) => {
    return p.is_read_only === 1 && !p.is_archived && !p.hasOwnProperty("draft_type");
  }).length;
  count.is_unread = Object.values(posts).filter((p) => {
    return (p.is_unread && !p.hasOwnProperty("draft_type")) || (p.unread_count > 0 && !p.hasOwnProperty("draft_type"));
  }).length;
  count.is_close = Object.values(posts).filter((p) => {
    return p.is_close && !p.hasOwnProperty("draft_type");
  }).length;

  const counters = {
    // all: Object.values(posts).filter((p) => !(p.hasOwnProperty("draft_type") || p.is_archived === 1 || p.author.id === user.id)).length,
    // my_posts: Object.values(posts).filter((p) => p.author && p.author.id === user.id).length,
    // starred: Object.values(posts).filter((p) => p.is_favourite).length,
    // archived: Object.values(posts).filter((p) => p.is_archived).length,
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
    sort: sort,
    post: Object.values(posts).filter((p) => p.id === parseInt(params.postId))[0],
    search: search,
    user,
    count: count,
    counters: counters,
    skip: next_skip,
  };
};

export default useCompanyPosts;
