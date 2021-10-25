import React from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { SvgIconFeather } from "../../common";
import { useUserActions, useToaster } from "../../hooks";
import { addToModals } from "../../../redux/actions/globalActions";

const Wrapper = styled.li`
  @media (max-width: 414px) {
    display: none;
  }
  @media (max-width: 700px) {
    position: absolute;
    right: 100px;
    top: 10px;
  }
`;
const AllPeopleHeaderButtons = (props) => {
  const { dictionary } = props;

  const loggedUser = useSelector((state) => state.session.user);
  const users = useSelector((state) => state.users.users);

  const userActions = useUserActions();
  const toaster = useToaster();
  const dispatch = useDispatch();

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

  const isAdmin = loggedUser.role.name === "admin" || loggedUser.role.name === "owner";

  return (
    <Wrapper className="nav-item-last ml-auto">
      {isAdmin && (
        <button className="btn btn-primary mr-2" onClick={handleAddTeam}>
          <SvgIconFeather className="mr-2" icon="user-plus" /> {dictionary.btnTeam}
        </button>
      )}

      <button className="btn btn-primary" onClick={handleInviteUsers}>
        <SvgIconFeather className="mr-2" icon="user-plus" /> {dictionary.btnInviteUsers}
      </button>
    </Wrapper>
  );
};
export default AllPeopleHeaderButtons;