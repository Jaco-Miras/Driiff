import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { SvgEmptyState, SvgIconFeather } from "../../../common";
import { DropDocument } from "../../../dropzone/DropDocument";
import { MoreOptions } from "../../common";
import { CompanyFilesBreadcrumb, CompanyImportantFiles, CompanyPopularFiles, CompanyRecentEditedFile, CompanyRemoveFiles } from "./index";
import { CompanyFileListItem, CompanyFolderListItem } from "../../../list/file/item/company";
import { DriveLinks } from "..";

const Wrapper = styled.div`
  body & {
    &.files-body.card {
      margin-bottom: 1rem;
    }
  }

  .app-lists {
    overflow: auto;
    &::-webkit-scrollbar {
      display: none;
    }
    -ms-overflow-style: none;
    scrollbar-width: none;
  }

  .card-body {
    position: relative;
    padding-bottom: 12px;

    .recent-new-group-wrapper {
      padding-right: 24px;
    }
  }
  .feather-trash {
    position: absolute;
    right: 10px;
    top: 10px;
    width: 18px;
    :hover {
      cursor: pointer;
    }
  }
`;

const MoreButton = styled(MoreOptions)`
  position: absolute;
  right: 10px;
  top: 10px;
  width: 18px;
`;

const EmptyState = styled.div`
  padding: 5rem 0;
  max-width: 375px;
  margin: auto;
  text-align: center;

  svg {
    display: block;
  }
  button {
    width: auto !important;
    margin: 2rem auto;
  }
`;

const EmptyStateLabel = styled.div`
  padding: 10px;
  p {
    margin: 0;
  }
`;

const CompanyFilesBody = (props) => {
  const { className = "", dropZoneRef, filter, search, files, handleAddEditFolder, actions, params, folders, folder, fileIds, history, subFolders, dictionary, disableOptions, loadMore, isLoaded } = props;

  const scrollRef = document.querySelector(".app-content-body");

  const user = useSelector((state) => state.session.user);

  const refs = {
    files: useRef(null),
    btnLoadMore: useRef(null),
  };

  const [showDropZone, setShowDropZone] = useState(false);

  const handleShowUploadModal = () => {
    if (dropZoneRef.current) {
      dropZoneRef.current.open();
    }
  };

  const handleHideDropZone = () => {
    setShowDropZone(false);
  };

  const handleShowDropZone = () => {
    if (!["recent", "important", "removed"].includes(filter)) {
      if (!showDropZone) {
        setShowDropZone(true);
      }
    }
  };

  const dropAction = (attachedFiles) => {
    setShowDropZone(false);

    const timestamp = Math.floor(Date.now() / 1000);

    let formData = new FormData();
    for (let i in attachedFiles) {
      if (attachedFiles.hasOwnProperty(i)) {
        attachedFiles[i].reference_id = require("shortid").generate();
        formData.append("files[" + i + "]", attachedFiles[i]);
      }
    }

    let uploads = {
      files: attachedFiles.map((f) => {
        return {
          created_at: { timestamp: timestamp },
          download_link: null,
          folder_id: folder ? folder.id : null,
          id: f.reference_id,
          reference_id: f.reference_id,
          is_favorite: false,
          link_id: null,
          link_index_id: null,
          link_type: "COMPANY",
          mime_type: f.type,
          search: f.name,
          size: f.size,
          type: f.type,
          updated_at: { timestamp: timestamp },
          user_id: user.id,
          view_link: null,
          uploading: true,
        };
      }),
      folder_id: folder ? folder.id : null,
    };
    actions.uploadingCompanyFiles(uploads);

    let payload = {
      is_primary: 0,
      files: formData,
    };
    if (params.folderId) {
      payload = {
        ...payload,
        folder_id: params.folderId,
      };
    }

    actions.uploadCompanyBulkFiles(payload);
  };

  const handleRemoveFolder = () => {
    if (folder) {
      let cb = (err, res) => {
        if (err) return;

        if (res) {
          let pathname = history.location.pathname.split("/folder/")[0];
          history.push(pathname);
        }
      };
      actions.removeFolder(folder, cb);
    }
  };

  const handleEditFolder = () => {
    handleAddEditFolder(folder, "update");
  };

  /**
   * @todo: must fill-out the entire screen with items
   */
  const initLoading = () => {
    loadMore.files();
  };

  const handleScroll = (e) => {
    if (e.target.dataset.loading === "false") {
      if (e.target.scrollTop + 500 >= e.target.scrollHeight - e.target.offsetHeight) {
        if (refs.btnLoadMore.current) refs.btnLoadMore.current.click();
      }
    }
  };

  useEffect(() => {
    if (!refs.files.current) return;

    let el = refs.files.current;
    if (el && el.dataset.loaded === "0") {
      initLoading();

      el.dataset.loaded = "1";
      refs.files.current.addEventListener("scroll", handleScroll, false);
      return () => refs.files.current.removeEventListener("scroll", handleScroll, false);
    }
  }, [refs.files.current]);

  return (
    <Wrapper className={`files-body card app-content-body ${className}`} onDragOver={handleShowDropZone}>
      <span className="d-none" ref={refs.btnLoadMore} onClick={loadMore.files}>
        Load more
      </span>
      {!disableOptions && (
        <DropDocument
          ref={dropZoneRef}
          hide={!showDropZone}
          onDragLeave={handleHideDropZone}
          onDrop={({ acceptedFiles }) => {
            dropAction(acceptedFiles);
          }}
          onCancel={handleHideDropZone}
          params={params}
        />
      )}
      <div ref={refs.files} className="card-body app-lists" data-loaded={0}>
        {typeof files !== "undefined" && (
          <>
            {folder && filter !== "removed" && !disableOptions && (
              <MoreButton moreButton="settings">
                <div onClick={handleEditFolder}>{dictionary.editFolder}</div>
                <div onClick={handleRemoveFolder}>{dictionary.removeFolder}</div>
              </MoreButton>
            )}

            {filter === "removed" && files && files.hasOwnProperty("trash_files") && (Object.keys(files.trash_files).length > 0 || Object.values(folders).filter((f) => f.is_archived).length > 0) && (
              <SvgIconFeather icon="trash" onClick={actions.removeAllCompanyTrashFiles} />
            )}
            {filter === "" && (
              <>
                {typeof params.folderId === "undefined" && <h6 className="font-size-11 text-uppercase mb-4">{dictionary.allFiles}</h6>}

                {folder && <CompanyFilesBreadcrumb folder={folder} history={history} dictionary={dictionary} folders={folders} />}

                {
                  <div className="row">
                    {params.hasOwnProperty("folderId")
                      ? subFolders
                          .filter((f) => !f.is_archived)
                          .map((f) => {
                            return (
                              <CompanyFolderListItem
                                key={f.id}
                                actions={actions}
                                className="col-xl-3 col-lg-4 col-md-6 col-sm-12"
                                disableOptions={disableOptions}
                                folder={f}
                                history={history}
                                params={params}
                                handleAddEditFolder={handleAddEditFolder}
                              />
                            );
                          })
                      : Object.values(folders)
                          .filter((f) => {
                            return f.parent_folder === null && !f.is_archived;
                          })
                          .map((f) => {
                            return (
                              <CompanyFolderListItem
                                key={f.id}
                                actions={actions}
                                className="col-xl-3 col-lg-4 col-md-6 col-sm-12"
                                disableOptions={disableOptions}
                                folder={f}
                                history={history}
                                params={params}
                                handleAddEditFolder={handleAddEditFolder}
                              />
                            );
                          })}
                  </div>
                }
                {typeof params.folderId !== "undefined" ? (
                  <>
                    {folder ? (
                      <>
                        <h6 className="font-size-11 text-uppercase mb-4">{folder.search}</h6>
                        <div className="row">
                          {files &&
                            fileIds.map((f) => {
                              if (files.files.hasOwnProperty(f)) {
                                return (
                                  <CompanyFileListItem
                                    key={f}
                                    scrollRef={scrollRef}
                                    actions={actions}
                                    folders={folders}
                                    className="col-xl-3 col-lg-4 col-md-6 col-sm-12"
                                    file={files.files[f]}
                                    files={files.files}
                                    disableOptions={disableOptions}
                                  />
                                );
                              } else return null;
                            })}
                        </div>
                        {files && fileIds.length === 0 && (
                          <EmptyState>
                            <SvgEmptyState icon={4} height={282} />
                            <button className="btn btn-outline-primary btn-block" onClick={handleShowUploadModal} disabled={disableOptions}>
                              {dictionary.uploadFiles}
                            </button>
                          </EmptyState>
                        )}
                      </>
                    ) : (
                      <></>
                    )}
                  </>
                ) : (
                  <>
                    <div className="row">
                      <DriveLinks disableOptions={disableOptions} />
                      {files &&
                        fileIds.map((f) => {
                          if (files.files.hasOwnProperty(f)) {
                            return (
                              <CompanyFileListItem
                                key={f}
                                scrollRef={scrollRef}
                                actions={actions}
                                folders={folders}
                                className="col-xl-3 col-lg-4 col-md-6 col-sm-12"
                                file={files.files[f]}
                                files={files.files}
                                disableOptions={disableOptions}
                              />
                            );
                          } else return null;
                        })}
                    </div>
                    {files && files.popular_files.length > 0 && (
                      <CompanyPopularFiles search={search} scrollRef={scrollRef} files={Object.values(files.files).filter((f) => files.popular_files.includes(f.id))} actions={actions} disableOptions={disableOptions} />
                    )}
                    {files && files.recently_edited.length > 0 && (
                      <CompanyRecentEditedFile search={search} scrollRef={scrollRef} files={Object.values(files.files).filter((f) => files.recently_edited.includes(f.id))} actions={actions} disableOptions={disableOptions} />
                    )}
                    {isLoaded && files.popular_files.length === 0 && files.recently_edited.length === 0 && fileIds.length === 0 && Object.values(folders).filter((f) => f.is_archived !== true).length === 0 && subFolders.length === 0 && (
                      <EmptyState>
                        <SvgEmptyState icon={4} height={282} />
                        <button className="btn btn-outline-primary btn-block" onClick={handleShowUploadModal} disabled={disableOptions}>
                          {dictionary.uploadFiles}
                        </button>
                      </EmptyState>
                    )}
                    {!isLoaded && <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true" />}
                  </>
                )}
              </>
            )}
            {filter === "recent" && (
              <>
                <CompanyRecentEditedFile search={search} scrollRef={scrollRef} files={Object.values(files.files).filter((f) => files.recently_edited.includes(f.id))} actions={actions} disableOptions={disableOptions} />
                {!(files && files.recently_edited.length > 0) && (
                  <EmptyState>
                    <SvgEmptyState icon={4} height={282} />
                  </EmptyState>
                )}
              </>
            )}
            {filter === "important" && (
              <>
                <CompanyImportantFiles search={search} scrollRef={scrollRef} files={Object.values(files.files).filter((f) => files.favorite_files.includes(f.id))} actions={actions} dictionary={dictionary} />
                {!(files && files.hasOwnProperty("favorite_files") && files.favorite_files.length > 0) && (
                  <EmptyState>
                    <SvgEmptyState icon={4} height={282} />
                    <EmptyStateLabel>
                      <p>No favorite files.</p>
                      <p>Mark files as favorites that you want to easily find later.</p>
                    </EmptyStateLabel>
                  </EmptyState>
                )}
              </>
            )}
            {filter === "removed" && (
              <>
                <CompanyRemoveFiles
                  scrollRef={scrollRef}
                  search={search}
                  files={files.trash_files}
                  actions={actions}
                  params={params}
                  folders={folders}
                  subFolders={subFolders}
                  handleAddEditFolder={handleAddEditFolder}
                  folder={folder}
                  disableOptions={disableOptions}
                />
                {!(files && files.hasOwnProperty("trash_files") && Object.keys(files.trash_files).length > 0) && !(Object.values(folders).some((f) => f.is_archived) || subFolders.some((f) => f.is_archived)) && (
                  <EmptyState>
                    <SvgEmptyState icon={4} height={282} />
                  </EmptyState>
                )}
              </>
            )}
          </>
        )}
      </div>
    </Wrapper>
  );
};

export default React.memo(CompanyFilesBody);
