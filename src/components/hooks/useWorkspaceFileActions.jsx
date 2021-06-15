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
  const fetch = (workspaceId, filter = {}, callback = () => {}) => {
    let payload = {
      topic_id: workspaceId,
      skip: 0,
      limit: 1000,
      ...filter,
    };

    dispatch(getWorkspaceFiles(payload, callback));
  };

  /**
   * @param {number} workspaceId
   * @param {Object} payload
   * @param {number} [payload.skip=0]
   * @param {number} [payload.limit=1000]
   * @param {string} [payload.search]
   * @param {number} [payload.folder_id]
   */
  const fetchPrimary = (workspaceId, filter = {}, callback = () => {}) => {
    let payload = {
      topic_id: workspaceId,
      skip: 0,
      limit: 1000,
      ...filter,
    };

    dispatch(getWorkspacePrimaryFiles(payload, callback));
  };

  /**
   * @param {number} workspaceId
   * @param {Object} payload
   * @param {number} [payload.skip=0]
   * @param {number} [payload.limit=1000]
   * @param {string} [payload.search]
   */
  const fetchRecentlyEdited = (workspaceId, filter = {}, callback = () => {}) => {
    let payload = {
      topic_id: workspaceId,
      skip: 0,
      limit: 1000,
      ...filter,
    };

    dispatch(getWorkspaceRecentlyEditedFiles(payload, callback));
  };

  /**
   * @param {number} workspaceId
   * @param {Object} payload
   * @param {number} [payload.skip=0]
   * @param {number} [payload.limit=1000]
   * @param {string} [payload.search]
   */
  const fetchImportant = (workspaceId, filter = {}, callback = () => {}) => {
    let payload = {
      topic_id: workspaceId,
      skip: 0,
      limit: 1000,
      ...filter,
    };

    dispatch(getWorkspaceFavoriteFiles(payload, callback));
  };

  /**
   * @param {number} workspaceId
   * @param {Object} payload
   * @param {number} [payload.skip=0]
   * @param {number} [payload.limit=1000]
   * @param {string} [payload.search]
   */
  const fetchRemoved = (workspaceId, filter = {}, callback = () => {}) => {
    let payload = {
      topic_id: workspaceId,
      skip: 0,
      limit: 1000,
      ...filter,
    };

    dispatch(getWorkspaceTrashFiles(payload, callback));
  };

  /**
   * @param {number} workspaceId
   * @param {Object} payload
   * @param {number} [payload.skip=0]
   * @param {number} [payload.limit=1000]
   * @param {string} [payload.search]
   */
  const fetchPopular = (workspaceId, filter = {}, callback = () => {}) => {
    let payload = {
      topic_id: workspaceId,
      skip: 0,
      limit: 1000,
      ...filter,
    };

    dispatch(getWorkspacePopularFiles(payload, callback));
  };

  /**
   * @param {number} workspaceId
   * @param {Object} payload
   * @param {number} [payload.skip=0]
   * @param {number} [payload.limit=1000]
   * @param {string} [payload.search]
   */
  const fetchFolders = (workspaceId, filter = {}, callback = () => {}) => {
    let payload = {
      topic_id: workspaceId,
      skip: 0,
      limit: 1000,
      ...filter,
    };

    dispatch(getWorkspaceFolders(payload, callback));
  };

  /**
   * @param {number} workspaceId
   * @param {Object} payload
   * @param {number} [payload.skip=0]
   * @param {number} [payload.limit=1000]
   * @param {string} [payload.search]
   */
  const fetchStats = (workspaceId, callback = () => {}) => {
    let payload = {
      topic_id: workspaceId,
    };

    dispatch(getWorkspaceFilesDetail(payload, callback));
  };

  /**
   * @param {number} workspaceId
   * @param {Object} file
   */
  const create = (workspaceId, file, callback = () => {}) => {
    let payload = {
      topic_id: workspaceId,
      ...file,
    };

    dispatch(uploadWorkspaceFile(payload, callback));
  };

  /**
   * @param {Object} file
   */
  const remove = (file, callback = () => {}) => {
    let payload = {
      link_type: file.link_type,
      link_id: file.link_id,
      file_id: file.id,
    };

    dispatch(deleteWorkspaceFile(payload, callback));
  };

  /**
   * @param {Object} file
   */
  const restore = (file, callback = () => {}) => {
    let payload = {
      link_type: file.link_type,
      link_id: file.link_id,
      file_id: file.id,
    };

    dispatch(restoreWorkspaceFile(payload, callback));
  };

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
