import React from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { PeopleListItem } from "../../list/people/item";
import { useTeamActions, useTranslationActions, useToaster } from "../../hooks";
import { addToModals } from "../../../redux/actions/globalActions";

const TeamBody = (props) => {
  const { loggedUser, onNameClick, onChatClick, dictionary, onUpdateRole, showOptions, onArchiveUser, onActivateUser, onChangeUserType, onDeleteUser, onResendInvite, onDeleteInvitedInternalUser, onAddUserToTeam } = props;

  const params = useParams();

  const teams = useSelector((state) => state.users.teams);
  const users = useSelector((state) => state.users.users);
  const roles = useSelector((state) => state.users.roles);
  const usersWithoutActivity = useSelector((state) => state.users.usersWithoutActivity);

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

  if (Object.values(users).length && teams[params.teamId]) {
    return (
      <>
        <div className="col-lg-12">
          <h4>
            {teams[params.teamId].name} {teams[params.teamId].members.length} members
          </h4>
        </div>
        <div className="row">
          {Object.values(users)
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
