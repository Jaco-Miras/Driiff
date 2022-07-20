import { useEffect } from "react";
import { usePostActions } from "./index";
import { useSelector } from "react-redux";

const useSharedCompanyPosts = () => {
  const sharedCompanyPosts = useSelector((state) => state.posts.sharedCompanyPosts);
  const sharedWs = useSelector((state) => state.workspaces.sharedWorkspaces);
  const actions = usePostActions();
  useEffect(() => {
    if (Object.keys(sharedWs).length) {
      //fetch the company post
      Object.keys(sharedWs).forEach((slug) => {
        if (sharedCompanyPosts[slug]) {
          //check the existing shared company posts
        } else {
          //initial fetch
          const sharedPayload = { slug: slug, token: sharedWs[slug].access_token, is_shared: true };
          actions.fetchSharedUnreadCompanyPosts({
            skip: 0,
            limit: 25,
            filters: ["green_dot"],
            sharedPayload,
          });
          actions.fetchSharedReadCompanyPosts({
            skip: 0,
            limit: 25,
            filters: ["green_dot"],
            sharedPayload,
          });
        }
      });
    }
  }, []);
};

export default useSharedCompanyPosts;
