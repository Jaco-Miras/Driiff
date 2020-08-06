import React, { useEffect, useState, useRef } from "react";
import { useHistory } from "react-router-dom"
import styled from "styled-components";
import { useSearch, useSearchActions } from "../../hooks";
import { SvgIconFeather } from "../../common";
//import { ChatSearchItem, ChannelSearchItem, CommentSearchItem, FileSearchItem, PeopleSearchItem, PostSearchItem, WorkspaceSearchItem } from "../../list/search";

const Wrapper = styled.div`
    @media (min-width: 400px) {
        min-width: 360px;
    }
`;

// const PopUpResultsContainer = styled.div`
//     padding: 5px;
//     overflow: auto;
// `;

const SearchDropdown = (props) => {

    const dropdownRef = useRef();
    const actions = useSearchActions();
    const { value } = useSearch();
    const history = useHistory();
    const [inputValue, setInputValue] = useState(value);

    const handleEnter = (e) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    const handleSearch = () => {
        if (inputValue.trim() !== "") {
            dropdownRef.current.classList.remove("show");
            actions.search({
                search: inputValue,
                skip: 0,
                limit: 10,
            });
            actions.saveSearchValue({
                value: inputValue
            });
            document.querySelector(".overlay").classList.remove('show');
            history.push("/search");
        }
    };


    const handleSearchChange = (e) => {
        if (e.target.value.trim() === "" && value !== "") {
        actions.saveSearchValue({
            value: ""
        });
        }
        setInputValue(e.target.value)
    };

    return (
        <Wrapper className="dropdown-menu p-2 dropdown-menu-right" ref={dropdownRef}>
            <div className="input-group">
            <input onChange={handleSearchChange} onKeyDown={handleEnter} type="text" className="form-control dropdown-search-input" placeholder="Search..." aria-describedby="button-addon1" autoFocus />
                <div className="input-group-append">
                    <button className="btn btn-outline-light" type="button" onClick={handleSearch}>
                        <SvgIconFeather icon="search" />
                    </button>
                </div>
            </div>
            {/* <PopUpResultsContainer>
                <ul className="list-group list-group-flush">
                    {
                        Object.values(results).map((r) => {
                            switch (r.type) {
                                case "CHAT":
                                    return <ChatSearchItem key={r.id} data={r.data}/>
                                case "CHANNEL":
                                    return <ChannelSearchItem key={r.id} data={r.data}/>
                                case "COMMENT":
                                    return <CommentSearchItem key={r.id} comment={r}/>
                                case "DOCUMENT":
                                    return <FileSearchItem key={r.id} file={r}/>
                                case "PEOPLE":
                                    return <PeopleSearchItem key={r.id} user={r.data}/>
                                case "POST":
                                    return <PostSearchItem key={r.id} post={r}/>
                                case "WORKSPACE":
                                    return <WorkspaceSearchItem key={r.id} data={r.data}/>
                                default:
                                    return null;
                            }
                        })
                    }
                </ul>
            </PopUpResultsContainer> */}
        </Wrapper>
    );
};

export default SearchDropdown;