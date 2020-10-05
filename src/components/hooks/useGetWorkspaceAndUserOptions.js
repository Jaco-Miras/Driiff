import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";

const useGetWorkspaceAndUserOptions = (selectedWorkspaces, workspace = null) => {
  const users = useSelector((state) => state.users.users);
  const { recipients } = useSelector((state) => state.global);
  const { workspaces, folders } = useSelector((state) => state.workspaces);
  const [options, setOptions] = useState([]);
  const [userOptions, setUserOptions] = useState([]);

  useEffect(() => {
    if (workspace !== null) {
      let members = [];
      if (workspace.members && workspace.members.length) {
        members = workspace.members.map((m) => {
          m.first_name = m.first_name === "" ? m.email : m.first_name;
          m.name = m.name === "" ? m.email : m.name;
          return {
            ...m,
            value: m.id,
            label: m.name,
          };
        });
        setUserOptions(members);
      }
    } else {
      setUserOptions(Object.values(users)
        .filter(u => u.type === "internal")
        .map(u => {
          return {
            ...u,
            value: u.id,
            label: u.name,
          };
        }));
    }
  }, []);

  const unique = useCallback((a, i, c) => {
    return c.findIndex((u) => u.id === a.id) === i;
  }, []);

  useEffect(() => {
    if (Object.values(workspaces).length) {
      let workspaceOptions = [...Object.values(folders), ...Object.values(workspaces)]
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((ws) => {
          return {
            ...ws,
            value: ws.id,
            label: ws.name
          };
        });

      const internalUsers = Object.values(users).filter(u => u.type === "internal").map(u => u);
      const company = recipients.find(r => r.main_department === true);
      workspaceOptions.unshift({
        ...company,
        member_ids: internalUsers.map(u => u.id),
        members: internalUsers.map(u => u),
        icon: "home",
        value: company.id,
        label: company.name
      });

      if (selectedWorkspaces.length) {
        let userOptionIds = userOptions.map(u => u.id);
        let newUserOptions = userOptions;
        selectedWorkspaces.forEach(ws => {
          if (ws.members) {
            ws.members.filter(m => !userOptionIds.includes(m.id)).forEach(u => {
              userOptionIds.push(u.id);
              newUserOptions.push({
                ...u,
                first_name: u.first_name === "" ? u.email : u.first_name,
                name: u.name === "" ? u.email : u.name,
                value: u.id,
                label: u.name,
              });
            });
          }
        });

        setUserOptions(newUserOptions);

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
