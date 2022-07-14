import { useSelector } from "react-redux";
import { useUserActions } from "./index";
import { useEffect, useState } from "react";
import _ from "lodash";
import { useMemo } from "react";

const useUsers = () => {
  const users = useSelector((state) => state.users.users);
  const getUserFilter = useSelector((state) => state.users.getUserFilter);
  const { user: loggedUser } = useSelector((state) => state.session);
  const userActions = useUserActions();

  const [activeUsers, setActiveUsers] = useState({});
  const [guestUsers, setGuestUsers] = useState({});

  // useEffect(() => {
  //   if (init) {
  //     init = false;

  //     userActions.fetch({});
  //   }

  //   //eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  useEffect(() => {
    if (Object.keys(users).length > 0) {
      const botCodes = ["gripp_bot_account", "gripp_bot_invoice", "gripp_bot_offerte", "gripp_bot_project", "gripp_bot_account", "driff_webhook_bot", "huddle_bot", "driff_channel_bot"];
      const _activeUsers = _.pickBy(users, (user) => user.active === 1 && !botCodes.includes(user.email));
      const _guestUsers = _.pickBy(users, (user) => user.type === "external" && !botCodes.includes(user.email));

      setActiveUsers(_activeUsers);
      setGuestUsers(_guestUsers);
    }
  }, [users]);

  const acceptedActiveUser = useMemo(() => {
    let aUsers = {};
    for (const key in activeUsers) {
      if (activeUsers[key].active === 1 && activeUsers[key].has_accepted) {
        aUsers[key] = activeUsers[key];
      }
    }
    return aUsers;
  }, [activeUsers]);

  return {
    users,
    getUserFilter,
    loggedUser,
    actions: userActions,
    activeUsers,
    guestUsers,
    acceptedActiveUser,
  };
};

export default useUsers;
