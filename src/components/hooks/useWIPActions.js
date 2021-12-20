import { useDispatch } from "react-redux";
import { addToModals } from "../../redux/actions/globalActions";
import { useLocation, useHistory, useParams } from "react-router-dom";
import { replaceChar } from "../../helpers/stringFormatter";
import { postSubject, getWIPs, getWIPDetail, addWIPs } from "../../redux/actions/wipActions";

const useWIPActions = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const history = useHistory();
  const params = useParams();

  const showModal = (mode = "create", wip = null) => {
    let modal = {
      type: "wip",
      mode: mode,
      wip: wip,
      params: params,
    };
    dispatch(addToModals(modal));
  };

  const openWIP = (wip, path = null) => {
    if (wip.type === "draft_wip") {
      let payload = {
        type: "post_modal",
        mode: "create",
        item: {
          draft: wip,
        },
        params: params,
      };

      dispatch(addToModals(payload));
    } else {
      history.push(location.pathname + `/wip/${wip.id}/${replaceChar(wip.title)}`);
    }
  };

  const goBack = () => {
    if (params.hasOwnProperty("wipFileId")) {
      if (params.hasOwnProperty("folderId")) {
        history.push(`/workspace/wip/${params.folderId}/${replaceChar(params.folderName)}/${params.workspaceId}/${replaceChar(params.workspaceName)}/wip/${params.wipId}/${replaceChar(params.wipTitle)}`);
      } else {
        history.push(`/workspace/wip/${params.workspaceId}/${replaceChar(params.workspaceName)}/wip/${params.wipId}/${replaceChar(params.wipTitle)}`);
      }
    } else if (params.hasOwnProperty("wipId")) {
      if (params.hasOwnProperty("folderId")) {
        history.push(`/workspace/wip/${params.folderId}/${replaceChar(params.folderName)}/${params.workspaceId}/${replaceChar(params.workspaceName)}`);
      } else {
        history.push(`/workspace/wip/${params.workspaceId}/${replaceChar(params.workspaceName)}`);
      }
    }
  };

  const createSubject = (payload, callback = () => {}) => {
    dispatch(postSubject(payload, callback));
  };

  const fetchWIPs = (payload, callback = () => {}) => {
    dispatch(getWIPs(payload, callback));
  };

  const fetchWIPDetail = (payload, callback = () => {}) => {
    dispatch(getWIPDetail(payload, callback));
  };

  const storeWIPs = (payload, callback = () => {}) => {
    dispatch(addWIPs(payload, callback));
  };

  return {
    fetchWIPs,
    fetchWIPDetail,
    createSubject,
    openWIP,
    showModal,
    goBack,
    storeWIPs,
  };
};

export default useWIPActions;
