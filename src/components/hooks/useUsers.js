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

    const fetchUsers = useCallback(({skip = 0, limit = getUserFilter.limit, ...res},
                                    callback = () => {
                                    }) => {
        dispatch(
            getUsers({
                ...res,
                skip: skip,
                limit: limit,
            }, callback),
        );
    }, [dispatch, getUserFilter.limit]);

    const fetchMoreUsers = useCallback(() => {
        if (getUserFilter.hasMore) {
            fetchUsers(getUserFilter.skip, getUserFilter.limit);
        }
    }, [fetchUsers, getUserFilter]);

    useEffect(() => {
        if (init) {
            init = false;

            fetchUsers({}, (err) => {
                if (err) {
                    console.log(err);
                }
            });
        }

        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return {
        users,
        fetchUsers,
        fetchMoreUsers,
    };
};

export default useUsers;