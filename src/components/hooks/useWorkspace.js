import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useRouteMatch, useHistory } from "react-router-dom";
import { useSettings, useWorkspaceActions, useToaster, useTranslationActions } from "../hooks";
import { replaceChar } from "../../helpers/stringFormatter";

const useWorkspace = () => {
  const fetchingRef = useRef(null);
  const {
    generalSettings: { active_topic: activeTopicSettings, order_channel: orderChannel },
  } = useSettings();
  const toaster = useToaster();
  const route = useRouteMatch();
  const history = useHistory();
  const { params, url } = route;
  const actions = useWorkspaceActions();
  //const { activeTopic, folders, workspaces, workspaceTimeline, workspacesLoaded, favoriteWorkspacesLoaded } = useSelector((state) => state.workspaces);
  const activeTopic = useSelector((state) => state.workspaces.activeTopic);
  const folders = useSelector((state) => state.workspaces.folders);
  const workspaces = useSelector((state) => state.workspaces.workspaces);
  const workspaceTimeline = useSelector((state) => state.workspaces.workspaceTimeline);
  const workspacesLoaded = useSelector((state) => state.workspaces.workspacesLoaded);
  const favoriteWorkspacesLoaded = useSelector((state) => state.workspaces.favoriteWorkspacesLoaded);
  //const channels = useSelector((state) => state.chat.channels);
  const channelIds = useSelector((state) => Object.keys(state.chat.channels));
  const selectedChannelId = useSelector((state) => state.chat.selectedChannelId);
  const selectedChannelCode = useSelector((state) => state.chat.selectedChannelCode);
  const user = useSelector((state) => state.session.user);
  //const [fetchingPrimary, setFetchingPrimary] = useState(false);
  const [fetchingChannel, setFetchingChannel] = useState(false);

  const sharedWsLoaded = useSelector((state) => state.workspaces.sharedWorkspacesLoaded);

  const { _t } = useTranslationActions();
  const dictionary = {
    notAuthorized: _t("TOASTER.NOT_AUTHORIZED", "You are not authorized to view this workspace"),
  };

  useEffect(() => {
    if (params.workspaceId) {
      if (history.location.pathname.startsWith("/hub")) {
        actions.fetchWorkspace(params.workspaceId, (err, res) => {
          if (err) {
            if (err.response.status === 422) {
              history.push("/chat");
              if (err.response.data.errors.error_message && err.response.data.errors.error_message.includes("NOT_AUTHORIZED")) {
                toaster.error(dictionary.notAuthorized);
              }
            }
          }
        });
      }
    }
    actions.fetchFavoriteWorkspaces({}, () => {
      actions.fetchWorkspaces({
        sort_by: orderChannel.sort_by.toLowerCase(),
        order_by: orderChannel.order_by,
      });
    });

    if (user.type === "external" && url.startsWith("/hub/team-chat")) {
      history.push("/hub/dashboard");
    }
  }, []);

  useEffect(() => {
    // workspaces is already loaded but workspace is not set yet
    if (Object.keys(workspaces).length && activeTopic === null) {
      //check url if on workspace
      if (params.hasOwnProperty("workspaceId")) {
        if (workspaces.hasOwnProperty(params.workspaceId) && history.location.pathname.startsWith("/hub")) {
          actions.selectWorkspace(workspaces[params.workspaceId]);
        } else {
          if (workspacesLoaded && activeTopicSettings) {
            if (params.workspaceId && history.location.pathname.startsWith("/shared-hub")) {
              if (sharedWsLoaded) {
                const sws = Object.values(workspaces).find((ws) => ws.sharedSlug && ws.id === Number(params.workspaceId) && replaceChar(ws.name) === params.workspaceName);
                if (sws) {
                  actions.selectWorkspace(sws);
                  actions.redirectTo(sws);
                }
              }
            } else {
              // fetch the detail
              if (!fetchingRef.current) {
                fetchingRef.current = true;
                actions.fetchWorkspace(params.workspaceId, (err, res) => {
                  fetchingRef.current = null;
                  if (err) {
                    toaster.warning("This workspace cannot be found or accessed.");
                    if (parseInt(params.workspaceId) === activeTopicSettings.id) {
                      let sortedWorkspaces = Object.values(workspaces)
                        .filter((ws) => {
                          return ws.folder_id === null;
                        })
                        .sort((a, b) => a.name.localeCompare(b.name));
                      if (sortedWorkspaces.length) {
                        //redirect to first direct workspace
                        actions.selectWorkspace(sortedWorkspaces[0]);
                        actions.redirectTo(sortedWorkspaces[0]);
                      }
                    } else {
                      if (workspaces.hasOwnProperty(activeTopicSettings.id)) {
                        actions.selectWorkspace(workspaces[activeTopicSettings.id]);
                        actions.redirectTo(workspaces[activeTopicSettings.id]);
                      }
                    }
                    return;
                  }
                  if (res && res.data) {
                    let ws = {
                      ...res.data.workspace_data,
                      channel: res.data.workspace_data.topic_detail.channel,
                      unread_chats: res.data.workspace_data.topic_detail.unread_chats,
                      unread_posts: res.data.workspace_data.topic_detail.unread_posts,
                      folder_id: res.data.workspace_id,
                      folder_name: res.data.workspace_name,
                    };
                    actions.redirectTo(ws);
                  }
                });
              }
            }
          } else if (workspacesLoaded && !activeTopicSettings) {
            if (params.workspaceId && history.location.pathname.startsWith("/shared-hub")) {
              if (sharedWsLoaded) {
                const sws = Object.values(workspaces).find((ws) => ws.sharedSlug && ws.id === Number(params.workspaceId) && replaceChar(ws.name) === params.workspaceName);
                if (sws) {
                  actions.selectWorkspace(sws);
                  actions.redirectTo(sws);
                }
              }
            }
          }
        }
      } else {
        //fetch last visited workspace - from login or loaded in non workspace page
        if (["search", "all"].includes(params.page)) return;
        if (activeTopicSettings && workspaces.hasOwnProperty(activeTopicSettings.id)) {
          actions.selectWorkspace(workspaces[activeTopicSettings.id]);
          if (url.startsWith("/hub") || url.startsWith("/shared-hub")) {
            actions.redirectTo(workspaces[activeTopicSettings.id]);
          }
        } else if (url.startsWith("/hub") && localStorage.getItem("fromRegister") && user.type === "external") {
          actions.selectWorkspace(Object.values(workspaces)[0]);
          actions.redirectTo(Object.values(workspaces)[0]);
          localStorage.removeItem("fromRegister");
        } else if (user.type === "external" && (url.startsWith("/hub/chat") || url.startsWith("/shared-hub/chat"))) {
          actions.selectWorkspace(Object.values(workspaces)[0]);
          actions.redirectTo(Object.values(workspaces)[0]);
        }
      }
    }
  }, [activeTopic, activeTopicSettings, params, workspaces, url, workspacesLoaded, sharedWsLoaded]);

  useEffect(() => {
    //check if workspace is active and channel is not set yet
    const fetchingCallback = (err, res) => {
      if (res) setFetchingChannel(false);
    };
    if (activeTopic && activeTopic.sharedSlug) {
      if (url.startsWith("/shared-hub/team-chat")) {
        if (channelIds.some((id) => id === activeTopic.team_channel.code) && selectedChannelCode !== activeTopic.team_channel.code) {
          actions.selectChannel({ slug: activeTopic.slug, code: activeTopic.team_channel.code, id: activeTopic.channel.id });
        }
      } else if (url.startsWith("/shared-hub/chat")) {
        if (activeTopic.is_shared) {
          if (channelIds.some((id) => id === activeTopic.channel.code) && selectedChannelCode !== activeTopic.channel.code) {
            actions.selectChannel({ slug: activeTopic.slug, code: activeTopic.channel.code, id: activeTopic.channel.id });
          }
        } else {
          if (channelIds.some((id) => id === activeTopic.team_channel.code) && selectedChannelCode !== activeTopic.team_channel.code) {
            actions.selectChannel({ slug: activeTopic.slug, code: activeTopic.team_channel.code, id: activeTopic.team_channel.id });
          }
        }
      }
    } else {
      if (activeTopic && !selectedChannelId && channelIds.length && url.startsWith("/hub")) {
        if (url.startsWith("/hub/team-chat")) {
          if (activeTopic.team_channel.code && channelIds.some((id) => parseInt(id) === activeTopic.team_channel.id)) {
            actions.selectChannel({ id: activeTopic.team_channel.id });
          } else if (activeTopic.team_channel.code && !channelIds.some((id) => parseInt(id) === activeTopic.team_channel.id)) {
            if (!fetchingChannel) {
              setFetchingChannel(true);
              actions.fetchChannel({ code: activeTopic.team_channel.code }, fetchingCallback);
            }
          }
        } else {
          if (activeTopic.is_shared) {
            if (channelIds.some((id) => parseInt(id) === activeTopic.channel.id) && activeTopic.channel.id !== selectedChannelId) {
              actions.selectChannel({ id: activeTopic.channel.id });
            } else if (!channelIds.some((id) => parseInt(id) === activeTopic.channel.id) && activeTopic.channel.id !== selectedChannelId && activeTopic.channel.code && !fetchingChannel) {
              setFetchingChannel(true);
              actions.fetchChannel({ code: activeTopic.channel.code }, fetchingCallback);
            }
          } else {
            if (channelIds.some((id) => parseInt(id) === activeTopic.team_channel.id) && activeTopic.team_channel.id !== selectedChannelId) {
              actions.selectChannel({ id: activeTopic.team_channel.id });
            } else if (!channelIds.some((id) => parseInt(id) === activeTopic.team_channel.id) && activeTopic.team_channel.id !== selectedChannelId && activeTopic.team_channel.code && !fetchingChannel) {
              setFetchingChannel(true);
              actions.fetchChannel({ code: activeTopic.team_channel.code }, fetchingCallback);
            }
          }
        }
      } else if (activeTopic && selectedChannelId && channelIds.length && url.startsWith("/hub")) {
        // check if channel is not match
        if (url.startsWith("/hub/team-chat")) {
          if (activeTopic.team_channel.code && activeTopic.team_channel.id !== selectedChannelId) {
            if (channelIds.some((id) => parseInt(id) === activeTopic.team_channel.id)) {
              actions.selectChannel({ id: activeTopic.team_channel.id });
            } else {
              if (!fetchingChannel) {
                setFetchingChannel(true);
                actions.fetchChannel({ code: activeTopic.team_channel.code }, fetchingCallback);
              }
            }
          }
        } else {
          if (activeTopic.is_shared) {
            if (channelIds.some((id) => parseInt(id) === activeTopic.channel.id) && activeTopic.channel.id !== selectedChannelId) {
              actions.selectChannel({ id: activeTopic.channel.id });
            } else if (!channelIds.some((id) => parseInt(id) === activeTopic.channel.id) && activeTopic.channel.id !== selectedChannelId && activeTopic.channel.code && !fetchingChannel) {
              setFetchingChannel(true);
              actions.fetchChannel({ code: activeTopic.channel.code }, fetchingCallback);
            }
          } else {
            if (channelIds.some((id) => parseInt(id) === activeTopic.team_channel.id) && activeTopic.team_channel.id !== selectedChannelId) {
              actions.selectChannel({ id: activeTopic.team_channel.id });
            } else if (!channelIds.some((id) => parseInt(id) === activeTopic.team_channel.id) && activeTopic.team_channel.id !== selectedChannelId && activeTopic.team_channel.code && !fetchingChannel) {
              setFetchingChannel(true);
              actions.fetchChannel({ code: activeTopic.team_channel.code }, fetchingCallback);
            }
          }
        }
      }
    }
  }, [activeTopic, selectedChannelId, fetchingChannel, url, channelIds, selectedChannelCode]);

  useEffect(() => {
    // setFetching to false when changing workspaces
    if (params.hasOwnProperty("workspaceId")) {
      setFetchingChannel(false);
    }
  }, [params]);

  let timeline = null;
  if (Object.keys(workspaceTimeline).length && activeTopic && workspaceTimeline[activeTopic.id]) {
    timeline = workspaceTimeline[activeTopic.id];
  }

  return {
    favoriteWorkspacesLoaded,
    folders,
    //sortedWorkspaces: Object.values(workspaces).sort((a, b) => a.name.localeCompare(b.name)),
    workspaces,
    workspace: activeTopic,
    actions: actions,
    workspacesLoaded,
    timeline,
    orderChannel: orderChannel,
    history,
  };
};

export default useWorkspace;
