import {useCallback} from "react";
import {useDispatch} from "react-redux";
//import {useLocation, useHistory, useParams} from "react-router-dom";
// import toaster from "toasted-notes";
// import {addToModals} from "../../redux/actions/globalActions";
// import {copyTextToClipboard} from "../../helpers/commonFunctions";
// import {getBaseUrl} from "../../helpers/slugHelper";
// import {replaceChar} from "../../helpers/stringFormatter";
import {
    addPrimaryFiles,
    fetchDetail,
    fetchMembers,
    fetchPrimaryFiles
} from "../../redux/actions/workspaceActions";

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

    return {
        addPrimaryFilesToWorkspace,
        getDetail,
        getMembers,
        getPrimaryFiles,
    }
};

export default useWorkspaceActions;