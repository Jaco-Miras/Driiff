import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { addToWorkspacePosts } from "../../redux/actions/postActions";
import { usePostActions } from "./index";

const usePosts = () => {
  const actions = usePostActions();
  const dispatch = useDispatch();
  const params = useParams();
  const { flipper, workspacePosts: wsPosts } = useSelector((state) => state.workspaces);
  const recentPosts = useSelector((state) => state.posts.recentPosts);
  const user = useSelector((state) => state.session.user);
  const [fetchingPost, setFetchingPost] = useState(false);

  useEffect(() => {
    if (params.workspaceId !== undefined) {
      //actions.getRecentPosts(params.workspaceId);
      if (!wsPosts.hasOwnProperty(params.workspaceId) && !fetchingPost) {
        setFetchingPost(true);
        if (params.postId) {
          actions.fetchPostDetail({post_id: parseInt(params.postId)})
        }
        let cb = (err, res) => {
          setFetchingPost(false);
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
                  hasMore: res.data.total_take === res.data.posts.length
                }
              }
            })
          );
        };

        let payload = {
          topic_id: parseInt(params.workspaceId),
        };
        actions.getPosts(payload, cb);

        let filterCb = (err, res) => {
          setFetchingPost(false);
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
                archived: {
                  active: false,
                  skip: res.data.next_skip,
                  hasMore: res.data.total_take === res.data.posts.length
                }
              }
            })
          );
        };

        actions.getPosts(
          {
            filters: ["post", "archived"],
            topic_id: parseInt(params.workspaceId),
          },
          filterCb
        );
      }
    }
  }, [params]);

  let rPosts = null;
  let filteredPosts = [];
  //let posts = null;
  let activeFilter = null;
  let tag = null;
  let activeSort = "recent";
  let post = null;
  let activeSearch = "";
  let count = {
    is_must_reply: 0,
    is_must_read: 0,
    is_read_only: 0,
  };
  let counters = {
    all: 0,
    my_posts: 0,
    starred: 0,
    archived: 0,
    drafts: 0,
    new_reply: 0
  };
  let activeFilters = null;

  if (Object.keys(recentPosts).length && recentPosts.hasOwnProperty(params.workspaceId)) {
    rPosts = recentPosts[params.workspaceId].posts;
  }

  if (Object.keys(wsPosts).length && wsPosts.hasOwnProperty(params.workspaceId)) {
    let { filter, sort, tag, posts, search, searchResults, count, filters } = wsPosts[params.workspaceId];
    activeSearch = search;
    activeSort = sort;
    activeFilter = filter;
    activeFilters = filters;
    counters = {
      all: Object.values(posts).filter((p) => !(p.hasOwnProperty("draft_type") || p.is_archived === 1 || p.author.id === user.id) || p.unread_reply_ids.length > 0).length,
      my_posts: Object.values(posts).filter((p) => p.author && p.author.id === user.id).length,
      starred: Object.values(posts).filter((p) => p.is_favourite).length,
      archived: Object.values(posts).filter((p) => p.is_archived).length,
      drafts: Object.values(posts).filter((p) => p.type === "draft_post").length,
      new_reply: Object.values(posts).filter((p) => p.unread_reply_ids.length > 0).map((p) => p.unread_reply_ids).flat().length,
    };

    if (posts.hasOwnProperty(params.postId)) {
      post = { ...posts[params.postId] };
    }

    filteredPosts = Object.values(posts)

    if (searchResults.length > 0 && search) {
      filteredPosts = filteredPosts.filter((p) => {
        return searchResults.some((s) => {
          return p.id === s.id;
        });
      });
    } else if (searchResults.length === 0 && search) {
      filteredPosts = [];
    }

    if (filter || tag) {
      filteredPosts.filter((p) => {
          if (filter) {
            if (filter === "all") {
              if (search !== "") {
                return true;
              } else {
                return !(p.hasOwnProperty("draft_type") || p.is_archived === 1 || p.author.id === user.id) || p.unread_reply_ids.length > 0;
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
            } else if (filter === "new_reply") {
              return p.unread_reply_ids.length > 0;
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
          }else {
            return true;
          }
        })
        .sort((a, b) => {
          if (sort === "favorite") {
            return a.is_favourite === b.is_favourite ? 0 : a.is_favourite ? -1 : 1;
          } else if (sort === "unread") {
            return a.is_unread === b.is_unread ? 0 : a.post_unread === 1 ? 1 : -1;
          } else {
            return b.updated_at.timestamp > a.updated_at.timestamp ? 1 : -1;
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
    } 
    // else {
    //   let filteredPosts = Object.values(wsPosts[params.workspaceId].posts);
    //   if (searchResults.length && search) {
    //     filteredPosts = filteredPosts.filter((p) => {
    //       return searchResults.some((s) => {
    //         return p.id === s.id;
    //       });
    //     })
    //       .filter((p) => {
    //         return !p.hasOwnProperty("draft_type") && p.is_archived === 0;
    //       })
    //       .sort((a, b) => {
    //         if (sort === "favorite") {
    //           return a.is_favourite === b.is_favourite ? 0 : a.is_favourite ? -1 : 1;
    //         } else if (sort === "unread") {
    //           return a.is_unread === b.is_unread ? 0 : a.post_unread === 1 ? 1 : -1;
    //         } else {
    //           return b.created_at.timestamp > a.created_at.timestamp ? 1 : -1;
    //         }
    //       });
    //   } else if (searchResults.length === 0 && search) {
    //     filteredPosts = [];
    //   } else {
    //     filteredPosts = filteredPosts.filter((p) => {
    //       return !p.hasOwnProperty("draft_type") && p.is_archived === 0;
    //     })
    //       .sort((a, b) => {
    //         if (sort === "favorite") {
    //           return a.is_favourite === b.is_favourite ? 0 : a.is_favourite ? -1 : 1;
    //         } else if (sort === "unread") {
    //           return a.is_unread === b.is_unread ? 0 : a.post_unread === 1 ? 1 : -1;
    //         } else {
    //           return b.created_at.timestamp > a.created_at.timestamp ? 1 : -1;
    //         }
    //       });
    //   }
    // }
  }

  return {
    flipper,
    actions,
    posts: filteredPosts,
    filter: activeFilter,
    tag: tag,
    sort: activeSort,
    post: post,
    search: activeSearch,
    user,
    recentPosts: rPosts,
    count: count,
    counters: counters,
    filters: activeFilters,
  };
};

export default usePosts;
