import { useSelector } from "react-redux";
import { useUserActions } from "./index";

const useUsers = () => {
  const users = useSelector((state) => state.users.users);
  const getUserFilter = useSelector((state) => state.users.getUserFilter);
  const { user: loggedUser } = useSelector((state) => state.session);
  const userActions = useUserActions();

  // useEffect(() => {
  //   if (init) {
  //     init = false;

  //     userActions.fetch({});
  //   }

  //   //eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  return {
    users,
    getUserFilter,
    loggedUser,
    actions: userActions,
  };
};

export default useUsers;
