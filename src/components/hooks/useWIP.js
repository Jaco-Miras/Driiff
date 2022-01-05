import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getSubjects } from "../../redux/actions/wipActions";
import { useWIPActions } from "./index";

const useWIP = () => {
  const params = useParams();
  const dispatch = useDispatch();
  //const activeTopic = useSelector((state) => state.workspaces.activeTopic);
  const actions = useWIPActions();
  const WIPs = useSelector((state) => state.wip.WIPs);

  let wip = null;
  let wips = {};
  let showGallery = false;

  if (params.wipId && WIPs[params.workspaceId]) {
    const items = WIPs[params.workspaceId].items;
    if (items[params.wipId]) wip = items[params.wipId];
  }

  if (WIPs[params.workspaceId]) {
    wips = WIPs[params.workspaceId].items;
  }
  if (params.wipFileId) {
    showGallery = true;
  }

  useEffect(() => {
    dispatch(getSubjects({ group_id: params.workspaceId }));
    if (params.workspaceId && !WIPs[params.workspaceId]) {
      actions.fetchWIPs({ topic_id: params.workspaceId }, (err, res) => {
        if (err) return;
        actions.storeWIPs({
          ...res.data,
          proposals: res.data.proposals.map((d) => {
            return {
              ...d,
              clap_user_ids: [],
              files: d.files.map((f) => {
                return {
                  ...f,
                  file_versions: f.file_versions.map((fv) => {
                    return { ...fv, annotations: [] };
                  }),
                };
              }),
            };
          }),
          topic_id: parseInt(params.workspaceId),
        });
      });
    }
    if (params.wipId) {
      actions.fetchWIPDetail({ wip_id: params.wipId });
    }
  }, []);

  return {
    wip,
    wips,
    showGallery,
  };
};

export default useWIP;
