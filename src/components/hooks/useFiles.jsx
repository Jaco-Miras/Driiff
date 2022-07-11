import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useFileActions, useDriveLinkActions } from "../hooks";

const useFiles = (triggerFetch = false) => {
  const params = useParams();
  const fileActions = useFileActions();
  const { fetchTopicDriveLinks } = useDriveLinkActions();

  const activeTopic = useSelector((state) => state.workspaces.activeTopic);
  const user = useSelector((state) => state.session.user);
  const sharedWs = useSelector((state) => state.workspaces.sharedWorkspaces);
  const { workspaceFiles, googleDriveApiFiles, gifBlobs, fileBlobs, fileThumbnailBlobs } = useSelector((state) => state.files);

  const [fetchingFiles, setFetchingFiles] = useState(false);

  useEffect(() => {
    if (triggerFetch) {
      let hubKey = activeTopic ? `${activeTopic.id}-${activeTopic.slug}` : params.workspaceId;
      if ((!fetchingFiles && activeTopic && !workspaceFiles.hasOwnProperty(hubKey)) || (!fetchingFiles && activeTopic && workspaceFiles.hasOwnProperty(hubKey) && !workspaceFiles[hubKey].hasOwnProperty("loaded"))) {
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
          if (user.type === "internal" && activeTopic && activeTopic.team_channel && activeTopic.team_channel.code) {
            fileActions.fetchClientChatFiles({ topic_id: activeTopic.id, filter_by: "client" });
            fileActions.fetchTeamChatFiles({ topic_id: activeTopic.id, filter_by: "team" });
            fileActions.fetchPrivatePostFiles({ topic_id: activeTopic.id, filter_by: "privatePost" });
            fileActions.fetchClientPostFiles({ topic_id: activeTopic.id, filter_by: "clientPost" });
          }
          fetchTopicDriveLinks({ ...payload, sharedPayload: activeTopic.sharedSlug ? { slug: activeTopic.slug, token: sharedWs[activeTopic.slug].access_token, is_shared: true } : null });
        };
        setFetchingFiles(true);
        fileActions.getFiles({ ...payload, sharedPayload: activeTopic.sharedSlug ? { slug: activeTopic.slug, token: sharedWs[activeTopic.slug].access_token, is_shared: true } : null }, cb);
      }
      if (!fetchingFiles && activeTopic && workspaceFiles.hasOwnProperty(hubKey)) {
        if (params.hasOwnProperty("fileFolderId") && workspaceFiles[hubKey].folders.hasOwnProperty(params.fileFolderId) && !workspaceFiles[hubKey].folders[params.fileFolderId].hasOwnProperty("loaded")) {
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

  let hubKey = activeTopic ? `${activeTopic.id}-${activeTopic.slug}` : params.workspaceId;
  let fileIds = [];
  if (Object.values(workspaceFiles).length && workspaceFiles.hasOwnProperty(hubKey)) {
    if (params.hasOwnProperty("fileFolderId") && workspaceFiles[hubKey].folders.hasOwnProperty(params.fileFolderId) && workspaceFiles[hubKey].folders[params.fileFolderId].hasOwnProperty("files")) {
      fileIds = Object.values(workspaceFiles[hubKey].folders[params.fileFolderId].files).sort((a, b) => {
        return b > a ? 1 : -1;
      });
      if (workspaceFiles[hubKey].hasOwnProperty("search_results") && workspaceFiles[hubKey].search_results.length > 0) {
        fileIds = workspaceFiles[hubKey].search_results.sort((a, b) => {
          return b > a ? 1 : -1;
        });
      }
    } else {
      fileIds = Object.values(workspaceFiles[hubKey].files)
        .filter((f) => f.folder_id === null)
        .map((f) => f.id)
        .sort((a, b) => {
          return b > a ? 1 : -1;
        });
      if (workspaceFiles[hubKey].hasOwnProperty("search_results") && workspaceFiles[hubKey].search_results.length > 0) {
        fileIds = workspaceFiles[hubKey].search_results.sort((a, b) => {
          return b > a ? 1 : -1;
        });
      }
    }
  }

  const hasActiveTopic = activeTopic && workspaceFiles[hubKey];

  return {
    params,
    wsFiles: hasActiveTopic ? workspaceFiles[hubKey] : null,
    actions: fileActions,
    topic: activeTopic,
    fileIds: fileIds,
    folders: hasActiveTopic ? workspaceFiles[hubKey].folders : {},
    subFolders: hasActiveTopic ? Object.values(workspaceFiles[hubKey].folders).filter((f) => f.parent_folder && Number(f.parent_folder.id) === Number(params.fileFolderId)) : [],
    folder: hasActiveTopic ? workspaceFiles[hubKey].folders[params.fileFolderId] : null,
    googleDriveApiFiles,
    gifBlobs,
    fileBlobs,
    fileThumbnailBlobs,
  };
};

export default useFiles;
