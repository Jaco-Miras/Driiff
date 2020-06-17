import {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {useParams} from "react-router-dom";
import {useFileActions} from "../hooks";

const useFiles = () => {

    const fileActions = useFileActions();
    const params = useParams();

    const activeTopic = useSelector(state => state.workspaces.activeTopic);
    const workspaceFiles = useSelector(state => state.files.workspaceFiles);
    const [fetchingFiles, setFetchingFiles] = useState(false);
    
    useEffect(() => {
        if (!fetchingFiles && activeTopic && !workspaceFiles.hasOwnProperty(activeTopic.id)) {
            const cb = (err,res) => {
                setFetchingFiles(false);
                fileActions.getFilesDetail(activeTopic.id);
                fileActions.getPopularFiles(activeTopic.id);
                fileActions.getEditedFiles(activeTopic.id);
                fileActions.getFolders({topic_id: activeTopic.id});
            };
            setFetchingFiles(true);
            fileActions.getFiles(activeTopic.id, cb);   
        }
    }, [fetchingFiles, activeTopic, workspaceFiles]);

    if (Object.values(workspaceFiles).length && workspaceFiles.hasOwnProperty(params.workspaceId)) {
        if (params.hasOwnProperty("fileFolderId")) {
            return {
                params,
                wsFiles: workspaceFiles[activeTopic.id],
                actions: fileActions,
                topic: activeTopic,
                folders: Object.values(workspaceFiles[activeTopic.id].folders).filter(f => f.parent_folder == params.fileFolderId)
            };
        } else {
            return {
                params,
                wsFiles: workspaceFiles[activeTopic.id],
                actions: fileActions,
                topic: activeTopic,
                folders: workspaceFiles[activeTopic.id].folders
            };
        }
    } else {
        return {
            params,
            wsFiles: null,
            actions: fileActions,
            topic: activeTopic,
            folders: {},
        }
    }
    
};

export default useFiles;