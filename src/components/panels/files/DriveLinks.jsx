import React from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { DriveLink } from ".";

const DriveLinks = (props) => {
  const { disableOptions } = props;
  const params = useParams();
  const driveLinks = useSelector((state) => (params && params.workspaceId && state.files.workspaceFiles[params.workspaceId] ? state.files.workspaceFiles[params.workspaceId].driveLinks : state.files.companyFiles.driveLinks));
  console.log(driveLinks);
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
