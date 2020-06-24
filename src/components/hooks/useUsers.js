import {useCallback, useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {getUsers} from "../../redux/actions/userAction";

let init = true;

/**
 * @returns {{fetchUsers: (...args: any[]) => any, fetchMoreUsers: (...args: any[]) => any, users}}
 */
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