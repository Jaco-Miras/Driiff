import React from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { DriveLink } from ".";

const DriveLinks = (props) => {
  const { disableOptions } = props;
  const params = useParams();
  const workspace = useSelector((state) => state.workspaces.activeTopic);
  let key = params.workspaceId;
  if (params && params.workspaceId && workspace) {
    key = `${params.workspaceId}-${workspace.slug}`;
  }
  const driveLinks = useSelector((state) => (params && params.workspaceId && state.files.workspaceFiles[key] ? state.files.workspaceFiles[key].driveLinks : state.files.companyFiles.driveLinks));

  if (driveLinks) {
    return Object.values(driveLinks)
      .filter((dl) => {
        if (params && params.workspaceId && params.fileFolderId) {
          return dl.folder_id === parseInt(params.fileFolderId);
        } else if (params && !params.workspaceId && params.folderId) {
          return dl.folder_id === parseInt(params.folderId);
        } else {
          return dl.folder_id === null;
        }
      })
      .map((d) => {
        return <DriveLink key={d.id} className="col-xl-3 col-lg-4 col-md-6 col-sm-12" link={d} disableOptions={disableOptions} />;
      });
  } else {
    return null;
  }
};

export default DriveLinks;
