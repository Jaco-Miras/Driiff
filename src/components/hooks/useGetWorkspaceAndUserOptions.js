import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useTranslationActions } from "./index";

const useGetWorkspaceAndUserOptions = (selected = { workspaces: [], users: [] }, defaultValue = { workspaces: [], users: [] }) => {
  const { _t } = useTranslationActions();

  const users = useSelector((state) => state.users.users);
  const { recipients } = useSelector((state) => state.global);
  const { workspaces, folders } = useSelector((state) => state.workspaces);

  const company = recipients.find((r) => r.main_department === true);

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
    workspaces.forEach((ws) => {
      allOption.push({
        ...ws,
        type: "WORKSPACE",
        first_name: `All: ${ws.name}`,
        id: `ws-${ws.id}`,
        value: `ws-${ws.id}`,
        label: `All: ${ws.name}`,
      });
    });
    return allOption;
  };

  const getSelectedWorkspaceUser = (workspace) => {
    let allOption = [
      ...(workspace.length
        ? [
            {
              ...workspace[0],
              type: "WORKSPACE",
              first_name: `All: ${workspace[0].name}`,
              id: `ws-${workspace[0].id}`,
              value: `ws-${workspace[0].id}`,
              label: `All: ${workspace[0].name}`,
              type_id: workspace[0].id,
            },
          ]
        : []),
    ];
    return allOption;
  };

  const getSelectedUsersValueByUsers = (selectedUsers) => {
    if (Object.values(selected.users).length > Object.values(selectedUsers).length) return selectedUsers;

    let workspaceIds = [];

    const userIds = [...new Set([...selectedUserIds, ...selectedUsers.filter((su) => su.type === "USER").map((su) => su.id)])];
    userOptions
      .filter((uo) => uo.type === "USER" && !userIds.includes(uo.value))
      .forEach((uo) => {
        workspaceIds = [...workspaceIds, ...uo.workspace_ids];
      });
    workspaceIds = [...new Set(workspaceIds)];

    const wsl = selected.workspaces
      .filter((ws) => !selectedUsers.filter((su) => su.type === "WORKSPACE").some((su) => su.type_id === ws.id))
      .forEach((ws) => {
        const member_ids = [...new Set(ws.member_ids)];
        if (member_ids.every((m) => userIds.includes(m))) {
          selectedUsers = selectedUsers.filter((su) => su.type === "WORKSPACE" || !(su.type === "USER" && member_ids.includes(su.value)));
          selectedUsers.push(getSelectedWorkspaceUser([ws])[0]);
        }
      });

    return selectedUsers;
  };

  const getSelectedUsersValueByWorkspaces = (selectedWorkspaces) => {
    return [
      ...selected.users.filter((su) => su.type === "USER" || (su.type === "WORKSPACE" && selectedWorkspaces.some((ws) => su.id.includes(`ws-${ws.id}`)))),
      ...getSelectedWorkspaceUser(selectedWorkspaces.filter((ws) => !selected.workspaces.some((sws) => sws.id === ws.id))),
    ];
  };

  const getCompanyAsWorkspace = () => {
    const internalUsers = Object.values(users)
      .filter((u) => u.type === "internal")
      .map((u) => u);
    return (
      company && [
        {
          ...company,
          member_ids: internalUsers.map((u) => u.id),
          members: internalUsers.map((u) => u),
          icon: "home",
          id: `ws-${company.id}`,
          value: company.id,
          label: company.name,
        },
      ]
    );
  };

  useEffect(() => {
    if (recipients.find((r) => r.main_department === true)) {
      setWsOptions(
        [...getCompanyAsWorkspace(), ...Object.values(folders), ...Object.values(workspaces)]
          .filter((ws) => !selected.workspaces.some((sws) => sws.id === ws.id))
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
              label: ws.name,
            };
          })
      );
    }
  }, [recipients, workspaces]);

  let selectedUserIds = [];
  selected.users.forEach((su) => {
    selectedUserIds = su.type === "WORKSPACE" ? [...selectedUserIds, ...su.member_ids] : [...selectedUserIds, su.id];
  });
  selectedUserIds = [...new Set(selectedUserIds)];

  let selectedAddressPeopleIds = selected.users.filter((su) => su.type === "USER").map((su) => su.id);
  let selectedUserAllWorkspacesIds = selected.users.filter((su) => su.type === "WORKSPACE").map((su) => parseInt(su.id.replaceAll("ws-", "")));
  let userOptions = [];
  let userOptionIds = [];
  selected.workspaces
    .filter((ws) => !selectedUserAllWorkspacesIds.includes(ws.value))
    .forEach((ws) => {
      if (ws.members) {
        let isMemberAdded = false;
        ws.members
          .filter((u) => !selectedAddressPeopleIds.includes(u.id))
          .forEach((u) => {
            isMemberAdded = true;

            selectedUserIds = selectedUserIds.filter((su) => su !== u.id);

            if (!userOptionIds.includes(u.id)) {
              userOptionIds.push(u.id);
              userOptions.push({
                ...u,
                first_name: u.first_name === "" ? u.email : u.first_name,
                name: u.name === "" ? u.email : u.name,
                value: u.id,
                label: u.name === "" ? u.email : u.name,
                workspace_ids: selected.workspaces.filter((ws) => ws.member_ids.some((id) => u.id === id)).map((ws) => ws.id),
                workspaces: selected.workspaces.filter((ws) => ws.member_ids.some((id) => u.id === id)).map((ws) => ws.name),
                type: "USER",
              });
            }
          });

        if (isMemberAdded) userOptions.push(...getSelectedWorkspaceUser([ws]));
      }
    });

  userOptions.sort((a, b) => {
    if (a.type === "WORKSPACE" || b.type === "WORKSPACE") {
      if (a.type === "WORKSPACE" && b.type === "WORKSPACE") return a.label.localeCompare(b.label);
      if (a.type === "WORKSPACE") return -1;
      if (b.type === "WORKSPACE") return 1;
    } else {
      return a.label.localeCompare(b.label);
    }
  });

  return {
    getAddressedByOptionByValue,
    getCompanyAsWorkspace,
    getSelectedWorkspaceUser,
    getSelectedUsersWorkspace,
    getSelectedUsersValueByUsers,
    getSelectedUsersValueByWorkspaces,
    workspaces: wsOptions,
    users: userOptions,
    selectedUserIds,
    isPersonal: userOptions.some((uo) => uo.type === "USER"),
  };
};

export default useGetWorkspaceAndUserOptions;
