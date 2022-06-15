import React, { useRef } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { Avatar, Badge, SvgIconFeather, ToolTip } from "../../../common";
import { MoreOptions } from "../../../panels/common";
import { copyTextToClipboard } from "../../../../helpers/commonFunctions";
import { useToaster } from "../../../hooks";
import { useHistory } from "react-router-dom";

const Wrapper = styled.div`
  .avatar {
    cursor: pointer;
    min-height: 2.7rem;
    min-width: 2.7rem;
  }
  .user-name {
    display: flex;
    cursor: pointer;
    flex-flow: row wrap;
  }
  .feather-message-circle {
    cursor: pointer;
    &:hover {
      color: ${({ theme }) => theme.colors.primary};
    }
  }
  > .col-12 {
    padding: 0;
  }
  .card.border {
    overflow: visible;
  }
  .people-text-truncate {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    //max-width: ${(props) => props.userNameMaxWidth}px;
  }
  .button-wrapper {
    display: inline-flex;
    justify-content: center;
    align-items: center;
  }
  .card-body {
    padding: 1rem !important;
    min-height: 115px;
    width: 100%;
    display: flex;
  }
`;

const StyledBadge = styled(Badge)`
  .badge {
    background: ${(props) => {
      switch (props.role) {
        case "APPROVER": {
          return "#00CDAC";
        }
        case "CLIENT": {
          return "#4DD091";
        }
        case "COMMUNICATION_LEAD": {
          return "#00B0BA";
        }
        case "DEVELOPER": {
          return "#0065A2";
        }
        case "DESIGNER": {
          return "#FF60A8";
        }
        case "FREELANCER": {
          return "#C05780";
        }
        case "SUPERVISOR": {
          return "#FC6238";
        }
        case "TEAM_LEAD": {
          return "#CFF800";
        }
        case "TECHNICAL_ADVISOR": {
          return "#FFA23A";
        }
        case "TECHNICAL_LEAD": {
          return "#6C88C4";
        }
        case "WATCHER": {
          return "#FFEC59";
        }
        default:
          return "#fb3";
      }
    }};
  }
`;

const WorkSpaceIcon = styled(SvgIconFeather)`
  cursor: pointer;
  transition: 0.3s ease;
  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const PeopleListItem = (props) => {
  const {
    className = "",
    loggedUser,
    onNameClick = null,
    onChatClick = null,
    user,
    dictionary,
    showOptions = false,
    onUpdateRole = null,
    //roles,
    onArchiveUser = null,
    onActivateUser = null,
    onChangeUserType = null,
    onDeleteUser = null,
    onResendInvite = null,
    onDeleteInvitedInternalUser = null,
    showInactive = false,
    showWorkspaceRole = false,
    usersWithoutActivity = [],
    onAddUserToTeam = null,
    onDeleteTeamMember = null,
    sharedUser = false,
    isSharedWorkspace = false,
  } = props;

  //const [userNameMaxWidth, setUserNameMaxWidth] = useState(320);
  const toaster = useToaster();
  const history = useHistory();
  const refs = {
    cardBody: useRef(null),
    content: useRef(null),
  };

  const notificationSettings = useSelector((state) => state.admin.notifications);
  const notificationsLoaded = useSelector((state) => state.admin.notificationsLoaded);

  const handleOnNameClick = () => {
    if (onNameClick) onNameClick(user);
  };

  const handleOnChatClick = () => {
    if (onChatClick) onChatClick(user);
  };

  const handleAssignAsAdmin = () => {
    let payload = {
      user_id: user.id,
      role_id: 1,
    };
    onUpdateRole(payload);
  };

  const handleAssignAsSupervisor = () => {
    let payload = {
      user_id: user.id,
      role_id: 2,
    };
    onUpdateRole(payload);
  };

  const handleAssignAsEmployee = () => {
    let payload = {
      user_id: user.id,
      role_id: 3,
    };
    onUpdateRole(payload);
  };

  const handleArchiveUser = () => {
    onArchiveUser(user);
  };

  const handleActivateDeactivateUser = () => {
    onActivateUser(user);
  };

  const roleDisplay = () => {
    switch (user.workspace_role) {
      case "ADVISOR": {
        return dictionary.roleAdvisor;
      }
      case "APPROVER": {
        return dictionary.roleApprover;
      }
      case "CLIENT": {
        return dictionary.roleClient;
      }
      case "COMMUNICATION_LEAD": {
        return dictionary.roleCommunicationLead;
      }
      case "DEVELOPER": {
        return dictionary.roleDeveloper;
      }
      case "DESIGNER": {
        return dictionary.roleDesigner;
      }
      case "FREELANCER": {
        return dictionary.roleFreelancer;
      }
      case "SUPERVISOR": {
        return dictionary.roleSupervisor;
      }
      case "TEAM_LEAD": {
        return dictionary.roleTeamLead;
      }
      case "TECHNICAL_ADVISOR": {
        return dictionary.roleTechnicalAdvisor;
      }
      case "TECHNICAL_LEAD": {
        return dictionary.roleTechnicalLead;
      }
      case "WATCHER": {
        return dictionary.roleWatcher;
      }
      default:
        return "";
    }
  };

  const handleChangeToInternal = () => {
    if (onChangeUserType) onChangeUserType(user, "internal");
  };

  const handleChangeToExternal = () => {
    if (onChangeUserType) onChangeUserType(user, "external");
  };

  const handleDeleteUser = () => {
    if (onDeleteUser) onDeleteUser(user);
  };

  const handleReinvite = () => {
    if (onResendInvite) onResendInvite(user);
  };

  const handleDeleteInvitedInternalUser = () => {
    if (onDeleteInvitedInternalUser) onDeleteInvitedInternalUser(user);
  };

  const handleSendInviteManually = () => {
    copyTextToClipboard(toaster, user.invite_link);
  };

  const handleAddUserToTeam = () => {
    if (onAddUserToTeam) onAddUserToTeam(user);
  };

  const handleRemoveTeamMember = () => {
    if (onDeleteTeamMember) onDeleteTeamMember(user);
  };

  const renderUserName = ({ user }) => {
    if (loggedUser.type === "external") {
      return <span className="mr-2">{user.name !== "" ? user.name : user.email}</span>;
    }
    return (
      <ToolTip content={user.email}>
        <span className="mr-2">{user.name !== "" ? user.name : user.email}</span>
      </ToolTip>
    );
  };

  const handleWorkspaceIconClick = () => {
    history.push(`/hub/search?user-id=${user.id}`);
  };

  return (
    <Wrapper className={`workspace-user-item-list col-lg-4 col-md-6 ${className}`}>
      <div className="col-12">
        <div className="card border" key={user.id}>
          <div className="card-body position-relative" ref={refs.cardBody}>
            <div ref={refs.content} className="d-flex align-items-center justify-content-between w-100">
              <div className="d-flex justify-content-start align-items-center">
                <Avatar
                  id={user.id}
                  name={user.name ? user.name : user.email}
                  hasAccepted={user.has_accepted}
                  // onClick={handleOnNameClick}
                  // noDefaultClick={true}
                  imageLink={user.profile_image_link}
                  //imageLink={user.profile_image_thumbnail_link ? user.profile_image_thumbnail_link : user.profile_image_link ? user.profile_image_link : ""}
                  showSlider={true}
                  sharedUser={sharedUser ? user : null}
                />
                <div className="user-info-wrapper ml-3">
                  {user.email !== "" && user.hasOwnProperty("has_accepted") && !user.has_accepted && user.type === "external" ? (
                    <h6 className="user-name mb-0">
                      {renderUserName({ user })}
                      {/* <Badge label={dictionary.peopleInvited} badgeClassName="badge badge-info text-white" /> */}
                      <Badge label={dictionary.invitedGuestBadge} badgeClassName="badge badge-info badge-external text-white" />
                      {user.active === 0 && <Badge label="Inactive" badgeClassName="badge badge-light text-white" />}
                    </h6>
                  ) : (
                    <h6 className="user-name mb-0" onClick={handleOnNameClick}>
                      <div className="mr-2 d-flex">
                        {renderUserName({ user })}
                        {user.hasOwnProperty("has_accepted") && !user.has_accepted && user.active ? <Badge label={dictionary.invitedGuestBadge} badgeClassName="badge badge-info badge-external text-white" /> : null}
                        {user.role && user.role.id === 1 && (
                          <ToolTip content={dictionary.thisIsAnAdminAccount}>
                            <SvgIconFeather icon="settings" className="ml-1" width={10} height={10} />
                          </ToolTip>
                        )}
                      </div>

                      <span className="label-wrapper d-inline-flex start align-items-center">
                        {user.type === "external" && loggedUser.type !== "external" && <Badge label={dictionary.guestBadge} badgeClassName="badge badge-info badge-external text-white" />}
                        {isSharedWorkspace && user.is_creator && <StyledBadge role={user.workspace_role} badgeClassName={"text-dark"} label={dictionary.roleTeamLead} />}
                        {user.type === "external" && loggedUser.type !== "external" && user.has_accepted && <Badge badgeClassName="badge-info text-white" label={dictionary.peopleExternal} />}
                        {user.active === 0 && <Badge label="Inactive" badgeClassName="badge badge-light text-white" />}
                        {showWorkspaceRole && user.workspace_role && user.workspace_role !== "" && (
                          <StyledBadge role={user.workspace_role} badgeClassName={user.workspace_role === "WATCHER" || user.workspace_role === "TEAM_LEAD" ? "text-dark" : "text-white"} label={roleDisplay()} />
                        )}
                      </span>
                    </h6>
                  )}

                  {user.role && user.type === "internal" && <span className="small text-muted">{user.role.display_name}</span>}
                  {user.external_company_name && user.type === "external" && <span className="small text-muted">{user.external_company_name}</span>}
                  {user.invited_by && (
                    <div>
                      <span className="small text-muted">
                        Invited by: {user.invited_by.first_name} {user.invited_by.last_name}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              {onChatClick !== null && loggedUser.type !== "external" && (
                <div className="button-wrapper">
                  {user.has_accepted && !sharedUser && (
                    <ToolTip content={dictionary.connectedWorkspaceIcon}>
                      <WorkSpaceIcon className="mr-2" icon="compass" onClick={handleWorkspaceIconClick} />
                    </ToolTip>
                  )}
                  {user.contact && user.contact !== "" && loggedUser.id !== user.id && (
                    <ToolTip content={dictionary.phoneIcon}>
                      <a href={`tel:${user.contact.replace(/ /g, "").replace(/-/g, "")}`}>
                        <SvgIconFeather className="mr-2" icon="phone" />
                      </a>
                    </ToolTip>
                  )}
                  {loggedUser.id !== user.id && user.active === 1 && user.type !== "external" && !sharedUser && (
                    <ToolTip content={dictionary.messageIcon}>
                      <SvgIconFeather onClick={handleOnChatClick} icon="message-circle" />
                    </ToolTip>
                  )}
                  {showOptions && loggedUser.id !== user.id && (
                    <MoreOptions className="ml-2" width={240} moreButton={"more-horizontal"} scrollRef={refs.cardBody.current}>
                      {!showInactive && user.type === "internal" && user.role && user.role.id !== 1 && user.hasOwnProperty("has_accepted") && user.has_accepted && <div onClick={handleAssignAsAdmin}>{dictionary.assignAsAdmin}</div>}
                      {!showInactive && user.type === "internal" && user.role && user.role.id !== 2 && user.hasOwnProperty("has_accepted") && user.has_accepted && (
                        <div onClick={handleAssignAsSupervisor}>{dictionary.assignAsSupervisor}</div>
                      )}
                      {!showInactive && user.type === "internal" && user.role && user.role.id !== 3 && user.hasOwnProperty("has_accepted") && user.has_accepted && <div onClick={handleAssignAsEmployee}>{dictionary.assignAsEmployee}</div>}
                      {!showInactive && user.type === "external" && <div onClick={handleChangeToInternal}>{dictionary.moveToInternal}</div>}
                      {!showInactive && user.type === "internal" && <div onClick={handleChangeToExternal}>{dictionary.moveToExternal}</div>}
                      {showInactive && user.active === 0 && !user.deactivate ? <div onClick={handleArchiveUser}>{dictionary.unarchiveUser}</div> : null}
                      {user.active && user.hasOwnProperty("has_accepted") && user.has_accepted ? <div onClick={handleArchiveUser}>{dictionary.archiveUser}</div> : null}
                      {!user.deactivate && user.active && user.hasOwnProperty("has_accepted") && user.has_accepted ? <div onClick={handleActivateDeactivateUser}>{dictionary.deactivateUser}</div> : null}
                      {showInactive && user.deactivate && user.active === 0 && user.hasOwnProperty("has_accepted") && user.has_accepted ? <div onClick={handleActivateDeactivateUser}>{dictionary.activateUser}</div> : null}
                      {(!showInactive && user.active && user.hasOwnProperty("has_accepted") && user.has_accepted && usersWithoutActivity.some((u) => u.user_id === user.id) && onDeleteUser) ||
                      (user.hasOwnProperty("has_accepted") && !user.has_accepted && user.type === "external") ? (
                        <div onClick={handleDeleteUser}>{dictionary.deleteUser}</div>
                      ) : null}
                      {!showInactive && user.hasOwnProperty("has_accepted") && !user.has_accepted && notificationsLoaded && notificationSettings.email && <div onClick={handleReinvite}>{dictionary.resendInvitation}</div>}
                      {!showInactive && user.hasOwnProperty("has_accepted") && !user.has_accepted && user.type === "internal" && <div onClick={handleDeleteInvitedInternalUser}>{dictionary.removeInvitedInternal}</div>}
                      {!showInactive && user.hasOwnProperty("has_accepted") && !user.has_accepted && user.type === "internal" && <div onClick={handleSendInviteManually}>{dictionary.sendInviteManually}</div>}
                      {!showInactive && user.type === "internal" && <div onClick={handleAddUserToTeam}>{dictionary.addUserToTeam}</div>}
                      {onDeleteTeamMember && <div onClick={handleRemoveTeamMember}>{dictionary.removeTeamMember}</div>}
                    </MoreOptions>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default React.memo(PeopleListItem);
