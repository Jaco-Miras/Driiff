import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getWorkspaceRemindersCount, updateWorkspaceRemindersCount } from "../../redux/actions/workspaceActions";

const useFetchWsCount = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const workspace = useSelector((state) => state.workspaces.activeTopic);
  const sharedWs = useSelector((state) => state.workspaces.sharedWorkspaces);
  const fetchWsCount = () => {
    let payload = {
      topic_id: params.workspaceId,
    };
    let key = params.workspaceId;
    if (workspace && workspace.sharedSlug) {
      payload = {
        ...payload,
        sharedPayload: { slug: workspace.slug, token: sharedWs[workspace.slug].access_token, is_shared: true },
      };
      key = workspace.key;
    }
    if (params.workspaceId) {
      dispatch(
        getWorkspaceRemindersCount(payload, (err, res) => {
          if (err) return;
          dispatch(updateWorkspaceRemindersCount({ count: res.data, id: key }));
        })
      );
    }
  };
  useEffect(() => {
    fetchWsCount();
  }, []);
};

export default useFetchWsCount;
