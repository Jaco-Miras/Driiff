import {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {useParams} from "react-router-dom";
import {useFileActions} from "../hooks";

const useFiles = () => {

    const params = useParams();
    const fileActions = useFileActions(params);

    const activeTopic = useSelector(state => state.workspaces.activeTopic);
    const workspaceFiles = useSelector(state => state.files.workspaceFiles);
    const [fetchingFiles, setFetchingFiles] = useState(false);
    
    useEffect(() => {
        if (!fetchingFiles && activeTopic && !workspaceFiles.hasOwnProperty(activeTopic.id) || 
            (!fetchingFiles && activeTopic && workspaceFiles.hasOwnProperty(activeTopic.id) && !workspaceFiles[activeTopic.id].hasOwnProperty("loaded")) ) {
            const cb = (err,res) => {
                setFetchingFiles(false);
                fileActions.getFolders({topic_id: activeTopic.id});
                fileActions.getFilesDetail(activeTopic.id);
                fileActions.getFavoriteFiles(activeTopic.id);
                fileActions.getPopularFiles(activeTopic.id);
                fileActions.getEditedFiles(activeTopic.id);
                fileActions.getTrashFiles(activeTopic.id);
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
                };
                fileActions.getFiles(payload, cb);
            }
        }
    }, [fetchingFiles, activeTopic, workspaceFiles, params]);

    if (Object.values(workspaceFiles).length && workspaceFiles.hasOwnProperty(params.workspaceId)) {
        if (params.hasOwnProperty("fileFolderId") && 
        workspaceFiles[activeTopic.id].folders.hasOwnProperty(params.fileFolderId) &&
        workspaceFiles[activeTopic.id].folders[params.fileFolderId].hasOwnProperty("files")) {

            let fileIds = Object.values(workspaceFiles[activeTopic.id].folders[params.fileFolderId].files).sort((a,b) => { return b > a ? 1 : -1;});
            if (workspaceFiles[activeTopic.id].hasOwnProperty("search_results") && workspaceFiles[activeTopic.id].search_results.length > 0) {
                fileIds = workspaceFiles[activeTopic.id].search_results.sort((a,b) => { return b > a ? 1 : -1;});
            }
            return {
                params,
                wsFiles: workspaceFiles[activeTopic.id],
                actions: fileActions,
                topic: activeTopic,
                fileIds: fileIds,
                folders: workspaceFiles[activeTopic.id].folders,
                subFolders: Object.values(workspaceFiles[activeTopic.id].folders).filter(f => f.parent_folder && f.parent_folder.id == params.fileFolderId),
                folder:  workspaceFiles[activeTopic.id].folders[params.fileFolderId],
            };
        } else {
            let fileIds = Object.values(workspaceFiles[activeTopic.id].files).map(f => f.id).sort((a,b) => { return b > a ? 1 : -1;});
            if (workspaceFiles[activeTopic.id].hasOwnProperty("search_results") && workspaceFiles[activeTopic.id].search_results.length > 0) {
                fileIds = workspaceFiles[activeTopic.id].search_results.sort((a,b) => { return b > a ? 1 : -1;});
            }
            return {
                params,
                wsFiles: workspaceFiles[activeTopic.id],
                actions: fileActions,
                topic: activeTopic,
                fileIds: fileIds,
                folders: workspaceFiles[activeTopic.id].folders,
                subFolders: [],
                folder: null,
            };
        }
    } else {
        return {
            params,
            wsFiles: activeTopic !== null ? workspaceFiles[activeTopic.id] : null,
            actions: fileActions,
            topic: activeTopic,
            fileIds: [],
            folders: {},
            subFolders: [],
            folder: null,
        };
    }

};

export default useFiles;