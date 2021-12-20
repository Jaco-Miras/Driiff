import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getWIPComments } from "../../redux/actions/wipActions";

const useWIPComments = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const WIPComments = useSelector((state) => state.wip.WIPComments);

  let comments = [];

  if (params.wipId && WIPComments[params.wipId]) {
    comments = Object.values(WIPComments[params.wipId].comments);
  }

  useEffect(() => {
    dispatch(getWIPComments({ proposal_id: params.wipId }));
  }, []);

  return {
    comments,
  };
};

export default useWIPComments;
