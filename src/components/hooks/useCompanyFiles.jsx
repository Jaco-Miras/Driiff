import {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {useParams} from "react-router-dom";
import {useFileActions} from "../hooks";

let init = false;
const useFiles = () => {
  const params = useParams();
  const fileActions = useFileActions(params);

  const activeTopic = useSelector((state) => state.workspaces.activeTopic);
  const companyFiles = useSelector((state) => state.files.companyFiles);
  const googleDriveApiFiles = useSelector((state) => state.files.googleDriveApiFiles);
  const [fetchingFiles, setFetchingFiles] = useState(false);

  const loadMoreFiles = () => {

  }

  useEffect(() => {
    if (!init) {
      init = true;

      fileActions.fetchCompanyFiles({
        skip: 0,
        limit: 100
      })
    }
  }, []);

  return {
    params,
    files: companyFiles,
    actions: fileActions,
    topic: activeTopic,
    fileIds: [],
    folders: {},
    subFolders: [],
    folder: null,
    googleDriveApiFiles
  };
};

export default useFiles;
