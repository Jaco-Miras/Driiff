import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { useRouteMatch, useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { PeopleListItem } from "../../list/people/item";
import { CustomInput } from "reactstrap";
import SearchForm from "../../forms/SearchForm";
import { useToaster } from "../../hooks";
import axios from "axios";
import { searchUsers } from "../../../redux/actions/userAction";

const Search = styled(SearchForm)`
  //width: 50%;
  //margin-bottom: 1rem;
  min-width: 250px;
`;

const PeopleSearch = styled.div`
  .custom-switch {
    margin-bottom: 0 !important;
  }
  div.text-muted {
    font-weight: 500;
  }
  form {
    display: flex;
    flex-grow: 1;
    width: auto;
  }
`;

const AllPeople = (props) => {
  const { loggedUser, onNameClick, onChatClick, dictionary, onUpdateRole, showOptions, onArchiveUser, onActivateUser, onChangeUserType, onDeleteUser, onResendInvite, onDeleteInvitedInternalUser, onAddUserToTeam } = props;

  const dispatch = useDispatch();
  const toaster = useToaster();
  const match = useRouteMatch();
  const history = useHistory();

  const [showInactive, setShowInactive] = useState(false);
  const [showInvited, setShowInvited] = useState(false);
  const [showGuest, setShowGuest] = useState(false);
  const [search, setSearch] = useState("");
  const [searching, setSearching] = useState(false);

  const users = useSelector((state) => state.users.users);
  const roles = useSelector((state) => state.users.roles);
  const inactiveUsers = useSelector((state) => state.users.archivedUsers);
  const usersWithoutActivity = useSelector((state) => state.users.usersWithoutActivity);

  const handleShowInactiveToggle = () => {
    //setShowTeams(false);
    setShowInactive((prevState) => {
      const newState = !prevState;

      if (newState) {
        toaster.success("Showing inactive members");
      } else {
        toaster.success("Showing active members only");
      }

      return newState;
    });
    if (showInactive) history.push("/system/people/all");
    else history.push("/system/people/inactive");
    if (showInvited && !showInactive) setShowInvited(false);
    setShowGuest(false);
  };

  const handleShowInvitedToggle = () => {
    //setShowTeams(false);
    setShowInvited((prevState) => {
      const newState = !prevState;

      // if (newState) {
      //   toaster.success("Showing inactive members");
      // } else {
      //   toaster.success("Showing active members only");
      // }

      return newState;
    });
    if (showInvited) history.push("/system/people/all");
    else history.push("/system/people/invited");
    if (showInactive && !showInvited) setShowInactive(false);
    setShowGuest(false);
  };

  const handleShowGuestToggle = () => {
    //setShowTeams(false);
    setShowGuest((prevState) => !prevState);
    setShowInactive(false);
    setShowInvited(false);
    if (showGuest) history.push("/system/people/all");
    else history.push("/system/people/guest");
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const emptySearchInput = () => {
    setSearch("");
  };

  const botCodes = ["gripp_bot_account", "gripp_bot_invoice", "gripp_bot_offerte", "gripp_bot_project", "gripp_bot_account", "driff_webhook_bot", "huddle_bot"];
  const allUsers = [...Object.values(users), ...inactiveUsers].filter((u) => {
    if (u.email && botCodes.includes(u.email)) {
      return false;
    } else {
      return true;
    }
  });

  const userSort = allUsers
    .filter((user) => {
      if (["gripp_project_bot", "gripp_account_activation", "gripp_offerte_bot", "gripp_invoice_bot", "gripp_police_bot", "driff_webhook_bot"].includes(user.email)) return false;
      if (showInactive) {
        if (user.active === 1) {
          return false;
        }
        if (user.name.trim() === "") {
          return false;
        }
      } else if (showInvited) {
        return !user.has_accepted && user.active;
      } else if (showGuest) {
        return user.has_accepted && user.active && user.type === "external";
      } else {
        if (user.active !== 1) {
          return false;
        }
      }

      if (search !== "") {
        if (user.name.toLowerCase().search(search.toLowerCase()) !== -1 || user.email.toLowerCase().search(search.toLowerCase()) !== -1 || (user.role && user.role.name.toLowerCase().search(search.toLowerCase()) !== -1)) return true;
        else return false;
      }

      return true;
    })
    .sort((a, b) => {
      return a.name.localeCompare(b.name);
    });

  const cancelToken = useRef(null);
  const handleSearchUsers = () => {
    if (search.trim() !== "" && search.trim().length >= 3) {
      //Check if there are any previous pending requests
      if (cancelToken.current) {
        cancelToken.current.cancel("Operation canceled due to new request.");
        cancelToken.current = null;
      }

      //Save the cancel token for the current request
      cancelToken.current = axios.CancelToken.source();
      setSearching(true);
      const payload = {
        search: search,
        cancelToken: cancelToken.current.token,
      };
      dispatch(
        searchUsers(payload, (err, res) => {
          setSearching(false);
        })
      );
    }
  };

  useEffect(() => {
    const timeOutId = setTimeout(() => {
      if (search === "") return;
      handleSearchUsers();
    }, 1000);
    return () => {
      clearTimeout(timeOutId);
    };
  }, [search]);

  useEffect(() => {
    if (match.path === "/system/people/invited") {
      setShowInvited(true);
    } else if (match.path === "/system/people/inactive") {
      setShowInactive(true);
    } else if (match.path === "/system/people/guest") {
      setShowGuest(true);
    } else if (match.path === "/system/people/all") {
      setShowInvited(false);
      setShowInactive(false);
      setShowGuest(false);
    }
  }, [match.path]);

  return (
    <>
      <div className="people-header">
        <PeopleSearch className="d-flex align-items-center people-search">
          <Search value={search} closeButton="true" onClickEmpty={emptySearchInput} placeholder={dictionary.searchPeoplePlaceholder} onChange={handleSearchChange} autoFocus searching={searching} />

          <CustomInput
            className="ml-2 mr-2 cursor-pointer text-muted cursor-pointer"
            checked={showInactive}
            id="show_inactive"
            name="show_inactive"
            type="switch"
            onChange={handleShowInactiveToggle}
            data-success-message={`${showInactive ? "Inactive users are shown" : "Inactive users are no longer visible"}`}
            label={<span>{dictionary.showInactiveMembers}</span>}
          />
          <CustomInput
            className="mr-3 cursor-pointer text-muted cursor-pointer"
            checked={showInvited}
            id="show_invited"
            name="show_invited"
            type="switch"
            onChange={handleShowInvitedToggle}
            label={
              <span>
                {dictionary.showInvited} {showInvited && allUsers.filter((u) => u.hasOwnProperty("has_accepted") && !u.has_accepted && u.active).length}
              </span>
            }
          />
          <CustomInput
            className="mr-3 cursor-pointer text-muted cursor-pointer"
            checked={showGuest}
            id="show_guest"
            name="show_guest"
            type="switch"
            onChange={handleShowGuestToggle}
            //data-success-message={`${showInactive ? "Inactive users are shown" : "Inactive users are no longer visible"}`}
            label={<span>{dictionary.showGuest}</span>}
          />

          {/* <div className="mr-3 text-muted">Active employee accounts: {allUsers.filter((u) => u.active && u.type === "internal").length}</div> */}
          {/* <div className="mr-3 text-muted">
            {dictionary.totalAccounts}: {allUsers.filter((u) => u.active).length}
          </div> */}
        </PeopleSearch>
      </div>
      <div className="row">
        {userSort.map((user) => {
          return (
            <PeopleListItem
              loggedUser={loggedUser}
              key={user.id}
              user={user}
              onNameClick={onNameClick}
              onChatClick={onChatClick}
              dictionary={dictionary}
              onUpdateRole={onUpdateRole}
              showOptions={showOptions}
              roles={roles}
              onArchiveUser={onArchiveUser}
              onActivateUser={onActivateUser}
              onChangeUserType={onChangeUserType}
              onDeleteUser={onDeleteUser}
              onResendInvite={onResendInvite}
              onDeleteInvitedInternalUser={onDeleteInvitedInternalUser}
              showInactive={showInactive}
              usersWithoutActivity={usersWithoutActivity}
              onAddUserToTeam={onAddUserToTeam}
            />
          );
        })}
      </div>
    </>
  );
};

export default AllPeople;
