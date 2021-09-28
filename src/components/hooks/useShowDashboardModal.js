import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { addToModals } from "../../redux/actions/globalActions";

const useShowDashboardModal = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const workspaceId = useSelector((state) => state.workspaces.selectedWorkspaceId);
  const showAboutModal = useSelector((state) => state.workspaces.showAboutModal);

  useEffect(() => {
    if (!location.pathname.startsWith("/workspace/search") && workspaceId) {
      if (showAboutModal) {
        dispatch(addToModals({ type: "about_workspace" }));
      }
    }
  }, [workspaceId, showAboutModal, location.pathname]);
};

export default useShowDashboardModal;
