import React, { useCallback, useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import SearchForm from "../../forms/SearchForm";
import { useFocusInput, useUserChannels, useTranslation } from "../../hooks";
import { PeopleListItem } from "../../list/people/item";
import { replaceChar } from "../../../helpers/stringFormatter";

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
  const { className = "", workspace } = props;

  const { selectUserChannel, loggedUser } = useUserChannels();

  const history = useHistory();

  const [search, setSearch] = useState("");

  const refs = {
    search: useRef(),
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleUserNameClick = useCallback(
    (user) => {
      history.push(`/profile/${user.id}/${replaceChar(user.name)}`);
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

  let members = [];
  if (workspace) {
    members = workspace.members;
  }
  const userSort = members.filter((m) => {
    if (search !== "") {
      return m.name.toLowerCase().indexOf(search.toLowerCase()) > -1;
    } else {
      return true;
    }
  }).sort((a, b) => {
    return a.name.localeCompare(b.name);
  })

  const {_t} = useTranslation();

  const dictionary = {
    searchPeoplePlaceholder: _t("PLACEHOLDER.SEARCH_PEOPLE", "Search people"),
    peopleExternal: _t("PEOPLE.EXTERNAL", "External"),
    peopleInvited: _t("PEOPLE.INVITED", "Invited")
  };

  useFocusInput(refs.search.current);

  return (
    <Wrapper className={`workspace-people fadeIn container-fluid ${className}`}>
      <div className="card">
        <div className="card-body">
          <Search ref={refs.search} placeholder={dictionary.searchPeoplePlaceholder} onChange={handleSearchChange} autoFocus />
          <div className="row">
            {userSort.map((user) => {
              return <PeopleListItem key={user.id} loggedUser={loggedUser} user={user} onNameClick={handleUserNameClick} onChatClick={handleUserChat} dictionary={dictionary}/>;
            })}
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default React.memo(WorkspacePeoplePanel);
