import React, { useState } from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { PeopleListItem } from "../../list/people/item";
import { CustomInput } from "reactstrap";
import SearchForm from "../../forms/SearchForm";
import { useToaster } from "../../hooks";

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

  const toaster = useToaster();

  const [showInactive, setShowInactive] = useState(false);
  const [showInvited, setShowInvited] = useState(false);
  const [search, setSearch] = useState("");

  const users = useSelector((state) => state.users.users);
  const roles = useSelector((state) => state.users.roles);
  const inactiveUsers = useSelector((state) => state.users.archivedUsers);
  const usersWithoutActivity = useSelector((state) => state.users.usersWithoutActivity);
  //const usersWithoutActivityLoaded = useSelector((state) => state.users.usersWithoutActivityLoaded);

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
    if (showInvited && !showInactive) setShowInvited(false);
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
    if (showInactive && !showInvited) setShowInactive(false);
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

  return (
    <>
      <div className="people-header">
        <PeopleSearch className="d-flex align-items-center people-search">
          <Search value={search} closeButton="true" onClickEmpty={emptySearchInput} placeholder={dictionary.searchPeoplePlaceholder} onChange={handleSearchChange} autoFocus />

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
            //data-success-message={`${showInactive ? "Inactive users are shown" : "Inactive users are no longer visible"}`}
            label={
              <span>
                {dictionary.showInvited} {showInvited && allUsers.filter((u) => u.hasOwnProperty("has_accepted") && !u.has_accepted && u.active).length}
              </span>
            }
          />

          {/* <div className="mr-3 text-muted">Active employee accounts: {allUsers.filter((u) => u.active && u.type === "internal").length}</div> */}
          <div className="mr-3 text-muted">
            {dictionary.totalAccounts}: {allUsers.filter((u) => u.active).length}
          </div>
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
