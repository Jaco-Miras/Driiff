import {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useParams, useHistory, useRouteMatch} from "react-router-dom";
import {addToChannels, getChannel, setSelectedChannel, restoreLastVisitedChannel} from "../../redux/actions/chatActions";
import {setUserSettings} from "../../redux/actions/settingsActions";
import {getWorkspaces, setActiveTopic} from "../../redux/actions/workspaceActions";

const useSetWorkspace = () => {

    const dispatch = useDispatch();
    const params = useParams();
    const history = useHistory();
    const match = useRouteMatch();
    const activeTopic = useSelector(state => state.workspaces.activeTopic);
    const workspacesLoaded = useSelector(state => state.workspaces.workspacesLoaded);
    const workspaces = useSelector(state => state.workspaces.workspaces);

    useEffect(() => {
        if (!workspacesLoaded) {
            dispatch(
                getWorkspaces({is_external: 0}, (err, res) => {
                    if (err) return;
                    if (params.hasOwnProperty("workspaceId") && params.workspaceId !== undefined) {
                        let topic = null;
                        let wsfolder = null;
                        for(const i in res.data.workspaces) {
                            const ws = res.data.workspaces[i];

                            if (ws.type === "FOLDER" && ws.topics.length) {
                                for(const i in ws.topics) {
                                    const t = ws.topics[i];
                                    if (t.id === parseInt(params.workspaceId)) {
                                        wsfolder = ws;
                                        topic = t;
                                        break;
                                    }
                                }
                            } else {
                                if (ws.id === parseInt(params.workspaceId)) {
                                    topic = ws;
                                    break;
                                }
                            }
                        }
                        if (topic && wsfolder) {
                            topic = {
                                ...topic,
                                selected: true,
                                is_external: wsfolder.is_external,
                                workspace_id: wsfolder.id,
                                workspace_name: wsfolder.name,
                                workspace_description: wsfolder.description,
                            };
                            dispatch(setActiveTopic(topic));
                        } else if (topic && wsfolder === null) {
                            topic = {
                                ...topic,
                                selected: true,
                            };
                            dispatch(setActiveTopic(topic));
                        }
                    }
                }),
            );
        }

        if (workspacesLoaded && activeTopic === null) {
            //set the active topic
            let topic = null;
            let channel_id = null;
            if (params.folderId !== undefined) {
                topic = workspaces[params.folderId].topics[params.workspaceId];
                channel_id = workspaces[params.folderId].topics[params.workspaceId].channel.id;
            } else if (params.workspaceId) {
                topic = workspaces[params.workspaceId];
                channel_id = workspaces[params.workspaceId].topic_detail.channel.id;
            }

            if (topic) {
                //dispatch(setActiveTopic(topic));
                if (topic.channel_loaded === undefined) {
                    dispatch(
                        getChannel({channel_id: channel_id}, (err, res) => {
                            if (err) return;
                            let channel = {
                                ...res.data,
                                hasMore: true,
                                skip: 0,
                                replies: [],
                                selected: true,
                            };
                            dispatch(addToChannels(channel));
                            dispatch(setSelectedChannel(channel));
                        }),
                    );
                }
            }
        }
    }, [workspacesLoaded, activeTopic]);

    useEffect(() => {
        if (activeTopic !== null) {
            dispatch(
                setUserSettings({
                    ACTIVE_TOPIC: {
                        topic: {
                            id: activeTopic.id,
                            name: activeTopic.name,
                        },
                        workspace: typeof activeTopic.workspace_name === "undefined" ? null : {
                            id: activeTopic.workspace_id,
                            name: activeTopic.workspace_name,
                        },
                    },
                }),
            );
        }
    }, [activeTopic]);

    useEffect(() => {
        //console.log(params)
        if (activeTopic && match.url === "/workspace/dashboard") {
            let path = `/workspace/dashboard/`;
            //let path = `/workspace/dashboard/${activeTopic.is_external === 0 ? "internal" : "external"}/`;
            if (activeTopic.workspace_id !== undefined) {
                path += `${activeTopic.workspace_id}/${activeTopic.workspace_name}/${activeTopic.id}/${activeTopic.name}/`;
                dispatch(restoreLastVisitedChannel({channel_id: activeTopic.channel.id}));
            } else {
                path += `${activeTopic.id}/${activeTopic.name}`;
                dispatch(restoreLastVisitedChannel({channel_id: activeTopic.topic_detail.channel.id}));
            }
            history.push(path);
        } else if (activeTopic && params.hasOwnProperty("workspaceId")) {
            //check if the active topic id is different in the params
            if (params.workspaceId !== undefined && parseInt(params.workspaceId) !== activeTopic.id) {
                //find the new topic id in workspaces and set to active
                if (params.hasOwnProperty("folderId")) {
                    let workspace = {...workspaces[params.folderId].topics[params.workspaceId]};
                    console.log(workspace)
                    if (workspace.hasOwnProperty("id")) {
                        dispatch(setActiveTopic(workspace));
                    }
                } else {
                    let workspace = {...workspaces[params.workspaceId]};
                    if (workspace.hasOwnProperty("id")) {
                        dispatch(setActiveTopic(workspace));
                    }
                }
            }
        }
    }, [activeTopic, match, params])
};

export default useSetWorkspace;