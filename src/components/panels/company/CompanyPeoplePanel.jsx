import React, {useCallback, useEffect, useRef, useState} from "react";
import {useHistory} from "react-router-dom";
import styled from "styled-components";
import SearchForm from "../../forms/SearchForm";
import {useUserChannels} from "../../hooks";
import {PeopleListItem} from "../../list/people/item";

const Wrapper = styled.div`
`;

const Search = styled(SearchForm)`
    max-width: 350px;
    margin-bottom: 1rem;
`;

const CompanyPeoplePanel = (props) => {

    const {className = ""} = props;

    const {users, userChannels, selectUserChannel} = useUserChannels();

    const history = useHistory();

    const [search, setSearch] = useState("");

    const refs = {
        search: useRef(),
    };

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
    };

    const handleUserNameClick = useCallback((user) => {
        history.push(`/profile/${user.id}/${user.name}`);
    }, [history]);

    const handleUserChat = useCallback((user) => {
        selectUserChannel(user, (channel) => {
            history.push(`/chat/${channel.code}`);
        });
    }, [history, selectUserChannel]);

    useEffect(() => {
        refs.search.current.focus();
    }, []);

    const userSort = Object.values(users)
        .sort(
            (a, b) => {
                return a.name.localeCompare(b.name);
            },
        )
        .filter(user => {

            if (!userChannels.hasOwnProperty(user.id))
                return false;

            if (user.active !== 1)
                return false;

            if (search !== "") {
                return user.name
                    .toLowerCase()
                    .indexOf(search.toLowerCase()) > -1;
            }

            return true;
        });


    return (
        <Wrapper className={`workspace-people container-fluid h-100 ${className}`}>
            <div className="card">
                <div className="card-body">
                    <Search ref={refs.search} placeholder="People search" onChange={handleSearchChange} autoFocus/>
                    <div className="row">
                        {
                            userSort.map((user) => {
                                return <PeopleListItem
                                    key={user.id}
                                    user={user} onNameClick={handleUserNameClick}
                                    onChatClick={handleUserChat}/>;
                            })
                        }
                    </div>
                </div>
            </div>
        </Wrapper>
    );
};

export default React.memo(CompanyPeoplePanel);