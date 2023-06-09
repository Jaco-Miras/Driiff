import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useTranslationActions } from ".";

const useWorkspaceAndUserOptions = (props) => {
  const { addressTo, members = null, userId } = props;
  const { _t } = useTranslationActions();
  const dictionary = {
    teamLabel: _t("TEAM", "Team"),
  };
  const recipients = useSelector((state) => state.global.recipients);
  const actualWorkspaces = useSelector((state) => state.workspaces.workspaces);
  const activeTopic = useSelector((state) => state.workspaces.activeTopic);
  const actualUsers = useSelector((state) => state.users.users);

  const r = recipients.filter((r) => typeof r.name !== "undefined").sort((a, b) => a.name.localeCompare(b.name));
  const company = r.find((r) => r.main_department === true);
  const workspaces = r.filter((r) => r.type === "TOPIC");
  const users = r.filter((r) => r.type === "USER" && r.active === 1).sort((a, b) => a.name.localeCompare(b.name));
  const teams = useSelector((state) => state.users.teams);

  const internalUsers = Object.values(actualUsers).filter((u) => u.active === 1 && u.type === "internal");

  const user = useSelector((state) => state.session.user);
  const workspacesLoaded = useSelector((state) => state.workspaces.workspacesLoaded);
  //const connectedTeamIds = useSelector((state) => state.workspaces.connectedTeamIds);
  const isExternalUser = user.type === "external";

  const [options, setOptions] = useState([]);

  const getAddressTo = (postRecipients) => {
    return postRecipients.map((r) => {
      return {
        ...r,
        icon: ["TOPIC", "DEPARTMENT"].includes(postRecipients.type) ? "compass" : r.type === "TEAM" ? "users" : "user-avatar",
        ...(r.type === "DEPARTMENT" && {
          participant_ids: internalUsers.map((u) => u.id),
          member_ids: internalUsers.map((u) => u.id),
          members: internalUsers.map((u) => u),
        }),
        ...(r.type === "TOPIC" && {
          participant_ids: r.participant_ids,
          member_ids: r.participant_ids,
          members: [],
          is_lock: r.private,
          is_shared: r.is_shared,
        }),
        value: r.id,
        label: r.type === "TEAM" ? `${dictionary.teamLabel} ${r.name}` : r.name,
        type: r.type,
        useLabel: r.type === "TEAM",
      };
    });
  };

  const getDefaultAddressTo = () => {
    const workspaceMembers = activeTopic.members
      .map((m) => {
        if (m.member_ids) {
          return m.member_ids;
        } else return m.id;
      })
      .flat();
    return [
      {
        ...activeTopic,
        participant_ids: workspaceMembers,
        icon: "compass",
        value: activeTopic.id,
        label: activeTopic.name,
      },
    ];
  };

  const getDefaultAddressToAsCompany = () => {
    return [
      {
        ...company,
        participant_ids: internalUsers.map((u) => u.id),
        member_ids: internalUsers.map((u) => u.id),
        members: internalUsers.map((u) => u),
        icon: "home",
        value: company.id,
        label: company.name,
      },
    ];
  };

  useEffect(() => {
    let workspaceOptions = Array.from(workspaces)
      .filter((ws) => {
        if (typeof actualWorkspaces[ws.type_id] !== "undefined" && actualWorkspaces[ws.type_id].type === "WORKSPACE") {
          return true;
        } else return false;
      })
      .map((ws) => {
        return {
          ...ws,
          ...actualWorkspaces[ws.type_id],
          icon: "compass",
          value: ws.id,
          label: ws.name,
        };
      });

    const botCodes = [
      "gripp_bot_account",
      "gripp_account_activation",
      "gripp_offerte_bot",
      "gripp_bot_invoice",
      "gripp_invoice_bot",
      "gripp_bot_offerte",
      "gripp_bot_project",
      "gripp_project_bot",
      "gripp_bot_account",
      "gripp_account_bot",
      "driff_webhook_bot",
      "huddle_bot",
      "default_bot",
    ];
    let userOptions = Array.from(users)
      .filter((u) => {
        if (typeof actualUsers[u.type_id] !== "undefined" && actualUsers[u.type_id].active === 1 && !botCodes.includes(actualUsers[u.type_id].email)) {
          return true;
        } else return false;
      })
      .map((u) => {
        return {
          ...u,
          icon: "user-avatar",
          value: u.id,
          label: u.name ? u.name : u.email,
          type: "USER",
        };
      });

    const teamOptions =
      isExternalUser && workspacesLoaded
        ? []
        : // Object.values(teams)
          //     .filter((t) => connectedTeamIds.some((id) => id === t.id))
          //     .map((u) => {
          //       return {
          //         ...u,
          //         value: u.id,
          //         label: `${dictionary.teamLabel} ${u.name}`,
          //         useLabel: true,
          //         type: "TEAM",
          //         icon: "users",
          //       };
          //     })
          Object.values(teams).map((u) => {
            return {
              ...u,
              value: u.id,
              label: `${dictionary.teamLabel} ${u.name}`,
              useLabel: true,
              type: "TEAM",
              icon: "users",
            };
          });

    const companyOption = company
      ? [
          {
            ...company,
            participant_ids: internalUsers.map((u) => u.id),
            member_ids: internalUsers.map((u) => u.id),
            members: internalUsers.map((u) => u),
            icon: "home",
            value: company.id,
            label: company.name,
          },
        ]
      : [];

    setOptions([...companyOption, ...workspaceOptions, ...teamOptions, ...userOptions]);
  }, [r.length, Object.keys(actualUsers).length, Object.keys(actualWorkspaces).length, Object.keys(teams).length]);

  let responsible_ids = [];
  let user_ids = [];
  let recipient_ids = [];
  let workspace_ids = [];
  let is_personal = false;
  addressTo.forEach((at) => {
    recipient_ids.push(at.id);

    if (["DEPARTMENT", "TOPIC", "WORKSPACE"].includes(at.type)) {
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

  let addressIds = addressTo
    .map((ad) => {
      if (ad.type === "USER") {
        return ad.type_id;
      } else if (ad.type === "TEAM") {
        return ad.member_ids;
      } else {
        return ad.participant_ids;
        // if (ad.main_department) {
        //   return Object.values(actualUsers).map((u) => u.id);
        // } else {
        //   return ad.participant_ids;
        // }
      }
    })
    .flat();

  addressIds = [...new Set(addressIds)];
  //let addressInternalIds = addressIds.filter((id) => internalUsers.some((u) => u.id === id));
  let user_options = [];
  if (members) {
    user_options = members
      .filter((u) => u.id !== userId)
      .map((u) => {
        return {
          ...u,
          icon: "user-avatar",
          value: u.id,
          label: u.name ? u.name : u.email,
          type: "USER",
          user_type: u.type,
        };
      });
  } else {
    user_options = Object.values(actualUsers)
      .filter((u) => addressIds.some((id) => id === u.id))
      .map((u) => {
        return {
          ...u,
          icon: "user-avatar",
          value: u.id,
          label: u.name ? u.name : u.email,
          type: "USER",
          user_type: u.type,
        };
      });
  }

  return {
    addressIds,
    //addressInternalIds,
    options,
    userOptions: user_options,
    user_ids: [...new Set(user_ids)],
    workspace_ids,
    responsible_ids,
    recipient_ids,
    is_personal,
    getAddressTo,
    getDefaultAddressTo,
    getDefaultAddressToAsCompany,
    actualUsers,
  };
};

export default useWorkspaceAndUserOptions;
