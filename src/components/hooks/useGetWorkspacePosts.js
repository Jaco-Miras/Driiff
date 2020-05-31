import {useEffect} from "react";
import {useParams} from "react-router-dom";
import {useSelector, useDispatch} from "react-redux";
import {addToWorkspacePosts, getWorkspacePosts} from "../../redux/actions/workspaceActions";

const useGetWorkspacePosts = () => {

    const dispatch = useDispatch();
    const params = useParams();
    const wsPosts = useSelector(state => state.workspaces.workspacePosts);

    useEffect(() => {
        if (params.workspaceId !== undefined) {
            if (!wsPosts.hasOwnProperty(params.workspaceId)) {
                dispatch(
                    getWorkspacePosts({topic_id: parseInt(params.workspaceId)}, (err,res) => {
                        console.log(res)
                        if (err) return;
                        dispatch(
                            addToWorkspacePosts({
                                topic_id: parseInt(params.workspaceId),
                                posts: res.data.posts
                            })
                        )
                    })
                );
            }
        }
    }, [params]);

    if (Object.keys(wsPosts).length && wsPosts.hasOwnProperty(params.workspaceId)) {
        let filter = wsPosts[params.workspaceId].filter;
        let sort =wsPosts[params.workspaceId].sort;
        if (filter !== null || sort !== null){
            if (sort && filter === null) {
                return Object.values(wsPosts[params.workspaceId].posts).sort((a,b) => {
                    if (sort === "asc") {
                        return a.updated_at.timestamp > b.updated_at.timestamp ? 1 : -1
                    } else {
                        return a.updated_at.timestamp < b.updated_at.timestamp ? 1 : -1
                    }
                })
            } else if (filter && sort === null) {
                return wsPosts[params.workspaceId].posts;
            } else {
                return wsPosts[params.workspaceId].posts;
            }
        } else {
            return wsPosts[params.workspaceId].posts;
        }
    } else {
        return null;
    }
    
};

export default useGetWorkspacePosts;