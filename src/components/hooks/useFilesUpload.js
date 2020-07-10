import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { postWorkspaceFiles, setProgressUploadFilesToWorkspace } from "../../redux/actions/fileActions";

const useFilesUpload = (props) => {
  const dispatch = useDispatch();
  const pendingWorkspaceFilesUpload = useSelector((state) => state.files.pendingWorkspaceFilesUpload);

  useEffect(() => {
    if (Object.keys(pendingWorkspaceFilesUpload).length !== 0) {
      Object.values(pendingWorkspaceFilesUpload).forEach((fileForUpload) => {
        dispatch(setProgressUploadFilesToWorkspace(fileForUpload));
        dispatch(postWorkspaceFiles(fileForUpload));
      });
    }
  }, [pendingWorkspaceFilesUpload]);
};

export default useFilesUpload;
