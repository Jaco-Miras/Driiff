import React, { useEffect } from "react";
import { useHistory, Route, Switch } from "react-router-dom";
import styled from "styled-components";
import { useToaster, useTranslationActions, useUserChannels } from "../../hooks";
import { addToModals } from "../../../redux/actions/globalActions";
import { useDispatch, useSelector } from "react-redux";
import { replaceChar } from "../../../helpers/stringFormatter";
import { getUsersWithoutActivity } from "../../../redux/actions/userAction";
import AllUsersStructure from "./AllUsersStructure";
import TeamBody from "./TeamBody";
import AllPeople from "./AllPeople";
import AllTeams from "./AllTeams";

const Wrapper = styled.div`
  overflow: auto;
  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;

  .people-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 1rem;
    flex-flow: row wrap;
  }

  .people-search {
    flex: 0 0 100%;
    justify-content: flex-start;
    padding-left: 0;
    flex-flow: row wrap;
  }
  .card {
    min-height: calc(100% - 40px);
  }
  .card-body.structure {
    overflow: auto;
    margin: 1.5rem;
    padding: 0;
  }
`;

const SystemPeoplePanel = (props) => {
  const { className = "" } = props;

  const { userActions, loggedUser, selectUserChannel } = useUserChannels();
  const roles = useSelector((state) => state.users.roles);
  const inactiveUsers = useSelector((state) => state.users.archivedUsers);
  //const usersWithoutActivity = useSelector((state) => state.users.usersWithoutActivity);
  const usersWithoutActivityLoaded = useSelector((state) => state.users.usersWithoutActivityLoaded);

  const history = useHistory();
  const dispatch = useDispatch();

  const handleUserNameClick = (user) => {
    history.push(`/profile/${user.id}/${replaceChar(user.name)}`);
  };

  const handleUserChat = (user) => selectUserChannel(user);

  const { _t } = useTranslationActions();

  const dictionary = {
    searchTeamsPlaceholder: _t("PLACEHOLDER.SEARCH_TEAMS", "Search teams"),
    searchPeoplePlaceholder: _t("PLACEHOLDER.SEARCH_PEOPLE", "Search by name or email"),
    peopleExternal: _t("PEOPLE.EXTERNAL", "External"),
    peopleInvited: _t("PEOPLE.INVITED", "Invited"),
    assignAsAdmin: _t("PEOPLE.ASSIGN_AS_ADMIN", "Assign as administrator"),
    assignAsSupervisor: _t("PEOPLE.ASSIGN_AS_SUPERVISOR", "Assign as supervisor"),
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
    showGuest: _t("PEOPLE.GUEST_ACCOUNTS", "Guest accounts"),
    removeInvitedInternal: _t("PEOPLE.REMOVE_INVITED_INTERNAL", "Remove invited internal user"),
    sendInviteManually: _t("PEOPLE.SEND_INVITE_MANUALLY", "Send invite manually"),
    deleteInvitedUser: _t("PEOPLE.DELETE_INVITED_USER", "Delete invited user"),
    copyInviteLink: _t("PEOPLE.COPY_INVITE_LINK", "Copy Invite link"),
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
    thisIsAnAdminAccount: _t("TOOLTIP.THIS_IS_AN_ADMIN_ACCOUNT", "This is an administrator account"),
    guestBadge: _t("BADGE.GUEST", "Guest"),
    invitedGuestBadge: _t("BADGE.INVITED_GUEST", "Invited Guest"),
    connectedWorkspaceIcon: _t("TOOLTIP.CONNECTED_WORKSPACE", "Connected workspace"),
    phoneIcon: _t("TOOLTIP.PHONE", "Call profile phone number"),
    messageIcon: _t("TOOLTIP.MESSAGE_BUBBLE", "Send a chat to this person"),
    copyToClipboard: _t("TOAST.COPY_TO_CLIPBOARD_INVITE_LINK", "Invitation link copied"),
    sendEmailInviteLink: _t("TOOLTIP.SEND_EMAIL_INVITE", "Mail Invite Link"),
  };

  const toaster = useToaster();

  useEffect(() => {
    if (loggedUser.role.id <= 2) dispatch(getUsersWithoutActivity());
    // check if roles has an object
    if (Object.keys(roles).length === 0) {
      userActions.fetchRoles();
    }
    if (inactiveUsers.length === 0) {
      userActions.fetchArchivedUsers();
    }
  }, []);

  const handleArchiveUser = (user) => {
    const handleSubmit = () => {
      if (user.active) {
        userActions.archive({ user_id: user.id }, (err, res) => {
          if (err) return;
          toaster.success(`${user.name} archived.`);
        });
      } else {
        userActions.unarchive({ user_id: user.id }, (err, res) => {
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
    dispatch(addToModals(confirmModal));
  };

  const handleActivateUser = (user) => {
    const handleSubmit = () => {
      if (user.active && !user.deactivate) {
        userActions.deactivate({ user_id: user.id }, (err, res) => {
          if (err) return;
          toaster.success(`${user.name} deactivated.`);
        });
      } else if (user.active === 0 && user.deactivate) {
        userActions.activate({ user_id: user.id }, (err, res) => {
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
    dispatch(addToModals(confirmModal));
  };

  const handleDeleteUser = (user) => {
    const handleSubmit = () => {
      userActions.deleteUserAccount({ user_id: user.id }, (err, res) => {
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
    dispatch(addToModals(confirmModal));
  };

  const handleResendInvite = (user) => {
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
    userActions.resendInvitationEmail(payload, callback);
  };

  const handleDeleteInvitedInternalUser = (user) => {
    const handleSubmit = () => {
      userActions.deleteInvitedInternalUser({ user_id: user.id }, (err, res) => {
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
    dispatch(addToModals(confirmModal));
  };

  const handleAddUserToTeam = (user) => {
    const modal = {
      type: "add-to-team",
      user: user,
    };
    dispatch(addToModals(modal));
  };

  const isAdmin = loggedUser.role.id <= 2;

  return (
    <Wrapper className={`workspace-people container-fluid h-100 ${className}`}>
      <div className="card">
        <Switch>
          <Route
            render={() => (
              <div className="card-body">
                <TeamBody
                  loggedUser={loggedUser}
                  onNameClick={handleUserNameClick}
                  onChatClick={handleUserChat}
                  dictionary={dictionary}
                  onUpdateRole={userActions.updateUserRole}
                  showOptions={isAdmin && usersWithoutActivityLoaded}
                  onArchiveUser={handleArchiveUser}
                  onActivateUser={handleActivateUser}
                  onChangeUserType={userActions.updateType}
                  onDeleteUser={handleDeleteUser}
                  onResendInvite={handleResendInvite}
                  onDeleteInvitedInternalUser={handleDeleteInvitedInternalUser}
                  onAddUserToTeam={handleAddUserToTeam}
                />
              </div>
            )}
            path={["/system/people/teams/:teamId/:teamName"]}
          />
          <Route
            render={() => (
              <div className="card-body structure">
                <AllUsersStructure loggedUser={loggedUser} dictionary={dictionary} />
              </div>
            )}
            path={["/system/people/organization"]}
          />
          <Route
            render={() => (
              <div className="card-body">
                <AllTeams loggedUser={loggedUser} dictionary={dictionary} _t={_t} showOptions={isAdmin} />
              </div>
            )}
            path={["/system/people/teams"]}
          />
          <Route
            render={() => (
              <div className="card-body">
                <AllPeople
                  loggedUser={loggedUser}
                  onNameClick={handleUserNameClick}
                  onChatClick={handleUserChat}
                  dictionary={dictionary}
                  onUpdateRole={userActions.updateUserRole}
                  showOptions={isAdmin && usersWithoutActivityLoaded}
                  onArchiveUser={handleArchiveUser}
                  onActivateUser={handleActivateUser}
                  onChangeUserType={userActions.updateType}
                  onDeleteUser={handleDeleteUser}
                  onResendInvite={handleResendInvite}
                  onDeleteInvitedInternalUser={handleDeleteInvitedInternalUser}
                  onAddUserToTeam={handleAddUserToTeam}
                />
              </div>
            )}
            path={["/system/people/all/online", "/system/people/all", "/system/people/invited", "/system/people/inactive", "/system/people/guest"]}
          />
        </Switch>
      </div>
    </Wrapper>
  );
};

export default React.memo(SystemPeoplePanel);
