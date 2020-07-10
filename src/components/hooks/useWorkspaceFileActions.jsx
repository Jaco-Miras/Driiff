import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import {
  deleteWorkspaceFile,
  getWorkspaceFavoriteFiles,
  getWorkspaceFiles,
  getWorkspaceFilesDetail,
  getWorkspaceFolders,
  getWorkspacePopularFiles,
  getWorkspacePrimaryFiles,
  getWorkspaceRecentlyEditedFiles,
  getWorkspaceTrashFiles,
  restoreWorkspaceFile,
  uploadWorkspaceFile,
} from "../../redux/actions/fileActions";

const useWorkspaceFileActions = () => {
  const dispatch = useDispatch();

  /**
   * @param {number} workspaceId
   * @param {Object} payload
   * @param {number} [payload.skip=0]
   * @param {number} [payload.limit=1000]
   * @param {string} [payload.search]
   * @param {number} [payload.folder_id]
   */
  const fetch = useCallback(
    (workspaceId, filter = {}, callback = () => {}) => {
      let payload = {
        topic_id: workspaceId,
        skip: 0,
        limit: 1000,
        ...filter,
      };

      dispatch(getWorkspaceFiles(payload, callback));
    },
    [dispatch]
  );

  /**
   * @param {number} workspaceId
   * @param {Object} payload
   * @param {number} [payload.skip=0]
   * @param {number} [payload.limit=1000]
   * @param {string} [payload.search]
   * @param {number} [payload.folder_id]
   */
  const fetchPrimary = useCallback(
    (workspaceId, filter = {}, callback = () => {}) => {
      let payload = {
        topic_id: workspaceId,
        skip: 0,
        limit: 1000,
        ...filter,
      };

      dispatch(getWorkspacePrimaryFiles(payload, callback));
    },
    [dispatch]
  );

  /**
   * @param {number} workspaceId
   * @param {Object} payload
   * @param {number} [payload.skip=0]
   * @param {number} [payload.limit=1000]
   * @param {string} [payload.search]
   */
  const fetchRecentlyEdited = useCallback(
    (workspaceId, filter = {}, callback = () => {}) => {
      let payload = {
        topic_id: workspaceId,
        skip: 0,
        limit: 1000,
        ...filter,
      };

      dispatch(getWorkspaceRecentlyEditedFiles(payload, callback));
    },
    [dispatch]
  );

  /**
   * @param {number} workspaceId
   * @param {Object} payload
   * @param {number} [payload.skip=0]
   * @param {number} [payload.limit=1000]
   * @param {string} [payload.search]
   */
  const fetchImportant = useCallback(
    (workspaceId, filter = {}, callback = () => {}) => {
      let payload = {
        topic_id: workspaceId,
        skip: 0,
        limit: 1000,
        ...filter,
      };

      dispatch(getWorkspaceFavoriteFiles(payload, callback));
    },
    [dispatch]
  );

  /**
   * @param {number} workspaceId
   * @param {Object} payload
   * @param {number} [payload.skip=0]
   * @param {number} [payload.limit=1000]
   * @param {string} [payload.search]
   */
  const fetchRemoved = useCallback(
    (workspaceId, filter = {}, callback = () => {}) => {
      let payload = {
        topic_id: workspaceId,
        skip: 0,
        limit: 1000,
        ...filter,
      };

      dispatch(getWorkspaceTrashFiles(payload, callback));
    },
    [dispatch]
  );

  /**
   * @param {number} workspaceId
   * @param {Object} payload
   * @param {number} [payload.skip=0]
   * @param {number} [payload.limit=1000]
   * @param {string} [payload.search]
   */
  const fetchPopular = useCallback(
    (workspaceId, filter = {}, callback = () => {}) => {
      let payload = {
        topic_id: workspaceId,
        skip: 0,
        limit: 1000,
        ...filter,
      };

      dispatch(getWorkspacePopularFiles(payload, callback));
    },
    [dispatch]
  );

  /**
   * @param {number} workspaceId
   * @param {Object} payload
   * @param {number} [payload.skip=0]
   * @param {number} [payload.limit=1000]
   * @param {string} [payload.search]
   */
  const fetchFolders = useCallback(
    (workspaceId, filter = {}, callback = () => {}) => {
      let payload = {
        topic_id: workspaceId,
        skip: 0,
        limit: 1000,
        ...filter,
      };

      dispatch(getWorkspaceFolders(payload, callback));
    },
    [dispatch]
  );

  /**
   * @param {number} workspaceId
   * @param {Object} payload
   * @param {number} [payload.skip=0]
   * @param {number} [payload.limit=1000]
   * @param {string} [payload.search]
   */
  const fetchStats = useCallback(
    (workspaceId, callback = () => {}) => {
      let payload = {
        topic_id: workspaceId,
      };

      dispatch(getWorkspaceFilesDetail(payload, callback));
    },
    [dispatch]
  );

  /**
   * @param {number} workspaceId
   * @param {Object} file
   */
  const create = useCallback(
    (workspaceId, file, callback = () => {}) => {
      let payload = {
        topic_id: workspaceId,
        ...file,
      };

      dispatch(uploadWorkspaceFile(payload, callback));
    },
    [dispatch]
  );

  /**
   * @param {Object} file
   */
  const remove = useCallback(
    (file, callback = () => {}) => {
      let payload = {
        link_type: file.link_type,
        link_id: file.link_id,
        file_id: file.id,
      };

      dispatch(deleteWorkspaceFile(payload, callback));
    },
    [dispatch]
  );

  /**
   * @param {Object} file
   */
  const restore = useCallback(
    (file, callback = () => {}) => {
      let payload = {
        link_type: file.link_type,
        link_id: file.link_id,
        file_id: file.id,
      };

      dispatch(restoreWorkspaceFile(payload, callback));
    },
    [dispatch]
  );

  return {
    create,
    remove,
    restore,
    fetch,
    fetchPrimary,
    fetchRecentlyEdited,
    fetchImportant,
    fetchRemoved,
    fetchPopular,
    fetchStats,
    fetchFolders,
  };
};

export default useWorkspaceFileActions;
