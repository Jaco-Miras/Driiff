import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCompanyPostCategoryCounter, getWorkspacePostCategoryCounter, getCompanyPostsByCategory, updatePostCategory } from "../../redux/actions/postActions";

const usePostCategory = (props) => {
  const dispatch = useDispatch();
  const tag = useSelector((state) => state.posts.companyPosts.tag);
  const categoryCountLoaded = useSelector((state) => state.posts.categoryCountLoaded);
  const mustRead = useSelector((state) => state.posts.mustRead);
  const mustReply = useSelector((state) => state.posts.mustReply);
  const noReplies = useSelector((state) => state.posts.noReplies);
  const closedPost = useSelector((state) => state.posts.closedPost);

  useEffect(() => {
    if (!categoryCountLoaded) {
      dispatch(getCompanyPostCategoryCounter());
    }
  }, []);

  useEffect(() => {
    if (tag) loadMore();
  }, [tag]);

  const loadMore = (callback = () => {}) => {
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
      }
    }
  };

  return {
    loadMoreCategoryPost: loadMore,
    count: {
      is_must_read: mustRead.count,
      is_must_reply: mustReply.count,
      is_read_only: noReplies.count,
      is_close: closedPost.count,
    },
  };
};

export default usePostCategory;
