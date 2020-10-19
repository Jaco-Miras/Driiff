import {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {useRouteMatch} from "react-router-dom";
import {useSettings, useWorkspaceActions, useToaster} from "../hooks";

const useWorkspace = (fetchOnMount = false) => {

  const {
    generalSettings: {active_topic: activeTopicSettings},
    setGeneralSetting,
  } = useSettings();
  const toaster = useToaster();
  const route = useRouteMatch();
  const {params, path, url} = route;
  const actions = useWorkspaceActions();
  const { activeChannelId, activeTopic, folders, workspaces, workspaceTimeline, workspacesLoaded } = useSelector((state) => state.workspaces);
  const channels = useSelector((state) => state.chat.channels);
  const [fetchingPrimary, setFetchingPrimary] = useState(false);
  const [init, setInit] = useState(false);
  const [fetchingChannel, setFetchingChannel] = useState(false);
  //const [archivedWsLoaded, setArchivedWsLoaded] = useState(false);
  const [internalLoaded, setInternalLoaded] = useState(false);
  const [externalLoaded, setExternalLoaded] = useState(false);

  useEffect(() => {
    
    if (!init && !workspacesLoaded && fetchOnMount) {
      setInit(true);
      let fetchCb = (err,res) => {
        setInit(false);
        setInternalLoaded(true);
        if (err) return;
        //callback on get workspaces
      }
      actions.fetchWorkspaces({is_external: 0}, fetchCb);
      actions.fetchWorkspaces({is_external: 1}, () => setExternalLoaded(true));
      // actions.fetchWorkspaces({is_external: 0, filter: "archived"}, () => {
      //   setArchivedWsLoaded(true);
      // });
      actions.fetchWorkspaceChannels({skip: 0, limit: 250});
    } else if (workspacesLoaded && activeTopic) {
      //restore the channel id
      if (channels.hasOwnProperty(activeTopic.channel.id) && url.startsWith("/workspace")) {
        actions.selectChannel(channels[activeTopic.channel.id]);
      }
    }
    // return () => {
    //   actions.clearChannel();
    // };
  }, []);

  useEffect(() => {
    if (Object.keys(workspaces).length && activeTopic === null && fetchOnMount) {
      //check url if on workspace
      if (params.hasOwnProperty("workspaceId")) {
        if (workspaces.hasOwnProperty(params.workspaceId)) {
          actions.selectWorkspace(workspaces[params.workspaceId]);
          setGeneralSetting({ active_topic: workspaces[params.workspaceId]});
        } else {
          if (internalLoaded && externalLoaded && activeTopicSettings) {
            toaster.warning("This workspace cannot be found or accessed.");
            if (parseInt(params.workspaceId) === activeTopicSettings.id) {
              let sortedWorkspaces = Object.values(workspaces).filter((ws) => {
                return ws.folder_id === null;
              }).sort((a,b) => a.name.localeCompare(b.name));
              if (sortedWorkspaces.length) {
                actions.selectWorkspace(sortedWorkspaces[0]);
                actions.redirectTo(sortedWorkspaces[0]);
              }
            } else {
              actions.selectWorkspace(activeTopicSettings);
              actions.redirectTo(activeTopicSettings);
            }
          } 
        }
      } else {
        //fetch last visited workspace
        if (params.page !== "search") {
          if (activeTopicSettings && workspaces.hasOwnProperty(activeTopicSettings.id)) {
            actions.selectWorkspace(workspaces[activeTopicSettings.id]);
            if (url.startsWith("/workspace")) {
              actions.redirectTo(workspaces[activeTopicSettings.id]);
            }
          } else if (url.startsWith("/workspace") && localStorage.getItem("fromRegister")) {
            console.log('trigger')
            actions.selectWorkspace(Object.values(workspaces)[0]);
            actions.redirectTo(Object.values(workspaces)[0]);
            localStorage.removeItem("fromRegister")
          }
        }
      }
    }
  }, [activeTopic, activeTopicSettings, params, workspaces, url, internalLoaded, externalLoaded, fetchOnMount]);
  
  useEffect(() => {
    if (activeTopic && Object.keys(channels).length && fetchOnMount && url.startsWith("/workspace")) {
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
  if (Object.keys(workspaceTimeline).length && activeTopic && workspaceTimeline[activeTopic.id]) {
    timeline = workspaceTimeline[activeTopic.id]
  }

  return {
    folders,
    sortedWorkspaces: Object.values(workspaces).sort((a, b) => a.name.localeCompare(b.name)),
    workspaces,
    workspace: activeTopic,
    actions: actions,
    workspacesLoaded,
    timeline,
  };
};

export default useWorkspace;
