import {useCallback} from "react";
import {useDispatch} from "react-redux";
//import {useLocation, useHistory, useParams} from "react-router-dom";
// import toaster from "toasted-notes";
// import {copyTextToClipboard} from "../../helpers/commonFunctions";
// import {getBaseUrl} from "../../helpers/slugHelper";
// import {replaceChar} from "../../helpers/stringFormatter";
import {
    addPrimaryFiles,
    fetchDetail,
    fetchMembers,
    fetchPrimaryFiles,
    fetchTimeline
} from "../../redux/actions/workspaceActions";
import {addToModals} from "../../redux/actions/globalActions";

const useWorkspaceActions = () => {

    const dispatch = useDispatch();

    const getDetail = useCallback((id, callback) => {
        dispatch(
            fetchDetail({topic_id: id}, callback)
        )
    }, [dispatch]);

    const getPrimaryFiles = useCallback((id, callback) => {
        dispatch(
            fetchPrimaryFiles({topic_id: id}, callback)
        )
    }, [dispatch]);

    const addPrimaryFilesToWorkspace = useCallback((files) => {
        dispatch(
            addPrimaryFiles(files)
        );
    }, [dispatch]);

    const getMembers = useCallback((id, callback) => {
        dispatch(
            fetchMembers({topic_id: id}, callback)
        )
    }, [dispatch]);

    const getTimeline = useCallback((id, callback) => {
        dispatch(
            fetchTimeline({topic_id: id}, callback)
        )
    }, [dispatch]);

    const showModal = useCallback((topic, mode, type = "workspace") => {
        let payload = {
            mode: mode,
            item: topic
        }
        if (type === "folder") {
            payload = {
                ...payload,
                type: "workspace_folder"
            };        
        } else {
            payload = {
                ...payload,
                type: "workspace_create_edit"
            };
        }

        dispatch(
            addToModals(payload),
        );
    }, [dispatch]);

    return {
        addPrimaryFilesToWorkspace,
        getDetail,
        getMembers,
        getPrimaryFiles,
        getTimeline,
        showModal,
    }
};

export default useWorkspaceActions;