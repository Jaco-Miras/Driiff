import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { Avatar, Badge, SvgIconFeather, ToolTip } from "../../../common";
import { MoreOptions } from "../../../panels/common";

const Wrapper = styled.div`
  .avatar {
    cursor: pointer;
    // height: 2.5rem !important;
    // width: 2.5rem !important;
  }
  .user-name {
    display: flex;
    cursor: pointer;
  }
  .feather-message-circle {
    cursor: pointer;
    &:hover {
      color: #7a1b8b;
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
    max-width: ${(props) => props.userNameMaxWidth}px;
  }
  .button-wrapper {
    display: inline-flex;
    justify-content: center;
    align-items: center;
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
    roles,
    onArchiveUser = null,
    onActivateUser = null,
    onChangeUserType = null,
    showInactive = false,
    showWorkspaceRole = false,
  } = props;

  const [userNameMaxWidth, setUserNameMaxWidth] = useState(320);

  const refs = {
    cardBody: useRef(null),
    content: useRef(null),
  };

  const handleOnNameClick = () => {
    if (onNameClick) onNameClick(user);
  };

  const handleOnChatClick = () => {
    if (onChatClick) onChatClick(user);
  };

  const handleUpdateRole = (role) => {
    let payload = {
      user_id: user.id,
      role_id: roles[role],
    };
    onUpdateRole(payload);
  };

  const handleResize = () => {
    if (refs.content.current) {
      let width = refs.content.current.clientWidth - 150;

      let el = refs.content.current.querySelector(".button-wrapper");
      if (el) {
        width -= el.clientWidth;
      }

      el = refs.content.current.querySelector(".avatar");
      if (el) {
        width -= el.clientWidth;
      }

      el = refs.content.current.querySelector(".label-wrapper");
      if (el) {
        width -= el.clientWidth;
      }

      setUserNameMaxWidth(width);
    }
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  return (
    <Wrapper className={`workspace-user-item-list col-12 col-md-6 ${className}`} userNameMaxWidth={userNameMaxWidth}>
      <div className="col-12">
        <div className="card border" key={user.id}>
          <div className="card-body" ref={refs.cardBody}>
            <div ref={refs.content} className="d-flex align-items-center justify-content-between">
              <div className="d-flex justify-content-start align-items-center">
                <Avatar
                  id={user.id}
                  name={user.name ? user.name : user.email}
                  hasAccepted={user.has_accepted}
                  // onClick={handleOnNameClick}
                  // noDefaultClick={true}
                  imageLink={user.profile_image_thumbnail_link ? user.profile_image_thumbnail_link : user.profile_image_link ? user.profile_image_link : ""}
                  showSlider={true}
                />
                <div className="user-info-wrapper ml-3">
                  {user.email !== "" && user.hasOwnProperty("has_accepted") && !user.has_accepted && user.type === "external" ? (
                    <h6 className="user-name mb-1 ">
                      <ToolTip content={user.email}>
                        <div className="mr-2 people-text-truncate">{user.email}</div>
                      </ToolTip>
                      <Badge label={dictionary.peopleInvited} badgeClassName="badge badge-info text-white" />
                      <Badge label={dictionary.peopleExternal} badgeClassName="badge badge-info text-white" />
                    </h6>
                  ) : (
                    <h6 className="user-name mb-1 " onClick={handleOnNameClick}>
                      <div className="mr-2 d-flex">
                        <ToolTip content={user.email}>
                          <span>{user.name}</span>
                        </ToolTip>
                        {user.role && (user.role.name === "owner" || user.role.name === "admin") && (
                          <ToolTip content={"This is an administrator account"}>
                            <SvgIconFeather icon="settings" className="ml-1" width={10} height={10} />
                          </ToolTip>
                        )}
                      </div>

                      <span className="label-wrapper d-inline-flex start align-items-center">
                        {user.type === "external" && loggedUser.type !== "external" && <Badge label={dictionary.peopleExternal} badgeClassName="badge badge-info text-white" />}
                        {user.active === 0 && <Badge label="Inactive" badgeClassName="badge badge-light text-white" />}
                        {showWorkspaceRole && user.workspace_role && user.workspace_role !== "" && (
                          <StyledBadge role={user.workspace_role} badgeClassName={user.workspace_role === "WATCHER" || user.workspace_role === "TEAM_LEAD" ? "text-dark" : "text-white"} label={roleDisplay()} />
                        )}
                      </span>
                    </h6>
                  )}

                  {user.role && user.type === "internal" && <span className="small text-muted">{user.role.display_name}</span>}
                  {user.external_company_name && user.type === "external" && <span className="small text-muted">{user.external_company_name}</span>}
                </div>
              </div>
              {onChatClick !== null && loggedUser.type !== "external" && (
                <div className="button-wrapper">
                  {user.contact && user.contact !== "" && loggedUser.id !== user.id && (
                    <a href={`tel:${user.contact.replace(/ /g, "").replace(/-/g, "")}`}>
                      <SvgIconFeather className="mr-2" icon="phone" />
                    </a>
                  )}
                  {loggedUser.id !== user.id && user.active === 1 && <SvgIconFeather onClick={handleOnChatClick} icon="message-circle" />}
                  {showOptions && loggedUser.id !== user.id && (
                    <MoreOptions className="ml-2" width={240} moreButton={"more-horizontal"} scrollRef={refs.cardBody.current}>
                      {!showInactive && user.type === "internal" && user.role && user.role.name === "employee" && <div onClick={() => handleUpdateRole("admin")}>{dictionary.assignAsAdmin}</div>}
                      {!showInactive && user.type === "internal" && user.role && user.role.name === "admin" && <div onClick={() => handleUpdateRole("employee")}>{dictionary.assignAsEmployee}</div>}
                      {!showInactive && user.type === "external" && <div onClick={handleChangeToInternal}>{dictionary.moveToInternal}</div>}
                      {!showInactive && user.type === "internal" && <div onClick={handleChangeToExternal}>{dictionary.moveToExternal}</div>}
                      {/* <div onClick={handleArchiveUser}>{user.active ? dictionary.archiveUser : dictionary.unarchiveUser}</div> */}
                      {showInactive && user.active === 0 && !user.deactivate ? <div onClick={handleArchiveUser}>{dictionary.unarchiveUser}</div> : null}
                      {user.active ? <div onClick={handleArchiveUser}>{dictionary.archiveUser}</div> : null}
                      {!user.deactivate && user.active ? <div onClick={handleActivateDeactivateUser}>{dictionary.deactivateUser}</div> : null}
                      {user.deactivate && user.active === 0 ? <div onClick={handleActivateDeactivateUser}>{dictionary.activateUser}</div> : null}
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
