import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { addToModals } from "../../redux/actions/globalActions";

const useShowDashboardModal = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const workspaceId = useSelector((state) => state.workspaces.selectedWorkspaceId);
  const showAboutModal = useSelector((state) => state.workspaces.showAboutModal);
  const dontShowIds = useSelector((state) => state.global.dontShowIds);
  const user = useSelector((state) => state.session.user);
  useEffect(() => {
    if (!location.pathname.startsWith("/hub/search") && workspaceId) {
      if (showAboutModal) {
        if (dontShowIds.some((id) => id === workspaceId)) return;
        if (user.dontShowIds) {
          if (user.dontShowIds.some((id) => id === workspaceId)) return;
          else dispatch(addToModals({ type: "about_workspace" }));
        } else {
          dispatch(addToModals({ type: "about_workspace" }));
        }
      }
    }
  }, [workspaceId, showAboutModal, location.pathname, user]);
};

export default useShowDashboardModal;
