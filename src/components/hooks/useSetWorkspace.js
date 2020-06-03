import {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useHistory, useParams, useRouteMatch} from "react-router-dom";
import {
    addToChannels,
    getChannel,
    restoreLastVisitedChannel,
    setSelectedChannel,
} from "../../redux/actions/chatActions";
import {setUserGeneralSetting} from "../../redux/actions/settingsActions";
import {getWorkspaces, setActiveTopic, setActiveTab} from "../../redux/actions/workspaceActions";
import {replaceChar} from "../../helpers/stringFormatter";

const useSetWorkspace = () => {

    const dispatch = useDispatch();
    const history = useHistory();
    const params = useParams();
    const match = useRouteMatch();
    const route = useRouteMatch();
    const activeTopicSettings = useSelector(state => state.settings.user.GENERAL_SETTINGS.active_topic);
    const {activeTopic, workspaces, workspacesLoaded, externalWorkspacesLoaded} = useSelector(state => state.workspaces);
    const channels = useSelector(state => state.chat.channels);

    useEffect(() => {
        if (!workspacesLoaded) {
            dispatch(
                getWorkspaces({is_external: 0}, (err, res) => {
                    if (err) return;
                    if (params.hasOwnProperty("workspaceId") && params.workspaceId !== undefined) {
                        let topic = null;
                        let wsfolder = null;
                        for (const i in res.data.workspaces) {
                            const ws = res.data.workspaces[i];

                            if (ws.type === "FOLDER" && ws.topics.length) {
                                for (const i in ws.topics) {
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
        } else if (workspacesLoaded && !externalWorkspacesLoaded) {
            dispatch(
                getWorkspaces({is_external: 1})
            )
        }

        if (workspacesLoaded && activeTopic === null && activeTopicSettings !== null) {
            //set the active topic
            let topic = null;
            let channel_id = null;
            if (params.folderId !== undefined && workspaces.hasOwnProperty(params.folderId)) {
                topic = workspaces[params.folderId].topics[params.workspaceId];
                channel_id = workspaces[params.folderId].topics[params.workspaceId].channel.id;
            } else if (workspaces.hasOwnProperty(params.workspaceId) && params.workspaceId) {
                topic = workspaces[params.workspaceId];
                channel_id = workspaces[params.workspaceId].topic_detail.channel.id;

                //set active topic from settings
            } else {
                if (activeTopicSettings.workspace !== null && workspaces.hasOwnProperty(activeTopicSettings.workspace.id)
                    && workspaces[activeTopicSettings.workspace.id].topics.hasOwnProperty(activeTopicSettings.workspace.id)) {
                    topic = workspaces[activeTopicSettings.workspace.id].topics[activeTopicSettings.topic.id];
                    channel_id = workspaces[activeTopicSettings.workspace.id].topics[activeTopicSettings.topic.id].channel.id;
                    history.push(`${route.path}/${workspaces[activeTopicSettings.workspace.id].id}/${workspaces[activeTopicSettings.workspace.id].name}/${topic.id}/${topic.name}`);
                } else if (workspaces.hasOwnProperty(activeTopicSettings.topic.id)) {
                    topic = workspaces[activeTopicSettings.topic.id];
                    channel_id = workspaces[activeTopicSettings.topic.id].topic_detail.channel.id;
                    history.push(`${route.path}/${topic.id}/${topic.name}`);
                }
            }

            if (topic) {
                dispatch(
                    setActiveTab(topic.is_external === 0 ? "intern" : "extern")
                );
                dispatch(setActiveTopic(topic));
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
    }, [externalWorkspacesLoaded, workspacesLoaded, activeTopic, dispatch, params.folderId, params.workspaceId, workspaces]);

    useEffect(() => {
        if (activeTopic !== null) {
            dispatch(
                setUserGeneralSetting({
                    active_topic: {
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

    const getAndSetChannel = (channel_id) => {
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
    };

    useEffect(() => {
        //console.log(params)
        if (activeTopic && match.url === "/workspace/dashboard") {
            let path = `/workspace/dashboard/`;
            //let path = `/workspace/dashboard/${activeTopic.is_external === 0 ? "internal" : "external"}/`;
            if (activeTopic.workspace_id !== undefined) {
                path += `${activeTopic.workspace_id}/${replaceChar(activeTopic.workspace_name)}/${activeTopic.id}/${replaceChar(activeTopic.name)}/`;
                dispatch(restoreLastVisitedChannel({channel_id: activeTopic.channel.id}));
            } else {
                path += `${activeTopic.id}/${replaceChar(activeTopic.name)}`;
                dispatch(restoreLastVisitedChannel({channel_id: activeTopic.topic_detail.channel.id}));
            }
            history.push(path);
        } else if (activeTopic && params.hasOwnProperty("workspaceId")) {
            //check if the active topic id is different in the params
            // set the topic and the chat channel
            if (params.workspaceId !== undefined && parseInt(params.workspaceId) !== activeTopic.id) {
                //find the new topic id in workspaces and set to active
                if (params.hasOwnProperty("folderId")) {
                    let workspace = {...workspaces[params.folderId].topics[params.workspaceId]};
                    if (workspace.hasOwnProperty("id")) {
                        dispatch(setActiveTopic(workspace));
                        if (workspace.channel.channel_loaded === undefined) {
                            getAndSetChannel(workspace.channel.id);
                        } else {
                            if (channels.hasOwnProperty(workspace.channel.id)) {
                                let channel = {...channels[workspace.channel.id]};
                                dispatch(setSelectedChannel(channel));
                            }
                        }
                    }
                } else {
                    let workspace = {...workspaces[params.workspaceId]};
                    if (workspace.hasOwnProperty("id")) {
                        dispatch(setActiveTopic(workspace));
                        if (workspace.topic_detail.channel_loaded === undefined) {
                            getAndSetChannel(workspace.topic_detail.channel.id);
                        } else {
                            if (channels.hasOwnProperty(workspace.topic_detail.channel.id)) {
                                let channel = {...channels[workspace.topic_detail.channel.id]};
                                dispatch(setSelectedChannel(channel));
                            }
                        }
                    }
                }
            } 
            //when going back to workspace and the activeTopic id matches the id on the params
            else if (params.workspaceId !== undefined && parseInt(params.workspaceId) === activeTopic.id) {
                if (params.hasOwnProperty("folderId")) {
                    let workspace = {...workspaces[params.folderId].topics[params.workspaceId]};
                    if (workspace.hasOwnProperty("id")) {
                        if (workspace.channel_loaded === undefined) {
                            getAndSetChannel(workspace.channel.id);
                        } else {
                            if (channels.hasOwnProperty(workspace.channel.id)) {
                                let channel = {...channels[workspace.channel.id]};
                                dispatch(setSelectedChannel(channel));
                            }
                        }
                    }
                } else {
                    let workspace = {...workspaces[params.workspaceId]};
                    if (workspace.hasOwnProperty("id")) {
                        if (workspace.channel_loaded === undefined) {
                            getAndSetChannel(workspace.topic_detail.channel.id);
                        } else {
                            if (channels.hasOwnProperty(workspace.topic_detail.channel.id)) {
                                let channel = {...channels[workspace.topic_detail.channel.id]};
                                dispatch(setSelectedChannel(channel));
                            }
                        }
                    }
                }
            }
        }
    }, [activeTopic, match, params]);
};

export default useSetWorkspace;