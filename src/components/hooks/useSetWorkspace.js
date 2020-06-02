import {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useParams, useRouteMatch, useHistory} from "react-router-dom";
import {addToChannels, getChannel, setSelectedChannel} from "../../redux/actions/chatActions";
import {setUserGeneralSetting} from "../../redux/actions/settingsActions";
import {setActiveTopic} from "../../redux/actions/workspaceActions";

const useSetWorkspace = () => {

    const dispatch = useDispatch();
    const history = useHistory();
    const params = useParams();
    const route = useRouteMatch();
    const activeTopicSettings = useSelector(state => state.settings.user.GENERAL_SETTINGS.active_topic);
    const activeTopic = useSelector(state => state.workspaces.activeTopic);
    const workspacesLoaded = useSelector(state => state.workspaces.workspacesLoaded);
    const workspaces = useSelector(state => state.workspaces.workspaces);

    useEffect(() => {
        if (workspacesLoaded && activeTopic === null && activeTopicSettings !== null) {
            //set the active topic
            let topic = null;
            let channel_id = null;
            if (params.folderId !== undefined) {
                topic = workspaces[params.folderId].topics[params.workspaceId];
                channel_id = workspaces[params.folderId].topics[params.workspaceId].channel.id;
            } else if (params.workspaceId) {
                topic = workspaces[params.workspaceId];
                channel_id = workspaces[params.workspaceId].topic_detail.channel.id;

                //set active topic from settings
            } else {
                if (activeTopicSettings.workspace !== null) {
                    topic = workspaces[activeTopicSettings.workspace.id].topics[activeTopicSettings.topic.id];
                    channel_id = workspaces[activeTopicSettings.workspace.id].topics[activeTopicSettings.topic.id].channel.id;
                    history.push(`${route.path}/${workspaces[activeTopicSettings.workspace.id].id}/${workspaces[activeTopicSettings.workspace.id].name}/${topic.id}/${topic.name}`);
                } else {
                    topic = workspaces[activeTopicSettings.topic.id];
                    channel_id = workspaces[activeTopicSettings.topic.id].topic_detail.channel.id;
                    history.push(`${route.path}/${topic.id}/${topic.name}`);
                }
            }

            if (topic) {
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
    }, [workspacesLoaded, activeTopic, dispatch, params.folderId, params.workspaceId, workspaces]);

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
};

export default useSetWorkspace;