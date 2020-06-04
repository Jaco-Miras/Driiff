import React, {useEffect, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import styled from "styled-components";
import {getUsers} from "../../../redux/actions/userAction";
import {Avatar, SvgIconFeather} from "../../common";
import SearchForm from "../../forms/SearchForm";

const Wrapper = styled.div`    
`;

const Search = styled(SearchForm)`
    max-width: 350px;
    margin-bottom: 1rem;
`;

const CompanyPeoplePanel = (props) => {

    const {className = ""} = props;

    const dispatch = useDispatch();
    const users = useSelector(state => state.users.users);
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

    return (
        <Wrapper className={`company-people container-fluid h-100 ${className}`}>
            <div className="card">
                <div className="card-body">
                    <Search ref={ref.search} placeholder="People search" onChange={handleSearchChange} autoFocus/>
                    <div className="row">
                        {
                            userSort.map((user) => {
                                return <div className="col-12 col-md-6">
                                    <div className="card border" key={user.id}>
                                        <div className="card-body">
                                            <div
                                                className="d-flex align-items-center">
                                                <div className="pr-3">
                                                    <Avatar id={user.id} name={user.name}
                                                            imageLink={user.profile_image_link}/>
                                                </div>
                                                <div>
                                                    <h6 className="mb-1 ">{user.name} {user.id}</h6>
                                                    <span className="small text-muted">
                                                    {
                                                        user.role !== null &&
                                                        <>{user.role.display_name}</>
                                                    }
                                                </span>
                                                </div>
                                                <div className="text-right ml-auto">
                                                    <SvgIconFeather icon="message-circle"/>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>;
                            })
                        }
                    </div>
                </div>
            </div>
        </Wrapper>
    );
};

export default React.memo(CompanyPeoplePanel);