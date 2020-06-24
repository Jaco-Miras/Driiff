import {useEffect} from "react";
import {useSelector} from "react-redux";
import {useUserActions} from "./index";

let init = true;

const useUsers = () => {

    const {users} = useSelector(state => state.users);
    const {user: loggedUser} = useSelector(state => state.session);

    const userActions = useUserActions();

    useEffect(() => {
        if (init) {
            init = false;

            userActions.fetch({});
        }

        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return {
        users,
        loggedUser,
        actions: userActions,
    };
};

export default useUsers;