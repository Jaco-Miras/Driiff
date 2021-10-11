import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { PeopleListItem } from "../../list/people/item";
import { useTeamActions, useTranslationActions, useToaster } from "../../hooks";
import { addToModals } from "../../../redux/actions/globalActions";

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

  const dispatch = useDispatch();

  const { _t } = useTranslationActions();
  const toaster = useToaster();

  const actions = useTeamActions();

  const handleDeleteTeamMember = (member) => {
    const handleRemoveMember = () => {
      let payload = {
        team_id: params.teamId,
        remove_member_ids: [member.id],
      };
      let cb = (err, res) => {
        if (err) return;
        toaster.success(_t("TOASTER.SUCCESS_REMOVE_TEAM_MEMBER", "Successfully removed team member"));
      };
      actions.removeMember(payload, cb);
    };
    const modal = {
      type: "confirmation",
      headerText: _t("REMOVE_TEAM_MEMBER_HEADER", "Remove team member"),
      submitText: _t("REMOVE_TEAM_MEMBER_BUTTON", "Remove"),
      cancelText: _t("BUTTON.CANCEL", "CANCEL"),
      bodyText: _t("REMOVE_TEAM_MEMBER_BODY", "Are you sure you want to remove ::name::?", { name: member.name }),
      actions: {
        onSubmit: handleRemoveMember,
      },
    };
    dispatch(addToModals(modal));
  };

  if (users && teams[params.teamId]) {
    return (
      <>
        <div className="col-lg-12">
          <h4>
            {teams[params.teamId].name} {teams[params.teamId].members.length} members
          </h4>
        </div>
        <div className="row">
          {users
            .filter((u) => teams[params.teamId].members.some((m) => m.id === u.id))
            .map((user) => {
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
                  onDeleteTeamMember={handleDeleteTeamMember}
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
