import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

const useWIPFileSubComments = (parentId) => {
  const params = useParams();
  const fileComments = useSelector((state) => state.wip.fileComments);

  let comments = [];

  if (params.wipId && fileComments[params.wipFileVersion]) {
    comments = Object.values(fileComments[params.wipFileVersion].comments).filter((c) => c.parent_id === parentId);
  }

  return {
    comments,
  };
};

export default useWIPFileSubComments;
