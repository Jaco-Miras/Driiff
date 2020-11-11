import { useEffect, useState } from "react";
import { usePostActions } from "./index";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

let init = false;

const useCompanyPosts = () => {

  const params = useParams();
  const actions = usePostActions();
  const user = useSelector((state) => state.session.user);
  const { flipper, limit, next_skip, has_more, posts, filter, tag, count, sort, search, searchResults } = useSelector((state) => state.posts.companyPosts);
  const [post, setPost] = useState(null);

  const fetchMore = (callback) => {
    if (has_more) {
      actions.fetchCompanyPosts({
        skip: next_skip,
        limit: limit
      }, callback)
    }
  }

  useEffect(() => {
    if (params.postId && posts[params.postId]) {
      setPost(posts[params.postId]);
    } else {
      setPost(null);
    }
  }, [params, posts]);

  useEffect(() => {
    if (!init) {
      init = true;
      fetchMore();

      actions.fetchCompanyPosts(
        {
          filters: ["post", "archived"],
        });
    }
  }, []);

  let filteredPosts = Object.values(posts)
    .filter((p) => {
      if (filter) {
        if (filter === "my_posts") {
          if (p.hasOwnProperty("author")) return p.author.id === user.id;
          else return false;
        } else if (filter === "draft") {
          return p.hasOwnProperty("draft_type");
        } else if (filter === "star") {
          return p.is_favourite;
        } else if (filter === "archive") {
          return p.is_archived === 1;
        } else if (filter === "all") {
          return !p.is_archived;
        }
      } else if (tag) {
        if (tag === "is_must_reply") {
          return p.is_must_reply && !p.is_archived && !p.hasOwnProperty("draft_type");
        } else if (tag === "is_must_read") {
          return p.is_must_read && !p.is_archived && !p.hasOwnProperty("draft_type");
        } else if (tag === "is_read_only") {
          return p.is_read_only && !p.is_archived && !p.hasOwnProperty("draft_type");
        } else {
          return true;
        }
      } else {
        return true;
      }
    })
    .sort((a, b) => {
      if (sort === "favorite") {
        return a.is_favourite === b.is_favourite ? 0 : a.is_favourite ? -1 : 1;
      } else {
        return b.updated_at.timestamp - a.updated_at.timestamp;
        return b.created_at.timestamp - a.created_at.timestamp;
      }
    });
  if (count) {
    count.is_must_reply = Object.values(posts).filter((p) => {
      return p.is_must_reply && p.is_must_reply && !p.is_archived && !p.hasOwnProperty("draft_type");
    }).length;
    count.is_must_read = Object.values(posts).filter((p) => {
      return p.is_must_read && p.is_must_read && !p.is_archived && !p.hasOwnProperty("draft_type");
    }).length;
    count.is_read_only = Object.values(posts).filter((p) => {
      return p.is_read_only && !p.is_archived && !p.hasOwnProperty("draft_type");
    }).length;
  }
  if (searchResults.length > 0 && search) {
    filteredPosts = filteredPosts.filter((p) => {
      return searchResults.some((s) => {
        return p.id === s.id;
      });
    });
  } else if (searchResults.length === 0 && search) {
    filteredPosts = [];
  }

  count.is_must_reply = Object.values(posts).filter((p) => {
    return p.is_must_reply && p.is_must_reply && !p.is_archived && !p.hasOwnProperty("draft_type");
  }).length;
  count.is_must_read = Object.values(posts).filter((p) => {
    return p.is_must_read && p.is_must_read && !p.is_archived && !p.hasOwnProperty("draft_type");
  }).length;
  count.is_read_only = Object.values(posts).filter((p) => {
    return p.is_read_only === 1 && !p.is_archived && !p.hasOwnProperty("draft_type");
  }).length;

  let counters = {
    all: Object.values(posts).length,
    my_posts: Object.values(posts).filter((p) => p.author && p.author.id === user.id).length,
    starred: Object.values(posts).filter((p) => p.is_favourite).length,
    archived: Object.values(posts).filter((p) => p.is_archived).length,
    drafts: Object.values(posts).filter((p) => p.type === "draft_post").length,
  };

  return {
    flipper,
    actions,
    fetchMore,
    posts: filteredPosts,
    filter: filter,
    tag: tag,
    sort: sort,
    post: post,
    search: search,
    user,
    count: count,
    counters: counters,
  };
};

export default useCompanyPosts;
