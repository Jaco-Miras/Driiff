import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useRouteMatch, useHistory } from "react-router-dom";
import { useSettings, useWorkspaceActions, useToaster } from "../hooks";

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
  const { activeTopic, folders, workspaces, workspaceTimeline, workspacesLoaded, favoriteWorkspacesLoaded } = useSelector((state) => state.workspaces);
  const channels = useSelector((state) => state.chat.channels);
  const selectedChannel = useSelector((state) => state.chat.selectedChannel);
  const user = useSelector((state) => state.session.user);
  const [fetchingPrimary, setFetchingPrimary] = useState(false);
  const [fetchingChannel, setFetchingChannel] = useState(false);

  useEffect(() => {
    if (params.workspaceId) {
      actions.fetchWorkspace(params.workspaceId);
    }
    actions.fetchFavoriteWorkspaces({}, () => {
      actions.fetchWorkspaces({
        sort_by: orderChannel.sort_by.toLowerCase(),
        order_by: orderChannel.order_by,
      });
    });

    if (user.type === "external" && url.startsWith("/workspace/team-chat")) {
      history.push("/workspace/chat");
    }
  }, []);

  useEffect(() => {
    // workspaces is already loaded but workspace is not set yet
    if (Object.keys(workspaces).length && activeTopic === null) {
      //check url if on workspace
      if (params.hasOwnProperty("workspaceId")) {
        if (workspaces.hasOwnProperty(params.workspaceId)) {
          actions.selectWorkspace(workspaces[params.workspaceId]);
          //setGeneralSetting({ active_topic: workspaces[params.workspaceId] });
        } else {
          if (workspacesLoaded && activeTopicSettings) {
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
                }
                if (res.data) {
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
        }
      } else {
        //fetch last visited workspace - from login or loaded in non workspace page
        if (params.page !== "search") {
          if (activeTopicSettings && workspaces.hasOwnProperty(activeTopicSettings.id)) {
            actions.selectWorkspace(workspaces[activeTopicSettings.id]);
            if (url.startsWith("/workspace")) {
              actions.redirectTo(workspaces[activeTopicSettings.id]);
            }
          } else if (url.startsWith("/workspace") && localStorage.getItem("fromRegister")) {
            console.log("trigger");
            actions.selectWorkspace(Object.values(workspaces)[0]);
            actions.redirectTo(Object.values(workspaces)[0]);
            localStorage.removeItem("fromRegister");
          }
        }
      }
    }
  }, [activeTopic, activeTopicSettings, params, workspaces, url, workspacesLoaded]);

  // useEffect(() => {
  //   workspace is already set and changing channel / workspace
  //   if (activeTopic && Object.keys(channels).length && url.startsWith("/workspace")) {
  //     //check params for team-chat
  //     if (channels.hasOwnProperty(activeTopic.channel.id)) {
  //       if ((activeChannelId && activeChannelId !== activeTopic.channel.id) || activeChannelId === null) {
  //         actions.selectChannel(channels[activeTopic.channel.id]);
  //       }
  //     } else {
  //       if (!fetchingChannel) {
  //         setFetchingChannel(true);
  //         actions.fetchChannel({ code: activeTopic.channel.code }, () => setFetchingChannel(false));
  //       }
  //     }
  //   }
  // }, [activeTopic, channels, activeChannelId, fetchingChannel, url]);

  useEffect(() => {
    //check if workspace is active and channel is not set yet
    const fetchingCallback = (err, res) => {
      if (res) setFetchingChannel(false);
    };
    if (activeTopic && !selectedChannel && Object.keys(channels).length && url.startsWith("/workspace")) {
      if (url.startsWith("/workspace/team-chat")) {
        if (activeTopic.team_channel.code && channels.hasOwnProperty(activeTopic.team_channel.id)) {
          actions.selectChannel(channels[activeTopic.team_channel.id]);
        } else if (activeTopic.team_channel.code && !channels.hasOwnProperty(activeTopic.team_channel.id)) {
          if (!fetchingChannel) {
            setFetchingChannel(true);
            actions.fetchChannel({ code: activeTopic.team_channel.code }, fetchingCallback);
          }
        }
      } else {
        if (channels.hasOwnProperty(activeTopic.channel.id)) {
          actions.selectChannel(channels[activeTopic.channel.id]);
        } else {
          if (!fetchingChannel) {
            setFetchingChannel(true);
            actions.fetchChannel({ code: activeTopic.channel.code }, fetchingCallback);
          }
        }
      }
    } else if (activeTopic && selectedChannel && Object.keys(channels).length && url.startsWith("/workspace")) {
      // check if channel is not match
      if (url.startsWith("/workspace/team-chat")) {
        if (activeTopic.team_channel.code && activeTopic.team_channel.id !== selectedChannel.id) {
          if (channels.hasOwnProperty(activeTopic.team_channel.id)) {
            actions.selectChannel(channels[activeTopic.team_channel.id]);
          } else {
            if (!fetchingChannel) {
              setFetchingChannel(true);
              actions.fetchChannel({ code: activeTopic.team_channel.code }, fetchingCallback);
            }
          }
        }
      } else {
        if (activeTopic.channel.id !== selectedChannel.id) {
          if (channels.hasOwnProperty(activeTopic.channel.id)) {
            actions.selectChannel(channels[activeTopic.channel.id]);
          } else {
            if (!fetchingChannel) {
              setFetchingChannel(true);
              actions.fetchChannel({ code: activeTopic.channel.code }, fetchingCallback);
            }
          }
        }
      }
    }
  }, [activeTopic, selectedChannel, fetchingChannel, url, channels]);

  useEffect(() => {
    // setFetching to false when changing workspaces
    if (params.hasOwnProperty("workspaceId")) {
      setFetchingChannel(false);
    }
  }, [params]);

  useEffect(() => {
    if (!fetchingPrimary && activeTopic && !activeTopic.hasOwnProperty("primary_files") && url.startsWith("/workspace/dashboard/")) {
      setFetchingPrimary(true);
      const callback = (err, res) => {
        setTimeout(() => {
          setFetchingPrimary(false);
        }, 300);
        if (err) return;
        let payload = {
          id: activeTopic.id,
          folder_id: activeTopic.workspace_id,
          files: res.data,
        };
        actions.addPrimaryFilesToWorkspace(payload);
      };
      actions.getPrimaryFiles(activeTopic.id, callback);
    }
  }, [fetchingPrimary, activeTopic, url]);

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
