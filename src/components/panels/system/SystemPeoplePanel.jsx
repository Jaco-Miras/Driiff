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

  const { userActions, loggedUser, selectUserChannel } = useUserChannels();
  const roles = useSelector((state) => state.users.roles);
  const users = useSelector((state) => state.global.recipients).filter((r) => r.type === "USER");

  const history = useHistory();
  const dispatch = useDispatch();

  const [search, setSearch] = useState("");
  const [showInactive, setShowInactive] = useState(false);

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
      history.push(`/profile/${user.id}/${user.name}`);
    },
    [history]
  );

  const handleUserChat = useCallback(
    (user) => {
      selectUserChannel(user, (channel) => {
        history.push(`/chat/${channel.code}`);
      });
    },
    [history, selectUserChannel]
  );

  const userSort = Object.values(users)
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
    if (Object.keys(roles).length == 0) {
      userActions.fetchRoles();
    }
  }, []);

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
                label={<span>Show inactive me</span>}
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
                  user={{ ...user, id: user.type_id }}
                  onNameClick={handleUserNameClick}
                  onChatClick={handleUserChat}
                  dictionary={dictionary}
                  onUpdateRole={userActions.updateUserRole}
                  showOptions={loggedUser.role.name === "admin" || loggedUser.role.name === "owner"}
                  roles={roles}
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
