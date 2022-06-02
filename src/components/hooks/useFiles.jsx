import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useFileActions, useDriveLinkActions } from "../hooks";

const useFiles = (triggerFetch = false) => {
  const params = useParams();
  const fileActions = useFileActions();
  const { fetchTopicDriveLinks } = useDriveLinkActions();

  const activeTopic = useSelector((state) => state.workspaces.activeTopic);
  const sharedWs = useSelector((state) => state.workspaces.sharedWorkspaces);
  const { workspaceFiles, googleDriveApiFiles, gifBlobs, fileBlobs, fileThumbnailBlobs } = useSelector((state) => state.files);

  const [fetchingFiles, setFetchingFiles] = useState(false);

  useEffect(() => {
    if (triggerFetch) {
      if ((!fetchingFiles && activeTopic && !workspaceFiles.hasOwnProperty(activeTopic.id)) || (!fetchingFiles && activeTopic && workspaceFiles.hasOwnProperty(activeTopic.id) && !workspaceFiles[activeTopic.id].hasOwnProperty("loaded"))) {
        let payload = {
          topic_id: activeTopic.id,
        };
        const cb = (err, res) => {
          setFetchingFiles(false);
          fileActions.getFolders({ ...payload, sharedPayload: activeTopic.sharedSlug ? { slug: activeTopic.slug, token: sharedWs[activeTopic.slug].access_token, is_shared: true } : null });
          fileActions.getFilesDetail({ ...payload, sharedPayload: activeTopic.sharedSlug ? { slug: activeTopic.slug, token: sharedWs[activeTopic.slug].access_token, is_shared: true } : null });
          fileActions.getFavoriteFiles({ ...payload, sharedPayload: activeTopic.sharedSlug ? { slug: activeTopic.slug, token: sharedWs[activeTopic.slug].access_token, is_shared: true } : null });
          fileActions.getPopularFiles({ ...payload, sharedPayload: activeTopic.sharedSlug ? { slug: activeTopic.slug, token: sharedWs[activeTopic.slug].access_token, is_shared: true } : null });
          fileActions.getEditedFiles({ ...payload, sharedPayload: activeTopic.sharedSlug ? { slug: activeTopic.slug, token: sharedWs[activeTopic.slug].access_token, is_shared: true } : null });
          fileActions.getTrashFiles({ ...payload, sharedPayload: activeTopic.sharedSlug ? { slug: activeTopic.slug, token: sharedWs[activeTopic.slug].access_token, is_shared: true } : null });
          fileActions.getGoogleDriveFiles({ ...payload, sharedPayload: activeTopic.sharedSlug ? { slug: activeTopic.slug, token: sharedWs[activeTopic.slug].access_token, is_shared: true } : null });
          fileActions.getGoogleDriveFolders({ ...payload, sharedPayload: activeTopic.sharedSlug ? { slug: activeTopic.slug, token: sharedWs[activeTopic.slug].access_token, is_shared: true } : null });
          fetchTopicDriveLinks({ ...payload, sharedPayload: activeTopic.sharedSlug ? { slug: activeTopic.slug, token: sharedWs[activeTopic.slug].access_token, is_shared: true } : null });
        };
        setFetchingFiles(true);
        fileActions.getFiles({ ...payload, sharedPayload: activeTopic.sharedSlug ? { slug: activeTopic.slug, token: sharedWs[activeTopic.slug].access_token, is_shared: true } : null }, cb);
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
          if (activeTopic.sharedSlug) {
            const sharedPayload = { slug: activeTopic.slug, token: sharedWs[activeTopic.slug].access_token, is_shared: true };
            payload = {
              ...payload,
              sharedPayload: sharedPayload,
            };
          }
          fileActions.getFiles(payload, cb);
        }
      }
    }
  }, [fetchingFiles, activeTopic, workspaceFiles, params, sharedWs]);

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
