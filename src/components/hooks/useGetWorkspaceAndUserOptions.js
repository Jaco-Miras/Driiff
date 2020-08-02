import { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";

const useGetWorkspaceAndUserOptions = (selectedWorkspaces, workspace) => {
  const { workspaces, folders } = useSelector((state) => state.workspaces);
  const [options, setOptions] = useState([]);
  const [userOptions, setUserOptions] = useState([]);

  useEffect(() => {
    if (workspace !== null) {
      let members = [];
      if (workspace.members && workspace.members.length) {
        members = workspace.members.map((m) => {
          return {
            ...m,
            value: m.id,
            label: m.name,
          };
        });
        setUserOptions(members);
      }
    }
  }, []);

  const unique = useCallback((a, i, c) => {
    return c.findIndex((u) => u.id === a.id) === i;
  }, []);

  useEffect(() => {
    if (Object.values(workspaces).length) {
      let workspaceOptions = [...Object.values(folders),...Object.values(workspaces)].map((ws) => {
        return {
          ...ws,
          value: ws.id,
          label: ws.name,
        };
      });

      if (selectedWorkspaces.length) {
        let wsMembers = selectedWorkspaces.map((ws) => {
          if (ws.members !== undefined && ws.members.length) {
            return ws.members;
          } else return [];
        });

        let uniqueMembers = [...wsMembers.flat()];
        //const unique = (a, i, c) => c.findIndex(u => u.id === a.id) === i
        uniqueMembers = uniqueMembers.filter(unique);

        if (uniqueMembers.length) {
          uniqueMembers = uniqueMembers.map((u) => {
            return {
              ...u,
              value: u.id,
              label: u.name,
            };
          });
          setUserOptions(uniqueMembers);
        }

        let selectedFolders = selectedWorkspaces.filter((ws) => ws.type === "FOLDER");
        if (selectedFolders.length) {
          // remove the ws topics under the selected folders
          workspaceOptions = workspaceOptions.filter((ws) => {
            if (ws.type === "WORKSPACE") {
              return !selectedFolders.some((f) => f.id === ws.folder_id);
            } else {
              return true;
            }
          });
          setOptions(workspaceOptions);
        } else {
          setOptions(workspaceOptions);
        }
      } else {
        setOptions(workspaceOptions);
      }
    } else {
      setOptions([]);
    }
  }, [workspaces, selectedWorkspaces]);

  return [options, userOptions];
};

export default useGetWorkspaceAndUserOptions;
