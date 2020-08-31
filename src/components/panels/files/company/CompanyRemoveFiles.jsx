import React from "react";
import {useHistory} from "react-router-dom";
import styled from "styled-components";
import {FileListItem, FolderListItem} from "../../../list/file/item";

const Wrapper = styled.div``;

const CompanyRemoveFiles = (props) => {
  const {className = "", actions, files, folders, subFolders, folder, params, handleAddEditFolder, disableOptions} = props;

  const history = useHistory();

  return (
    <Wrapper className={`remove-files ${className}`}>
      <h6 className="font-size-11 text-uppercase mb-4">Removed</h6>

      {folder && <h6 className="font-size-11 text-uppercase mb-4">{folder.search}</h6>}
      <div className="row">
        {params.hasOwnProperty("folderId")
          ? subFolders
            .filter((f) => f.is_archived)
            .map((f) => {
              return <FolderListItem
                key={f.id} actions={actions}
                className="col-xl-3 col-lg-4 col-md-6 col-sm-12" folder={f}
                history={history} params={params}
                handleAddEditFolder={handleAddEditFolder}
                disableOptions={disableOptions}/>;
            })
          : Object.values(folders)
            .filter((f) => f.is_archived)
            .map((f) => {
              return <FolderListItem
                key={f.id} actions={actions}
                className="col-xl-3 col-lg-4 col-md-6 col-sm-12" folder={f}
                history={history} params={params}
                handleAddEditFolder={handleAddEditFolder}
                disableOptions={disableOptions}/>;
            })}
      </div>
      <div className="row">
        {params.hasOwnProperty("folderId")
          ? files &&
          Object.values(files).length > 0 &&
          Object.values(files)
            .filter((f) => {
              if (folder) {
                return folder.id === f.folder_id;
              } else {
                return f.folder_id === null;
              }
            })
            .map((f) => {
              return <FileListItem
                key={f.id} forceDelete={true}
                className="col-xl-3 col-lg-4 col-md-6 col-sm-12" file={f}
                actions={actions} disableOptions={disableOptions}/>;
            })
          : files &&
          Object.values(files).length > 0 &&
          Object.values(files).map((f) => {
            if (typeof f !== "undefined") {
              return <FileListItem
                key={f.id} forceDelete={true}
                className="col-xl-3 col-lg-4 col-md-6 col-sm-12" file={f}
                actions={actions} disableOptions={disableOptions}/>;
            } else {
              return null;
            }
          })}
      </div>
    </Wrapper>
  );
};

export default React.memo(CompanyRemoveFiles);
