import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getFileComments } from "../../redux/actions/wipActions";

const useWIPFileComments = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const fileComments = useSelector((state) => state.wip.fileComments);

  let comments = [];

  if (params.wipId && fileComments[params.wipFileVersion]) {
    comments = Object.values(fileComments[params.wipFileVersion].comments);
  }

  useEffect(() => {
    dispatch(getFileComments({ file_version_id: params.wipFileVersion, skip: 0, limit: 20 }));
  }, [params.wipFileVersion]);

  return {
    comments,
  };
};

export default useWIPFileComments;
