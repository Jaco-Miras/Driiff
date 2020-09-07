import {useCallback, useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {useParams} from "react-router-dom";
import {useFileActions} from "../hooks";

const useFiles = () => {
  const params = useParams();
  const fileActions = useFileActions(params);

  const activeTopic = useSelector((state) => state.workspaces.activeTopic);
  const {init, count, has_more, skip, limit, items: files, search_results, search_value} = useSelector((state) => state.files.companyFiles);
  const {init: initCompanyFolders, has_more: hasMoreCompanyFolders, skip: skipCompanyFolders, limit: limitCompanyFolders, items: folders} = useSelector((state) => state.files.companyFolders);
  const {init: initRecentlyEdited, has_more: hasMoreRecentlyEdited, skip: skipRecentlyEdited, limit: limitRecentlyEdited, items: itemsRecentlyEdited} = useSelector((state) => state.files.companyFiles.recently_edited);
  const {init: initFavoriteFiles, has_more: hasMoreFavoriteFiles, skip: skipFavoriteFiles, limit: limitFavoriteFiles, items: itemsFavoriteFiles} = useSelector((state) => state.files.companyFiles.favorite_files);
  const {init: initPopularFiles, has_more: hasMorePopularFiles, skip: skipPopularFiles, limit: limitPopularFiles, items: itemsPopularFiles} = useSelector((state) => state.files.companyFiles.popular_files);
  const {init: initTrashFiles, has_more: hasMoreTrashFiles, skip: skipTrashFiles, limit: limitTrashFiles, items: itemsTrashFiles} = useSelector((state) => state.files.companyFiles.trash_files);

  const googleDriveApiFiles = useSelector((state) => state.files.googleDriveApiFiles);

  const [folder, setFolder] = useState(null);
  const [fetchingFolders, setFetchingFolders] = useState(false);
  const [fetchingFiles, setFetchingFiles] = useState(false);
  const [fetchingFolderFiles, setFetchingFolderFiles] = useState(false);
  const [fetchingRecentlyEditedFiles, setFetchingRecentlyEditedFiles] = useState(false);
  const [fetchingFavoriteFiles, setFetchingFavoriteFiles] = useState(false);
  const [fetchingPopularFiles, setFetchingPopularFiles] = useState(false);
  const [fetchingTrashedFiles, setFetchingTrashedFiles] = useState(false);

  const loadMoreCompanyFolders = () => {
    if (!fetchingFolders && hasMoreCompanyFolders) {
      setFetchingFolders(true);
      fileActions.fetchCompanyFolders({
        skip: skipCompanyFolders,
        limit: limitCompanyFolders
      }, () => {
        setFetchingFolders(false);
      })
    }
  }

  const loadMoreFiles = () => {
    if (!fetchingFiles && has_more) {
      setFetchingFiles(true);
      fileActions.fetchCompanyFiles({
        skip: skip,
        limit: limit
      }, () => {
        setFetchingFiles(false);
      })
    }
  }

  const loadMoreFolderFiles = useCallback(() => {

    if (!folder || fetchingFolderFiles)
      return;

    setFetchingFolderFiles(true);

    if (folder.has_more) {
      setFetchingFiles(true);
      fileActions.fetchCompanyFiles({
        skip: folder.skip,
        limit: folder.limit,
        folder_id: folder.id
      }, () => {
        setFetchingFolderFiles(false);
      })
    }
  }, [folder, setFetchingFolderFiles])

  const loadMoreRecentEditedFiles = () => {
    if (!fetchingRecentlyEditedFiles && hasMoreRecentlyEdited) {
      setFetchingRecentlyEditedFiles(true);
      fileActions.fetchCompanyRecentEditedFiles({
        skip: skipRecentlyEdited,
        limit: limitRecentlyEdited
      }, () => {
        setFetchingRecentlyEditedFiles(false);
      })
    }
  }

  const loadMoreFavoriteFiles = () => {
    if (!fetchingFavoriteFiles && hasMoreFavoriteFiles) {
      setFetchingFavoriteFiles(true);
      fileActions.fetchCompanyFavoriteFiles({
        skip: skipFavoriteFiles,
        limit: limitFavoriteFiles
      }, () => {
        setFetchingFavoriteFiles(false);
      })
    }
  }

  const loadMorePopularFiles = () => {
    if (!fetchingPopularFiles && hasMorePopularFiles) {
      setFetchingPopularFiles(true);
      fileActions.fetchCompanyPopularFiles({
        skip: skipPopularFiles,
        limit: limitPopularFiles
      }, () => {
        setFetchingPopularFiles(false);
      })
    }
  }

  const loadMoreTrashedFiles = () => {
    if (!fetchingTrashedFiles && hasMoreTrashFiles) {
      setFetchingTrashedFiles(true);
      fileActions.fetchCompanyTrashedFiles({
        skip: skipTrashFiles,
        limit: limitTrashFiles
      }, () => {
        setFetchingTrashedFiles(false);
      })
    }
  }

  useEffect(() => {
    fileActions.fetchCompanyFilesDetail();

    if (!init) {
      loadMoreFiles();
    }

    if (!initCompanyFolders) {
      loadMoreCompanyFolders();
    }

    if (!initPopularFiles) {
      loadMorePopularFiles();
    }

    if (!initFavoriteFiles) {
      loadMoreFavoriteFiles();
    }

    if (!initRecentlyEdited) {
      loadMoreRecentEditedFiles();
    }

    if (!initTrashFiles) {
      loadMoreTrashedFiles();
    }
  }, []);

  useEffect(() => {
    if (params.folderId && !folder) {
      fileActions.fetchCompanyFolderBreadCrumbs({
        folder_id: params.folderId
      });

      if (typeof folders[params.folderId] !== "undefined") {
        setFolder(folders[params.folderId])
      }
    } else if (!params.folderId) {
      setFolder(null);
    }
  });

  useEffect(() => {
    if (folder) {
      if (!folder.init) {
        loadMoreFolderFiles();
      }
    }
  }, [folder]);

  let fileIds = [];

  if (search_value !== "") {
    fileIds = search_results.sort((a, b) => {
      return b > a ? 1 : -1;
    });
  } else if (params.hasOwnProperty("folderId") && folders.hasOwnProperty(params.folderId) && folders[params.folderId].hasOwnProperty("files")) {
    fileIds = Object.values(folders[params.folderId].files).sort((a, b) => {
      return b > a ? 1 : -1;
    });
  } else {
    fileIds = Object.values(files)
      //.filter((f) => f.folder_id === null)
      .map((f) => f.id)
      .sort((a, b) => {
        return b > a ? 1 : -1;
      });
  }

  return {
    params,
    isLoaded: init,
    files: {
      files: files,
      recently_edited: itemsRecentlyEdited,
      popular_files: itemsPopularFiles,
      favorite_files: itemsFavoriteFiles,
      trash_files: itemsTrashFiles,
    },
    fileCount: count,
    actions: fileActions,
    topic: activeTopic,
    fileIds: fileIds,
    folders: folders,
    subFolders: [],
    folder: folder,
    googleDriveApiFiles,
    loadMore: {
      files: loadMoreFiles,
      popularFiles: loadMorePopularFiles,
      favoriteFiles: loadMoreFavoriteFiles,
      trashFiles: loadMoreTrashedFiles,
    }
  };
};

export default useFiles;
