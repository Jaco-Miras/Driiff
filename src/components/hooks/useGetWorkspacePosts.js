import {useEffect} from "react";
import {useSelector} from "react-redux";

const useGetWorkspacePosts = workspace_id => {

    const wsPosts = useSelector(state => state.workspaces.workspacePosts);

    if (Object.keys(wsPosts).length && wsPosts.hasOwnProperty(workspace_id)) {
        return wsPosts[workspace_id];
    } else {
        return null;
    }
    
};

export default useGetWorkspacePosts;