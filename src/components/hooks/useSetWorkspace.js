import {useCallback, useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useHistory, useParams, useRouteMatch} from "react-router-dom";
import {replaceChar} from "../../helpers/stringFormatter";
import {
    addToChannels,
    clearSelectedChannel,
    getChannel,
    getWorkspaceChannels,
    restoreLastVisitedChannel,
    setSelectedChannel,
} from "../../redux/actions/chatActions";
import {getDrafts} from "../../redux/actions/globalActions";
import {getWorkspaces, setActiveTab, setActiveTopic} from "../../redux/actions/workspaceActions";
import {useSettings} from "./index";

const useSetWorkspace = () => {

    const {generalSettings: {active_topic: activeTopicSettings}, setGeneralSetting} = useSettings();

    const dispatch = useDispatch();
    const history = useHistory();
    const params = useParams();
    const match = useRouteMatch();
    const route = useRouteMatch();
    const {activeTopic, workspaces, workspacesLoaded, externalWorkspacesLoaded} = useSelector(state => state.workspaces);
    const channels = useSelector(state => state.chat.channels);
    const [init, setInit] = useState(false);
    const [exInit, setExInit] = useState(false);
    const [fetchingChannel, setFetchingChannel] = useState(false);

    const getAndSetChannel = useCallback((code) => {
        if (!fetchingChannel) {
            setFetchingChannel(true);
            dispatch(
                getChannel({code}, (err, res) => {
                    setFetchingChannel(false);
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
    }, [dispatch, fetchingChannel, setFetchingChannel]);

    useEffect(() => {
        dispatch(getDrafts());
        return () => {
            dispatch(clearSelectedChannel());
        };
    }, []);

    useEffect(() => {
        if (!init && !workspacesLoaded) {
            setInit(true);
            dispatch(
                getWorkspaceChannels({skip: 0, limit: 100})
            );
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
                                    if (ws.topics.hasOwnProperty(i)) {
                                        const t = ws.topics[i];
                                        if (t.id === parseInt(params.workspaceId)) {
                                            wsfolder = ws;
                                            topic = t;
                                            break;
                                        }
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
        } else if (init && !exInit && !externalWorkspacesLoaded) {
            setExInit(true);
            dispatch(
                getWorkspaces({is_external: 1}),
            );
        }

        if (workspacesLoaded && activeTopic === null && activeTopicSettings !== null) {
            //set the active topic
            let topic = null;
            if (params.folderId !== undefined && workspaces.hasOwnProperty(params.folderId)) {
                topic = workspaces[params.folderId].topics[params.workspaceId];
            } else if (workspaces.hasOwnProperty(params.workspaceId) && params.workspaceId) {
                topic = workspaces[params.workspaceId];
                //set active topic from settings
            } else {
                if (activeTopicSettings.workspace !== null && workspaces.hasOwnProperty(activeTopicSettings.workspace.id)
                    && workspaces[activeTopicSettings.workspace.id].topics.hasOwnProperty(activeTopicSettings.workspace.id)) {
                    topic = workspaces[activeTopicSettings.workspace.id].topics[activeTopicSettings.topic.id];
                    history.push(`${route.path}/${workspaces[activeTopicSettings.workspace.id].id}/${workspaces[activeTopicSettings.workspace.id].name}/${topic.id}/${topic.name}`);
                } else if (workspaces.hasOwnProperty(activeTopicSettings.topic.id)) {
                    topic = workspaces[activeTopicSettings.topic.id];
                    history.push(`${route.path}/${topic.id}/${topic.name}`);
                }
            }

            if (topic) {
                dispatch(
                    setActiveTab(topic.is_external === 0 ? "intern" : "extern"),
                );
                dispatch(setActiveTopic(topic));
            }
        }
    }, [externalWorkspacesLoaded, workspacesLoaded, activeTopic, dispatch, params, workspaces, init, exInit]);

    useEffect(() => {
        if (activeTopic !== null) {
            setGeneralSetting({
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
            });
        }
    }, [activeTopic]);

    useEffect(() => {
        //console.log(params)
        if (activeTopic && match.url === "/workspace/chat") {
            let path = `/workspace/chat/`;
            //let path = `/workspace/dashboard/${activeTopic.is_external === 0 ? "internal" : "external"}/`;
            if (activeTopic.workspace_id !== undefined) {
                path += `${activeTopic.workspace_id}/${replaceChar(activeTopic.workspace_name)}/${activeTopic.id}/${replaceChar(activeTopic.name)}/`;
                dispatch(restoreLastVisitedChannel({channel_id: activeTopic.channel.id}));
            } else {
                path += `${activeTopic.id}/${replaceChar(activeTopic.name)}`;

                if (activeTopic.topic_detail)
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
                        if (channels.hasOwnProperty(workspace.channel.id)) {
                            let channel = {...channels[workspace.channel.id]};
                            dispatch(setSelectedChannel(channel));
                        } else {
                            getAndSetChannel(workspace.channel.code);
                        }
                    }
                } else {
                    let workspace = {...workspaces[params.workspaceId]};
                    if (workspace.hasOwnProperty("id")) {
                        dispatch(setActiveTopic(workspace));
                        if (channels.hasOwnProperty(workspace.topic_detail.channel.id)) {
                            let channel = {...channels[workspace.topic_detail.channel.id]};
                            dispatch(setSelectedChannel(channel));
                        } else {
                            getAndSetChannel(workspace.topic_detail.channel.code);
                        }
                    }
                }
            }
            //when going back to workspace and the activeTopic id matches the id on the params
            else if (params.workspaceId !== undefined && parseInt(params.workspaceId) === activeTopic.id) {
                if (params.hasOwnProperty("folderId")) {
                    let workspace = {...workspaces[params.folderId].topics[params.workspaceId]};
                    if (workspace.hasOwnProperty("id") && workspace.channel) {
                        if (channels.hasOwnProperty(workspace.channel.id)) {
                            let channel = {...channels[workspace.channel.id]};
                            dispatch(setSelectedChannel(channel));
                        } else {
                            getAndSetChannel(workspace.channel.code);
                        }
                    }
                } else {
                    let workspace = {...workspaces[params.workspaceId]};
                    if (workspace.hasOwnProperty("id") && workspace.topic_detail) {
                        if (channels.hasOwnProperty(workspace.topic_detail.channel.id)) {
                            let channel = {...channels[workspace.topic_detail.channel.id]};
                            dispatch(setSelectedChannel(channel));
                        } else {
                            getAndSetChannel(workspace.topic_detail.channel.code);
                        }
                    }
                }
            }
        }
    }, [activeTopic, match, params]);

    return {
        getAndSetChannel,
    };
};

export default useSetWorkspace;