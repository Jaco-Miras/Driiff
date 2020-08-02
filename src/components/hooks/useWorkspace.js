import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouteMatch } from "react-router-dom";
import { useWorkspaceActions, useSettings } from "../hooks";

const useWorkspace = (fetchOnMount = false) => {
  
  const {
    generalSettings: {active_topic: activeTopicSettings},
    setGeneralSetting,
  } = useSettings();
  const route = useRouteMatch();
  const { params, path, url } = route;
  const actions = useWorkspaceActions();
  const { activeChannelId, activeTopic, folders, workspaces, workspaceTimeline, workspacesLoaded } = useSelector((state) => state.workspaces);
  const channels = useSelector((state) => state.chat.channels);
  const [fetchingPrimary, setFetchingPrimary] = useState(false);
  const [init, setInit] = useState(false);
  const [fetchingChannel, setFetchingChannel] = useState(false);

  useEffect(() => {
    
    if (!init && !workspacesLoaded && fetchOnMount) {
      setInit(true);
      let fetchCb = (err,res) => {
        setInit(false);
        if (err) return;
        //callback on get workspaces
      }
      actions.fetchWorkspaces({is_external: 0}, fetchCb);
      actions.fetchWorkspaces({is_external: 1});
      actions.fetchWorkspaces({is_external: 0, filter: "archived"});
      actions.fetchWorkspaceChannels({skip: 0, limit: 10});
    } else if (workspacesLoaded && activeTopic) {
      //restore the channel id
      if (channels.hasOwnProperty(activeTopic.channel.id) && path === "/workspace/:page") {
        actions.selectChannel(channels[activeTopic.channel.id]);
      }
    }
    return () => {
      actions.clearChannel();
    };
  }, []);

  useEffect(() => {
    if (Object.keys(workspaces).length && activeTopic === null && fetchOnMount) {
      //check url if on workspace
      if (params.hasOwnProperty("workspaceId")) {
        if (workspaces.hasOwnProperty(params.workspaceId)) {
          actions.selectWorkspace(workspaces[params.workspaceId]);
          setGeneralSetting({ active_topic: workspaces[params.workspaceId]});
        }
      } else {
        //fetch last visited workspace
        if (activeTopicSettings && workspaces.hasOwnProperty(activeTopicSettings.id)) {
          actions.selectWorkspace(workspaces[activeTopicSettings.id]);
          //actions.redirectTo(workspaces[activeTopicSettings.id]);
        }
      }
    }
  }, [activeTopic, activeTopicSettings, params, workspaces, fetchOnMount]);

  useEffect(() => {
    if (activeTopic && Object.keys(channels).length && fetchOnMount && url.startsWith("/workspace/")) {
      if (channels.hasOwnProperty(activeTopic.channel.id)) {
        if ((activeChannelId && activeChannelId !== activeTopic.channel.id) || activeChannelId === null) {
          actions.selectChannel(channels[activeTopic.channel.id]);
        }
      } else {
        if (!fetchingChannel) {
          setFetchingChannel(true);
          actions.fetchChannel({code: activeTopic.channel.code}, () => setFetchingChannel(false))
        }
      }
    }
  }, [activeTopic, channels, activeChannelId, fetchingChannel, fetchOnMount, url])
  
  useEffect(() => {
    if (!fetchingPrimary && activeTopic && !activeTopic.hasOwnProperty("primary_files") && url.startsWith("/workspace/dashboard/") && fetchOnMount) {
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
  }, [fetchingPrimary, activeTopic, url, fetchOnMount]);

  let timeline = null;
  if (Object.keys(workspaceTimeline).length && workspaceTimeline.hasOwnProperty(params.workspaceId)) {
    timeline = workspaceTimeline[params.workspaceId].timeline;
  }

  return {
    folders,
    sortedWorkspaces: Object.values(workspaces).sort((a,b) => a.name.localeCompare(b.name)),
    workspaces,
    workspace: activeTopic,
    actions: actions,
    workspacesLoaded,
    timeline,
  };
};

export default useWorkspace;
