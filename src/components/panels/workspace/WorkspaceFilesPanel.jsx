import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { addToModals } from "../../../redux/actions/globalActions";
import { useFiles, useTranslationActions, useFetchWsCount } from "../../hooks";
import { FilesBody, FilesHeader, FilesSidebar } from "../files";

const Wrapper = styled.div`
  .app-sidebar-menu {
    overflow: hidden;
    outline: currentcolor none medium;
  }
`;

const WorkspaceFilesPanel = (props) => {
  const { className = "", isMember, workspace } = props;

  const isWorkspaceMember = isMember || workspace.sharedSlug;

  const dispatch = useDispatch();
  const history = useHistory();
  const { _t } = useTranslationActions();
  const { params, wsFiles, actions, topic, fileIds, folders, folder, subFolders } = useFiles(true); // pass true to trigger fetching of files

  useFetchWsCount();

  const [filter, setFilter] = useState("");
  const [search, setSearch] = useState("");

  const refs = {
    dropZone: useRef(null),
  };

  let disableOptions = false;
  if (workspace && workspace.active === 0) disableOptions = true;

  const handleFilterFile = (e) => {
    if (params.hasOwnProperty("fileFolderId")) {
      let pathname = history.location.pathname.split("/folder/")[0];
      history.push(pathname);
    }
    setFilter(e.target.dataset.filter);
    document.body.classList.remove("mobile-modal-open");
  };

  const handleSearchChange = (e) => {
    if (e.target.value === "") clearSearch();
    setSearch(e.target.value);
  };

  const handleSearch = () => {
    actions.search(search);
  };

  const clearSearch = () => {
    setSearch("");
    actions.clearSearch();
  };

  const handleEnter = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const dictionary = {
    createFolder: _t("CREATE_FOLDER", "Create folder"),
    create: _t("CREATE", "Create"),
    updateFolder: _t("UPDATE_FOLDER", "Update folder"),
    update: _t("UPDATE", "Update"),
    editFolder: _t("EDIT_FOLDER", "Edit folder"),
    removeFolder: _t("REMOVE_FOLDER", "Remove folder"),
    renameFolder: _t("RENAME.FOLDER", "Rename folder"),
    folderInfo: _t("FOLDER.INFO", "Folders help to organize your files. A file can only be connected to one folder."),
    renameFolderInfo: _t("RENAME.FOLDER_INFO", "Renaming the folder will update the folder name for everyone."),
    add: _t("ADD", "Add"),
    favorite: _t("FAVORITE", "Favorite"),
    file: _t("FILE", "File"),
    folder: _t("FOLDER", "Folder"),
    folderName: _t("FOLDER_NAME", "Folder name"),
    folders: _t("FOLDERS", "Folders"),
    allFiles: _t("FILES.ALL_FILES", "All files"),
    recentlyEdited: _t("FILES.RECENTLY_EDITED", "Recently edited"),
    removed: _t("FILES.REMOVED", "Removed"),
    searchInputPlaceholder: _t("FILES.SEARCH_INPUT_PLACEHOLDER", "Search by file or folder name"),
    uploadFiles: _t("UPLOAD_FILES", "Upload files"),
    driveLink: _t("BUTTON.DRIVE_LINK", "Drive link"),
  };

  const handleAddEditFolder = (f, mode = "create") => {
    const modal = {
      type: "files_folder",
      folder: mode === "create" ? null : f,
      params: params,
      mode: mode,
      topic_id: topic.id,
      parentFolder: folder ? folder : null,
    };
    dispatch(addToModals(modal));
  };

  const clearFilter = () => {
    setFilter("");
  };

  useEffect(() => {
    if (folder && folder.is_archived && filter !== "removed") {
      setFilter("removed");
    }
  }, [folder, filter, setFilter]);

  return (
    <Wrapper className={`container-fluid h-100 fadeIn ${className}`}>
      <div className="row app-block">
        {typeof wsFiles === "undefined" || wsFiles === null ? (
          <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true" />
        ) : (
          <>
            <FilesSidebar
              actions={actions}
              isMember={isWorkspaceMember}
              clearFilter={clearFilter}
              params={params}
              dropZoneRef={refs.dropZone}
              className="col-lg-3"
              filterFile={handleFilterFile}
              filter={filter}
              wsFiles={wsFiles}
              folders={folders}
              activeFolder={folder}
              dictionary={dictionary}
              disableOptions={disableOptions}
            />
            <div className="col-md-9 app-content mb-4">
              <div className="app-content-overlay" />
              <FilesHeader
                isMember={isWorkspaceMember}
                clearFilter={clearFilter}
                dropZoneRef={refs.dropZone}
                history={history}
                params={params}
                onSearch={handleSearch}
                onSearchChange={handleSearchChange}
                onEnter={handleEnter}
                wsFiles={wsFiles}
                handleAddEditFolder={handleAddEditFolder}
                folders={folders}
                dictionary={dictionary}
                disableOptions={disableOptions}
                onClickEmpty={clearSearch}
                value={search}
              />
              <FilesBody
                dropZoneRef={refs.dropZone}
                filter={filter}
                search={search}
                folders={folders}
                folder={folder}
                fileIds={fileIds}
                isMember={isWorkspaceMember}
                subFolders={subFolders}
                history={history}
                actions={actions}
                params={params}
                wsFiles={wsFiles}
                handleAddEditFolder={handleAddEditFolder}
                dictionary={dictionary}
                disableOptions={disableOptions}
              />
            </div>
          </>
        )}
      </div>
    </Wrapper>
  );
};

export default React.memo(WorkspaceFilesPanel);
