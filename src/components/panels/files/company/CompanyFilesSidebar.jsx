import React from "react";
import styled from "styled-components";
import {SvgIconFeather} from "../../../common";
import {CompanyFolderList} from "./index";
import {GoogleDrive} from "./../index";
import {ProgressBar} from "../../common";

const Wrapper = styled.div`
  text-align: left;
    @media (max-width: 768px) {
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

  ${(props) =>
  props.active &&
  `
        background: 0 0;
        color: #7a1b8b;
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

const CompanyFileSidebar = (props) => {
  const {
    className = "", actions, filterFile, filter = "all", dropZoneRef, storageLimit = 25,
    fileCount, folders, activeFolder, clearFilter, params, dictionary, disableOptions
  } = props;

  const handleShowUploadModal = () => {
    if (dropZoneRef.current) {
      dropZoneRef.current.open();
    }
  };

  const fileSizeUnit = actions.getFileSizeUnit(fileCount.storage);
  const storageAmount = fileCount.storage === 0 ? 0 : fileCount.storage < 1e9 / 10 ? 1e9 / 10 : fileCount.storage;

  const handleGoogleDriveSelect = (data) => {
    if (data.action === "picked") {
      data.docs.forEach(doc => {
        actions.uploadCompanyGoogleDriveFile(doc);
      });
    }
  }

  const closeMobileModal = () => {
    document.body.classList.remove("mobile-modal-open");
  };

  return (
    <Wrapper className={`file-sidebar bottom-modal-mobile ${className}`}>
      <MobileOverlayFilter className="mobile-overlay" onClick={closeMobileModal}/>
      <div className="card bottom-modal-mobile_inner">
        <div className="card-body">
          <button className="btn btn-primary btn-block file-upload-btn" onClick={handleShowUploadModal}
                  disabled={disableOptions}>
            {dictionary.uploadFiles}
          </button>
          <form className="d-none" id="file-upload">
            <input type="file" multiple=""/>
          </form>
        </div>
        <div className="app-sidebar-menu" tabIndex="1">
          <div className="list-group list-group-flush">
            <Filter onClick={filterFile} data-filter="" active={filter === ""}
                    className="list-group-item d-flex align-items-center">
              <Icon className="mr-2" icon="folder"/>
              {dictionary.allFiles}
              <span className="small ml-auto">{fileCount.all > 0 ? fileCount.all : null}</span>
            </Filter>
            {folders && Object.values(folders).filter((f) => !f.is_archived).length > 0 && (
              <Filter className="d-flex align-items-center folder-list">
                <ul>
                  {Object.values(folders)
                    .filter((f) => {
                      return !f.is_archived && f.parent_folder === null;
                    })
                    .map((f) => {
                      return <CompanyFolderList
                        key={f.id} clearFilter={clearFilter} folders={folders}
                        params={params} folder={f} activeFolder={activeFolder}/>;
                    })}
                </ul>
              </Filter>
            )}
            <GoogleDrive onChange={handleGoogleDriveSelect} disableOptions={disableOptions}/>
            <Filter onClick={filterFile} data-filter="recent" active={filter === "recent"}
                    className="list-group-item d-flex align-items-center">
              <Icon className="mr-2" icon="monitor"/>
              {dictionary.recentlyEdited}
            </Filter>
            <Filter onClick={filterFile} data-filter="important" active={filter === "important"}
                    className="list-group-item d-flex align-items-center">
              <Icon className="mr-2" icon="star"/>
              {dictionary.favorite}
              <span className="small ml-auto">{fileCount.stars > 0 ? fileCount.stars : null}</span>
            </Filter>
            <Filter onClick={filterFile} data-filter="removed" active={filter === "removed"}
                    className="list-group-item d-flex align-items-center">
              <Icon className="mr-2" icon="trash"/>
              {dictionary.removed}
              <span className="small ml-auto">{fileCount.trash > 0 ? fileCount.trash : null}</span>
            </Filter>
          </div>
          <div className="card-body">
            <h6 className="mb-4">Storage Status</h6>
            <div className="d-flex align-items-center">
              <div className="mr-3">
                <SvgIconFeather icon="database"/>
              </div>
              <div className="flex-grow-1">
                <ProgressBar amount={storageAmount} limit={storageLimit * 1e9}/>
                <div className="line-height-12 small text-muted mt-2">
                  {fileSizeUnit.size.toString().match(/^-?\d+(?:\.\d{0,2})?/)[0]}
                  {fileSizeUnit.unit} used of {storageLimit}GB
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default React.memo(CompanyFileSidebar);
