import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const useWorkspaceAndUserOptions = (selected = { addressTo: [] }) => {

  const { recipients } = useSelector((state) => state.global);
  const { workspaces: actualWorkspaces, activeTopic } = useSelector((state) => state.workspaces);
  const { users: actualUsers } = useSelector((state) => state.users);

  const r = recipients.sort((a, b) => a.name.localeCompare(b.name));
  const company = r.find(r => r.main_department === true);
  const workspaces = r.filter(r => r.type === "TOPIC");
  const users = r.filter(r => r.type === "USER" && r.active === 1).sort((a, b) => a.name.localeCompare(b.name));

  const [options, setOptions] = useState([]);
  const [progress, setProgress] = useState(false);

  const getAddressTo = (postRecipients) => {
    return [
      ...postRecipients.recipients.map(r => {
        return {
          ...r,
          icon: ["TOPIC", "DEPARTMENT"].includes(postRecipients.type) ? "compass" : "user-avatar",
          value: r.id,
          label: r.name,
        };
      }),
    ];
  };

  const getDefaultAddressTo = () => {
    return [
      {
        ...(workspaces.filter(w => w.type_id === activeTopic.id)),
        ...activeTopic,
        icon: "compass",
        value: activeTopic.id,
        label: activeTopic.name,
      },
    ];
  };

  const getDefaultAddressToAsCompany = () => {
    return [{
      ...company,
      icon: "home",
      value: company.id,
      label: company.name
    }];
  };

  useEffect(() => {
    if (!progress && company) {
      setProgress(true);

      setOptions([
        ...(company && [{
          ...company,
          icon: "home",
          value: company.id,
          label: company.name
        }]),
        ...(workspaces && workspaces.map(ws => ({
          ...ws,
          ...(typeof actualWorkspaces[ws.type_id] !== "undefined" && actualWorkspaces[ws.type_id]),
          icon: "compass",
          value: ws.id,
          label: ws.name
        }))),
        ...(users && users.map(u => ({
          ...u,
          ...(typeof actualUsers[u.type_id] !== "undefined" && actualUsers[u.type_id]),
          icon: "user-avatar",
          value: u.id,
          label: u.name ? u.name : u.email
        }))),
        /*...users && {
          label: `Users`,
          options: users.map(u => ({
            ...u,
            value: u.id,
            label: u.name
          }))
        },*/
      ]);
    }
  }, [options, recipients, setOptions]);

  let responsible_ids = [];
  let user_ids = [];
  let recipient_ids = [];
  let workspace_ids = [];
  let is_personal = false;
  selected.addressTo.forEach(at => {
    recipient_ids.push(at.id);

    if (["DEPARTMENT", "TOPIC"].includes(at.type)) {
      workspace_ids = [at.type_id];
      user_ids = [...user_ids, at.member_ids];
    }

    if (at.type === "USER") {
      responsible_ids.push(at.type_id);
      user_ids = [...user_ids, at.type_id];

      if (!is_personal) {
        is_personal = true;
      }
    }
  });

  return {
    options,
    user_ids,
    workspace_ids,
    responsible_ids,
    recipient_ids,
    is_personal,
    getAddressTo,
    getDefaultAddressTo,
    getDefaultAddressToAsCompany
  };
};

export default useWorkspaceAndUserOptions;
