import React, {useCallback, useEffect, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useHistory} from "react-router-dom";
import styled from "styled-components";
import {getUsers} from "../../../redux/actions/userAction";
import SearchForm from "../../forms/SearchForm";
import {WorkspaceUserItemList} from "../../list/people";

const Wrapper = styled.div`
    overflow: auto;  
    &::-webkit-scrollbar {
        display: none;
    }
    -ms-overflow-style: none;
    scrollbar-width: none;
`;

const Search = styled(SearchForm)`
    max-width: 350px;
    margin-bottom: 1rem;
`;

const WorkspacePeoplePanel = (props) => {

    const {className = ""} = props;

    const dispatch = useDispatch();
    const history = useHistory();

    const users = useSelector(state => state.users.users);
    const workspaces = useSelector(state => state.workspaces.workspaces);
    const activeTab = useSelector(state => state.workspaces.activeTab);
    const activeTopic = useSelector(state => state.workspaces.activeTopic);
    const userFilter = useSelector(state => state.users.getUserFilter);

    const [search, setSearch] = useState("");

    const ref = {
        search: useRef(),
    };

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
    };

    const userSort = Object.values(users)
        .filter(user => {
            if (user.active !== 1)
                return false;

            if (activeTopic) {
                if (activeTopic.workspace_id) {
                    if (!workspaces[activeTopic.workspace_id].member_ids.includes(user.id)) {
                        return false;
                    }
                } else {
                    if (!workspaces[activeTopic.id].member_ids.includes(user.id)) {
                        return false;
                    }
                }
            }

            if (search !== "") {
                return user.name
                    .toLowerCase()
                    .indexOf(search.toLowerCase()) > -1;
            }

            return true;
        })
        .sort(
            (a, b) => {
                return a.name.localeCompare(b.name);
            },
        );

    useEffect(() => {
        dispatch(
            getUsers(userFilter),
        );

        ref.search.current.focus();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleUserNameClick = useCallback((user) => {
        history.push(`/profile/${user.id}/${user.name}`);
    }, []);

    const handleUserChat = useCallback((user) => {
        console.log(user);
    }, []);

    return (
        <Wrapper className={`workspace-people container-fluid h-100 ${className}`}>
            <div className="card">
                <div className="card-body">
                    <Search ref={ref.search} placeholder="People search" onChange={handleSearchChange} autoFocus/>
                    <div className="row">
                        {
                            userSort.map((user) => {
                                return <WorkspaceUserItemList
                                    user={user} onNameClick={handleUserNameClick}
                                    onChatClick={activeTab === "intern" && handleUserChat}/>;
                            })
                        }
                    </div>
                </div>
            </div>
        </Wrapper>
    );
};

export default React.memo(WorkspacePeoplePanel);