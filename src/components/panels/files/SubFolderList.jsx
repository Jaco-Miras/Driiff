import React from "react";
import FolderList from "./FolderList";

const SubFolderList = (props) => {
  const { className = "", folder, folders, activeFolder, clearFilter, params } = props;

  return <FolderList className={className} clearFilter={clearFilter} folders={folders} params={params} folder={folder} activeFolder={activeFolder} />;
};

export default SubFolderList;
