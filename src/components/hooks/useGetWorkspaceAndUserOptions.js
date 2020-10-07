import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "./index";

const useGetWorkspaceAndUserOptions = (
  selected = { workspaces: [], users: [] },
  defaultValue = { workspaces: [], users: [] }) => {

  const { _t } = useTranslation();

  const users = useSelector((state) => state.users.users);
  const { recipients } = useSelector((state) => state.global);
  const { workspaces, folders } = useSelector((state) => state.workspaces);

  const company = recipients.find(r => r.main_department === true);

  const [wsOptions, setWsOptions] = useState([]);

  const dictionary = {
    visibleAllInternal: _t("POST.VISIBLE_ALL_INTERNAL", "Visible to all internal members"),
    visibleAllWorkspace: _t("POST.VISIBLE_ALL_WORKSPACE", "Visible to all workspace members"),
    responsbileUsers: _t("POST.VISIBLE_RESPONSIBLE_USERS", "Visible to responsible users only"),
    addressedPeopleOnly: _t("POST.ADDRESSED_PEOPLE_ONLY", "Addressed people only"),
  };

  const getAddressedByOptionByValue = (is_personal, isCompanyPost = true) => {
    return {
      icon: is_personal ? "lock" : "unlock",
      value: is_personal,
      label: is_personal ? dictionary.addressedPeopleOnly : dictionary.visibleAllWorkspace,
    };
  };

  const getSelectedUsersWorkspace = (workspaces) => {
    let allOption = [];
    workspaces.forEach(ws => {
      allOption.push({
        ...ws,
        type: "WORKSPACE",
        first_name: `All: ${ws.name}`,
        id: `ws-${ws.id}`,
        value: `ws-${ws.id}`,
        label: `All: ${ws.name}`
      });
    });
    return allOption;
  };

  const getSelectedWorkspaceUser = (workspace) => {
    let allOption = [...(workspace.length ? [{
      ...workspace[0],
      type: "WORKSPACE",
      first_name: `All: ${workspace[0].name}`,
      id: `ws-${workspace[0].id}`,
      value: `ws-${workspace[0].id}`,
      label: `All: ${workspace[0].name}`
    }] : [])];
    return allOption;
  };

  const getCompanyAsWorkspace = () => {
    const internalUsers = Object.values(users).filter(u => u.type === "internal").map(u => u);
    return company && [{
      ...company,
      member_ids: internalUsers.map(u => u.id),
      members: internalUsers.map(u => u),
      icon: "home",
      id: `ws-${company.id}`,
      value: company.id,
      label: company.name
    }];
  };

  useEffect(() => {
    if (recipients.find(r => r.main_department === true)) {

      setWsOptions([
        ...(getCompanyAsWorkspace()),
        ...Object.values(folders),
        ...Object.values(workspaces)]
        .filter(ws => !selected.workspaces.some(sws => sws.id === ws.id))
        .sort((a, b) => {
          if (a.value === company.id) {
            return -1;
          }
          if (b.value === company.id) {
            return 1;
          }

          return a.name.localeCompare(b.name);
        })
        .map((ws) => {
          return {
            ...ws,
            value: ws.id,
            label: ws.name
          };
        }));
    }
  }, [recipients, workspaces]);

  let selectedUserIds = [];
  selected.users.forEach(su => {
    selectedUserIds = su.type === "WORKSPACE" ? [...selectedUserIds, ...su.member_ids] : [...selectedUserIds, su.id];
  });
  selectedUserIds = [...new Set(selectedUserIds)];

  let uniqueUserids = [...selectedUserIds];
  let userOptions = [];
  selected.workspaces.forEach(ws => {
    if (ws.members) {
      ws.members.filter(m => !uniqueUserids.includes(m.id)).forEach(u => {
        uniqueUserids.push(u.id);
        userOptions.push({
          ...u,
          first_name: u.first_name === "" ? u.email : u.first_name,
          name: u.name === "" ? u.email : u.name,
          value: u.id,
          label: u.name === "" ? u.email : u.name,
          type: "USER"
        });
      });
    }
  });

  return {
    getAddressedByOptionByValue,
    getCompanyAsWorkspace,
    getSelectedWorkspaceUser,
    getSelectedUsersWorkspace,
    workspaces: wsOptions,
    users: userOptions,
    selectedUserIds,
    isPersonal: userOptions.some(uo => uo.type === "USER")
  };
};

export default useGetWorkspaceAndUserOptions;
