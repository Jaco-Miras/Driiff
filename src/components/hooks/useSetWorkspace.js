import {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useParams} from "react-router-dom";
import {addToChannels, getChannel, setSelectedChannel} from "../../redux/actions/chatActions";
import {setActiveTopic} from "../../redux/actions/workspaceActions";

const useSetWorkspace = props => {

    const dispatch = useDispatch();
    const params = useParams();
    const activeTopic = useSelector(state => state.workspaces.activeTopic);
    const workspacesLoaded = useSelector(state => state.workspaces.workspacesLoaded);
    const workspaces = useSelector(state => state.workspaces.workspaces);

    useEffect(() => {
        if (workspacesLoaded && activeTopic === null) {
            //set the active topic
            let topic = null;
            let channel_id = null;
            if (params.wsfid !== undefined) {
                topic = workspaces[params.wsfid].topics[params.wsid];
                channel_id = workspaces[params.wsfid].topics[params.wsid].channel.id;
            } else {
                //direct workspace
                topic = workspaces[params.wsid];
                channel_id = workspaces[params.wsid].topic_detail.channel.id;
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
    }, [workspacesLoaded, activeTopic]);
};

export default useSetWorkspace;