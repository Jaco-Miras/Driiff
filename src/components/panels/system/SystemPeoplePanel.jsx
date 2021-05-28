import React, { useCallback, useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import SearchForm from "../../forms/SearchForm";
import { useToaster, useTranslation, useUserChannels } from "../../hooks";
import { PeopleListItem } from "../../list/people/item";
import { SvgIconFeather } from "../../common";
import { addToModals } from "../../../redux/actions/globalActions";
import { useDispatch, useSelector } from "react-redux";
import { CustomInput } from "reactstrap";
import { replaceChar } from "../../../helpers/stringFormatter";

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
  }

  .people-search {
    flex: 0 0 80%;
    justify-content: flex-start;
    padding-left: 0;
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

  const history = useHistory();
  const dispatch = useDispatch();

  const [search, setSearch] = useState("");
  const [showInactive, setShowInactive] = useState(false);

  const allUsers = [...Object.values(users), ...inactiveUsers];

  const refs = {
    search: useRef(),
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const emptySearchInput = () => {
    setSearch("");
  };

  const handleUserNameClick = useCallback(
    (user) => {
      history.push(`/profile/${user.id}/${replaceChar(user.name)}`);
    },
    [history]
  );

  const handleUserChat = (user) => selectUserChannel(user);

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
      } else {
        if (user.active !== 1) {
          return false;
        }
      }

      if (search !== "") {
        if (user.name.toLowerCase().search(search.toLowerCase()) === -1 && user.email.toLowerCase().search(search.toLowerCase()) === -1) return false;
      }

      return true;
    })
    .sort((a, b) => {
      return a.name.localeCompare(b.name);
    });

  const { _t } = useTranslation();

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
  };

  const handleInviteUsers = () => {
    let payload = {
      type: "driff_invite_users",
      hasLastName: true,
      invitations: [],
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

  const toaster = useToaster();

  const handleShowInactiveToggle = () => {
    setShowInactive((prevState) => {
      const newState = !prevState;

      if (newState) {
        toaster.success("Showing inactive members");
      } else {
        toaster.success("Showing active members only");
      }

      return newState;
    });
  };

  useEffect(() => {
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

  return (
    <Wrapper className={`workspace-people container-fluid h-100 ${className}`}>
      <div className="card">
        <div className="card-body">
          <div className="people-header">
            <div className="d-flex align-items-center people-search">
              <Search ref={refs.search} value={search} closeButton="true" onClickEmpty={emptySearchInput} placeholder="Search by name or email" onChange={handleSearchChange} autoFocus />
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
            </div>
            <div>
              <button className="btn btn-primary" onClick={handleInviteUsers}>
                <SvgIconFeather className="mr-2" icon="user-plus" /> Invite users
              </button>
            </div>
          </div>
          <div className="row">
            {userSort.map((user) => {
              return (
                <PeopleListItem
                  loggedUser={loggedUser}
                  key={user.id}
                  user={user}
                  onNameClick={handleUserNameClick}
                  onChatClick={handleUserChat}
                  dictionary={dictionary}
                  onUpdateRole={userActions.updateUserRole}
                  showOptions={loggedUser.role.name === "admin" || loggedUser.role.name === "owner"}
                  roles={roles}
                  onArchiveUser={handleArchiveUser}
                  onActivateUser={handleActivateUser}
                  onChangeUserType={userActions.updateType}
                  showInactive={showInactive}
                />
              );
            })}
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default React.memo(SystemPeoplePanel);
