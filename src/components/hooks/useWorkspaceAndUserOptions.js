import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const useWorkspaceAndUserOptions = (props) => {

  const { addressTo } = props;

  const recipients = useSelector((state) => state.global.recipients);
  const { workspaces: actualWorkspaces, activeTopic } = useSelector((state) => state.workspaces);
  const { users: actualUsers } = useSelector((state) => state.users);

  const r = recipients.filter((r) => typeof r.name !== "undefined").sort((a, b) => a.name.localeCompare(b.name));
  const company = r.find(r => r.main_department === true);
  const workspaces = r.filter(r => r.type === "TOPIC");
  const users = r.filter(r => r.type === "USER" && r.active === 1).sort((a, b) => a.name.localeCompare(b.name));

  const [options, setOptions] = useState([]);
  const [progress, setProgress] = useState(false);

  const getAddressTo = (postRecipients) => {
    const internalUsers = Object.values(actualUsers).filter(u => u.active === 1 && u.type === "internal").map(u => u);
    return [
      ...postRecipients.map(r => {
        return {
          ...r,
          icon: ["TOPIC", "DEPARTMENT"].includes(postRecipients.type) ? "compass" : "user-avatar",
          ...([postRecipients.type === "DEPARTMENT"] && {
            member_ids: internalUsers.map(u => u.id),
            members: internalUsers.map(u => u),
          }),
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
    const internalUsers = Object.values(actualUsers).filter(u => u.active === 1 && u.type === "internal").map(u => u);
    return [{
      ...company,
      member_ids: internalUsers.map(u => u.id),
      members: internalUsers.map(u => u),
      icon: "home",
      value: company.id,
      label: company.name
    }];
  };

  useEffect(() => {
    if (!progress && company) {
      setProgress(true);

      let workspaceOptions = [];
      workspaces.forEach(ws => {
        if (typeof actualWorkspaces[ws.type_id] !== "undefined" && actualWorkspaces[ws.type_id].type === "WORKSPACE") {
          workspaceOptions.push({
            ...ws,
            ...actualWorkspaces[ws.type_id],
            icon: "compass",
            value: ws.id,
            label: ws.name
          });
        }
      });

      let userOptions = [];
      users.forEach(u => {
        if (typeof actualUsers[u.type_id] !== "undefined" && actualUsers[u.type_id].active === 1) {
          userOptions.push({
            ...u,
            //...actualUsers,
            icon: "user-avatar",
            value: u.id,
            label: u.name ? u.name : u.email,
            type: "USER"
          });
        }
      });

      const internalUsers = Object.values(actualUsers).filter(u => u.active === 1 && u.type === "internal").map(u => u);
      setOptions([
        ...(company && [{
          ...company,
          member_ids: internalUsers.map(u => u.id),
          members: internalUsers.map(u => u),
          icon: "home",
          value: company.id,
          label: company.name
        }]),
        ...(workspaceOptions),
        ...(userOptions),
      ]);
    }
  }, [options, recipients, actualWorkspaces, setOptions]);

  let responsible_ids = [];
  let user_ids = [];
  let recipient_ids = [];
  let workspace_ids = [];
  let is_personal = false;
  addressTo.forEach(at => {
    recipient_ids.push(at.id);

    if (["DEPARTMENT", "TOPIC", "WORKSPACE"].includes(at.type)) {
      if (!at.member_ids) {
        console.log(at);
      }
      workspace_ids = [...workspace_ids, at.type_id];
      user_ids = [...user_ids, ...at.member_ids];
    }

    if (at.type === "USER") {
      responsible_ids.push(at.type_id);
      user_ids = [...user_ids, at.type_id];

      if (!is_personal) {
        is_personal = true;
      }
    }
  });
  
  const user_options = users.filter((u) => user_ids.some(id => id === u.type_id)).map((u) => {
    return { ...u, 
            icon: "user-avatar",
            value: u.type_id,
            label: u.name ? u.name : u.email,
            type: "USER" }
  });
  
  return {
    options,
    userOptions: user_options,
    user_ids: [...new Set(user_ids)],
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
