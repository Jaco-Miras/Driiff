import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { addToModals } from "../../redux/actions/globalActions";

const useShowDashboardModal = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const workspaceId = useSelector((state) => state.workspaces.selectedWorkspaceId);
  const showAboutModal = useSelector((state) => state.workspaces.showAboutModal);
  useEffect(() => {
    if (history.location.pathname.startsWith("/workspace/search")) {
      return;
    } else if (workspaceId && showAboutModal) {
      dispatch(addToModals({ type: "about_workspace" }));
    }
  }, [workspaceId, showAboutModal]);
};

export default useShowDashboardModal;
