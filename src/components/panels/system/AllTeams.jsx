import React, { useState } from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { TeamItem } from "../../list/people/item";
import SearchForm from "../../forms/SearchForm";

const Wrapper = styled.div`
  padding: 2rem;
  width: 100%;
`;

const Search = styled(SearchForm)`
  width: 50%;
  margin-bottom: 1rem;
  min-width: 250px;
`;

const AllTeams = (props) => {
  const { loggedUser, dictionary, _t, showOptions } = props;

  const teams = useSelector((state) => state.users.teams);
  const [search, setSearch] = useState("");

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const emptySearchInput = () => {
    setSearch("");
  };

  return (
    <Wrapper>
      <div className="people-header">
        <div className="d-flex align-items-center people-search">
          <Search value={search} closeButton="true" onClickEmpty={emptySearchInput} placeholder={dictionary.searchTeamsPlaceholder} onChange={handleSearchChange} autoFocus />
        </div>
      </div>
      {Object.values(teams).length > 0 && (
        <div className="row mt-2">
          {Object.values(teams)
            .filter((team) => {
              if (search !== "") {
                return team.name.toLowerCase().search(search.toLowerCase()) !== -1;
              } else {
                return true;
              }
            })
            .map((team) => {
              return <TeamItem key={team.id} team={team} loggedUser={loggedUser} dictionary={dictionary} _t={_t} showOptions={showOptions} />;
            })}
        </div>
      )}
    </Wrapper>
  );
};

export default AllTeams;
