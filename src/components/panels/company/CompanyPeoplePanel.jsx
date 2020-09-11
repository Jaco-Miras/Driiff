import React, {useCallback, useEffect, useRef, useState} from "react";
import {useHistory} from "react-router-dom";
import styled from "styled-components";
import SearchForm from "../../forms/SearchForm";
import {useTranslation, useUserChannels} from "../../hooks";
import {PeopleListItem} from "../../list/people/item";

const Wrapper = styled.div``;

const Search = styled(SearchForm)`
  max-width: 350px;
  margin-bottom: 1rem;
`;

const CompanyPeoplePanel = (props) => {
  const {className = ""} = props;

  const { users, loggedUser, userChannels, selectUserChannel } = useUserChannels();

  const history = useHistory();

  const [search, setSearch] = useState("");

  const refs = {
    search: useRef(),
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const emptySearchInput = () => {
    setSearch("");
  };

  const handleUserNameClick = useCallback(
    (user) => {
      history.push(`/profile/${user.id}/${user.name}`);
    },
    [history]
  );

  const handleUserChat = useCallback(
    (user) => {
      selectUserChannel(user, (channel) => {
        history.push(`/chat/${channel.code}`);
      });
    },
    [history, selectUserChannel]
  );

  useEffect(() => {
    refs.search.current.focus();
  }, []);

  const userSort = Object.values(users)
    .sort((a, b) => {
      return a.name.localeCompare(b.name);
    })
    .filter((user) => {
      if (!userChannels.hasOwnProperty(user.id))
        return false;

      if (user.type !== "internal")
        return false;

      if (user.active !== 1)
        return false;

      if (search !== "") {
        return user.name.toLowerCase().indexOf(search.toLowerCase()) > -1;
      }

      return true;
    });

  const { _t } = useTranslation();

  const dictionary = {
    searchPeoplePlaceholder: _t("PLACEHOLDER.SEARCH_PEOPLE", "Search people"),
    peopleExternal: _t("PEOPLE.EXTERNAL", "External"),
    peopleInvited: _t("PEOPLE.INVITED", "Invited"),
  };

  return (
    <Wrapper className={`workspace-people container-fluid h-100 ${className}`}>
      <div className="card">
        <div className="card-body">
          <Search ref={refs.search} value={search} closeButton="true" onClickEmpty={emptySearchInput} placeholder="People search" onChange={handleSearchChange} autoFocus />
          <div className="row">
            {userSort.map((user) => {
              return <PeopleListItem loggedUser={loggedUser} key={user.id} user={user} onNameClick={handleUserNameClick} onChatClick={handleUserChat} dictionary={dictionary} />;
            })}
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default React.memo(CompanyPeoplePanel);
