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
            fileActions.getFiles({topic_id: activeTopic.id}, cb);   
        }
        if (!fetchingFiles && activeTopic && workspaceFiles.hasOwnProperty(activeTopic.id)) {
            if (params.hasOwnProperty("fileFolderId") && 
            workspaceFiles[activeTopic.id].folders.hasOwnProperty(params.fileFolderId) &&
            !workspaceFiles[activeTopic.id].folders[params.fileFolderId].hasOwnProperty("loaded")) {
                const cb = (err,res) => {
                    setFetchingFiles(false);
                };
                setFetchingFiles(true);
                
                let payload = {
                    topic_id: activeTopic.id,
                    folder_id: parseInt(params.fileFolderId)
                }
                fileActions.getFiles(payload, cb)
            }
        }
    }, [fetchingFiles, activeTopic, workspaceFiles, params]);

    if (Object.values(workspaceFiles).length && workspaceFiles.hasOwnProperty(params.workspaceId)) {
        if (params.hasOwnProperty("fileFolderId") && 
        workspaceFiles[activeTopic.id].folders.hasOwnProperty(params.fileFolderId) &&
        workspaceFiles[activeTopic.id].folders[params.fileFolderId].hasOwnProperty('files')) {
            return {
                params,
                wsFiles: workspaceFiles[activeTopic.id],
                actions: fileActions,
                topic: activeTopic,
                fileIds: Object.values(workspaceFiles[activeTopic.id].folders[params.fileFolderId].files),
                folders: Object.values(workspaceFiles[activeTopic.id].folders).filter(f => f.parent_folder == params.fileFolderId),
                folder:  workspaceFiles[activeTopic.id].folders[params.fileFolderId]
            };
        } else {
            return {
                params,
                wsFiles: workspaceFiles[activeTopic.id],
                actions: fileActions,
                topic: activeTopic,
                fileIds: Object.values(workspaceFiles[activeTopic.id].files).map(f => f.id),
                folders: workspaceFiles[activeTopic.id].folders,
                folder: null
            };
        }
    } else {
        return {
            params,
            wsFiles: null,
            actions: fileActions,
            topic: activeTopic,
            fileIds: [],
            folders: {},
            folder: null
        }
    }

};

export default useFiles;