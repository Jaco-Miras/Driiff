import { useEffect } from "react";
import { usePostActions } from "./index";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

const useCompanyPosts = () => {
  const params = useParams();
  const actions = usePostActions();
  const user = useSelector((state) => state.session.user);
  const { flipper, next_skip, posts, filter, tag, postListTag, sort, search, searchResults } = useSelector((state) => state.posts.companyPosts);
  const postsLists = useSelector((state) => state.posts.postsLists);
  const unreadCounter = useSelector((state) => state.global.unreadCounter);

  const archived = useSelector((state) => state.posts.archived);
  const favourites = useSelector((state) => state.posts.favourites);
  const myPosts = useSelector((state) => state.posts.myPosts);
  const unreadPosts = useSelector((state) => state.posts.unreadPosts);
  const readPosts = useSelector((state) => state.posts.readPosts);
  const fetchMore = (callback = () => {}) => {
    if (unreadPosts.has_more) {
      actions.fetchUnreadCompanyPosts(
        {
          skip: unreadPosts.skip,
          limit: 15,
          filters: ["green_dot"],
        },
        callback
      );
    }
    if (readPosts.has_more) {
      actions.fetchReadCompanyPosts(
        {
          skip: readPosts.skip,
          limit: 15,
          filters: ["read_post"],
        },
        callback
      );
    }
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
    }
  };

  useEffect(() => {
    fetchMore();
    if (unreadCounter.general_post > 0) {
      actions.refetchCompanyPosts({ skip: 0, limit: unreadCounter.general_post });
    }
  }, []);

  useEffect(() => {
    if (unreadPosts.loaded) {
      actions.fetchPostList();
    }
  }, [unreadPosts.loaded]);

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
          return p.must_reply_users && p.must_reply_users.some((u) => u.id === user.id && !u.must_reply);
        } else if (tag === "is_must_read") {
          return p.must_read_users && p.must_read_users.some((u) => u.id === user.id && !u.must_read);
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

  const counters = {
    drafts: Object.values(posts).filter((p) => p.type === "draft_post").length,
  };

  return {
    archived,
    flipper,
    actions,
    fetchMore,
    posts: filteredPosts,
    // posts: filteredPosts.filter((p) => {
    //   const hasCompanyAsRecipient = p.recipients.find((r) => r.main_department === true);
    //   if (hasCompanyAsRecipient) {
    //     return true;
    //   } else {
    //     const allParticipantIds = p.recipients
    //       .map((r) => {
    //         if (r.type === "USER") {
    //           return [r.type_id];
    //         } else return r.participant_ids;
    //       })
    //       .flat();
    //     return allParticipantIds.some((id) => id === user.id) || p.author.id === user.id;
    //   }
    // }),
    filter: filter,
    tag: tag,
    postListTag: postListTag,
    sort: sort,
    post: Object.values(posts).filter((p) => p.id === parseInt(params.postId))[0],
    search: search,
    user,
    //count: count,
    counters: counters,
    skip: next_skip,
    postLists: postsLists,
    showLoader: !unreadPosts.loaded,
  };
};

export default useCompanyPosts;
