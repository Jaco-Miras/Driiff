import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { addToModals } from "../../../redux/actions/globalActions";
import { useCompanyFiles, useTranslationActions } from "../../hooks";
import { CompanyFilesBody, CompanyFilesHeader, CompanyFilesSidebar } from "../files/company";

const Wrapper = styled.div`
  .app-sidebar-menu {
    overflow: hidden;
    outline: currentcolor none medium;
  }
`;

const CompanyFilesPanel = (props) => {
  const { className = "", isMember, workspace } = props;

  const dispatch = useDispatch();
  const history = useHistory();
  const { _t } = useTranslationActions();
  const { params, isLoaded, files, fileCount, actions, fileIds, folders, folder, subFolders, loadMore } = useCompanyFiles();

  const [filter, setFilter] = useState("");
  const [search, setSearch] = useState("");

  const refs = {
    dropZone: useRef(null),
  };

  let disableOptions = false;
  if (workspace && workspace.active === 0) disableOptions = true;

  const handleFilterFile = (e) => {
    if (params.hasOwnProperty("folderId")) {
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
    actions.searchCompany(search);
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
    createFolder: _t("FILE.CREATE_FOLDER", "Create folder"),
    create: _t("FILE.CREATE", "Create"),
    updateFolder: _t("FILE.UPDATE_FOLDER", "Update folder"),
    update: _t("FILE.UPDATE", "Update"),
    editFolder: _t("FILE.EDIT_FOLDER", "Edit folder"),
    removeFolder: _t("FILE.REMOVE_FOLDER", "Remove folder"),
    add: _t("FILE.ADD", "Add"),
    favorite: _t("FILE.FAVORITE", "Favorite"),
    favoriteTitle: _t("FILE.FAVORITE_TITLE", "Favorite"),
    file: _t("FILE.FILE", "File"),
    folder: _t("FILE.FOLDER", "Folder"),
    folders: _t("FILE.FOLDERS", "Folders"),
    allFiles: _t("FILES.ALL_FILES", "All files"),
    recentlyEdited: _t("FILES.RECENTLY_EDITED", "Recently edited"),
    removed: _t("FILES.REMOVED", "Removed"),
    searchInputPlaceholder: _t("FILES.SEARCH_INPUT_PLACEHOLDER", "Search by file or folder name"),
    uploadFiles: _t("FILE.UPLOAD_FILES", "Upload files"),
    driveLink: _t("BUTTON.DRIVE_LINK", "Drive link"),
  };

  const handleAddEditFolder = (f, mode = "create") => {
    const modal = {
      type: "files_folder",
      folder: mode === "create" ? null : f,
      params: params,
      mode: mode,
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
        <CompanyFilesSidebar
          init={isLoaded}
          actions={actions}
          isMember={isMember}
          clearFilter={clearFilter}
          params={params}
          dropZoneRef={refs.dropZone}
          className="col-lg-3"
          filterFile={handleFilterFile}
          filter={filter}
          fileCount={fileCount}
          folders={folders}
          activeFolder={folder}
          dictionary={dictionary}
          disableOptions={disableOptions}
        />
        <div className="col-lg-9 app-content mb-4">
          <div className="app-content-overlay" />
          <CompanyFilesHeader
            isMember={isMember}
            clearFilter={clearFilter}
            dropZoneRef={refs.dropZone}
            history={history}
            params={params}
            onSearch={handleSearch}
            onSearchChange={handleSearchChange}
            onEnter={handleEnter}
            files={files}
            handleAddEditFolder={handleAddEditFolder}
            folders={folders}
            dictionary={dictionary}
            disableOptions={disableOptions}
            onClickEmpty={clearSearch}
            value={search}
          />
          <CompanyFilesBody
            dropZoneRef={refs.dropZone}
            isLoaded={isLoaded}
            loadMore={loadMore}
            filter={filter}
            search={search}
            folders={folders}
            folder={folder}
            fileIds={fileIds}
            subFolders={subFolders}
            history={history}
            actions={actions}
            params={params}
            files={files}
            handleAddEditFolder={handleAddEditFolder}
            dictionary={dictionary}
            disableOptions={disableOptions}
          />
        </div>
      </div>
    </Wrapper>
  );
};

export default React.memo(CompanyFilesPanel);
