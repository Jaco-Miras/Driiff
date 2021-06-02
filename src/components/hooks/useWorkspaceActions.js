import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
//import {useLocation, useHistory, useParams} from "react-router-dom";
// import toaster from "toasted-notes";
// import {copyTextToClipboard} from "../../helpers/commonFunctions";
// import {getBaseUrl} from "../../helpers/slugHelper";
import { replaceChar } from "../../helpers/stringFormatter";
import {
  addPrimaryFiles,
  deleteWorkspaceRole,
  fetchDetail,
  fetchMembers,
  fetchPrimaryFiles,
  fetchTimeline,
  getWorkspace,
  getWorkspaces,
  postWorkspaceRole,
  setActiveTopic,
  updateWorkspaceTimelinePage,
  joinWorkspace,
  leaveWorkspace,
  updateWorkspace,
} from "../../redux/actions/workspaceActions";
import { addToModals } from "../../redux/actions/globalActions";
import { addToChannels, clearSelectedChannel, getChannel, getWorkspaceChannels, setSelectedChannel, putChannel } from "../../redux/actions/chatActions";
import { useSettings, useToaster, useTranslation } from "./index";

const useWorkspaceActions = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { setGeneralSetting, loggedUser } = useSettings();
  const toaster = useToaster();
  const { _t } = useTranslation();
  const dictionary = {
    notificationError: _t("NOTIFICATION.ERROR", "An error has occurred try again!"),
    errorFetchingChannel: _t("ERROR.CHANNEL_FETCH", "Fetching channel failed"),
  };

  const fetchWorkspace = useCallback(
    (id, callback) => {
      dispatch(getWorkspace({ topic_id: id }, callback));
    },
    [dispatch]
  );

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
    (payload, callback) => {
      dispatch(fetchTimeline(payload, callback));
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
          callback(err, res);
          if (err) {
            toaster.error(dictionary.errorFetchingChannel);
            return;
          }
          if (res.data) {
            let channel = {
              ...res.data,
              hasMore: true,
              skip: 0,
              replies: [],
              selected: true,
              isFetching: false,
            };
            dispatch(addToChannels(channel));
            selectChannel(channel);
          }
        })
      );
    },
    [dispatch]
  );

  const selectWorkspace = useCallback(
    (workspace, callback = () => {}) => {
      dispatch(
        setActiveTopic(workspace, (err, res) => {
          setGeneralSetting({
            active_topic: workspace,
          });
          callback(err, res);
        })
      );
    },
    [dispatch]
  );

  const selectChannel = useCallback(
    (channel, callback) => {
      dispatch(setSelectedChannel(channel, callback));
    },
    [dispatch]
  );

  const clearChannel = useCallback(() => {
    dispatch(clearSelectedChannel());
  }, [dispatch]);

  const redirectTo = useCallback((workspace) => {
    if (workspace.folder_id) {
      history.push(`/workspace/chat/${workspace.folder_id}/${replaceChar(workspace.folder_name)}/${workspace.id}/${replaceChar(workspace.name)}`);
    } else {
      history.push(`/workspace/chat/${workspace.id}/${replaceChar(workspace.name)}`);
    }
  }, []);

  const addRole = useCallback(
    (payload, callback) => {
      dispatch(postWorkspaceRole(payload, callback));
    },
    [dispatch]
  );

  const deleteRole = useCallback(
    (payload, callback) => {
      dispatch(deleteWorkspaceRole(payload, callback));
    },
    [dispatch]
  );

  const updateTimelinePage = useCallback(
    (payload) => {
      dispatch(updateWorkspaceTimelinePage(payload));
    },
    [dispatch]
  );

  const join = useCallback(
    (payload, callback) => {
      dispatch(joinWorkspace(payload, callback));
    },
    [dispatch]
  );

  const leave = useCallback(
    (workspace, member, callback) => {
      if (workspace.members.length === 1 && workspace.is_lock === 1) {
        let archivePayload = {
          id: workspace.channel.id,
          is_archived: true,
          is_muted: false,
          is_pinned: false,
        };
        dispatch(putChannel(archivePayload));
      } else {
        let payload = {
          name: workspace.name,
          description: workspace.description,
          topic_id: workspace.id,
          is_external: 0,
          member_ids: workspace.members.map((m) => m.id),
          is_lock: workspace.is_lock ? 1 : 0,
          workspace_id: workspace.folder_id ? workspace.folder_id : 0,
          new_member_ids: [],
          remove_member_ids: [member.id],
        };
        payload.system_message = `CHANNEL_UPDATE::${JSON.stringify({
          author: {
            id: loggedUser.id,
            name: loggedUser.name,
            first_name: loggedUser.first_name,
            partial_name: loggedUser.partial_name,
            profile_image_link: loggedUser.profile_image_thumbnail_link ? loggedUser.profile_image_thumbnail_link : loggedUser.profile_image_link,
          },
          title: "",
          added_members: [],
          removed_members: [member.id],
        })}`;
        if (member.id === loggedUser.id) {
          dispatch(leaveWorkspace({ workspace_id: workspace.id, channel_id: workspace.channel.id }, callback));
        }
        dispatch(updateWorkspace(payload));
      }
    },
    [dispatch]
  );

  return {
    addPrimaryFilesToWorkspace,
    addRole,
    deleteRole,
    clearChannel,
    fetchChannel,
    fetchWorkspaceChannels,
    fetchWorkspace,
    fetchWorkspaces,
    getDetail,
    getMembers,
    getPrimaryFiles,
    getTimeline,
    join,
    leave,
    redirectTo,
    selectChannel,
    selectWorkspace,
    showModal,
    updateTimelinePage,
  };
};

export default useWorkspaceActions;
