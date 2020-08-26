import React from "react";
import {CompanyFolderList} from "./index";

const CompanySubFolderList = (props) => {

  const {className = "", folder, folders, activeFolder, clearFilter, params} = props;

  return <CompanyFolderList
    className={className} clearFilter={clearFilter} folders={folders} params={params} folder={folder}
    activeFolder={activeFolder}/>;
};

export default CompanySubFolderList;
