import {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {useParams} from "react-router-dom";
import {useWorkspaceActions} from "../hooks";

const useWorkspace = props => {

    // const dispatch = useDispatch();
    const params = useParams();

    const workspaceActions = useWorkspaceActions();
    const activeTopic = useSelector(state => state.workspaces.activeTopic);
    const workspaceTimeline = useSelector(state => state.workspaces.workspaceTimeline);
    const [fetchingPrimary, setFetchingPrimary] = useState(false);
    const [fetchingTimeline, setFetchingTimeline] = useState(false);

    useEffect(() => {
        if (!fetchingPrimary && activeTopic && !activeTopic.hasOwnProperty("primary_files")) {
            setFetchingPrimary(true)
            const callback = (err,res) => {
                setTimeout(() => {
                    setFetchingPrimary(false)
                }, 300);
                if (err) return;
                let payload = {
                    id: activeTopic.id,
                    folder_id: activeTopic.workspace_id,
                    files: res.data,
                }
                workspaceActions.addPrimaryFilesToWorkspace(payload);
            }
            workspaceActions.getPrimaryFiles(activeTopic.id,callback);
            if (!activeTopic.members[0].hasOwnProperty("role")) {
                workspaceActions.getMembers(activeTopic.id);
            }
        }
    }, [fetchingPrimary, activeTopic]);

    useEffect(() => {
        if (activeTopic && !fetchingTimeline && !workspaceTimeline.hasOwnProperty(activeTopic.id)) {
            setFetchingTimeline(true);
            const cb = (err,res) => {
                setTimeout(() => {
                    setFetchingTimeline(false)
                }, 300);
            }
            workspaceActions.getTimeline(activeTopic.id, cb);
        }
    }, [fetchingTimeline, activeTopic, workspaceTimeline]);

    let timeline = null;
    if (Object.keys(workspaceTimeline).length && workspaceTimeline.hasOwnProperty(params.workspaceId)) {
        timeline = workspaceTimeline[params.workspaceId].timeline;
    }

    return {
        workspace: activeTopic,
        actions: workspaceActions,
        timeline
    }
};

export default useWorkspace;