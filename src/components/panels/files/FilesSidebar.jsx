import React from "react";
import styled from "styled-components";
import { SvgIconFeather } from "../../common";
import { ProgressBar } from "../common";
import { FolderList } from "./index";
import { useTranslationActions } from "../../hooks";
import { useSelector } from "react-redux";

const Wrapper = styled.div`
  text-align: left;
  @media (max-width: 991.99px) {
    .card {
      margin-bottom: 0;
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
      display: flex;
      .card-body {
        order: 2;
      }
      .app-sidebar-menu {
        order: 1;
        display: flex;
        flex-direction: column;

        .card-body {
          order: 1;
          border-bottom: 1px solid #ebebeb;
        }
        .list-group {
          order: 2;
          border-bottom: 1px solid #ebebeb;
        }
      }
    }
    .folder-list {
      display: none !important;
    }
  }
`;

const MobileOverlayFilter = styled.div``;

const Filter = styled.span`
  cursor: pointer;
  cursor: hand;

  ${(props) =>
    props.active &&
    `
        background: 0 0;
        color: ${props.theme.colors.secondary};
        &:after {
          content: "";
          width: 3px;
          height: 100%;
          background-color: ${props.theme.colors.secondary};
          display: block;
          position: absolute;
          top: 0;
          animation: fadeIn 0.15s linear;
          left: 0;
        }
        .dark & {
          color: ${props.theme.colors.third};
        }
    `}
  &.folder-list {
    border-bottom: 1px solid rgba(0, 0, 0, 0.125);
    > ul {
      list-style: none;
      padding: 0.75rem 1.5rem;
      width: 100%;
      margin: 0;

      li {
        margin-bottom: 5px;
      }
    }
  }
`;

const Icon = styled(SvgIconFeather)`
  width: 15px;
`;

const FileSidebar = (props) => {
  const { className = "", isMember, actions, filterFile, filter = "all", dropZoneRef, storageLimit = 25, wsFiles, folders, activeFolder, clearFilter, params, disableOptions, workspace } = props;

  const user = useSelector((state) => state.session.user);
  const isExternal = user.type === "external";
  const { _t } = useTranslationActions();

  const handleShowUploadModal = () => {
    if (dropZoneRef.current) {
      dropZoneRef.current.open();
    }
  };

  const fileSizeUnit = actions.getFileSizeUnit(wsFiles.storage);
  const storageAmount = wsFiles.storage === 0 ? 0 : wsFiles.storage < 1e9 / 10 ? 1e9 / 10 : wsFiles.storage;

  // const handleGoogleDriveSelect = (data) => {
  //   if (data.action === "picked") {
  //     data.docs.forEach((doc) => {
  //       actions.uploadWorkspaceGoogleDriveFile(params.workspaceId, doc);
  //     });
  //   }
  // };

  let dictionary = {
    uploadFiles: _t("FILE.UPLOAD_FILES", "Upload files"),
    allFiles: _t("FILES.ALL_FILES", "All files"),
    recentlyEdited: _t("FILES.RECENTLY_EDITED", "Recently edited"),
    favorite: _t("FILE.FAVORITE", "Favorite"),
    removed: _t("FILES.REMOVED", "Removed"),
    storageStatus: _t("FILES.STORAGE_STATUS", "Storage Status"),
    usedOf: _t("FILE.USED_OF", "used of"),
    gigabyte: _t("FILE.GIGABYTE", "GB"),
    teamChat: _t("FILES_SIDEBAR.TEAM_CHAT", "Team chat"),
    clientChat: _t("FILES_SIDEBAR.CLIENT_CHAT", "Client chat"),
    privatePost: _t("FILES_SIDEBAR.PRIVATE_POST", "Private post"),
    postWithClient: _t("FILES_SIDEBAR.POST_WITH_CLIENT", "Post with client"),
  };

  const closeMobileModal = () => {
    document.body.classList.remove("mobile-modal-open");
  };

  return (
    <Wrapper className={`file-sidebar bottom-modal-mobile ${className}`}>
      <MobileOverlayFilter className="mobile-overlay" onClick={closeMobileModal} />
      <div className="card bottom-modal-mobile_inner">
        {isMember === true && (
          <div className="card-body">
            <button className="btn btn-primary btn-block file-upload-btn" onClick={handleShowUploadModal} disabled={disableOptions}>
              {dictionary.uploadFiles}
            </button>
            <form className="d-none" id="file-upload">
              <input type="file" multiple="" />
            </form>
          </div>
        )}
        <div className="app-sidebar-menu" tabIndex="1">
          <div className="list-group list-group-flush">
            <Filter onClick={filterFile} data-filter="" active={filter === ""} className="list-group-item d-flex align-items-center">
              <Icon className="mr-2" icon="folder" />
              {dictionary.allFiles}
              <span className="small ml-auto">{wsFiles && wsFiles.count > 0 ? wsFiles.count : null}</span>
            </Filter>
            {folders && Object.values(folders).filter((f) => !f.is_archived).length > 0 && isMember === true && (
              <Filter className="d-flex align-items-center folder-list">
                <ul>
                  {Object.values(folders)
                    .filter((f) => {
                      return !f.is_archived && f.parent_folder === null;
                    })
                    .map((f) => {
                      return <FolderList key={f.id} clearFilter={clearFilter} folders={folders} params={params} folder={f} activeFolder={activeFolder} />;
                    })}
                </ul>
              </Filter>
            )}
            {/* <GoogleDrive onChange={handleGoogleDriveSelect} disableOptions={disableOptions} /> */}
            {!isExternal && workspace && workspace.team_channel && workspace.team_channel.code && (
              <>
                <Filter onClick={filterFile} data-filter="team" active={filter === "team"} className="list-group-item d-flex align-items-center">
                  <Icon className="mr-2" icon="eye-off" />
                  {dictionary.teamChat}
                </Filter>
                <Filter onClick={filterFile} data-filter="client" active={filter === "client"} className="list-group-item d-flex align-items-center">
                  <Icon className="mr-2" icon="eye" />
                  {dictionary.clientChat}
                </Filter>
                <Filter onClick={filterFile} data-filter="privatePost" active={filter === "privatePost"} className="list-group-item d-flex align-items-center">
                  <Icon className="mr-2" icon="eye-off" />
                  {dictionary.privatePost}
                </Filter>
                <Filter onClick={filterFile} data-filter="clientPost" active={filter === "clientPost"} className="list-group-item d-flex align-items-center">
                  <Icon className="mr-2" icon="eye" />
                  {dictionary.postWithClient}
                </Filter>
              </>
            )}

            <Filter onClick={filterFile} data-filter="recent" active={filter === "recent"} className="list-group-item d-flex align-items-center">
              <Icon className="mr-2" icon="monitor" />
              {dictionary.recentlyEdited}
            </Filter>
            <Filter onClick={filterFile} data-filter="important" active={filter === "important"} className="list-group-item d-flex align-items-center">
              <Icon className="mr-2" icon="star" />
              {dictionary.favorite}
              <span className="small ml-auto">{wsFiles && wsFiles.stars > 0 ? wsFiles.stars : null}</span>
            </Filter>
            <Filter onClick={filterFile} data-filter="removed" active={filter === "removed"} className="list-group-item d-flex align-items-center">
              <Icon className="mr-2" icon="trash" />
              {dictionary.removed}
              <span className="small ml-auto">{wsFiles && wsFiles.trash > 0 ? wsFiles.trash : null}</span>
            </Filter>
          </div>
          {typeof wsFiles !== "undefined" && wsFiles !== null && (
            <div className="card-body">
              <h6 className="mb-4">{dictionary.storageStatus}</h6>
              <div className="d-flex align-items-center">
                <div className="mr-3">
                  <SvgIconFeather icon="database" />
                </div>
                <div className="flex-grow-1">
                  <ProgressBar amount={storageAmount} limit={storageLimit * 1e9} />
                  <div className="line-height-12 small text-muted mt-2">
                    {fileSizeUnit.size.toString().match(/^-?\d+(?:\.\d{0,2})?/)[0]}
                    {fileSizeUnit.unit} {dictionary.usedOf} {storageLimit}
                    {dictionary.gigabyte}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Wrapper>
  );
};

export default React.memo(FileSidebar);
