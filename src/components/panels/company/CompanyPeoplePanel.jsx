import React, { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import SearchForm from "../../forms/SearchForm";
import { useTranslationActions, useUserChannels } from "../../hooks";
import { PeopleListItem } from "../../list/people/item";
import { replaceChar } from "../../../helpers/stringFormatter";
import { CustomInput } from "reactstrap";
import { CompanyStructure } from ".";

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
  .card {
    min-height: 40%;
    overflow: unset;
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
  const { className = "" } = props;

  const { users, loggedUser, selectUserChannel } = useUserChannels();

  const history = useHistory();

  const [search, setSearch] = useState("");
  const [peopleView, setPeopleView] = useState(true);
  const [structureView, setStructureView] = useState(false);

  const refs = {
    search: useRef(),
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const emptySearchInput = () => {
    setSearch("");
  };

  const handleUserNameClick = (user) => {
    history.push(`/profile/${user.id}/${replaceChar(user.name)}`);
  };

  const handleUserChat = (user) => selectUserChannel(user);

  useEffect(() => {
    refs.search.current.focus();
  }, []);

  const userSort = Object.values(users)
    .sort((a, b) => {
      return a.name.toString().localeCompare(b.name);
    })
    .filter((user) => {
      if (["gripp_project_bot", "gripp_account_activation", "gripp_offerte_bot", "gripp_invoice_bot", "gripp_police_bot", "driff_webhook_bot", "huddle_bot"].includes(user.email)) return false;

      if (user.type !== "internal") return false;
      if (user.active !== 1) return false;

      if (search !== "" && !structureView) {
        if (user.name.toLowerCase().search(search.toLowerCase()) === -1 && user.email.toLowerCase().search(search.toLowerCase()) === -1) return false;
      }

      return true;
    });

  const { _t } = useTranslationActions();

  const dictionary = {
    searchPeoplePlaceholder: _t("PLACEHOLDER.SEARCH_PEOPLE", "Search by name or email"),
    peopleExternal: _t("PEOPLE.EXTERNAL", "External"),
    peopleInvited: _t("PEOPLE.INVITED", "Invited"),
    structureView: _t("PEOPLE.STRUCTURE_VIEW_TOGGLE", "Structure view"),
    peopleView: _t("PEOPLE.PEOPLE_VIEW_TOGGLE", "People view"),
  };

  const handlePeopleViewToggle = () => {
    setPeopleView(!peopleView);
    setStructureView(!structureView);
  };

  const handleStructureViewToggle = () => {
    setStructureView(!structureView);
    setPeopleView(!peopleView);
  };

  return (
    <Wrapper className={`workspace-people container-fluid h-100 ${className}`}>
      {/* <div className="row app-block">
        <div className="app-content col-lg-12"> */}
      <div className="card">
        <div className="card-body">
          <div className="people-header">
            <div className="d-flex align-items-center people-search">
              <Search ref={refs.search} value={search} closeButton="true" onClickEmpty={emptySearchInput} placeholder={dictionary.searchPeoplePlaceholder} onChange={handleSearchChange} autoFocus />
              <CustomInput
                className="ml-2 mb-3 cursor-pointer text-muted cursor-pointer"
                checked={peopleView}
                id="people_view"
                name="people_view"
                type="switch"
                onChange={handlePeopleViewToggle}
                data-success-message={`${peopleView ? "Inactive users are shown" : "Inactive users are no longer visible"}`}
                label={<span>{dictionary.peopleView}</span>}
              />
              <CustomInput
                className="ml-2 mb-3 cursor-pointer text-muted cursor-pointer"
                checked={structureView}
                id="structure_view"
                name="structure_view"
                type="switch"
                onChange={handleStructureViewToggle}
                //data-success-message={`${showInactive ? "Inactive users are shown" : "Inactive users are no longer visible"}`}
                label={<span>{dictionary.structureView}</span>}
              />
            </div>
          </div>
          {structureView && <CompanyStructure users={userSort} />}
          {peopleView && (
            <div className="row">
              {userSort.map((user) => {
                return <PeopleListItem loggedUser={loggedUser} key={user.id} user={user} onNameClick={handleUserNameClick} onChatClick={handleUserChat} dictionary={dictionary} />;
              })}
            </div>
          )}
        </div>
      </div>
      {/* </div>
      </div> */}
    </Wrapper>
  );
};

export default React.memo(CompanyPeoplePanel);
