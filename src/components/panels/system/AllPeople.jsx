import React, { useEffect } from "react";
import { PeopleListItem } from "../../list/people/item";

const AllPeople = (props) => {
  const {
    users,
    loggedUser,
    onNameClick,
    onChatClick,
    dictionary,
    onUpdateRole,
    showOptions,
    roles,
    onArchiveUser,
    onActivateUser,
    onChangeUserType,
    onDeleteUser,
    onResendInvite,
    onDeleteInvitedInternalUser,
    showInactive,
    usersWithoutActivity,
    onAddUserToTeam,
    setSelectedTeam,
    setShowTeams,
  } = props;

  useEffect(() => {
    setSelectedTeam(null);
    setShowTeams(false);
  }, []);

  return (
    <div className="row">
      {users.map((user) => {
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
  );
};

export default AllPeople;
