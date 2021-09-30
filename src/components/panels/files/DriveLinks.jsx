import React from "react";
import { useSelector } from "react-redux";
import { DriveLink } from ".";

const DriveLinks = (props) => {
  const { disableOptions, params = null } = props;
  const driveLinks = useSelector((state) => (params && params.workspaceId && state.files.workspaceFiles[params.workspaceId] ? state.files.workspaceFiles[params.workspaceId].driveLinks : state.files.companyFiles.driveLinks));

  if (driveLinks) {
    return Object.values(driveLinks).map((d) => {
      return <DriveLink key={d.id} className="col-xl-3 col-lg-4 col-md-6 col-sm-12" link={d} disableOptions={disableOptions} />;
    });
  } else {
    return null;
  }
};

export default DriveLinks;
