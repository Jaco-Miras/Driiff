import {useCallback, useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {getUsers} from "../../redux/actions/userAction";

let init = true;

/**
 * @returns {{fetchUsers: (...args: any[]) => any, fetchMoreUsers: (...args: any[]) => any, users}}
 */
const useUsers = () => {

    const dispatch = useDispatch();
    const {users, getUserFilter} = useSelector(state => state.users);

    const fetchUsers = useCallback((skip = 0, limit = getUserFilter.limit) => {
        dispatch(
            getUsers({
                skip: skip,
                limit: limit
            }),
        );
    }, [getUserFilter.limit]);

    const fetchMoreUsers = useCallback(() => {
        if(getUserFilter.hasMore) {
            fetchUsers(getUserFilter.skip, getUserFilter.limit);
        }
    }, [getUserFilter]) ;

    useEffect(() => {
        if (init) {
            init = false;

            fetchUsers();
        }
    }, []);

    return {
        users,
        fetchUsers,
        fetchMoreUsers
    };
};

export default useUsers;