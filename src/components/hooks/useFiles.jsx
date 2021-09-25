import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useFileActions } from "../hooks";

const useFiles = (triggerFetch = false) => {
  const params = useParams();
  const fileActions = useFileActions(params);

  const activeTopic = useSelector((state) => state.workspaces.activeTopic);
  const user = useSelector((state) => state.session.user);
  const { workspaceFiles, googleDriveApiFiles, gifBlobs, fileBlobs, fileThumbnailBlobs } = useSelector((state) => state.files);

  const [fetchingFiles, setFetchingFiles] = useState(false);

  useEffect(() => {
    if (triggerFetch) {
      if ((!fetchingFiles && activeTopic && !workspaceFiles.hasOwnProperty(activeTopic.id)) || (!fetchingFiles && activeTopic && workspaceFiles.hasOwnProperty(activeTopic.id) && !workspaceFiles[activeTopic.id].hasOwnProperty("loaded"))) {
        const cb = (err, res) => {
          setFetchingFiles(false);
          fileActions.getFolders({ topic_id: activeTopic.id });
          fileActions.getFilesDetail(activeTopic.id);
          fileActions.getFavoriteFiles(activeTopic.id);
          fileActions.getPopularFiles(activeTopic.id);
          fileActions.getEditedFiles(activeTopic.id);
          fileActions.getTrashFiles(activeTopic.id);
          fileActions.getGoogleDriveFiles(activeTopic.id);
          fileActions.getGoogleDriveFolders(activeTopic.id);
          if (user.type === "internal" && activeTopic && activeTopic.team_channel && activeTopic.team_channel.code) {
            fileActions.fetchClientChatFiles({ topic_id: activeTopic.id, filter_by: "client" });
            fileActions.fetchTeamChatFiles({ topic_id: activeTopic.id, filter_by: "team" });
            fileActions.fetchPrivatePostFiles({ topic_id: activeTopic.id, filter_by: "privatePost" });
            fileActions.fetchClientPostFiles({ topic_id: activeTopic.id, filter_by: "clientPost" });
          }
        };
        setFetchingFiles(true);
        fileActions.getFiles({ topic_id: activeTopic.id }, cb);
      }
      if (!fetchingFiles && activeTopic && workspaceFiles.hasOwnProperty(activeTopic.id)) {
        if (params.hasOwnProperty("fileFolderId") && workspaceFiles[activeTopic.id].folders.hasOwnProperty(params.fileFolderId) && !workspaceFiles[activeTopic.id].folders[params.fileFolderId].hasOwnProperty("loaded")) {
          const cb = (err, res) => {
            setFetchingFiles(false);
          };
          setFetchingFiles(true);

          let payload = {
            topic_id: activeTopic.id,
            folder_id: parseInt(params.fileFolderId),
          };
          fileActions.getFiles(payload, cb);
        }
      }
    }
  }, [fetchingFiles, activeTopic, workspaceFiles, params]);

  let fileIds = [];
  if (Object.values(workspaceFiles).length && workspaceFiles.hasOwnProperty(params.workspaceId)) {
    if (params.hasOwnProperty("fileFolderId") && workspaceFiles[activeTopic.id].folders.hasOwnProperty(params.fileFolderId) && workspaceFiles[activeTopic.id].folders[params.fileFolderId].hasOwnProperty("files")) {
      fileIds = Object.values(workspaceFiles[activeTopic.id].folders[params.fileFolderId].files).sort((a, b) => {
        return b > a ? 1 : -1;
      });
      if (workspaceFiles[activeTopic.id].hasOwnProperty("search_results") && workspaceFiles[activeTopic.id].search_results.length > 0) {
        fileIds = workspaceFiles[activeTopic.id].search_results.sort((a, b) => {
          return b > a ? 1 : -1;
        });
      }
    } else {
      fileIds = Object.values(workspaceFiles[activeTopic.id].files)
        .filter((f) => f.folder_id === null)
        .map((f) => f.id)
        .sort((a, b) => {
          return b > a ? 1 : -1;
        });
      if (workspaceFiles[activeTopic.id].hasOwnProperty("search_results") && workspaceFiles[activeTopic.id].search_results.length > 0) {
        fileIds = workspaceFiles[activeTopic.id].search_results.sort((a, b) => {
          return b > a ? 1 : -1;
        });
      }
    }
  }

  const hasActiveTopic = activeTopic && workspaceFiles[activeTopic.id];

  return {
    params,
    wsFiles: hasActiveTopic ? workspaceFiles[activeTopic.id] : null,
    actions: fileActions,
    topic: activeTopic,
    fileIds: fileIds,
    folders: hasActiveTopic ? workspaceFiles[activeTopic.id].folders : {},
    subFolders: hasActiveTopic ? Object.values(workspaceFiles[activeTopic.id].folders).filter((f) => f.parent_folder && Number(f.parent_folder.id) === Number(params.fileFolderId)) : [],
    folder: hasActiveTopic ? workspaceFiles[activeTopic.id].folders[params.fileFolderId] : null,
    googleDriveApiFiles,
    gifBlobs,
    fileBlobs,
    fileThumbnailBlobs,
  };
};

export default useFiles;
