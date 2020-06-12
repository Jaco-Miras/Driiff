import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useParams} from "react-router-dom";
import {useWorkspaceActions} from "../hooks";

const useWorkspace = props => {

    const dispatch = useDispatch();
    const params = useParams();

    const workspaceActions = useWorkspaceActions();
    const activeTopic = useSelector(state => state.workspaces.activeTopic);
    const [fetchingPrimary, setFetchingPrimary] = useState(false);

    useEffect(() => {
        if (!fetchingPrimary && activeTopic && !activeTopic.hasOwnProperty("primary_files")) {
            setFetchingPrimary(true)
            const callback = (err,res) => {
                setFetchingPrimary(false)
                if (err) return;
                let payload = {
                    id: activeTopic.id,
                    folder_id: activeTopic.workspace_id,
                    files: res.data,
                }
                workspaceActions.addPrimaryFilesToWorkspace(payload);
            }
            workspaceActions.getPrimaryFiles(activeTopic.id,callback);
        }
    }, [fetchingPrimary, activeTopic]);

    return {
        workspace: activeTopic
    }
};

export default useWorkspace;