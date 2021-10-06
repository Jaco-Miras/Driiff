import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { PeopleListItem } from "../../list/people/item";

const TeamBody = (props) => {
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
    teams,
    selectedTeam,
    setSelectedTeam,
  } = props;

  const params = useParams();

  useEffect(() => {
    if (selectedTeam === null && teams[params.teamId]) {
      setSelectedTeam(teams[params.teamId]);
    }
  }, [selectedTeam, teams]);

  if (users && selectedTeam) {
    return (
      <>
        <div className="col-lg-12">
          <h4>
            {selectedTeam.name} {selectedTeam.members.length} members
          </h4>
        </div>
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
      </>
    );
  } else {
    return null;
  }
};

export default TeamBody;
