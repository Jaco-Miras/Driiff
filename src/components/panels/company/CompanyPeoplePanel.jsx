import React, { useCallback, useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import SearchForm from "../../forms/SearchForm";
import { useTranslation, useUserChannels } from "../../hooks";
import { PeopleListItem } from "../../list/people/item";

const Wrapper = styled.div`
overflow: auto;
&::-webkit-scrollbar {
  display: none;
}
-ms-overflow-style: none;
scrollbar-width: none;

.people-search {
  flex: 0 0 80%;
  justify-content: flex-start;
  padding-left: 0;
}
`;

const Search = styled(SearchForm)`
  width: 50%;
  margin-bottom: 1rem;
  min-width: 250px;
  padding-right: 14px;
  @media all and (max-width: 991.99px) {
    width: 100%;
    padding-right: 0;
  }
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
      if (["gripp_project_bot",
        "gripp_account_activation",
        "gripp_offerte_bot",
        "gripp_invoice_bot",
        "gripp_police_bot",
        "driff_webhook_bot"].includes(user.email)) return false;

      if (user.type !== "internal") return false;
      if (user.active !== 1) return false;

      if (search !== "") {
        if (user.name.toLowerCase().search(search.toLowerCase()) === -1
          && user.email.toLowerCase().search(search.toLowerCase()) === -1)
          return false;
      }

      return true;
    })
    // .filter((user) => {
    //   if (!userChannels.hasOwnProperty(user.id))
    //     return false;

    //   if (user.type !== "internal")
    //     return false;

    //   if (user.active !== 1)
    //     return false;

    //   if (search !== "") {
    //     if (search !== "") {
    //       if (user.name.toLowerCase().search(search.toLowerCase()) === -1
    //         && user.email.toLowerCase().search(search.toLowerCase()) === -1)
    //         return false;
    //     }
    //   }

    //   return true;
    // });

  const { _t } = useTranslation();

  const dictionary = {
    searchPeoplePlaceholder: _t("PLACEHOLDER.SEARCH_PEOPLE", "Search by name or email"),
    peopleExternal: _t("PEOPLE.EXTERNAL", "External"),
    peopleInvited: _t("PEOPLE.INVITED", "Invited"),
  };

  return (
    <Wrapper className={`workspace-people container-fluid h-100 ${className}`}>
      <div className="card">
        <div className="card-body">
            <Search ref={refs.search} value={search} closeButton="true" onClickEmpty={emptySearchInput} placeholder={dictionary.searchPeoplePlaceholder} onChange={handleSearchChange} autoFocus />
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
