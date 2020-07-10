import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useWorkspaceActions } from "../hooks";

const useWorkspace = () => {
  // const dispatch = useDispatch();
  const params = useParams();

  const workspaceActions = useWorkspaceActions();
  const { workspaces, activeTopic, workspaceTimeline, workspacesLoaded } = useSelector((state) => state.workspaces);
  const [fetchingPrimary, setFetchingPrimary] = useState(false);

  useEffect(() => {
    if (!fetchingPrimary && activeTopic && !activeTopic.hasOwnProperty("primary_files")) {
      setFetchingPrimary(true);
      const callback = (err, res) => {
        setTimeout(() => {
          setFetchingPrimary(false);
        }, 300);
        if (err) return;
        let payload = {
          id: activeTopic.id,
          folder_id: activeTopic.workspace_id,
          files: res.data,
        };
        workspaceActions.addPrimaryFilesToWorkspace(payload);
      };
      workspaceActions.getPrimaryFiles(activeTopic.id, callback);
      //transfer to teams component
      // if (!activeTopic.members[0].hasOwnProperty("role")) {
      //     workspaceActions.getMembers(activeTopic.id);
      // }
    }
  }, [fetchingPrimary, activeTopic]);

  let timeline = null;
  if (Object.keys(workspaceTimeline).length && workspaceTimeline.hasOwnProperty(params.workspaceId)) {
    timeline = workspaceTimeline[params.workspaceId].timeline;
  }

  return {
    workspaces,
    workspace: activeTopic,
    actions: workspaceActions,
    workspacesLoaded,
    timeline,
  };
};

export default useWorkspace;
