import React from "react";
import { useSelector } from "react-redux";
import { MoreOptions } from "../common";
import { useTranslationActions, useToaster, useUserOptions } from "../../hooks";
import { copyTextToClipboard } from "../../../helpers/commonFunctions";

const UserOptions = (props) => {
  const { user } = props;
  const toaster = useToaster();
  const { _t } = useTranslationActions();

  const dictionary = {
    searchTeamsPlaceholder: _t("PLACEHOLDER.SEARCH_TEAMS", "Search teams"),
    searchPeoplePlaceholder: _t("PLACEHOLDER.SEARCH_PEOPLE", "Search by name or email"),
    peopleExternal: _t("PEOPLE.EXTERNAL", "External"),
    peopleInvited: _t("PEOPLE.INVITED", "Invited"),
    assignAsAdmin: _t("PEOPLE.ASSIGN_AS_ADMIN", "Assign as administrator"),
    assignAsEmployee: _t("PEOPLE.ASSIGN_AS_EMPLOYEE", "Assign as employee"),
    archiveUser: _t("PEOPLE.ARCHIVE_USER", "Archive user"),
    unarchiveUser: _t("PEOPLE.UNARCHIVE_USER", "Unarchive user"),
    showInactiveMembers: _t("PEOPLE.SHOW_INACTIVE_MEMBERS", "Show inactive members"),
    archive: _t("PEOPLE.ARCHIVE", "Archive"),
    unarchive: _t("PEOPLE.UNARCHIVE", "Un-archive"),
    archiveConfirmationText: _t(
      "PEOPLE.ARCHIVE_CONFIRMATION_TEXT",
      "Are you sure you want to archive this user? This means this user can't log in anymore and will be removed from all its workspaces and group chats. If you want to remove him also from all chats and workspaces please use archive this user."
    ),
    unarchiveConfirmationText: _t("PEOPLE.UNARCHIVE_CONFIRMATION_TEXT", "Are you sure you want to un-archive this user? The user will be re-added to its connected workspaces and group chats."),
    cancel: _t("BUTTON.CANCEL", "Cancel"),
    activateUser: _t("PEOPLE.ACTIVATE_USER", "Activate user"),
    deactivateUser: _t("PEOPLE.DEACTIVATE_USER", "Deactivate user"),
    deactivateConfirmationText: _t(
      "PEOPLE.DEACTIVATE_CONFIRMATION_TEXT",
      "Are you sure you want to deactivate this user? This means this user can't log in anymore. If you want to remove him also from all chats and workspaces please use archive this user."
    ),
    activateConfirmationText: _t("PEOPLE.ACTIVATE_CONFIRMATION_TEXT", "Are you sure you want to activate this user? This means this user can log in again and see chats and workspaces."),
    activate: _t("PEOPLE.ACTIVATE", "Activate"),
    deactivate: _t("PEOPLE.DEACTIVATE", "Deactivate"),
    moveToInternal: _t("PEOPLE.MOVE_TO_INTERNAL", "Move to internal"),
    moveToExternal: _t("PEOPLE.MOVE_TO_EXTERNAL", "Move to external"),
    deleteUser: _t("PEOPLE.DELETE_USER", "Delete user"),
    deleteConfirmationText: _t("PEOPLE.DELETE_CONFIRMATION_TEXT", "Are you sure you want to delete this user? This means this user can't log in anymore."),
    btnInviteUsers: _t("BUTTON.INVITE_USERS", "Invite users"),
    resendInvitation: _t("PEOPLE.RESEND_INVITATION", "Resend invitation"),
    showInvited: _t("PEOPLE.SHOW_INVITED", "Show invited"),
    removeInvitedInternal: _t("PEOPLE.REMOVE_INVITED_INTERNAL", "Remove invited internal user"),
    sendInviteManually: _t("PEOPLE.SEND_INVITE_MANUALLY", "Send invite manually"),
    deleteInvitedUser: _t("PEOPLE.DELETE_INVITED_USER", "Delete invited user"),
    deleteInvitedConfirmationText: _t("PEOPLE.DELETE_INVITED_CONFIRMATION_TEXT", "Are you sure you want to remove this invited user?"),
    toasterRemoveInvited: _t("TOASTER.REMOVE_INVITED_USER", "Removed invited user"),
    btnTeam: _t("BUTTON.TEAM", "Team"),
    showTeams: _t("PEOPLE.SHOW_TEAMS", "Show teams"),
    editTeam: _t("TEAM_OPTIONS.EDIT_TEAM", "Edit team"),
    removeTeam: _t("TEAM_OPTIONS.REMOVE_TEAM", "Remove team"),
    removeTeamHeader: _t("TEAM_MODAL.REMOVE_TEAM_HEADER", "Remove team"),
    removeTeamBtn: _t("BUTTON.REMOVE_TEAM", "Remove team"),
    removeTeamConfirmation: _t("TEAM_MODAL.REMOVE_TEAM_BODY", "Are you sure you want to remove this team?"),
    addUserToTeam: _t("PEOPLE.ADD_USER_TEAM", "Add user to team"),
    removeTeamMember: _t("PEOPLE.REMOVE_TEAM_MEMBER", "Remove team member"),
    team: _t("TEAM", "Team"),
    internalAccounts: _t("CHART.INTERNAL_ACCOUNTS", "Accounts"),
    guestAccounts: _t("CHART.GUEST_ACCOUNTS", "Guest accounts"),
    totalAccounts: _t("LABEL.TOTAL_ACCOUNTS", "Total accounts"),
    moveToInternalConfirmation: _t("PEOPLE.MOVE_TO_INTERNAL_CONFIRMATION", "Are you sure you want to change user to internal account"),
    moveToExternalConfirmation: _t("PEOPLE.MOVE_TO_EXTERNAL_CONFIRMATION", "Are you sure you want to change user to guest account"),
  };

  const usersWithoutActivity = useSelector((state) => state.users.usersWithoutActivity);
  const roles = useSelector((state) => state.users.roles);
  const notificationSettings = useSelector((state) => state.admin.notifications);
  const notificationsLoaded = useSelector((state) => state.admin.notificationsLoaded);

  const actions = useUserOptions();

  const handleUpdateToAdmin = () => {
    let payload = {
      user_id: user.id,
      role_id: roles["admin"],
    };

    actions.updateUserRole(payload);
  };

  const handleUpdateToEmployee = () => {
    let payload = {
      user_id: user.id,
      role_id: roles["employee"],
    };
    actions.updateUserRole(payload);
  };

  const handleChangeToInternal = () => {
    const handleSubmit = () => {
      const payload = {
        id: user.id,
        type: "internal",
      };
      const cb = (err, res) => {
        if (err) return;
        toaster.success(`${_t("TOASTER.CHANGE_USER_TYPE", "Change user type to ::type::", { type: "internal" })}`);
      };
      actions.updateType(payload, cb);
    };

    let confirmModal = {
      type: "confirmation",
      headerText: dictionary.moveToInternal,
      submitText: dictionary.moveToInternal,
      cancelText: dictionary.cancel,
      bodyText: dictionary.moveToInternalConfirmation,
      actions: {
        onSubmit: handleSubmit,
      },
    };
    actions.showModal(confirmModal);
  };

  const handleChangeToExternal = () => {
    const handleSubmit = () => {
      const payload = {
        id: user.id,
        type: "external",
      };
      const cb = (err, res) => {
        if (err) return;
        toaster.success(`${_t("TOASTER.CHANGE_USER_TYPE", "Change user type to ::type::", { type: "external" })}`);
      };
      actions.updateType(payload, cb);
    };
    let confirmModal = {
      type: "confirmation",
      headerText: dictionary.moveToExternal,
      submitText: dictionary.moveToExternal,
      cancelText: dictionary.cancel,
      bodyText: dictionary.moveToExternalConfirmation,
      actions: {
        onSubmit: handleSubmit,
      },
    };
    actions.showModal(confirmModal);
  };

  const handleArchiveUser = () => {
    const handleSubmit = () => {
      if (user.active) {
        actions.archive({ user_id: user.id }, (err, res) => {
          if (err) return;
          toaster.success(`${user.name} archived.`);
        });
      } else {
        actions.unarchive({ user_id: user.id }, (err, res) => {
          if (err) return;
          toaster.success(`${user.name} unarchived.`);
        });
      }
    };

    let confirmModal = {
      type: "confirmation",
      headerText: user.active ? dictionary.archive : dictionary.unarchive,
      submitText: user.active ? dictionary.archive : dictionary.unarchive,
      cancelText: dictionary.cancel,
      bodyText: user.active ? dictionary.archiveConfirmationText : dictionary.unarchiveConfirmationText,
      actions: {
        onSubmit: handleSubmit,
      },
    };
    actions.showModal(confirmModal);
  };

  const handleActivateDeactivateUser = () => {
    const handleSubmit = () => {
      if (user.active && !user.deactivate) {
        actions.deactivate({ user_id: user.id }, (err, res) => {
          if (err) return;
          toaster.success(`${user.name} deactivated.`);
        });
      } else if (user.active === 0 && user.deactivate) {
        actions.activate({ user_id: user.id }, (err, res) => {
          if (err) return;
          toaster.success(`${user.name} activated.`);
        });
      }
    };

    let confirmModal = {
      type: "confirmation",
      headerText: user.active ? dictionary.deactivate : dictionary.activate,
      submitText: user.active ? dictionary.deactivate : dictionary.activate,
      cancelText: dictionary.cancel,
      bodyText: user.active ? dictionary.deactivateConfirmationText : dictionary.activateConfirmationText,
      actions: {
        onSubmit: handleSubmit,
      },
    };
    actions.showModal(confirmModal);
  };

  const handleDeleteUser = (user) => {
    const handleSubmit = () => {
      actions.deleteUserAccount({ user_id: user.id }, (err, res) => {
        if (err) return;
        toaster.success(`${user.name} deleted.`);
      });
    };

    let confirmModal = {
      type: "confirmation",
      headerText: dictionary.deleteUser,
      submitText: dictionary.deleteUser,
      cancelText: dictionary.cancel,
      bodyText: dictionary.deleteConfirmationText,
      actions: {
        onSubmit: handleSubmit,
      },
    };
    actions.showModal(confirmModal);
  };

  const handleReinvite = () => {
    let payload = {
      user_id: user.id,
      email: user.email,
    };
    const callback = (err, res) => {
      if (err) {
        toaster.error(_t("TOASTER.RESEND_INVITATION_FAILED", "Invitation failed"));
        return;
      } else {
        toaster.success(_t("TOASTER.RESEND_INVITATION_SUCCESS", "Invitation sent to ::email::", { email: user.email }));
      }
    };
    actions.resendInvitationEmail(payload, callback);
  };

  const handleDeleteInvitedInternalUser = () => {
    const handleSubmit = () => {
      actions.deleteInvitedInternalUser({ user_id: user.id }, (err, res) => {
        if (err) return;
        toaster.success(`${dictionary.toasterRemoveInvited}`);
      });
    };

    let confirmModal = {
      type: "confirmation",
      headerText: dictionary.deleteInvitedUser,
      submitText: dictionary.deleteInvitedUser,
      cancelText: dictionary.cancel,
      bodyText: dictionary.deleteInvitedConfirmationText,
      actions: {
        onSubmit: handleSubmit,
      },
    };
    actions.showModal(confirmModal);
  };

  const handleSendInviteManually = () => {
    copyTextToClipboard(toaster, user.invite_link);
  };

  const handleAddUserToTeam = () => {
    const modal = {
      type: "add-to-team",
      user: user,
    };
    actions.showModal(modal);
  };

  return (
    <MoreOptions className="ml-2" width={240} moreButton={"more-horizontal"}>
      {user.active && user.type === "internal" && user.role && user.role.name === "employee" && user.hasOwnProperty("has_accepted") && user.has_accepted && <div onClick={handleUpdateToAdmin}>{dictionary.assignAsAdmin}</div>}
      {user.active && user.type === "internal" && user.role && user.role.name === "admin" && user.hasOwnProperty("has_accepted") && user.has_accepted && <div onClick={handleUpdateToEmployee}>{dictionary.assignAsEmployee}</div>}
      {user.active && user.type === "external" && <div onClick={handleChangeToInternal}>{dictionary.moveToInternal}</div>}
      {user.active && user.type === "internal" && <div onClick={handleChangeToExternal}>{dictionary.moveToExternal}</div>}
      {user.active === 0 && !user.deactivate ? <div onClick={handleArchiveUser}>{dictionary.unarchiveUser}</div> : null}
      {user.active && user.hasOwnProperty("has_accepted") && user.has_accepted ? <div onClick={handleArchiveUser}>{dictionary.archiveUser}</div> : null}
      {!user.deactivate && user.active && user.hasOwnProperty("has_accepted") && user.has_accepted ? <div onClick={handleActivateDeactivateUser}>{dictionary.deactivateUser}</div> : null}
      {user.active === 0 && user.deactivate && user.active === 0 && user.hasOwnProperty("has_accepted") && user.has_accepted ? <div onClick={handleActivateDeactivateUser}>{dictionary.activateUser}</div> : null}
      {(user.active && user.hasOwnProperty("has_accepted") && user.has_accepted && usersWithoutActivity.some((u) => u.user_id === user.id)) || (user.hasOwnProperty("has_accepted") && !user.has_accepted && user.type === "external") ? (
        <div onClick={handleDeleteUser}>{dictionary.deleteUser}</div>
      ) : null}
      {user.active && user.hasOwnProperty("has_accepted") && !user.has_accepted && notificationsLoaded && notificationSettings.email && <div onClick={handleReinvite}>{dictionary.resendInvitation}</div>}
      {user.active && user.hasOwnProperty("has_accepted") && !user.has_accepted && user.type === "internal" && <div onClick={handleDeleteInvitedInternalUser}>{dictionary.removeInvitedInternal}</div>}
      {user.active && user.hasOwnProperty("has_accepted") && !user.has_accepted && user.type === "internal" && <div onClick={handleSendInviteManually}>{dictionary.sendInviteManually}</div>}
      {user.active && user.type === "internal" && <div onClick={handleAddUserToTeam}>{dictionary.addUserToTeam}</div>}
    </MoreOptions>
  );
};

export default UserOptions;
