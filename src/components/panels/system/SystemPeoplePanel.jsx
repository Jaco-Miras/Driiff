import React, {useCallback, useEffect, useRef, useState} from "react";
import {useHistory} from "react-router-dom";
import styled from "styled-components";
import SearchForm from "../../forms/SearchForm";
import {useToaster, useTranslation, useUserChannels} from "../../hooks";
import {PeopleListItem} from "../../list/people/item";
import {SvgIconFeather} from "../../common";
import {addToModals} from "../../../redux/actions/globalActions";
import {useDispatch} from "react-redux";
import {CustomInput} from "reactstrap";

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
`;

const Search = styled(SearchForm)`
  max-width: 350px;
  margin-bottom: 1rem;
`;

const SystemPeoplePanel = (props) => {
  const {className = ""} = props;

  const {users, userActions, loggedUser, userChannels, selectUserChannel} = useUserChannels();

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
    .sort((a, b) => {
      return a.name.localeCompare(b.name);
    })
    .filter((user) => {
      if (!userChannels.hasOwnProperty(user.id)) return false;

      if (!showInactive && user.active !== 1) return false;

      if (search !== "") {
        return user.name.toLowerCase().indexOf(search.toLowerCase()) > -1;
      }

      return true;
    });

  const {_t} = useTranslation();

  const dictionary = {
    searchPeoplePlaceholder: _t("PLACEHOLDER.SEARCH_PEOPLE", "Search people"),
    peopleExternal: _t("PEOPLE.EXTERNAL", "External"),
    peopleInvited: _t("PEOPLE.INVITED", "Invited"),
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
          if (!Object.values(users).some(user => user.email === u.email)) {
            userActions.inviteAsInternalUsers({
              "email": u.email,
              "first_name": u.first_name,
              "last_name": u.last_name,
            }, (err, res) => {
              if (err) {
                toaster.error(`Something went wrong with ${u.first_name} ${u.last_name}`);
                options.deleteItemByIndex(options.invitationItems.findIndex(i => i.email === u.email));
              }
              if (res) {
                processed += 1;
                options.deleteItemByIndex(options.invitationItems.findIndex(i => i.email === u.email));
                toaster.success(`You have invited ${u.first_name} ${u.last_name}`);
              }

              //last iteration
              if (i === (invitedUsers.length - 1)) {
                if (processed === invitedUsers.length) {
                  options.closeModal();
                }

                callback();
              }
            })
          } else {
            toaster.error(<>Email <b>{u.email}</b> is already taken!</>);

            //last iteration
            if (i === (invitedUsers.length - 1)) {
              if (processed === invitedUsers.length) {
                options.closeModal();
              }

              callback();
            }
          }
        })
      },
    };

    dispatch(addToModals(payload));
  }

  const toaster = useToaster();

  const handleShowInactiveToggle = () => {
    setShowInactive(prevState => {
      const newState = !prevState;

      if (newState) {
        toaster.success('Showing inactive members');
      } else {
        toaster.success('Showing active members only');
      }

      return newState;
    });
  }

  useEffect(() => {
    refs.search.current.focus();
  }, []);

  return (
    <Wrapper className={`workspace-people container-fluid h-100 ${className}`}>
      <div className="card">
        <div className="card-body">
          <div className="people-header">
            <div className="d-flex align-items-center">
              <Search ref={refs.search} value={search} closeButton="true" onClickEmpty={emptySearchInput}
                      placeholder="People search" onChange={handleSearchChange} autoFocus/>
              <CustomInput
                className="ml-2 mb-3 cursor-pointer text-muted cursor-pointer"
                checked={showInactive}
                type="switch"
                id="chat_sound_enabled"
                name="sound_enabled"
                onChange={handleShowInactiveToggle}
                data-success-message={`${showInactive ? "Inactive users are shown" : "Inactive users are no longer visible"}`}
                label={<span>Show inactive members</span>}
              />
            </div>
            <div>
              <button className="btn btn-primary" onClick={handleInviteUsers}>
                <SvgIconFeather className="mr-2" icon="user-plus"/> Invite users
              </button>
            </div>
          </div>
          <div className="row">
            {userSort.map((user) => {
              return <PeopleListItem
                loggedUser={loggedUser} key={user.id} user={user} onNameClick={handleUserNameClick}
                onChatClick={handleUserChat} dictionary={dictionary}/>;
            })}
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default React.memo(SystemPeoplePanel);
