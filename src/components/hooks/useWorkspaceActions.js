import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
//import {useLocation, useHistory, useParams} from "react-router-dom";
// import toaster from "toasted-notes";
// import {copyTextToClipboard} from "../../helpers/commonFunctions";
// import {getBaseUrl} from "../../helpers/slugHelper";
import {replaceChar} from "../../helpers/stringFormatter";
import { addPrimaryFiles, fetchDetail, fetchMembers, fetchPrimaryFiles, fetchTimeline, 
        getWorkspaces, postWorkspaceRole, setActiveTopic } from "../../redux/actions/workspaceActions";
import { addToModals } from "../../redux/actions/globalActions";
import {
  addToChannels,
  clearSelectedChannel,
  getChannel,
  getWorkspaceChannels,
  setSelectedChannel
} from "../../redux/actions/chatActions";

const useWorkspaceActions = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const getDetail = useCallback(
    (id, callback) => {
      dispatch(fetchDetail({ topic_id: id }, callback));
    },
    [dispatch]
  );

  const getPrimaryFiles = useCallback(
    (id, callback) => {
      dispatch(fetchPrimaryFiles({ topic_id: id }, callback));
    },
    [dispatch]
  );

  const addPrimaryFilesToWorkspace = useCallback(
    (files) => {
      dispatch(addPrimaryFiles(files));
    },
    [dispatch]
  );

  const getMembers = useCallback(
    (id, callback) => {
      dispatch(fetchMembers({ topic_id: id }, callback));
    },
    [dispatch]
  );

  const getTimeline = useCallback(
    (id, callback) => {
      dispatch(fetchTimeline({ topic_id: id }, callback));
    },
    [dispatch]
  );

  const showModal = useCallback(
    (topic, mode, type = "workspace") => {
      let payload = {
        mode: mode,
        item: topic,
      };
      if (type === "folder") {
        payload = {
          ...payload,
          type: "workspace_folder",
        };
      } else {
        payload = {
          ...payload,
          type: "workspace_create_edit",
        };
      }

      dispatch(addToModals(payload));
    },
    [dispatch]
  );

  const fetchWorkspaceChannels = useCallback(
    (payload, callback) => {
      dispatch(getWorkspaceChannels(payload, callback));
    },
    [dispatch]
  );

  const fetchWorkspaces = useCallback(
    (payload, callback) => {
      dispatch(getWorkspaces(payload, callback));
    },
    [dispatch]
  );
  
  const fetchChannel = useCallback(
    (payload, callback) => {
      dispatch(
        getChannel(payload, (err, res) => {
            callback();
            if (err) return;
            let channel = {
                ...res.data,
                hasMore: true,
                skip: 0,
                replies: [],
                selected: true,
            };
            dispatch(addToChannels(channel));
            // selectChannel(channel)
        })
      );
    },
    [dispatch]
  );

  const selectWorkspace = useCallback(
    (workspace, callback) => {
      dispatch(setActiveTopic(workspace, callback));
    },
    [dispatch]
  );
  
  const selectChannel = useCallback(
    (channel, callback) => {
      dispatch(setSelectedChannel(channel, callback));
    },
    [dispatch]
  );

  const clearChannel = useCallback(
    () => {
      dispatch(clearSelectedChannel());
    },
    [dispatch]
  );

  const redirectTo = useCallback(
    (workspace) => {
      if (workspace.folder_id) {
        history.push(`/workspace/chat/${workspace.folder_id}/${replaceChar(workspace.folder_name)}/${workspace.id}/${replaceChar(workspace.name)}`);
      } else {
        history.push(`/workspace/chat/${workspace.id}/${replaceChar(workspace.name)}`);
      }
    },
    []
  );

  const addRole = useCallback(
    (payload, callback) => {
      dispatch(postWorkspaceRole(payload, callback));
    },
    [dispatch]
  );

  return {
    addPrimaryFilesToWorkspace,
    addRole,
    clearChannel,
    fetchChannel,
    fetchWorkspaceChannels,
    fetchWorkspaces,
    getDetail,
    getMembers,
    getPrimaryFiles,
    getTimeline,
    redirectTo,
    selectChannel,
    selectWorkspace,
    showModal,
  };
};

export default useWorkspaceActions;
