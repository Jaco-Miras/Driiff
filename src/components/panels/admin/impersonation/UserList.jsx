import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { getCurrentUserImpersonation } from "../../../../redux/actions/userAction";
import { SearchForm } from "../../../forms";
import { useTranslationActions } from "../../../hooks";
import UserListItem from "./UserListItem";

const Search = styled(SearchForm)`
  min-width: 250px;
  padding-right: 14px;
  @media all and (max-width: 991.99px) {
    width: 100%;
    padding-right: 0;
  }
`;

const UserList = () => {
  const { users, usersLoaded } = useSelector((state) => state.users);
  const [search, setSearch] = useState("");

  const refs = {
    search: useRef(),
  };

  const { _t } = useTranslationActions();

  const dictionary = {
    searchPlaceholder: _t("IMPERSONATION.SEARCH_PLACEHOLDER", "Search Users"),
  };

  useEffect(() => {
    refs.search.current.focus();
  }, []);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const emptySearchInput = () => {
    setSearch("");
  };

  const userSort = Object.values(users)
    .sort((a, b) => {
      return a.name.toString().localeCompare(b.name);
    })
    .filter((user) => {
      if (["gripp_project_bot", "gripp_account_activation", "gripp_offerte_bot", "gripp_invoice_bot", "gripp_police_bot", "driff_channel_bot", "driff_webhook_bot", "huddle_bot"].includes(user.email)) return false;

      if (user.active !== 1) return false;

      if (search !== "") {
        if (user.name.toLowerCase().search(search.toLowerCase()) === -1 && user.email.toLowerCase().search(search.toLowerCase()) === -1) return false;
      }

      return true;
    });

  return (
    <>
      <div className="px-3 mb-4">
        <Search ref={refs.search} value={search} closeButton onClickEmpty={emptySearchInput} placeholder={dictionary.searchPlaceholder} onChange={handleSearchChange} autoFocus disabled={!usersLoaded} />
      </div>
      <div className="list-group list-group-flush">
        {userSort.map((user) => (
          <UserListItem key={user.id} user={user} />
        ))}
      </div>
    </>
  );
};

export default UserList;
