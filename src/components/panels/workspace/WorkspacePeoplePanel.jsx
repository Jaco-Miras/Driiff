import React, {useEffect, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useHistory} from "react-router-dom";
import styled from "styled-components";
import {getUsers} from "../../../redux/actions/userAction";
import SearchForm from "../../forms/SearchForm";
import {WorkspaceUserItemList} from "../../list/people";

const Wrapper = styled.div`
`;

const Search = styled(SearchForm)`
    max-width: 350px;
    margin-bottom: 1rem;
`;

const WorkspacePeoplePanel = (props) => {

    const {className = ""} = props;

    /*const history = useHistory();
    const dispatch = useDispatch();
    //const users = useSelector(state => state.users.users);
    //const workspaces = useSelector(state => state.workspaces.workspaces);
    //const activeTopic = useSelector(state => state.workspaces.activeTopic);
    const userFilter = useSelector(state => state.users.getUserFilter);
    const [search, setSearch] = useState("");

    const ref = {
        search: useRef(),
    };

    const handleSearchChange = (e) => {
        setSearch(search => e.currentTarget.value);
    };

    useEffect(() => {
        dispatch(
            getUsers(userFilter),
        );

        ///ref.search.current.focus();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);*/

    /*const filteredUsers = Object.values(users)
        .filter(user => {
            if (user.active !== 1)
                return false;

            return true;
        })
        .sort(
            (a, b) => {
                return a.name.localeCompare(b.name);
            },
        );*/




    return (
        <Wrapper className={`container-fluid h-100 ${className}`}>
            <div className="card">
                <div className="card-body">
                    {/*<Search ref={ref.search} placeholder="People search" onChange={handleSearchChange} autoFocus/>
                    <WorkspaceUserItemList users={filteredUsers} search={search}/>*/}
                </div>
            </div>
        </Wrapper>
    );
};

export default React.memo(WorkspacePeoplePanel);