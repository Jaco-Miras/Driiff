import React, { useEffect, useRef, useState } from "react";
import { useHistory, Route, Switch } from "react-router-dom";
import styled from "styled-components";
import SearchForm from "../../forms/SearchForm";
import { useToaster, useTranslationActions, useUserChannels } from "../../hooks";
import { SvgIconFeather } from "../../common";
import { addToModals } from "../../../redux/actions/globalActions";
import { useDispatch, useSelector } from "react-redux";
import { CustomInput } from "reactstrap";
import { replaceChar } from "../../../helpers/stringFormatter";
import { getUsersWithoutActivity } from "../../../redux/actions/userAction";
import AllUsersStructure from "./AllUsersStructure";
import TeamBody from "./TeamBody";
import AllPeople from "./AllPeople";

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
`;

const Search = styled(SearchForm)`
  width: 50%;
  margin-bottom: 1rem;
  min-width: 250px;
`;

const SystemPeoplePanel = (props) => {
  const { className = "" } = props;

  const { users, userActions, loggedUser, selectUserChannel } = useUserChannels();
  const roles = useSelector((state) => state.users.roles);
  const inactiveUsers = useSelector((state) => state.users.archivedUsers);
  const usersWithoutActivity = useSelector((state) => state.users.usersWithoutActivity);
  const usersWithoutActivityLoaded = useSelector((state) => state.users.usersWithoutActivityLoaded);
  const teams = useSelector((state) => state.users.teams);

  const history = useHistory();
  const dispatch = useDispatch();

  const [search, setSearch] = useState("");
  const [showInactive, setShowInactive] = useState(false);
  const [showInvited, setShowInvited] = useState(false);
  const [showTeams, setShowTeams] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);

  const botCodes = ["gripp_bot_account", "gripp_bot_invoice", "gripp_bot_offerte", "gripp_bot_project", "gripp_bot_account", "driff_webhook_bot", "huddle_bot"];
  const allUsers = [...Object.values(users), ...inactiveUsers].filter((u) => {
    if (u.email && botCodes.includes(u.email)) {
      return false;
    } else {
      return true;
    }
  });

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

  const userSort = allUsers
    .filter((user) => {
      if (["gripp_project_bot", "gripp_account_activation", "gripp_offerte_bot", "gripp_invoice_bot", "gripp_police_bot", "driff_webhook_bot"].includes(user.email)) return false;
      if (selectedTeam) {
        //return selectedTeam.member_ids.some((id) => id === user.id);
        return true;
      }
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

      if (search !== "" && !showTeams) {
        if (user.name.toLowerCase().search(search.toLowerCase()) !== -1 || user.email.toLowerCase().search(search.toLowerCase()) !== -1 || (user.role && user.role.name.toLowerCase().search(search.toLowerCase()) !== -1)) return true;
        else return false;
      }

      return true;
    })
    .sort((a, b) => {
      return a.name.localeCompare(b.name);
    });

  const { _t } = useTranslationActions();

  const dictionary = {
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
    removeTeam: _t("TEAM_OPTIONS.EDIT_TEAM", "Remove team"),
    removeTeamHeader: _t("TEAM_MODAL.REMOVE_TEAM_HEADER", "Remove team"),
    removeTeamBtn: _t("BUTTON.REMOVE_TEAM", "Remove team"),
    removeTeamConfirmation: _t("TEAM_MODAL.REMOVE_TEAM_BODY", "Are you sure you want to remove this team?"),
    addUserToTeam: _t("PEOPLE.ADD_USER_TEAM", "Add user to team"),
    removeTeamMember: _t("PEOPLE.REMOVE_TEAM_MEMBER", "Remove team member"),
    team: _t("TEAM", "Team"),
  };

  const handleInviteUsers = () => {
    let payload = {
      type: "driff_invite_users",
      hasLastName: true,
      invitations: [],
      fromRegister: false,
      onPrimaryAction: (invitedUsers, callback, options) => {
        if (invitedUsers.length === 0) {
          options.closeModal();
        }

        let processed = 0;
        invitedUsers.forEach((u, i) => {
          if (!Object.values(users).some((user) => user.email === u.email)) {
            userActions.inviteAsInternalUsers(
              {
                email: u.email,
                first_name: u.first_name,
                last_name: u.last_name,
                team_ids: u.teams ? u.teams.map((t) => t.id) : [],
              },
              (err, res) => {
                if (err) {
                  toaster.error(`Something went wrong with ${u.first_name} ${u.last_name}`);
                  options.deleteItemByIndex(options.invitationItems.findIndex((i) => i.email === u.email));
                }
                if (res) {
                  processed += 1;
                  options.deleteItemByIndex(options.invitationItems.findIndex((i) => i.email === u.email));
                  toaster.success(`You have invited ${u.first_name} ${u.last_name}`);
                }

                //last iteration
                if (i === invitedUsers.length - 1) {
                  if (processed === invitedUsers.length) {
                    options.closeModal();
                  }

                  callback();
                }
              }
            );
          } else {
            toaster.error(
              <>
                Email <b>{u.email}</b> is already taken!
              </>
            );

            //last iteration
            if (i === invitedUsers.length - 1) {
              if (processed === invitedUsers.length) {
                options.closeModal();
              }

              callback();
            }
          }
        });
      },
    };

    dispatch(addToModals(payload));
  };

  const handleAddTeam = () => {
    const modal = {
      mode: "create",
      type: "team",
      team: null,
    };
    dispatch(addToModals(modal));
  };

  const toaster = useToaster();

  const handleShowInactiveToggle = () => {
    setShowTeams(false);
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

  useEffect(() => {
    if (loggedUser.role.name === "admin" || loggedUser.role.name === "owner") dispatch(getUsersWithoutActivity());
    refs.search.current.focus();
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

  const handleShowInvitedToggle = () => {
    setShowTeams(false);
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

  const handleShowTeamsToggle = () => {
    if (!showTeams) {
      history.push("/system/people/teams");
      setSelectedTeam(null);
    } else {
      history.push("/system/people");
    }
    setShowTeams(!showTeams);
    setShowInvited(false);
    setShowInactive(false);
  };

  const handleAddUserToTeam = (user) => {
    const modal = {
      type: "add-to-team",
      user: user,
    };
    dispatch(addToModals(modal));
  };

  const handleSelectTeam = (team) => {
    setShowTeams(false);
    setSelectedTeam(team);
    history.push(`/system/people/teams/${team.id}/${team.name}`);
  };

  const isAdmin = loggedUser.role.name === "admin" || loggedUser.role.name === "owner";

  return (
    <Wrapper className={`workspace-people container-fluid h-100 ${className}`}>
      <div className="card">
        <div className="card-body">
          <div className="people-header">
            <div className="d-flex align-items-center people-search">
              <Search ref={refs.search} value={search} closeButton="true" onClickEmpty={emptySearchInput} placeholder={dictionary.searchPeoplePlaceholder} onChange={handleSearchChange} autoFocus />
              <CustomInput
                className="ml-2 mb-3 cursor-pointer text-muted cursor-pointer"
                checked={showInactive}
                id="show_inactive"
                name="show_inactive"
                type="switch"
                onChange={handleShowInactiveToggle}
                data-success-message={`${showInactive ? "Inactive users are shown" : "Inactive users are no longer visible"}`}
                label={<span>{dictionary.showInactiveMembers}</span>}
              />
              <CustomInput
                className="ml-2 mb-3 cursor-pointer text-muted cursor-pointer"
                checked={showInvited}
                id="show_invited"
                name="show_invited"
                type="switch"
                onChange={handleShowInvitedToggle}
                //data-success-message={`${showInactive ? "Inactive users are shown" : "Inactive users are no longer visible"}`}
                label={<span>{dictionary.showInvited}</span>}
              />
              <CustomInput
                className="ml-2 mb-3 cursor-pointer text-muted cursor-pointer"
                checked={showTeams}
                id="show_teams"
                name="show_teams"
                type="switch"
                onChange={handleShowTeamsToggle}
                //data-success-message={`${showInactive ? "Inactive users are shown" : "Inactive users are no longer visible"}`}
                label={<span>{dictionary.showTeams}</span>}
              />
            </div>
            <div>
              {isAdmin && (
                <button className="btn btn-primary mr-2" onClick={handleAddTeam}>
                  <SvgIconFeather className="mr-2" icon="user-plus" /> {dictionary.btnTeam}
                </button>
              )}

              <button className="btn btn-primary" onClick={handleInviteUsers}>
                <SvgIconFeather className="mr-2" icon="user-plus" /> {dictionary.btnInviteUsers}
              </button>
            </div>
          </div>

          <Switch>
            <Route
              render={() => (
                <TeamBody
                  setSelectedTeam={setSelectedTeam}
                  selectedTeam={selectedTeam}
                  teams={teams}
                  users={userSort}
                  loggedUser={loggedUser}
                  onNameClick={handleUserNameClick}
                  onChatClick={handleUserChat}
                  dictionary={dictionary}
                  onUpdateRole={userActions.updateUserRole}
                  showOptions={isAdmin && usersWithoutActivityLoaded}
                  roles={roles}
                  onArchiveUser={handleArchiveUser}
                  onActivateUser={handleActivateUser}
                  onChangeUserType={userActions.updateType}
                  onDeleteUser={handleDeleteUser}
                  onResendInvite={handleResendInvite}
                  onDeleteInvitedInternalUser={handleDeleteInvitedInternalUser}
                  showInactive={showInactive}
                  usersWithoutActivity={usersWithoutActivity}
                  onAddUserToTeam={handleAddUserToTeam}
                />
              )}
              path={["/system/people/teams/:teamId/:teamName"]}
            />
            <Route
              render={() => <AllUsersStructure users={userSort} onSelectTeam={handleSelectTeam} setShowTeams={setShowTeams} loggedUser={loggedUser} dictionary={dictionary} _t={_t} showOptions={isAdmin} />}
              path={["/system/people/teams"]}
            />
            <Route
              render={() => (
                <AllPeople
                  users={userSort}
                  loggedUser={loggedUser}
                  onNameClick={handleUserNameClick}
                  onChatClick={handleUserChat}
                  dictionary={dictionary}
                  onUpdateRole={userActions.updateUserRole}
                  showOptions={isAdmin && usersWithoutActivityLoaded}
                  roles={roles}
                  onArchiveUser={handleArchiveUser}
                  onActivateUser={handleActivateUser}
                  onChangeUserType={userActions.updateType}
                  onDeleteUser={handleDeleteUser}
                  onResendInvite={handleResendInvite}
                  onDeleteInvitedInternalUser={handleDeleteInvitedInternalUser}
                  showInactive={showInactive}
                  usersWithoutActivity={usersWithoutActivity}
                  onAddUserToTeam={handleAddUserToTeam}
                  setSelectedTeam={setSelectedTeam}
                  setShowTeams={setShowTeams}
                />
              )}
              path={["/system/people"]}
            />
          </Switch>
        </div>
      </div>
    </Wrapper>
  );
};

export default React.memo(SystemPeoplePanel);
