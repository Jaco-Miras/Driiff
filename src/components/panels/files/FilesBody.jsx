import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { SvgEmptyState, SvgIconFeather } from "../../common";
import { DropDocument } from "../../dropzone/DropDocument";
import { useToaster } from "../../hooks";
import { FileListItem, FolderListItem } from "../../list/file/item";
import { MoreOptions } from "../common";
import { FilesBreadcrumb, ImportantFiles, PopularFiles, RecentEditedFile, RemoveFiles } from "./index";

const Wrapper = styled.div`
  .card-body {
    position: relative;
    overflow: visible !important;
    padding-bottom: 12px;
    min-height: 100px;
    &::-webkit-scrollbar {
      display: none;
    }
    -ms-overflow-style: none;
    scrollbar-width: none;
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

const FilesBody = (props) => {
  const { className = "", dropZoneRef, filter, search, wsFiles, isMember, handleAddEditFolder, actions, params, folders, folder, fileIds, history, subFolders, dictionary, disableOptions } = props;

  const toaster = useToaster();
  const scrollRef = document.querySelector(".app-content-body");

  const user = useSelector((state) => state.session.user);

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
    let timestamp = Math.floor(Date.now() / 1000);
    let uploads = {
      files: attachedFiles.map((f) => {
        return {
          created_at: { timestamp: timestamp },
          download_link: null,
          folder_id: folder ? folder.id : null,
          id: require("shortid").generate(),
          is_favorite: false,
          link_id: null,
          link_index_id: null,
          link_type: "TOPIC",
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
      topic_id: parseInt(params.workspaceId),
      workspace_id: params.hasOwnProperty("folderId") ? parseInt(params.fileFolderId) : null,
    };
    actions.uploadingFiles(uploads);
    let formData = new FormData();
    for (const i in attachedFiles) {
      if (attachedFiles.hasOwnProperty(i)) {
        attachedFiles[i].ref_id = require("shortid").generate();
        formData.append("files[" + i + "]", attachedFiles[i]);
      }
    }

    let payload = {
      is_primary: 0,
      topic_id: params.workspaceId,
      files: formData,
    };
    if (params.fileFolderId) {
      payload = {
        ...payload,
        folder_id: params.fileFolderId,
      };
    }

    actions.uploadFiles(payload);
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
      actions.removeFolder(folder, params.workspaceId, cb);
    }
  };

  const handleEditFolder = () => {
    handleAddEditFolder(folder, "update");
  };

  useEffect(() => {
    if (showDropZone) {
      setShowDropZone(false);
    }
  }, [wsFiles]);

  useEffect(() => {
    if (showDropZone && !isMember) {
      toaster.warning("You are not a member of this workspace.");
    }
  }, [showDropZone]);

  return (
    <Wrapper className={`files-body card app-content-body ${className}`} onDragOver={handleShowDropZone}>
      {!disableOptions && (
        <DropDocument
          ref={dropZoneRef}
          hide={!(showDropZone && isMember === true)}
          onDragLeave={handleHideDropZone}
          onDrop={({ acceptedFiles }) => {
            dropAction(acceptedFiles);
          }}
          onCancel={handleHideDropZone}
          params={params}
        />
      )}
      <div className="card-body">
        {folder && isMember && filter !== "removed" && !disableOptions && (
          <MoreButton moreButton="settings">
            <div onClick={handleEditFolder}>{dictionary.editFolder}</div>
            <div onClick={handleRemoveFolder}>{dictionary.removeFolder}</div>
          </MoreButton>
        )}

        {filter === "removed" && wsFiles && wsFiles.hasOwnProperty("trash_files") && (Object.keys(wsFiles.trash_files).length > 0 || Object.values(folders).filter((f) => f.is_archived).length > 0) && (
          <SvgIconFeather icon="trash" onClick={actions.removeTrashFiles} />
        )}
        {filter === "" && (
          <>
            {typeof params.fileFolderId === "undefined" && <h6 className="font-size-11 text-uppercase mb-4">{dictionary.allFiles}</h6>}

            {folder && folder.search && <FilesBreadcrumb folder={folder} history={history} dictionary={dictionary} folders={folders} workspaceID={params.workspaceId} />}

            {
              <div className="row">
                {params.hasOwnProperty("fileFolderId")
                  ? subFolders
                      .filter((f) => !f.is_archived)
                      .map((f) => {
                        return (
                          <FolderListItem
                            key={f.id}
                            actions={actions}
                            className="col-xl-3 col-lg-4 col-md-6 col-sm-12"
                            disableOptions={disableOptions}
                            folder={f}
                            history={history}
                            isMember={isMember}
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
                          <FolderListItem
                            key={f.id}
                            actions={actions}
                            className="col-xl-3 col-lg-4 col-md-6 col-sm-12"
                            disableOptions={disableOptions}
                            folder={f}
                            history={history}
                            isMember={isMember}
                            params={params}
                            handleAddEditFolder={handleAddEditFolder}
                          />
                        );
                      })}
              </div>
            }
            {typeof params.fileFolderId !== "undefined" ? (
              <>
                {folder ? (
                  <>
                    <h6 className="font-size-11 text-uppercase mb-4">{folder.search}</h6>
                    <div className="row">
                      {wsFiles &&
                        fileIds.map((f) => {
                          if (wsFiles.files.hasOwnProperty(f)) {
                            return (
                              <FileListItem key={f} isMember={isMember} scrollRef={scrollRef} actions={actions} className="col-xl-3 col-lg-4 col-md-6 col-sm-12" file={wsFiles.files[f]} folders={folders} disableOptions={disableOptions} />
                            );
                          } else return null;
                        })}
                    </div>
                    {wsFiles && fileIds.length === 0 && (
                      <EmptyState>
                        <SvgEmptyState icon={4} height={282} />
                        {isMember && (
                          <button className="btn btn-outline-primary btn-block" onClick={handleShowUploadModal} disabled={disableOptions}>
                            {dictionary.uploadFiles}
                          </button>
                        )}
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
                  {fileIds.map((f) => {
                    if (wsFiles.files.hasOwnProperty(f)) {
                      return <FileListItem key={f} isMember={isMember} scrollRef={scrollRef} actions={actions} className="col-xl-3 col-lg-4 col-md-6 col-sm-12" file={wsFiles.files[f]} folders={folders} disableOptions={disableOptions} />;
                    } else return null;
                  })}
                </div>
                {wsFiles.popular_files.length > 0 && <PopularFiles search={search} scrollRef={scrollRef} wsFiles={wsFiles} actions={actions} folders={folders} disableOptions={disableOptions} />}
                {wsFiles.recently_edited.length > 0 && <RecentEditedFile search={search} scrollRef={scrollRef} wsFiles={wsFiles} actions={actions} folders={folders} disableOptions={disableOptions} />}
              </>
            )}
            {fileIds.length === 0 && wsFiles.popular_files.length === 0 && wsFiles.recently_edited.length === 0 && (
              <EmptyState>
                <SvgEmptyState icon={4} height={282} />
                {isMember && (
                  <button className="btn btn-outline-primary btn-block" onClick={handleShowUploadModal} disabled={disableOptions}>
                    {dictionary.uploadFiles}
                  </button>
                )}
              </EmptyState>
            )}
          </>
        )}
        {filter === "recent" && (
          <>
            <RecentEditedFile search={search} scrollRef={scrollRef} wsFiles={wsFiles} actions={actions} folders={folders} disableOptions={disableOptions} />
            {!(wsFiles && wsFiles.recently_edited.length > 0) && (
              <EmptyState>
                <SvgEmptyState icon={4} height={282} />
              </EmptyState>
            )}
          </>
        )}
        {filter === "important" && (
          <>
            <ImportantFiles search={search} scrollRef={scrollRef} wsFiles={wsFiles} folders={folders} actions={actions} />
            {!(wsFiles && wsFiles.hasOwnProperty("favorite_files") && wsFiles.favorite_files.length > 0) && (
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
            <RemoveFiles
              scrollRef={scrollRef}
              search={search}
              wsFiles={wsFiles}
              actions={actions}
              isMember={isMember}
              params={params}
              folders={folders}
              subFolders={subFolders}
              handleAddEditFolder={handleAddEditFolder}
              folder={folder}
              disableOptions={disableOptions}
            />
            {!(wsFiles && wsFiles.hasOwnProperty("trash_files") && Object.keys(wsFiles.trash_files).length > 0) && !(Object.values(folders).some((f) => f.is_archived) || subFolders.some((f) => f.is_archived)) && (
              <EmptyState>
                <SvgEmptyState icon={4} height={282} />
              </EmptyState>
            )}
          </>
        )}
      </div>
    </Wrapper>
  );
};

export default React.memo(FilesBody);
