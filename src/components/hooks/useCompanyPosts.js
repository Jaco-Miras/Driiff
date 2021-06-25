import { useEffect } from "react";
import { usePostActions } from "./index";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

let init = false;

const useCompanyPosts = () => {
  const params = useParams();
  const actions = usePostActions();
  const user = useSelector((state) => state.session.user);
  const { flipper, limit, next_skip, has_more, posts, filter, tag, postListTag, count, sort, search, searchResults } = useSelector((state) => state.posts.companyPosts);
  const postsLists = useSelector((state) => state.posts.postsLists);

  const archived = useSelector((state) => state.posts.archived);
  const favourites = useSelector((state) => state.posts.favourites);
  const myPosts = useSelector((state) => state.posts.myPosts);
  const unreadPosts = useSelector((state) => state.posts.unreadPosts);
  //const readPosts = useSelector((state) => state.posts.readPosts);
  const fetchMore = (callback) => {
    if (unreadPosts.has_more) {
      actions.fetchUnreadCompanyPosts({
        skip: unreadPosts.skip,
        limit: 25,
        filters: ["green_dot"],
      });
    }
    // if (readPosts.has_more) {
    //   actions.fetchReadCompanyPosts({
    //     skip: readPosts.skip,
    //     limit: 25,
    //     filters: ["read"],
    //   });
    // }
    if (filter === "archive") {
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
    } else {
      let payload = {
        skip: next_skip,
        limit: limit,
      };
      if (has_more) {
        actions.fetchCompanyPosts(payload, callback);
      }
      // let payload = {
      //   skip: next_skip,
      //   limit: limit,
      //   filters: ["read"],
      // };
      // if (has_more) {
      //   actions.fetchReadCompanyPosts(payload, callback);
      // }
    }
  };

  useEffect(() => {
    if (!init) {
      init = true;
      if (params.postId) {
        actions.fetchPostDetail({ post_id: parseInt(params.postId) });
      }
      fetchMore();
      actions.fetchPostList();

      actions.fetchUnreadCompanyPosts({
        skip: 0,
        limit: 25,
        filters: ["green_dot"],
      });
    }
  }, []);

  useEffect(() => {
    if (archived.skip === 0 && filter === "all") {
      actions.fetchCompanyPosts({
        skip: 0,
        limit: 25,
        filters: ["post", "archived"],
      });
    }
  }, [filter, archived]);

  useEffect(() => {
    if (favourites.skip === 0 && filter === "star") {
      actions.fetchCompanyPosts({
        skip: 0,
        limit: 25,
        filters: ["post", "favourites"],
      });
    }
  }, [filter, favourites]);

  useEffect(() => {
    if (myPosts.skip === 0 && filter === "my_posts") {
      actions.fetchCompanyPosts({
        skip: 0,
        limit: 25,
        filters: ["post", "created_by_me"],
      });
    }
  }, [filter, myPosts]);

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
          return (p.is_must_reply && !p.is_archived && p.required_users && p.required_users.some((u) => u.id === user.id && !u.must_reply) && !p.hasOwnProperty("draft_type")) || (p.author.id === user.id && p.is_must_reply);
        } else if (tag === "is_must_read") {
          return (p.is_must_read && !p.is_archived && p.required_users && p.required_users.some((u) => u.id === user.id && !u.must_read) && !p.hasOwnProperty("draft_type")) || (p.author.id === user.id && p.is_must_read);
        } else if (tag === "is_read_only") {
          return p.is_read_only && !p.is_archived && !p.hasOwnProperty("draft_type");
        } else if (tag === "is_unread") {
          return (p.is_unread && !p.hasOwnProperty("draft_type")) || (p.unread_count > 0 && !p.hasOwnProperty("draft_type"));
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
    return (p.is_must_reply && !p.is_archived && p.required_users && p.required_users.some((u) => u.id === user.id && !u.must_reply) && !p.hasOwnProperty("draft_type")) || (p.author.id === user.id && p.is_must_reply);
  }).length;
  count.is_must_read = Object.values(posts).filter((p) => {
    return (p.is_must_read && !p.is_archived && p.required_users && p.required_users.some((u) => u.id === user.id && !u.must_read) && !p.hasOwnProperty("draft_type")) || (p.author.id === user.id && p.is_must_read);
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
