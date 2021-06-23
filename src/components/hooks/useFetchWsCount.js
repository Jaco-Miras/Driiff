import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { getWorkspaceRemindersCount, updateWorkspaceRemindersCount } from "../../redux/actions/workspaceActions";

const useFetchWsCount = () => {
  const dispatch = useDispatch();
  const params = useParams();

  const fetchWsCount = () => {
    let payload = {
      topic_id: params.workspaceId,
    };
    if (params.workspaceId) {
      dispatch(
        getWorkspaceRemindersCount(payload, (err, res) => {
          if (err) return;
          dispatch(updateWorkspaceRemindersCount({ count: res.data, id: payload.topic_id }));
        })
      );
    }
  };
  useEffect(() => {
    fetchWsCount();
  }, []);
};

export default useFetchWsCount;
