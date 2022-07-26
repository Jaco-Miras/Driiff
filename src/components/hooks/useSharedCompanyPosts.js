import { useEffect } from "react";
import { usePostActions } from "./index";
import { useSelector } from "react-redux";

const useSharedCompanyPosts = () => {
  const sharedCompanyPosts = useSelector((state) => state.posts.sharedCompanyPosts);
  const sharedWs = useSelector((state) => state.workspaces.sharedWorkspaces);
  const session = useSelector((state) => state.session);
  const actions = usePostActions();
  useEffect(() => {
    //fetch the company post
    const sharedWorkspaces = session.user && session.user.sharedWorkspaces ? session.user.sharedWorkspaces : Object.keys(sharedWs).length ? sharedWs : [];
    Object.keys(sharedWorkspaces).forEach((slug) => {
      if (sharedCompanyPosts[slug]) {
        //check the existing shared company posts
        if (sharedCompanyPosts[slug].readPosts && sharedCompanyPosts[slug].readPosts.has_more) {
          actions.fetchSharedUnreadCompanyPosts({
            skip: sharedCompanyPosts[slug].readPosts.next_skip,
            limit: 25,
            filters: ["green_dot"],
            sharedPayload: { slug: slug, token: sharedWorkspaces[slug].access_token, is_shared: true },
          });
        }
        if (sharedCompanyPosts[slug].unreadPosts && sharedCompanyPosts[slug].unreadPosts.has_more) {
          actions.fetchSharedReadCompanyPosts({
            skip: sharedCompanyPosts[slug].unreadPosts.next_skip,
            limit: 25,
            filters: ["read_post"],
            sharedPayload: { slug: slug, token: sharedWorkspaces[slug].access_token, is_shared: true },
          });
        }
      } else {
        //initial fetch
        actions.fetchSharedUnreadCompanyPosts({
          skip: 0,
          limit: 25,
          filters: ["green_dot"],
          sharedPayload: { slug: slug, token: sharedWorkspaces[slug].access_token, is_shared: true },
        });
        actions.fetchSharedReadCompanyPosts({
          skip: 0,
          limit: 25,
          filters: ["read_post"],
          sharedPayload: { slug: slug, token: sharedWorkspaces[slug].access_token, is_shared: true },
        });
      }
    });
  }, []);
};

export default useSharedCompanyPosts;
