import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { replaceChar } from "../../helpers/stringFormatter";
import { setActiveTopic } from "../../redux/actions/workspaceActions";

const useRedirect = () => {

    const dispatch = useDispatch();
    const history = useHistory();

    const toChannel = useCallback(
        (channel, callback) => {
            history.push(`/chat/${channel.code}`)
        }, []
    );

    const toChat = useCallback(
        (channel, message, callback) => {
            history.push(`/chat/${channel.code}/${message.code}`)
        }, []
    );

    const toFiles= useCallback(
        (payload, callback) => {
            
        }, []
    );
    
    const toPeople = useCallback(
        (user) => {
            history.push(`/profile/${user.id}/${replaceChar(user.name)}`)
        }, []
    );

    const toPost = useCallback(
        (payload) => {
            const { post, workspace } = payload;
            if (workspace) {
                dispatch(setActiveTopic(workspace));
                if (workspace.folder_id) {
                    history.push(`/workspace/posts/${workspace.folder_id}/${replaceChar(workspace.folder_name)}/${workspace.id}/${replaceChar(workspace.name)}/post/${post.id}/${replaceChar(post.title)}`);
                } else {
                    history.push(`/workspace/posts/${workspace.id}/${replaceChar(workspace.name)}/post/${post.id}/${replaceChar(post.title)}`);
                }
            }
        }, []
    );

    const toWorkspace = useCallback(
        (workspace) => {
            dispatch(setActiveTopic(workspace));
            if (workspace.folder_id) {
                history.push(`/workspace/chat/${workspace.folder_id}/${replaceChar(workspace.folder_name)}/${workspace.id}/${replaceChar(workspace.name)}`);
            } else {
                history.push(`/workspace/chat/${workspace.id}/${replaceChar(workspace.name)}`);
            }
        }, []
    );

    return {
        toChannel,
        toChat,
        toFiles,
        toPeople,
        toPost,
        toWorkspace
    }
};

export default useRedirect;