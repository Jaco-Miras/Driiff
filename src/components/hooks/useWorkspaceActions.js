import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { replaceChar } from "../../helpers/stringFormatter";
import {
  deleteWorkspaceRole,
  fetchDetail,
  fetchMembers,
  fetchPrimaryFiles,
  fetchTimeline,
  getWorkspace,
  getWorkspaces,
  getFavoriteWorkspaces,
  postWorkspaceRole,
  setActiveTopic,
  updateWorkspaceTimelinePage,
  joinWorkspace,
  leaveWorkspace,
  updateWorkspace,
  putWorkspaceNotification,
} from "../../redux/actions/workspaceActions";
import { addToModals } from "../../redux/actions/globalActions";
import { addToChannels, clearSelectedChannel, getChannel, getWorkspaceChannels, setSelectedChannel, putChannel } from "../../redux/actions/chatActions";
import { useSettings, useToaster, useTranslationActions, useGetSlug } from "./index";

const useWorkspaceActions = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { setGeneralSetting, loggedUser } = useSettings();
  const toaster = useToaster();
  const { _t } = useTranslationActions();
  const dictionary = {
    notificationError: _t("NOTIFICATION.ERROR", "An error has occurred try again!"),
    errorFetchingChannel: _t("ERROR.CHANNEL_FETCH", "Fetching channel failed"),
  };
  const { slug } = useGetSlug();

  const fetchWorkspace = (id, callback) => {
    dispatch(getWorkspace({ topic_id: id }, callback));
  };

  const getDetail = (id, callback) => {
    dispatch(fetchDetail({ topic_id: id }, callback));
  };

  const getPrimaryFiles = (id, callback) => {
    dispatch(fetchPrimaryFiles({ topic_id: id }, callback));
  };

  const getMembers = (id, callback) => {
    dispatch(fetchMembers({ topic_id: id }, callback));
  };

  const getTimeline = (payload, callback) => {
    dispatch(fetchTimeline(payload, callback));
  };

  const showModal = (topic, mode, type = "workspace") => {
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
  };

  const fetchWorkspaceChannels = (payload, callback) => {
    dispatch(getWorkspaceChannels(payload, callback));
  };

  const fetchWorkspaces = (payload, callback) => {
    dispatch(getWorkspaces(payload, callback));
  };

  const fetchChannel = (payload, callback) => {
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
            sharedSlug: false,
            slug: null,
          };
          dispatch(addToChannels(channel));
          selectChannel(channel);
        }
      })
    );
  };

  const selectWorkspace = (workspace, callback = () => {}) => {
    if (slug && workspace && workspace.slug && workspace.slug !== slug) {
      dispatch(setActiveTopic(workspace));
      if (workspace.id) {
        setGeneralSetting({
          active_topic: workspace,
        });
      }
    } else {
      let members = [];
      if (workspace.members) {
        members = workspace.members
          .map((m) => {
            if (m.member_ids) {
              return m.members;
            } else return m;
          })
          .flat();
      }
      if (workspace.members && workspace.is_lock === 1 && !members.some((m) => m.id === loggedUser.id)) return;
      dispatch(
        setActiveTopic(workspace, (err, res) => {
          setGeneralSetting({
            active_topic: workspace,
          });
          callback(err, res);
        })
      );
    }
  };

  const selectChannel = (channel, callback) => {
    dispatch(setSelectedChannel(channel, callback));
  };

  const clearChannel = () => {
    dispatch(clearSelectedChannel());
  };

  const redirectTo = (workspace) => {
    let ws_type = workspace.sharedSlug ? "shared-hub" : "hub";
    if (workspace.folder_id) {
      history.push(`/${ws_type}/dashboard/${workspace.folder_id}/${replaceChar(workspace.folder_name)}/${workspace.id}/${replaceChar(workspace.name)}`);
    } else {
      history.push(`/${ws_type}/dashboard/${workspace.id}/${replaceChar(workspace.name)}`);
    }
  };

  const addRole = (payload, callback) => {
    dispatch(postWorkspaceRole(payload, callback));
  };

  const deleteRole = (payload, callback) => {
    dispatch(deleteWorkspaceRole(payload, callback));
  };

  const updateTimelinePage = (payload) => {
    dispatch(updateWorkspaceTimelinePage(payload));
  };

  const join = (payload, callback) => {
    dispatch(joinWorkspace(payload, callback));
  };

  const leave = (workspace, member, callback) => {
    if (workspace.members.length === 1 && workspace.is_lock === 1) {
      if (workspace.team_channel) {
        let archivePayload = {
          id: workspace.team_channel.id,
          is_archived: true,
          is_muted: false,
          is_pinned: false,
        };
        dispatch(putChannel(archivePayload));
      }
    } else {
      const isUser = member.type === "internal" || member.type === "external";
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
          profile_image_link: loggedUser.profile_image_link,
        },
        title: "",
        added_members: [],
        removed_members: isUser ? [member.id] : [],
        removed_teams: isUser ? [] : [member.id],
      })}`;
      if (member.id === loggedUser.id) {
        dispatch(leaveWorkspace({ workspace_id: workspace.id, channel_id: workspace.channel.id }, callback));
      }
      dispatch(updateWorkspace(payload));
    }
  };

  const fetchFavoriteWorkspaces = (payload, callback) => {
    dispatch(getFavoriteWorkspaces(payload, callback));
  };

  const toggleWorkspaceNotification = (payload, callback) => {
    dispatch(putWorkspaceNotification(payload, callback));
  };

  return {
    addRole,
    deleteRole,
    clearChannel,
    fetchChannel,
    fetchFavoriteWorkspaces,
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
    toggleWorkspaceNotification,
  };
};

export default useWorkspaceActions;
