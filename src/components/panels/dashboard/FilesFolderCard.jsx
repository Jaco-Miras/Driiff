import React from "react";
import styled from "styled-components";
import { useParams, useHistory } from "react-router-dom";
// import { useSelector, useDispatch } from "react-redux";
// import { getWorkspaceFolders, getWorkspaceFiles } from "../../../redux/actions/fileActions";
import { FolderListItem, FileListItem } from "../../list/file/item";
import { useIsMember, useFiles } from "../../hooks";
import { SvgIconFeather, ToolTip } from "../../common";

const Wrapper = styled.div`
  height: 100%;
  > span:first-child {
    display: flex;
    align-items: center;
    // font-weight: 600;
  }
  .feather {
    width: 1rem;
    height: 1rem;
  }
  .feather-info {
    margin-left: 0.5rem;
  }
  .app-file-list {
    margin-bottom: 0.5rem;
  }
  .row {
    overflow: auto;
    max-height: calc(100% - 40px);
  }
`;

const RedirectToFilesDiv = styled.div`
  position: absolute;
  left: 50%;
  transform: translate(-50%, 0);
  bottom: 5px;
  white-space: nowrap;
  cursor: pointer;
`;

const FilesFolderCard = (props) => {
  const { dictionary } = props;
  const params = useParams();
  const history = useHistory();
  const { wsFiles, topic: workspace, folders } = useFiles(true);

  const workspaceMembers = workspace
    ? workspace.members
        .map((m) => {
          if (m.member_ids) {
            return m.member_ids;
          } else return m.id;
        })
        .flat()
    : [];
  const isMember = useIsMember(workspace && workspace.member_ids.length ? [...new Set(workspaceMembers)] : []);
  const actions = {};
  const handleAddEditFolder = () => {};
  const handleRedirectToFiles = () => {
    history.push(history.location.pathname.replace("/dashboard", "/files"));
  };
  if (!wsFiles) return null;
  return (
    <Wrapper>
      <span>
        <SvgIconFeather icon="star" className="mr-2" /> <h5 className="card-title mb-0">{dictionary.foldersOrFilesShared}</h5>{" "}
        <ToolTip content={dictionary.foldersOrFilesSharedTooltip}>
          <SvgIconFeather icon="info" />
        </ToolTip>
      </span>
      {wsFiles.folders && Object.keys(wsFiles.folders).length > 0 && (
        <div className="row mt-2">
          {Object.values(wsFiles.folders)
            .filter((f) => {
              return f.parent_folder === null && !f.is_archived;
            })
            .map((f) => {
              return (
                <FolderListItem
                  key={f.id}
                  actions={actions}
                  className="col-xl-6 col-lg-6 col-md-6 col-sm-12"
                  disableOptions={true}
                  folder={f}
                  history={history}
                  isMember={isMember}
                  params={params}
                  handleAddEditFolder={handleAddEditFolder}
                />
              );
            })}
          {wsFiles.files &&
            Object.keys(wsFiles.files).length > 0 &&
            Object.values(wsFiles.files)
              .filter((f) => !f.folder_id)
              .map((f) => {
                return <FileListItem key={f.id} isMember={isMember} className="col-xl-6 col-lg-6 col-md-6 col-sm-12" file={f} folders={folders} disableOptions={true} hideOptions={true} />;
              })}
        </div>
      )}
      <RedirectToFilesDiv onClick={handleRedirectToFiles}>{dictionary.openAllSharedFiles}</RedirectToFilesDiv>
    </Wrapper>
  );
};

export default FilesFolderCard;
